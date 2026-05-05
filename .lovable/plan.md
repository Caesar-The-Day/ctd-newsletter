## Problem

In the Food / Wine / Culture section on `/calabria`, clicking the external link buttons does nothing. The buttons render but navigate to `undefined`.

**Root cause:** Calabria's `region_data.highlights.{food,wine,culture}.cards[].links[]` entries store the URL under the key `url`, but `src/components/sections/HighlightsShowcase.tsx` reads `link.href`. So `<a href={undefined}>` is rendered and nothing happens on click.

Other regions (Umbria, Veneto, etc.) use `href`, which is why the bug is Calabria-specific.

## Fix

Single small change in `src/components/sections/HighlightsShowcase.tsx`:

- In `HighlightCard`, accept either shape by resolving `const href = link.href ?? link.url` and use that on the `<a>` tag.
- Skip rendering the button if neither is present (defensive).

This avoids touching the database (locked region content) and also keeps backward compatibility with both data shapes going forward.

## Verification

After the fix, on `/calabria`:
- Open Food / Wine / Culture, expand a card (e.g. 'Nduja di Spilinga, Cipolla Rossa di Tropea, Cirò Marina).
- Each link button should open the correct external URL in a new tab.
