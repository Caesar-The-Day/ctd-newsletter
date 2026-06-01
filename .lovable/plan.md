## Goal
Make the Molise Healthcare & Infrastructure section genuinely useful for a retiree weighing isolation vs. access — not just a list. Add depth to hospitals, broaden the airport picture, and make the Rome/Naples connectivity story tangible through a small interactive component.

## 1. Expand hospital data (data-only)
Update `regions.region_data->'healthcare'->'hospitals'` for Molise with richer fields the existing `HealthcareInfrastructure` card already supports (specialties, beds, ER level, distance from main towns) and add 2 missing key facilities:

- **Ospedale Cardarelli (Campobasso)** — DEA II-level ER, ~430 beds, full cardio/onco/neuro, stroke unit, dialysis. Reference hospital for the region.
- **Gemelli Molise (Campobasso)** — Università Cattolica affiliate; oncology, radiotherapy, cardiac surgery, robotic surgery. Reference center pulling patients from Abruzzo and Puglia.
- **Ospedale San Timoteo (Termoli)** — DEA I, ~250 beds, maternity, ER, oncology day hospital; the coastal anchor.
- **Ospedale Veneziale (Isernia)** — *new entry*; main hospital for western Molise, orthopedics, general surgery, ER.
- **Ospedale Caracciolo (Agnone)** — mountain hospital, basic ER + first aid; honest note about reduced services and the long-running downgrade debate.
- *Cross-border safety net*: short callout that residents near the coast also use **Ospedale Renzetti (Lanciano, Abruzzo)** and **Policlinico Gemelli / Umberto I in Rome** for highly specialized care reachable via A14/A1.

Each hospital gets: `specialties[]`, `beds`, `erLevel`, `link` (official ASReM page where possible), `distanceFrom` (Campobasso/Termoli/Isernia in km + drive min).

## 2. Broaden airports
Update `airports[]` with realistic options a Molise resident actually uses, each with drive time from Campobasso and Termoli, plus a one-line "best for" note:

- **NAP — Napoli Capodichino** — ~2h from Campobasso. Best for European low-cost + intercontinental via hub.
- **PSR — Pescara Abruzzo** — ~1h15 from Termoli. Best for Ryanair to UK/N. Europe in summer.
- **FCO — Rome Fiumicino** — ~3h drive or train+Leonardo Express. Best for long-haul / US flights.
- **CIA — Rome Ciampino** — ~3h. Low-cost Ryanair/Wizz hub.
- **BRI — Bari Karol Wojtyła** — ~2h30 from Termoli via A14. Useful alternative for Eastern Europe/Greece routes.
- **FOG — Foggia Gino Lisa** — ~1h30 from Termoli. Small, limited but growing domestic schedule.

## 3. Strengthen connectivity narrative
Rewrite `highways[]` and `railways[]` with the central-Italy story front and centre:

- **A14 Adriatica** — coastal spine; Termoli → Pescara 1h, → Bari 2h15, → Bologna 4h.
- **A1 Autostrada del Sole** — accessed via SS17/Venafro; Isernia → Rome 2h, → Naples 1h30.
- **SS17 Appennino Sannitico** — Campobasso ↔ A1 lifeline; honest note on winter conditions.
- **SS650 Trignina** — Termoli ↔ inland, links A14 to A1 via Molise.
- **Adriatic rail (Termoli)** — Frecciarossa/Frecciargento: Termoli → Bologna 3h45, → Milano 5h30, → Bari 1h45.
- **Campobasso–Roma Tiburtina** — ~3h30 (electrification works in progress); the only direct Rome rail.
- **Campobasso–Napoli via Vairano** — ~3h regional connection, often faster door-to-door than Rome.
- **Trans-Siberian d'Italia (Sulmona–Isernia)** — historic tourist line, worth a mention as lifestyle infrastructure.

## 4. New interactive: "Reaching Central Italy from Molise"
Add a small component `MoliseCentralItalyReach.tsx` (modeled on the existing `UmbriaRomeFlorenceCorridor` and `PugliaCityReachMap` patterns already in `src/components/sections/`).

Behavior:
- Toggle origin: **Campobasso / Termoli / Isernia / Agnone**.
- Grid of destinations with three travel modes (car / train / bus) showing time + cost band:
  - Rome, Naples, Pescara, Bari, Bologna, Foggia, plus airports FCO, NAP, PSR, BRI.
- Highlights nearest realistic option per destination (e.g. "Isernia → Naples = 1h30 by car, fastest").
- Compact, no map dependency required — uses cards + small SVG corridor diagram (Adriatic spine vs. Apennine crossing).

Mounted in `RegionPage.tsx` immediately after `HealthcareInfrastructure` for `region === 'molise'`, mirroring how Umbria mounts `UmbriaRomeFlorenceCorridor`.

## 5. Files touched
- DB: `UPDATE regions ... region_data` for `slug='molise'` (hospitals, airports, highways, railways)
- New: `src/components/sections/MoliseCentralItalyReach.tsx`
- Edit: `src/pages/RegionPage.tsx` (mount the new component for Molise only)

## Open question
Want me to also surface the **cross-border hospital safety net** (Lanciano, Rome Gemelli) as its own small card row inside the Healthcare tab, or keep it as a single inline paragraph under the hospitals list?
