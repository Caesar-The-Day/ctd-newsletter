## Add Calabria Map Layers

Add four toggleable overlays to the Calabria map. The `InteractiveMap` component already supports all the required feature types (`zone`, `heritage`, `airport`, `ferry`) and auto-renders toggle buttons for any `overlays` array on `region_data.where.map`. So this is a pure data update — no component changes required.

### What gets added (single SQL update on `regions.region_data` for Calabria)

Append a `where.map.overlays` array with four entries:

**1. National Parks** (icon: `Mountain`)
Three `type: "zone"` polygon features with realistic boundary outlines (forest-green fill):
- **Sila National Park** — central plateau, lakes & forests, cool summer escape
- **Aspromonte National Park** — wild southern interior massif above Reggio
- **Pollino National Park** — Italy's largest, straddling the Calabria/Basilicata border in the north

Each polygon gets a `name`, `description` (with retiree-relevant context like elevation/summer-cooling) and `photo` from `/images/calabria/`.

**2. Historic & Cultural Sites** (icon: `Landmark`)
`type: "heritage"` markers (gold ring styling) for:
- **Cattolica di Stilo** — 9th-century Byzantine church
- **National Archaeological Museum of Reggio Calabria** — home of the Riace Bronzes
- **Archaeological Park of Sybaris** — Magna Graecia ruins
- **Capo Colonna (Crotone)** — surviving Doric column of the Temple of Hera Lacinia
- **Rossano Cathedral & Codex Purpureus** — UNESCO Memory of the World manuscript
- **Gerace Cathedral** — Norman/Romanesque, largest in Calabria
- **Le Castella (Isola di Capo Rizzuto)** — Aragonese sea castle

Each marker has `name`, `timeCapsule` (one-line evocative description), and `website` where a real URL is known.

**3. Airports** (icon: `Plane`)
`type: "airport"` markers with IATA code badges:
- **Lamezia Terme (SUF)** — main international hub, central coast
- **Reggio Calabria (REG)** — southern tip, mostly domestic
- **Crotone Sant'Anna (CRV)** — small Ionian airport, seasonal

**4. Ferry & Sicily Connectivity** (icon: `Anchor`)
`type: "ferry"` animated dashed routes plus port markers:
- Villa San Giovanni ⇄ Messina (Sicily) — every ~20 min, the workhorse
- Reggio Calabria ⇄ Messina — passenger ferry / aliscafo
- Tropea/Vibo Marina ⇄ Aeolian Islands (seasonal)
- Reggio Calabria ⇄ Salerno / Naples (summer GNV/Caremar coastal hops)

Each ferry feature gets `coords` (origin → destination polyline) and a `description` covering frequency, duration, and operator where known.

### Files Modified
- One SQL `UPDATE` on the `regions` row where `slug = 'calabria'`, merging the new `overlays` array into `region_data.where.map` (preserving the existing markers, center, zoom, and externalMapUrl).

No code changes — no migration, no edge function changes. The toggle UI, popups, and layer rendering are already wired up generically in `InteractiveMap.tsx`.

### Note on future regions
A separate follow-up (not part of this plan) would be to update `supabase/functions/research-region/index.ts` so the AI generates an `overlays` array automatically for new regions. We can tackle that next if you want — but for now, this fix gets Calabria's map fully layered without touching the wizard pipeline.