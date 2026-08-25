# Redesign the Rome vs. hill town comparison

Replace the current "Leans towards" bidirectional slider in `RomeResidentReality.tsx` with a clearer **Advantage panels** layout, since the user finds the direction of the slider ambiguous.

## What changes

**1. Drop the central slider metaphor**
- Remove the grid with "Leans towards" in the middle and the bar that extends left or right.
- Replace each comparison row with two clearly labeled panels: one for Rome (semi-central), one for the hill town (Tuscia / Ciociaria).

**2. Advantage panels per metric**
- Each metric becomes a rounded card containing two side-by-side panels.
- The panel that wins that metric gets:
  - A primary/accent left border or background tint
  - A checkmark or small "Wins here" badge
  - Slightly bolder text
- The losing panel gets a muted border/background and de-emphasized text.
- For purely factual rows where neither side really "wins" (e.g., "Car needed?"), label the panel with a simple descriptor instead of a winner badge.

**3. Keep all existing data**
- Reuse the same `COMPARISON` array and values (rent, buy price, car need, hospital access, airport, tourism pressure, English spoken).
- No changes to copy, numbers, or the regional data source.

**4. Responsive behavior**
- Desktop: two horizontal panels side-by-side within each card.
- Mobile: panels stack vertically; the winner panel stays first so the conclusion is visible without scrolling.

**5. Motion and polish**
- Use the existing `useStaggeredReveal` hook for the cards to animate in as the section scrolls into view.
- Keep subtle transitions on hover/focus for interactive feel.
- Continue using only semantic design tokens (`primary`, `accent`, `muted`, `foreground`, etc.) so light/dark mode still works.

## Technical

- Edit only `src/components/sections/RomeResidentReality.tsx`.
- Remove the `ComparisonRow` component and its "Leans towards" bar.
- Add a new `ComparisonCard` component that renders the two panels.
- Preserve existing imports and the Framer Motion / reveal animation patterns already in the file.

## Out of scope

- No changes to other regions, data files, or the surrounding tabbed dashboard.
- No new dependencies.
