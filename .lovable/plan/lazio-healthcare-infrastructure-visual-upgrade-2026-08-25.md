# Lazio Healthcare & Infrastructure — Visual Upgrade

Today this section for Lazio is three plain hospital cards, two airport blurbs, and a short travel-time list. The data is thin and the presentation is a list. The plan enriches the content and rebuilds the section as an animated, interactive Lazio-specific experience — matching the visual language already used in Living in Rome, Rome Mobility, and Thermal Springs.

## What the user sees

**1. Section header, aligned to the page aesthetic**
Centered editorial header with a soft background texture, an animated stat strip on entry (count-up): number of provinces, hospitals with emergency rooms, minutes from Rome to Fiumicino, high-speed destinations reachable in under 3 hours.

**2. Tab 1 — Healthcare**
- **Care tier ladder**: three animated tiers — Local ASL clinic / Provincial hospital / Rome teaching hospital (Gemelli, Umberto I, Sant'Andrea, Bambino Gesù, San Camillo) — each with icon, what it handles, and typical distance.
- **Hospital cards with substance**: expanded roster covering all five provinces (Rome, Viterbo, Latina, Frosinone, Rieti) with specialties chips, emergency-room badge, verified website and map links, and an animated "quality" note. Hover lift + staggered reveal.
- **Distance dial**: pick a base area (Tuscia, Sabina, Castelli, Coast, Ciociaria, Rome) and see an animated radial gauge of drive time to its nearest full hospital plus to Rome's nearest teaching hospital.
- **How to register**: a 4-step animated horizontal timeline for enrolling in the SSN (codice fiscale → residency → ASL office → tessera sanitaria + choosing a medico di base), with the private-insurance alternative noted.
- Emergency numbers presented as bold badge tiles rather than a bullet list.

**3. Tab 2 — Getting Around & Out**
- **Airports**: illustrated cards for Fiumicino (FCO) and Ciampino (CIA) with role, typical airlines, and how to reach each from central Rome (Leonardo Express, FL1, Terravision, taxi flat fare) with times and costs.
- **Rail spine graphic**: an inline SVG schematic of Lazio showing the high-speed spine (Florence–Rome–Naples), the FL regional lines (FL1 Fiumicino, FL3 Viterbo/Bracciano, FL4 Castelli, FL5 Civitavecchia, FL6 Frosinone/Cassino, FL8 Nettuno) and the A1/A12/A24 motorways. Hovering or tapping a line highlights it and lists the towns it serves.
- **Reach selector**: choose a destination (Florence, Naples, Milan, Bologna, Bari, Fiumicino) and animated bars compare rail vs car time from Roma Termini.
- **Connectivity reality**: compact tiles for fiber coverage, mobile signal in hill towns, ferry links (Civitavecchia, Formia to Ponza), and where a car is non-negotiable.

**4. Motion and graphics throughout**
Framer Motion staggered card reveals, animated gauges and bars, hover lift, tab crossfades, count-up stats, respecting reduced-motion.

## Technical notes

- New component `src/components/sections/LazioHealthcareInfrastructure.tsx`, rendered by `RegionPage` for `lazio` in place of the shared `HealthcareInfrastructure`. The shared component and every locked region (Piemonte, Lombardia, Veneto, Puglia, Calabria, Umbria, Molise) are untouched.
- Content lives in the `regions.region_data->'healthcare'` JSON for `lazio`, extended with: expanded `hospitals` (with `specialties`, `emergency`, verified `link`/`mapLink`), `careTiers`, `baseAreas` (drive-time dial data), `ssnSteps`, richer `airports` (access options), `railLines`, `reachTimes`, and `connectivity`. Applied via a SQL update; component renders defensively and returns null for missing blocks.
- Rail schematic is hand-authored inline SVG using semantic design tokens — no new map library, no external image dependency.
- Icons from lucide-react; no hardcoded color utilities.
- All external links verified with a fetch check before being written into the data.
