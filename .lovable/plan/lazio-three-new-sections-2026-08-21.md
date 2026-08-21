# Lazio: Three New Sections

Add three Lazio-only interactive sections, following the same pattern as the Umbria/Calabria/Molise custom components (self-contained components rendered from `RegionPage.tsx` when `region === 'lazio'`).

## 1. Thermal Springs Comparison

An interactive comparison of Lazio's thermal sites (Terme dei Papi and Bullicame in Viterbo, Fiuggi, Acque Albule/Tivoli, Cretone, Stigliano).

- Card grid with a detail panel: pick a spring, see water temperature, mineral profile, free vs. paid access, typical entry price, opening hours pattern, drive time from Rome and from the nearest town.
- Filter chips: Free / Paid, Year-round / Seasonal, Near Rome (<1h).
- A small comparison table view toggle so all springs can be scanned side by side.
- Editorial framing: which ones are practical for a resident to use weekly vs. which are day-trip novelties.

## 2. Lazio Beyond Rome (Nature)

A section that establishes the region's geography for someone deciding where to live.

- Tabbed explorer across four landscape types: Volcanic Lakes (Bolsena, Bracciano, Vico, Albano), Coast (Circeo, Sabaudia, Gaeta, Sperlonga), Mountains (Simbruini, Ernici, Terminillo edge), Countryside (Tuscia, Ciociaria, Sabina).
- Each tab: a short editorial paragraph, 3-4 place cards with a one-line "what living near here is actually like", elevation/distance-to-Rome data, and a note on winter conditions.
- Reuses existing imagery where available; new editorial images generated for gaps.

## 3. Rome as a Resident, Not a Tourist

A clear-eyed, two-sided look at actually living in Rome.

- Three tabs: **Cost**, **Getting Around**, **The Friction**.
  - Cost: rent bands by neighbourhood type (centro storico, semi-central like Monteverde/Trieste, outer like EUR/Montesacro), utilities, condo fees, groceries vs. regional average.
  - Getting Around: metro lines A/B/C reality, regional rail to the coast and hill towns, Fiumicino/Ciampino access, ZTL zones, whether a car is needed.
  - The Friction: mass tourism pressure by neighbourhood and season, traffic and parking, bureaucracy timelines, summer heat, waste/service reliability, short-let effects on rents.
- Each tab pairs data rows with an honest one-paragraph verdict, in the existing retiree-honesty editorial tone.
- Optional closing "Rome vs. a Lazio hill town" side-by-side on cost and convenience.

## Technical Notes

- New files: `src/components/sections/LazioThermalSprings.tsx`, `src/components/sections/LazioBeyondRome.tsx`, `src/components/sections/RomeResidentReality.tsx`.
- Content lives in the Lazio `region_data` in the database (new `thermalSprings`, `nature`, `romeLiving` keys) so it stays editable; components render defensively and return `null` when data is absent.
- Rendered in `RegionPage.tsx` behind `region === 'lazio'` guards only — no changes to other regions.
- Semantic design tokens only; scroll-reveal and tab patterns copied from existing sections.
- Placement: Nature after the map/climate block, Thermal Springs after the towns grid, Rome section before Healthcare & Infrastructure.
