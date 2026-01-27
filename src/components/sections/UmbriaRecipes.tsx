import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, Flame, Sparkles, Wine, Clock, Users, ArrowRight } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  italianName: string;
  category: 'rustic' | 'refined';
  description: string;
  story: string;
  origin: string;
  prepTime: string;
  serves: string;
  winePairing: {
    name: string;
    why: string;
  };
  keyIngredients: string[];
  signatureTechnique: string;
}

const recipes: Recipe[] = [
  {
    id: 'strangozzi',
    name: 'Black Truffle Strangozzi',
    italianName: 'Strangozzi al Tartufo Nero',
    category: 'rustic',
    description: 'Hand-rolled pasta with black truffle, butter, and a whisper of garlic. The pasta is thick, chewy, and designed to hold the truffle\'s earthy perfume.',
    story: 'Norcia\'s nuns supposedly invented this pasta. The name means "little laces" or possibly "priest-stranglers" — depending on who\'s telling the story. Either way, the thick strands were meant to be substantial enough for hard-working monastics.',
    origin: 'Norcia / Valnerina',
    prepTime: '45 min',
    serves: '4',
    winePairing: {
      name: 'Grechetto or Orvieto Classico',
      why: 'The white\'s nuttiness echoes the truffle without competing. Never red with black truffle.'
    },
    keyIngredients: ['Black winter truffle (Tuber melanosporum)', 'Fresh egg pasta', 'Unsalted butter', 'Garlic (one clove, crushed)'],
    signatureTechnique: 'The truffle is shaved tableside, never cooked. The residual heat of the pasta releases its aroma.'
  },
  {
    id: 'torta-testo',
    name: 'Flatbread with Sausage & Rapini',
    italianName: 'Torta al Testo con Salsiccia e Rapini',
    category: 'rustic',
    description: 'Unleavened flatbread cooked on a terracotta disc over fire, split open and stuffed with crumbled sausage, bitter greens, and olive oil.',
    story: 'The testo is a clay disc heated over fire — every Umbrian family has one passed down through generations. This is festival food, picnic food, life food. The bread is never quite the same twice.',
    origin: 'Throughout Umbria',
    prepTime: '30 min',
    serves: '4',
    winePairing: {
      name: 'Rosso di Montefalco',
      why: 'The sausage fat wants a wine with structure. Rosso\'s Sagrantino backbone cuts through beautifully.'
    },
    keyIngredients: ['Torta al testo (or make from flour, water, baking soda)', 'Umbrian sausage (fennel-heavy)', 'Rapini (cime di rapa)', 'Local olive oil'],
    signatureTechnique: 'The testo must be screaming hot. The bread should char slightly and puff in spots.'
  },
  {
    id: 'piccione',
    name: 'Umbrian Squab with Olives',
    italianName: 'Piccione alla Ghiotta',
    category: 'refined',
    description: 'Young squab roasted until the skin crackles, then braised in its own pan drippings with local olives, sage, and a splash of Sagrantino.',
    story: 'The ghiotta is the sauce — pan drippings, local olives, a splash of wine. Umbria\'s answer to French technique, done in cast iron over an open fire. Every trattoria has their grandmother\'s version.',
    origin: 'Orvieto / Todi',
    prepTime: '2 hours',
    serves: '2',
    winePairing: {
      name: 'Sagrantino di Montefalco',
      why: 'The only wine with enough tannin to match the richness. Open it an hour before the bird goes in.'
    },
    keyIngredients: ['Young squab (piccione)', 'Umbrian olives (Moraiolo or Frantoio)', 'Fresh sage', 'Sagrantino wine', 'Pancetta'],
    signatureTechnique: 'The bird is seared breast-down first to render fat, then finished in a covered pan with the ghiotta.'
  },
  {
    id: 'umbricelli',
    name: 'Hand-Rolled Pasta with Goose Ragù',
    italianName: 'Umbricelli con Ragù d\'Oca',
    category: 'refined',
    description: 'Thick, hand-rolled pasta (thicker than pici, rougher than spaghetti) dressed in a slow-cooked goose ragù that\'s been simmering since morning.',
    story: 'Umbria raises geese the way other regions raise chickens. This ragù takes four hours but feeds a village. The fat is saved for cooking year-round — nothing is wasted.',
    origin: 'Bettona / Perugia Province',
    prepTime: '4+ hours',
    serves: '6',
    winePairing: {
      name: 'Torgiano Rosso Riserva',
      why: 'Lungarotti\'s Rubesco Riserva was made for this dish. The wine\'s elegance balances the goose\'s richness.'
    },
    keyIngredients: ['Goose leg and thigh', 'Umbricelli pasta (flour and water only)', 'Soffritto (celery, carrot, onion)', 'Tomato passata', 'Bay leaves'],
    signatureTechnique: 'The ragù is started with goose fat rendering slowly, then the meat braises until it falls apart — minimum 3 hours.'
  },
];

export function UmbriaRecipes() {
  const [activeCategory, setActiveCategory] = useState<'rustic' | 'refined'>('rustic');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

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
            Each one tells a story of the region's monasteries, farms, and fiercely local ingredients.
          </p>
        </div>

        {/* Category Toggle */}
        <div className="mb-8">
          <Tabs value={activeCategory} onValueChange={(v) => { setActiveCategory(v as 'rustic' | 'refined'); setSelectedRecipe(null); }}>
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
            <Card 
              key={recipe.id} 
              className={`
                overflow-hidden cursor-pointer transition-all hover:shadow-lg
                ${selectedRecipe?.id === recipe.id ? 'ring-2 ring-orange-500' : ''}
              `}
              onClick={() => setSelectedRecipe(selectedRecipe?.id === recipe.id ? null : recipe)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`
                    p-3 rounded-xl
                    ${recipe.category === 'rustic' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}
                  `}>
                    {recipe.category === 'rustic' ? <Flame className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{recipe.name}</h3>
                    <p className="text-sm text-muted-foreground italic mb-3">{recipe.italianName}</p>
                    <p className="text-sm mb-4">{recipe.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prepTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Serves {recipe.serves}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wine className="h-3 w-3" />
                        {recipe.winePairing.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Recipe Detail */}
        {selectedRecipe && (
          <Card className="animate-fade-in overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Story & Technique */}
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedRecipe.name}</h3>
                  <p className="text-muted-foreground italic mb-4">{selectedRecipe.italianName} · {selectedRecipe.origin}</p>
                  
                  <div className="bg-muted/50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-2">The Story</h4>
                    <p className="text-sm text-muted-foreground">{selectedRecipe.story}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      Signature Technique
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedRecipe.signatureTechnique}</p>
                  </div>
                </div>

                {/* Right: Ingredients & Pairing */}
                <div>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Ingredients</h4>
                    <ul className="space-y-2">
                      {selectedRecipe.keyIngredients.map((ing, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 text-orange-500 flex-shrink-0" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Wine className="h-4 w-4 text-purple-600" />
                      Wine Pairing
                    </h4>
                    <p className="font-medium text-purple-800 mb-1">{selectedRecipe.winePairing.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedRecipe.winePairing.why}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Editorial Footer */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 md:p-8 border border-orange-100">
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
