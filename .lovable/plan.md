# Lazio: four new Regional Recipes (2 rustic, 2 refined)

The Regional Recipes section for Lazio currently holds two cards: Bucatini all'Amatriciana (Rustic) and Saltimbocca alla Romana (Refined). Amatriciana duplicates the Roman pasta coverage that already lives in the Food tab with recipe links, so it is retired here. The section becomes four non-pasta, distinctly Lazio dishes with new editorial photography.

## The four recipes

Rustic
- **Coda alla Vaccinara** — oxtail braised with celery, tomato, pine nuts and a whisper of cocoa. The signature dish of Testaccio's slaughterhouse quarter; long, cheap, forgiving.
- **Pollo alla Romana con i Peperoni** — chicken stewed with sweet peppers, guanciale and white wine. The Ferragosto family dish, made in every Castelli Romani kitchen in August.

Refined
- **Carciofi alla Romana** — Romanesco artichokes braised upright in olive oil, mint and garlic. Technically fussy (trimming, the upright braise) and the true Lazio winter-to-spring marker.
- **Abbacchio Scottadito con Cicoria Ripassata** — milk-fed lamb chops grilled hot and fast, served with twice-cooked chicory. Precision timing, high-quality lamb, the classic Roman Easter plate.

Saltimbocca alla Romana is kept as a fifth card only if you want it — default is to replace it so each mode has exactly two.

## Content per card

Each card gets: a short editorial story in the Cesare voice (where it comes from, when it is actually eaten, what a bad tourist version looks like), ingredient list with real quantities, numbered steps, a serving suggestion, a wine pairing drawn from the Lazio wine cards (Cesanese del Piglio, Frascati Superiore, Cannellino, Roma DOC red), and 1-2 verified external recipe links. Refined cards also get a "Why Refined" line.

## Photography

One editorial food photo per recipe, generated in the same warm, natural-light, plated-on-worn-ceramic style as the existing Lazio highlights food photos, saved under `public/images/lazio/recipes/`.

## Technical

- Content lives in the Lazio `regions` row (`region_data->recipes->cards`), updated via SQL — no static JSON file.
- `RecipesInteractive.tsx` already supports `story`, `whyRefined`, `ingredients`, `steps`, `servingSuggestion`, `winePairing` and `links`, so no component changes are needed; only data and images.
- External links fetched and checked before they go in; anything dead is dropped rather than shipped.
