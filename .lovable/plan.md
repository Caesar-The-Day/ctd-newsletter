

## Enhance Venice Section: Interactive Map + Getting Around Guide

Two new sub-sections will be added inside the existing `VeniceSerenissima.tsx` component, keeping everything self-contained.

---

### 1. Interactive SVG Sestieri Map

A hand-drawn-style SVG map of Venice's six districts replaces the current grid-only navigation. Each sestiere is a clickable polygon region that:

- Highlights on hover with the sestiere's signature color
- Shows the district name as a tooltip/label
- Clicking a sestiere scrolls to and activates the detail panel below (same `setActiveSestiere` state)
- The currently active sestiere stays highlighted
- Placed **above** the existing card grid, giving users two ways to navigate (map or cards)

The SVG will use simplified polygon shapes representing Venice's iconic fish-like silhouette, divided into the six sestieri with the Grand Canal as the dividing line. Each polygon gets a `data-index` attribute tied to the sestieri array.

On mobile, the map scales responsively and remains tappable.

### 2. "Getting Around Venice" Practical Guide

A new tabbed section placed **after** the Sestieri Explorer and **before** the closing pull-quote. Three tabs:

**Tab: Vaporetto (Water Bus)**
- Key routes explained in plain language:
  - Line 1: The "local" — every stop down the Grand Canal (slow, scenic)
  - Line 2: The "express" — San Marco to Rialto to Tronchetto fast
  - Line 5.1/5.2: The circular — around the outside, hits Murano
  - Line 12: Murano, Burano, Torcello island hop
- Pricing: 9.50 EUR single / 25 EUR 24hr / 35 EUR 48hr / 45 EUR 72hr / 65 EUR 7-day
- Pro tip: "Never buy a single ticket. The 72-hour pass pays for itself by trip 5."

**Tab: Water Taxis & Gondolas**
- Water taxi: 70-120 EUR flat rate (airport transfer ~120 EUR)
- Gondola: 80 EUR for 30 min (100 EUR after 7pm), max 6 people
- Traghetto: 2 EUR to cross Grand Canal standing in a gondola — "the 2-euro gondola ride nobody knows about"

**Tab: Where to Stay**
A lifestyle-based recommendation selector (click to reveal):
| Lifestyle | Neighborhood | Why |
|---|---|---|
| Culture vulture | Dorsoduro | Walking distance to Guggenheim, Accademia, and university bars |
| Foodie | San Polo | Steps from Rialto market and the best bacari |
| Peace & quiet | Castello | Residential, green, real neighborhood feel |
| First-timer | San Marco area | Close to everything, easy orientation |
| Budget-conscious | Cannaregio | Lower prices, local restaurants, near train station |
| Romantic escape | Giudecca | Across the water, views back at Venice, feels private |

Each option expands with a 2-sentence description and a "best for" tag.

---

### Technical Implementation

**Modified file: `src/components/sections/VeniceSerenissima.tsx`**

Changes:
- Add sestieri coordinate data (simplified SVG polygon points for each district)
- New `SestiereSVGMap` sub-component rendering the interactive map
- New `GettingAroundVenice` sub-component with tab state for the three transport/stay categories
- Wire map clicks to the existing `activeSestiere` state
- Add `Ship`, `Anchor`, `Hotel` icons from lucide-react
- No new files needed -- everything stays in the single component file
- No new images needed -- the map is pure SVG, the guide is text-based

**No changes to RegionPage.tsx** -- the component is already rendered in the correct position.

### Section Flow (updated)

```text
Hero Image
  |
Editorial Essay
  |
Venice by the Numbers (animated counters)
  |
Sestieri Explorer:
  -> NEW: Interactive SVG Map (click district to select)
  -> Existing: Card grid (click card to select)
  -> Existing: Detail panel with Caesar's Pick
  |
NEW: Getting Around Venice (3 tabs: Vaporetto / Taxis & Gondolas / Where to Stay)
  |
Closing Pull Quote
```

