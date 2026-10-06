# Fix Climate Snapshot showing Piemonte on every region

## What's wrong (confirmed)
The Climate Snapshot section works out which region it's on by reading the page address. Since the site moved under /regions/, the address reads "regions/liguria" instead of "liguria". No region matches that, so the section falls back to Piemonte's climate file. That's why every guide shows "A Year in Piemonte" with Turin, Alba, Verbania and Cuneo.

Each region already has its own climate content: a headline, write-up, cities and monthly data. That covers Calabria, Friuli, Lazio, Liguria, Molise, Trentino-Alto Adige, Umbria and Veneto in the database, and Piemonte, Puglia and Lombardia in their own files. Nothing new needs to be written.

## Fix
1. The page tells the Climate Snapshot which region it's showing, along with the region's display name. The section stops reading the address.
2. The section loads that region's own climate content: first the database, then the region's own file.
3. Remove the silent Piemonte fallback. If a region has no climate content, the section hides instead of showing another region's.
4. The seasonal colours and photos follow the region passed in, not a guess from the address.
5. Check every live region (Calabria, Lazio, Liguria, Lombardia, Molise, Piemonte, Puglia, Trentino-Alto Adige, Umbria, Veneto) plus the Friuli draft. Each one's Climate Snapshot should show its own name, write-up and cities.

## Technical details
- `ClimateSnapshot` takes a `region` (slug) prop and an optional `displayName` prop. `RegionPage` passes `region` from `useParams`.
- Delete `window.location.pathname.slice(1)` and the `/data/piemonte-climate.json` last-ditch fetch.
- Static fallback order: `/data/regions/italy/{slug}-climate.json`, then `/data/{slug}-climate.json`. Both go through the existing basePath shim.
- Check whether any other section also reads the region from `window.location.pathname`, and fix any that does the same way.
- Verify with Playwright on `/regions/<slug>` for each region.
