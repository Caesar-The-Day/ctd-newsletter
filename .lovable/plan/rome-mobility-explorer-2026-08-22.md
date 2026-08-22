# Rome Mobility Explorer

An interactive, resident-focused section on the Lazio page that breaks down how you actually move around Rome by transit type, and flags where mass tourism makes specific corridors painful.

## What the user sees

**1. Transit mode selector** — a row of toggle buttons: Metro, Regional rail, Bus & tram, Walking, Bike/scooter, Car. Selecting one swaps the panel below.

For each mode:
- Coverage summary (what it reaches, frequency, hours of service)
- Cost line (single ticket, monthly pass, over-70 free travel where relevant)
- "Works well if you live in…" list of neighbourhoods
- "Fails if you live in…" honest counterpart
- A reliability rating shown as a simple 1–5 bar using design tokens

**2. Tourist-pressure corridors** — a second block listing the high-friction routes and nodes residents share with 35M visitors a year:
- Termini ↔ Colosseo (Metro B southbound)
- Ottaviano / Vatican (Metro A, mornings)
- Bus 64 and 40 Termini ↔ St. Peter's (pickpocket + crush corridor)
- Trastevere and Campo de' Fiori evening crush
- Spagna / Barberini Metro A midday
- Fiumicino Leonardo Express at peak arrival banks

Each corridor card shows: pressure level (chip: Heavy / Moderate / Seasonal), when it peaks, and a "resident workaround" line (alternate line, tram 8, walking route, off-peak window).

**3. Filter** — a toggle above the corridor list: "Show only heavy-pressure" so the pain points can be isolated quickly.

## Placement

Renders only for `region === 'lazio'`, directly after `RomeResidentReality` in `src/pages/RegionPage.tsx`, so the cost/access/friction overview leads into the deeper mobility tool.

## Technical notes

- New file `src/components/sections/RomeMobilityExplorer.tsx`, self-contained with hard-coded editorial data (same pattern as `LazioThermalSprings.tsx` and `RomeResidentReality.tsx`).
- Local `useState` for selected mode and the heavy-pressure filter; no data fetching, no DB changes.
- shadcn `Card`, `Badge`, `Button` plus lucide icons; all colours via semantic tokens (no hardcoded hex or `text-white`).
- IntersectionObserver reveal animation consistent with neighbouring sections.
- Responsive: mode selector wraps/scrolls horizontally on mobile, corridor cards go single column.
- No new images or dependencies.
