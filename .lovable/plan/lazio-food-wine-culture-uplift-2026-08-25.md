# Lazio: Food, Wine & Culture uplift

The section currently renders three tabs of near-identical collapsible cards with no images and no links — every Lazio card has an empty `image` and an empty `links` array. This rebuilds the section into three distinct, visual, interactive tabs, and retires the "Find Your Piemonte Wine" quiz for Lazio and all future regions.

## 1. Retire the wine quiz

- Set `showWineQuiz: false` in the `default` block of `feature-flags.json` and add a `lazio` block with it off, so no new region inherits it.
- Existing regions that use it (Piemonte, Puglia, Lombardia, Veneto) keep their explicit `true` — no locked region changes.

## 2. Wine tab

- Expand the four wine cards (Frascati Superiore, Cesanese del Piglio, Est! Est!! Est!!!, Aleatico di Gradoli) with two more: Cannellino di Frascati and a Roma DOC / Cesanese-based red, for a six-bottle grid.
- Generate an editorial photo per wine (bottle-free, terroir/glass/vineyard style so nothing looks fake-branded).
- Research and attach 2-3 working links per wine: the DOC/DOCG consorzio, a notable producer, and a reference page. Verified by fetching each URL before it goes in.
- Interactive layer:
  - Style filter chips: White / Red / Sweet / Sparkling.
  - Each card shows a small profile strip — body, acidity, sweetness as animated bars — plus a food-pairing line tied to the Food tab dishes.
  - A "volcanic terroir" band above the grid mapping each wine to its zone (Castelli Romani, Bolsena, Ciociaria) with hover highlighting.

## 3. Food tab

- Keep the four dishes and add Cacio e Pepe and Coda alla Vaccinara (six total).
- Generate a photo per dish.
- Interactive layer:
  - "The Roman pasta family" toggle comparing Carbonara / Amatriciana / Cacio e Pepe / Gricia by their shared and differing ingredients — click a dish and the ingredient chips light up.
  - Each dish card flips/expands to show: season, where it is genuinely eaten (neighbourhood or town), what an overpriced tourist version looks like, and a recipe link.
  - Verified recipe/reference links per dish.

## 4. Culture tab

- Add a fourth and fifth card (Ostia Antica, Etruscan necropoli of Cerveteri/Tarquinia) alongside Villa d'Este, Macchina di Santa Rosa, Hadrian's Villa.
- Generate a photo per entry.
- Interactive layer: a horizontal era timeline (Etruscan → Imperial Rome → Renaissance → living festivals) where clicking a period filters the cards, plus UNESCO badges and a "when it actually happens" date chip for the festivals.
- Verified links: official site, UNESCO listing where applicable.

## 5. Visual uplift (all tabs)

- Tabs get their own accent treatment and icon animation on switch, with Framer Motion crossfades between tabs and staggered card reveals.
- Cards move to a photo-forward layout with a gradient scrim, a category chip, and hover zoom, matching the thermal-springs and Beyond Rome sections.
- Section header gets a soft decorative background (grape/wheat/column motif) at very low opacity, same subtle treatment as the Colosseum silhouette.
- All colors via semantic tokens; no hardcoded palettes.

## Technical

- Content lives in the `regions` row for Lazio (`region_data->highlights`) — updated via a SQL update, not a static JSON file.
- New component: `src/components/sections/HighlightsShowcase` upgraded in place, with the interactive layers rendered per category. Shared component stays region-agnostic: the new interactive layers are driven by optional data fields (`style`, `profile`, `zone`, `era`, `when`), so regions without them fall back to today's rendering.
- New assets under `src/assets/lazio/highlights/`, imported through a small photo map keyed by card id, so the DB stores the key rather than an external URL.
- Links verified by fetching before commit; any dead URL gets dropped rather than shipped.
