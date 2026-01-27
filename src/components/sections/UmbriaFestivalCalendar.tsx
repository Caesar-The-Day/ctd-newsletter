import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Music, Theater, Sparkles, Users, MapPin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import umbriaJazzImage from '@/assets/umbria/umbria-jazz.jpg';
import spoletoFestivalImage from '@/assets/umbria/spoleto-festival.jpg';

interface Festival {
  id: string;
  name: string;
  location: string;
  month: string;
  dates: string;
  description: string;
  whyGo: string;
  icon: typeof Music;
  color: string;
  image?: string;
  link?: string;
  attendance?: string;
}

const festivals: Festival[] = [
  {
    id: 'calendimaggio',
    name: 'Calendimaggio',
    location: 'Assisi',
    month: 'May',
    dates: 'First week of May',
    description: 'Medieval May Day celebration with costumed parades, jousting, and crossbow competitions between the upper and lower city.',
    whyGo: 'Pure time travel. The whole town dresses in Renaissance garb and the rivalry between neighborhoods is real.',
    icon: Users,
    color: 'bg-emerald-100 text-emerald-700',
    attendance: '30,000+'
  },
  {
    id: 'ceri',
    name: 'Corsa dei Ceri',
    location: 'Gubbio',
    month: 'May',
    dates: 'May 15',
    description: 'Teams race 400kg wooden "candles" up a mountainside — unchanged for 900 years. Italy\'s most intense local festival.',
    whyGo: 'Nothing touristy about it. Raw, sweaty, genuinely dangerous-feeling tradition. The emotion is overwhelming.',
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-700',
    attendance: '25,000+'
  },
  {
    id: 'spoleto',
    name: 'Festival dei Due Mondi',
    location: 'Spoleto',
    month: 'June–July',
    dates: 'Late June – Early July',
    description: 'World-class performing arts festival: opera, ballet, theater, and contemporary art in Roman amphitheaters and medieval piazzas.',
    whyGo: 'Serious culture in an intimate setting. You might see a Philip Glass opera in a 2,000-year-old venue.',
    icon: Theater,
    color: 'bg-purple-100 text-purple-700',
    image: spoletoFestivalImage,
    link: 'https://www.festivaldispoleto.com/',
    attendance: '100,000+'
  },
  {
    id: 'umbriajazz',
    name: 'Umbria Jazz',
    location: 'Perugia',
    month: 'July',
    dates: 'Mid-July (10 days)',
    description: 'One of Europe\'s most important jazz festivals. Arena concerts plus 300+ free shows in streets and piazzas.',
    whyGo: 'The free piazza concerts create magic — world-class music in medieval squares, gelato in hand, midnight sets.',
    icon: Music,
    color: 'bg-blue-100 text-blue-700',
    image: umbriaJazzImage,
    link: 'https://www.umbriajazz.it/',
    attendance: '500,000+'
  },
  {
    id: 'quintana',
    name: 'Giostra della Quintana',
    location: 'Foligno',
    month: 'June & September',
    dates: 'Mid-June & Mid-September',
    description: 'Baroque jousting tournament with 800 costumed performers. Knights tilt at a rotating wooden figure.',
    whyGo: 'Less famous than Siena\'s Palio but equally spectacular — and you can actually get tickets.',
    icon: Users,
    color: 'bg-rose-100 text-rose-700',
    attendance: '15,000+'
  },
  {
    id: 'eurochocolate',
    name: 'Eurochocolate',
    location: 'Perugia',
    month: 'October',
    dates: 'Mid-October (10 days)',
    description: 'Europe\'s largest chocolate festival. Free entry, 150+ artisan chocolatiers, tastings, sculptures, and workshops.',
    whyGo: 'The entire centro storico becomes a chocolate market. Free samples everywhere. October weather is perfect.',
    icon: Sparkles,
    color: 'bg-amber-100 text-amber-700',
    link: 'https://www.eurochocolate.com/',
    attendance: '1,000,000+'
  },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function UmbriaFestivalCalendar() {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(festivals[3]); // Default to Umbria Jazz
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const getMonthIndex = (monthStr: string): number[] => {
    const monthMap: Record<string, number[]> = {
      'May': [4],
      'June–July': [5, 6],
      'July': [6],
      'June & September': [5, 8],
      'October': [9],
    };
    return monthMap[monthStr] || [];
  };

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
            than anywhere in Italy. Plan your year around these unmissable events.
          </p>
        </div>

        {/* Calendar View Toggle */}
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
                  const festivalsInMonth = festivals.filter(f => getMonthIndex(f.month).includes(idx));
                  const hasEvents = festivalsInMonth.length > 0;
                  
                  return (
                    <div 
                      key={month}
                      className={`
                        relative rounded-xl p-3 md:p-4 border transition-all cursor-pointer
                        ${hasEvents ? 'bg-white hover:shadow-lg hover:scale-105' : 'bg-muted/30'}
                      `}
                      onClick={() => hasEvents && setSelectedFestival(festivalsInMonth[0])}
                    >
                      <p className="text-xs font-medium text-muted-foreground mb-2">{month}</p>
                      <div className="space-y-1">
                        {festivalsInMonth.map(festival => (
                          <div 
                            key={festival.id}
                            className={`
                              text-xs px-2 py-1 rounded-full truncate
                              ${festival.color}
                              ${selectedFestival?.id === festival.id ? 'ring-2 ring-offset-1 ring-primary' : ''}
                            `}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFestival(festival);
                            }}
                          >
                            {festival.name.split(' ')[0]}
                          </div>
                        ))}
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
            {festivals.map(festival => (
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
            <strong>Book accommodation 3–6 months ahead</strong> for Umbria Jazz (July) and Eurochocolate (October) — 
            Perugia sells out completely. For medieval festivals like Calendimaggio and Corsa dei Ceri, 
            accommodation is easier but the experience is more intense. Consider staying in a nearby town and 
            arriving early.
          </p>
        </div>
      </div>
    </section>
  );
}

export default UmbriaFestivalCalendar;
