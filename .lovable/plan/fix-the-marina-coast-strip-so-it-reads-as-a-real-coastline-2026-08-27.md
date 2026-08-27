# Fix the marina coast strip so it reads as a real coastline

The current strip draws water as the *lower* half of the panel and then places every anchor pin *above* the shoreline — i.e. inland. It also stacks pins at arbitrary vertical offsets that carry no meaning, so the graphic looks scattered rather than geographic.

## What changes

1. **Flip the geography.** Land occupies the top band, sea the bottom — same as now — but the shoreline becomes the anchor line: every marina pin sits *on* the coastline, its stem dipping into the water, never floating over land. Add faint "Ligurian Sea" and "Apennine hinterland" labels so orientation is unambiguous.

2. **Give the curve Liguria's real shape.** Replace the generic wave with a shallow arc that reads as the Gulf of Genoa: the coast dips to its lowest point around Genoa (mid-strip) and rises toward the French border and Tuscany. Genoa then naturally sits at the bottom of the bay.

3. **Position pins by coast, not by hand.** Each marina's vertical position is computed from the shoreline curve at its `x`, so pins always kiss the water line. The existing `y` field in `liguriaMarinaData.ts` becomes a small collision nudge only (a short leader line lifts a crowded pin slightly, with a hairline connecting it back to its point on the coast) instead of an arbitrary scatter.

4. **Always-on town labels.** Names currently appear only on hover/active, which is why the strip looks like anonymous icons. Show every town name in small type, alternating above/below to avoid overlap, with the active one emphasised.

5. **Ponente / Levante split.** A subtle divider and two quiet section labels at Genoa, so the strip also teaches the region's basic east/west split that the neighbouring module builds on.

6. **Sizing cue.** Pin size scales gently with berth count (Lavagna and Imperia read larger than Porto Venere), giving the strip a second layer of information at a glance.

## Technical notes

- All work in `src/components/sections/LiguriaAfloat.tsx`; the coast path becomes a shared cubic definition with a small helper that samples the curve's y at a given x, so markers and path never drift apart.
- `liguriaMarinaData.ts` keeps its schema; `y` is reinterpreted as a label-collision nudge (values reviewed, not restructured).
- Styling stays on semantic tokens, no hardcoded colors. Keyboard focus states and `aria-pressed` behaviour preserved.
- Verify with a Playwright element screenshot of the strip at desktop and at 390px width before calling it done.
