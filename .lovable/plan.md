

## Level Up Veneto SVG Graphics: From Invisible to Impactful

### The Problem
The current SVG decorations are ghost-level subtle: 5-8% opacity, tiny sizes, barely-visible background patterns. They add zero visual personality. Meanwhile Umbria's components use real images, particle animations, and interactive effects that give them visual punch.

### The Fix: Three Strategies

Instead of invisible watermarks, we go bold with:
1. **Visible, colored illustration panels** -- SVGs at 20-40% opacity with gradient fills, not invisible outlines
2. **CSS-animated SVGs** -- gentle floating, swaying, and filling effects that bring static drawings to life
3. **Prominent placement** -- section dividers, card hero illustrations, and full-width decorative borders instead of hidden corner watermarks

---

### Component 1: VenetoWinePourSelector

**What changes:**
- Replace the barely-visible grape vine background pattern with a **prominent decorative vine border** along the top of the section: a full-width SVG vine with leaves and grape clusters at ~20% opacity, using the rose palette with gradient fills (not just strokes)
- Each wine card gets a **larger, filled grape cluster illustration** (not outline) in the card background at 12-15% opacity, with a **CSS float animation** (gentle up-down bob, 6s infinite)
- The expanded detail panel gets a **large wine glass SVG** (not a corner watermark) that acts as a visual anchor on the left side of the panel at 10-12% opacity, with a **pour animation** -- the "wine level" path inside the glass fills up via CSS animation when the panel opens
- The Insider Take footer gets a **full-width decorative grape vine divider SVG** above it -- a horizontal illustrated border instead of just a plain line
- The background pattern gets increased from near-invisible to a recognizable texture (~15% opacity)

**New CSS animations added to tailwind.config.ts:**
- `float` keyframe: gentle 8px vertical bob over 6 seconds
- `wine-pour` keyframe: clipPath or transform that reveals wine inside a glass over 1.5s on mount

### Component 2: VenetoFoodPillars

**What changes:**
- Each pillar card gets a **much larger themed illustration** (40x40 px instead of 16x12) that serves as a visual identity marker, not a hidden watermark:
  - Alpine: mountain range with snow-capped peaks, filled with a cool blue-to-white gradient at 15% opacity
  - Lagoon: wave pattern with a prominent stylized fish, filled with blue tones at 15% opacity  
  - Heartland: full wheat sheaf with golden fill at 15% opacity
- These illustrations **sway gently** using a CSS `sway` animation (subtle 3-degree rotation oscillation, 8s)
- The wheat background pattern gets boosted to ~18% opacity and uses amber-600 fill (not just stroke) for the wheat heads
- The expanded detail section gets a **full-width illustrated divider** matching the selected pillar's theme (mountains/waves/wheat)
- The steaming pot in the footer gets **animated steam** -- the steam wisps use a CSS `rise-fade` animation (translate up + fade out, staggered)

### Component 3: VenetoCultureAlive

**What changes:**
- The header Venetian mask becomes a **hero illustration**: 300px wide, centered above the heading, at 8-10% opacity with a **subtle breathe animation** (gentle scale pulse 1.0 to 1.02, 4s infinite). The mask gets gradient fills in blue tones instead of just outlines
- The mask background pattern opacity increases to ~10% and masks get a slight fill
- The comedy/tragedy mask pair (Carnevale) becomes **larger and prominently placed** next to the title at 40-50% opacity -- an actual visible icon, not a ghost
- The chess knight (Marostica) gets the same treatment: visible, colored, with a **chess-move animation** (translate right 8px and back, 4s, like a knight hop)
- Musical notes (Vivaldi) get an **animated bounce** -- each note bounces at staggered intervals like they're being played
- The spritz glass gets a **bubble animation** -- tiny circles rising inside the glass via CSS
- The Bauta mask accent in the "Mask or No Mask?" block becomes a **side illustration** at 25-30% opacity instead of a tiny corner ghost, with subtle shadow

### Shared: New CSS Animations

Added to `tailwind.config.ts`:

```text
float:       translateY(-8px) -> translateY(0px) -> translateY(-8px), 6s ease-in-out infinite
sway:        rotate(-3deg) -> rotate(3deg) -> rotate(-3deg), 8s ease-in-out infinite
breathe:     scale(1) -> scale(1.03) -> scale(1), 4s ease-in-out infinite
bounce-note: translateY(0) -> translateY(-6px) -> translateY(0), 1.2s ease-in-out infinite
rise-fade:   translateY(0), opacity(0.6) -> translateY(-12px), opacity(0), 2s ease-out infinite
knight-hop:  translateX(0) -> translateX(8px) -> translateX(0), 3s ease-in-out infinite
```

All animations respect `prefers-reduced-motion` via existing Tailwind patterns.

---

### Files Changed
- `tailwind.config.ts` -- Add 6 new keyframe animations and their animation utility classes
- `src/components/sections/VenetoWinePourSelector.tsx` -- Larger filled SVGs, vine border, pour animation, boosted pattern opacity
- `src/components/sections/VenetoFoodPillars.tsx` -- Larger filled pillar illustrations with sway, animated steam, boosted wheat pattern
- `src/components/sections/VenetoCultureAlive.tsx` -- Hero-size mask, visible icon accents, chess hop/note bounce/bubble animations

### What This Preserves
- All interactive mechanics unchanged
- All editorial content unchanged
- Color palettes unchanged (just using them more boldly)
- Reduced motion accessibility maintained
- No external images or new dependencies

