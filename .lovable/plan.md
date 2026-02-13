

## Fix Veneto Component Color Schemes

### Problem
All three Veneto bespoke components use hardcoded near-black backgrounds (`hsl(345,30%,12%)`, `hsl(30,20%,10%)`, `hsl(220,30%,10%)`) that look jarring against the rest of the Veneto page. Umbria's bespoke components integrate smoothly by using the page's `background` CSS variable with soft tinted gradients (`from-background to-purple-50/30`).

### Solution
Shift all three components from dark hardcoded backgrounds to **light, tinted gradients** that flow with the page theme — same approach Umbria uses. Update all internal text, badges, borders, and cards to work on light backgrounds.

---

### Component 1: VenetoWinePourSelector

**Background:** `from-[hsl(345,30%,12%)]` --> `from-background to-rose-50/40`

**Color rework:**
- Section text: white --> `text-foreground` / `text-muted-foreground`
- Badge pill: `bg-red-900/40 text-red-200` --> `bg-rose-100 text-rose-700 border-rose-200`
- Heading accent: `text-red-300` --> `text-rose-600`
- Wine cards: dark glass backgrounds --> `bg-white/80 border border-rose-200/60` with `hover:shadow-md`
- Wine glass circle colors stay (they're the identity markers)
- Personality text: `text-red-300/80` --> `text-rose-600`
- Card wine name: `text-white` --> `text-foreground`
- Type/classification badges: rework for light bg contrast
- Expanded detail panel: dark overlay --> `bg-white border border-border shadow-lg`
- All detail panel text: white/red tones --> foreground/muted-foreground with rose accents
- Insider Take footer: dark gradient --> `bg-rose-50/60 border-rose-200/40`

### Component 2: VenetoFoodPillars

**Background:** `from-[hsl(30,20%,10%)]` --> `from-background to-amber-50/40`

**Color rework:**
- Section text: white/amber tones --> `text-foreground` / `text-muted-foreground`
- Badge pill: `bg-amber-900/40` --> `bg-amber-100 text-amber-700 border-amber-200`
- Heading accent: `text-amber-300` --> `text-amber-600`
- Pillar cards: dark overlays --> `bg-white/80 border` with pillar-specific accent borders (blue-200 for lagoon, green-200 for alpine, amber-200 for heartland)
- Expanded content: dark backgrounds --> white/light with colored accent borders
- Town callout pills: dark --> `bg-amber-50 text-amber-800`
- Editorial footer: dark gradient --> `bg-amber-50/60 border-amber-200/40`

### Component 3: VenetoCultureAlive

**Background:** `from-[hsl(220,30%,10%)]` --> `from-background to-blue-50/30`

**Color rework:**
- Section text: white/gold tones --> `text-foreground` / `text-muted-foreground`
- Tier tabs: dark backgrounds --> light with colored borders (amber for Grand Stage, orange for Living, warm neutral for Everyday)
- Expandable items: dark overlays --> `bg-white/80 border border-border`
- Carnevale sub-selector: dark cards --> light cards with distinct accent colors
- "Mask or No Mask?" block: dark --> `bg-slate-50 border-slate-200`
- "Did You Know?" block: dark --> `bg-amber-50 border-amber-200`
- Content text: white --> foreground/muted-foreground

---

### Files Changed
- `src/components/sections/VenetoWinePourSelector.tsx` -- remap all colors from dark to light theme
- `src/components/sections/VenetoFoodPillars.tsx` -- remap all colors from dark to light theme
- `src/components/sections/VenetoCultureAlive.tsx` -- remap all colors from dark to light theme

### What This Preserves
- All interactive mechanics (click, expand, select) unchanged
- All editorial content unchanged
- Wine-color identity markers on glass circles preserved
- Pillar color temperature distinctions preserved (just lighter)
- Other regions completely unaffected
