# Living on Three Borders — a proper showpiece

Turn the tabbed card into a cinematic, map-led module where the three-country geography is the visual, not a bullet list.

## What changes

**1. Photo-led base selector**
The three bases (Trieste, Gorizia, Tarvisio) become full-bleed photo tiles in a row instead of plain pill buttons. The selected tile expands, the others dim and narrow. Each gets a generated editorial photograph:
- Trieste — Karst plateau dropping to the Adriatic, border road below
- Gorizia — the shared Transalpina square, the border line running through the paving
- Tarvisio — Val Canale with Alpine peaks, the three-country valley

**2. Animated "reach radar"**
Beside the copy sits a compact schematic — the chosen base at the centre, with Slovenia, Austria, Croatia and the airports plotted as points at radial distances proportional to travel time. Rings sweep outward on selection, points pop in staggered, and hovering a point highlights the matching row in the lists. Concentric time rings labelled 15 / 30 / 60 / 90 minutes.

**3. Border ribbon backdrop**
A subtle animated dashed border-line motif drifts across the section background (SVG path, slow drift, freezing under `prefers-reduced-motion`), with soft country-tinted glows — Italy/Slovenia/Austria — repositioning as you change base.

**4. Data that animates**
- Travel times count up on selection rather than snapping.
- Border reach and airports become horizontal time bars (longer bar = further), sorted nearest-first, so "abroad is close" reads instantly.
- Errand cards flip up in stagger with icon micro-motion on hover.

**5. Kept intact**
All existing copy, the three bases' data, and the practical caveat note stay exactly as written — the caveat gets a slightly stronger framing so it doesn't get lost in the visuals.

## Technical notes

- Rewrite `src/components/sections/FriuliCrossBorder.tsx`; data array stays, extended with `image` and numeric `minutes` per crossing/airport (derived from the existing labels) to drive bars and radar geometry.
- Framer Motion for tile expansion, `AnimatePresence` content swap, staggered point/card reveals; a small `useCountTo`-style hook for the minute readouts.
- Radar is inline SVG with semantic-token colors — no new dependency.
- Three images generated to `src/assets/friuli/borders/` (~1600x1000, editorial photographic), imported as ES6 assets, locally hosted per project rules.
- All colors via existing design tokens; reduced-motion respected throughout.
