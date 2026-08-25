# Colosseum parallax + Thermal Springs redesign

## 1. Parallax on the Colosseum silhouette

In `RomeResidentReality.tsx`, drive the existing decorative silhouette layer with scroll position:

- Use the existing `useParallax` hook (already respects `prefers-reduced-motion`) but scope it to the section: track the section's position in the viewport with a ref + scroll listener, so the drift is relative to the section, not the whole page.
- Apply a small vertical translate (roughly -30px to +30px across the section's travel) plus a very slight scale, via `transform` on the decorative div. Keep opacity unchanged.
- No motion when reduced motion is preferred.

## 2. Lazio's thermal springs — visual upgrade

Rebuild `LazioThermalSprings.tsx` from a plain card/table list into a warmer, more visual module. Keeps the same six springs and all existing facts.

**Layout**

- Hero-style intro unchanged in tone, with a steam/water motif: a soft gradient band and a faint decorative wave/steam SVG behind the section (same subtle treatment as the Colosseum silhouette).
- Each spring becomes a photo card: AI-generated editorial photo per spring (6 images, WebP-optimized, responsive 800/1400 variants) with name, place, a temperature chip and a free/paid badge over a gradient scrim.
- Clicking a card opens the detail panel with a Framer Motion crossfade on the photo, matching the pattern used in "Lazio is not just Rome".

**New interactive elements**

- **Temperature gauge**: a horizontal thermometer bar per spring (13°C Fiuggi → 58°C Bullicame) so the range is visible at a glance, animated on reveal.
- **Cost meter**: small segmented bar (Free → €10-15 → €20-30) instead of a plain price line.
- **Drive-time dial**: minutes-from-Rome shown as a radial arc (35 min → 1h20), so proximity is comparable across springs.
- **"Would a resident go back?"** badge stays, restyled as a pill with icon.
- Keep the filter chips (free / paid / year-round / under an hour) and the table view as a compact alternative toggle; filters animate the card grid with layout transitions.
- Comparison strip at the bottom: all six springs plotted on one temperature × distance scatter, so you can see the trade-off in one glance. Hovering/tapping a dot selects that spring.

**Content**

- No factual changes; keep the existing verdicts, prices, hours and links, plus the closing caveat paragraph.

## Technical

- Edit: `src/components/sections/RomeResidentReality.tsx` (parallax transform only).
- Rewrite: `src/components/sections/LazioThermalSprings.tsx`.
- New assets: 6 generated spring photos under `src/assets/lazio/springs/` with 800/1400 WebP variants, imported through a `photos.ts`-style map like the existing Lazio photo module.
- Uses `framer-motion` (already installed), semantic tokens only, no hardcoded colors.
