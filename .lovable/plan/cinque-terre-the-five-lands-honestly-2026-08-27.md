# Cinque Terre: The Five Lands, Honestly

A new signature Liguria module that treats Cinque Terre as a place people actually live in and visit, not a postcard. Interactive, photo-led, and honest about crowds, cost, and the vertical reality.

## What gets built

**1. The Five Villages, side by side**
A horizontal strip of the five villages (Monterosso, Vernazza, Corniglia, Manarola, Riomaggiore) rendered on a stylised coast profile — sea below, terraced hills above — matching the coastal-strip language already used in Liguria Afloat and On Two Wheels. Click a village to open a panel with:
- A real sourced photo
- Character in one line (beach village, harbour amphitheatre, the one up the stairs, sunset village, the working one)
- Practical facts: resident population, station on the line or not, 382-step climb for Corniglia, beach/no beach, car access reality
- Resident honesty note: what it's like in February vs August
- Official links (park authority, village pages)

**2. The Crowd Clock**
A month-by-month band showing visitor pressure across the year with a scrubbable month selector. For the selected month it reports: crowd level, sea temperature feel, what's open vs shuttered, trail conditions, and a one-line verdict ("go", "go early", "avoid the middle of the day", "the villages are yours"). Makes the honest case that late October and March are the sweet spots.

**3. Walk it or take the train?**
A route chooser between adjacent village pairs. For each leg, compare:
- The Sentiero Azzurro coastal trail: distance, climb, walking time, difficulty, whether the section is currently open (Via dell'Amore reopened 2024; Manarola–Corniglia status)
- The train: journey time, frequency, cost
- The ferry: seasonal, scenic, skips Corniglia
Plus the Cinque Terre Card explainer — trail card vs train card — with the official park pricing link, and the rule that the trails are ticketed.

**4. The Terraces**
A short visual panel on the dry-stone walls: the roughly 6,700 km of muretti a secco holding the hills up, what abandonment costs (landslides, the 2011 flood), and who is rebuilding them. Ties into the existing heroic-viticulture theme without repeating the slope calculator — this one is about the walls, not the wine economics, and links to Sciacchetrà producers and the park's wall-restoration programme.

**5. Living there vs visiting**
A compact honest verdict card: why almost nobody retires inside the five villages (no car, stairs everywhere, tourist-priced groceries, one small clinic, La Spezia for anything real) and where people actually settle instead — Levanto, La Spezia, Portovenere, Bonassola, Framura — each with a one-line reason and a link across to towns already covered on the page.

## Photos

Source real, freely-licensed photos from Wikimedia Commons using the existing `scripts/source-town-photos.ts` pipeline: five village photos, plus terraces, Sentiero Azzurro, Sciacchetrà vineyards, and the settle-instead towns. Saved locally under `public/images/liguria/cinqueterre/` with attribution recorded in the Liguria photo-credits file. No AI-generated imagery.

## Technical notes

- New `src/components/sections/CinqueTerre.tsx` plus `cinqueTerreData.ts` for village, month, leg, and settlement data — same data-file pattern as `liguriaMarinaData.ts` and `liguriaCyclingData.ts`.
- Rendered only when `region === 'liguria'`, wired into `RegionPage.tsx` after `LiguriaVerticalCoast` and before `LiguriaOnTwoWheels`, so the coast reads: two rivieras → vertical coast → Cinque Terre → cycling.
- Framer Motion for panel transitions, semantic design tokens only, defensive rendering (return null on missing data), responsive down to mobile.
- All content stays Liguria-specific; no cross-region copy.
