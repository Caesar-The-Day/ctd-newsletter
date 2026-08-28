# Trentino-Alto Adige: photo, link and copy fixes

A cleanup pass on the Trentino guide — broken map photos, dead links, thin town write-ups, and missing event links in the climate section.

## 1. Map town markers missing photos

Bolzano, Trento and Merano markers point at `bolzano-bozen.jpg`, `trento.jpg` and `merano-meran.jpg`, but the files that actually exist on disk are `bolzano-bozen-featured.jpg`, `trento-featured.jpg` and `merano-meran-featured.jpg`. Fix the three paths in the region record so the popups show images. Also audit every remaining marker path against the files on disk and correct any other mismatch found in the same pass.

## 2. Wine consortium link

`vinitrentino.com` appears four times in the Trentino data (Consorzio Vini Trentino / Vallagarina and related wine cards). Replace every occurrence with `https://vinideltrentino.com/en/home-2/`.

## 3. Südtirol land & planning authority

The Housing Rules module links to a dead `provinz.bz.it` planning path. Replace with `https://home.provinz.bz.it/de/home`. Two other `provinz.bz.it` deep links exist (nature parks, air rescue in the healthcare module) — the park ones are replaced below; the air-rescue one gets pointed at the same working provincial home page if the deep link is also dead.

## 4. Nature park card links

In `trentinoNatureData.ts`:

- Paneveggio → https://parcopan.org
- Puez-Odle → https://www.odlesdolomites.com/en/region/puez-odle-nature-park/
- Sciliar-Catinaccio → https://www.seiser-alm.it/en/highlights/nature-and-landscape/sciliarcatinaccio-nature-park/
- Fanes-Sennes-Braies → https://www.suedtirolerland.it/en/highlights/nature-and-landscape/nature-parks-in-south-tyrol/fanes-senes-braies/
- Monte Corno → https://www.suedtirolerland.it/en/highlights/nature-and-landscape/nature-parks-in-south-tyrol/monte-corno/
- Lago di Tovel → https://www.trentino.com/en/highlights/nature-and-landscape/lakes/lake-tovel/

## 5. Climate section "what's happening"

Nine of the twelve months have an event with no link: Bozner Silvesterlauf, Egetmann Parade (Termeno), Merano Spring Festival, Lana in Bloom, Herz-Jesu-Feuer, Bolzano Festival Bozen, Törggelen, Desmontegada, and the Bolzano Christkindlmarkt. Research each and attach an official or authoritative tourism-board URL; where no stable official page exists, use the relevant tourism board's event page rather than leaving it blank or inventing one.

## 6. Featured town write-ups

Expand the Bolzano, Trento and Merano `fullDescription` fields from a single paragraph to three or four, in the guide's usual retiree-honest register: what daily life actually feels like, housing reality and rough prices, healthcare and getting around without a car, winter and the language question, and the honest downsides (cost, tourism pressure, closed-season quiet, bureaucracy in German).

## Technical notes

Items 1, 2, 5 and 6 are edits to the `trentino-alto-adige` row in the `regions` table (`region_data` / `climate_data`) applied via SQL. Items 3 and 4 are source edits in `TrentinoHousingRules.tsx`, `TrentinoHealthcareInfrastructure.tsx` and `trentinoNatureData.ts`. All new links get a live check before they go in.
