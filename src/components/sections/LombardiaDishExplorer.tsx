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

// Accurate SVG paths for Lombardy provinces (traced from administrative map)
const provincePaths: Record<string, { path: string; center: [number, number] }> = {
  varese: {
    path: "M52,168 L48,155 L35,150 L25,160 L18,148 L8,152 L5,165 L12,178 L8,192 L15,205 L28,210 L40,205 L52,215 L58,205 L55,190 L62,180 L58,172 Z",
    center: [32, 178]
  },
  como: {
    path: "M95,125 L85,110 L78,95 L65,88 L55,95 L48,85 L58,75 L70,70 L82,58 L95,55 L105,62 L108,75 L100,88 L108,100 L115,115 L110,130 L100,138 L88,145 L78,140 L68,148 L58,155 L52,168 L62,180 L72,175 L85,168 L95,158 L105,150 L98,138 Z",
    center: [82, 115]
  },
  sondrio: {
    path: "M115,115 L125,100 L140,85 L158,75 L175,62 L195,52 L220,45 L248,42 L275,48 L298,58 L315,72 L325,88 L318,105 L305,115 L288,120 L268,118 L248,125 L228,128 L208,122 L188,128 L168,125 L148,130 L128,125 L115,115 Z",
    center: [218, 88]
  },
  lecco: {
    path: "M115,115 L128,125 L148,130 L155,145 L148,160 L135,168 L120,165 L108,155 L100,138 L105,150 L95,158 L98,138 L110,130 Z",
    center: [125, 145]
  },
  bergamo: {
    path: "M155,145 L168,125 L188,128 L208,122 L228,128 L248,125 L255,140 L248,158 L235,172 L218,180 L198,178 L178,185 L162,180 L148,168 L148,160 Z",
    center: [200, 155]
  },
  brescia: {
    path: "M255,140 L268,118 L288,120 L305,115 L318,105 L332,115 L345,132 L355,150 L358,172 L352,195 L340,215 L322,228 L298,235 L275,238 L258,230 L248,215 L252,195 L258,178 L248,158 Z",
    center: [305, 175]
  },
  monza: {
    path: "M95,158 L85,168 L72,175 L78,190 L92,198 L108,195 L120,188 L135,192 L148,185 L148,168 L135,168 L120,165 L108,155 L100,138 L105,150 Z",
    center: [108, 178]
  },
  milano: {
    path: "M78,190 L62,180 L55,190 L58,205 L52,215 L58,230 L72,245 L88,252 L108,255 L125,250 L140,242 L152,230 L158,215 L162,198 L162,180 L148,185 L135,192 L120,188 L108,195 L92,198 Z",
    center: [108, 220]
  },
  pavia: {
    path: "M52,215 L40,205 L28,210 L15,225 L8,245 L15,268 L28,288 L45,305 L68,318 L92,322 L115,315 L132,302 L142,285 L138,265 L128,252 L108,255 L88,252 L72,245 L58,230 Z",
    center: [75, 275]
  },
  lodi: {
    path: "M142,285 L158,275 L175,270 L188,278 L195,295 L188,315 L172,325 L152,328 L135,320 L128,302 L132,302 Z",
    center: [162, 300]
  },
  cremona: {
    path: "M195,295 L208,280 L228,272 L248,268 L265,275 L278,290 L285,310 L278,332 L262,348 L242,355 L218,352 L195,342 L178,332 L172,325 L188,315 Z",
    center: [235, 315]
  },
  mantova: {
    path: "M285,310 L298,295 L318,285 L340,282 L358,292 L368,310 L365,332 L352,352 L332,365 L308,368 L282,362 L262,352 L262,348 L278,332 Z",
    center: [325, 330]
  }
};

interface LombardyMapProps {
  highlightedProvinces: string[];
}

function LombardyMap({ highlightedProvinces }: LombardyMapProps) {
  return (
    <svg 
      viewBox="0 0 380 380" 
      className="w-full h-full"
      style={{ maxHeight: '300px' }}
    >
      {/* All provinces */}
      {Object.entries(provincePaths).map(([province, { path }]) => {
        const isHighlighted = highlightedProvinces.includes(province);
        return (
          <g key={province}>
            <path
              d={path}
              fill={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--muted))"}
              stroke="hsl(var(--background))"
              strokeWidth="2"
              className={`transition-all duration-500 ${isHighlighted ? 'opacity-100' : 'opacity-50'}`}
            />
            {isHighlighted && (
              <path
                d={path}
                fill="none"
                stroke="hsl(var(--primary-foreground) / 0.4)"
                strokeWidth="3"
                className="animate-pulse"
              />
            )}
          </g>
        );
      })}
      
      {/* Province labels for highlighted areas */}
      {highlightedProvinces.map(province => {
        const data = provincePaths[province];
        if (!data) return null;
        const [x, y] = data.center;
        return (
          <text
            key={`label-${province}`}
            x={x}
            y={y}
            fill="hsl(var(--primary-foreground))"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
            className="uppercase tracking-wider pointer-events-none"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            {province}
          </text>
        );
      })}
      
      {/* Legend */}
      <g transform="translate(10, 350)">
        <rect x="0" y="0" width="14" height="14" fill="hsl(var(--primary))" rx="2" />
        <text x="20" y="11" fill="hsl(var(--foreground))" fontSize="11" fontWeight="500">Origin</text>
        <rect x="80" y="0" width="14" height="14" fill="hsl(var(--muted))" rx="2" opacity="0.5" />
        <text x="100" y="11" fill="hsl(var(--muted-foreground))" fontSize="11">Other provinces</text>
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