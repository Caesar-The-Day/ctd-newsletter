

## Fix: Restore Veneto Region Data

### Root Cause
Veneto's content lived exclusively in the database (`regions.region_data` JSONB column). After the revert, that field is now `null`. Unlike Piemonte, Puglia, Lombardia, and Umbria -- which all have static JSON fallback files -- Veneto never had one. No static file + no database content = crash.

### Scope of Impact
- **Piemonte**: Unaffected (has `piemonte.json` static file, database is fine)
- **Puglia**: Unaffected (has `puglia.json` static file, database is fine)
- **Lombardia**: Unaffected (has `lombardia.json` static file, database is fine)
- **Umbria**: Unaffected (has `umbria.json` static file, database is fine)
- **Veneto**: Broken -- the ONLY affected region
- **Homepage / Newsletter Index**: Unaffected

### What We Need to Rebuild
Create `public/data/regions/italy/veneto.json` with all the section data the `RegionPage` component expects. This includes:

1. **region** -- hero image, title ("Veneto"), tagline, issue number, date, intro (headline, byline, paragraphs, portrait, signature)
2. **where** -- the map data and tabs we already wrote to the database (will recreate from the SQL we ran)
3. **collaborator** -- heading, paragraphs, CTA (can use placeholder or skip via feature flags)
4. **towns** -- featured towns array and grid towns array
5. **wine** -- quiz profiles for Veneto wines
6. **recipes** -- Veneto recipe cards
7. **healthcare** -- hospitals, airports, infrastructure
8. **costOfLiving** -- town presets with cost data
9. **highlights** -- wine, food, culture categories
10. **prosCons** -- pros and cons arrays
11. **closing** -- share message and social links

### Implementation Plan

**Step 1**: Create `public/data/regions/italy/veneto.json` with the full region data structure. This will include:
- The intro and map content we previously wrote to the database (we have the exact copy from our earlier SQL statements)
- Scaffolded placeholder data for sections not yet written (towns, recipes, healthcare, cost of living, etc.) using the same structure as other regions
- The map overlays (UNESCO, wine regions, transport, parks, livability cities, strategic reach) from our earlier database update

**Step 2**: Also restore the database `region_data` to match, so both sources are in sync. This prevents future issues if the code path checks the database first.

**Step 3**: Update feature flags and section order configs for Veneto to control which sections are visible (hiding sections with placeholder data).

### What This Does NOT Touch
- No changes to any component code
- No changes to any other region's data files
- No changes to `RegionPage.tsx`, `getRegionData.ts`, or `InteractiveMap.tsx`
- No changes to Piemonte, Puglia, Lombardia, or Umbria files or database entries

### Files Changed
- **Created**: `public/data/regions/italy/veneto.json` (new static fallback file)
- **Updated**: `public/data/config/feature-flags.json` (add Veneto entry)
- **Updated**: `public/data/config/section-order.json` (add Veneto entry)
- **Database**: `regions` table -- restore `region_data` for slug `veneto`

### Verification
- Navigate to `/veneto` -- page loads without crash
- Hero, Editorial Intro, Map, and Climate sections render with real content
- Other sections render with placeholder data or are hidden via feature flags
- Navigate to `/piemonte`, `/puglia`, `/lombardia`, `/umbria` -- all still work perfectly
- Homepage (`/`) loads normally

