## Goal

Switch the canonical site domain from `news.caesartheday.com` to `italy.caesartheday.com` everywhere it's referenced, and ensure Calabria's social/OG metadata uses `https://italy.caesartheday.com/calabria`.

## Changes

### 1. Codebase domain swap (`news.caesartheday.com` → `italy.caesartheday.com`)

Replace every occurrence in:

- `index.html` — `og:url`, `og:image`, `twitter:image`
- `api/og.ts` — default `image_url` and `canonical` URL builder
- `src/pages/RegionPage.tsx` — `canonical`, `ogUrl`, structured-data `url` / `mainEntityOfPage`, and per-region `ogImage` fallbacks (piemonte, lombardia, puglia, umbria, default)
- `src/pages/NewsletterIndex.tsx` — `canonical`, `ogUrl`, `ogImage`, JSON-LD `url`
- `src/components/admin/OGImageManager.tsx` — Facebook debug link template
- `src/components/common/CookieConsent.tsx` — analytics `domains` array (add `italy.caesartheday.com`, keep legacy)
- `src/utils/mergeResearchData.ts` — generated `shareUrl`
- `supabase/functions/scaffold-region/index.ts` — generated `shareUrl`
- `public/sitemap.xml` — all `<loc>` entries
- `public/data/_template.json`, `public/data/piemonte.json`, `public/data/regions/italy/*.json` — `closing.shareUrl` for piemonte, lombardia, puglia, veneto (and template)

Note: `www.caesartheday.com` (the marketing site) and `italy7percent.caesartheday.com` are unrelated and stay as-is.

### 2. OG metadata in the database (`region_og_metadata` table)

Update `image_url` host for all 6 region rows from `jolbywwrnehhwodlgytt.supabase.co/storage/v1/object/public/og-images/...` and `news.caesartheday.com/...` → `https://italy.caesartheday.com/og-images/<slug>-og.<ext>` only **if** the new domain serves these. Since `og-images` are stored in Supabase Storage and not on the `italy.caesartheday.com` origin, the safer move is:

- Keep `image_url` pointing at the existing public Supabase Storage URLs (they work cross-origin for OG scrapers).
- Only the **`og:url` / canonical** changes to `https://italy.caesartheday.com/<slug>`, which is already handled by the code swap above (since `api/og.ts` builds the canonical from the request host fallback).

So the DB only needs a sanity update for the two rows that currently hardcode `news.caesartheday.com` in `image_url`:
- `lombardia` → `https://news.caesartheday.com/images/lombardia-og.jpg` → re-point to its Supabase Storage URL (or the new domain if image is hosted there).

For Calabria specifically: its row already has the correct Supabase Storage `image_url`. After the code swap, social previews for `https://italy.caesartheday.com/calabria` will render with the existing title/description/image.

### 3. Vercel / hosting

`vercel.json` doesn't need domain changes (it's host-agnostic). The new domain `italy.caesartheday.com` must be added as a domain in the Vercel project — that's a one-time hosting-panel action, not a code change. I'll flag this in the final message.

## Verification after edit

- `rg "news.caesartheday.com"` returns no results.
- Open `/admin/regions` → OG manager → Calabria row → "FB Debug" link points to `https://italy.caesartheday.com/calabria`.
- Hitting `https://italy.caesartheday.com/calabria` with a Facebook user-agent (via the Vercel `/api/og` route) returns OG tags with `og:url=https://italy.caesartheday.com/calabria` and the existing Calabria image/description.
