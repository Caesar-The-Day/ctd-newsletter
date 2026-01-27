

# Rome-Florence Corridor Interactive Tool

## Overview

Create a new custom section component `UmbriaRomeFlorenceCorridor.tsx` that visualizes Umbria's strategic position between Italy's two most important cities. This tool will combine travel time visualization, hospital access, and Perugia airport information into a cohesive, interactive experience that reframes Umbria's infrastructure as a "corridor advantage."

## Concept: "The Two-Capital Strategy"

The core narrative: Umbria isn't isolated—it's **positioned**. From Orvieto, you can reach Rome in 1 hour or Florence in 1.5 hours. This "dual access" is Umbria's infrastructure story, not limitations.

The tool will feature:
1. An interactive map showing travel times from key Umbrian towns to both Rome and Florence
2. Hospital information integrated into town cards
3. Perugia Airport featured prominently with seasonal flight schedules
4. A "corridor calculator" letting users select a town and see their dual-city access

---

## Technical Implementation

### New Component

Create `src/components/sections/UmbriaRomeFlorenceCorridor.tsx` with:

**Data Structure:**
```typescript
interface CorridorTown {
  id: string;
  name: string;
  coords: [number, number];
  toRome: { time: string; method: 'train' | 'car'; station?: string };
  toFlorence: { time: string; method: 'train' | 'car'; station?: string };
  nearestHospital: { name: string; distance: string };
  lifestyle: string;
}
```

**Towns to include (with real data):**
| Town | To Rome | To Florence | Hospital |
|------|---------|-------------|----------|
| Orvieto | ~1h train | ~1h30 train | Ospedale Santa Maria della Stella (local) |
| Perugia | ~2h train | ~2h train | Azienda Ospedaliera (regional hub) |
| Assisi | ~2h train | ~2h train | Perugia hospital (25 min) |
| Spoleto | ~1h15 train | ~2h train | Ospedale San Matteo degli Infermi |
| Terni | ~1h train | ~2h30 train | Azienda Ospedaliera Santa Maria |
| Foligno | ~1h45 train | ~1h45 train | Ospedale San Giovanni Battista |
| Todi | ~1h30 car | ~1h30 car | Orvieto hospital (30 min) |
| Città di Castello | ~2h30 car | ~1h car | Ospedale Città di Castello |

**Interactive Elements:**

1. **Map Visualization** (Leaflet)
   - Show Rome and Florence as "anchor" points (large markers)
   - Draw the high-speed rail "spine" through Umbria
   - Town markers color-coded by closest major city
   - Click town → popup shows dual-city times + hospital

2. **Town Selector Cards**
   - Grid of town cards below the map
   - Each card shows: town name, Rome time, Florence time, nearest hospital
   - Highlight selected town on map

3. **Perugia Airport Feature Section**
   - Dedicated card/section for San Francesco d'Assisi Airport (PEG)
   - Tab toggle: Winter 2025-26 | Summer 2026
   - Flight destinations displayed as badges by airline

---

## Perugia Airport Data

**Winter 2025-26 (Oct 26 – Mar 28):**
- Ryanair: Cagliari, Catania, London Stansted, Palermo
- Wizz Air: Tirana

**Summer 2026 (Mar 29 – Oct 24):**
- Ryanair: Cagliari, Catania, London Stansted, Palermo, Barcelona (El Prat), Brindisi, Brussels Charleroi, Bucharest, Krakow, Malta
- Aeroitalia: Lamezia T., Olbia
- British Airways: London Heathrow
- Transavia: Rotterdam
- Wizz Air: Tirana
- Hello Fly: Lampedusa, Pantelleria

---

## UI Design

```text
+---------------------------------------------------+
|    THE ROME-FLORENCE CORRIDOR                     |
|    Umbria sits between Italy's two capitals       |
+---------------------------------------------------+
|                                                   |
|     [ Interactive Leaflet Map ]                   |
|     Rome (anchor) --- rail line --- Florence      |
|                   |                               |
|          Umbrian towns along corridor             |
|                                                   |
+---------------------------------------------------+
|  Select a town to see your dual-city access:      |
|                                                   |
|  [Orvieto] [Perugia] [Spoleto] [Terni] [Foligno]  |
|  [Assisi]  [Todi]    [Città di Castello]          |
|                                                   |
+---------------------------------------------------+
|  ORVIETO (selected)                               |
|  +-------------+  +-------------+                 |
|  | ROME        |  | FLORENCE    |                 |
|  | 1h train    |  | 1h30 train  |                 |
|  | Direct HS   |  | 1 change    |                 |
|  +-------------+  +-------------+                 |
|                                                   |
|  Nearest Hospital: Ospedale Santa Maria           |
|  Distance: In town (0 km)                         |
+---------------------------------------------------+
|                                                   |
|  ✈️ PERUGIA AIRPORT                               |
|  San Francesco d'Assisi (PEG)                     |
|                                                   |
|  [Winter 2025-26] [Summer 2026]                   |
|                                                   |
|  Ryanair: London, Barcelona, Catania...           |
|  British Airways: London Heathrow                 |
|  Wizz Air: Tirana                                 |
|                                                   |
+---------------------------------------------------+
```

---

## Files to Create/Modify

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/components/sections/UmbriaRomeFlorenceCorridor.tsx` | Main interactive component |
| Modify | `src/pages/RegionPage.tsx` | Add conditional render for Umbria |

---

## Integration with RegionPage

In `RegionPage.tsx`, add the new component in the Umbria-specific section, replacing or augmenting the healthcare infrastructure section:

```tsx
{region === 'umbria' && (
  <>
    <UmbriaChocolateCity />
    <UmbriaFestivalCalendar />
    <UmbriaLakeTrasimeno />
    <UmbriaRomeFlorenceCorridor />  // NEW
    <UmbriaNorciaTable />
    <UmbriaWineExplorer />
    <UmbriaRecipes />
  </>
)}
```

The component will be placed after UmbriaLakeTrasimeno and before UmbriaNorciaTable to maintain narrative flow (geography → activities → infrastructure → food/wine).

---

## Component Features Summary

1. **Header Section**
   - Title: "The Rome-Florence Corridor"
   - Subtitle: "Umbria sits between Italy's two capitals—use them both"
   - Editorial quote about dual-access advantage

2. **Interactive Map**
   - Rome and Florence as large anchor markers
   - High-speed rail line visualization
   - Umbrian towns positioned geographically
   - Click interaction for town selection

3. **Town Detail Cards**
   - Toggle/select buttons for each town
   - Selected town shows expanded dual-city times
   - Hospital information per town
   - Lifestyle one-liner

4. **Perugia Airport Section**
   - Season toggle (Winter/Summer)
   - Destinations grouped by airline
   - Direct flight count callout
   - Link to airport website

5. **Closing Statement**
   - Editorial wrap emphasizing the "corridor" positioning

---

## Technical Notes

- Use existing Leaflet setup from `InteractiveMap.tsx` and `MilanProximityTool.tsx` as patterns
- Rome coordinates: [41.9028, 12.4964]
- Florence coordinates: [43.7696, 11.2558]
- Umbria center: approximately [42.85, 12.45]
- Follow existing animation patterns with `useStaggeredReveal` hook
- Use existing UI components: Card, Badge, Button, Tabs from shadcn/ui

