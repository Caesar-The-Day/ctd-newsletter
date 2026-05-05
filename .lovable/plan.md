# Calabria Connectivity Map

Add a rich, interactive map to the **Infrastructure → Connectivity** tab of the Calabria page, replacing/augmenting the current text-only Travel Times cards.

## What it shows

A Leaflet map of Calabria (centered ~Lamezia, the geographic pivot) with layered visual data:

```text
        ✈ Lamezia (SUF)
       ●───────────●         concentric rings:
      ●  30 / 60 / 120 min  ●   drive-time bands
       ●───────────●
   ✈ Reggio (REG)        ⚓ Villa S.G. → Messina ferry
      ⚓ Vibo Marina        ⚓ Tropea (seasonal Aeolian)
      ▬▬▬ Tyrrhenian rail line (Salerno ↔ Reggio)
      ▬▬▬ Ionian rail line (Taranto ↔ Reggio, slower)
```

### Map layers (toggleable)
1. **Hubs** — Lamezia, Cosenza, Catanzaro, Reggio Calabria
2. **Drive-time rings** — concentric circles around Lamezia at 30 / 60 / 120 minutes (≈ 30 / 60 / 110 km)
3. **Airports** — Lamezia (SUF), Reggio (REG), with seasonal route notes; nearest external hubs (Naples NAP, Bari BRI) shown as off-map chips
4. **Ferry ports** — Villa San Giovanni (24/7 Messina shuttle), Reggio (Messina/Aeolian), Vibo Marina, Tropea (seasonal Aeolian Islands)
5. **Rail lines** — Tyrrhenian high-speed corridor (Frecce/Intercity) vs Ionian regional line, plus key stations
6. **A2 / SS106 highways** — Salerno–Reggio autostrada and the Ionian SS106

### Travel-time panel (right side / below map on mobile)
Click any hub → side panel shows times to:
- **Rome** (train + drive + fly)
- **Naples** (train + drive)
- **Florence** (train + fly)
- **Milan** (fly + train)
- Plus Sicily access (ferry + drive Messina/Catania/Palermo)

Format per row: mode icon · duration · operator/notes (e.g. "Frecciargento · 4h 40m · direct").

### Suggested useful additions
- **"From here" selector** — pick origin town (Tropea, Cosenza, Reggio, Catanzaro, Scilla) and rings + matrix recompute relative to that town
- **Mode filter chips** — Plane / Train / Ferry / Car toggles to declutter
- **Reality-check callouts** — small info pins on known pain points (e.g. SS106 single-carriageway stretches, Ionian line slowness, winter Aeolian ferry gaps)
- **Border crossings to Sicily** — animated dashed line across the Strait showing 20-min ferry frequency
- **Legend with frequency badges** — "hourly", "daily", "seasonal" so users grasp practical reliability, not just existence
- **Distance scale + retiree-friendly footnote** — e.g. "Lamezia airport sits within a 1-hour drive of ~70% of Calabrian coastal towns"

## Technical changes

1. **New component** `src/components/sections/CalabriaConnectivityMap.tsx`
   - Uses `react-leaflet` patterns already in `PugliaCityReachMap.tsx` (Leaflet is already a dependency)
   - Concentric circles via `L.circle` (reuse pattern from `MilanProximityTool` / map-concentric-circle-logic memory: sort largest→smallest, render with decreasing opacity so smaller rings stay clickable)
   - Custom `divIcon` markers for airport ✈, ferry ⚓, train 🚆, hub ●
   - Polylines for rail corridors (Tyrrhenian solid, Ionian dashed)
   - Local data file inside the component (cities, airports, ferries, rail nodes, travel matrix) — no DB schema change needed

2. **Wire into page** in `src/components/sections/HealthcareInfrastructure.tsx`
   - In the `connectivity` `TabsContent`, when `region === 'calabria'`, render `<CalabriaConnectivityMap />` above the existing `travelTimes` cards (keep the cards as a textual fallback / detail layer)

3. **Data**
   - All travel times, ferry routes, airport route notes hard-coded in the new component (same approach as `PugliaCityReachMap`). No migration / no `region_data` edits required.

4. **Styling**
   - Use existing semantic tokens (`primary`, `accent`, `muted`) so the Calabria generated theme (terracotta / sea-blue / peperoncino / bergamot) flows through naturally
   - Respect retiree-honesty editorial tone in callouts (functional realities, not romance)

## Out of scope
- No changes to other regions' connectivity tabs
- No new database tables or migrations
- No changes to the shared `travelTimes` data shape
