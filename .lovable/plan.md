# Rome mobility section: align the styling, make it visual

The "Rome, practically" block is the Rome Mobility Explorer. Two problems: its headers use a serif font and a left-aligned column while every other section on the Lazio page uses centered, bold sans headings; and the body is text-heavy — bullet lists and badges with no imagery or moving parts.

## 1. Bring headers in line with the page

Current header block: small uppercase "Rome, practically" eyebrow, then a `font-serif` 3xl/5xl heading, all left-aligned in a narrow column.

Change to the page's standard pattern (as used by Living in Rome, Featured Towns, Thermal Springs):

- Centered header group, max-width intro paragraph centered under it.
- Eyebrow becomes an inline icon + label chip in primary color (train icon + "Rome, practically") instead of the bare uppercase line.
- `h2` becomes `text-3xl md:text-4xl font-bold` sans — drop `font-serif`.
- Same treatment for the two sub-headings inside the section (the mode panel title and the "Tourist Pressure Corridors" heading): drop serif, use bold sans at the sizes other sections use for sub-headings.

## 2. Make it visual and interactive

**Mode selector as illustrated tiles.** Replace the row of plain outline buttons with a scrollable strip of icon tiles — large icon, mode label, and a one-word cost tag — with the active tile lifted, tinted and underlined via a shared animated indicator (Framer Motion `layoutId`).

**Mode panel gets a visual spine.**
- A hero strip photo per mode (metro platform, regional train, tram in Monteverde, cobbled lane, riverside cycle path, GRA traffic) with the mode icon overlaid; generated as editorial images and stored locally under `public/images/lazio/rome-mobility/` in responsive WebP, matching the loading approach already used in "Lazio is not just Rome."
- Reliability rating becomes an animated 5-segment gauge that fills on view rather than a text line.
- Cost, frequency and hours become three compact stat tiles with icons (Euro, Clock, Calendar) instead of prose lines.
- "Works well if" / "Falls apart if" become two side-by-side panels with green check and muted × markers, animating in on mode change.

**A simple Rome transit diagram.** A lightweight SVG schematic of the three metro lines plus the ring, with the neighbourhoods named in the current data plotted as dots. Selecting a mode highlights the parts of the diagram that mode actually serves and dims the rest — so "the metro is irrelevant to Monteverde" is something you can see, not just read.

**Tourist pressure corridors, upgraded.** Each corridor becomes a card with a small photo, an animated pressure bar (Heavy / Moderate / Light) and a tap-to-reveal "resident workaround" line, in the same card idiom as the friction cards in the Living in Rome section. The existing Heavy-only filter stays, restyled as a toggle chip.

## Technical notes

- Single file: `src/components/sections/RomeMobilityExplorer.tsx`. No data-layer or route changes.
- Framer Motion is already a dependency and used elsewhere on this page.
- Images generated at 1024px, exported as WebP at two widths with `loading="lazy"` and `srcset`, following the pattern established in `LazioBeyondRome.tsx`.
- All colors via existing semantic tokens; no hardcoded palette values.
