# Friuli-Venezia Giulia: photos, event links, town write-ups, wine/food/culture links

All changes are to the Friuli-Venezia Giulia draft (the active region) stored in the backend — no locked regions touched.

## 1. Missing map marker photos

Confirmed cause: the map markers for Trieste, Cividale del Friuli and Grado point at `/images/friuli-venezia-giulia/trieste.jpg`, `cividale-del-friuli.jpg` and `grado.jpg`, but the files on disk are named `trieste-featured.jpg`, `cividale-del-friuli-featured.jpg` and `grado-featured.jpg`. Every other marker's filename matches.

Fix: repoint those three markers to the `-featured` filenames, then verify all markers resolve (spot-check the rendered map).

## 2. Weather/climate modal event links

- Carnevale di Muggia: replace the current `carnevaldemuggia.at` link with `https://www.carnevaldemuja.com`.
- Fill the eight months that currently have no link, using official or authoritative sources: Pignarûl (January), Duino castle gardens (March), Cantine Aperte / Collio (May), Aria di Festa San Daniele (June — `https://www.enogastronomia.it/festa-del-prosciutto-di-san-daniele/`), Perdòn di Barbana (July), Friuli DOC (September), San Martino / vino novello (November), San Nicolò and Christmas markets (December).
- Every link gets checked for a live response before being saved; anything that doesn't resolve is swapped for the closest working official page rather than left broken.

## 3. Featured town write-ups

Rewrite the `fullDescription` for Trieste, Cividale del Friuli and Grado (currently ~600 characters each, largely descriptive) into longer retiree-focused pieces covering: everyday vibe and rhythm, who actually lives there year-round, housing and cost reality, healthcare and services within reach, transport and winter/summer swings, plus the honest downsides (Bora, seasonality, Trieste prices, Grado's off-season emptiness). Same pragmatic tone used elsewhere on the page.

## 4. Wine / Food / Culture links

Replace all six broken `turismofvg.it` deep links with the working top-level site `https://www.turismofvg.it/en`, except Cividale which gets the specific working page below.

New and corrected links:
- Friuli wine routes overview: `https://www.winescholarguild.com/wine-maps/italian-wine-maps/friuli-venezia-giulia-wine-map`
- Vitovska: `https://www.openingabottle.com/what-is-vitovska-and-should-i-drink-it/`
- Cjarsons: `https://www.the-pasta-project.com/cjarsons-ravioli-from-friuli-venezia-giulia/`
- Aria di Festa: `https://www.enogastronomia.it/festa-del-prosciutto-di-san-daniele/`
- Trieste buffet culture: `https://italysegreta.com/buffet-da-pepi-trieste/`
- Cividale and the Natisone valleys: `https://www.turismofvg.it/en/cividale-and-natisone-and-torre-valleys?LangSetCMS=en`
- Tempietto Longobardo: `https://www.tempiettolongobardo.it`
- Osmize (replacing the broken Carso Turismo link): `https://www.parovel.com/index.php/en/terroir/the-osmiza-tradition`

Where a card doesn't yet have a link slot (e.g. the wine-routes overview, Vitovska), the link is added to the appropriate wine or culture card so it renders with the existing link styling.

## Technical notes

- Marker photos and all links live in the region's JSON in the `regions` table (`region_data.where.map.markers`, `region_data.highlights.*`); month events live in `climate_data.months[].culturalEventUrl`. All edits are data updates — no component changes expected.
- The `-featured.jpg` files already exist; no new images are generated or uploaded.
- After the update, links are validated with a live request sweep and the map is checked in the preview.
