# Valle d'Aosta: signature sections

Italy's smallest region, sharp alpine valleys, French-speaking, autonomous, cheap fuel, fierce winters. Each section answers a real question a retiree would ask about living here.

## New sections (Valle d'Aosta only)

1. **Sun or Shade Finder ("Adret vs Envers")** - Pick a town and see how many hours of winter sun it gets compared with towns on the shaded side. Some villages go weeks without direct sun in December. This decides where you should live.
2. **Altitude Living Slider** - Drag from Pont-Saint-Martin (about 300 m) up to Cervinia (2,000 m). Watch snow days, heating cost, road closures, distance to the hospital and year-round population change at each height.
3. **The Bilingual Valley** - Common phrases in Italian, French and Patois side by side, plus where French actually shows up: road signs, school, the Comune and local TV.
4. **Autonomy Dividend** - What being a special-status region means in daily life: discounted fuel card, regional health top-ups, and housing and renovation grants. Each item says who qualifies and comes with a source link.
5. **Fontina & the Alpage Summer** - Follow the cows' journey up to summer pastures (June) and back down (the Désalpe in September and October), the Bataille des Reines cow fights, and how to buy cheese straight from the farm.
6. **Snow Season Clock** - Month by month: ski season, which tunnels and passes are open, the mud season when many places close, and the Fiera di Sant'Orso (30 and 31 January).
7. **Swiss & French Doorstep** - Drive times to Geneva, Chamonix, Martigny and Turin through the Mont Blanc and Great St Bernard tunnels, with tolls and when closures happen. Answers the question: "Can I live here and use Geneva for flights and specialist care?"
8. **Healthcare in the Valley** - The region's one hospital in Aosta, how long it takes to reach it from each side valley, helicopter rescue, and the cross-border option. Comes after the standard enrollment-cost note.

## Kept as they are
Hero, map (with the new ski layer), towns, the 12-town grid, recipes (polenta concia, carbonade, plus 2 refined dishes with wine), cost calculator, pros and cons, both books, and two different offers (consultation and Visto Facile). No 7% badges.

## Technical details
- Follow the Trentino pattern: `src/components/sections/Aosta*.tsx` components, gated in RegionPage by `region === 'valle-daosta'`, with content in one shared data file `src/data/valleDaostaModules.ts`. Each section returns null when its data is missing. Uses the region's existing color tokens.
- Sun-hours numbers are estimates (each town's orientation and the height of the mountains to its south) and are labelled as estimates. Facts about the autonomy benefits and the tunnels need a quick web check before writing.
- Only the Valle d'Aosta draft changes. Add a Playwright check using the admin session.
