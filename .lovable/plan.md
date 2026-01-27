

# Umbria Festival Calendar Expansion + Wine & Recipes Components

## Summary
This plan covers three major additions to the Umbria region page:
1. **Expand UmbriaFestivalCalendar** with the complete 2026 festival list (13 major festivals + 7 food sagre)
2. **Create UmbriaWineExplorer** component with style toggle and practicality slider
3. **Create UmbriaRecipes** component with Rustic/Refined toggle for 4 signature dishes

---

## 1. Expand UmbriaFestivalCalendar

### Current State
The component has 6 festivals hardcoded. The user provided a comprehensive list of 13 major festivals and 7 food sagre for 2026.

### New Festival Data Structure

**Major Festivals (13):**

| Festival | Location | Dates | Type |
|----------|----------|-------|------|
| Umbria Jazz Winter | Orvieto | Through Jan 3, 2026 | Music |
| Holos Festival | Perugia (Rocca Paolina) | Mar 14-15, 2026 | Wellness |
| Calendimaggio | Assisi | May 6-9, 2026 | Medieval |
| Corsa dei Ceri | Gubbio | May 15, 2026 | Tradition |
| Infiorata di Spello | Spello | Jun 6-7, 2026 | Art/Religious |
| Chroma Festival | Bastia Umbra | Jun 11+, 2026 | Music |
| Perugia 1416 | Perugia | Jun 12-14, 2026 | Medieval |
| Festival dei Due Mondi | Spoleto | Late Jun - Mid Jul | Performing Arts |
| Umbria Jazz Summer | Perugia | Jul 3-12, 2026 | Music |
| Trasimeno Blues | Lake Trasimeno | Jul-Aug | Music |
| Montelago Celtic | Colfiorito | Aug 6-9, 2026 | Cultural |
| Festival del Medioevo | Gubbio | Late Sep | Cultural |
| Eurochocolate | Perugia | Nov 20-29, 2026 | Food |

**Food Sagre (7):**

| Sagra | Location | Timing |
|-------|----------|--------|
| Sagra dell'Oca | Bettona | Jul 31 - Aug 9, 2026 |
| Sagra del Pesce | Passignano sul Trasimeno | August |
| Festa della Cipolla | Cannara | September |
| Sagra della Polenta | Cannara | September |
| I Primi d'Italia | Foligno | Late September |
| Mostra Mercato del Tartufo | Gubbio/Citta di Castello | Oct-Nov |
| November Food Celebrations | Assisi/Foligno/San Martino in Colle | November |

### UI Enhancements
- Add a **toggle between "Major Festivals" and "Food Sagre"** tabs
- Update the month grid to handle all 12 months with events
- Add new icon types: `Leaf` (wellness), `Flower2` (Infiorata), `Guitar` (Chroma/Celtic), `UtensilsCrossed` (Sagre)
- Update Eurochocolate dates to **November 20-29, 2026** (per user's latest info)

---

## 2. Create UmbriaWineExplorer Component

### Concept
A dedicated Umbrian wine section that acknowledges the region's "underdog" status while highlighting its genuine gems: Sagrantino di Montefalco and Orvieto Classico.

### Features

**Binary Style Toggle:**
- **Bold & Structured** → Highlights Montefalco Sagrantino DOCG, Rosso di Montefalco
- **Light & Everyday** → Highlights Orvieto Classico, Grechetto, Trebbiano Spoletino

**Practicality Slider (0-100):**
- **0-30: Table Wine** → Daily drinkers, aperitivo wines
- **40-60: Dinner Party** → Good bottles for guests
- **70-100: Special Occasions** → Sagrantino Riserva, premium labels

**Mini-Map Integration:**
- Highlight specific DOCG/DOC zones when wines are selected:
  - Montefalco (around Spoleto)
  - Orvieto (western border with Lazio)
  - Colli del Trasimeno (lake area)
  - Torgiano DOCG (near Perugia)

### Wine Cards (6 total)
1. **Sagrantino di Montefalco DOCG** - Bold, tannic, world-class aging potential
2. **Rosso di Montefalco DOC** - Sagrantino's approachable younger sibling
3. **Orvieto Classico DOC** - Crisp white, great value, perfect with fish
4. **Grechetto** - Umbria's native white, nutty and food-friendly
5. **Trebbiano Spoletino** - Underrated white with complexity
6. **Torgiano Rosso Riserva DOCG** - Rare gem, comparable to Brunello quality

### Editorial Voice
Frame it as "Umbria's wines aren't famous because Tuscany got there first. But serious wine people know: Sagrantino is Italy's biggest secret, and Orvieto punches above its weight class."

---

## 3. Create UmbriaRecipes Component

### Concept
A Rustic/Refined toggle showing 4 Umbrian dishes - 2 rustic (hearth-cooking, peasant origins) and 2 refined (restaurant interpretations, seasonal ingredients).

### Recipe Cards

**Rustic (2):**

1. **Strangozzi al Tartufo Nero**
   - Hand-rolled pasta with black truffle
   - Story: "Norcia's nuns supposedly invented this pasta. The name means 'little laces' or possibly 'priest-stranglers' - depending on who's telling the story."
   - Wine pairing: Grechetto or Orvieto Classico

2. **Torta al Testo con Salsiccia e Rapini**
   - Flatbread with sausage and broccoli rabe
   - Story: "The testo is a clay disc heated over fire. Every Umbrian family has one. This is festival food, picnic food, life food."
   - Wine pairing: Rosso di Montefalco

**Refined (2):**

3. **Piccione alla Ghiotta**
   - Umbrian-style squab with olives and wine sauce
   - Story: "The ghiotta is the sauce - pan drippings, local olives, a splash of wine. Umbria's answer to French technique, done in cast iron."
   - Wine pairing: Sagrantino di Montefalco

4. **Umbricelli con Ragù d'Oca**
   - Hand-rolled pasta with goose ragù
   - Story: "Umbria raises geese the way other regions raise chickens. This ragù takes four hours but feeds a village."
   - Wine pairing: Torgiano Rosso Riserva

### Component Features
- Reuse existing `RecipesInteractive` pattern with Rustic/Refined tabs
- Add wine pairing callouts with links to the new WineExplorer section
- Include origin story snippets that connect to Norcia/truffle culture

---

## Technical Implementation

### New Files to Create
| File | Purpose |
|------|---------|
| `src/components/sections/UmbriaWineExplorer.tsx` | Wine section with toggle, slider, and mini-map |
| *Update* `src/components/sections/UmbriaFestivalCalendar.tsx` | Expand festival data and add sagre tab |

### RegionPage.tsx Integration
```tsx
{region === 'umbria' && (
  <>
    <UmbriaChocolateCity />
    <UmbriaFestivalCalendar />  {/* Already exists, will be expanded */}
    <UmbriaNorciaTable />
    <UmbriaWineExplorer />      {/* NEW */}
  </>
)}

{/* Existing RecipesInteractive - will need Umbria data */}
{regionData.recipes?.cards && regionData.recipes.cards.length > 0 && (
  <RecipesInteractive ... />
)}
```

### Data Strategy
Since Umbria currently has `null` for wine and recipes in the database, two options:
1. **Hardcode in components** (like UmbriaChocolateCity) - faster, self-contained
2. **Add to database** - follows project pattern for data-driven regions

I recommend **Option 1** for the initial build since these are Umbria-specific and won't be reused. This matches the pattern used for UmbriaChocolateCity, UmbriaFestivalCalendar, and UmbriaNorciaTable.

### Image Requirements
Will need to generate/source images for:
- Wine bottles/vineyards (Sagrantino, Orvieto)
- Recipe dishes (Strangozzi, Torta al Testo, Piccione, Umbricelli)
- Festival photos (Infiorata di Spello, Trasimeno Blues, Montelago Celtic)

---

## Section Order on Page

The Umbria-specific culture sections will appear in this order:
1. UmbriaChocolateCity (Perugia's chocolate story)
2. UmbriaFestivalCalendar (expanded with sagre)
3. UmbriaNorciaTable (butcher's table, truffles)
4. UmbriaWineExplorer (NEW - wine toggle/slider)
5. UmbriaRecipes (NEW - Rustic/Refined dishes)

This creates a natural flow: Chocolate → Festivals → Food → Wine → Recipes

---

## Summary of Deliverables

1. **UmbriaFestivalCalendar** expanded with 20 festivals/sagre, tabbed UI, corrected Eurochocolate dates
2. **UmbriaWineExplorer** with style toggle, practicality slider, mini-map zones, 6 wine profiles
3. **UmbriaRecipes** with 4 dishes (2 rustic, 2 refined), wine pairings, Rustic/Refined toggle
4. **4-6 photorealistic images** for wine and recipes
5. **RegionPage integration** to render new components for Umbria

