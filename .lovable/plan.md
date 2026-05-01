
## Problem

`ClimateSnapshot` only ever reads from `/data/regions/italy/{slug}-climate.json`. There is no Calabria file, so the component falls back to **`/data/piemonte-climate.json`** — that's why Calabria currently shows Piemonte's headline, paragraphs, hover quote, Turin/Alba/Verbania/Cuneo toggles, and Piemonte cultural events.

Three structural gaps make this happen on every new region:

1. **ClimateSnapshot never queries the database.** The wizard does write a `climate_data` JSONB row, but the component ignores it.
2. **The schema written by the wizard is wrong.** `scaffold-region` builds a stub like `{ intro:{headline,lead}, months:[{name,avgHigh,avgLow,...}] }`, but the component expects `{ intro:{headline,tagline,paragraphs[],hoverQuote,ctaText}, regions:{key:{name,type,palette}}, months:[{month,index,season,<regionKey>:{tempLow,tempHigh,rainfall,sunHours},tooltip,culturalEvent,visualCue}] }`. Even when merged, the data can't drive the UI.
3. **`research-region` only returns one city's flat monthly highs/lows.** It doesn't produce the per-city / per-month matrix, intro narrative, cultural events, or toggleable city set the component needs.

## Solution

Make Climate Snapshot a fully region-driven module by (a) fixing the AI research output, (b) writing the correct schema into the DB, (c) having the component read it from the DB with static JSON as fallback, and (d) backfilling Calabria so it works today.

### 1. Expand `research-region` AI output for climate

In `supabase/functions/research-region/index.ts`, replace the current `climate.cities[].months[]` schema with a `climateSnapshot` block matching what the component actually consumes:

```json
"climateSnapshot": {
  "intro": {
    "headline": "Climate Snapshot: A Year in <Region>",
    "tagline": "<one-line poetic hook>",
    "paragraphs": ["...", "...", "..."],
    "hoverQuote": "<short editorial line>",
    "ctaText": "Slide through the seasons →"
  },
  "regions": {
    "<slug1>": { "name": "<City>", "type": "city|coastal|mountain|...", "palette": "urban|coastal|alpine|vineyard" },
    "<slug2>": { ... },
    "<slug3>": { ... },
    "<slug4>": { ... }
  },
  "months": [
    {
      "month": "January", "index": 0, "season": "winter",
      "<slug1>": { "tempLow": 5, "tempHigh": 12, "rainfall": 110, "sunHours": 4 },
      "<slug2>": { ... }, "<slug3>": { ... }, "<slug4>": { ... },
      "tooltip": "<short month feel>",
      "culturalEvent": "<real event>",
      "culturalEventUrl": "<optional url>",
      "visualCue": "<short visual descriptor>"
    },
    ... 12 entries
  ]
}
```

Prompt instructs the model to: pick **3–4 climatically distinct featured towns from the region's actual featured/grid list** (e.g. for Calabria: Cosenza, Reggio Calabria, Tropea, Catanzaro), give realistic monthly numbers per town, and write Cesare-voiced intro paragraphs specific to the region.

### 2. Write the correct schema in `scaffold-region`

In `supabase/functions/scaffold-region/index.ts`, replace `buildClimateTemplate` so the stub already matches the component's shape (empty `regions:{}`, 12 months with `month/index/season/tooltip/culturalEvent/visualCue` and no city keys yet). Stub keeps the row valid even before research populates it.

### 3. Merge AI climate properly in `AdminRegions.tsx`

Replace the current narrow merge (lines 153–160) with:
```ts
const finalClimateData = wizardData.research?.climateSnapshot
  ? wizardData.research.climateSnapshot
  : result.data.climateData;
```
So the AI-generated rich snapshot fully replaces the stub when present.

### 4. Make `ClimateSnapshot` read from the database

In `src/components/sections/ClimateSnapshot.tsx`, change the data load to:
1. Query `regions.climate_data` for the current slug from Supabase.
2. If present and has `regions` + `months`, use it.
3. Else fall back to `/data/regions/italy/{slug}-climate.json`.
4. Else fall back to `/data/piemonte-climate.json` (existing behavior, preserved as last-ditch).

This means future regions never need a static climate JSON file — the DB row is the source of truth.

### 5. Generalize seasonal background palette/images

The component currently hard-codes `seasonalBackgroundsPiemonte/Puglia/Umbria` and `seasonalImagesPiemonte/Puglia/Umbria`, so any new region falls back to Piemonte's palette and Piemonte's seasonal photos. Change selection logic to:
- Build the palette from the region's generated theme (already stored in `regions.region_data` as `seasonalBackgrounds`) when available, else use a neutral default gradient set.
- Use `/images/{slug}/seasonal-backgrounds/{season}-landscape.jpg` if those files exist (the image generation pipeline already targets that path); otherwise omit the photo layer and rely on the gradient. No more silent Piemonte fallback.

### 6. Backfill Calabria today

Run the updated `research-region` (or generate inline) to produce a Calabria `climateSnapshot` with 4 featured towns (Cosenza — inland hills, Reggio Calabria — Strait coast, Tropea — Tyrrhenian beach, Catanzaro — capital), 12 months of realistic data, real cultural events (e.g. Tarantella festivals, Madonna della Montagna, Estate Tropeana), and Cesare-voiced intro. Write it into `regions.climate_data` for `slug='calabria'` via the insert tool.

### Files to modify

- `supabase/functions/research-region/index.ts` — expand prompt + JSON schema with `climateSnapshot`
- `supabase/functions/scaffold-region/index.ts` — fix `buildClimateTemplate` shape
- `src/pages/AdminRegions.tsx` — merge full `climateSnapshot` into `climate_data`
- `src/components/sections/ClimateSnapshot.tsx` — DB-first loader, generalized seasonal palette/images
- DB row for `slug='calabria'` — backfill `climate_data` with rich Calabria snapshot

### Why this is safe

- Static JSON files (`piemonte-climate.json`, `puglia-climate.json`, `umbria-climate.json`, `veneto-climate.json`, `lombardia-climate.json`) remain untouched and are still used as fallback for those regions.
- The DB-first loader reads `regions.climate_data` only when it has the new shape (`regions` keys + `months` with city sub-objects); otherwise it falls back, so Lombardia/Piemonte/Puglia (which have `false` or wrong-shape DB climate) still work via static JSON.
- Component-level changes are additive; no shared section component changes signature.
