# Validate every image path, everywhere

Broken photos on the live site come from image paths that exist in code or in the database but not as real files in `public/`. Today nothing checks that. This plan adds a single audit that covers both sources, fixes what it finds, and wires it into the build so a broken path can't ship again.

## What the audit already found

A one-off scan of the current project turned up real gaps:

**Missing files referenced by the database (region content):**
- Calabria: `gerace.jpg`, `scilla.jpg`, `tropea.jpg`
- Molise: `agnone.jpg`, `campobasso.jpg`, `termoli.jpg`
- Umbria: `gubbio.jpg`, `orvieto.jpg`, `terni.jpg`, `ambient.mp3`

**Missing files referenced by code / static JSON:**
- `/images/logo.svg`, `/images/marker-icon.png`, `/images/marker-icon-2x.png`, `/images/marker-shadow.png`
- `/images/piemonte/cafe-language.jpg`, `/images/shared/cafe-language.jpg`, `/images/piemonte/ambient.mp3`
- `/images/umbria/seasonal-backgrounds/{spring,summer,autumn,winter}-landscape.jpg`
- `/images/liguria/marina-aregai.jpg`

Good news: no `/__l5e/` CDN paths remain anywhere in code or in region data — that class of bug is already cleared.

## Plan

### 1. Build the validator
A script at `scripts/validate-images.ts` that:
- Extracts every `/images/...` path from `src/**`, `public/data/**`, `index.html`, and from the `regions` + `region_og_metadata` tables in the database.
- Ignores dynamically-composed fragments (paths ending in `/` or with no file extension, which come from template literals like `` `/images/${slug}/...` ``) and reports them separately as "unverifiable — review manually".
- Flags three failure classes: (a) file missing from `public/`, (b) any `/__l5e/` CDN path, (c) absolute `http(s)` image URLs pointing at non-approved hosts (CORS/hotlink risk per the project rule that images are hosted locally).
- Prints a grouped report and exits non-zero on any failure.

### 2. Fix the current failures
- Source real photos for the missing town images (Calabria, Molise, Umbria) using the existing `scripts/source-town-photos.ts` Wikimedia pipeline, and write them to the expected paths.
- For the remaining orphans (`logo.svg`, Leaflet marker icons, `cafe-language.jpg`, Umbria seasonal backgrounds, `marina-aregai.jpg`, ambient audio), determine per file whether the reference is dead code or a genuinely missing asset: remove or repoint dead references, supply the asset where the UI actually needs it.
- Re-run the validator until it's clean.

### 3. Make it permanent
- Wire the validator into the build so a missing image fails the build instead of shipping.
- Add the same check to the region-publish path in the admin UI: before a region can be set to `published`, validate the image paths in its `region_data` and block publish with a list of the offending paths.
- Extend `_template.json` guidance so newly scaffolded regions declare image paths in the conventional `/images/{slug}/...` form the validator understands.

## Technical notes

- The validator reads the database through the existing Supabase client with the anon key (region data is publicly readable), so it runs in CI without extra secrets.
- Dynamic path fragments are intentionally not treated as errors — the report surfaces them so a human can spot-check, but they won't block a build.
- No schema changes. Publish-time validation runs client-side in the admin before the status update call.
