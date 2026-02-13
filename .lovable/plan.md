

## Plan: Build Three Dedicated Interactive Components for Veneto

### The Problem
Veneto's Wine, Food & Culture section currently uses the generic `HighlightsShowcase` component — collapsible cards in tabs. It's functional but flat. Umbria got **bespoke components** (Chocolate City with unwrap animations, Festival Calendar with seasonal filtering, Norcia Table with specialty explorer, Wine Explorer with personality cards). Lombardia got a Dish Explorer with map integration. Veneto deserves the same treatment.

### The Approach
Replace the generic `HighlightsShowcase` for Veneto with **three custom components**, each with distinct interactive mechanics that reinforce the region's identity as a place where wine is identity, food is geography, and culture is alive.

---

### Component 1: `VenetoWinePourSelector`

**Concept:** "What's Your Veneto Pour?" — a personality-driven wine selector where clicking a wine reveals not just tasting notes, but the **kind of life** it pairs with.

**Interactive Mechanics:**
- 4 large clickable cards arranged in a 2x2 grid (Amarone, Prosecco Superiore, Soave Classico, Bardolino)
- Each card has a **mood state** — unselected cards show a wine glass silhouette with a one-word personality (e.g., "Contemplative," "Celebratory," "Elegant," "Easygoing")
- Clicking a card **expands it** into a detailed panel (pushes others aside or overlays) revealing:
  - Flavor profile with visual descriptors
  - "Where it's made" — town name with a one-line geographic anchor
  - "The town vibe it pairs with" — connecting wine personality to actual Veneto towns
  - Classification badge (DOCG/DOC), type badge (Red/White/Rose)
  - Price range and food pairing
  - External link to consorzio or wine trail
- An editorial footer: "The Insider Take" — opinionated guidance similar to Umbria's wine component

**Visual Identity:**
- Deep burgundy/wine gradient background
- Cards use wine-color coding (deep red for Amarone, gold for Prosecco, pale green for Soave, light cherry for Bardolino)

**Data:** Hardcoded in the component (same pattern as UmbriaWineExplorer), pulling from the editorial content already written

---

### Component 2: `VenetoFoodPillars`

**Concept:** "Polenta, Risotto, or Bigoli?" — three culinary pillars representing Alpine, Lagoon, and Mainland traditions. Food as geography.

**Interactive Mechanics:**
- 3 tall pillar cards side by side, each representing a culinary tradition:
  - **Polenta & Mountain Cuisine** (Alpine icon, cool blue-green tones)
  - **Risotto & Lagoon Influence** (Wave icon, sea-blue tones)  
  - **Bigoli & Mainland Comfort** (Wheat icon, warm amber tones)
- Hover/click on a pillar to reveal:
  - A 30-second cultural story (why this food exists here)
  - Key dishes with one-line descriptions
  - "Where You'll Feel This Most" — 2-3 town callouts connecting food to geography
  - A signature recipe link
- Each pillar has a small **geographic indicator** (mountains / coast / plains) reinforcing the spatial lesson
- An editorial footer: "The Veneto Table" — a paragraph about how these three traditions coexist within an hour's drive

**Visual Identity:**
- Warm, earthy gradient background
- Three distinct color temperatures (cool alpine, ocean blue, warm heartland)

---

### Component 3: `VenetoCultureAlive`

**Concept:** "Not Just Pretty. Alive." — culture organized into three tiers: Grand Stage, Living Traditions, Everyday Culture.

**Interactive Mechanics:**
- Three-tier layout with expandable sections:
  - **Grand Stage** (2 items): Arena di Verona, Scrovegni Chapel
    - Click reveals: what it is, what it feels like as a resident (not a tourist), practical tips
  - **Living Traditions** (2 items): Carnevale "Choose Your Carnevale" and Marostica Living Chess
    - **Carnevale** gets special treatment: three clickable sub-options (Venice Masked Republic / Verona Bacanal del Gnoco / Small-Town Carnevale) each revealing crowd levels, what locals attend, and what you'd experience as a resident
    - Includes the "Mask or No Mask?" cultural subtext block about anonymity as political power
  - **Everyday Culture** (2 items): Venetian Music Heritage (Vivaldi/Ospedali), Aperitivo & Passeggiata
    - These expand with cultural depth — the Vivaldi section covers the orphanage musicians, La Fenice's role
- Each tier has a distinct visual treatment (gold for Grand Stage, terracotta for Living Traditions, warm neutral for Everyday)
- A "Did You Know?" expandable tile for the Marostica chess game

**Visual Identity:**
- Theatrical gradient (deep navy to warm gold)
- Tier badges distinguish the three levels

---

### Integration in RegionPage.tsx

**Change:** Add a Veneto-specific conditional block (same pattern as Umbria's), replacing the generic HighlightsShowcase:

```
{region === 'veneto' && (
  <>
    <VenetoWinePourSelector />
    <VenetoFoodPillars />
    <VenetoCultureAlive />
  </>
)}
```

**Update the existing conditional** on line 361 from:
```tsx
{region !== 'umbria' && <HighlightsShowcase ... />}
```
to:
```tsx
{region !== 'umbria' && region !== 'veneto' && <HighlightsShowcase ... />}
```

---

### Files to Create
- `src/components/sections/VenetoWinePourSelector.tsx` — Wine personality selector (~200 lines)
- `src/components/sections/VenetoFoodPillars.tsx` — Three culinary pillar explorer (~180 lines)
- `src/components/sections/VenetoCultureAlive.tsx` — Three-tier culture section (~250 lines)

### Files to Modify
- `src/pages/RegionPage.tsx` — Import 3 new components, add Veneto conditional block, exclude Veneto from generic HighlightsShowcase

### What This Does NOT Touch
- No changes to the generic HighlightsShowcase component (other regions unaffected)
- No changes to veneto.json highlights data (components are self-contained with hardcoded data, same as Umbria's approach)
- No changes to any other region's page

### Image Strategy
All three components will use `/images/veneto/hero.jpg` as placeholder initially. They're designed to work well even without images (using gradient backgrounds and icons as primary visual elements, with images as enhancement).

