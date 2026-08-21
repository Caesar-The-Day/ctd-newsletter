# Lazio Map Layers

Add toggleable thematic layers to the Lazio interactive map, matching the pattern already used on Calabria, Molise and Umbria. The map component already supports layers and toggle buttons — this is a data addition for Lazio only (currently 13 town markers, zero layers).

## Layers to add

1. **UNESCO & Heritage** (Landmark icon)
   - Historic Centre of Rome + Vatican City extraterritorial properties
   - Villa d'Este, Tivoli
   - Villa Adriana (Hadrian's Villa), Tivoli
   - Necropolises of Cerveteri and Tarquinia (Etruscan)
   - Ostia Antica (major site, not UNESCO-listed — labelled as such)
   - Abbey of Montecassino (border landmark, Cassino)

2. **Parks & Nature** (Mountain icon)
   - Circeo National Park (coastal)
   - Abruzzo, Lazio e Molise National Park (Lazio portion)
   - Gran Sasso–Monti della Laga (Lazio edge)
   - Regional parks: Monti Simbruini, Bracciano–Martignano, Castelli Romani, Monti Aurunci, Monti Lucretili
   - Volcanic lakes: Bolsena, Bracciano, Albano, Vico

3. **Wine Zones** (Wine icon)
   - Frascati DOC / Castelli Romani
   - Est! Est!! Est!!! di Montefiascone DOC
   - Cesanese del Piglio DOCG (Lazio's only DOCG)
   - Cerveteri / Tarquinia coastal DOC
   - Aleatico di Gradoli / Bolsena area

4. **Transport & Airports** (Plane icon)
   - Fiumicino (FCO) and Ciampino (CIA)
   - Rome Termini / Tiburtina high-speed rail hubs
   - Civitavecchia ferry port
   - Key motorway corridors (A1, A24, A12) and regional rail lines to Viterbo, Latina, Frosinone

5. **Thermal & Spa Springs** (Waves icon) — a Lazio-specific extra
   - Terme dei Papi (Viterbo), Bullicame free pools, Saturnia-adjacent Vulci area springs, Fiuggi mineral waters, Tivoli Terme

Each layer gets a toggle button; layers are off by default except town markers, so nothing overlaps unless the reader turns it on. Every feature gets a click popup with a short, honest editorial blurb.

## Technical notes

- Single database update to `regions.region_data` for `slug = 'lazio'`, writing a `where.map.overlays` array in the existing schema: `{ id, name, icon, description, features[] }`.
- Feature types reuse existing renderers: `heritage` / `poi` markers (point coords), `zone` polygons with `color` for wine and park areas, `polyline` for corridors.
- Icons must come from the component's `iconMap` (Wine, Mountain, Landmark, Train, Waves, Globe, Plane, Anchor, MapPin).
- No component changes expected; if a Lazio feature needs a renderer that doesn't exist yet, it will be mapped onto an existing type rather than adding new code paths.
- Coordinates validated to Leaflet `[lat, lng]` order within Italy's range.
