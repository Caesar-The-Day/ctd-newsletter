# Consolidate Molise Layers into the Existing Map

You're right — `InteractiveMap` already has a full overlay/layer system (`whereData.map.overlays[]` with toggleable layer chips, polygons, lines, special markers, airports, etc.). The Molise scaffold just didn't include any overlays, so I built a parallel map instead of feeding data into the existing one. Fixing that now.

## What changes

1. **Remove** `src/components/sections/MoliseDiscoveryMap.tsx`.
2. **Remove** the `{region === 'molise' && <MoliseDiscoveryMap />}` render and its import in `src/pages/RegionPage.tsx`.
3. **Add overlays to Molise's `where.map`** in the `regions` table (via migration update on the JSONB column). Same content as the discarded component, mapped to the existing `feature.type` values that `InteractiveMap` already renders:
   - **UNESCO & Heritage** — `marker` features for Saepinum (Altilia), Pietrabbondante, Larino amphitheatre, San Vincenzo al Volturno, Agnone bell foundry.
   - **Wine Zones** — `zone` polygons for Tintilia del Molise DOC, Biferno DOC, Pentro di Isernia DOC.
   - **Parks & Nature** — `zone` polygons for PN Abruzzo-Lazio-Molise (Mainarde sector), Collemeluccio-Montedimezzo MAB, Oasi WWF Guardiaregia, Tremiti marine reserve.
   - **Tratturi** — `historic` dashed polylines for Pescasseroli–Candela and Celano–Foggia routes.
   - **Transport** — `airport` markers (Naples NAP, Pescara PSR), `highway` polylines (A1 via Venafro, A14 via Termoli), with Termoli port/Campobasso & Isernia rail as `marker` features.

   Each overlay gets `id`, `name`, `icon` (Landmark / Wine / Mountain / Train / Plane), `description`, and a `features[]` array — the exact shape `InteractiveMap` already consumes.

4. No component code changes needed — the existing toggle chips, popups, and styling will pick the new overlays up automatically.

## Out of scope
- No changes to `InteractiveMap` itself.
- No changes to other regions.
- No new sections on the Molise page.

## Technical notes
- File deleted: `src/components/sections/MoliseDiscoveryMap.tsx`
- File edited: `src/pages/RegionPage.tsx` (drop import + conditional render)
- DB: one migration that updates `regions.region_data` for `slug='molise'` to set `region_data->'where'->'map'->'overlays'` to the new array (jsonb_set, preserving the rest of the JSON).
