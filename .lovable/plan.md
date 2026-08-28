# Friuli-Venezia Giulia: what else could make this region land

Friuli already has Three Souls + Soul Quiz, the Bora meter, Cross-Border living, Afloat (marinas and cruising), the Orange Wine Lab, Osmiza Hunter, Border Plate, and the rebuilt Healthcare & Infrastructure. The gaps below are the parts of the region a reader still can't feel: its languages, its war-scarred and earthquake-rebuilt landscape, its coffee and buffet ritual, its mountains, and the Mitteleuropean calendar of the year.

Pick the ones you want; I'd build A, B and C first.

## A. Four Tongues, One Region (strongest fit)
Friuli is the only Italian region with three protected minority languages alongside Italian — Friulian, Slovene, German (Val Canale/Sauris/Timau), plus Triestino dialect. An interactive language map: hover or tap a zone and hear/see the same everyday phrase ("good morning", "how much is it?", "see you at the bar") in the language actually spoken there, with a note on where it's official (bilingual signage, schools, paperwork) and what it means practically for a newcomer — which places expect Italian only, where Slovene schooling exists, where German gets you further than Italian. No other region page has anything like it.

## B. The Border That Moved
The single most Friulian fact: this land changed country five times in a century. A scrubbable timeline map — 1866, 1918, 1920, 1947, 1954, 1991, 2004, 2007 (Schengen) — where the border line physically moves across Gorizia, Trieste and the Karst as you drag. Each stop carries one photograph and two sentences on what it meant for the people living there. Ends on today: Gorizia/Nova Gorica as a single GO!2025 European Capital of Culture city with a square split by a former frontier. Historical weight, delivered as motion rather than paragraphs.

## C. Trieste, Practically
The Rome / Genoa treatment for Trieste, since it's the region's only real city and where most incomers land: rents by rione (Borgo Teresiano, San Vito, Barcola, Servola, Opicina), the Bora tax on which flat you pick, the tram-to-Opicina and bus network, port and university jobs, healthcare on the doorstep, the honest downsides (ageing population, wind, a city that empties in August, dead-end for onward travel). Plus the coffee decoder — nero, capo in b, goccia, deca in b — and the buffet lunch ritual, which is the fastest way to feel local here.

## D. The Alps Nobody Books
Friuli's mountains — Carnia, the Julians, Sella Nevea, Piancavallo, Sappada, Tarvisio and the Laghi di Fusine — get a fraction of the Dolomites' traffic at a fraction of the price. A nature/outdoors module in the Trentino mould but shaped around what's different here: cross-border ski areas (one pass, three countries), the Alpe Adria cycle route from Tarvisio to Grado, malghe and Carnic food huts, and honest winter-living notes on snow, roads and isolation.

## E. Rebuilt From Rubble — the 1976 earthquake
Venzone, Gemona and the Orcolat quake are the region's defining modern story and the reason Friulians are the way they are. A before/after image slider on Venzone's rebuilt duomo and streets, plus what the reconstruction model ("com'era, dov'era") means today: building stock quality, seismic classification, what to check before buying an old house here. Practical as well as moving.

## F. A Year in Friuli
A calendar wheel of the region's Mitteleuropean year: Pignarûl epiphany bonfires, Carnevale di Muggia, Cantine Aperte, Aria di Festa at San Daniele, Perdòn di Barbana on the lagoon, Mittelfest, Friuli DOC, Barcolana, osmize season, San Martino, and the Trieste Christmas markets — each with a photo, a place, and the working link (most already validated in the climate calendar).

## G. The Great War Route
Redipuglia, Monte San Michele, the Isonzo/Soča front, Kobarid across the Slovene border. A restrained map-linked route rather than a museum list — for readers who want to understand why this landscape has cemeteries the size of towns. Could fold into B if you'd rather not add a seventh section.

## Technical notes
- Each item is a new component under `src/components/sections/` (e.g. `FriuliFourTongues.tsx`, `FriuliBorderTimeline.tsx`, `TriestePractically.tsx`) with a paired data file, following the `FriuliThreeSouls` / `friuliSoulsData.ts` pattern: typed arrays, framer-motion reveals, semantic tokens only, null-return on missing data.
- Rendered from the existing `region === 'friuli-venezia-giulia'` blocks in `RegionPage.tsx`, ordered so the reader moves identity → history → city → mountains.
- Photos sourced as real, freely-licensed Wikimedia images via `scripts/source-town-photos.ts`, optimised and hosted locally with credits appended to `friuli-venezia-giulia-photo-credits.json`.
- Audio for A (spoken phrases) only if free-licensed recordings exist; otherwise phonetic text with no invented audio.
- No database schema changes — code-and-data driven, like the Liguria and Trentino signature modules.
