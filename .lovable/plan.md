## Changes for Molise

### 1. Mark Isernia as 7% eligible
Update the Molise region in the database: set `region_data.towns.grid[id=isernia].eligible7Percent` to `true` so the 7% badge appears on its card and dialog (same treatment Termoli/Agnone already get).

### 2. Add a "More Towns" intro paragraph about Molise's broad 7% eligibility
Surface a short editorial paragraph above the "More Towns to Consider" grid, only on the Molise page. Proposed copy:

> Worth knowing: nearly every town in Molise sits under the 20,000-resident threshold, which means most of them qualify for Italy's 7% flat-tax regime for foreign retirees. It's not Tuscany or Umbria — and it doesn't pretend to be. But if you're weighing Abruzzo or Puglia and want authentic, unvarnished Italy on a tight budget, Molise quietly punches above its weight.

### Technical details
- Data: `supabase--insert` UPDATE on `regions` for `slug='molise'` to (a) flip `eligible7Percent` on Isernia and (b) add `region_data.towns.moreTownsNote` with the paragraph above.
- `src/components/sections/TownsGrid.tsx`: add an optional `note?: string` prop; render it as a paragraph under the existing subtitle when present.
- `src/pages/RegionPage.tsx`: pass `note={regionData.towns.moreTownsNote}` to `<TownsGrid>` (typed loosely via existing data shape).

No other regions are affected — the note only renders if the field exists.