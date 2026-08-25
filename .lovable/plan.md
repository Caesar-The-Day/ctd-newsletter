# Automatic OG tags + OG image for every region

## Current state (verified)

All eight regions in the database (piemonte, lombardia, veneto, puglia, umbria, calabria, molise, lazio) already have an OG row with a title, a description, and an image URL — so nothing is missing right now. But every one of those rows was created by hand in the OG manager. Region creation and publishing do not touch OG metadata at all, so the next region you scaffold will ship with the generic site-wide fallback preview until someone remembers to open the OG tab.

## What to build

Make OG metadata a normal part of the region lifecycle instead of a separate manual chore.

**1. On region creation (wizard finish)**
Right after the new region row is saved, also create its OG row automatically:
- Title: built from the region's own headline, e.g. `Veni. Vidi. Vici. | <Region>: <tagline>`.
- Description: the region's intro/tagline copy trimmed to ~155 characters, ending on a whole sentence.
- Image: the region's hero image, copied into the OG image bucket as a proper 1200x630 preview (centre-cropped and compressed in the browser before upload, same shape as the Lazio v2 image).
If the hero image isn't generated yet, the row is still created with title + description and the image fills in later (see step 2).

**2. On publish**
Publishing re-checks the OG row: creates it if missing, and refreshes the OG image from the current hero if the row has no image or still points at a hero that has since been replaced. Title and description you edited by hand are never overwritten.

**3. In the OG manager**
- Each region card gets a "Regenerate from region" button that redoes the automatic title / description / 1200x630 image from current region content, so you can refresh without re-uploading files.
- A banner at the top lists any region that has no OG row or no OG image, with a one-click "Generate" for each — this is the backfill path for anything created before this change.
- Uploads (manual and automatic) go through the same 1200x630 resize step, so no more 1.9 MB oversized previews.

## Technical notes

- New shared helper `src/utils/ogMetadata.ts`: `buildOgCopy(regionData)` (title + description), `renderOgImage(sourceUrl)` (canvas centre-crop to 1200x630, JPEG ~80% quality), and `ensureRegionOg(slug, regionData, { refreshImage })` which upserts into `region_og_metadata` on `region_slug` and uploads to the `og-images` bucket as `<slug>-og.jpg`.
- Call `ensureRegionOg` from `handleWizardComplete` in `src/pages/AdminRegions.tsx` after the region insert, and from `handlePublishRegion` after a successful publish. Failures are non-fatal: the region still saves, with a warning toast.
- Requires a unique constraint on `region_og_metadata.region_slug` so upsert is safe (migration). Existing rows are already unique per slug.
- `OGImageManager.tsx` gains the regenerate button, the missing-OG banner, and routes its file input through `renderOgImage`.
- Cache busting: uploaded OG files use a content-hash suffix (`<slug>-og-<hash>.jpg`) so a refreshed preview never serves a stale CDN copy.
- No change needed in `api/og.ts` — it already reads whatever the row holds.
