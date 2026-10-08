# One address per newsletter PDF: /regions/newsletters/

## What's happening
- The 6 PDFs live in one folder in the project. The build already publishes them only at `/regions/newsletters/<file>.pdf`.
- Search-engine pages and the archive list still link to `/newsletters/<file>.pdf`, so Google sees two addresses for each PDF.

## Changes
1. **Server 301 redirect.** Our live host is Vercel, so this goes in `vercel.json`. Any `/newsletters/<anything>.pdf` request permanently redirects to `/regions/newsletters/<same file>.pdf`. The rule sits at the top, before the other routes. No client-side route is needed.
2. **Update every link.** Change all six archive `downloadUrl` values in `public/data/newsletter-index.json` from `/newsletters/...` to `/regions/newsletters/...`. This fixes both the homepage archive cards and the search-engine version of the homepage (`api/render.ts` reads the same file).
3. **The link helper won't double the prefix.** `src/lib/basePath.ts` already leaves links that start with `/regions/` alone, so the new links stay as written. No change is needed there.
4. **Sitemap:** PDFs aren't in it now, and none will be added.

## Note on the file location you asked for
Everything in the project's `public/` folder is already published under `/regions/`. If the PDFs moved to `public/regions/newsletters/`, they would end up at `/regions/regions/newsletters/` and break. So the files stay in `public/newsletters/`, which publishes only to `/regions/newsletters/`. No duplicate copies exist to delete.

## Check
- Search the code again: no link to a bare `/newsletters/` path is left.
- In the preview, the archive PDF links open from `/regions/newsletters/...`.
- After you redeploy on Vercel, `italy.caesartheday.com/newsletters/sicilia-july-2025.pdf` returns a 301 to the `/regions/` address.

## Files changed
- `vercel.json`
- `public/data/newsletter-index.json`
- `AGENTS.md` (one line on where the PDFs live)
