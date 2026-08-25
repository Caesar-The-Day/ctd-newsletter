# Living in Rome — visual rebuild

Keep every fact currently in the section, but stop presenting it as a list. Rebuild "Living in Rome, not visiting it" as an editorial dashboard with animated, interactive panels.

## What changes

**1. Header band with live stat counters**
A slim band under the headline with four animated figures that count up when the section scrolls into view: 2.7M residents, 35M visitors/year, 3 metro lines, ~€2,900 monthly couple's budget. Sets the tone immediately and frames everything below.

**2. Cost tab → visual price ladder, not rows**
- Three stacked "ring" bands (Centro storico → Semi-central → Outer) rendered as horizontal bars whose length maps to the rent range, each with the €/month band, the €/m² buy price and the one-line honest note.
- Clicking a band expands it to reveal the detail note plus the running costs that apply (condo fees, utilities, groceries) as small chips.
- A "monthly reality" summary card showing the €2,600–3,200 verdict as a labelled composition bar (rent / utilities / condo / food).

**3. Getting around tab → connection radial**
- Rome sits in the centre; travel destinations (Fiumicino 32 min, Ciampino 40 min, Castelli 35 min, Coast 45–60 min, Naples 1h10, Florence 1h30, Milan 3h, Viterbo 1h45) sit around it as clickable nodes ordered by journey time, with a connecting line that animates on hover.
- Selecting a node shows the mode, cost and the practical note underneath.
- Below it: three compact "in-city" cards for metro, buses/trams and the €35 pass, plus a ZTL warning strip styled as a road sign.

**4. The friction tab → pressure gauges**
Each friction point becomes a card with a 1–5 severity meter (segmented bar), an icon, the headline number and the note. Sorted heaviest first: tourism, short-let rents, traffic, heat, bureaucracy, services, healthcare waits. Toggling a card flips it to show "the workaround" line residents actually use.

**5. Rome vs. hill town → split comparison, not a table**
Two-column face-off with a centre divider; each row animates in as a small tug-of-war bar leaning to whichever side wins that metric (cost leans to the hill town, hospital access and airport lean to Rome). Reads at a glance instead of as a spreadsheet.

**6. Motion and polish throughout**
Framer Motion crossfades on tab change (already a dependency, used in the Lazio nature section), staggered reveal of rows on scroll, subtle hover lift on interactive cards, and a faint Roman-stone texture/gradient backdrop drawn from the existing design tokens.

## Notes

- All copy, numbers and verdicts stay as they are today; only the presentation changes.
- No hardcoded colours — severity meters, ladders and comparison bars use existing semantic tokens (primary, muted, destructive, accent) so light/dark mode keeps working.
- Fully responsive: ladders and the radial collapse to stacked cards on mobile; comparison becomes two short stacked lists.

## Technical

- Rewrite `src/components/sections/RomeResidentReality.tsx` in place; no data-layer or route changes and no changes to other regions.
- Reuse `use-count-up`, `use-staggered-reveal` and `framer-motion` already in the project.
- Interactive state stays local (`useState`): active tab, expanded ladder band, selected radial node, flipped friction card.
