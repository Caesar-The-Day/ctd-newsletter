# Valle d'Aosta map layers, plus a ski resorts layer

The Valle d'Aosta draft already has its four map layers set up (UNESCO & Heritage, Wine, Transport, Nature), but all four are empty. Its 15 town markers are already in place. This fills every layer and adds a fifth one for skiing.

## Layers and what goes in them
Each point gets a short note written for retirees (what it means for daily life, not brochure copy) plus its official website.

- **UNESCO & Heritage (about 8 points):** Aosta's Roman sites (the theatre, Porta Praetoria, the Arch of Augustus), the Sant'Orso collegiate church, Fort Bard, Fénis, Issogne and Sarre castles, and the Monte Bianco skyway. The region has no UNESCO World Heritage site of its own. The heading will read "Heritage" and the notes will say so honestly rather than claim a listing.
- **Wine (about 6 points):** the Valle d'Aosta DOC sub-zones from Morgex et La Salle (some of Europe's highest vineyards) through Enfer d'Arvier, Torrette, Chambave, Nus and Donnas, plus the Cave Mont Blanc cooperative.
- **Transport (about 7 points):** Aosta station and the Turin line (and its known disruptions), the Mont Blanc and Great St Bernard tunnels, the A5 motorway, the Aosta–Pila gondola, and the nearest airports, Turin and Geneva, with realistic drive times.
- **Nature (about 6 points):** Gran Paradiso National Park, Mont Avic Natural Park, Mont Blanc, Monte Rosa, Matterhorn/Cervino, and Lillaz waterfalls.
- **New: Ski Resorts (8 of the best):** Courmayeur, Breuil-Cervinia (linked to Zermatt), Monterosa Ski (Champoluc, Gressoney, Alagna), La Thuile (linked to La Rosière), Pila (gondola straight from Aosta), Cogne (cross-country), Torgnon and Valtournenche. Each note covers lift link-ups, season length and whether it works as a year-round home or only a winter base.

All layers stay off by default, like the other regions. Visitors switch them on.

## Technical details
- Data only: write `features` (name, type, coords, website, description) into the existing overlays in `regions.region_data.where.map.overlays` for `valle-daosta`, which is a draft and unlocked. Append a `ski` overlay.
- Ski icon: lucide has no skier icon. Add `MountainSnow` to the icon map in `InteractiveMap.tsx` and use it for the ski layer. That is a one-line, shared, backward-compatible change.
- Coordinates and URLs are checked by hand. No 7% badges are touched.
- Verify in the preview at /regions/valle-daosta that each layer toggles and shows its markers.
