## Make Cities & Towns a Toggleable Map Layer

Right now, the city/town pins on the Calabria map are added **directly** to the map and stay on permanently. National Park polygons (Sila, Aspromonte, Pollino) sit underneath them but, because polygons capture clicks across their entire area, they end up "swallowing" clicks meant for the town pins — and conversely, when you do try to click a park, town pins block parts of it.

The fix is to give cities their own toggle, exactly like the other overlays.

### What changes

**Single file: `src/components/sections/InteractiveMap.tsx`**

1. **Move city/town markers into their own `LayerGroup`** (instead of adding directly to the map). Register it in `overlayLayersRef` under a synthetic id like `__cities__`.

2. **Add "Cities & Towns" as the first toggle button** in the overlay control row (using the `MapPin` icon). It defaults to **ON** so the map looks the same on first load.

3. **Initialize `activeOverlays` with `__cities__`** plus any default-on overlays, so the city layer is active by default.

4. **Render order / click priority**:
   - When the cities layer is active, call `bringToFront()` on each marker and use a high `zIndexOffset` (e.g. 2000) so town pins always sit above park polygons and are clickable.
   - When the user wants to explore a park, they can toggle "Cities & Towns" off, leaving the polygons fully clickable.
   - Polygons (zones) are also given a slightly lower pane priority so they don't intercept clicks meant for any markers layered above them.

5. **Keep heritage / airport / ferry overlays unchanged** — they already use `zIndexOffset: 1000` and work fine.

### UX result

Above the map, the toggle row will read:

```text
[● Cities & Towns]  [ National Parks ]  [ Historic & Cultural Sites ]  [ Airports ]  [ Ferries & Sicily Link ]
```

- Default state: Cities ON, all others OFF — same as today.
- Turn on **National Parks** + leave Cities ON → both visible, town pins clickable on top.
- Turn **Cities OFF** → park polygons become fully clickable across their entire area, including over Cosenza, Catanzaro, etc.

### Files Modified
- `src/components/sections/InteractiveMap.tsx` — wrap markers in a LayerGroup, add cities toggle, adjust z-index.

No database changes, no other components touched. Works for every region (Piemonte, Puglia, Veneto, etc.) since the logic is generic — they just gain a "Cities & Towns" toggle too.
