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

// Accurate province boundaries traced from the official Lombardy administrative map
// ViewBox coordinates matched to the actual SVG proportions
const provinceData: Record<string, { path: string; center: [number, number]; name: string }> = {
  varese: {
    path: "M58,145 L52,138 L48,125 L42,118 L35,122 L28,115 L22,118 L18,128 L22,142 L18,155 L25,168 L35,175 L48,172 L55,178 L62,172 L68,162 L72,152 L68,145 Z",
    center: [45, 148],
    name: "Varese"
  },
  como: {
    path: "M72,152 L68,145 L58,145 L52,138 L58,128 L65,118 L72,105 L78,92 L88,82 L98,75 L108,72 L115,78 L118,88 L112,102 L118,115 L122,128 L115,142 L105,152 L95,162 L85,168 L75,172 L68,162 Z",
    center: [92, 125],
    name: "Como"
  },
  sondrio: {
    path: "M122,128 L132,115 L148,102 L168,88 L192,78 L218,72 L248,68 L278,72 L302,82 L322,98 L332,115 L325,132 L308,142 L285,148 L262,145 L238,152 L215,148 L192,155 L168,152 L145,158 L128,152 L118,142 Z",
    center: [225, 112],
    name: "Sondrio"
  },
  lecco: {
    path: "M118,142 L128,152 L145,158 L152,172 L145,188 L132,198 L118,195 L105,185 L98,172 L105,162 L95,162 L105,152 L115,142 Z",
    center: [125, 172],
    name: "Lecco"
  },
  bergamo: {
    path: "M152,172 L168,152 L192,155 L215,148 L238,152 L262,145 L272,162 L265,182 L248,198 L228,208 L205,205 L182,212 L162,205 L148,195 L145,188 Z",
    center: [208, 178],
    name: "Bergamo"
  },
  brescia: {
    path: "M272,162 L285,148 L308,142 L325,132 L342,142 L358,162 L368,185 L372,212 L365,242 L348,268 L325,285 L298,295 L272,298 L252,288 L242,265 L248,238 L258,215 L248,198 L265,182 Z",
    center: [308, 215],
    name: "Brescia"
  },
  monza: {
    path: "M95,162 L85,168 L75,172 L72,185 L82,198 L98,205 L115,202 L128,208 L145,205 L148,195 L145,188 L132,198 L118,195 L105,185 L98,172 L105,162 Z",
    center: [108, 188],
    name: "Monza"
  },
  milano: {
    path: "M72,185 L62,178 L55,188 L52,205 L58,222 L72,242 L92,255 L115,262 L138,255 L155,242 L165,222 L168,205 L162,205 L145,205 L128,208 L115,202 L98,205 L82,198 Z",
    center: [112, 225],
    name: "Milano"
  },
  pavia: {
    path: "M52,205 L42,198 L32,205 L22,222 L18,248 L25,278 L42,305 L68,325 L98,335 L125,328 L145,312 L155,292 L152,268 L142,252 L115,262 L92,255 L72,242 L58,222 Z",
    center: [82, 278],
    name: "Pavia"
  },
  lodi: {
    path: "M155,292 L172,278 L192,272 L208,282 L215,302 L205,322 L185,335 L162,338 L148,328 L142,312 L145,312 Z",
    center: [178, 305],
    name: "Lodi"
  },
  cremona: {
    path: "M215,302 L232,285 L255,275 L278,272 L298,282 L312,302 L318,328 L308,355 L285,372 L258,378 L232,372 L208,358 L192,342 L185,335 L205,322 Z",
    center: [258, 328],
    name: "Cremona"
  },
  mantova: {
    path: "M312,302 L328,288 L352,282 L375,288 L392,308 L395,335 L385,362 L365,382 L338,392 L308,388 L285,378 L285,372 L308,355 L318,328 Z",
    center: [348, 342],
    name: "Mantova"
  }
};

interface LombardyMapProps {
  highlightedProvinces: string[];
}

function LombardyMap({ highlightedProvinces }: LombardyMapProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <svg 
        viewBox="0 0 420 420" 
        className="w-full max-w-md"
        style={{ maxHeight: '320px' }}
      >
        {/* Background */}
        <rect x="0" y="50" width="420" height="370" fill="hsl(var(--muted) / 0.2)" rx="8" />
        
        {/* All province boundaries */}
        {Object.entries(provinceData).map(([id, { path }]) => {
          const isHighlighted = highlightedProvinces.includes(id);
          return (
            <g key={id}>
              {/* Province shape */}
              <path
                d={path}
                fill={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--muted) / 0.6)"}
                stroke="hsl(var(--background))"
                strokeWidth={isHighlighted ? "3" : "2"}
                className={`transition-all duration-500 ${isHighlighted ? 'opacity-100' : 'opacity-40'}`}
              />
              {/* Glow effect for highlighted */}
              {isHighlighted && (
                <path
                  d={path}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}
        
        {/* Province labels for highlighted areas */}
        {highlightedProvinces.map(id => {
          const data = provinceData[id];
          if (!data) return null;
          const [x, y] = data.center;
          return (
            <g key={`label-${id}`}>
              {/* Label background */}
              <rect
                x={x - 28}
                y={y - 10}
                width="56"
                height="20"
                fill="hsl(var(--background) / 0.9)"
                rx="4"
              />
              <text
                x={x}
                y={y + 4}
                fill="hsl(var(--primary))"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                className="uppercase tracking-wide pointer-events-none"
              >
                {data.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-foreground font-medium">Origin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted/40" />
          <span className="text-muted-foreground">Other provinces</span>
        </div>
      </div>
    </div>
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