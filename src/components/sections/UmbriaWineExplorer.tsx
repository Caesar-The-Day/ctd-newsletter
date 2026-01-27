import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Wine, MapPin, Grape, Star, ArrowRight, ExternalLink } from 'lucide-react';

interface WineProfile {
  id: string;
  name: string;
  type: 'red' | 'white';
  classification: string;
  style: 'bold' | 'light';
  practicality: [number, number]; // min-max range
  zone: string;
  zoneCoords: { x: number; y: number }; // percentage positions on mini-map
  description: string;
  whatToKnow: string[];
  pairings: string[];
  priceRange: string;
  link?: string;
}

const wines: WineProfile[] = [
  {
    id: 'sagrantino',
    name: 'Sagrantino di Montefalco',
    type: 'red',
    classification: 'DOCG',
    style: 'bold',
    practicality: [70, 100],
    zone: 'Montefalco',
    zoneCoords: { x: 55, y: 65 },
    description: 'Italy\'s most tannic red — bigger than Barolo, more structured than Brunello. World-class aging potential.',
    whatToKnow: [
      'Needs 10+ years to soften, or decant for 3+ hours',
      'Only 2,500 acres planted worldwide — all in Umbria',
      'The "passito" version is a legendary dessert wine'
    ],
    pairings: ['Wild boar', 'Aged pecorino', 'Piccione alla ghiotta'],
    priceRange: '€25–€80',
    link: 'https://www.stradadelsagrantino.it/'
  },
  {
    id: 'rosso-montefalco',
    name: 'Rosso di Montefalco',
    type: 'red',
    classification: 'DOC',
    style: 'bold',
    practicality: [40, 70],
    zone: 'Montefalco',
    zoneCoords: { x: 55, y: 65 },
    description: 'Sagrantino\'s approachable sibling — 60-70% Sangiovese with 10-15% Sagrantino for structure.',
    whatToKnow: [
      'Drinkable young, but rewards 3-5 years aging',
      'Best value wine in Umbria',
      'Great introduction to Montefalco before tackling pure Sagrantino'
    ],
    pairings: ['Pasta with meat ragù', 'Grilled sausages', 'Strangozzi al tartufo'],
    priceRange: '€12–€25'
  },
  {
    id: 'torgiano-riserva',
    name: 'Torgiano Rosso Riserva',
    type: 'red',
    classification: 'DOCG',
    style: 'bold',
    practicality: [70, 100],
    zone: 'Torgiano',
    zoneCoords: { x: 45, y: 35 },
    description: 'Umbria\'s other DOCG red — Sangiovese-based, comparable to top Brunello. Lungarotti\'s "Rubesco Riserva" is legendary.',
    whatToKnow: [
      'Only one producer makes most of it (Lungarotti)',
      'Must age minimum 3 years before release',
      'Wine museum in Torgiano is worth the trip'
    ],
    pairings: ['Bistecca', 'Umbricelli con ragù d\'oca', 'Aged Parmigiano'],
    priceRange: '€30–€60',
    link: 'https://www.lungarotti.it/'
  },
  {
    id: 'orvieto',
    name: 'Orvieto Classico',
    type: 'white',
    classification: 'DOC',
    style: 'light',
    practicality: [0, 40],
    zone: 'Orvieto',
    zoneCoords: { x: 20, y: 80 },
    description: 'Umbria\'s most famous white — crisp, floral, and incredibly food-friendly. The "Classico" zone produces the best examples.',
    whatToKnow: [
      'Look for "Classico Superiore" for higher quality',
      'Grechetto-dominant blends have more character',
      'Historically made sweet (abboccato) — dry is the modern style'
    ],
    pairings: ['Lake Trasimeno fish', 'Antipasti', 'Light pasta dishes'],
    priceRange: '€8–€18'
  },
  {
    id: 'grechetto',
    name: 'Grechetto',
    type: 'white',
    classification: 'IGT/DOC',
    style: 'light',
    practicality: [30, 60],
    zone: 'Throughout Umbria',
    zoneCoords: { x: 50, y: 50 },
    description: 'Umbria\'s native white grape — nutty, textured, and more interesting than most Italian whites.',
    whatToKnow: [
      'Two styles: fresh/aromatic (Todi) vs. rich/oxidative (Colli Martani)',
      'Best producers age it in oak or amphora',
      'The "Grechetto di Todi" is considered superior'
    ],
    pairings: ['Truffle dishes', 'Risotto', 'Roasted chicken'],
    priceRange: '€10–€25'
  },
  {
    id: 'trebbiano-spoletino',
    name: 'Trebbiano Spoletino',
    type: 'white',
    classification: 'IGT',
    style: 'light',
    practicality: [40, 70],
    zone: 'Spoleto',
    zoneCoords: { x: 60, y: 75 },
    description: 'Umbria\'s most underrated white — complex, age-worthy, and nothing like ordinary Trebbiano.',
    whatToKnow: [
      'Not related to Trebbiano Toscano despite the name',
      'Can age 5-10 years — unusual for Italian whites',
      'Producers like Tabarrini and Antonelli are setting new standards'
    ],
    pairings: ['Rich fish dishes', 'Porchetta', 'White truffle'],
    priceRange: '€15–€35'
  },
];

export function UmbriaWineExplorer() {
  const [wineStyle, setWineStyle] = useState<'bold' | 'light'>('bold');
  const [practicality, setPracticality] = useState<number>(50);
  const [selectedWine, setSelectedWine] = useState<WineProfile | null>(null);

  const filteredWines = useMemo(() => {
    return wines.filter(wine => {
      const styleMatch = wine.style === wineStyle;
      const practicalityMatch = practicality >= wine.practicality[0] && practicality <= wine.practicality[1];
      return styleMatch && practicalityMatch;
    });
  }, [wineStyle, practicality]);

  const practicalityLabel = useMemo(() => {
    if (practicality <= 30) return 'Table Wine';
    if (practicality <= 60) return 'Dinner Party';
    return 'Special Occasion';
  }, [practicality]);

  const highlightedZones = useMemo(() => {
    return filteredWines.map(w => w.zone);
  }, [filteredWines]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-purple-50/30">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Wine className="h-4 w-4" />
            Wine Guide
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Umbrian <span className="text-purple-600">Wines</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Umbria's wines aren't famous because Tuscany got there first. But serious wine people know: 
            <strong className="text-foreground"> Sagrantino is Italy's biggest secret</strong>, and Orvieto punches above its weight class.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-8">
            {/* Style Toggle */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Grape className="h-5 w-5 text-purple-600" />
                  Wine Style
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={wineStyle === 'bold' ? 'default' : 'outline'}
                    onClick={() => setWineStyle('bold')}
                    className="flex flex-col h-auto py-4"
                  >
                    <span className="font-semibold">Bold & Structured</span>
                    <span className="text-xs opacity-80">Sagrantino, Torgiano</span>
                  </Button>
                  <Button
                    variant={wineStyle === 'light' ? 'default' : 'outline'}
                    onClick={() => setWineStyle('light')}
                    className="flex flex-col h-auto py-4"
                  >
                    <span className="font-semibold">Light & Everyday</span>
                    <span className="text-xs opacity-80">Orvieto, Grechetto</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Practicality Slider */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Occasion
                </h3>
                <div className="space-y-4">
                  <Slider
                    value={[practicality]}
                    onValueChange={(v) => setPracticality(v[0])}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Table Wine</span>
                    <span>Dinner Party</span>
                    <span>Special</span>
                  </div>
                  <div className="text-center">
                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {practicalityLabel}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mini Map */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Wine Zones
                </h3>
                <div className="relative aspect-square bg-gradient-to-b from-green-100 to-green-200 rounded-xl overflow-hidden">
                  {/* Simplified Umbria shape */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <path 
                      d="M20,20 Q50,10 80,25 L85,60 Q75,85 50,90 Q25,85 15,60 Z" 
                      fill="rgba(34, 197, 94, 0.3)" 
                      stroke="rgba(34, 197, 94, 0.6)"
                      strokeWidth="1"
                    />
                  </svg>
                  
                  {/* Zone markers */}
                  {wines.map(wine => {
                    const isHighlighted = highlightedZones.includes(wine.zone);
                    const isSelected = selectedWine?.id === wine.id;
                    
                    // Only show unique zones
                    const isFirstOfZone = wines.findIndex(w => w.zone === wine.zone) === wines.indexOf(wine);
                    if (!isFirstOfZone) return null;
                    
                    return (
                      <div
                        key={wine.zone}
                        className={`
                          absolute w-4 h-4 rounded-full border-2 transition-all cursor-pointer
                          ${isHighlighted 
                            ? 'bg-purple-500 border-white scale-125 shadow-lg' 
                            : 'bg-muted border-muted-foreground/30 opacity-50'
                          }
                          ${isSelected ? 'ring-4 ring-purple-300' : ''}
                        `}
                        style={{ 
                          left: `${wine.zoneCoords.x}%`, 
                          top: `${wine.zoneCoords.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => {
                          const zoneWines = wines.filter(w => w.zone === wine.zone);
                          setSelectedWine(zoneWines[0]);
                        }}
                        title={wine.zone}
                      />
                    );
                  })}
                  
                  {/* Zone labels */}
                  <div className="absolute top-[30%] left-[40%] text-xs font-medium text-green-800 bg-white/60 px-1 rounded">
                    Torgiano
                  </div>
                  <div className="absolute top-[60%] left-[50%] text-xs font-medium text-green-800 bg-white/60 px-1 rounded">
                    Montefalco
                  </div>
                  <div className="absolute top-[75%] left-[15%] text-xs font-medium text-green-800 bg-white/60 px-1 rounded">
                    Orvieto
                  </div>
                  <div className="absolute top-[70%] left-[55%] text-xs font-medium text-green-800 bg-white/60 px-1 rounded">
                    Spoleto
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  {highlightedZones.length > 0 
                    ? `Showing: ${[...new Set(highlightedZones)].join(', ')}`
                    : 'Adjust filters to see wine zones'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Wine Cards */}
          <div className="lg:col-span-2 space-y-4">
            {filteredWines.length > 0 ? (
              filteredWines.map(wine => (
                <Card 
                  key={wine.id} 
                  className={`
                    overflow-hidden cursor-pointer transition-all hover:shadow-lg
                    ${selectedWine?.id === wine.id ? 'ring-2 ring-purple-500' : ''}
                  `}
                  onClick={() => setSelectedWine(wine)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`
                        p-3 rounded-xl
                        ${wine.type === 'red' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}
                      `}>
                        <Wine className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{wine.name}</h3>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {wine.classification}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {wine.zone} · {wine.priceRange}
                        </p>
                        <p className="text-sm mb-4">{wine.description}</p>
                        
                        {selectedWine?.id === wine.id && (
                          <div className="animate-fade-in space-y-4 pt-4 border-t">
                            <div>
                              <h4 className="text-sm font-semibold mb-2">What to Know:</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {wine.whatToKnow.map((tip, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <ArrowRight className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Pairs With:</h4>
                              <div className="flex flex-wrap gap-2">
                                {wine.pairings.map(pairing => (
                                  <span key={pairing} className="text-xs bg-muted px-2 py-1 rounded-full">
                                    {pairing}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {wine.link && (
                              <Button asChild size="sm" variant="outline">
                                <a href={wine.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Learn More
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Wine className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No wines match your criteria</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting the style or occasion slider
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Editorial Footer */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-rose-50 rounded-2xl p-6 md:p-8 border border-purple-100">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Grape className="h-5 w-5 text-purple-600" />
            The Insider Take
          </h4>
          <p className="text-muted-foreground">
            <strong>Don't leave Umbria without trying Sagrantino Passito</strong> — the dried-grape dessert wine version. 
            It's liquid history, made the same way for 500 years. Pair it with dark chocolate (preferably from Perugia) 
            and you'll understand why the monks kept this secret. For everyday drinking, a €12 Rosso di Montefalco 
            will outperform most €30 Chiantis.
          </p>
        </div>
      </div>
    </section>
  );
}

export default UmbriaWineExplorer;
