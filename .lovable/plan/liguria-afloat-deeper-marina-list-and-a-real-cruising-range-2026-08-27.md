# Liguria Afloat: deeper marina list and a real cruising-range explorer

Two upgrades to the boating section on `/liguria`.

## 1. More marinas

Today the list has 11 ports and skips obvious ones. Add the missing Riviera names, each with berth count, max LOA, depth, indicative annual berth band for a 12 m boat, a walkability note, a vibe line, and an official website link:

- **Ponente:** Ventimiglia (Cala del Forte, the Monaco-owned basin), Bordighera, Diano Marina, Andora, Alassio, Savona (Marina di Savona / Old Port), Arenzano
- **Levante:** Portofino (Marina Molo Umberto I), Santa Margherita Ligure, Sestri Levante, Genoa Marina Genova Aeroporto / Duca degli Abruzzi

That takes the directory from 11 to roughly 22 ports, still split Ponente / Levante, with each new pin placed correctly along the coast strip so the shoreline graphic stays accurate. Where a real, freely-licensed photo exists on Wikimedia Commons it gets sourced and stored locally like the others; ports without one fall back to the existing no-photo card layout.

A note is added under the directory clarifying that Portofino, Santa Margherita and Rapallo are effectively closed lists with berths trading privately — consistent with the existing "waiting lists are real" fact.

## 2. "How far is a day out?" becomes an expansive cruising planner

Current version has 8 destinations and 3 home ports, so from Sanremo the only nearby items are Monaco and Cannes. Changes:

- **Home ports:** five instead of three — Riviera dei Fiori (Ventimiglia/Sanremo), Riviera delle Palme (Alassio/Loano), Savona-Genoa, Tigullio (Rapallo/Lavagna), Gulf of Poets (La Spezia). Distances recalculated for every destination from each of the five.
- **Destinations:** expanded from 8 to roughly 30, grouped into four families:
  - *Ligurian coast hops* — Bordighera, Alassio, Noli, Bergeggi island, Varazze, Camogli, San Fruttuoso abbey, Sestri Levante's Baia del Silenzio, Cinque Terre, Tellaro, Lerici
  - *Anchorages and swim stops* — Baia dei Saraceni, Punta Chiappa, Paraggi, Punta Manara, Cala dell'Olio, Palmaria & Tino, Punta Mesco
  - *Over the border* — Monaco, Menton, Villefranche, Îles de Lérins, Saint-Tropez
  - *Islands and crossings* — Elba, Capraia, Gorgona, Corsica (Calvi and Bastia), Giglio
- **Grouping in the UI:** destinations render under their family heading, sorted by distance from the chosen home port, so a Ponente boater sees Bordighera, Menton and Baia dei Saraceni at the top rather than an empty grid. Each entry keeps the in-reach / overnight-it state driven by the speed and hours sliders.
- **Filter chips** for the four families so the grid can be narrowed to, say, anchorages only.
- **Reach summary** gains a count ("18 of 30 destinations inside a day out") alongside the nautical-mile figure.

## Technical notes

- `src/components/sections/liguriaMarinaData.ts`: extend the `Marina[]` array; change `SeaDestination.from` from three hub keys to five, add a `group` field and an optional `kind` (port / anchorage / island); add a `homePorts` array so hub labels live in data rather than in the component.
- `src/components/sections/LiguriaAfloat.tsx`: home-port selector reads from `homePorts`; destination grid groups by family with per-group sorting and the filter chips; reach summary shows the in-reach count. The coast-strip SVG already samples pin positions from `x`, so new marinas need only correct `x` values.
- Photos sourced with the existing `scripts/source-town-photos.ts` Wikimedia flow, written to `public/images/liguria/`.
- No database or schema changes — this section is code-driven.
