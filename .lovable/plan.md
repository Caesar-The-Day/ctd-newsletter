# Molise Map with Toggleable Layers

Mirror the Calabria connectivity-map pattern — a Leaflet map with checkbox layer toggles — but reframe it around what makes Molise distinctive: heritage sites, wine zones, protected nature, and transit anchors.

## What gets built

A new component `src/components/sections/MoliseDiscoveryMap.tsx` rendered on the Molise page (in `src/pages/RegionPage.tsx`, gated by `region === 'molise'`, placed right after `<InteractiveMap />` so the existing town map stays as the overview).

The map centers on Molise (~41.69, 14.58, zoom 8) using the same MapTiler tile setup as `CalabriaConnectivityMap`, with the same loading/error states and `cal-poi`-style div-icon markers re-themed as `mol-poi`.

## Layers (each with its own toggle chip)

1. **UNESCO & Heritage** — Saepinum (Roman city at Altilia), Pietrabbondante (Samnite theatre), Larino Roman amphitheatre, Castel San Vincenzo / San Vincenzo al Volturno abbey, Agnone bell foundry. (Molise has no inscribed UNESCO site, so the layer is honestly labelled "UNESCO Tentative & Major Heritage" — Tratturi pastoral routes are on Italy's tentative list and run through here.)
2. **Wine Zones** — Tintilia del Molise DOC (interior hills around Campobasso/Isernia), Biferno DOC (Termoli/Larino corridor), Pentro di Isernia DOC. Rendered as soft polygons + a labelled marker per zone.
3. **National & Regional Parks** — Parco Nazionale d'Abruzzo, Lazio e Molise (western edge), Riserva MAB Collemeluccio-Montedimezzo, Oasi WWF Guardiaregia-Campochiaro, Tremiti marine reserve (offshore from Termoli).
4. **Tratturi (Ancient Sheep Routes)** — the Pescasseroli–Candela and Celano–Foggia tratturi as dashed polylines crossing the region (the layer that actually defines Molise's landscape).
5. **Transport Anchors** — Termoli port (Tremiti ferries), Campobasso & Isernia rail stations, Rome–Pescara A14/A1 access points, nearest airports (Naples NAP, Pescara PSR) shown as off-map indicators with distance.

Each layer is a `L.layerGroup` added/removed via state, exactly like Calabria's `layers` record. Toggle UI is a row of `Button` chips above the map (matches Calabria's "Modes" / "Layers" rows). Markers open Leaflet popups with name + one-line context.

## Data source

Hard-coded inside the component (same approach as `CalabriaConnectivityMap`'s `HUBS`, `AIRPORTS`, etc.). Coordinates pulled from the existing Molise `where.markers` where available, plus well-known public coordinates for heritage/parks/wine zones. No DB or AI calls.

## Styling

Reuse the existing `cal-hub` / `cal-poi` CSS conventions by adding `mol-poi-*` classes to `src/index.css` (heritage = amber, wine = burgundy, parks = green, tratturi = ochre dashed, transport = primary). All colors via HSL semantic tokens.

## Out of scope

- No edits to AI generation, scaffolding, or the research-region edge function.
- No changes to other regions.
- No new DB fields — content lives in the component.

## Technical notes

- File added: `src/components/sections/MoliseDiscoveryMap.tsx`
- File edited: `src/pages/RegionPage.tsx` (import + conditional render under Molise)
- File edited: `src/index.css` (add `.mol-poi*` classes)
- Reuses Leaflet + MapTiler setup already proven in `CalabriaConnectivityMap`
- Defensive: returns an error card if `VITE_MAPTILER_KEY` is missing, same as Calabria
