## Add 2 towns to Calabria "More Towns to Consider" grid

Currently the Calabria grid has 10 towns — display renders as 3x3 + 1 orphan. Add 2 to reach 12 (3x4 symmetrical).

### Current 10 towns
Pizzo, Morano Calabro, Altomonte, Stilo, Diamante, Santa Severina, Soverato, Civita, Amantea, Reggio Calabria

### Proposed additions

**1. Cosenza** — interior, historic university city
- Best for: "Lively interior city with old-town charm"
- Blurb: Calabria's intellectual heart. A pedestrianised Centro Storico above the Crati river, a thriving cafe scene driven by University of Calabria students, and easy A2 motorway access. Cooler than the coast in summer; more services than any hill town.
- Coords: 39.2983, 16.2536

**2. Rossano (Corigliano-Rossano)** — Ionian side, Byzantine heritage
- Best for: "Byzantine heritage on the Ionian side"
- Blurb: Home of the Codex Purpureus Rossanensis (UNESCO Memory of the World) and a dense network of Byzantine churches. Hilltop old town with sea views, plus a lower modern town with a train station and beach access. Underrated and inexpensive.
- Coords: 39.5764, 16.6353

Both fill genuine gaps: Cosenza covers "real city living inland," Rossano covers the Ionian/Byzantine angle absent from the current set.

### Implementation

Single SQL migration: `jsonb_set` on `regions.region_data` for `slug='calabria'`, appending two town objects to `{towns,grid}` matching the existing schema (id, name, bestFor, photo, mapUrl, blurb, fullDescription, eligible7Percent).

Photo paths will follow the existing `/images/calabria/{slug}.jpg` convention. Since no images exist yet, they'll fall back to broken images until generated — same behavior as other grid entries until image generation runs. (Optional: trigger image generation for these two after the migration.)

No component changes needed — `TownsGrid.tsx` already handles arbitrary counts in a `lg:grid-cols-3` layout.
