# Colosseum silhouette background for "Living in Rome"

Add a very light, decorative Colosseum silhouette behind the existing "Living in Rome, not visiting it" section so it reads as Rome without adding visual weight.

## What changes

1. **SVG asset**
   - Create a compact, single-path SVG silhouette of the Colosseum (arched facade, slight ruin at the top).
   - Place it at `public/images/lazio/rome-colosseum-silhouette.svg`.

2. **Background integration**
   - In `src/components/sections/RomeResidentReality.tsx`, wrap the section content or add an absolutely positioned decorative element inside `<section>` that renders the SVG.
   - Position it at the bottom-left of the section, bleed off the left edge, with a height of roughly 40–55% of the section and opacity set to ~0.04–0.06 on light mode and ~0.03–0.05 on dark mode.
   - Use `pointer-events-none` so it never blocks clicks or tab interactions.

3. **Styling guardrails**
   - Tint the SVG with `hsl(var(--foreground))` and rely on opacity for the "very light" effect, so light/dark mode both work without hardcoded colors.
   - Ensure it sits behind the card and text (`z-index` below content).
   - On mobile, reduce the SVG scale so the arches do not compete with the stat band or tab buttons.

## Out of scope

- No changes to section copy, tabs, counters, or interactive logic.
- No new fonts, animations, or additional landmarks.

## Technical

- One new file: `public/images/lazio/rome-colosseum-silhouette.svg`.
- One edit: `src/components/sections/RomeResidentReality.tsx` to add the decorative background element.
- Verify the section remains fully readable and tab buttons stay clickable.
