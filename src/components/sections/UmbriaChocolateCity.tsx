import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Gift, History, MapPin, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import baciImage from '@/assets/umbria/baci-chocolate.jpg';
import eurochocolateImage from '@/assets/umbria/eurochocolate-festival.jpg';

const timelineEvents = [
  { year: '1907', title: 'Perugina Founded', description: 'Four local entrepreneurs establish Perugina confectionery in Perugia.' },
  { year: '1922', title: 'Baci Born', description: 'Luisa Spagnoli creates "Baci" (kisses) — hazelnut chocolates with romantic love notes.' },
  { year: '1939', title: 'Silver Wrapper', description: 'The iconic silver and blue star-wrapped design becomes synonymous with Italian romance.' },
  { year: '1988', title: 'Nestlé Acquisition', description: 'Perugina joins Nestlé but keeps production in Perugia, preserving the local legacy.' },
  { year: '1993', title: 'Eurochocolate Begins', description: 'Perugia launches Europe\'s largest chocolate festival — 1 million+ visitors annually.' },
  { year: 'Today', title: 'Casa del Cioccolato', description: 'Factory museum offers tours, tastings, and chocolate-making workshops.' },
];

const loveNotes = [
  "L'amore vince sempre. — Love always wins.",
  "Un bacio vale più di mille parole. — A kiss is worth a thousand words.",
  "Dove c'è amore, c'è vita. — Where there is love, there is life.",
  "L'amore è cieco ma vede lontano. — Love is blind but sees far.",
  "Chi ama, crede. — Who loves, believes.",
  "L'amore non ha età. — Love has no age.",
  "Un cuore che ama non invecchia mai. — A heart that loves never grows old.",
  "L'amore è il miglior condimento. — Love is the best seasoning.",
];

export function UmbriaChocolateCity() {
  const [activeTab, setActiveTab] = useState<'story' | 'timeline' | 'visit'>('story');
  const [loveNote, setLoveNote] = useState<string | null>(null);
  const [isUnwrapping, setIsUnwrapping] = useState(false);

  const unwrapBacio = () => {
    setIsUnwrapping(true);
    setTimeout(() => {
      const randomNote = loveNotes[Math.floor(Math.random() * loveNotes.length)];
      setLoveNote(randomNote);
      setIsUnwrapping(false);
    }, 1500);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50/50 to-background">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Italy's Chocolate Capital
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Perugia: <span className="text-amber-700">Chocolate City</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Before there was Godiva, there was Perugina. Perugia has been crafting chocolate since 1907, 
            and today hosts Europe's largest chocolate festival every October.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { key: 'story', label: 'The Story', icon: Heart },
            { key: 'timeline', label: 'Timeline', icon: History },
            { key: 'visit', label: 'Visit', icon: MapPin },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? 'default' : 'outline'}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Dynamic Content */}
          <div className="space-y-6">
            {activeTab === 'story' && (
              <div className="space-y-6 animate-fade-in">
                <Card className="overflow-hidden">
                  <img src={baciImage} alt="Baci Perugina chocolates" className="w-full h-48 object-cover" />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-rose-500" />
                      The Baci Love Story
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      In 1922, Luisa Spagnoli invented <strong>Baci</strong> ("kisses") as a way to send secret 
                      love notes to her paramour. Each chocolate contained a tiny scroll with a romantic message — 
                      a tradition that continues today with notes in four languages.
                    </p>
                    <p className="text-muted-foreground">
                      The distinctive <strong>"cazzotto"</strong> (fist) shape wasn't romantic — it was practical. 
                      Luisa used leftover hazelnut pieces to create a textured dome, wrapped in that now-iconic 
                      silver foil with a single blue star.
                    </p>
                  </CardContent>
                </Card>

                {/* Love Note Generator */}
                <Card className="bg-gradient-to-br from-rose-50 to-amber-50 border-rose-200">
                  <CardContent className="p-6 text-center">
                    <Gift className="h-8 w-8 mx-auto mb-3 text-rose-500" />
                    <h4 className="font-bold mb-2">Unwrap Your Bacio</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click to reveal a classic Italian love note
                    </p>
                    <Button 
                      onClick={unwrapBacio} 
                      disabled={isUnwrapping}
                      className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700"
                    >
                      {isUnwrapping ? (
                        <span className="animate-pulse">Unwrapping...</span>
                      ) : (
                        <>
                          <Gift className="h-4 w-4 mr-2" />
                          Unwrap a Bacio
                        </>
                      )}
                    </Button>
                    {loveNote && (
                      <div className="mt-4 p-4 bg-white/80 rounded-lg border border-rose-200 animate-fade-in">
                        <p className="italic text-rose-800 font-medium">{loveNote}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4 animate-fade-in">
                {timelineEvents.map((event, index) => (
                  <div key={event.year} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                        {event.year === 'Today' ? '🍫' : event.year.slice(-2)}
                      </div>
                      {index < timelineEvents.length - 1 && (
                        <div className="w-0.5 h-full bg-amber-200 my-2" />
                      )}
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{event.year}</span>
                        </div>
                        <h4 className="font-bold text-sm">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'visit' && (
              <div className="space-y-6 animate-fade-in">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Casa del Cioccolato Perugina</h3>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Factory Tour:</strong> See Baci production line, learn the 100+ year history</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Chocolate School:</strong> Hands-on workshops for adults and kids</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Tasting Room:</strong> Sample exclusive limited editions and classics</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Location:</strong> 10 minutes from Perugia centro, free parking</span>
                      </li>
                    </ul>
                    <Button asChild className="w-full">
                      <a href="https://www.perugina.com/casa-del-cioccolato" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Book a Tour
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Eurochocolate Festival</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Every October, Perugia transforms into chocolate heaven. Over 1 million visitors descend 
                      for 10 days of tastings, sculptures, and workshops from artisan chocolatiers worldwide.
                    </p>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-sm font-medium text-amber-800">
                        📅 Next Edition: October 18–27, 2025
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Free entry · 150+ exhibitors · Corso Vannucci & surrounding streets
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right: Hero Image */}
          <div className="relative">
            <img 
              src={eurochocolateImage} 
              alt="Eurochocolate festival in Perugia" 
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm font-medium">Eurochocolate transforms Perugia's medieval streets each October</p>
              <p className="text-xs text-muted-foreground">Europe's largest chocolate festival since 1993</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UmbriaChocolateCity;
