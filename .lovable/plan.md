

# Fix: Make Region Scaffolding Actually 80% Complete

## The Problem

The AI research function generates good editorial content but the data it produces doesn't match the shapes the existing components expect. The merge logic in `AdminRegions.tsx` also drops or ignores large chunks of what the AI *does* return. The result is a page that looks broken: missing images, placeholder text, empty sections, and data format mismatches.

## Diagnosis: What's Missing vs What Exists

| Section | AI Research Provides | Component Needs | Status |
|---------|---------------------|-----------------|--------|
| Hero image | Prompt text | Actual image file | No image generated/stored |
| Editorial intro | Full 5 paragraphs | paragraphs[] | Working |
| Map markers | Town coordinates | coords, photo, blurb | Working (photos missing) |
| Geography tabs | Nothing | 3 tab descriptions | Placeholder text |
| Climate | Nothing | Monthly data per city | Generic template only |
| Featured towns | name, bestFor, summary, fullDescription, highlights | id, name, bestFor, photo, summary, mapUrl, gallery | Missing id, photo, mapUrl, gallery |
| Grid towns | name, bestFor, blurb | id, name, bestFor, photo, mapUrl, blurb | Missing id, photo, mapUrl |
| Highlights (wine/food/culture) | title, description | id, title, subtitle, image, description, links | Missing id, subtitle, image, links |
| Airports | name, code, city | Full airport objects with coords, links | AI returns data but merge drops it |
| Railways | Nothing | name, description, link | Not requested |
| Highways | Nothing | name, description, link | Not requested |
| Parks | Nothing | name, coords, description, link | Not requested |
| Travel times | Nothing | from/to matrix | Not requested |
| Cost calculator | modest/comfortable/premium flat numbers | Nested {rent, utilities, groceries, dining, transport} per lifestyle | Wrong format |
| Recipes | Nothing | Full recipe cards with ingredients, steps | Not requested from AI |
| Wine quiz | Nothing | Quiz profiles with results | Not requested from AI |
| Closing | Template text | Editable message | Placeholder only |

## Fix Plan (3 files)

### 1. Expand the AI Research Prompt (`supabase/functions/research-region/index.ts`)

Add these sections to the research request so the AI generates data for the fields that are currently empty:

- **Geography tabs**: Ask for 3 geography/access/transport descriptions (real content, not placeholders)
- **Climate data**: Ask for monthly climate data for 2-3 cities in the region (avgHigh, avgLow, precipitation, sunnyDays)
- **Airports**: Already requested but need coords and links
- **Railways**: Ask for major rail lines/stations
- **Highways**: Ask for major autostrada connections
- **National parks**: Ask for parks/nature reserves with coordinates
- **Travel times**: Ask for travel time matrix (major towns to each other and to nearest airports/major cities)
- **Cost of living breakdown**: Change from flat numbers to itemized breakdown (rent, utilities, groceries, dining, transport)
- **Recipes**: Ask for 2-3 signature regional recipes with ingredients and steps
- **Wine quiz profiles**: Ask for 4 wine personality profiles with results
- **Map overlays**: Ask for actual overlay feature data (wine DOC regions, parks, UNESCO sites) with polygon/marker coordinates

Update the JSON schema in the system prompt to match these additions.

### 2. Fix the Data Merge Logic (`src/pages/AdminRegions.tsx`)

The `handleWizardComplete` function currently does a shallow merge that drops most AI research data. Rewrite the merge to:

- **Featured towns**: Generate `id` from name slug, set `photo` to placeholder path, generate `mapUrl` from coordinates, set `gallery` to empty array, map `fullDescription` properly
- **Grid towns**: Generate `id` from name slug, set `photo` to placeholder path, generate `mapUrl` from coordinates
- **Highlights cards**: Generate `id` from title slug, add `subtitle` from grape variety or type, set `image` to empty string, add empty `links` array
- **Airports**: Map AI airport data into the full object shape with coords and links
- **Cost of living**: Transform flat budget numbers into the itemized breakdown format the CostCalculator expects (split total into estimated rent/utilities/groceries/dining/transport percentages)
- **Geography tabs**: Populate from AI research instead of leaving placeholders
- **Climate data**: Merge AI climate data into the climate_data field
- **Recipes**: Map AI recipe data into the recipe card format
- **Wine quiz**: Map AI wine profiles into quiz format
- **Closing section**: Use AI-generated closing content instead of template placeholder

### 3. Fix the Scaffold Template (`supabase/functions/scaffold-region/index.ts`)

Update the template to provide better defaults that won't crash components when AI data is missing:

- Set `where.tabs` content to meaningful defaults instead of "Add geography description..."
- Set `closing.message` to a real template message
- Add empty but correctly-shaped arrays for recipes, wine quiz, etc.

## What This Achieves

After these changes, running the wizard for a new region will produce:
- Real editorial content in every text section
- Properly shaped data for all components (no crashes, no placeholder text)
- Geography, infrastructure, and climate sections populated with factual data
- Recipe cards with real ingredients and steps
- Wine quiz with regional wine profiles
- Cost calculator with itemized breakdowns
- Map with overlays for wine regions, parks, and UNESCO sites

The page won't have real images (those still need to be sourced/generated separately), but every text-based section will be substantive and editable.

## Technical Details

### Research Prompt Additions (research-region)

The system prompt's JSON schema will be extended with these new top-level keys:

```text
geographyTabs: [
  { id: "geography", title: "Geography", content: "2-3 paragraphs..." },
  { id: "access", title: "Getting There", content: "2-3 paragraphs..." },
  { id: "transport", title: "Local Transport", content: "2-3 paragraphs..." }
]

climate: {
  cities: [
    { name: "CityName", months: [ { name, avgHigh, avgLow, precipitation, sunnyDays } x12 ] }
  ]
}

infrastructure: {
  airports: [{ name, code, city, coords: {lat,lng}, distanceFromCapital }],
  railways: [{ name, description }],
  highways: [{ name, description }],
  parks: [{ name, coords: {lat,lng}, description }],
  travelTimes: [{ from, destinations: [{to, time}], nearestAirport }]
}

recipes: [
  { title, mode: "rustic"|"refined", story, ingredients[], steps[], winePairing }
]

wineQuiz: {
  profiles: [
    { id, label, result: { name, note } }
  ]
}
```

### Merge Logic Shape Transforms (AdminRegions.tsx)

Key transforms in `handleWizardComplete`:

```text
AI featured town --> Component featured town:
  { name, coordinates, bestFor, summary, fullDescription, highlights }
  -->
  { id: slugify(name), name, bestFor, photo: "/images/{slug}/{town-slug}.jpg",
    summary, fullDescription, mapUrl: google-maps-link, gallery: [], highlights }

AI highlight card --> Component highlight card:
  { title, description, grapeVariety }
  -->
  { id: slugify(title), title, subtitle: grapeVariety, image: "", description, links: [] }

AI cost preset --> Component cost preset:
  { town, modest: 1600, comfortable: 2400, premium: 3500 }
  -->
  { id: slugify(town), label: town,
    modest: { rent: 600, utilities: 150, groceries: 300, dining: 200, transport: 100 },
    normal: { rent: 800, ... }, highEnd: { rent: 1200, ... } }
```

### Deploy

Redeploy `research-region` and `scaffold-region` after changes.

## Impact on Existing Regions

None -- this only changes how NEW regions are scaffolded. Existing Veneto data in the database is untouched. To fix the current Veneto, the wizard would need to be re-run, or the data manually updated in the database.

