# Faster photo loading in "Lazio is not just Rome"

The place photos are being served at their original upload sizes — several are 650–900 KB (Anzio 892 KB, Gaeta 813 KB, Bracciano 667 KB, Bolsena 652 KB PNG) for a frame that is at most ~700 px wide on desktop and ~400 px on mobile. Swapping between cards therefore stalls on a fresh download each time, worst on phones.

## What changes

1. **Resized, compressed variants.** Every landscape and place photo gets two WebP versions — roughly 1400 px wide for desktop and 800 px for mobile — plus quality tuning. The oversized PNG (Bolsena) becomes WebP. Expected drop: from ~4.9 MB total to well under 1 MB.
2. **Responsive delivery.** The main photo uses `srcset` + `sizes` so phones fetch the small file and desktops the large one.
3. **Instant swaps.** When a landscape tab is open, its four place photos are quietly prefetched in the background, so clicking a card crossfades immediately instead of showing an empty frame.
4. **Smoother first paint.** The visible main image loads eagerly with `decoding="async"`, and the frame keeps a muted background so there is no layout jump while a photo decodes.

## Technical notes

- New optimized files are generated in the sandbox with `sharp`/`ffmpeg` and uploaded via `lovable-assets`, producing `-1400.webp` and `-800.webp` pointers under `src/assets/lazio/`. The existing full-size pointers are deleted once nothing references them.
- `Place.image` becomes `{ small, large }` in `LANDSCAPES`; the same shape is used for the four default landscape images (`src/assets/lazio-*.jpg`), which are also converted to WebP.
- `motion.img` gains `srcSet`/`sizes` (`sizes="(max-width: 1023px) 100vw, 50vw"`), `loading="eager"`, `decoding="async"`.
- Prefetch is a small `useEffect` on `activeId` creating `new Image()` for each place photo in the active tab.
- Scope is limited to `src/components/sections/LazioBeyondRome.tsx` and its assets; no other sections or regions are touched.
