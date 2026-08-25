# Fix social preview image for /lazio (and every region)

## What I found

The crawler-facing page is not using the Lazio data at all. Fetching `https://italy.caesartheday.com/lazio` with a Facebook crawler user-agent returns the **default** tags:

- title: "Veni. Vidi. Vici. | Caesar the Day"
- og:image: `https://italy.caesartheday.com/og-veni-vidi-vici-2.jpg`

The same happens for molise, calabria and piemonte — so this is not Lazio-specific.

Meanwhile the stored data is fine:
- The Lazio row exists with title "Veni. Vidi. Vici. | Lazio: Retire in Rome, the Hills, or the Lakes" and image `.../og-images/lazio-og.jpg`.
- That image URL returns HTTP 200, `image/jpeg`, publicly fetchable, 1600x840 px, 1.9 MB.

So the image is available; the crawler HTML never references it. The crawler handler (`api/og.ts`) reads its backend URL/key from `process.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`. On the hosting side those `VITE_`-prefixed values are build-time client vars and are not guaranteed to be present in the edge runtime — when they're missing the handler silently returns the default metadata, exactly what we observe.

## Fix

1. **Make `api/og.ts` resilient about config**
   - Read from several env names (`VITE_SUPABASE_URL`, `SUPABASE_URL`, plus the publishable/anon key equivalents) and fall back to the project's public URL + publishable key constants. These are public, browser-safe values already shipped in the client bundle, so embedding them in the crawler handler leaks nothing.
   - Add a `?debug=1` mode that reports whether config was resolved and whether the row was found, so this is diagnosable without guessing.
2. **Declare correct image dimensions** — the handler hardcodes 1200x630 while the Lazio file is 1600x840. Emit the real ratio (or drop the width/height tags) so Facebook doesn't reject the mismatch.
3. **Trim image weight (optional but recommended)** — 1.9 MB is heavy for a preview; re-export Lazio at 1200x630 under a new filename and point the record at it (renaming also busts CDN caches).
4. **Verify** — after deploy, re-fetch `/lazio` with a Facebook user-agent and confirm the Lazio title/description/image appear, then re-scrape in the Facebook debugger (previews stay cached until re-scraped).

## Note

Vercel env vars can't be set from here. If step 1's fallback still doesn't resolve the record after deploy, the `?debug=1` output will say why and the next step would be adding `SUPABASE_URL` / key in the hosting project settings.
