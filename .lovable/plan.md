# Liguria Signature Content — "The Boating Riviera"

Goal: give Liguria a set of custom, highly visual interactive modules — anchored by a marina/yachting centerpiece — that go well beyond the standard region template.

## The marquee module: Liguria Afloat

An interactive "boating paradise" section, the visual highlight of the page.

- **Marina Explorer** — a stylized coastal strip (Ventimiglia to Lerici) with selectable marina markers: Sanremo Portosole, Imperia Porto Maurizio, Marina degli Aregai, Loano, Varazze, Genoa Marina Molo Vecchio, Marina di Chiavari, Rapallo, Lavagna (largest in the Med by berths), Porto Venere, Portosole vs Portofino contrast. Clicking a marina opens a card with berth count, depth, typical annual berth cost band, what's walkable from the pontoon, and an official link.
- **Berth cost calculator** — pick boat length (slider, 8–24 m) and marina; get an estimated annual berth fee range plus the winter/summer split, so readers can price the dream honestly. Values presented as ranges with a "verify with the marina" note.
- **Day-trip radius dial** — choose cruising speed and hours; the map draws a reachable arc showing what a day out gets you (Portofino, Cinque Terre, Corsica, Elba, Monaco, Îles de Lérins).
- **Boat life practicalities** — licence rules (when a patente nautica is required), mooring vs dry storage, Ligurian Sea sanctuary (Pelagos) whale-watching, wind and sea-state seasonality, and the realities: waiting lists, summer traffic, mistral days.

## Supporting Liguria-only modules

1. **The Vertical Coast** — an animated cross-section from sea level to the Apennine crest in one visual: beach, carruggi, terraced vineyards, chestnut woods, ridge trail (Alta Via dei Monti Liguri). Hovering each band reveals what living at that band means (price, car dependence, sun, humidity).
2. **Riviera di Ponente vs Riviera di Levante** — a side-by-side selector comparing climate, prices, crowds, transport, expat density and retirement fit, with photos; ends in a "which side are you?" verdict.
3. **Carruggi & Genoa, Practically** — Genoa as a real city to live in: caruggi housing stock and prices by neighbourhood, lift/funicular network as public transport, port and airport access, and honest negatives (humidity, damp ground floors, parking).
4. **Basil, Olives, Anchovies** — the Ligurian pantry as an interactive triptych: DOP pesto genovese rules, Taggiasca olive oil, Monterosso anchovies, with links to consortiums and where to buy.

## Notes on the rest of the page

- Recipes: 2 rustic + 2 refined with wine pairings, matching the house standard.
- CTA slots stay distinct: one Visto Facile, one consultation.
- No 7% badges anywhere until you supply the eligible town list.
- Photos sourced from Wikimedia Commons via the existing sourcing script; AI generation only where no free photo exists.

## Technical approach

- New components under `src/components/sections/`: `LiguriaAfloat.tsx` (with a `liguriaMarinaData.ts` data file), `LiguriaVerticalCoast.tsx`, `LiguriaTwoRivieras.tsx`, `GenoaPractically.tsx`, `LiguriaPantry.tsx`.
- Mounted in `src/pages/RegionPage.tsx` behind `region === 'liguria'` blocks, following the Trentino pattern.
- All styling via existing semantic tokens; no hardcoded colors. Defensive rendering (return null on missing data).
- Photos optimized into `public/images/liguria/` with attribution; no external image URLs.
