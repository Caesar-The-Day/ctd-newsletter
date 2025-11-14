import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, ExternalLink, Wine } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useImageReveal } from '@/hooks/use-image-reveal';
import { useParallax } from '@/hooks/use-parallax';
import { RecipeImage, RecipeCard } from './RecipesInteractive-helpers';

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

interface OriginStoryRecipe {
  version: string;
  description: string;
  ingredients: string[];
  steps: string[];
}

interface OriginStory {
  title: string;
  subtitle: string;
  story: string[];
  image: string;
  winePairing: string[];
  recipes: OriginStoryRecipe[];
}

interface RecipesHeader {
  title: string;
  subtitle: string;
}

interface RecipesInteractiveProps {
  header?: RecipesHeader;
  originStory?: OriginStory;
  recipes: Recipe[];
  modes: string[];
}

export function RecipesInteractive({ header, originStory, recipes, modes }: RecipesInteractiveProps) {
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
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ transform: `translateY(${useParallax(0.3)}px)` }}
            >
              {header?.title || "Recipes"}
            </h2>
            {header?.subtitle && (
              <p className="text-lg text-muted-foreground">
                {header.subtitle}
              </p>
            )}
          </div>

          {/* Origin Story Section */}
          {originStory && (
            <div className="mb-16">
              <Card className="overflow-hidden shadow-lg border-2 border-primary/20">
                <div className="grid md:grid-cols-2 gap-0">
                  <RecipeImage src={originStory.image} alt={originStory.title} />
                  <CardContent className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 text-primary">
                        {originStory.title}
                      </h3>
                      <p className="text-lg text-muted-foreground italic">
                        {originStory.subtitle}
                      </p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      {originStory.story.map((paragraph, idx) => (
                        <p key={idx} className="text-foreground/90 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Wine Pairing */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Wine className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold mb-2">Wine Pairing:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {originStory.winePairing.map((wine, idx) => (
                              <li key={idx}>• {wine}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Recipe Versions */}
                    {originStory.recipes.map((recipeVersion, idx) => (
                      <Collapsible key={idx} className="mb-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {recipeVersion.version}
                            <ChefHat className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4 space-y-4">
                          {recipeVersion.description && (
                            <p className="text-sm text-muted-foreground italic">
                              {recipeVersion.description}
                            </p>
                          )}
                          
                          <div>
                            <h5 className="font-semibold mb-2">Ingredients:</h5>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              {recipeVersion.ingredients.map((ing, i) => (
                                <li key={i}>• {ing}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-semibold mb-2">Method:</h5>
                            <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                              {recipeVersion.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </div>
              </Card>
            </div>
          )}

          {/* Mode Toggle & Recipe Cards */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              More Regional Recipes
            </h3>

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
                  <RecipeImage src={recipe.image} alt={recipe.title} />
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

function RecipeImage({ src, alt }: { src: string; alt: string }) {
  const { isVisible, imageRef } = useImageReveal();

  return (
    <div className="relative h-48 overflow-hidden">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
}

function RecipeImage({ src, alt }: { src: string; alt: string }) {
  const { isVisible, imageRef } = useImageReveal();

  return (
    <div className="relative h-48 overflow-hidden">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
}
