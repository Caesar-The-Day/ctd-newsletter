# Friuli-Venezia Giulia: 12-town grid + standout sections

## 1. Complete the towns grid (10 → 12)

Current grid: Udine, Cormons, Muggia, Pordenone, Spilimbergo, Gorizia, Gemona del Friuli, Tarvisio, Venzone, Duino. Featured: Trieste, Cividale del Friuli, Grado.

Add two towns that fill real gaps rather than repeat existing profiles:

- **San Daniele del Friuli** — the prosciutto town. Hill air, small-scale food economy, well-serviced, the region's clearest "living well on a modest budget in a famous food town" story.
- **Palmanova** — the star-shaped Venetian fortress town (UNESCO). Flat, walkable, unusually cheap for its heritage, midway between Udine, Trieste and the coast.

Each gets the standard grid entry: name, best-for line, blurb, longer description, map link, photo. No 7% badges (none confirmed for FVG).

Photos: I need images for both. If you have them, upload them the way you did the other town photos; otherwise I will generate editorial images in the region's style.

## 2. Ideas to make Friuli stand out

Friuli's narrative is that it isn't really one place — it's an Adriatic port culture, a Mitteleuropean plain, and an Alpine border, stacked into a region smaller than Wales, with three languages in daily use. The sections below turn that into things a reader can play with. Pick the ones you want.

**A. The Three Friulis selector** (strongest fit)
A single interactive that splits the region into Coast/Karst, Central Plain, and Alps/Border. Choosing one swaps photo, climate line, cost band, healthcare access, language you'll actually hear, and "who this suits / who should avoid it." This is the region's core question and no other page answers it.

**B. The Bora meter**
Trieste's signature wind, treated honestly rather than as a curiosity: an animated gust gauge with real seasonal frequency, what 100+ km/h days mean for a balcony apartment, which towns are sheltered, and how residents plan around it. Friuli-only, memorable, and genuinely useful for retirees.

**C. Cross-border living calculator**
Slovenia and Austria are minutes away. A small tool comparing groceries, fuel, dentistry, ski passes and airports (Ljubljana, Klagenfurt, Venice, Trieste) from Gorizia, Tarvisio and Trieste — with the practical caveats on healthcare and residency. Nothing else in Italy has this.

**D. Trieste coffee ritual decoder**
Trieste is Italy's coffee port with its own vocabulary (nero, capo in b, goccia). A short interactive glass-and-order decoder — charming, very shareable, low build cost.

**E. White wine terroir explorer**
Collio, Colli Orientali, Carso and Ramandolo compared by soil, grape (Friulano, Ribolla Gialla, Picolit, Vitovska) and what a bottle costs locally, linked from the map's wine polygons already in place.

**F. Osmize finder explainer**
The Karst tradition of farmhouses opening for a few weeks a year, announced by a branch hung at the road. Explain how the frasca signalling works and how to actually find one — pure local knowledge, no tourist site covers it well.

**G. Great War memory route**
Redipuglia, Kobarid, the Isonzo front. A restrained map-linked timeline for readers who want the historical weight of this border.

## Technical notes

- Grid towns are stored in the `regions` table `region_data.towns.grid` for `friuli-venezia-giulia`; added via a data update, no component change (`TownsGrid` already renders any length).
- New sections follow the existing per-region component pattern (`src/components/sections/`), rendered from `RegionPage` and gated by `feature-flags.json`, same as the Lazio and Molise custom sections.
- The Three Friulis selector and cross-border calculator reuse the map data already loaded for FVG overlays.

## Recommendation

Build A (Three Friulis), B (Bora meter) and C (cross-border calculator) as the region's signature trio, plus D if you want a light, shareable moment. Tell me which and I'll scope the build.
