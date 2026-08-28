# Trentino link fixes + recipe export & sharing

## 1. Link corrections

Four link swaps, all in the `trentino-alto-adige` region record:

- Schlutzkrapfen card → https://www.dolomitemountains.com/blog/dolomites-cuisine/dolomites-recipe-schlutzkrapfen/
- Puzzone di Moena card → https://www.puzzonedop.it/en/ (replaces the dead `puzzonedimoenadop.it`)
- Zelten / Christmas markets card → https://www.suedtirolerland.it/en/leisure-activities/top-events-in-south-tyrol/christmas-markets/
- Recipes: Farina di Storo link → https://www.campigliodolomiti.it/en/trentino-typical-products/storo-yellow-flour

Link labels get updated to match the new destinations where the old label no longer describes the page.

## 2. Recipe export

Each recipe card gets an "Export" control offering:

- **Recipe file (.json, schema.org format)** — the format Paprika, Mela, AnyList, Copy Me That and most recipe managers accept as an import.
- **Plain text (.txt)** — title, servings, time, ingredients, steps, wine pairing, source link. Works everywhere, easy to paste into Notes or email.
- **Print / Save as PDF** — a clean print stylesheet so the browser print dialog produces a one-page recipe card without site chrome.

In addition, each recipe is emitted as schema.org `Recipe` JSON-LD in the page head, so "clip from URL" in recipe apps and Google's recipe rich results both pick it up without the user downloading anything.

## 3. Recipe sharing

A share row per recipe with:

- Native share sheet on mobile (Web Share API) where supported.
- Facebook, X, WhatsApp, Pinterest (image-based, well suited to recipes), and email fallbacks.
- "Copy link" that copies a deep link to that specific recipe.

Deep links use a per-recipe anchor (`/trentino-alto-adige#recipe-canederli`), and opening such a URL scrolls to and expands that recipe.

## Technical notes

- Link changes: SQL update to `region_data` on the `trentino-alto-adige` row — no schema or component change.
- Export/share is built once inside `src/components/sections/RecipesInteractive.tsx` (plus a small `recipeExport.ts` helper for the schema.org mapping and file download), so every region's recipes get it automatically.
- Downloads are generated client-side via Blob URLs — no backend, no new dependency.
- JSON-LD is injected per recipe from the same mapping function used for the `.json` export, keeping one source of truth.
- Print styling is scoped with a `print:` Tailwind variant on the expanded recipe panel.
- Components stay defensive: export/share render only when the recipe has a title and at least ingredients or steps.
