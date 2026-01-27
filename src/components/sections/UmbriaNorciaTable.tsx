import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, ChevronRight, Sparkles, Search, ExternalLink } from 'lucide-react';
import norciaSalumiImage from '@/assets/umbria/norcia-salumi.jpg';
import truffleHuntingImage from '@/assets/umbria/truffle-hunting.jpg';

interface Specialty {
  id: string;
  name: string;
  italianName: string;
  description: string;
  origin: string;
  season?: string;
  funFact: string;
  pairings: string[];
}

const specialties: Specialty[] = [
  {
    id: 'prosciutto-norcia',
    name: 'Prosciutto di Norcia IGP',
    italianName: 'Prosciutto di Norcia',
    description: 'Dry-cured ham aged 12–18 months in the mountain air of Valnerina. Sweeter and more delicate than Parma, with a hint of juniper.',
    origin: 'Norcia',
    season: 'Year-round (best November–March)',
    funFact: 'Norcino (pork butcher) became a protected profession — the town literally invented the craft.',
    pairings: ['Sagrantino wine', 'Local pecorino', 'Farro bread']
  },
  {
    id: 'capocollo',
    name: 'Capocollo Umbro',
    italianName: 'Capocollo',
    description: 'Cured pork neck with a perfect balance of fat and lean. Rubbed with pepper and garlic, aged in cool cellars.',
    origin: 'Norcia / Valnerina',
    season: 'Year-round',
    funFact: 'Each norcino family has a secret spice blend passed down for generations.',
    pairings: ['Rosso di Montefalco', 'Grilled polenta']
  },
  {
    id: 'black-truffle',
    name: 'Black Truffle (Tartufo Nero)',
    italianName: 'Tartufo Nero Pregiato',
    description: 'Umbria produces 45% of Italy\'s black truffles. The Valnerina variety is earthy, musky, and less pungent than Piedmont\'s white.',
    origin: 'Valnerina / Spoleto',
    season: 'November – March (peak: Dec–Feb)',
    funFact: 'Truffle dogs are so valuable they\'re often insured for €10,000+. Pigs were banned in the 1980s because they ate the truffles.',
    pairings: ['Fresh pasta', 'Scrambled eggs', 'Risotto']
  },
  {
    id: 'summer-truffle',
    name: 'Summer Truffle (Scorzone)',
    italianName: 'Tartufo Estivo',
    description: 'Lighter, nuttier, more affordable cousin of the winter black. Still distinctly Umbrian, still transforms every dish.',
    origin: 'Throughout Umbria',
    season: 'May – September',
    funFact: 'At €200–400/kg (vs €2,000+ for winter black), this is how locals actually eat truffle regularly.',
    pairings: ['Grilled steak', 'Bruschetta', 'Fresh pasta']
  },
  {
    id: 'lenticchie',
    name: 'Castelluccio Lentils IGP',
    italianName: 'Lenticchie di Castelluccio',
    description: 'Tiny, thin-skinned lentils grown at 1,400m altitude. No soaking needed. Considered the best in Italy.',
    origin: 'Castelluccio di Norcia',
    season: 'Harvest: August (available year-round)',
    funFact: 'The flowering fields in June–July create Italy\'s most photographed landscape — the "fiorita."',
    pairings: ['Cotechino sausage', 'Extra virgin olive oil', 'New Year\'s Eve tradition']
  },
  {
    id: 'strangozzi',
    name: 'Strangozzi',
    italianName: 'Strangozzi alla Norcina',
    description: 'Thick, hand-rolled pasta (like fat shoelaces) served with truffle cream sauce or pork ragù. THE Umbrian primo.',
    origin: 'Spoleto / Norcia',
    season: 'Year-round',
    funFact: 'Name comes from "strangle" — allegedly used by Umbrians to strangle corrupt papal tax collectors.',
    pairings: ['Black truffle', 'Sausage ragù', 'Grated pecorino']
  }
];

const seasonalCalendar = [
  { season: 'Spring', months: 'Mar–May', highlights: 'Wild asparagus, summer truffle begins, lamb, first fava beans' },
  { season: 'Summer', months: 'Jun–Aug', highlights: 'Summer truffle peak, Castelluccio lentil harvest, fresh tomatoes' },
  { season: 'Autumn', months: 'Sep–Nov', highlights: 'Black truffle season starts, chestnuts, new olive oil, porcini mushrooms' },
  { season: 'Winter', months: 'Dec–Feb', highlights: 'Black truffle peak, fresh sausages, hearty stews, Sagrantino season' }
];

export function UmbriaNorciaTable() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(specialties[0]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-amber-50/30">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Norcia & The Valnerina
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            The Butcher's <span className="text-amber-700">Table</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Norcia gave Italy its word for butcher: <em>norcino</em>. This mountain town in the Valnerina valley 
            is ground zero for cured meats, black truffles, and the kind of food that made "cucina povera" 
            worth celebrating.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="specialties" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="truffles">Truffle Hunting</TabsTrigger>
            <TabsTrigger value="seasons">Seasonal Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="specialties" className="animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Specialty List */}
              <div className="lg:col-span-1 space-y-2">
                {specialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`
                      w-full text-left p-4 rounded-xl transition-all
                      ${selectedSpecialty.id === specialty.id 
                        ? 'bg-amber-100 border-2 border-amber-400' 
                        : 'bg-white border border-border hover:bg-muted/50'
                      }
                    `}
                  >
                    <h4 className="font-medium">{specialty.name}</h4>
                    <p className="text-xs text-muted-foreground">{specialty.origin}</p>
                  </button>
                ))}
              </div>

              {/* Selected Detail */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <img 
                    src={norciaSalumiImage} 
                    alt="Traditional Norcia salumeria" 
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold">{selectedSpecialty.name}</h3>
                    </div>
                    <p className="text-sm italic text-muted-foreground mb-4">
                      {selectedSpecialty.italianName}
                    </p>
                    
                    <p className="mb-4">{selectedSpecialty.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Origin
                        </p>
                        <p className="font-medium">{selectedSpecialty.origin}</p>
                      </div>
                      {selectedSpecialty.season && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Season
                          </p>
                          <p className="font-medium">{selectedSpecialty.season}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                      <p className="text-sm font-medium text-amber-800 mb-1">💡 Did You Know?</p>
                      <p className="text-sm text-amber-700">{selectedSpecialty.funFact}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Perfect Pairings:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecialty.pairings.map(pairing => (
                          <span 
                            key={pairing}
                            className="px-3 py-1 bg-muted rounded-full text-sm"
                          >
                            {pairing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="truffles" className="animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <img 
                  src={truffleHuntingImage} 
                  alt="Truffle hunting in Umbrian forest" 
                  className="rounded-2xl shadow-lg w-full h-80 object-cover"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Go Truffle Hunting</h3>
                  <p className="text-muted-foreground mb-4">
                    Umbria produces 45% of Italy's black truffles. The best way to understand the obsession? 
                    Join a <em>tartufaio</em> and their trained dog at dawn in the oak forests of Valnerina.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-bold mb-4">What to Expect</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Duration:</strong> 2–3 hours, usually starting at 8–9am</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>The Hunt:</strong> Follow the dog through forest trails — they do the work</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>The Feast:</strong> Return to cook and eat your finds with local wine</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Cost:</strong> €80–150/person, includes meal and wine</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
                  <CardContent className="p-6">
                    <Search className="h-6 w-6 text-amber-600 mb-3" />
                    <h4 className="font-bold mb-2">Book a Hunt</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Peak season is November–February. Book at least 2 weeks ahead. 
                      Many agriturismi around Spoleto and Norcia offer hunts.
                    </p>
                    <Button asChild size="sm">
                      <a href="https://www.umbriatourism.it/en/truffle-hunting" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Find Experiences
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seasons" className="animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {seasonalCalendar.map((season, idx) => (
                <Card 
                  key={season.season}
                  className={`
                    overflow-hidden
                    ${idx === 0 ? 'border-emerald-200 bg-emerald-50/50' : ''}
                    ${idx === 1 ? 'border-amber-200 bg-amber-50/50' : ''}
                    ${idx === 2 ? 'border-orange-200 bg-orange-50/50' : ''}
                    ${idx === 3 ? 'border-blue-200 bg-blue-50/50' : ''}
                  `}
                >
                  <CardContent className="p-6">
                    <div className="text-3xl mb-2">
                      {idx === 0 && '🌸'}
                      {idx === 1 && '☀️'}
                      {idx === 2 && '🍂'}
                      {idx === 3 && '❄️'}
                    </div>
                    <h4 className="text-xl font-bold mb-1">{season.season}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{season.months}</p>
                    <p className="text-sm">{season.highlights}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 bg-muted/50 rounded-xl p-6">
              <h4 className="font-bold mb-3">🍽️ The Umbrian Food Philosophy</h4>
              <p className="text-muted-foreground">
                Umbrians don't have a word for "farm-to-table" because they never lost the concept. 
                Every <em>norcino</em> knows their pigs by name. Every truffle hunter has a favorite 
                oak tree. The food here isn't artisanal — it's just how things have always been done.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default UmbriaNorciaTable;
