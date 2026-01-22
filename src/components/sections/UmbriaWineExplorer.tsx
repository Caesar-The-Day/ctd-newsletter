import { useState, useEffect, useRef } from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ExternalLink, Wine, Grape, GlassWater, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import L from 'leaflet';

// Wine zone polygon data for Umbria
const WINE_ZONES = {
  montefalco: {
    name: 'Montefalco DOCG',
    color: '#8b1538',
    coords: [
      [42.85, 12.60], [42.85, 12.72], [42.92, 12.72], [42.92, 12.60], [42.85, 12.60]
    ]
  },
  orvieto: {
    name: 'Orvieto DOC',
    color: '#d4a574',
    coords: [
      [42.68, 11.98], [42.68, 12.22], [42.78, 12.22], [42.78, 11.98], [42.68, 11.98]
    ]
  },
  trasimeno: {
    name: 'Colli del Trasimeno DOC',
    color: '#c9a0a0',
    coords: [
      [43.02, 12.02], [43.02, 12.22], [43.15, 12.22], [43.15, 12.02], [43.02, 12.02]
    ]
  }
};

// Wine card data
const WINES = [
  {
    id: 'sagrantino',
    name: 'Sagrantino di Montefalco',
    region: 'Montefalco',
    image: '/images/umbria/montefalco.jpg',
    description: `Sagrantino is Umbria's signature red, and it behaves exactly like the region: intense, uncompromising, and not in a hurry. This is one of Italy's most tannic native grapes. Thick skins. Long aging. Historically made for religious occasions, now carefully modernized without losing its backbone. It's not a casual wine. It's a commitment.`,
    tagline: 'If Tuscany is conversation, Sagrantino is a declaration.',
    facts: [
      'Built for aging, not immediate drinking',
      'Pairs with Umbrian meat-heavy cuisine',
      'Deeply tied to place and tradition'
    ],
    link: 'https://www.consorziomontefalco.it',
    linkText: 'Montefalco wine consortium',
    category: 'bold',
    practicalityRange: [60, 100]
  },
  {
    id: 'orvieto',
    name: 'Orvieto Classico',
    region: 'Orvieto',
    image: '/images/umbria/orvieto-duomo.jpg',
    description: `Orvieto whites are older than most European wine regions and suffered from their own success. Mass production diluted the reputation. Serious producers quietly fixed that. Today's best Orvieto Classico wines are dry, mineral, food-forward, and ideal for daily life. These are living wines, not collector trophies.`,
    tagline: 'One of Italy\'s oldest documented white wines.',
    facts: [
      'One of Italy\'s oldest documented white wines',
      'Modern versions emphasize freshness and balance',
      'Excellent everyday pairing wine'
    ],
    link: 'https://www.consorzioviniorvieto.it',
    linkText: 'Orvieto DOC consortium',
    category: 'light',
    practicalityRange: [0, 40]
  },
  {
    id: 'trasimeno',
    name: 'Colli del Trasimeno',
    region: 'Lake Trasimeno',
    image: '/images/umbria/lake-trasimeno.jpg',
    description: `Around Lake Trasimeno, wines get lighter. Gamay (locally called Grenache) shows up more often, producing fresher, easier reds meant for warm evenings and long meals. These wines reflect geography more than ambition.`,
    tagline: 'Designed for drinking, not debating.',
    facts: [
      'Lighter reds, lower alcohol',
      'Designed for drinking, not debating',
      'Strong lake-to-table connection'
    ],
    link: 'https://www.stradedelvino.umbria.it',
    linkText: 'Umbria Wine Routes',
    category: 'light',
    practicalityRange: [0, 50]
  }
];

function WineMap({ 
  activeMode, 
  practicalityValue 
}: { 
  activeMode: 'bold' | 'light';
  practicalityValue: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const zonesRef = useRef<Record<string, L.Polygon>>({});
  
  const apiKey = import.meta.env.VITE_MAPTILER_KEY;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [42.9, 12.4],
      zoom: 8.5,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      attributionControl: false
    });

    if (apiKey) {
      L.tileLayer(`https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=${apiKey}`, {
        maxZoom: 12
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 12
      }).addTo(map);
    }

    // Add wine zone polygons
    Object.entries(WINE_ZONES).forEach(([key, zone]) => {
      const polygon = L.polygon(zone.coords as L.LatLngExpression[], {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.3,
        weight: 2
      }).addTo(map);
      
      polygon.bindTooltip(zone.name, {
        permanent: false,
        direction: 'top',
        className: 'wine-zone-tooltip'
      });
      
      zonesRef.current[key] = polygon;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [apiKey]);

  // Update zone visibility based on toggle and slider
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    Object.entries(zonesRef.current).forEach(([key, polygon]) => {
      let opacity = 0.15;
      
      // Toggle-based visibility
      if (activeMode === 'bold' && key === 'montefalco') {
        opacity = 0.5;
      } else if (activeMode === 'light' && (key === 'orvieto' || key === 'trasimeno')) {
        opacity = 0.5;
      }
      
      // Slider-based overlay
      if (practicalityValue <= 40 && key === 'orvieto') {
        opacity = Math.max(opacity, 0.6);
      } else if (practicalityValue >= 60 && key === 'montefalco') {
        opacity = Math.max(opacity, 0.6);
      }
      
      polygon.setStyle({ fillOpacity: opacity });
    });
  }, [activeMode, practicalityValue]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-border/50"
    />
  );
}

function WineCard({ 
  wine, 
  isHighlighted 
}: { 
  wine: typeof WINES[0];
  isHighlighted: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-card border border-border/50 rounded-xl overflow-hidden transition-all duration-500",
        isHighlighted ? "ring-2 ring-primary/50 shadow-lg scale-[1.02]" : "hover:shadow-md",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={wine.image} 
          alt={wine.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {wine.region}
          </span>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-serif text-xl">{wine.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
          {expanded ? wine.description : `${wine.description.slice(0, 150)}...`}
        </p>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary text-sm flex items-center gap-1 mb-4 hover:underline"
        >
          {expanded ? 'Read less' : 'Read more'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="space-y-4 animate-fade-in">
            <p className="italic text-foreground/80 text-sm border-l-2 border-primary/30 pl-3">
              {wine.tagline}
            </p>

            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Wine className="w-4 h-4 text-primary" />
                What to know
              </h4>
              <ul className="space-y-1">
                {wine.facts.map((fact, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="outline" size="sm" asChild className="w-full">
              <a href={wine.link} target="_blank" rel="noopener noreferrer">
                {wine.linkText}
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function UmbriaWineExplorer() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMode, setActiveMode] = useState<'bold' | 'light'>('bold');
  const [practicalityValue, setPracticalityValue] = useState([50]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Determine which wines to highlight based on controls
  const getHighlightedWines = () => {
    const highlighted = new Set<string>();
    
    // Toggle-based highlighting
    if (activeMode === 'bold') {
      highlighted.add('sagrantino');
    } else {
      highlighted.add('orvieto');
      highlighted.add('trasimeno');
    }
    
    // Slider-based highlighting
    const value = practicalityValue[0];
    if (value <= 40) {
      highlighted.add('orvieto');
    } else if (value >= 60) {
      highlighted.add('sagrantino');
    }
    
    return highlighted;
  };

  const highlightedWines = getHighlightedWines();

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-28 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        {/* Editorial Header */}
        <div 
          className={cn(
            "max-w-3xl mx-auto text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Wine, Food & Culture
          </span>
          <h2 className="text-3xl md:text-4xl font-serif mb-6">
            How the region actually lives
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Umbria doesn't try to impress you. It feeds you, pours you a glass, rings a bell, and expects you to keep up.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            There's no coast to distract it, no cruise traffic to reshape it, no performance layer aimed at outsiders. What's left is one of the most internally coherent food and culture ecosystems in Italy. Wine is local. Food is seasonal. Festivals belong to the towns. Religion sets the rhythm whether you participate or not.
          </p>
          <p className="text-foreground font-medium mt-4 italic">
            This isn't curated Italy. It's structural Italy.
          </p>
        </div>

        {/* Wine Section Header */}
        <div 
          className={cn(
            "max-w-4xl mx-auto mb-10 transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <Grape className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-serif">Wine: fewer labels, stronger opinions</h3>
          </div>
        </div>

        {/* Interactive Controls */}
        <div 
          className={cn(
            "max-w-5xl mx-auto mb-10 transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Wine Style Toggle */}
              <div>
                <label className="block text-sm font-medium mb-4">Wine Style</label>
                <div className="flex items-center gap-4">
                  <span 
                    className={cn(
                      "text-sm font-medium transition-colors",
                      activeMode === 'bold' ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    Bold & Structured
                  </span>
                  <Switch
                    checked={activeMode === 'light'}
                    onCheckedChange={(checked) => setActiveMode(checked ? 'light' : 'bold')}
                  />
                  <span 
                    className={cn(
                      "text-sm font-medium transition-colors",
                      activeMode === 'light' ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    Light & Everyday
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {activeMode === 'bold' 
                    ? "🍷⏳🥩 Intense reds built for aging and special occasions"
                    : "🍷☀️🍝 Fresh wines for warm evenings and daily meals"
                  }
                </p>
              </div>

              {/* Practicality Slider */}
              <div>
                <label className="block text-sm font-medium mb-4">Wine Practicality</label>
                <div className="space-y-3">
                  <Slider
                    value={practicalityValue}
                    onValueChange={setPracticalityValue}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GlassWater className="w-3 h-3" />
                      Everyday Table Wine
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Cellar & Special Occasions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8">
              <WineMap 
                activeMode={activeMode} 
                practicalityValue={practicalityValue[0]} 
              />
            </div>
          </div>
        </div>

        {/* Wine Cards Grid */}
        <div 
          className={cn(
            "max-w-5xl mx-auto transition-all duration-700 delay-400",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {WINES.map((wine) => (
              <WineCard 
                key={wine.id} 
                wine={wine} 
                isHighlighted={highlightedWines.has(wine.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .wine-zone-tooltip {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
