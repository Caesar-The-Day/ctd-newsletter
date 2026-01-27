

# Enhance Lake Trasimeno Section

## Overview
Improve the Lake Trasimeno recreation section by fixing the external link, replacing the static hero with an interactive map, and adding image placeholders to activity cards.

## Changes

### 1. Fix External Link
Update the Official Lake Trasimeno Guide URL from the current Umbria tourism link to the dedicated lake website.

**Current**: `https://www.umbriatourism.it/en/lake-trasimeno`  
**New**: `https://www.lagotrasimeno.net/en/`

### 2. Replace Hero Image with Interactive Map

The town badges overlaying the hero image feel disconnected. Replace this with a small, focused Leaflet/MapTiler map showing Lake Trasimeno with clickable town pins.

**Map Configuration:**
- Center: Lake Trasimeno coordinates (~43.10, 12.10)
- Zoom: ~11 (lake fills the view)
- 5 Town Markers with popups:
  - Passignano sul Trasimeno
  - Castiglione del Lago
  - Tuoro sul Trasimeno
  - Magione
  - San Feliciano

Each marker popup will show:
- Town name
- Brief description (water access type, notable feature)
- Key activities available there

**Technical approach:**
- Create a smaller, focused map component specifically for Lake Trasimeno
- Use the same Leaflet + MapTiler pattern from `InteractiveMap.tsx`
- Render inline where the hero image currently sits
- Add a subtle lake polygon overlay to highlight the water body

### 3. Add Image Placeholders to Activity Cards

Update the `Activity` interface and data to include an optional `imageUrl` field. Modify the card rendering to display the image at the top of each card.

**Updated Activity Interface:**
```typescript
interface Activity {
  name: string;
  description: string;
  icon: React.ElementType;
  location?: string;
  imageUrl?: string;  // NEW
}
```

**Card Layout with Image:**
```text
+---------------------------+
|  [Activity Image]         |  <- New: 160px height, object-cover
|  Full width, rounded top  |
+---------------------------+
|  [Icon] Activity Name     |
|  📍 Location              |
|  Description text...      |
+---------------------------+
```

**Placeholder Images:**
Using placeholder paths that you can later replace with real photos:
- `/images/umbria/trasimeno/windsurfing.jpg`
- `/images/umbria/trasimeno/kayaking.jpg`
- `/images/umbria/trasimeno/sailing.jpg`
- `/images/umbria/trasimeno/beaches.jpg`
- `/images/umbria/trasimeno/isola-maggiore.jpg`
- `/images/umbria/trasimeno/isola-polvese.jpg`
- `/images/umbria/trasimeno/cycling.jpg`
- `/images/umbria/trasimeno/hiking.jpg`
- `/images/umbria/trasimeno/horseback.jpg`
- `/images/umbria/trasimeno/golf.jpg`
- `/images/umbria/trasimeno/villages.jpg`
- `/images/umbria/trasimeno/winery.jpg`
- `/images/umbria/trasimeno/birdwatching.jpg`
- `/images/umbria/trasimeno/festival.jpg`

Until you provide real images, we'll use a graceful fallback: cards without valid images will display the icon-only version (current design).

## Visual Layout After Changes

```text
+------------------------------------------------------------------+
|  [Wave Icon]  Central Italy's Hidden Lake                         |
|                                                                   |
|  Lake Trasimeno: Your Backyard Playground                         |
|  One of only three large lakes in central Italy...                |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |          [INTERACTIVE MAPTILER MAP]                        |  |
|  |                                                            |  |
|  |    📍 Passignano    📍 Castiglione del Lago               |  |
|  |                                                            |  |
|  |           📍 Tuoro                                         |  |
|  |                     📍 Magione                             |  |
|  |                           📍 San Feliciano                 |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
|  [🌊 Water Sports] [🚢 Islands] [🚴 Land Sports] [🏰 Culture]      |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+  +------------------+  +------------------+ |
|  | [Windsurfing     |  | [Kayaking        |  | [Sailing         | |
|  |  Photo]          |  |  Photo]          |  |  Photo]          | |
|  |------------------|  |------------------|  |------------------| |
|  | 🏄 Windsurfing   |  | 🚣 SUP & Kayak   |  | ⛵ Sailing       | |
|  | Passignano...    |  | Multiple access  |  | Tuoro...         | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/sections/UmbriaLakeTrasimeno.tsx` | Update link, add imageUrl to data, create inline map, update card rendering |

## Town Marker Data

```typescript
const lakeTowns = [
  {
    name: 'Passignano sul Trasimeno',
    coords: [43.1872, 12.1352],
    description: 'Main watersports hub with ferry terminal, beaches, and bustling lakefront promenade.',
    activities: ['Windsurfing', 'Ferry to Islands', 'Swimming']
  },
  {
    name: 'Castiglione del Lago',
    coords: [43.1261, 12.0475],
    description: 'Largest lakeside town with imposing Rocca del Leone fortress and vibrant piazza.',
    activities: ['Medieval Castle', 'Wine Tasting', 'Kitesurfing']
  },
  {
    name: 'Tuoro sul Trasimeno',
    coords: [43.2091, 12.0708],
    description: 'Historic site of Hannibal\'s famous battle. Now a quiet town with ferry access.',
    activities: ['History Tours', 'Ferry to Isola Maggiore', 'Sailing']
  },
  {
    name: 'Magione',
    coords: [43.1392, 12.2047],
    description: 'Inland town with easy access to eastern beaches and La Valle birdwatching oasis.',
    activities: ['Birdwatching', 'Olive Oil Tasting', 'Cycling']
  },
  {
    name: 'San Feliciano',
    coords: [43.1081, 12.2167],
    description: 'Charming fishing village with ferry to Isola Polvese and the Fishing Museum.',
    activities: ['Ferry to Polvese', 'Fresh Lake Fish', 'Kayaking']
  }
];
```

## Implementation Notes

- The map will use the same MapTiler API key already configured (`VITE_MAPTILER_KEY`)
- Map will be non-scrollable by default to prevent accidental zoom while scrolling the page
- Town markers will use the same styling patterns as InteractiveMap.tsx for consistency
- Activity card images will have a fallback to show just the icon layout if the image fails to load

