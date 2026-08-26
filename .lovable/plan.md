# Friuli: Healthcare & Infrastructure, rebuilt

Today Friuli renders the shared healthcare section: three hospital cards, one airport, two motorways, two rail lines, a short travel-time list. It says nothing about the thing that actually defines this corner — it is Italy's doorstep to Slovenia, Croatia, Austria and the Adriatic.

Replace it with a Friuli-only section, `FriuliHealthcareInfrastructure`, built as a three-tab experience with real motion and photography, in the same visual language as the Three Souls, Bora and Cross-Border modules.

## Tab 1 — Care, honestly

- **Animated stat strip on entry**: national healthcare ranking, hospitals with emergency rooms, minutes from Udine to its teaching hospital, share of residents within 30 minutes of a hospital.
- **Care tier ladder**: medico di base → local ospedale di rete (Gorizia, Palmanova, Latisana, San Daniele, Tolmezzo) → regional hub (Cattinara/Maggiore Trieste, Santa Maria della Misericordia Udine, Pordenone) → specialist institutes (Burlo Garofolo, CRO Aviano — one of Italy's leading cancer centres). Each tier animates in with icon, what it handles, typical distance.
- **Expanded hospital roster** covering all four provinces plus Carnia and Val Canale, with specialty chips, emergency-room badge, verified website and map links, hover lift and staggered reveal.
- **Where you live changes your care**: a small selector tied to the three Friulis (Coast/Karst, Plain, Alps) showing drive time to nearest ER and nearest teaching hospital as animated radial dials — the honest Alpine trade-off already established elsewhere on the page.
- **Registering with the SSN**: four-step animated timeline (codice fiscale → residency → ASUGI/ASUFC district office → tessera sanitaria and choosing a doctor), plus the cross-border note: EHIC/S1, treatment in Slovenia and Austria, and what actually gets reimbursed.
- Emergency numbers as bold badge tiles, with the multilingual note (Slovene and German are usable in the border districts).

## Tab 2 — Out of Friuli

The whimsical centrepiece: a hand-drawn-feel **compass rose** at the region's centre with animated spokes reaching Ljubljana, Zagreb, Vienna, Salzburg, Munich, Venice, Milan, Budapest and Rome. Selecting a spoke animates a bar comparing car vs rail vs flight time and shows a photo card of the destination with a one-line "why you'd actually go" (Klagenfurt for shopping, Ljubljana for a dentist, Vienna for a concert weekend).

Below it:
- **Airport panel** for Trieste (TRS, with its own rail station), Venice (VCE), Treviso (TSF), Ljubljana (LJU), Klagenfurt (KLU) and Munich (MUC) — drive time, what each is good for, and which airline patterns matter to a retiree flying home.
- **Rail and road spine graphic**: inline SVG of the A4 Serenissima, A23 Alpe-Adria, the Vienna–Villach–Udine–Venice axis, and the Trieste–Ljubljana line. Hovering a line highlights it and lists towns served.
- **Micromobility reality**: Alpe-Adria cycle route, ski-bus and border-bus links, where a car is non-negotiable.

## Tab 3 — Adriatic by water

A gently animated sea panel with drifting wake lines and a boat marker tracing routes:
- Trieste ↔ Muggia, Grado, Lignano, Piran and Rovinj seasonal fast ferries; Venice by sea; and onward Adriatic links to Croatia (Pula, Rovinj, Poreč) and the Ancona–Split corridor.
- Each route card: operator, season, crossing time, indicative fare, and whether a passport is needed.
- Port of Trieste framed properly: Italy's biggest port by tonnage, the reason the city faces east, plus cruise and cargo context.
- Honest caveats: most services are seasonal, winter Bora cancels sailings.

## Whimsy and graphics

Editorial photos generated in the region's established style: a border milestone in snow, the Trieste waterfront and ferry pier, an alpine ambulance road, the Alpe-Adria cycle path, plus small destination cards for the compass. Motion: drifting wake lines, a slowly rotating compass needle, staggered reveals, count-ups, animated dials and bars — all respecting reduced-motion.

## Technical notes

- New `src/components/sections/FriuliHealthcareInfrastructure.tsx`, rendered from `RegionPage.tsx` for `friuli-venezia-giulia` in place of the shared `HealthcareInfrastructure`. Shared component and all locked regions untouched.
- Content extends `regions.region_data->'healthcare'` for Friuli with `careTiers`, expanded `hospitals` (specialties, emergency, verified links), `bandAccess` (per-Friuli drive times), `ssnSteps`, `crossBorderCare`, `destinations` (compass data), richer `airports`, `spineLines`, and a new `ferries` block. Applied via SQL update; the component renders defensively and returns null for missing blocks.
- Compass, spine and sea graphics are hand-authored inline SVG/Canvas with semantic design tokens — no new libraries. Framer Motion for reveals, already in the project.
- Photos generated and stored locally under `public/images/friuli-venezia-giulia/infrastructure/`, per the no-external-images rule.
- External links (hospitals, ferry operators, airports) verified with a fetch check before being written into the data.
