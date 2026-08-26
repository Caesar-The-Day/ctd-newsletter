# Trentino-Alto Adige: signature interactive modules

The region's real story is that it is two provinces in one: Italian-speaking Trentino and German-speaking Südtirol, the richest and best-run corner of Italy, with rules that don't exist anywhere else. Here are the modules that would make the page unmistakably Trentino.

## 1. Two Tongues, One Region (the identity selector)
A cinematic three-way selector — Trentino / Südtirol / Ladin valleys — with editorial photos and animated meters (cost, healthcare wait times, German needed, sunshine, winter severity). Each band lists its towns and one honest line about what daily life feels like. Includes a language reality check: which paperwork, doctors, and schools work in Italian vs German, and where Ladin is the third official language.

## 2. Can You Even Buy Here? (Südtirol housing rules explorer)
The single most decision-relevant thing about this region, and almost nobody covers it: Südtirol reserves large parts of new housing for residents, caps second homes, and many towns are closed to non-resident buyers. An interactive town lookup showing, per town: second-home status, whether residency unlocks purchase, and the practical path for a foreign retiree. Honest, sourced, with links to the provincial housing rules.

## 3. The Autonomy Dividend
A visual explainer of why services here feel un-Italian: the provinces keep roughly 90% of taxes raised locally. Animated flow diagram of euros staying local, translated into the things a retiree actually notices — hospital wait times, road maintenance, buses that arrive, bilingual bureaucracy. Paired with a "so what's the catch" panel (cost of living, housing scarcity, closed social circles).

## 4. Altitude Life Calculator
Pick an elevation band (valley floor 200m / mid-slope 700m / alpine 1,400m+) and a town, and see how winter length, snow days, sun hours, heating costs, driving conditions, and distance to a hospital change. Animated mountain cross-section that fills in as you slide altitude. This is the practical question every buyer here has and no one answers.

## 5. Mele & Masi (apples and mountain farms)
Val di Non grows a large share of Europe's apples — a whole valley as one orchard. An interactive seasonal wheel of the apple year plus a short "maso chiuso" explainer: the centuries-old closed-farm inheritance law that keeps farms undivided and shapes the whole landscape. Whimsical illustrated orchard graphic, seasons animate as you scrub the wheel.

## 6. Cable Car Commuting / Mountain Mobility
Schematic of the region's unusual mobility: funiviae as public transit (Bolzano–Renon, Mendola), the Brenner corridor to Innsbruck and Munich, Verona and Venice airports, valley rail lines, and the Trentino/Alto Adige Guest Pass free-transit system. Travel-time compass with animated legs, whimsical cable-car icons that ride along the lines.

## 7. Christmas Markets & the Season Economy
A calendar/season module showing how the year swings: ski season, Törggelen autumn, Christmas markets in five towns, summer hiking. Useful framing for retirees: when towns are packed, when they are dead, when prices spike, when the doctors go on holiday.

## Also worth doing
- Wine/food/culture cards: Gewürztraminer, Lagrein, Teroldego, Trentodoc sparkling, speck, canederli, strudel — with consortium links and photos, plus a "German plate vs Italian plate" slider similar in spirit to Friuli's border plate.
- Recipes: 2 rustic (canederli, gulasch) + 2 refined (Trentodoc-paired trout, strudel) with photos and pairings.
- Healthcare: custom module highlighting Bolzano/Trento hospitals, German-language care, and cross-border care in Innsbruck.

## Technical notes
- New components under `src/components/sections/` prefixed `Trentino*`, mounted in `src/pages/RegionPage.tsx` behind `region === 'trentino-alto-adige'` guards, matching the Friuli/Lazio pattern.
- Section headers and typography must reuse the existing shared heading treatment — no new fonts.
- All content stored in the `regions` row JSON where it's data; components render defensively and return null on missing data.
- Photos generated locally into `public/images/trentino-alto-adige/` — no external image URLs.
- Motion via Framer Motion; canvas/particle work throttled and paused off-screen.

## Suggested build order
Start with 1, 2, and 4 (identity selector, housing rules, altitude calculator) — those carry the most decision value. Then 3, 5, 6, 7.
