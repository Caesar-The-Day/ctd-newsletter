
## Fix: Veneto Map — Strategic Reach, Natural Areas, Lead-in Text, and Overlay Colors

### Problems Found

**1. Strategic Reach does nothing**
The data uses `type: "radius"` with `radiusKm`, but the InteractiveMap component only understands `type: "circle"` with `radius` in **meters**. Also needs a 3rd ring for the full 1/2/3-hour concept. The overlay icon is set to `"Target"` which doesn't exist in the component's icon map.

**2. Natural Areas are dots, not shaded areas**
All 4 features use `type: "marker"` — so they render as small dots. They should be `type: "zone"` with polygon coordinates and shaded fills (like the wine regions). The icon `"Home"` (used by Livability) also isn't in the component's icon map.

**3. Lead-in text doesn't match the editorial narrative**
The current `tabs` content is generic geography/access text. It should be replaced with the 5-paragraph editorial narrative you provided.

**4. Overlay categories need distinct colors**
Currently UNESCO and Livability use default colors and are hard to distinguish. Each overlay should have a clear color identity.

**5. Missing Colli Euganei wine zone**
The wine overlay has 4 zones but Colli Euganei (mentioned in the original plan) is missing.

---

### Changes

**File: `public/data/regions/italy/veneto.json`** (data fixes only, no component changes)

1. **Replace `tabs` content** with the 5-paragraph editorial narrative ("Veneto sits in Italy's northeast corner..." through "Let's look at what that actually means on a map.")

2. **Fix Strategic Reach overlay**:
   - Change `"icon": "Target"` to `"icon": "Globe"` (exists in icon map)
   - Change both features from `type: "radius"` to `type: "circle"`
   - Convert `radiusKm` to `radius` in meters (80km = 80000, 120km = 120000)
   - Add 3rd ring: 3-hour reach at ~200km radius (Austria, Munich, Bologna, Milan)

3. **Fix Natural Areas overlay**:
   - Change `"icon": "Mountain"` stays (already in icon map -- good)
   - Convert all 4 features from `type: "marker"` to `type: "zone"` with polygon coordinates and distinct green shading
   - Dolomiti Bellunesi: Alpine polygon in dark forest green
   - Po Delta: Coastal wetland polygon in teal/blue-green
   - Colli Euganei: Compact hill polygon in olive green
   - Lessinia: Pre-Alpine plateau polygon in sage green

4. **Fix Livability Cities overlay**:
   - Change `"icon": "Home"` to `"icon": "MapPin"` (exists in icon map)

5. **Add Colli Euganei to Wine Regions overlay** as a 5th zone with distinct color

6. **Add `"MapPin"` to component icon map** (already imported but not in the map object)

**File: `src/components/sections/InteractiveMap.tsx`**
- Add `MapPin` to the `iconMap` object (it's already imported on line 4)

---

### Color Scheme per Overlay

| Overlay | Color Identity |
|---------|---------------|
| UNESCO World Heritage | Gold/Amber (#f59e0b) -- already uses heritage gold pulse |
| Wine Regions | Deep reds and golds (existing -- #722f37, #d4a843, etc.) |
| Transport Network | Red for rail (#ef4444), blue for airports (existing) |
| Natural Areas | Greens (#166534, #0d9488, #4d7c0f, #65a30d) |
| Livability Cities | Indigo/blue (#6366f1) |
| Strategic Reach | Blue to purple gradient rings (#3b82f6, #8b5cf6, #a855f7) |

---

### Files Changed
- **Updated**: `public/data/regions/italy/veneto.json` — tabs text, strategic reach fix, natural areas as zones, livability icon fix, Colli Euganei wine zone
- **Updated**: `src/components/sections/InteractiveMap.tsx` — add `MapPin` to icon map (1 line)

### What This Does NOT Touch
- No other region data files
- No structural changes to InteractiveMap component logic
- No changes to RegionPage.tsx or any other components
