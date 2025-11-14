import { useState } from 'react';
import { ExternalLink, Utensils, Landmark, ChevronDown, Wine } from 'lucide-react';
import { Highlights } from '@/utils/getRegionData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HighlightsShowcaseProps {
  highlights: Highlights;
}

export function HighlightsShowcase({ highlights }: HighlightsShowcaseProps) {
  const categories = [
    { key: 'wine', label: 'Wine', icon: Wine, data: highlights.wine },
    { key: 'food', label: 'Food', icon: Utensils, data: highlights.food },
    { key: 'culture', label: 'Culture', icon: Landmark, data: highlights.culture },
  ];

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Section Header */}
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
              <TabsTrigger
                key={key}
                value={key}
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(({ key, data }) => (
            <TabsContent
              key={key}
              value={key}
              className="animate-fade-in"
            >
              <div className="mb-8 md:mb-12 relative overflow-hidden rounded-xl">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10"
                  style={{ backgroundImage: `url(${data.backgroundImage})` }}
                />
                <div className="relative p-6 md:p-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {data.title}
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-4xl">
                    {data.intro}
                  </p>
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

interface HighlightCardProps {
  card: {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    description: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  };
}

function HighlightCard({ card }: HighlightCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left cursor-pointer">
            <div className="relative aspect-video overflow-hidden">
                <img
                  src={card.image}
                  alt={`${card.title} - ${card.description.substring(0, 100)}...`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                    {card.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-1">
                    {card.subtitle}
                  </p>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <span>Click to expand</span>
                  </p>
                </div>
                <ChevronDown 
                  className={`h-6 w-6 text-white/90 transition-transform duration-300 flex-shrink-0 ml-2 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-4 md:p-6 animate-accordion-down">
            <p className="text-muted-foreground mb-4">
              {card.description}
            </p>
            
            {card.links.length > 0 && (
              <div className="flex flex-col gap-2">
                {card.links.map((link, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-between group"
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
