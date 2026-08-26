# Friuli — Food, Wine & Culture Overhaul

Today the Friuli section has 14 cards (5 wine, 5 food, 4 culture) with empty `image` fields, no links, no metadata, and no interactive layer. Every card renders a blank photo slot.

## 1. Photos for every card

Generate editorial photography (matching the site's warm, documentary style) for all 14 cards plus three tab background images, stored locally in `public/images/friuli-venezia-giulia/highlights/`:

- Wine: Friulano, Ribolla Gialla (skin-contact), Schioppettino, Vitovska, Picolit
- Food: Frico e polenta, Cjarsons, Prosciutto di San Daniele, Jota, Gubana
- Culture: Aquileia mosaics, Barcolana regatta, Lombard Temple, Osmize

## 2. Richer card content

Fill the fields the shared card component already supports but Friuli never populated:

- Wine: grape, zone (Collio / Colli Orientali / Carso / Isonzo), taste profile bars (body, acidity, tannin, aromatics), food pairings, price band, and links to the real consorzi and producers (Consorzio Collio, Consorzio DOC Friuli, Ribolla di Oslavia producers, Consorzio Picolit).
- Food: course badge, ingredient chips, season, place of origin, links to the protected-designation consortia (San Daniele DOP, Montasio DOP, Gubana association).
- Culture: era badge (Roman / Lombard / Habsburg / Living tradition), place, access notes, and official links (UNESCO listings for Aquileia and Cividale, Barcolana official site, Karst osmize register).

Expand each description to two short paragraphs — what it is, and what it means for someone living here.

## 3. Interactive layer (new, Friuli-specific)

Three additions that make the section more than a card grid:

- **Orange Wine Lab** — an interactive skin-contact explainer: a slider for maceration days (0 → 60+) that visually shifts a glass from pale straw to deep amber, updating tasting notes, tannin level, and which Friuli producers/styles sit at that point. Explains Friuli's signature contribution to wine in a way no other region page has.
- **The Osmiza Hunter** — a small interactive built on the real Karst tradition: the ivy branch (frasca) signal. Clicking through a stylised roadside scene reveals how to read the sign, what you can legally be served, typical prices, and a link to the live osmize calendar. Playful and genuinely useful.
- **Border Plate Slider** — a two-sided tasting comparison (Alpine/Slavic vs. Adriatic/Habsburg) letting the reader drag between the region's two culinary poles, showing how the same meal changes from Tarvisio to Grado.

These slot inside the Food/Wine/Culture area rather than becoming separate page sections, so the page structure stays intact.

## Technical notes

- Card data lives in `regions.region_data->'highlights'` in the database for `friuli-venezia-giulia`; updated by SQL migration, not static JSON.
- `HighlightsShowcase.tsx` already renders profile bars, chips, meta rows, era/course badges, and link buttons — no schema change needed for items 1–2.
- New interactive pieces are new components under `src/components/sections/` (`FriuliOrangeWineLab.tsx`, `FriuliOsmizaHunter.tsx`, `FriuliBorderPlate.tsx`), rendered from `HighlightsShowcase` only when the region supplies the corresponding flags, so other regions are unaffected.
- All images generated locally (no external URLs), lazy-loaded, with alt text.
