

## Fix: Veneto Page Not Rendering

### Root Cause
The `/veneto` page crashes because there is no content data for the region. The loading chain:
1. Database `region_data` for veneto is `null`
2. Static file `/data/regions/italy/veneto.json` does not exist
3. Vite returns `index.html` (status 200) as its SPA fallback
4. `response.json()` fails on HTML content, throwing a SyntaxError
5. The error handler redirects to `/404`

### Fix 1: Harden `getRegionData.ts` (defensive fix)

Add a content-type check before calling `.json()` on the fetch response. This prevents the misleading "Unexpected token '<'" error and gives a clear "Failed to load region" message instead.

```typescript
// Before parsing, verify the response is actually JSON
const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('application/json')) {
  throw new Error(`Failed to load region: ${slug} (received HTML instead of JSON)`);
}
```

This applies to both the nested path (`/data/regions/italy/{slug}.json`) and the flat path (`/data/{slug}.json`) fallback.

### Fix 2: Create `public/data/regions/italy/veneto.json`

Create the main region data file following the same structure as piemonte.json, lombardia.json, and puglia.json. This file powers every section on the page: hero, editorial intro, map, towns, wine quiz, recipes, healthcare, cost of living, pros/cons, and closing.

The file will include:
- **region**: Title "Veneto", tagline, issue number 11, date "February 2026", hero image, intro paragraphs
- **where**: Map centered on Veneto with markers for key cities (Venice, Verona, Padua, Vicenza, Treviso, Cortina), geography tabs, and overlays
- **towns.featured**: 4-5 featured towns with images, descriptions, highlights (e.g., Verona, Padua, Venice surrounds, Treviso, Cortina)
- **towns.grid**: 10-15 grid towns covering the breadth of the region
- **wine.quiz**: Veneto wine profiles (Amarone, Prosecco, Valpolicella, Soave, etc.)
- **recipes**: 3-4 Veneto recipes (risotto, baccala, tiramisu, bigoli)
- **healthcare**: Hospitals, infrastructure, airports, railways, travel times
- **costOfLiving**: Town presets with rent/utilities/groceries/dining/transport for modest and comfortable lifestyles
- **highlights**: Wine, food, and culture categories with cards
- **prosCons**: Balanced pros and cons of retiring in Veneto
- **closing**: Closing message and social share links
- **collaborator**: Partner/service feature section

This is a large data file (~800-1000 lines) that will be populated with factually accurate, editorial-quality content matching the established tone and depth of the existing regions.

### Files Changed
- **Modified**: `src/utils/getRegionData.ts` -- add content-type guard (~5 lines)
- **Created**: `public/data/regions/italy/veneto.json` -- full region data (~900 lines)

### Verification
- Navigate to `/veneto` -- page renders with hero, editorial intro, map, climate snapshot, towns, and all sections
- No JSON parse errors in console
- Climate Snapshot shows the 4-city Veneto data with seasonal backgrounds
- All section components render without crashes (defensive null checks already in place from prior work)

