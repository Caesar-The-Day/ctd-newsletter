import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChefHat, ExternalLink, Wine } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useImageReveal } from '@/hooks/use-image-reveal';

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
  const [mode, setMode] = useState(0);
  const [expandedRecipes, setExpandedRecipes] = useState<string[]>([]);

  const toggleRecipe = (id: string) => {
    setExpandedRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const validModes = modes && modes.length > 0 ? modes : ['Rustic', 'Refined'];
  const filteredRecipes = recipes?.filter(
    (recipe) => recipe.mode === validModes[mode]
  ) || [];

  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
              <div className="rounded-lg border bg-card shadow-lg border-primary/20 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <RecipeImage src={originStory.image} alt={originStory.title} />
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 text-primary">
                        {originStory.title}
                      </h3>
                      <p className="text-lg text-muted-foreground italic">
                        {originStory.subtitle}
                      </p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      {originStory.story?.map((paragraph, idx) => (
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
                          <p className="font-semibold text-sm mb-2">Wine Pairing</p>
                          {originStory.winePairing?.map((wine, idx) => (
                            <p key={idx} className="text-sm text-foreground/80">
                              {wine}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recipe Versions */}
                    {originStory.recipes && originStory.recipes.length > 0 && (
                      <div className="space-y-3">
                        {originStory.recipes.map((recipe, idx) => (
                          <Collapsible key={idx}>
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                <span>{recipe.version}</span>
                                <ChefHat className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-3 p-4 bg-muted/30 rounded-lg space-y-4">
                                <p className="text-sm text-foreground/80">{recipe.description}</p>
                                
                                {recipe.ingredients && recipe.ingredients.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Ingredients</h4>
                                    <ul className="space-y-1 text-sm text-foreground/80">
                                      {recipe.ingredients.map((ingredient, i) => (
                                        <li key={i}>• {ingredient}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {recipe.steps && recipe.steps.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Steps</h4>
                                    <ol className="space-y-2 text-sm text-foreground/80">
                                      {recipe.steps.map((step, i) => (
                                        <li key={i} className="pl-1">
                                          {i + 1}. {step}
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex justify-center gap-4 mb-12">
            {validModes.map((modeName, idx) => (
              <Button
                key={idx}
                onClick={() => setMode(idx)}
                variant={mode === idx ? "default" : "outline"}
                size="lg"
                className="min-w-[140px]"
              >
                {modeName}
              </Button>
            ))}
          </div>

          {/* Recipe Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="rounded-lg border bg-card shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <RecipeImage src={recipe.image} alt={recipe.title} />
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    {recipe.title}
                  </h3>

                  {recipe.story && (
                    <p className="text-foreground/80 mb-4 leading-relaxed">
                      {recipe.story}
                    </p>
                  )}

                  {recipe.whyRefined && (
                    <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-4 mb-4">
                      <p className="text-sm font-medium text-foreground/90">
                        <span className="font-bold text-primary">Why Refined: </span>
                        {recipe.whyRefined}
                      </p>
                    </div>
                  )}

                  <Collapsible
                    open={expandedRecipes.includes(recipe.id)}
                    onOpenChange={() => toggleRecipe(recipe.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full mb-4">
                        {expandedRecipes.includes(recipe.id) ? 'Hide Recipe' : 'Show Recipe'}
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="space-y-6 pt-2">
                        {/* Ingredients */}
                        {recipe.ingredients && recipe.ingredients.length > 0 && (
                          <div>
                            <h4 className="font-bold text-lg mb-3 text-foreground">
                              Ingredients
                            </h4>
                            <ul className="space-y-2">
                              {recipe.ingredients.map((ingredient, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-foreground/80">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{ingredient}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Steps */}
                        {recipe.steps && recipe.steps.length > 0 && (
                          <div>
                            <h4 className="font-bold text-lg mb-3 text-foreground">
                              Instructions
                            </h4>
                            <ol className="space-y-3">
                              {recipe.steps.map((step, idx) => (
                                <li key={idx} className="flex gap-3 text-foreground/80">
                                  <span className="font-bold text-primary flex-shrink-0">
                                    {idx + 1}.
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Serving Suggestion */}
                        {recipe.servingSuggestion && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-semibold text-sm mb-2 text-foreground">
                              Serving Suggestion
                            </h4>
                            <p className="text-sm text-foreground/80">
                              {recipe.servingSuggestion}
                            </p>
                          </div>
                        )}

                        {/* Wine Pairing */}
                        {recipe.winePairing && (
                          <div className="bg-primary/5 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Wine className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-sm mb-1 text-foreground">
                                  Wine Pairing
                                </h4>
                                <p className="text-sm text-foreground/80">
                                  {recipe.winePairing}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* External Links */}
                        {recipe.links && recipe.links.length > 0 && (
                          <div className="pt-2">
                            {recipe.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                              >
                                <ExternalLink className="h-4 w-4" />
                                {link.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RecipeImage({ src, alt }: { src: string; alt: string }) {
  const { imageRef, isVisible } = useImageReveal();

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        loading="lazy"
      />
    </div>
  );
}
