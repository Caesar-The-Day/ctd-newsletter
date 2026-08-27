# Liguria on Two Wheels — a cycling section

A new Liguria-only signature module covering both sides of the region's cycling story: the flat coastal cycleway anyone can ride, and the steep hill riding for mountain bikers. Interactive, photo-led, honest about gradients, traffic and seasons.

## What it contains

**1. The Pista Ciclabile del Ponente Ligure (main interactive)**
A horizontal, scrubbable route strip for the coastal cycleway built on the old Genoa–Ventimiglia railway bed — roughly 24 km continuous from San Lorenzo al Mare through Santo Stefano, Riva Ligure, Arma di Taggia, Sanremo, Ospedaletti, plus the extensions and planned links toward Imperia and Bordighera.

Selecting a segment shows: length, surface, tunnels/former stations, sea access, where to rent (including e-bikes), parking and rail access, cafés and toilets, plus a "what it's actually like" honesty line (August crowds, rollerbladers, dog leads, wind direction).

**2. Ride-type dial**
Pick a profile — flat family spin, coastal day ride, hill road climb, gravel/hinterland, technical MTB — and the section surfaces matching named routes with distance, ascent, surface and difficulty:
- Coastal: the Ponente cycleway, Albenga plain lanes, Ventimiglia–Menton border ride
- Road climbs: Poggio and Cipressa (the Milano–Sanremo finale), Colle di Nava, Passo del Turchino, Colle San Bartolomeo
- Gravel/hinterland: Valle Argentina to Triora, Dolcedo and the Prino valley olive roads, Val Nervia to Apricale and Dolceacqua
- Technical MTB: the Alta Via dei Monti Liguri MTB traverse, the Ligurian Ridge / Via del Sale from Limone to Ventimiglia, Finale Ligure's Finalborgo trail network and NATO base descents, Molini di Triora enduro lines

**3. Finale Ligure panel**
Its own block, since Finale is one of Europe's headline MTB destinations: trail zones, shuttle culture and season windows (spring and autumn, not July), bike hotels and shops, the Finale Outdoor Region pass, and the fact that trails are on limestone that turns greasy when wet.

**4. Season and access band**
A compact strip: best riding months, when the coastal path is unrideable through crowds, when hill trails are wet or hunting season restricts access, plus taking bikes on regional trains and shuttle/lift options.

**5. Practicalities block**
Short editorial piece on bike theft and storage in caruggi flats, e-bike realities on a vertical coast, road-riding safety on the Aurelia, local clubs and bike shops, and insurance/helmet rules.

## Photos

Source real, freely-licensed Wikimedia Commons photos with the existing `scripts/source-town-photos.ts` pipeline, saved to `public/images/liguria/cycling/`, with attributions appended to `liguria-photo-credits.json`. Reuse existing Liguria photos (Finalborgo, Dolcedo, Triora, Apricale, Sanremo, Alassio) where they already fit. No external image URLs; AI generation only where no free photo exists.

## Links

Official outbound links: Finale Outdoor Region, Pista Ciclabile del Parco Costiero Riviera dei Fiori, Alta Via dei Monti Liguri, Trenitalia bike-on-train rules, and local rental operators.

## Technical notes

- New component `src/components/sections/LiguriaOnTwoWheels.tsx`, with route/trail content in `src/components/sections/liguriaCyclingData.ts`.
- Mounted in `src/pages/RegionPage.tsx` behind the existing `region === 'liguria'` guard, placed after `LiguriaVerticalCoast` (which already establishes the sea-to-ridge bands the rides use) and well away from `LiguriaAfloat` so the two outdoor showpieces don't sit back to back.
- Reuses the site's section heading treatment, semantic color tokens, Framer Motion transitions and existing reveal hooks — no new fonts, no hardcoded colors.
- Renders defensively: returns null on missing data.
- No overlap with the healthcare/infrastructure transport comparator or the marina day-trip dial.

## Build order
Coastal cycleway strip with photos first, then the ride-type dial, then Finale panel, then season band and practicalities.
