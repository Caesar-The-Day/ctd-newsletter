# The Bora, Honestly — make it move

Turn the static slider into a section that physically feels windy: the whole panel reacts to the gust level you choose, with photography behind it.

## What changes

**1. Live wind field (the centerpiece)**
A canvas/DOM particle layer sits behind the meter card and blows left-to-right across the section:
- Particles: dry leaves, a few paper scraps, sea spray flecks near the coast tones.
- Gust level drives everything — 40 km/h: a slow, sparse drift; 70: steady streaming with visible tilt; 100: dense, fast, blurred streaks; 130: chaotic, near-horizontal, with occasional whipping cross-gusts.
- Motion is speed/density/angle interpolated smoothly, so dragging the slider ramps the wind up and down rather than snapping.
- Respects `prefers-reduced-motion`: particles freeze into a static tilted scatter, everything else still works.

**2. Photo-backed level cards**
Each of the four gust levels gets its own photograph behind a dark gradient, cross-fading as you drag:
- Bora chiara — scrubbed blue Trieste seafront, flags snapping
- A proper Bora — whitecaps at Barcola, café tables stacked
- Bora scura — storm-force waves breaking over the Molo Audace
- Record territory — dramatic spray/ropes-era mood

The gust number and level name sit on the photo; description and the "what this means for living" note stay on a solid card below for readability.

**3. Wind-reactive details**
- Gust readout counts up/down instead of jumping.
- The strength bar gets a gusting pulse whose jitter grows with the level.
- Headline gets a subtle horizontal drift/letter-lean at higher levels.
- A small "wind sock" or arrow indicator that swings harder as the level rises.

**4. Shelter map cards get texture**
The six exposure cards stay, but exposed towns get a faint animated streak overlay and sheltered ones stay still — so the difference reads visually, not just as a label.

## Technical notes

- New component `src/components/sections/BoraWindField.tsx` — a lightweight `requestAnimationFrame` canvas particle system taking `intensity` (0–1) as a prop; ~60–200 particles depending on level, capped for mobile.
- `FriuliBoraMeter.tsx` keeps its existing `levels` and `shelter` data; adds photo paths per level, framer-motion `AnimatePresence` cross-fade for the images, and an eased `intensity` value derived from the slider.
- Four images generated into `src/assets/friuli/bora/` (locally hosted, editorial photographic style, ~1600x900), imported as ES6 assets.
- All colors via existing semantic tokens; no hardcoded palette.
