

## Show Wine Images in the Veneto Pour Selector

### The Problem
The generated wine images (`amarone-wine.jpg`, `prosecco-wine.jpg`, `soave-wine.jpg`, `bardolino-wine.jpg`) exist in `public/images/veneto/` and are referenced in `veneto.json`, but the `VenetoWinePourSelector` component uses a hardcoded `wines` array with no `image` property. The wine cards only show a circular gradient icon with a Wine lucide icon -- no actual photos.

### The Fix

**File: `src/components/sections/VenetoWinePourSelector.tsx`**

1. Add an `image` field to the `WineProfile` interface
2. Add image paths to each wine in the hardcoded `wines` array:
   - `amarone`: `/images/veneto/amarone-wine.jpg`
   - `prosecco`: `/images/veneto/prosecco-wine.jpg`
   - `soave`: `/images/veneto/soave-wine.jpg`
   - `bardolino`: `/images/veneto/bardolino-wine.jpg`
3. Replace the circular gradient icon in each wine selector card with an actual image -- a rounded photo thumbnail with the wine glass icon overlaid
4. Add a prominent wine image to the expanded detail panel -- a large photo on the left column above or alongside the story text, giving visual context when a wine is selected
5. Also update the two consortium links that were requested earlier but didn't make it into the component's hardcoded data:
   - Amarone link to `https://www.consorziovalpolicella.it/en/types-of-wines/amarone-della-valpolicella-docg/`
   - Bardolino link to `https://consorziobardolino.it/en/homepage/`

### Visual Result
- Wine selector cards: photo thumbnail replaces the plain gradient circle
- Expanded panel: large wine image visible alongside the editorial text
- The component goes from "text-only with icons" to "magazine-style with real photography"
