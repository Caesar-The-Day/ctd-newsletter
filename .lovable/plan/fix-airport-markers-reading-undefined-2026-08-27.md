# Fix: airport markers reading "undefined"

The airport pins on the Liguria map draw a small code badge under the plane icon, taken from a `code` field on each airport feature. A query of the Liguria map data confirms the four airport entries — Genova Cristoforo Colombo, Nice Côte d'Azur, Pisa Galileo Galilei and Milano Malpensa — have `name`, `type`, `coords` and `description`, but no `code`. The map prints that missing value straight into the badge, so every airport reads "undefined".

## The fix

1. Add the missing IATA codes to the four Liguria airport features: GOA, NCE, PSA, MXP.
2. Make the map renderer defensive so this can never render the word "undefined" again: when an airport has no `code`, fall back to a code found in parentheses in its name (e.g. "(GOA)"), and if there is still nothing, draw the plane icon with no badge at all.

The second step also protects every other region and any future scaffolded region whose airport entries omit the field.

## Technical detail

- Data: single privileged update to `regions.region_data` for `slug = 'liguria'`, setting `code` on the `airport`-type features inside the Transport & Access overlay.
- Component: `src/components/sections/InteractiveMap.tsx`, the `feature.type === 'airport'` branch — compute the badge text with a fallback and omit the badge element when empty.
- Verified afterwards in the running preview by opening the Transport & Access layer and reading the rendered badges.
