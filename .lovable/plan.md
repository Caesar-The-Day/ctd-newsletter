

## Add Decorative SVG Graphics to Veneto Components

### Vision
Add hand-drawn-style inline SVG illustrations as subtle decorative accents to each of the three Veneto components. These are lightweight, infinitely scalable, and require zero external dependencies or image hosting. They'll be embedded directly in the components as CSS background patterns and decorative SVG elements.

### Approach: Inline SVGs + CSS Patterns
No external image sourcing needed. We'll craft simple, elegant SVG shapes directly in the code:

- **Wine glasses** and **grape clusters** for the Wine section
- **Steaming bowls** and **wheat/herb motifs** for the Food section  
- **Venetian masks**, **chess pieces**, and **musical notes** for the Culture section

Plus subtle **repeating SVG background patterns** (like Umbria's cross pattern in the Chocolate City component) to add texture.

---

### Component 1: VenetoWinePourSelector

**Decorative additions:**
- A faint **grape vine SVG pattern** as a repeating background texture (similar to Umbria's `data:image/svg+xml` cross pattern), applied at low opacity behind the header area
- Each wine card gets a small **decorative grape cluster SVG** in the top-right corner (absolute positioned, low opacity) that becomes more visible on hover
- The expanded detail panel gets a subtle **wine glass silhouette SVG** watermark in the background corner
- The "Insider Take" footer gets a small **corkscrew SVG accent** next to the heading

### Component 2: VenetoFoodPillars

**Decorative additions:**
- A faint **wheat stalk repeating pattern** as background texture behind the section
- Each pillar card gets a **themed SVG watermark** in its background:
  - Alpine: mountain peak outline with steam wisps
  - Lagoon: wave pattern with a stylized fish
  - Heartland: wheat sheaf silhouette
- The editorial footer gets a **steaming pot SVG accent**
- Town callout areas get small **map pin with fork SVG** decorations

### Component 3: VenetoCultureAlive

**Decorative additions:**
- A **Venetian mask SVG** as a large, faint watermark behind the section header (absolute positioned, ~5% opacity)
- Grand Stage tier: **opera curtain drape SVG** accents on the tier header borders
- Living Traditions tier: 
  - Carnevale item gets a small **comedy/tragedy mask SVG pair** next to the title
  - Marostica chess item gets a **chess knight piece SVG** next to the title
- Everyday Culture tier: **musical note cluster SVG** for the Vivaldi item, **spritz glass SVG** for the Aperitivo item
- The "Mask or No Mask?" callout block gets a **bauta mask silhouette SVG** as a side accent
- The "Did You Know?" block gets a **chess rook SVG** accent

### SVG Style Guidelines
- All SVGs use `currentColor` or muted accent colors matching each component's palette (rose, amber, blue)
- Decorative watermarks at 5-8% opacity so they add texture without competing with content
- Simple line-art style (2px stroke, no fill) for consistency
- Hover effects on some elements: opacity increases from 8% to 15% on card hover
- All SVGs are inline (no external files), keeping bundle size minimal

---

### Files Changed
- `src/components/sections/VenetoWinePourSelector.tsx` -- Add grape vine pattern, grape cluster accents, wine glass watermark
- `src/components/sections/VenetoFoodPillars.tsx` -- Add wheat pattern, themed pillar watermarks, pot accent
- `src/components/sections/VenetoCultureAlive.tsx` -- Add Venetian mask watermark, chess piece SVGs, musical note accents, mask pair icons

### What This Preserves
- All interactive mechanics unchanged
- All editorial content unchanged
- All color schemes unchanged (decorative elements use the existing palettes)
- Other regions completely unaffected
- No new dependencies, no external images to host

