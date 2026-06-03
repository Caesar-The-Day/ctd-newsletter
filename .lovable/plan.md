# Expand Molise Pros/Cons Section

Current state: 2 pros + 2 cons. Goal: broaden coverage to more facets of life in Molise.

## What to add

Update `public/data/regions/italy/molise.json` (and DB `regions.region_data` for molise) — adding 3 new pros and 3 new cons. Final shape: **5 pros / 5 cons**.

### New Pros
1. **Nature & Outdoor Living** — Apennine national parks (Matese), pristine trasferanza trails, Adriatic coast within an hour, four real seasons, clean air rated among Italy's best.
2. **Food & Wine Heritage** — Tintilia DOC (region-exclusive grape), Caciocavallo di Agnone, white truffles from San Pietro Avellana, olive oil culture, slow-food traditions still practiced daily.
3. **Healthcare Access That Punches Above Its Weight** — Cardarelli hospital in Campobasso, Gemelli Molise (Rome's Gemelli network) in Campobasso, short waits compared to northern regions, SSN coverage simple to enroll.

### New Cons
1. **Climate Extremes** — Hot, humid summers in the lower valleys; snowy winters in hill towns above 700m mean chains, heating-oil costs, and occasional road closures.
2. **Depopulation Reality** — Many villages have aging populations and shrinking services (closed schools, reduced bus routes, shuttered shops); choose your town carefully.
3. **Airport & Long-Haul Travel** — No regional airport; nearest hubs (Naples, Rome FCO, Pescara) are 1.5–3 hours by car. Frequent transatlantic travel becomes a logistical commitment.

## Files to change
- `public/data/regions/italy/molise.json` — append to `prosCons.pros[]` and `prosCons.cons[]`
- `regions` table row for `slug='molise'` — same JSON updates via migration/insert tooling
- Lightly refresh `prosCons.intro.tradeoff` and `finalTake.text` if needed to reflect broader scope (optional, ask first)

## Out of scope
- No component changes (`ProsConsInteractive.tsx` already renders any number of items)
- No styling changes
- Other regions unchanged

Want me to proceed with these 3 new pros + 3 new cons as written, or tweak the categories/copy first?
