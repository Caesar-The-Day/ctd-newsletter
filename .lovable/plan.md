# Crawler follow-up: older regions, new description, tracked links

## 1. Older regions fall back to their saved guide files
Piemonte, Puglia, Lombardia and Veneto are live but have no content stored in the database. All four have saved guide files on the site.

- Add a loader to the shared crawler helpers. It tries `https://italy.caesartheday.com/data/regions/italy/{slug}.json` first, then `/data/{slug}.json`. It returns null if neither loads.
- In the region page renderer: if a region's stored content is missing or empty, use the file instead. All existing sections (intro, where tabs, towns, cost table, hospitals, pros/cons, verdict) then render from it unchanged.
- On the homepage list, apply the same fallback to the per-region title and tagline (loaded in parallel, only for regions with empty content).
- Regions that have stored content (Liguria and the rest) are not touched.

## 2. New default description
Replace the old "cultural secrets / cultural insights" wording with:
"Region-by-region guides to retiring in Italy: towns worth living in, real monthly costs, healthcare access and honest tradeoffs."

Places to update:
- the crawler default description
- the homepage's description, og:description and twitter:description in `index.html`
- the homepage description, ogDescription and structured-data description on the newsletter index page

## 3. Tracked "Plan your move" links
Every link in the crawler's "Plan your move" block gets `?utm_source=veni-vidi-vici&utm_medium=referral&utm_campaign={slug}`. The homepage uses `home` as the campaign. Covers Visto Facile, consultation, book and the 7% explorer.

## Verification (run the handlers locally)
- `/puglia` contains "Lecce", "Locorotondo" and the cost table.
- `/piemonte`, `/lombardia` and `/veneto` each contain town names and a cost table.
- `/liguria` output is identical apart from the new utm links and description (compare against a saved copy taken before the change).
- Plan-your-move links carry the utm parameters; the old description text appears nowhere.

## Technical notes
- Files: `api/_lib/site.ts` (DEFAULT_DESCRIPTION, `loadStaticRegion`), `api/render.ts` (fallback + `ctaLinks(slug)` utm), `index.html`, `src/pages/NewsletterIndex.tsx`.
- "Empty" means null, or an object with no `region`/`towns` keys.
- The static fetch uses the edge cache (`s-maxage` already set on responses) and has no auth.
