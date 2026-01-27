

# Add Lake Trasimeno Recreation Section for Umbria

## Summary
Create a new interactive section called `UmbriaLakeTrasimeno` that showcases Lake Trasimeno as a major recreation destination. The section will highlight water activities, island exploration, outdoor sports, and cultural attractions around Italy's fourth-largest lake.

## Content Strategy

Lake Trasimeno is one of only three large lakes in central Italy, making it a significant draw for outdoorsy retirees. The section will be organized around **four activity categories**:

1. **Water Activities** - Windsurfing, kitesurfing, sailing, SUP, kayaking, swimming, beaches
2. **Island Exploration** - Isola Maggiore (fishing village, Lace Museum) and Isola Polvese (nature/education)
3. **Land Sports** - 58km cycling trail, hiking (Via del Trasimeno), horseback riding, golf
4. **Culture & Leisure** - Medieval villages, wineries, birdwatching, music festivals

## Design Approach

Following the existing Umbria component patterns:
- **Header badge** with lake/wave icon and "Central Italy's Hidden Lake" tagline
- **Hero statement** emphasizing the rarity (one of only 3 large lakes in central Italy)
- **Tabbed interface** for the four activity categories (similar to UmbriaChocolateCity)
- **Activity cards** with icons, descriptions, and practical details
- **Location badges** (Passignano, Castiglione del Lago, Tuoro, Magione, San Feliciano)
- **CTA link** to official tourism website

## Technical Implementation

### New File: `src/components/sections/UmbriaLakeTrasimeno.tsx`

```typescript
// Structure outline
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, Sailboat, Bike, Castle, MapPin, 
  ExternalLink, Ship, TreePine, Music
} from 'lucide-react';

// Activity category data
const categories = [
  { id: 'water', label: 'Water Sports', icon: Waves },
  { id: 'islands', label: 'Islands', icon: Ship },
  { id: 'land', label: 'Land Sports', icon: Bike },
  { id: 'culture', label: 'Culture', icon: Castle }
];

// Detailed activities per category
const waterActivities = [
  { name: 'Windsurfing & Kitesurfing', description: 'Shallow, windy conditions ideal for...' },
  { name: 'SUP & Kayaking', description: 'Explore calm scenic coast...' },
  // ... beaches, sailing, motorboats
];

// ... islands, land activities, cultural activities
```

### Component Features

1. **Hero Image**: Uses existing `/images/umbria/lake-trasimeno.jpg`
2. **Interactive Tabs**: Four category tabs with animated transitions
3. **Activity Cards**: Grid of 3-4 activities per category with icons
4. **Town Badges**: Quick reference to access points (Passignano, Castiglione del Lago, etc.)
5. **External Link**: Official Umbria tourism lake page

### Integration in RegionPage.tsx

Add the new component to the Umbria section block (around line 356):

```tsx
{region === 'umbria' && (
  <>
    <UmbriaChocolateCity />
    <UmbriaFestivalCalendar />
    <UmbriaLakeTrasimeno />  {/* NEW - after festivals, before Norcia */}
    <UmbriaNorciaTable />
    <UmbriaWineExplorer />
    <UmbriaRecipes />
  </>
)}
```

## Content Details

### Water Activities Tab
| Activity | Details |
|----------|---------|
| Windsurfing & Kitesurfing | Shallow, windy lake; schools in Passignano & Castiglione del Lago |
| SUP & Kayaking | Calm waters perfect for beginners; scenic shoreline |
| Sailing | Sailboat rentals; multiple marinas |
| Beaches | Zocco Beach, Sualzo Beach, San Feliciano (Magione) |
| Swimming | Warm shallow waters; designated swimming areas |

### Islands Tab
| Island | Highlights |
|--------|------------|
| Isola Maggiore | 15th-century fishing village, Romanesque church, Lace Museum, charming walks |
| Isola Polvese | Nature reserve, educational programs, scientific activities, hiking trails |

### Land Sports Tab
| Activity | Details |
|----------|---------|
| Cycling | Pista ciclabile del Trasimeno - 58km dedicated shoreline trail |
| Hiking | La Via del Trasimeno and surrounding hill trails |
| Horseback Riding | Equestrian tours from local stables (Asd Bv Ranch) |
| Golf | Lamborghini Golf Club - 18-hole course near the lake |

### Culture Tab
| Attraction | Description |
|------------|-------------|
| Medieval Villages | Castiglione del Lago (Rocca del Leone), Panicale, Città della Pieve |
| Wine Tasting | Local wineries like Cantina Berioli |
| Birdwatching | La Valle naturalistic oasis - wetlands wildlife |
| Events | Trasimeno Music Festival, Blues Festival |

## Visual Layout

```text
+------------------------------------------------------------------+
|  [Wave Icon]  Central Italy's Hidden Lake                         |
|                                                                   |
|  Lake Trasimeno: Your Backyard Playground                         |
|  One of only three large lakes in central Italy — and the most    |
|  accessible for outdoor recreation, island hopping, and village   |
|  life within Umbria.                                              |
+------------------------------------------------------------------+
|                                                                   |
|  [🌊 Water Sports] [🚢 Islands] [🚴 Land Sports] [🏰 Culture]      |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------------+  +-------------------+  +------------------+|
|  | 🏄 Windsurfing    |  | 🚣 SUP & Kayak   |  | ⛵ Sailing       ||
|  | Shallow windy...  |  | Calm scenic...   |  | Rentals at...   ||
|  +-------------------+  +-------------------+  +------------------+|
|                                                                   |
|  +-------------------+  +-------------------+                     |
|  | 🏖️ Beaches        |  | 🏊 Swimming       |                     |
|  | Zocco, Sualzo...  |  | Designated...    |                     |
|  +-------------------+  +-------------------+                     |
|                                                                   |
|  Access Points: [Passignano] [Castiglione] [Tuoro] [Magione]      |
|                                                                   |
|  [Visit Official Lake Guide →]                                    |
+------------------------------------------------------------------+
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/sections/UmbriaLakeTrasimeno.tsx` | Create new component |
| `src/pages/RegionPage.tsx` | Add import and render in Umbria block |

## Styling Notes

- Background gradient: `bg-gradient-to-b from-blue-50/50 to-background` (lake theme)
- Accent color: Blue palette (`text-blue-600`, `bg-blue-100`)
- Card hover effects consistent with other Umbria sections
- Responsive: Grid adjusts from 3 columns to 2 to 1 on smaller screens

