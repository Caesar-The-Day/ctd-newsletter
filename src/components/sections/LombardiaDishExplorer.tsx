import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DishData {
  id: string;
  name: string;
  descriptor: string;
  image: string;
  mapHighlight: string;
  mapZone: string;
  highlightProvinces: string[];
  whyExists: string;
  climateGeo: string;
  takeaway: string;
  coords: [number, number];
  funFact?: string;
}

const dishes: DishData[] = [
  {
    id: 'pizzoccheri',
    name: 'Pizzoccheri alla Valtellinese',
    descriptor: 'Buckwheat pasta, potatoes, cabbage, butter, cheese',
    image: '/images/lombardia/pizzoccheri.jpg',
    mapHighlight: 'Northern Lombardy → Valtellina Valley (Alpine zone)',
    mapZone: 'alpine',
    highlightProvinces: ['sondrio'],
    whyExists: "Wheat doesn't thrive in Alpine valleys. Buckwheat does. Pizzoccheri is the result of a cold climate, short growing seasons, and a dairy-based economy where calories mattered more than elegance.",
    climateGeo: "High altitude, long winters, limited olive cultivation. Butter replaces olive oil because it's what the land produced.",
    takeaway: 'This is Lombardy stripped to essentials. Nourishment first, refinement later.',
    coords: [46.17, 9.87]
  },
  {
    id: 'polenta-taragna',
    name: 'Polenta Taragna',
    descriptor: 'Buckwheat polenta with alpine cheese and butter',
    image: '/images/lombardia/polenta-taragna.webp',
    mapHighlight: 'Alpine and pre-Alpine Lombardy (Bergamo, Brescia mountains)',
    mapZone: 'pre-alpine',
    highlightProvinces: ['bergamo', 'brescia', 'sondrio'],
    whyExists: 'Polenta was the daily bread of northern Italy. Adding buckwheat and cheese turned it into a complete, sustaining meal for people who worked outdoors year-round.',
    climateGeo: 'Mountain terrain favors grains and dairy over vegetables and oil. Cheese becomes protein, butter becomes fat.',
    takeaway: 'This is not a side dish. It\'s a statement: food should sustain you.',
    coords: [45.85, 9.75]
  },
  {
    id: 'risotto-milanese',
    name: 'Risotto alla Milanese',
    descriptor: 'Saffron risotto',
    image: '/images/lombardia/risotto-milanese.jpg',
    mapHighlight: 'Milan + Po Valley rice-growing plains',
    mapZone: 'plains',
    highlightProvinces: ['milano', 'pavia', 'lodi', 'cremona', 'mantova'],
    whyExists: "The Po Valley is one of Europe's most productive rice regions. Milan's wealth and discipline transformed humble ingredients into a dish where technique matters more than abundance.",
    climateGeo: 'Flat, irrigated plains support rice cultivation. Trade routes brought saffron; precision made it iconic.',
    takeaway: 'This is Lombardy at its most refined: controlled, intentional, unforgiving of shortcuts.',
    coords: [45.46, 9.19]
  },
  {
    id: 'ossobuco',
    name: 'Ossobuco alla Milanese',
    descriptor: 'Braised veal shank with gremolata',
    image: '/images/lombardia/ossobuco.jpg',
    mapHighlight: 'Milan metropolitan area',
    mapZone: 'milan',
    highlightProvinces: ['milano'],
    whyExists: 'Milanese cuisine elevates tough cuts through technique. Ossobuco reflects a culture that wastes nothing and expects patience to be rewarded.',
    climateGeo: 'Cold seasons favor slow cooking. Butter, wine, and time do the work.',
    takeaway: "Refinement here isn't luxury. It's discipline applied over hours.",
    coords: [45.46, 9.19]
  },
  {
    id: 'casoncelli',
    name: 'Casoncelli alla Bergamasca',
    descriptor: 'Stuffed pasta with meat, breadcrumbs, butter, sage',
    image: '/images/lombardia/casoncelli.webp',
    mapHighlight: 'Bergamo and surrounding hills',
    mapZone: 'hills',
    highlightProvinces: ['bergamo'],
    whyExists: 'Casoncelli evolved as a way to stretch meat using breadcrumbs, eggs, and cheese — turning scarcity into structure.',
    climateGeo: 'Hill towns with mixed agriculture relied on preservation and balance rather than abundance.',
    takeaway: "Even Lombard \"pasta\" is pragmatic. Filling matters more than flourish.",
    coords: [45.70, 9.67],
    funFact: "Casoncelli is a close cousin to Polish Pierogi — both are filled dumplings born from the same logic of stretching precious ingredients. The shape, the crimped edges, the butter-sage finish: this is Central European peasant wisdom wearing Italian clothes."
  }
];

// SVG paths for Lombardy provinces (simplified shapes)
const provincePaths: Record<string, string> = {
  varese: "M95,180 L85,165 L75,170 L60,155 L55,165 L45,160 L40,175 L50,190 L65,195 L80,200 L95,195 Z",
  como: "M140,130 L125,115 L110,120 L95,110 L85,125 L75,120 L70,135 L80,155 L95,160 L110,155 L125,160 L140,150 Z",
  sondrio: "M280,70 L255,55 L230,60 L200,50 L175,65 L150,60 L140,80 L155,100 L180,105 L210,100 L240,110 L270,95 Z",
  lecco: "M175,145 L160,130 L145,135 L135,125 L125,140 L135,160 L150,170 L165,165 L180,175 L185,160 Z",
  bergamo: "M235,170 L215,155 L195,160 L180,150 L170,165 L180,185 L195,195 L215,190 L235,200 L245,185 Z",
  brescia: "M330,175 L305,160 L280,165 L260,155 L250,170 L260,190 L280,205 L305,200 L330,210 L345,195 Z",
  milano: "M145,230 L125,215 L105,220 L90,210 L80,225 L90,245 L110,255 L130,250 L150,260 L160,245 Z",
  monza: "M165,200 L150,190 L135,195 L125,185 L115,195 L125,210 L140,220 L155,215 L170,225 L175,210 Z",
  pavia: "M115,300 L95,285 L75,290 L55,280 L45,295 L55,315 L75,330 L100,325 L120,335 L135,320 Z",
  lodi: "M175,295 L155,280 L135,285 L120,275 L110,290 L120,310 L140,320 L160,315 L180,325 L190,310 Z",
  cremona: "M245,310 L220,295 L195,300 L175,290 L165,305 L175,325 L200,340 L225,335 L250,345 L265,330 Z",
  mantova: "M335,320 L305,305 L275,310 L255,300 L245,315 L255,335 L280,350 L310,345 L340,355 L355,340 Z"
};

interface LombardyMapProps {
  highlightedProvinces: string[];
}

function LombardyMap({ highlightedProvinces }: LombardyMapProps) {
  return (
    <svg 
      viewBox="0 0 400 400" 
      className="w-full h-full"
      style={{ maxHeight: '280px' }}
    >
      {/* Background */}
      <rect width="400" height="400" fill="hsl(var(--muted) / 0.3)" rx="8" />
      
      {/* All provinces */}
      {Object.entries(provincePaths).map(([province, path]) => {
        const isHighlighted = highlightedProvinces.includes(province);
        return (
          <g key={province}>
            <path
              d={path}
              fill={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--muted))"}
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              className={`transition-all duration-500 ${isHighlighted ? 'opacity-100' : 'opacity-60'}`}
            />
            {isHighlighted && (
              <path
                d={path}
                fill="none"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="2"
                className="animate-pulse"
                style={{ opacity: 0.5 }}
              />
            )}
          </g>
        );
      })}
      
      {/* Province labels for highlighted areas */}
      {highlightedProvinces.map(province => {
        const labelPositions: Record<string, [number, number]> = {
          varese: [70, 180],
          como: [110, 140],
          sondrio: [210, 80],
          lecco: [155, 155],
          bergamo: [210, 180],
          brescia: [295, 185],
          milano: [120, 240],
          monza: [145, 205],
          pavia: [90, 310],
          lodi: [150, 300],
          cremona: [215, 320],
          mantova: [300, 335]
        };
        const pos = labelPositions[province];
        if (!pos) return null;
        return (
          <text
            key={`label-${province}`}
            x={pos[0]}
            y={pos[1]}
            fill="hsl(var(--primary-foreground))"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
            className="uppercase tracking-wide"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            {province}
          </text>
        );
      })}
      
      {/* Legend */}
      <g transform="translate(20, 360)">
        <rect x="0" y="0" width="12" height="12" fill="hsl(var(--primary))" rx="2" />
        <text x="18" y="10" fill="hsl(var(--foreground))" fontSize="10">Origin region</text>
        <rect x="100" y="0" width="12" height="12" fill="hsl(var(--muted))" rx="2" opacity="0.6" />
        <text x="118" y="10" fill="hsl(var(--muted-foreground))" fontSize="10">Other provinces</text>
      </g>
    </svg>
  );
}

export default function LombardiaDishExplorer() {
  const [selectedDish, setSelectedDish] = useState<DishData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('dish-explorer');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="dish-explorer" 
      className="py-16 md:py-24 px-4 md:px-8 bg-muted/30"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-4">
            Pick the Dish. We'll Show You the Lombardy Behind It.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Lombardy cuisine isn't romantic. It's logical.
          </p>
          <p className="text-base text-muted-foreground/80 max-w-3xl mx-auto">
            Lombardy's food isn't built on sunshine or abundance. It's built on climate, altitude, and necessity. 
            Pick a dish below and you'll see exactly where it comes from — and why it could only have been born here.
          </p>
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {dishes.map((dish, index) => (
            <button
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className={`group relative overflow-hidden rounded-lg bg-card border border-border/50 
                hover:border-primary/50 transition-all duration-500 text-left
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-base md:text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                  {dish.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {dish.descriptor}
                </p>
              </div>

              {/* Hover indicator */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          ))}
        </div>

        {/* Footer text */}
        <p 
          className={`text-center text-sm text-muted-foreground/70 italic transition-all duration-700 delay-700
            ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          "If this food feels heavy, it's because Lombardy is."
        </p>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedDish} onOpenChange={() => setSelectedDish(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          {selectedDish && (
            <>
              <DialogHeader>
                <DialogTitle className="font-medium text-2xl md:text-3xl text-foreground pr-8">
                  {selectedDish.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {/* Map with highlighted provinces */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <LombardyMap highlightedProvinces={selectedDish.highlightProvinces} />
                </div>

                {/* Map Highlight */}
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Origin</p>
                    <p className="text-sm text-muted-foreground">{selectedDish.mapHighlight}</p>
                  </div>
                </div>

                {/* Why This Dish Exists */}
                <div>
                  <h4 className="font-medium text-lg text-foreground mb-2">Why This Dish Exists</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedDish.whyExists}</p>
                </div>

                {/* Climate & Geography */}
                <div>
                  <h4 className="font-medium text-lg text-foreground mb-2">Climate & Geography</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedDish.climateGeo}</p>
                </div>

                {/* Cultural Takeaway */}
                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-medium text-lg text-foreground mb-2">Cultural Takeaway</h4>
                  <p className="text-foreground/90 leading-relaxed italic">{selectedDish.takeaway}</p>
                </div>

                {/* Fun Fact (if exists) */}
                {selectedDish.funFact && (
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h4 className="font-medium text-lg text-foreground mb-2">Did You Know?</h4>
                    <p className="text-muted-foreground leading-relaxed">{selectedDish.funFact}</p>
                  </div>
                )}

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground/70 pt-4 border-t border-border">
                  "Lombardy doesn't cook for tourists. It cooks for people who live here."
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}