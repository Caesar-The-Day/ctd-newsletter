# Fix missing book cover (and other CDN images) on the live site

## What's actually wrong

The book cover is not a path typo. It is stored as a Lovable CDN asset pointer and referenced as
`/__l5e/assets-v1/.../escape-plan-2026.jpg`. That URL works on the Lovable preview and on
`caesartheday-guides.lovable.app`, but the live site runs on Vercel at `italy.caesartheday.com`,
which knows nothing about `/__l5e/` and returns 404. Verified:

- lovable.app host: 200 OK, image/jpeg
- italy.caesartheday.com: 404 (served by Vercel)

Same cause affects the 41 other CDN-pointer images in the project — all the Lazio
"Beyond Rome" photos (`src/assets/lazio/**`) are broken on the live domain too.

## The fix

Bring every CDN-hosted asset back to locally served files, matching the project rule that image
assets are hosted locally:

1. Download each `.asset.json` target from the CDN into `public/images/` —
   `public/images/shared/escape-plan-2026.jpg` for the book, and
   `public/images/lazio/beyond/…` (plus the `opt/` 800/1400 webp variants) for Lazio.
2. Update the two code references:
   - `src/components/sections/BookCTA.tsx` → plain `/images/shared/escape-plan-2026.jpg`
   - `src/assets/lazio/photos.ts` → plain public paths, keeping the same `photos` export shape so
     no consuming component changes.
3. Delete the now-unused `.asset.json` pointer files under `src/assets/`.
4. Verify with a build plus a check that every referenced image path exists in `dist/`.

Since `public/images/` is already in the Vercel route allowlist, the images will serve on the live
domain on the next publish.

## Note

I can instead add a single Vercel rewrite proxying `/__l5e/*` to the Lovable CDN — a one-line
change — but that makes the live site depend on the preview host for its images. The local-files
approach above is the durable one, so that's what this plan does unless you prefer the rewrite.
