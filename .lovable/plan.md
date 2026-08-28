# Make the trail cards actually link

The 16 route cards in "Dolomites & Wild Trentino" show a diagonal arrow that implies a link, but nothing is clickable. Fix: give each route a real, verified external page and make the whole card a link.

## What changes

Each of the 16 routes (4 per difficulty level) gets a URL pointing to an official tourism-board, park or hut page for that specific route — preferring `visittrentino.info`, `suedtirol.info`, the individual valley boards (Val Gardena, Alpe di Siusi, San Martino, Madonna di Campiglio), park sites, and the official Alta Via pages. Each link will be checked to return 200 before it goes in; anything that cannot be verified gets no link, and its card renders without the arrow rather than with a dead one.

Cards with a link become clickable (open in a new tab, `rel="noopener noreferrer"`, accessible label naming the route). Cards without one keep the current static look — no arrow, no hover affordance.

## Technical notes

- `src/components/sections/trentinoNatureData.ts`: add `link?: string` to the `routes` entry type in `TrailLevel`, and populate it for each verified route.
- `src/components/sections/TrentinoDolomitesOutdoors.tsx`: render the route card as an `<a>` when `route.link` exists, otherwise a plain `div`; render `ArrowUpRight` only in the linked case. Keep existing spacing, tokens and reveal animation.
- Link verification via HTTP status checks during the build; no other sections touched.
