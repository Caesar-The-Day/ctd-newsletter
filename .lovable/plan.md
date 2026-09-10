# Fix the homepage social preview image

## What's wrong

The homepage points its social preview at a picture that does not exist.

Both the normal page and the crawler version of `italy.caesartheday.com` reference:

`https://italy.caesartheday.com/og-veni-vidi-vici-2.jpg` → returns **404 Not Found**

The picture that actually ships with the site is `og-veni-vidi-vici.jpg` (no `-2`), and it loads fine at 1200x630 — the correct share size. So Facebook, LinkedIn, WhatsApp and X get a broken link and fall back to no image at all.

Region pages are fine — Lazio, Liguria, Trentino-Alto Adige and Friuli-Venezia Giulia all return their own title, description and a working preview image.

## The fix

Correct the filename in the three places that reference it:

1. `index.html` — `og:image` and `twitter:image`
2. `api/og.ts` — the default fallback used for the homepage and any page without its own record

Change `og-veni-vidi-vici-2.jpg` to `og-veni-vidi-vici.jpg` everywhere.

Also add `og:image:width` / `og:image:height` (1200 / 630) and an `og:image:alt` to `index.html`, which currently has neither, so crawlers can size the card before downloading.

## Two small SEO cleanups while in there

- `index.html` has no `<link rel="canonical">`. Add `https://italy.caesartheday.com/`.
- The homepage title and description in `index.html` differ from the ones the crawler handler serves. Make the crawler default match the real homepage wording so search and social agree.

## After the change

This only reaches the live site on the next publish — the current build keeps serving the broken link until then. Once published, re-scrape the homepage in Facebook's sharing debugger; crawlers keep showing the version they last fetched until forced to re-check.

## Technical notes

- Files touched: `index.html`, `api/og.ts` (`DEFAULT_OG.image_url`, `title`, `description`).
- No image regeneration needed — `public/og-veni-vidi-vici.jpg` is already 1200x630 and publicly reachable.
- No change to `region_og_metadata` or the per-region flow.
