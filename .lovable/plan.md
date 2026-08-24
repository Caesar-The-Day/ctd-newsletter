# Lazio Beyond Rome: per-place photos

Make the main image in "Lazio is not just Rome" respond to place selection, not just the landscape tab.

## Behaviour

- Each landscape tab (Volcanic lakes, Coast, Mountains, Countryside) keeps its AI-generated image as the default shown when the tab opens.
- Place cards become clickable. Clicking a card (e.g. Lake Bracciano) swaps the main photo to that place's own photo and marks the card as selected.
- Clicking the selected card again, or switching tabs, returns to the tab's default landscape image.
- Places without a supplied photo stay non-selectable and keep showing the default image, so the section works while photo sets are still incomplete.
- Image caption/alt updates to the selected place name; a short crossfade on swap.

## Photos in this round

The four uploaded lake photos are added for the Volcanic lakes tab:

- Lake Bracciano
- Lake Bolsena
- Lake Albano (Castelli Romani)
- Lake Vico

Coast, Mountains and Countryside place photos slot into the same structure when you supply them — no further code changes needed beyond adding the files and their references.

## Technical notes

- Uploads go to the Lovable CDN via `lovable-assets` and are referenced through `.asset.json` pointers; the AVIF Albano file is converted to JPEG first.
- `LANDSCAPES` in `src/components/sections/LazioBeyondRome.tsx` gains an optional `image` field on each `Place`.
- New local state `selectedPlace`, reset whenever the active landscape changes; displayed image is `selectedPlace?.image ?? active.image`.
- Selected card gets a ring/primary border via semantic tokens; cards are keyboard-accessible buttons.
- No changes to other regions or sections.
