# Fix "API Key Required" on the Milan travel-time map

## Cause
The Lombardia "train time to Milan" map loads its background from a free map provider (CARTO) that now requires an account key. Without one it returns tiles stamped "API KEY REQUIRED". The Umbria Rome–Florence corridor map uses the same provider and has the same problem. Every other map on the site uses MapTiler with the site's existing key, and those still work.

## Fix
- Switch both maps to MapTiler's light map style (`dataviz-v2` or `streets-v2`), using the existing `VITE_MAPTILER_KEY`, with matching MapTiler/OpenStreetMap credit text.
- Keep the circles, markers, legend and zoom exactly as they are.

## Files
- `src/components/sections/MilanProximityTool.tsx` (tile URL + attribution)
- `src/components/sections/UmbriaRomeFlorenceCorridor.tsx` (same)

## Verify
Open /lombardia and /umbria in the preview and confirm real map tiles show with no "API key required" stamps.
