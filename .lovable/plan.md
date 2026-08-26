# Dolomites & Wild Trentino: an outdoors section

A new signature section for Trentino-Alto Adige aimed at hikers, mountain bikers and nature lovers — interactive, photo-led, and honest about seasons, altitude and access.

## What it contains

**1. Protected-lands explorer (main interactive)**
A selector across the region's protected areas, each with an editorial photo, a one-line character read, and the practical facts a resident cares about:
- Dolomiti di Brenta / Adamello-Brenta Nature Park (bears, glacier, Brenta towers)
- Stelvio National Park (highest peaks, Val Venosta / Val di Sole gateways)
- Paneveggio–Pale di San Martino (violin forest, pale dolomite walls)
- Puez-Odle, Sciliar-Catinaccio, Fanes-Sennes-Braies (Südtirol Dolomite parks)
- Monte Corno / Trudner Horn and Val di Non lakes as low-altitude options

For each: nearest towns, drive time from Trento/Bolzano, elevation range, best months, whether it is reachable by bus/cable car, dog and bike rules, and one "what it actually feels like" line.

**2. Trail-difficulty dial**
Pick a level — valley stroll, half-day hike, hut-to-hut, via ferrata — and the section surfaces matching named routes (Alta Via 1 and 2, Brenta ferratas, Sentiero delle Vipere, Lago di Braies loop, Renon high plateau walks) with distance, ascent, hut options, and what gear and nerve the level really demands.

**3. Mountain biking panel**
Bike parks and long routes: Val di Sole World Cup track, Dolomiti Paganella Bike, Reschen/Resia and Val Venosta valley trails, the Adige and Valsugana cycleways as flat everyday options, plus e-bike and lift-assist realities and the rule that many lifts carry bikes only in summer season.

**4. Season band**
A compact strip showing when huts open and close, snow line by month, when the Dolomite passes shut, and the crowd/parking-permit windows (Braies, Sella passes) — so the outdoor picture matches the rest of the page's honesty.

**5. Hut culture explainer**
Short editorial block on rifugi vs. Schutzhütten, booking, half-board, CAI/AVS membership discounts, and mountain-rescue insurance — the practical bit nobody tells you.

## Photos

Source real, freely-licensed Wikimedia Commons photos with the existing `scripts/source-town-photos.ts` pipeline (extended to accept place/park names), saved to `public/images/trentino-alto-adige/nature/`, with attributions appended to `trentino-alto-adige-photo-credits.json`. No external image URLs; no AI-generated landscapes.

## Technical notes

- New component `src/components/sections/TrentinoDolomitesOutdoors.tsx`, content in a data module alongside `trentinoData.ts`.
- Mounted in `src/pages/RegionPage.tsx` behind a `region === 'trentino-alto-adige'` guard, placed after the map/climate area and before the towns sections so nature reads early — not adjacent to `TrentinoMountainMobility` (cable cars) to avoid feeling repetitive.
- Reuses the existing shared heading treatment, semantic color tokens and reveal-on-scroll hooks. Framer Motion for transitions, no new fonts.
- Renders defensively: returns null on missing data.
- No overlap with the cable-car mobility, altitude-life or season-clock modules — this one is purely about where you go outdoors and what it takes.

## Build order
Protected-lands explorer with photos first, then trail dial, then biking panel, then season band and hut culture.
