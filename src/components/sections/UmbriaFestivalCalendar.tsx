import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Music, Theater, Sparkles, Users, MapPin, ExternalLink, 
  Leaf, Flower2, Guitar, UtensilsCrossed, Castle, Palette, Waves, BookOpen
} from 'lucide-react';
import umbriaJazzImage from '@/assets/umbria/umbria-jazz.jpg';
import spoletoFestivalImage from '@/assets/umbria/spoleto-festival.jpg';

interface Festival {
  id: string;
  name: string;
  location: string;
  month: string;
  monthIndices: number[];
  dates: string;
  description: string;
  whyGo: string;
  icon: typeof Music;
  color: string;
  image?: string;
  link?: string;
  attendance?: string;
}

// Major Festivals (13)
const majorFestivals: Festival[] = [
  {
    id: 'umbriajazz-winter',
    name: 'Umbria Jazz Winter',
    location: 'Orvieto',
    month: 'January',
    monthIndices: [0],
    dates: 'Through January 3, 2026',
    description: 'The winter edition of Italy\'s premier jazz festival, held in the medieval caves and theaters of Orvieto.',
    whyGo: 'Intimate jazz in underground venues — the acoustics in Orvieto\'s tufa caves are unreal.',
    icon: Music,
    color: 'bg-blue-100 text-blue-700',
    attendance: '20,000+'
  },
  {
    id: 'holos',
    name: 'Holos Festival',
    location: 'Perugia (Rocca Paolina)',
    month: 'March',
    monthIndices: [2],
    dates: 'March 14–15, 2026',
    description: 'A holistic health and wellness event featuring yoga, meditation, and alternative therapies in a Renaissance fortress.',
    whyGo: 'Wellness in a 16th-century fortress. The juxtaposition of ancient architecture and modern mindfulness is peak Umbria.',
    icon: Leaf,
    color: 'bg-green-100 text-green-700',
    attendance: '5,000+'
  },
  {
    id: 'calendimaggio',
    name: 'Calendimaggio',
    location: 'Assisi',
    month: 'May',
    monthIndices: [4],
    dates: 'May 6–9, 2026',
    description: 'Medieval May Day celebration with costumed parades, jousting, and crossbow competitions between the upper and lower city.',
    whyGo: 'Pure time travel. The whole town dresses in Renaissance garb and the rivalry between neighborhoods is real.',
    icon: Castle,
    color: 'bg-emerald-100 text-emerald-700',
    attendance: '30,000+'
  },
  {
    id: 'ceri',
    name: 'Corsa dei Ceri',
    location: 'Gubbio',
    month: 'May',
    monthIndices: [4],
    dates: 'May 15, 2026',
    description: 'Teams race 400kg wooden "candles" up a mountainside — unchanged for 900 years. Italy\'s most intense local festival.',
    whyGo: 'Nothing touristy about it. Raw, sweaty, genuinely dangerous-feeling tradition. The emotion is overwhelming.',
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-700',
    attendance: '25,000+'
  },
  {
    id: 'infiorata',
    name: 'Infiorata di Spello',
    location: 'Spello',
    month: 'June',
    monthIndices: [5],
    dates: 'June 6–7, 2026',
    description: 'Spectacular flower petal carpets line the streets for Corpus Domini — artists work through the night creating ephemeral masterpieces.',
    whyGo: 'Arrive at dawn to see thousands of flower petals arranged into religious scenes before they wilt. Transient beauty at its finest.',
    icon: Flower2,
    color: 'bg-pink-100 text-pink-700',
    attendance: '50,000+'
  },
  {
    id: 'chroma',
    name: 'Chroma Festival',
    location: 'Bastia Umbra',
    month: 'June',
    monthIndices: [5],
    dates: 'June 11+, 2026',
    description: 'Multi-day electronic and indie music festival at Umbriafiere, featuring international DJs and emerging artists.',
    whyGo: 'Modern festival vibes in a region usually associated with medieval history. Good balance of local and international acts.',
    icon: Guitar,
    color: 'bg-violet-100 text-violet-700',
    attendance: '15,000+'
  },
  {
    id: 'perugia1416',
    name: 'Perugia 1416',
    location: 'Perugia',
    month: 'June',
    monthIndices: [5],
    dates: 'June 12–14, 2026',
    description: 'Medieval historical reenactment celebrating the 1416 unification of Perugia\'s neighborhoods. Jousting, archery, and period markets.',
    whyGo: 'Like Calendimaggio but in a bigger city. The crossbow competition is genuinely competitive.',
    icon: Castle,
    color: 'bg-red-100 text-red-700',
    attendance: '40,000+'
  },
  {
    id: 'spoleto',
    name: 'Festival dei Due Mondi',
    location: 'Spoleto',
    month: 'June–July',
    monthIndices: [5, 6],
    dates: 'Late June – Mid July',
    description: 'World-class performing arts festival: opera, ballet, theater, and contemporary art in Roman amphitheaters and medieval piazzas.',
    whyGo: 'Serious culture in an intimate setting. You might see a Philip Glass opera in a 2,000-year-old venue.',
    icon: Theater,
    color: 'bg-purple-100 text-purple-700',
    image: spoletoFestivalImage,
    link: 'https://www.festivaldispoleto.com/',
    attendance: '100,000+'
  },
  {
    id: 'umbriajazz-summer',
    name: 'Umbria Jazz Summer',
    location: 'Perugia',
    month: 'July',
    monthIndices: [6],
    dates: 'July 3–12, 2026',
    description: 'One of Europe\'s most important jazz festivals. Arena concerts plus 300+ free shows in streets and piazzas. 2026 headliners include Sting and Zucchero.',
    whyGo: 'The free piazza concerts create magic — world-class music in medieval squares, gelato in hand, midnight sets.',
    icon: Music,
    color: 'bg-blue-100 text-blue-700',
    image: umbriaJazzImage,
    link: 'https://www.umbriajazz.it/',
    attendance: '500,000+'
  },
  {
    id: 'trasimeno-blues',
    name: 'Trasimeno Blues',
    location: 'Lake Trasimeno',
    month: 'July–August',
    monthIndices: [6, 7],
    dates: 'July–August 2026',
    description: 'Blues performances at various lakeside towns around Trasimeno — Castiglione, Passignano, and Isola Maggiore.',
    whyGo: 'Blues on the lake at sunset. Small crowds, authentic performances, and the most scenic venues in central Italy.',
    icon: Waves,
    color: 'bg-cyan-100 text-cyan-700',
    attendance: '10,000+'
  },
  {
    id: 'montelago',
    name: 'Montelago Celtic Festival',
    location: 'Colfiorito',
    month: 'August',
    monthIndices: [7],
    dates: 'August 6–9, 2026',
    description: 'Large Celtic culture and music festival near the Umbria-Marche border. Four days of folk music, workshops, and camping at 800m altitude.',
    whyGo: 'Italy\'s best Celtic festival, held in a natural amphitheater surrounded by mountains. Camping is part of the experience.',
    icon: Guitar,
    color: 'bg-green-100 text-green-700',
    link: 'https://www.montelago.it/',
    attendance: '30,000+'
  },
  {
    id: 'medioevo',
    name: 'Festival del Medioevo',
    location: 'Gubbio',
    month: 'September',
    monthIndices: [8],
    dates: 'Late September 2026',
    description: 'Cultural festival focused on medieval history — lectures, exhibitions, and demonstrations. Italy\'s most serious medieval studies event.',
    whyGo: 'Not a reenactment but real scholarship. Perfect for history nerds who want depth, not costumes.',
    icon: BookOpen,
    color: 'bg-stone-100 text-stone-700',
    attendance: '20,000+'
  },
  {
    id: 'eurochocolate',
    name: 'Eurochocolate',
    location: 'Perugia',
    month: 'November',
    monthIndices: [10],
    dates: 'November 20–29, 2026',
    description: 'Europe\'s largest chocolate festival. Free entry, 150+ artisan chocolatiers, tastings, sculptures, and workshops throughout the centro storico.',
    whyGo: 'The entire centro storico becomes a chocolate market. Free samples everywhere. November weather is perfect.',
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-700',
    link: 'https://www.eurochocolate.com/',
    attendance: '1,000,000+'
  },
];

// Food Sagre (7)
const foodSagre: Festival[] = [
  {
    id: 'sagra-oca',
    name: 'Sagra dell\'Oca',
    location: 'Bettona',
    month: 'July–August',
    monthIndices: [6, 7],
    dates: 'July 31 – August 9, 2026',
    description: 'Ten-day goose festival featuring traditional Umbrian goose preparations — roasted, in ragù, and preserved.',
    whyGo: 'Goose is Umbria\'s secret protein. This tiny town goes all-in with live music, local wines, and serious eating.',
    icon: UtensilsCrossed,
    color: 'bg-orange-100 text-orange-700',
    attendance: '15,000+'
  },
  {
    id: 'sagra-pesce',
    name: 'Sagra del Pesce',
    location: 'Passignano sul Trasimeno',
    month: 'August',
    monthIndices: [7],
    dates: 'August 2026',
    description: 'Celebration of Lake Trasimeno\'s freshwater fish — tegamaccio (fish stew), fried perch, and carp in porchetta style.',
    whyGo: 'Landlocked Umbria\'s answer to seafood. The tegamaccio is unlike anything you\'ve had before.',
    icon: UtensilsCrossed,
    color: 'bg-blue-100 text-blue-700',
    attendance: '20,000+'
  },
  {
    id: 'festa-cipolla',
    name: 'Festa della Cipolla',
    location: 'Cannara',
    month: 'September',
    monthIndices: [8],
    dates: 'September 2026',
    description: 'The famous Cannara onion gets its own festival — sweet, flat, and perfect for frittate and focacce.',
    whyGo: 'Cannara onions are so sweet you can eat them raw. The local nonne compete for best onion tart.',
    icon: UtensilsCrossed,
    color: 'bg-yellow-100 text-yellow-700',
    attendance: '10,000+'
  },
  {
    id: 'sagra-polenta',
    name: 'Sagra della Polenta',
    location: 'Cannara',
    month: 'September',
    monthIndices: [8],
    dates: 'September 2026',
    description: 'Traditional cornmeal dishes prepared over open fires in the piazza. Polenta with sausage, mushrooms, and wild boar ragù.',
    whyGo: 'Polenta cooked in massive copper pots by old men who\'ve been doing it for 50 years. That\'s the experience.',
    icon: UtensilsCrossed,
    color: 'bg-amber-100 text-amber-700',
    attendance: '8,000+'
  },
  {
    id: 'primi-italia',
    name: 'I Primi d\'Italia',
    location: 'Foligno',
    month: 'September',
    monthIndices: [8],
    dates: 'Late September 2026',
    description: 'National festival celebrating first courses — pasta, gnocchi, rice dishes from across Italy. Professional chefs and home cooks compete.',
    whyGo: 'If you care about pasta, this is the event. Every region brings their best primi. It\'s competitive and delicious.',
    icon: UtensilsCrossed,
    color: 'bg-red-100 text-red-700',
    link: 'https://www.iprimiditalia.it/',
    attendance: '100,000+'
  },
  {
    id: 'tartufo-market',
    name: 'Mostra Mercato del Tartufo',
    location: 'Gubbio & Città di Castello',
    month: 'October–November',
    monthIndices: [9, 10],
    dates: 'October–November 2026',
    description: 'Truffle fairs featuring black and white truffles from the Valtiberina. Tastings, demonstrations, and direct sales from hunters.',
    whyGo: 'Buy truffles directly from tartufai. Prices are 1/3 of restaurants. Bring cash and a poker face.',
    icon: UtensilsCrossed,
    color: 'bg-stone-100 text-stone-700',
    attendance: '50,000+'
  },
  {
    id: 'november-food',
    name: 'November Food Celebrations',
    location: 'Various',
    month: 'November',
    monthIndices: [10],
    dates: 'November 2026',
    description: 'Cluster of harvest festivals: Olive Oil Festival (Assisi), Honey Festival (Foligno), Chestnut Festival (San Martino in Colle).',
    whyGo: 'November is Umbria\'s food month. You can hit three festivals in one weekend across tiny hill towns.',
    icon: Palette,
    color: 'bg-amber-100 text-amber-700',
    attendance: '30,000+'
  },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function UmbriaFestivalCalendar() {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(majorFestivals[8]); // Default to Umbria Jazz Summer
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [category, setCategory] = useState<'major' | 'sagre'>('major');

  const currentFestivals = category === 'major' ? majorFestivals : foodSagre;

  const getFestivalsInMonth = useMemo(() => {
    return (monthIdx: number) => currentFestivals.filter(f => f.monthIndices.includes(monthIdx));
  }, [currentFestivals]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-blue-50/30">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            Cultural Calendar
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Umbria's Festival <span className="text-blue-600">Season</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From medieval jousting to world-class jazz, Umbria packs more authentic festivals per square kilometer 
            than anywhere in Italy. Plan your 2026 around these unmissable events.
          </p>
        </div>

        {/* Category Toggle */}
        <div className="mb-8">
          <Tabs value={category} onValueChange={(v) => { setCategory(v as 'major' | 'sagre'); setSelectedFestival(null); }}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="major" className="flex items-center gap-2">
                <Theater className="h-4 w-4" />
                Major Festivals ({majorFestivals.length})
              </TabsTrigger>
              <TabsTrigger value="sagre" className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                Food Sagre ({foodSagre.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <Button 
            variant={view === 'calendar' ? 'default' : 'outline'} 
            onClick={() => setView('calendar')}
            size="sm"
          >
            Calendar View
          </Button>
          <Button 
            variant={view === 'list' ? 'default' : 'outline'} 
            onClick={() => setView('list')}
            size="sm"
          >
            List View
          </Button>
        </div>

        {view === 'calendar' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Month Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {months.map((month, idx) => {
                  const festivalsInMonth = getFestivalsInMonth(idx);
                  const hasEvents = festivalsInMonth.length > 0;
                  
                  return (
                    <div 
                      key={month}
                      className={`
                        relative rounded-xl p-3 md:p-4 border transition-all cursor-pointer min-h-[100px]
                        ${hasEvents ? 'bg-white hover:shadow-lg hover:scale-105' : 'bg-muted/30'}
                      `}
                      onClick={() => hasEvents && setSelectedFestival(festivalsInMonth[0])}
                    >
                      <p className="text-xs font-medium text-muted-foreground mb-2">{month}</p>
                      <div className="space-y-1">
                        {festivalsInMonth.slice(0, 3).map(festival => (
                          <div 
                            key={festival.id}
                            className={`
                              text-xs px-2 py-1 rounded-full truncate cursor-pointer
                              ${festival.color}
                              ${selectedFestival?.id === festival.id ? 'ring-2 ring-offset-1 ring-primary' : ''}
                            `}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFestival(festival);
                            }}
                            title={festival.name}
                          >
                            {festival.name.split(' ')[0]}
                          </div>
                        ))}
                        {festivalsInMonth.length > 3 && (
                          <div className="text-xs text-muted-foreground pl-2">
                            +{festivalsInMonth.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Festival Detail */}
            <div className="lg:col-span-1">
              {selectedFestival ? (
                <Card className="sticky top-24 overflow-hidden animate-fade-in">
                  {selectedFestival.image && (
                    <img 
                      src={selectedFestival.image} 
                      alt={selectedFestival.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 ${selectedFestival.color}`}>
                      <selectedFestival.icon className="h-4 w-4" />
                      {selectedFestival.month}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{selectedFestival.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                      <MapPin className="h-3 w-3" />
                      {selectedFestival.location} · {selectedFestival.dates}
                    </p>
                    <p className="text-sm mb-4">{selectedFestival.description}</p>
                    <div className="bg-muted/50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium mb-1">Why You Should Go:</p>
                      <p className="text-sm text-muted-foreground italic">"{selectedFestival.whyGo}"</p>
                    </div>
                    {selectedFestival.attendance && (
                      <p className="text-xs text-muted-foreground mb-4">
                        👥 Average attendance: {selectedFestival.attendance} visitors
                      </p>
                    )}
                    {selectedFestival.link && (
                      <Button asChild size="sm" className="w-full">
                        <a href={selectedFestival.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Official Website
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Click a festival to see details</p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="grid md:grid-cols-2 gap-6">
            {currentFestivals.map(festival => (
              <Card key={festival.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${festival.color}`}>
                      <festival.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{festival.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {festival.location} · {festival.dates}
                      </p>
                      <p className="text-sm mb-3">{festival.description}</p>
                      <p className="text-xs italic text-muted-foreground">"{festival.whyGo}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pro Tip */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-blue-100">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Planning Tip
          </h4>
          <p className="text-muted-foreground">
            {category === 'major' ? (
              <>
                <strong>Book accommodation 3–6 months ahead</strong> for Umbria Jazz (July) and Eurochocolate (November) — 
                Perugia sells out completely. For medieval festivals like Calendimaggio and Corsa dei Ceri, 
                accommodation is easier but the experience is more intense. Consider staying in a nearby town and 
                arriving early.
              </>
            ) : (
              <>
                <strong>Sagre run on local time.</strong> Don't expect precise schedules — arrive hungry around 7:30pm, 
                find a bench at a communal table, and let the food come to you. Bring cash (most sagre don't take cards) 
                and wear something you don't mind getting truffle oil on.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

export default UmbriaFestivalCalendar;
