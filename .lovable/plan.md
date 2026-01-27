

# Umbria Wine & Recipe Section Overhaul

## Summary
Complete redesign of the wine section to be simpler and more impactful, plus adding full recipes with ingredients and methods. Includes AI-generated photos for all items.

---

## 1. Redesigned UmbriaWineExplorer

### Current Problems
- Too complex (toggle + slider + mini-map with dots)
- The SVG mini-map is crude and confusing
- 6 wines is overwhelming
- No real photos

### New Design: "Three Wines You Need to Know"

Simple, editorial-focused approach with 3 flagship wines and beautiful imagery:

| Wine | Classification | Character |
|------|----------------|-----------|
| Sagrantino di Montefalco | DOCG | The bold one - Italy's most tannic red |
| Orvieto Classico | DOC | The everyday one - crisp white, great value |
| Torgiano Rosso Riserva | DOCG | The secret one - Lungarotti's masterpiece |

### New Component Structure

**Layout:** Horizontal scrolling cards (mobile) or 3-column grid (desktop)

Each wine card includes:
- AI-generated photo (vineyard or bottle shot)
- Wine name and classification badge
- 2-3 sentence description in editorial voice
- "What to Know" bullet (one key fact)
- Pairing suggestion
- Price range
- External link button to official source

### Official Wine Links (Researched)
| Wine | Link | Source |
|------|------|--------|
| Sagrantino di Montefalco | https://www.consorziomontefalco.it/en/ | Consorzio Tutela Vini Montefalco |
| Orvieto Classico | https://www.orvietodoc.it/ | Consorzio Tutela Vini Orvieto |
| Torgiano Rosso Riserva | https://lungarotti.it/eng/ | Lungarotti Winery (primary producer) |

### Removed Features
- Wine style toggle (Bold/Light)
- Practicality slider
- SVG mini-map with dots
- Expandable card details

### Kept Features
- Editorial intro text
- "Insider Take" footer
- Link buttons to external sites

---

## 2. Full Recipe Overhaul

### Current Problems
- Only "key ingredients" listed
- No actual cooking method
- No photos
- Cards don't provide actionable recipes

### New Design: Complete Recipe Cards

Each recipe gets:
- AI-generated dish photo
- Full ingredient list with quantities
- Step-by-step method (numbered)
- Wine pairing with explanation
- Origin story
- Prep/cook time
- Servings

### Recipe Data (4 Dishes)

**1. Strangozzi al Tartufo Nero (Rustic)**

*Ingredients:*
- 400g strangozzi pasta (or thick spaghetti)
- 50g fresh black truffle (Tuber melanosporum)
- 80g unsalted butter
- 2 cloves garlic, lightly crushed
- 4 tbsp extra virgin olive oil
- Salt to taste
- Freshly ground black pepper

*Method:*
1. Bring a large pot of salted water to boil
2. In a wide pan, gently warm the olive oil and butter over low heat with the crushed garlic. Do not let it brown - you're infusing, not frying
3. Cook pasta until al dente (about 8 minutes for fresh strangozzi)
4. Remove garlic from the butter mixture
5. Add a ladleful of pasta water to the pan
6. Drain pasta and toss in the butter sauce, coating evenly
7. Remove from heat immediately - residual heat is enough
8. Shave truffle generously over each portion at the table

*Wine Pairing:* Grechetto or Orvieto Classico - the white's nuttiness echoes the truffle without competing

---

**2. Torta al Testo con Salsiccia e Rapini (Rustic)**

*Ingredients (Flatbread):*
- 500g all-purpose flour
- 250ml warm water
- 1 tsp baking soda
- 1 tsp salt
- 2 tbsp extra virgin olive oil

*Ingredients (Filling):*
- 300g Italian sausage (fennel-spiced if possible)
- 1 bunch rapini (broccoli rabe), tough stems removed
- 2 cloves garlic, sliced
- Red pepper flakes to taste
- Extra virgin olive oil

*Method (Flatbread):*
1. Combine flour, baking soda, and salt in a bowl
2. Add water and olive oil, mix until a smooth dough forms
3. Knead for 5 minutes, then rest covered for 30 minutes
4. Divide into 4 portions and roll each to 20cm circles, about 5mm thick
5. Heat a cast iron skillet or testo until very hot
6. Cook each flatbread 3-4 minutes per side until charred in spots and cooked through

*Method (Filling):*
1. Blanch rapini in boiling salted water for 2 minutes, drain and squeeze dry
2. Remove sausage from casings and crumble into a hot pan
3. Cook until browned, about 8 minutes
4. Add garlic and red pepper flakes, cook 1 minute
5. Add blanched rapini, toss to combine
6. Split warm flatbread horizontally, pile in filling, drizzle with olive oil

*Wine Pairing:* Rosso di Montefalco - the sausage fat wants a wine with structure

---

**3. Piccione alla Ghiotta (Refined)**

*Ingredients:*
- 2 young squab (piccione), about 400g each
- 100g pancetta, diced
- 150g Umbrian olives (Moraiolo or similar), pitted
- 8 fresh sage leaves
- 2 sprigs rosemary
- 150ml Sagrantino wine (or other robust red)
- 2 tbsp red wine vinegar
- 4 anchovy fillets
- 2 cloves garlic
- Extra virgin olive oil
- Salt and pepper

*Method:*
1. Pat squab dry and season generously inside and out with salt and pepper
2. Heat olive oil in a heavy braising pan over medium-high heat
3. Sear squab breast-side down for 4 minutes until deeply golden
4. Flip and sear backs for 2 minutes, then remove and set aside
5. In the same pan, cook pancetta until fat renders, about 5 minutes
6. Add garlic, anchovies, sage, and rosemary - cook until anchovies dissolve
7. Add olives and wine, scraping up any browned bits
8. Return squab to pan, breast up
9. Cover and braise at 160°C (325°F) for 45-50 minutes
10. Remove lid for final 10 minutes to crisp skin
11. Stir vinegar into the ghiotta sauce before serving
12. Serve squab with sauce spooned over

*Wine Pairing:* Sagrantino di Montefalco - the only wine with enough tannin to match the richness

---

**4. Umbricelli con Ragù d'Oca (Refined)**

*Ingredients (Ragù):*
- 600g bone-in goose legs (or duck as substitute)
- 1 goose or duck liver, cleaned and chopped (optional)
- 1 large onion, finely diced
- 2 carrots, finely diced
- 2 celery stalks, finely diced
- 400g tomato passata
- 150ml white wine
- 2 bay leaves
- 4 sprigs fresh thyme
- 100ml goose fat or olive oil
- Salt and pepper

*Ingredients (Pasta):*
- 400g umbricelli or thick spaghetti
- Freshly grated Pecorino Romano

*Method:*
1. Season goose legs generously with salt and pepper
2. In a large heavy pot, heat goose fat over medium heat
3. Brown goose legs on all sides, about 10 minutes total - remove and set aside
4. Add soffritto (onion, carrot, celery) to the pot, cook until soft, about 10 minutes
5. If using liver, add now and cook briefly until just browned
6. Pour in wine and let it reduce by half
7. Add tomato passata, bay leaves, and thyme
8. Return goose legs to pot, nestle them into the sauce
9. Cover and simmer on very low heat for 3-4 hours, until meat falls off bone
10. Remove legs, shred meat, discard bones and skin
11. Return shredded meat to sauce, adjust seasoning
12. Cook umbricelli in salted water until al dente
13. Toss pasta with ragù, serve with pecorino

*Wine Pairing:* Torgiano Rosso Riserva - Lungarotti's Rubesco Riserva was made for this dish

---

## 3. Images to Generate

Using the AI image generation API, create 7 photorealistic images:

### Wine Images (3)
| Image | Prompt |
|-------|--------|
| sagrantino-wine.jpg | "Professional food photography of Sagrantino di Montefalco DOCG wine bottle beside a filled glass with deep ruby-purple wine, set against Umbrian rolling hills with vineyards in soft golden hour light, shallow depth of field, magazine quality" |
| orvieto-wine.jpg | "Professional food photography of Orvieto Classico DOC white wine in an elegant glass with bottle, set on rustic Italian stone terrace overlooking Orvieto's medieval town on cliff, crisp summer light, editorial style" |
| torgiano-wine.jpg | "Professional food photography of aged Torgiano Rosso Riserva DOCG wine bottle with Lungarotti label style, in wine cellar with oak barrels in background, dramatic side lighting, magazine quality" |

### Recipe Images (4)
| Image | Prompt |
|-------|--------|
| strangozzi-tartufo.jpg | "Professional food photography of fresh hand-rolled strangozzi pasta generously topped with shaved black truffle on white ceramic plate, melted butter pooling, truffle shavings scattered, rustic Umbrian wood table, natural light, overhead angle, magazine quality" |
| torta-al-testo.jpg | "Professional food photography of Umbrian torta al testo flatbread split open and stuffed with crumbled Italian sausage and sautéed broccoli rabe, charred spots on bread, olive oil drizzle visible, on terracotta plate, natural light, magazine quality" |
| piccione-ghiotta.jpg | "Professional food photography of whole roasted squab (piccione) in cast iron pan with black olives, sage leaves, and rich pan sauce, rustic Italian kitchen background, warm lighting, 45-degree angle, magazine quality" |
| umbricelli-ragu-oca.jpg | "Professional food photography of thick hand-rolled umbricelli pasta with rich goose ragù, grated pecorino cheese on top, in rustic ceramic bowl, Umbrian countryside visible through window, natural light, magazine quality" |

---

## 4. Technical Implementation

### Files to Modify/Create

| File | Action |
|------|--------|
| `src/components/sections/UmbriaWineExplorer.tsx` | Complete rewrite - simpler 3-card layout |
| `src/components/sections/UmbriaRecipes.tsx` | Major update - add full recipes with methods |
| `src/assets/umbria/sagrantino-wine.jpg` | Generate |
| `src/assets/umbria/orvieto-wine.jpg` | Generate |
| `src/assets/umbria/torgiano-wine.jpg` | Generate |
| `src/assets/umbria/strangozzi-tartufo.jpg` | Generate |
| `src/assets/umbria/torta-al-testo.jpg` | Generate |
| `src/assets/umbria/piccione-ghiotta.jpg` | Generate |
| `src/assets/umbria/umbricelli-ragu-oca.jpg` | Generate |

### UmbriaWineExplorer New Structure

```tsx
// Simplified data structure
const wines = [
  {
    id: 'sagrantino',
    name: 'Sagrantino di Montefalco',
    classification: 'DOCG',
    type: 'red',
    image: '/path/to/sagrantino-wine.jpg',
    description: "Italy's most tannic red — bigger than Barolo...",
    keyFact: 'Only 2,500 acres planted worldwide, all in Umbria',
    pairing: 'Wild boar, aged pecorino, piccione',
    priceRange: '€25–€80',
    link: 'https://www.consorziomontefalco.it/en/'
  },
  // ... 2 more wines
];

// Component: 3-column grid with image cards
// No toggles, no sliders, no map
```

### UmbriaRecipes Enhanced Structure

```tsx
interface Recipe {
  id: string;
  name: string;
  italianName: string;
  category: 'rustic' | 'refined';
  image: string; // NEW
  description: string;
  story: string;
  origin: string;
  prepTime: string;
  cookTime: string; // NEW
  serves: string;
  ingredients: Array<{ // EXPANDED
    group?: string;
    items: string[];
  }>;
  method: string[]; // NEW - numbered steps
  winePairing: {
    name: string;
    why: string;
  };
}
```

---

## 5. Section Order (Unchanged)

1. UmbriaChocolateCity
2. UmbriaFestivalCalendar  
3. UmbriaNorciaTable
4. UmbriaWineExplorer (redesigned)
5. UmbriaRecipes (enhanced with full recipes)

---

## Summary of Deliverables

1. **UmbriaWineExplorer** completely redesigned - 3 wines, photo cards, external links to consortiums
2. **UmbriaRecipes** expanded with full ingredient lists and step-by-step methods
3. **7 AI-generated photorealistic images** for wines and dishes
4. Official links to Consorzio Montefalco, Orvieto DOC, and Lungarotti

