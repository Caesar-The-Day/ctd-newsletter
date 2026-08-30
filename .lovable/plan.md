# Fix broken photos on the live Lazio page

## Root cause (verified)

The "Lazio is not just Rome" photos on the **live** site are loaded from the region's data stored in the database — and that stored data still points at Lovable CDN URLs (`/__l5e/assets-v1/...`). Those URLs return 404 on your Vercel-hosted live domain (`italy.caesartheday.com`), so the photos never load there. The preview works because the CDN is reachable from the preview domain.

Exactly 7 stale CDN URLs exist in the live `lazio` region data, all "Beyond Rome" photos:

- lake-bracciano-1400.webp
- lake-bolsena-1400.webp
- lake-albano-1400.webp
- lake-vico-1400.webp
- monti-simbruini-1400.webp
- monti-laga-leonessa-1400.webp
- sabaudia_circeoNP-1400.webp

All 7 files already exist locally in the repo at `public/images/lazio/beyond/` (verified: present, non-empty, and served correctly by the app). No other region's stored data contains CDN URLs — this is Lazio-only.

## The fix

1. **Update the live Lazio region data in the database** — replace each `/__l5e/assets-v1/<uuid>/<filename>` URL with the local path `/images/lazio/beyond/<filename>` (one SQL UPDATE with per-file string replacements; content otherwise untouched).
2. **Verify** — re-query to confirm zero remaining `__l5e` references, and check the `/lazio` preview renders the Beyond Rome photos.
3. **Publish** — the frontend fix from the previous session (local book cover + local Beyond Rome photo paths in code) also isn't live yet, so you must click **Update** in the publish dialog to push both the code and the newly downloaded images to the live site. Without this step the live page stays broken even after the data fix.

## Notes

- If you also deploy to `italy.caesartheday.com` from the repo, that deployment picks up the new `public/images/lazio/beyond/` files automatically on its next build.
