# Valle d'Aosta: wine zones and parks as shaded areas

The map already draws shaded areas for other regions (wine regions, parks). Valle d'Aosta's Wine Zones and Nature & Parks layers currently use single dots; switch them to shaded areas.

## Wine Zones (6 areas, wine-red)
Simplified outlines along the Dora Baltea valley floor and lower slopes:
- Morgex et La Salle (high vineyards near Mont Blanc)
- Enfer d'Arvier
- Torrette / Aosta central valley
- Nus–Chambave (Muscat, Fumin)
- Arnad-Montjovet
- Donnas (Nebbiolo, lower valley)

## Nature & Parks (shaded green areas)
- Gran Paradiso National Park (Valle d'Aosta side, Cogne/Valsavarenche/Rhêmes valleys)
- Mont Avic Regional Park
- Mont Blanc massif, Monte Rosa and Matterhorn high-mountain areas
- Lillaz waterfalls stays a single point (too small for an area)

Names, notes and official-site links stay as they are. Other layers (heritage, transport, ski, towns) are not changed.

## Technical details
- Update the `wine` and `nature` overlays in the valle-daosta region row via run_sql: features become `type: 'zone'` with `coords` polygons (8–14 vertices each, approximate), `color`, `description`, `link`, `linkLabel`.
- No code changes; InteractiveMap already renders `zone`.
- Verify with Playwright (admin session): toggle each layer, screenshot shows polygons inside the region.
- Outlines are approximate hand-drawn shapes, not official boundaries.
