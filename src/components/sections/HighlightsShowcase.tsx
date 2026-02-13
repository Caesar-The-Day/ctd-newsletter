import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, ChevronDown, Wine, Utensils, Landmark } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useImageReveal } from '@/hooks/use-image-reveal';
import { Highlights } from '@/utils/getRegionData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HighlightsShowcaseProps {
  highlights: Highlights;
}

export function HighlightsShowcase({ highlights }: HighlightsShowcaseProps) {
  // Defensive defaults for scaffolded data
  const defaultCategory = { title: '', intro: '', backgroundImage: '', cards: [] };
  
  const categories = [
    { key: 'wine', label: 'Wine', icon: Wine, data: highlights?.wine ?? defaultCategory },
    { key: 'food', label: 'Food', icon: Utensils, data: highlights?.food ?? defaultCategory },
    { key: 'culture', label: 'Culture', icon: Landmark, data: highlights?.culture ?? defaultCategory },
  ];

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <Landmark className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Food, Wine & Culture</h2>
          {highlights.sectionIntro && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
              {highlights.sectionIntro}
            </p>
          )}
        </div>

        <Tabs defaultValue="wine" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 md:mb-12">
            {categories.map(({ key, label, icon: Icon }) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2 text-sm md:text-base">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(({ key, data }) => (
            <TabsContent key={key} value={key} className="animate-fade-in">
              <div className="mb-8 md:mb-12 relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${data.backgroundImage})` }} />
                <div className="relative p-6 md:p-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.title}</h2>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-4xl">{data.intro}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.cards.map((card) => (
                  <HighlightCard key={card.id} card={card} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function HighlightCard({ card }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible, imageRef } = useImageReveal();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <div className="relative aspect-video overflow-hidden">
              <img
                ref={imageRef}
                src={card.image}
                alt={`${card.title} - ${card.description.substring(0, 100)}`}
                className={`w-full h-full object-cover transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1">{card.title}</h3>
                  <p className="text-white/90 text-sm">{card.subtitle}</p>
                </div>
                <ChevronDown className={`h-5 w-5 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3 mb-4">
              {card.description.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="text-muted-foreground">{paragraph}</p>
              ))}
            </div>
            {card.links?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {card.links.map((link: any) => (
                  <Button key={link.label} variant="outline" size="sm" asChild>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {link.label}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
