# Trentino-Alto Adige: Food, Wine & Culture

The section currently has generic scaffold cards (4 wine, 4 food, 3 culture), no photos, no links, and no interactive modules. This plan turns it into the strongest part of the page, built around the region's real distinction: two food cultures, extreme-altitude viticulture, and a folk calendar that is more Alpine than Italian.

## Content upgrade

**Wine (6 cards, photos + official links)**
- Trentodoc — Italy's alpine metodo classico (Istituto Trentodoc)
- Teroldego Rotaliano — the Campo Rotaliano "prince"
- Lagrein — Bolzano's dark native red
- Gewürztraminer — Tramin/Termeno, the world's aromatic benchmark
- Schiava / Vernatsch — the light red locals actually drink daily
- Müller-Thurgau of Val di Cembra — cliff-terrace whites at 700m+

Each card: editorial photo, grape/altitude/price band, what it costs in a local shop vs a restaurant, link to consortium or Strada del Vino.

**Food (6 cards)**
Canederli, Speck Alto Adige IGP, Schlutzkrapfen, Strudel, Puzzone di Moena DOP (a genuinely odd washed-rind cheese), Zelten (Christmas fruit bread). Each labelled by which side of the linguistic line it belongs to.

**Culture (6 cards)**
Dolomites UNESCO / Enrosadira, MART Rovereto, Krampus and Klöckeln, Ötzi at the South Tyrol Museum of Archaeology, Ladin language and the Val Gardena/Badia valleys, Christmas markets as civic institutions. Each with an official site link.

## Three new interactive modules

**1. The Altitude Wine Ladder** (Wine tab)
A vertical cross-section from the Adige valley floor (200m) to Cembra's cliff terraces (900m). Drag or click a rung and the vineyard band comes alive: which grape grows there, why altitude gives it acidity, the harvest window, a bottle-shape marker on the slope, and a photo of that terrain. Ends with a "which bottle for tonight" pick based on the band selected.

**2. The Speck Line** (Food tab)
An interactive slider that sweeps a boundary north-to-south across a stylised region map. As you move it, the plate on screen morphs: dumplings/rye/smoked pork on the German side, polenta/cheese/lake fish on the Trentino side, with the Ladin valleys as a third state where both appear. Includes a "what's on a real tagliere" hover diagram and shop-price reality for speck, cheese and rye bread.

**3. The Alpine Folk Calendar** (Culture tab)
A twelve-month wheel of things that actually happen — Krampuslauf, Törggelen, Klöckeln, transhumance/Almabtrieb, Mercatini, Ladin costume days, Bolzano's Kastelruther festivals. Click a month for date window, where, whether it's tourist-facing or genuinely local, and a photo. This is a Trentino version of the calendar pattern already used for Umbria, but keyed to Alpine and Tyrolean traditions rather than Italian saints.

## Visual work

Roughly 14 new editorial photos generated in the established Trentino look: vineyard terraces at three altitudes, Teroldego and Lagrein glasses, a speck tagliere, canederli in broth, Schlutzkrapfen, Puzzone, Krampus night, Ötzi museum exterior, Ladin valley, Christmas market, Almabtrieb cattle procession.

## Technical notes

- Card content, links and image paths written into `region_data->highlights` for `trentino-alto-adige` via a database update — no schema change.
- New components `TrentinoAltitudeWineLadder.tsx`, `TrentinoSpeckLine.tsx`, `TrentinoFolkCalendar.tsx` in `src/components/sections/`, with shared data added to the existing `trentinoData.ts`.
- Wired into `HighlightsShowcase.tsx` through the existing `highlights.interactive` flag pattern (same mechanism as the Friuli modules), so nothing leaks into other regions.
- Images to `public/images/trentino-alto-adige/`, hosted locally per project rule.
- Framer Motion for transitions; components return null on missing data.
