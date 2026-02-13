

## Replace Venice Sestieri Map with Accurate Geographic SVG

The current hand-drawn SVG map will be replaced with geographically accurate paths traced from the Wikimedia Commons "Sestieri di Venezia" reference map, styled to match the project's Mediterranean color palette.

### What Changes

**File modified: `src/components/sections/venice/SestiereSVGMap.tsx`**

The entire SVG map will be redrawn with:

1. **Accurate district polygons** traced from the Wikimedia Commons reference (462x273 viewBox), reflecting Venice's true fish-shaped silhouette with realistic canal boundaries between districts
2. **Grand Canal** rendered as a visible waterway separating the northern sestieri (Cannaregio, San Polo, Santa Croce) from the southern ones (San Marco, Dorsoduro), with Castello wrapping the east
3. **Giudecca island** shown to the south (part of Dorsoduro administratively)
4. **Water/lagoon background** in a soft blue matching the site's Mediterranean palette
5. **Surrounding islands** (San Giorgio Maggiore, etc.) as subtle context shapes

### Color Palette

Instead of the current random Tailwind colors (amber, rose, orange, teal, emerald, indigo), the districts will use muted, elegant tones derived from the project's CSS variables:

| District | Current Color | New Color |
|---|---|---|
| San Marco | amber-500 | Primary blue (hsl 210 85% 35%) at 40% opacity |
| Dorsoduro | rose-500 | Warm terracotta (hsl 15 60% 55%) at 40% |
| San Polo | orange-500 | Sage green (hsl 150 30% 50%) at 40% |
| Cannaregio | teal-500 | Dusty rose (hsl 350 40% 60%) at 40% |
| Castello | emerald-500 | Muted gold (hsl 45 50% 55%) at 40% |
| Santa Croce | indigo-500 | Soft lavender (hsl 270 30% 60%) at 40% |

Active state: 70% opacity with a subtle ring/glow. Hover state: 50% opacity. Inactive: 30% opacity.

All colors will be defined as inline HSL values in the SVG `fill` attributes (since Tailwind classes inside SVG can be unreliable), keeping text labels using the existing `fill-foreground` pattern.

### Interaction

- Same click-to-select behavior wired to `activeSestiere` state (no logic changes)
- Hover highlights with smooth CSS transitions
- District name labels positioned at the centroid of each polygon
- "Click a district to explore" helper text retained

### Technical Notes

- The viewBox will change from `20 50 430 250` to `0 0 462 273` to match the Wikimedia reference dimensions
- All paths will be `<path d="...">` elements with accurate coordinates
- The Grand Canal will be a stroke-only path (no fill) in a lighter blue
- Giudecca shown as a simple outline shape south of the main island
- The compass rose will be repositioned to fit the new layout
- No new dependencies or files needed -- this is a drop-in replacement of the SVG content within the existing component

