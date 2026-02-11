

## Veneto "Where Is Veneto?" Section -- Full Content and Map Overlay Update

### Overview
This is a database-only update (no code changes). We'll replace the intro tabs with your new copy, and add 6 map overlay layers with real coordinates to make the map argue your thesis: beauty + infrastructure + strategic access.

### Part 1: Replace the Intro Tabs
The current 3 tabs (Geography, Getting There, Local Transport) will be replaced with a single cohesive narrative block matching your copy. The `InteractiveMap` component renders tab content as paragraphs above the map -- your new text flows naturally through this.

### Part 2: Add Map Overlays
Using the existing overlay system (already supports `heritage`, `zone`, `airport`, `rail-hs`, `point`, `marker` feature types), we'll add 6 toggleable overlay layers:

1. **UNESCO World Heritage Sites** (heritage markers)
   - Venice and its Lagoon [45.4408, 12.3155]
   - Verona historic center [45.4384, 10.9916]
   - Vicenza and Palladian Villas [45.5455, 11.5354]
   - The Dolomites [46.4102, 11.8440]
   - Prosecco Hills of Conegliano-Valdobbiadene [45.9200, 12.0800]
   - Botanical Garden of Padua [45.3990, 11.8800]

2. **Wine Regions** (polygon zones)
   - Valpolicella [approximate polygon NW of Verona]
   - Prosecco DOCG Hills [polygon around Conegliano-Valdobbiadene]
   - Soave [polygon east of Verona]
   - Bardolino [polygon along Lake Garda shore]
   - Colli Euganei [polygon south of Padua]

3. **National Parks & Natural Areas** (zone polygons + point markers)
   - Dolomiti Bellunesi National Park
   - Parco Naturale della Lessinia
   - Colli Euganei Regional Park
   - Venetian Lagoon
   - Po Delta Park

4. **Transport Nodes** (airport markers + rail-hs lines)
   - Venice Marco Polo Airport (VCE) [45.5053, 12.3519]
   - Treviso Airport (TSF) [45.6484, 12.1944]
   - Verona Airport (VRN) [45.3957, 10.8885]
   - Milan-Venice high-speed rail corridor (polyline)
   - Brenner Pass route Italy-Austria (polyline)

5. **Livability Cities** (city markers with blurbs)
   - Padua, Vicenza, Treviso, Verona, Bassano del Grappa, Cortina d'Ampezzo, Chioggia
   - These already exist as town markers -- we'll enhance with `bestFor` categories in popup blurbs

6. **Strategic Positioning** (radius overlay)
   - Concentric circles from Padua showing 1hr train / 2hr drive reach
   - Implemented as circle polygons with labeled radii
   - Uses the existing `zone` feature type with semi-transparent fills

### Part 3: Implementation
A single SQL `UPDATE` statement using `jsonb_set` to:
- Replace `region_data->'where'->'tabs'` with your new intro copy
- Add `region_data->'where'->'map'->'overlays'` with the 6 overlay arrays

All coordinates are verified for Leaflet [lat, lng] order within Italy's 36-47 lat range.

### Technical Details

The SQL update will be structured as:

```sql
UPDATE regions 
SET region_data = jsonb_set(
  jsonb_set(
    region_data,
    '{where,tabs}',
    '[{
      "id": "positioning",
      "title": "Strategic Position",
      "content": "Veneto sits in Italy''s northeast corner, but don''t mistake that for \"out of the way.\" This region is plugged in.\n\nTo the north, the Dolomites rise fast and dramatic, forming a natural border with Austria. To the east, the Adriatic stretches toward Slovenia and Croatia. Lombardy and Lake Garda anchor the west. Emilia-Romagna and the Po River basin sit to the south. In other words, you''re positioned at a European crossroads.\n\nFrom Verona or Padua, Milan is a high-speed train ride away. Venice''s Marco Polo Airport connects you across the continent. Austria is a few hours by car. Munich is closer than Rome. If you''re thinking about retirement in terms of mobility, Veneto makes geographic sense.\n\nAnd within the region itself, the diversity is almost unfair. Sea. Alps. Wine hills. Renaissance cities. UNESCO sites. Industrial hubs. Sleepy walled towns. You can live in one Veneto and visit five others before dinner.\n\nLet''s look at what that actually means on a map."
    }]'::jsonb
  ),
  '{where,map,overlays}',
  '[ ... 6 overlay objects with all features ... ]'::jsonb
)
WHERE slug = 'veneto';
```

Each overlay follows the proven Umbria pattern:
- `id`, `name`, `icon`, `description` for the toggle button
- `features[]` array with typed map elements (`heritage`, `zone`, `airport`, `rail-hs`, `point`)

No component code changes needed -- `InteractiveMap` already handles all these feature types.

### What Changes
- **Database**: `regions` table, `region_data` JSONB for slug `veneto`
- **Code**: Nothing -- purely data-driven
- **Files**: None

### Verification
Navigate to `/veneto` and confirm:
- New intro text appears above the map
- 6 overlay toggle buttons appear below the text
- Each overlay renders its features correctly on the map
- Popups work on click for all feature types
