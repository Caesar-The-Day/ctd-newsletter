

## Fix: Strategic Reach Overlay -- Circles Instead of Squares

### Problem
The "Strategic Reach" overlay uses rectangular polygon coordinates, which Leaflet renders as squares. Two issues:
1. The outer square covers the inner square, making it unclickable
2. The square boundaries don't match the actual travel radii (Milan and Florence are listed in the popup but fall outside the square)

### Solution
Two changes needed:

**1. Add `circle` feature type to InteractiveMap.tsx**

The component currently handles `zone` (polygon), `line`, `heritage`, `airport`, `rail-hs`, `point`, and `marker` types. We'll add a `circle` type that uses Leaflet's `L.circle(center, { radius })`.

Key detail: the inner circle (1-hour) must be added **after** the outer circle (2-hour) so it renders on top and remains clickable. We'll sort circle features by radius descending before adding them to the layer group.

```typescript
} else if (feature.type === 'circle') {
  const circle = L.circle(feature.center, {
    radius: feature.radius,
    fillColor: feature.color,
    fillOpacity: 0.12,
    color: feature.color,
    weight: 2,
    opacity: 0.6,
    dashArray: '8, 6'
  }).addTo(layerGroup);
  
  circle.bindPopup(popupContent, { ... });
  circle.on('mouseover', ...);
  circle.on('mouseout', ...);
}
```

The dashed stroke gives it a "radius ring" feel rather than a hard border.

**2. Update database data for the strategic overlay**

Replace the two rectangular `zone` features with two `circle` features centered on Padua:

- **1-Hour Train**: center `[45.4064, 11.8768]` (Padua), radius `~75,000m` (covers Venice, Verona, Vicenza, Treviso, Bologna)
- **2-Hour Drive/Train**: center `[45.4064, 11.8768]`, radius `~180,000m` (covers Milan, Florence, Innsbruck, Ljubljana, Lake Garda)

```sql
UPDATE regions 
SET region_data = jsonb_set(
  region_data,
  '{where,map,overlays,5,features}',
  '[
    {
      "type": "circle",
      "name": "2-Hour Drive / Train Reach",
      "center": [45.4064, 11.8768],
      "radius": 180000,
      "color": "#8b5cf6",
      "description": "Within two hours: Milan (2h15 train), Florence (2h via Bologna HS), Innsbruck (3h drive via Brenner), Ljubljana (2.5h drive), Lake Garda (1.5h). Europe is at your doorstep."
    },
    {
      "type": "circle",
      "name": "1-Hour Train from Padua",
      "center": [45.4064, 11.8768],
      "radius": 75000,
      "color": "#3b82f6",
      "description": "Within one hour by train: Venice (26 min), Verona (58 min), Vicenza (18 min), Treviso (35 min), Bologna (1h05). This is your daily-life radius."
    }
  ]'::jsonb
)
WHERE slug = 'veneto';
```

Note: The 2-hour circle is listed first in the array but we'll sort by radius descending in the rendering code, ensuring the smaller circle is always drawn on top regardless of data order.

### Files Changed
- `src/components/sections/InteractiveMap.tsx` -- add ~25 lines for `circle` feature type handling
- Database: `regions.region_data` for slug `veneto` -- replace strategic overlay features

### Verification
- Navigate to `/veneto`, scroll to the map, toggle "Strategic Reach"
- Two concentric dashed circles appear centered on Padua
- Inner blue circle (1-hour) is clickable and shows popup
- Outer purple circle (2-hour) is clickable and shows popup
- Milan and Florence fall within the outer circle's visual boundary
