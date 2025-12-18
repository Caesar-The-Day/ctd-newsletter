import { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DishData {
  id: string;
  name: string;
  descriptor: string;
  image: string;
  mapHighlight: string;
  mapZone: string;
  whyExists: string;
  climateGeo: string;
  takeaway: string;
  coords: [number, number];
}

const dishes: DishData[] = [
  {
    id: 'pizzoccheri',
    name: 'Pizzoccheri alla Valtellinese',
    descriptor: 'Buckwheat pasta, potatoes, cabbage, butter, cheese',
    image: '/images/lombardia/pizzoccheri.jpg',
    mapHighlight: 'Northern Lombardy → Valtellina Valley (Alpine zone)',
    mapZone: 'alpine',
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
    whyExists: 'Milanese cuisine elevates tough cuts through technique. Ossobuco reflects a culture that wastes nothing and expects patience to be rewarded.',
    climateGeo: 'Cold seasons favor slow cooking. Butter, wine, and time do the work.',
    takeaway: "Refinement here isn't luxury. It's discipline applied over hours.",
    coords: [45.46, 9.19]
  },
  {
    id: 'casoncelli',
    name: 'Casoncelli alla Bergamasca',
    descriptor: 'Stuffed pasta with meat, breadcrumbs, butter, sage',
    image: '/images/lombardia/bergamo-featured.jpg',
    mapHighlight: 'Bergamo and surrounding hills',
    mapZone: 'hills',
    whyExists: 'Casoncelli evolved as a way to stretch meat using breadcrumbs, eggs, and cheese — turning scarcity into structure.',
    climateGeo: 'Hill towns with mixed agriculture relied on preservation and balance rather than abundance.',
    takeaway: "Even Lombard \"pasta\" is pragmatic. Filling matters more than flourish.",
    coords: [45.70, 9.67]
  }
];

const zoneColors: Record<string, string> = {
  alpine: 'hsl(var(--primary))',
  'pre-alpine': 'hsl(var(--primary) / 0.7)',
  plains: 'hsl(var(--accent))',
  milan: 'hsl(var(--secondary))',
  hills: 'hsl(var(--muted-foreground))'
};

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
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
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
                <h3 className="font-serif text-base md:text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
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
                <DialogTitle className="font-serif text-2xl md:text-3xl text-foreground pr-8">
                  {selectedDish.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {/* Image */}
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={selectedDish.image}
                    alt={selectedDish.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Map Highlight */}
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Map Highlight</p>
                    <p className="text-sm text-muted-foreground">{selectedDish.mapHighlight}</p>
                  </div>
                </div>

                {/* Why This Dish Exists */}
                <div>
                  <h4 className="font-serif text-lg text-foreground mb-2">Why This Dish Exists</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedDish.whyExists}</p>
                </div>

                {/* Climate & Geography */}
                <div>
                  <h4 className="font-serif text-lg text-foreground mb-2">Climate & Geography</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedDish.climateGeo}</p>
                </div>

                {/* Cultural Takeaway */}
                <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <h4 className="font-serif text-lg text-foreground mb-2">Cultural Takeaway</h4>
                  <p className="text-foreground/90 leading-relaxed italic">{selectedDish.takeaway}</p>
                </div>

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
