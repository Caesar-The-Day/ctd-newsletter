# Liguria: a map worth the region

The Liguria draft already has the four baseline overlay buckets (UNESCO & Heritage, Wine Zones, Transport Hubs, Parks & Nature) — but every one of them is empty, so the map renders with no toggle buttons at all. The toggle machinery is built and repeatable; the scaffold just never filled it. This fills it, and then pushes past the baseline with layers only Liguria could have.

## 1. Fill the four baseline layers

**UNESCO & Heritage** — Genoa's Le Strade Nuove and Palazzi dei Rolli; Porto Venere, Cinque Terre and the islands (Palmaria, Tino, Tinetto); Sacri Monti connection; plus major non-UNESCO heritage anchors (Albenga's medieval towers, Noli, Finalborgo, Cervo, Triora, Dolceacqua). Each popup gets a short editorial blurb, a photo, and an official whc.unesco.org link where the listing is real — clearly labelled when a site is heritage but not UNESCO.

**Wine Zones** — drawn as polygons, not pins: Rossese di Dolceacqua DOC, Riviera Ligure di Ponente (Pigato/Vermentino, Albenga plain), Cinque Terre and Sciacchetrà, Colli di Luni, Val Polcevera. Popups link into the Wine tab of the Food, Wine & Culture section, as on Lazio.

**Transport Hubs** — Genoa Cristoforo Colombo airport, Nice Côte d'Azur (the real Ponente airport, across the border), Pisa as the Levante fallback; Genoa Principe/Brignole and the coastal rail spine; Ventimiglia as the French rail gateway; ferry ports (Genoa, Savona, Portofino/Levante ferries); the A10/A12 corridor and the Milan/Turin motorway crossings over the Apennines.

**Parks & Nature** — Portofino, Cinque Terre and Beigua (UNESCO Global Geopark) parks; Alpi Liguri, Antola, Aveto, Montemarcello-Magra, Bric Tana, Piana Crixia; Monte Saccarello and the Ligurian Alps; the Alta Via dei Monti Liguri ridge line drawn as a polyline across the whole region.

## 2. Liguria-only layers (the part that stands out)

- **Riviera dei Fiori & Olive Coast** — the flower-growing greenhouse belt from Ventimiglia to Sanremo, Taggiasca olive country in the Valle Argentina, and the Imperia oil hub. This is what makes Ponente Ponente, and it appears on no other region's map.
- **Ponente / Levante divide** — a single stylised line at Genoa with a popup that explains the region's real internal split: sun and flowers and French orbit to the west, coves and Tuscany and cliff towns to the east. Turns the map into an argument, not just pins.
- **The Vertical Coast** — the sea-to-ridge reality: creuze and mule tracks, the Cinque Terre trail network, funicular/rack railways (Genoa's Zecca-Righi, Sant'Anna), and the villages you reach only on foot. Honest note on what "no car access" means when you are 70.
- **Borders & Crossings** — Ventimiglia/Menton road and rail crossing, Col de Tende into France, Turchino and Giovi passes into Piemonte, with real journey times to Nice, Monaco and Milan.

Each layer stays off by default except town markers, and each is individually toggleable, so nothing overlaps unless the reader asks for it.

## 3. Photos and consistency

- Every clickable town marker gets a photo — sourced from Wikimedia Commons with the existing sourcing script, not AI-generated, with attribution recorded.
- Heritage, park and Riviera dei Fiori features get photos too, same treatment.
- Sourced images are optimised to WebP and stored locally under `public/images/liguria/map/` (no external URLs).

## Technical notes

- Single write to `regions.region_data` for `slug = 'liguria'`, replacing the empty `where.map.overlays` array. Schema unchanged: `{ id, name, icon, description, features[] }`.
- Feature types reuse existing renderers in `InteractiveMap.tsx`: `heritage`/`poi` point markers, `zone` polygons with `color`, `polyline` corridors. Icons come from the component's existing `iconMap` (Wine, Mountain, Landmark, Train, Waves, Globe, Plane, Anchor, MapPin) — if a Liguria layer wants an icon outside that map, it is added to `iconMap` rather than inventing a new render path.
- Coordinates validated as Leaflet `[lat, lng]` within Liguria's bounds.
- Map centre/zoom retuned so the region's long thin arc actually fills the frame rather than sitting as a sliver.
- Separately, the scaffold gap is worth fixing so future regions ship with populated layers rather than empty buckets — flagged here, done as a follow-up unless you want it in this pass.

## After the map

Once the map lands, the same energy goes into the rest of the guide — I will come back with proposals for Liguria-specific sections (the Ponente retirement case, coastal rail as a lifestyle, olive-oil and flower economy, the vertical-village age question).
