# Friuli Afloat — sailing, marinas and the Croatian horizon

A signature boating section for the Friuli-Venezia Giulia guide, in the spirit of Liguria's "Afloat" module but shaped around what makes the Gulf of Trieste different: a short, dense coastline, a serious racing culture (Barcolana), a lagoon world at Grado and Marano, and Slovenia and Croatia within a single day's cruise.

## What the reader gets

**1. The coast strip — home ports at a glance**
An interactive strip of the Friulian shoreline from the Veneto border to Muggia, with pins for every real harbour: Lignano Sabbiadoro, Marano Lagunare, Aprilia Marittima, Porto Buso, Grado, Monfalcone (Marina Hannibal / Porto San Vito), Sistiana (Portopiccolo), Duino, Barcola, Trieste (Sacchetta, Marina San Giusto), Muggia. Clicking a pin opens a card: berths, max length, depth, indicative annual berth band for a 12 m boat, what is walkable from the pontoon, the honest vibe, a photo, and a link to the marina.

Two things Liguria did not need and Friuli does: a **lagoon vs. open-sea** filter (Grado/Marano shallow-draft world vs. the deep Gulf), and a **Bora exposure** rating per harbour, since where you keep a boat here is largely a wind decision.

**2. "How far by boat?" — the day-out dial**
Pick a home port, a cruising speed and hours available; destinations light up as reachable, stretch, or overnight. Range covers the whole upper Adriatic, not just Italy: Grado lagoon casoni, Marano, Isola della Cona, Miramare marine reserve, Piran and Izola (Slovenia), Umag, Novigrad, Poreč, Rovinj, Brijuni, Pula, and the Kvarner islands (Cres, Lošinj) as the overnight tier. Each destination card notes distance in nautical miles, what it is like on arrival, and whether it is a lunch stop or a weekend.

**3. Crossing the border by sea — the practical panel**
The part nobody writes down: Schengen means Slovenia is a non-event, but Croatia's sailing rules (vignette/navigation permit, crew list, entry ports at Umag/Novigrad/Poreč/Pula), the Adriatic's fuel-price difference, VHF and weather sources, and what actually changes for an Italian-flagged boat. Presented as a short set of clear cards with official links rather than paragraphs.

**4. Racing culture, for recreation**
Barcolana explained as what it is — the largest sailing race in the world, 2,000+ boats on the second Sunday of October, and a city that stops. Plus the everyday route in: sailing schools and clubs where a newcomer can learn or crew (Società Velica Barcola Grignano, Yacht Club Adriaco, circoli at Grado and Lignano), the winter Bora season, and a plain "how to get on a boat here without owning one" note covering club membership, crewing, and charter.

**5. Season and wind band**
A compact seasonal strip: sailing months, Bora frequency by month, water temperature, and lagoon-vs-open-sea suitability, so the reader sees the year the way a boat owner does.

## Photos

Real, freely-licensed photos sourced via the existing Wikimedia Commons script (same approach used for the Trentino and Liguria towns) for Barcolana, Grado lagoon casoni, Lignano, Portopiccolo/Sistiana, Muggia harbour, Piran and Rovinj. Optimised and stored locally under `public/images/friuli-venezia-giulia/afloat/` with attribution, per the local-hosting rule.

## Technical notes

- New `src/components/sections/FriuliAfloat.tsx` plus a `friuliMarinaData.ts` data file, mirroring the `LiguriaAfloat` / `liguriaMarinaData` pattern (typed marina and destination arrays, filters, framer-motion reveals, semantic design tokens only).
- Rendered from `RegionPage.tsx` inside the existing `region === 'friuli-venezia-giulia'` block, placed after `FriuliCrossBorder` so the land border and the sea border read together.
- Photo sourcing runs through `scripts/source-town-photos.ts`; no external image URLs.
- Component returns null when data is missing, per the defensive-rendering rule.
- No database changes required — the module is code-and-data driven like the Liguria equivalent.
