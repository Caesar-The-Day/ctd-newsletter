# Sourced Town Photos (No More Manual Uploads)

Goal: stop hand-uploading town photos and stop generating them with AI. Instead, pull real, freely-licensed photographs of each town from Wikimedia Commons, save them locally, and wire them into the region data automatically.

## Why Wikimedia Commons

- Real photographs of the actual towns — accuracy is the whole point here.
- Licences are explicit (CC BY / CC BY-SA / public domain) and machine-readable, so attribution can be captured at download time.
- Every Italian comune has a Commons category, usually with a "quality" lead image already chosen.
- Images get downloaded and stored in `public/images/<region>/`, never hotlinked — this keeps the existing rule about hosting all assets locally (external URLs break due to CORS).

## How it will work

1. **A reusable sourcing script** (run by me, not shipped to users): give it a region slug plus a list of town names. For each town it:
   - Resolves the town's Wikipedia/Commons entry (Italian and German names both, which matters in Alto Adige).
   - Picks the best landscape-orientation candidate: the page's lead image first, then the highest-resolution wide shot in the town category, skipping maps, coats of arms, logos and interiors.
   - Downloads at ~1600px wide, converts to optimised JPG/WebP, writes to `public/images/<region>/<town-slug>.jpg`.
   - Records photographer, licence and source URL.
2. **Attribution file**: `public/data/regions/italy/<region>-photo-credits.json` holds one entry per image (town, author, licence, source link). CC BY-SA requires credit, so this is not optional.
3. **Credits surfaced in the UI**: a compact "Photography credits" line/expandable list in the footer area of the region page, linking each photo to its Commons source.
4. **Wire-up**: the script updates the town records (featured + grid) in the region's data with the new local `photo` paths, so no manual JSON editing.
5. **Review pass**: I show you a contact sheet of the sourced images before they go live; anything that's a bad crop or the wrong subject gets swapped for the next candidate or flagged for you to upload manually.

## First run

Apply to Trentino-Alto Adige (featured towns + the 12-town grid, which currently has no photos), then backfill any other region with missing or AI-generated town shots on request.

## Fallbacks

- No usable Commons image for a town: the script reports it rather than silently substituting. Options then are your own upload, or swapping the town for one with coverage.
- Existing hand-uploaded photos are left untouched unless you ask for a replacement.

## Technical notes

- Script lives at `scripts/source-town-photos.ts`, run via `bun`, using the Commons `action=query` API (`pageimages`, `imageinfo` with `extmetadata` for licence data). No API key needed; a descriptive User-Agent is set as Wikimedia requires.
- Image processing via `sharp`: resize to 1600px wide, strip EXIF, quality ~82.
- Only files with CC0 / PD / CC BY / CC BY-SA licences are accepted; anything non-free or unknown is rejected.
