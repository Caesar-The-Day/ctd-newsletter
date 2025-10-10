import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, ExternalLink } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Recipe {
  id: string;
  title: string;
  mode: string;
  image: string;
  story?: string;
  whyRefined?: string;
  ingredients: string[];
  steps: string[];
  servingSuggestion?: string;
  pairWithWineProfile: string;
  winePairing?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

interface RecipesInteractiveProps {
  recipes: Recipe[];
  modes: string[];
}

export function RecipesInteractive({ recipes, modes }: RecipesInteractiveProps) {
  const [mode, setMode] = useState(0); // 0=Rustic, 1=Refined
  const [expandedRecipes, setExpandedRecipes] = useState<string[]>([]);

  const toggleRecipe = (id: string) => {
    setExpandedRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // Filter recipes based on selected mode
  const filteredRecipes = recipes.filter(
    (recipe) => recipe.mode === modes[mode]
  );

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Piemontese Recipes
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Master these classics—from your kitchen to the table
            </p>

            {/* Mode Toggle */}
            <div className="inline-flex gap-2 p-1 bg-muted rounded-lg">
              {modes.map((modeName, idx) => (
                <Button
                  key={modeName}
                  variant={mode === idx ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode(idx)}
                >
                  {modeName}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden shadow-soft">
                <div className="relative h-48">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">{recipe.title}</h3>

                  {/* Story (for refined recipes) */}
                  {recipe.story && (
                    <div className="mb-4 text-sm text-foreground/80 italic border-l-2 border-primary/30 pl-3">
                      {recipe.story}
                    </div>
                  )}

                  {/* Why Refined */}
                  {recipe.whyRefined && (
                    <div className="mb-4 bg-accent/10 p-3 rounded-lg text-sm">
                      <strong>Why it's Refined:</strong> {recipe.whyRefined}
                    </div>
                  )}

                  <Collapsible
                    open={expandedRecipes.includes(recipe.id)}
                    onOpenChange={() => toggleRecipe(recipe.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full mb-4">
                        {expandedRecipes.includes(recipe.id) ? 'Hide' : 'Show'} Recipe
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-4 animate-accordion-down">
                      {/* Ingredients */}
                      <div>
                        <h4 className="font-semibold mb-2">Ingredients</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Steps */}
                      <div>
                        <h4 className="font-semibold mb-2">Steps</h4>
                        <ol className="list-decimal list-inside text-sm space-y-2 text-foreground/80">
                          {recipe.steps.map((step, idx) => (
                            <li key={idx} className="pl-2">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Serving Suggestion */}
                      {recipe.servingSuggestion && (
                        <div className="bg-muted/50 p-3 rounded-lg text-sm">
                          <strong>Serving Suggestion:</strong> {recipe.servingSuggestion}
                        </div>
                      )}

                      {/* Links */}
                      {recipe.links && recipe.links.length > 0 && (
                        <div className="pt-2 space-y-2">
                          {recipe.links.map((link) => (
                            <Button
                              key={link.label}
                              variant="ghost"
                              size="sm"
                              asChild
                              className="w-full"
                            >
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                {link.label}
                              </a>
                            </Button>
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Wine Pairing */}
                  {recipe.winePairing && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-sm">
                        <span className="font-semibold text-primary">Wine Pairing:</span>
                        <p className="text-muted-foreground mt-1">{recipe.winePairing}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
