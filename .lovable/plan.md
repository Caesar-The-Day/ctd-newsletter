# Add the Veni Vidi Vici seal beside the homepage hero title

## What the user wants

The uploaded circular seal (green field, gold laurel and aqueduct, "VENI · VIDI · VICI / REGIONAL GUIDES / BY CAESARTHEDAY®", 1200×1200, transparent background) should sit to the right of the vertically stacked "Veni. / Vidi. / Vici." headline in the homepage hero — filling the empty space between the title and the map column. Homepage only; region pages untouched.

## Changes

1. **Asset (local, per project rule — no CDN pointers)**
   - Copy the upload from `/mnt/user-uploads/` to `public/images/shared/veni-vidi-vici-seal.png`, resized to 600×600 (2× the largest display size, keeps retina crisp at ~120 KB instead of 1 MB).
   - Keep the original untouched in uploads.

2. **Hero layout — `src/pages/NewsletterIndex.tsx`**
   - Wrap the headline block in a flex row: stacked `h1` on the left, the seal `<img>` on the right, vertically centered against the three-line headline (`items-center`, generous gap so the seal reads as a badge next to the type, not touching it).
   - Size the seal ~280px on desktop (`clamp(180px, 22vw, 280px)`), so on mobile it drops below the headline at a comfortable size or hides when the viewport is very narrow — whichever keeps the hero balanced.
   - Alt text: "Veni. Vidi. Vici. Regional Guides seal".
   - Nothing else in the hero (eyebrow, lead, buttons, stats) changes; the map column stays put.

3. **Validation**
   - Run `bun run validate:images` (new local path keeps it green) and the typecheck.
   - Playwright screenshot of the hero at desktop and mobile widths to confirm the seal fills the space without crowding the map or causing horizontal scroll.

## Not in scope

- Header logo, favicon, OG images, region pages — all unchanged.
