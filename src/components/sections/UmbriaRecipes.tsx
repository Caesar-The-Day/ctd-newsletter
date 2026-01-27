import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, Flame, Sparkles, Wine, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Import recipe images
import strangozziImg from '@/assets/umbria/strangozzi-tartufo.jpg';
import tortaAlTestoImg from '@/assets/umbria/torta-al-testo.jpg';
import piccioneImg from '@/assets/umbria/piccione-ghiotta.jpg';
import umbricelliImg from '@/assets/umbria/umbricelli-ragu-oca.jpg';

interface IngredientGroup {
  group?: string;
  items: string[];
}

interface Recipe {
  id: string;
  name: string;
  italianName: string;
  category: 'rustic' | 'refined';
  image: string;
  description: string;
  story: string;
  origin: string;
  prepTime: string;
  cookTime: string;
  serves: string;
  ingredients: IngredientGroup[];
  method: string[];
  winePairing: {
    name: string;
    why: string;
  };
}

const recipes: Recipe[] = [
  {
    id: 'strangozzi',
    name: 'Black Truffle Strangozzi',
    italianName: 'Strangozzi al Tartufo Nero',
    category: 'rustic',
    image: strangozziImg,
    description: 'Hand-rolled pasta with black truffle, butter, and a whisper of garlic. The pasta is thick, chewy, and designed to hold the truffle\'s earthy perfume.',
    story: 'Norcia\'s nuns supposedly invented this pasta. The name means "little laces" or possibly "priest-stranglers" — depending on who\'s telling the story.',
    origin: 'Norcia / Valnerina',
    prepTime: '15 min',
    cookTime: '15 min',
    serves: '4',
    ingredients: [
      {
        items: [
          '400g strangozzi pasta (or thick spaghetti)',
          '50g fresh black truffle (Tuber melanosporum)',
          '80g unsalted butter',
          '2 cloves garlic, lightly crushed',
          '4 tbsp extra virgin olive oil',
          'Salt to taste',
          'Freshly ground black pepper'
        ]
      }
    ],
    method: [
      'Bring a large pot of salted water to boil',
      'In a wide pan, gently warm the olive oil and butter over low heat with the crushed garlic. Do not let it brown — you\'re infusing, not frying',
      'Cook pasta until al dente (about 8 minutes for fresh strangozzi)',
      'Remove garlic from the butter mixture',
      'Add a ladleful of pasta water to the pan',
      'Drain pasta and toss in the butter sauce, coating evenly',
      'Remove from heat immediately — residual heat is enough',
      'Shave truffle generously over each portion at the table'
    ],
    winePairing: {
      name: 'Grechetto or Orvieto Classico',
      why: 'The white\'s nuttiness echoes the truffle without competing. Never red with black truffle.'
    }
  },
  {
    id: 'torta-testo',
    name: 'Flatbread with Sausage & Rapini',
    italianName: 'Torta al Testo con Salsiccia e Rapini',
    category: 'rustic',
    image: tortaAlTestoImg,
    description: 'Unleavened flatbread cooked on a terracotta disc over fire, split open and stuffed with crumbled sausage, bitter greens, and olive oil.',
    story: 'The testo is a clay disc heated over fire — every Umbrian family has one passed down through generations. This is festival food, picnic food, life food.',
    origin: 'Throughout Umbria',
    prepTime: '40 min',
    cookTime: '30 min',
    serves: '4',
    ingredients: [
      {
        group: 'Flatbread',
        items: [
          '500g all-purpose flour',
          '250ml warm water',
          '1 tsp baking soda',
          '1 tsp salt',
          '2 tbsp extra virgin olive oil'
        ]
      },
      {
        group: 'Filling',
        items: [
          '300g Italian sausage (fennel-spiced if possible)',
          '1 bunch rapini (broccoli rabe), tough stems removed',
          '2 cloves garlic, sliced',
          'Red pepper flakes to taste',
          'Extra virgin olive oil'
        ]
      }
    ],
    method: [
      'Combine flour, baking soda, and salt in a bowl',
      'Add water and olive oil, mix until a smooth dough forms',
      'Knead for 5 minutes, then rest covered for 30 minutes',
      'Divide into 4 portions and roll each to 20cm circles, about 5mm thick',
      'Heat a cast iron skillet or testo until very hot',
      'Cook each flatbread 3-4 minutes per side until charred in spots and cooked through',
      'Blanch rapini in boiling salted water for 2 minutes, drain and squeeze dry',
      'Remove sausage from casings and crumble into a hot pan',
      'Cook until browned, about 8 minutes',
      'Add garlic and red pepper flakes, cook 1 minute',
      'Add blanched rapini, toss to combine',
      'Split warm flatbread horizontally, pile in filling, drizzle with olive oil'
    ],
    winePairing: {
      name: 'Rosso di Montefalco',
      why: 'The sausage fat wants a wine with structure. Rosso\'s Sagrantino backbone cuts through beautifully.'
    }
  },
  {
    id: 'piccione',
    name: 'Umbrian Squab with Olives',
    italianName: 'Piccione alla Ghiotta',
    category: 'refined',
    image: piccioneImg,
    description: 'Young squab roasted until the skin crackles, then braised in its own pan drippings with local olives, sage, and a splash of Sagrantino.',
    story: 'The ghiotta is the sauce — pan drippings, local olives, a splash of wine. Umbria\'s answer to French technique, done in cast iron over an open fire.',
    origin: 'Orvieto / Todi',
    prepTime: '20 min',
    cookTime: '1 hr',
    serves: '2',
    ingredients: [
      {
        items: [
          '2 young squab (piccione), about 400g each',
          '100g pancetta, diced',
          '150g Umbrian olives (Moraiolo or similar), pitted',
          '8 fresh sage leaves',
          '2 sprigs rosemary',
          '150ml Sagrantino wine (or other robust red)',
          '2 tbsp red wine vinegar',
          '4 anchovy fillets',
          '2 cloves garlic',
          'Extra virgin olive oil',
          'Salt and pepper'
        ]
      }
    ],
    method: [
      'Pat squab dry and season generously inside and out with salt and pepper',
      'Heat olive oil in a heavy braising pan over medium-high heat',
      'Sear squab breast-side down for 4 minutes until deeply golden',
      'Flip and sear backs for 2 minutes, then remove and set aside',
      'In the same pan, cook pancetta until fat renders, about 5 minutes',
      'Add garlic, anchovies, sage, and rosemary — cook until anchovies dissolve',
      'Add olives and wine, scraping up any browned bits',
      'Return squab to pan, breast up',
      'Cover and braise at 160°C (325°F) for 45-50 minutes',
      'Remove lid for final 10 minutes to crisp skin',
      'Stir vinegar into the ghiotta sauce before serving',
      'Serve squab with sauce spooned over'
    ],
    winePairing: {
      name: 'Sagrantino di Montefalco',
      why: 'The only wine with enough tannin to match the richness. Open it an hour before the bird goes in.'
    }
  },
  {
    id: 'umbricelli',
    name: 'Hand-Rolled Pasta with Goose Ragù',
    italianName: 'Umbricelli con Ragù d\'Oca',
    category: 'refined',
    image: umbricelliImg,
    description: 'Thick, hand-rolled pasta dressed in a slow-cooked goose ragù that\'s been simmering since morning. The fat is saved for cooking year-round.',
    story: 'Umbria raises geese the way other regions raise chickens. This ragù takes four hours but feeds a village. Nothing is wasted.',
    origin: 'Bettona / Perugia Province',
    prepTime: '30 min',
    cookTime: '4 hrs',
    serves: '6',
    ingredients: [
      {
        group: 'Ragù',
        items: [
          '600g bone-in goose legs (or duck as substitute)',
          '1 goose or duck liver, cleaned and chopped (optional)',
          '1 large onion, finely diced',
          '2 carrots, finely diced',
          '2 celery stalks, finely diced',
          '400g tomato passata',
          '150ml white wine',
          '2 bay leaves',
          '4 sprigs fresh thyme',
          '100ml goose fat or olive oil',
          'Salt and pepper'
        ]
      },
      {
        group: 'Pasta',
        items: [
          '400g umbricelli or thick spaghetti',
          'Freshly grated Pecorino Romano'
        ]
      }
    ],
    method: [
      'Season goose legs generously with salt and pepper',
      'In a large heavy pot, heat goose fat over medium heat',
      'Brown goose legs on all sides, about 10 minutes total — remove and set aside',
      'Add soffritto (onion, carrot, celery) to the pot, cook until soft, about 10 minutes',
      'If using liver, add now and cook briefly until just browned',
      'Pour in wine and let it reduce by half',
      'Add tomato passata, bay leaves, and thyme',
      'Return goose legs to pot, nestle them into the sauce',
      'Cover and simmer on very low heat for 3-4 hours, until meat falls off bone',
      'Remove legs, shred meat, discard bones and skin',
      'Return shredded meat to sauce, adjust seasoning',
      'Cook umbricelli in salted water until al dente',
      'Toss pasta with ragù, serve with pecorino'
    ],
    winePairing: {
      name: 'Torgiano Rosso Riserva',
      why: 'Lungarotti\'s Rubesco Riserva was made for this dish. The wine\'s elegance balances the goose\'s richness.'
    }
  }
];

export function UmbriaRecipes() {
  const [activeCategory, setActiveCategory] = useState<'rustic' | 'refined'>('rustic');
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const filteredRecipes = recipes.filter(r => r.category === activeCategory);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-orange-50/30">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ChefHat className="h-4 w-4" />
            Regional Recipes
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Umbrian <span className="text-orange-600">Kitchen</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four dishes that define Umbria's table — from peasant flatbreads to restaurant-worthy squab. 
            Full recipes with ingredients and methods, ready to cook.
          </p>
        </div>

        {/* Category Toggle */}
        <div className="mb-8">
          <Tabs value={activeCategory} onValueChange={(v) => { setActiveCategory(v as 'rustic' | 'refined'); setExpandedRecipe(null); }}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="rustic" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Rustic
              </TabsTrigger>
              <TabsTrigger value="refined" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Refined
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-center text-sm text-muted-foreground mt-3">
            {activeCategory === 'rustic' 
              ? 'Hearth-cooking, peasant origins, made for feeding families'
              : 'Restaurant interpretations, seasonal showpieces, wine-pairing focus'
            }
          </p>
        </div>

        {/* Recipe Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {filteredRecipes.map(recipe => (
            <Card key={recipe.id} className="overflow-hidden">
              {/* Image */}
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold
                    ${recipe.category === 'rustic' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}
                  `}>
                    {recipe.category === 'rustic' ? 'Rustic' : 'Refined'}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* Title & Meta */}
                <h3 className="text-xl font-bold mb-1">{recipe.name}</h3>
                <p className="text-sm text-muted-foreground italic mb-3">{recipe.italianName} · {recipe.origin}</p>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recipe.prepTime} prep + {recipe.cookTime} cook
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Serves {recipe.serves}
                  </span>
                </div>
                
                <p className="text-sm mb-4">{recipe.description}</p>
                
                {/* Story */}
                <div className="bg-muted/50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground italic">"{recipe.story}"</p>
                </div>
                
                {/* Expandable Full Recipe */}
                <Collapsible 
                  open={expandedRecipe === recipe.id}
                  onOpenChange={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {expandedRecipe === recipe.id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Hide Full Recipe
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          View Full Recipe
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-4 space-y-6 animate-fade-in">
                    {/* Ingredients */}
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Ingredients</h4>
                      {recipe.ingredients.map((group, idx) => (
                        <div key={idx} className="mb-4">
                          {group.group && (
                            <p className="font-medium text-sm text-orange-700 mb-2">{group.group}</p>
                          )}
                          <ul className="space-y-1.5">
                            {group.items.map((item, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    
                    {/* Method */}
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Method</h4>
                      <ol className="space-y-3">
                        {recipe.method.map((step, i) => (
                          <li key={i} className="text-sm flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    {/* Wine Pairing */}
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Wine className="h-4 w-4 text-purple-600" />
                        Wine Pairing
                      </h4>
                      <p className="font-medium text-purple-800 mb-1">{recipe.winePairing.name}</p>
                      <p className="text-sm text-muted-foreground">{recipe.winePairing.why}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Editorial Footer */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 md:p-8 border border-orange-100">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-600" />
            The Norcino's Principle
          </h4>
          <p className="text-muted-foreground">
            Umbrian cooking follows one rule: <strong>the ingredient is the dish</strong>. 
            Truffle needs only butter. Sausage needs only fire. Goose needs only time. 
            If you find yourself reaching for a third seasoning, you've already gone too far. 
            This isn't minimalism — it's confidence in what the land provides.
          </p>
        </div>
      </div>
    </section>
  );
}

export default UmbriaRecipes;
