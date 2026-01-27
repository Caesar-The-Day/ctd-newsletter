import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, History, MapPin, ExternalLink, ChevronRight, Sparkles, Share2, X } from 'lucide-react';
import baciImage from '@/assets/umbria/baci-chocolate.jpg';

const timelineEvents = [
  { year: '1907', title: 'Perugina Founded', description: 'Four local entrepreneurs establish Perugina confectionery in Perugia.' },
  { year: '1922', title: 'Baci Born', description: 'Luisa Spagnoli creates "Baci" (kisses) — hazelnut chocolates with romantic love notes.' },
  { year: '1939', title: 'Silver Wrapper', description: 'The iconic silver and blue star-wrapped design becomes synonymous with Italian romance.' },
  { year: '1988', title: 'Nestlé Acquisition', description: 'Perugina joins Nestlé but keeps production in Perugia, preserving the local legacy.' },
  { year: '1993', title: 'Eurochocolate Begins', description: 'Perugia launches Europe\'s largest chocolate festival — 1 million+ visitors annually.' },
  { year: 'Today', title: 'Casa del Cioccolato', description: 'Factory museum offers tours, tastings, and chocolate-making workshops.' },
];

const loveNotes = [
  // Classic Baci notes
  "L'amore vince sempre. — Love always wins.",
  "Un bacio vale più di mille parole. — A kiss is worth a thousand words.",
  "Dove c'è amore, c'è vita. — Where there is love, there is life.",
  "L'amore è cieco ma vede lontano. — Love is blind but sees far.",
  "Chi ama, crede. — Who loves, believes.",
  "L'amore non ha età. — Love has no age.",
  "Un cuore che ama non invecchia mai. — A heart that loves never grows old.",
  "L'amore è il miglior condimento. — Love is the best seasoning.",
  // Literary and attributed quotes
  "Nei sogni come nell'amore tutto è possibile. — In dreams as in love all is possible. — J. Arany",
  "Ti ho amato a prima vista. E tu sorridi perché lo sai. — I loved you at first sight. And you smile because you know it.",
  "Un bacio colpisce come un fulmine: l'amore passa come una tempesta. — A kiss strikes like lightning: love passes like a storm.",
  "L'amore è come la fortuna: non ama essere inseguito. — Love is like luck: it doesn't like to be chased.",
  "Essere amati profondamente da qualcuno ti dà forza; amare qualcuno profondamente ti dà coraggio. — Being deeply loved by someone gives you strength; loving someone deeply gives you courage.",
  "Io capisco i tuoi baci e tu i miei. — I understand thy kisses and thou mine. — W. Shakespeare",
  "Un vero amico sa tutto di te eppure ti vuole ancora bene. — A true friend knows all there is to know about you yet still likes you. — E. Hubbard",
  "Gli amanti possono vivere di baci e acqua. — Lovers can live on kisses and water. — English proverb",
  "Con i tuoi baci ho dipinto il mio cielo stellato. — With your kisses have I painted my starry sky.",
  "Finché non amai, non vissi abbastanza. — Till I loved, I did not live enough. — E. Dickinson",
  "La passione abbaglia gli amanti. L'amore li unisce per sempre. — Passion dazzles lovers. Love unites them forever.",
  "Giorno dopo giorno e notte dopo notte eravamo insieme – tutto il resto è stato da tempo dimenticato. — Day by day and night by night we were together – all else has long been forgotten by me. — W. Whitman",
  "Invecchia con me; il meglio deve ancora venire. — Grow old along with me; the best is yet to be. — G. Sand",
  "Abbiamo parlato molto dell'amore. Ora proviamo ad ascoltarlo, che ne dici? — We've spoken a lot about love. Now let's try to listen to it, shall we?",
  "La verità dell'amicizia è per me sacra quanto la santità del matrimonio eterno. — The truth of friendship is as sacred to me as the sanctity of lifelong marriage. — K. Mansfield",
  "Il cuore non si può comprare né vendere, solo donare. — The heart cannot be bought or sold, but only given.",
  "Le azioni più lodevoli sono quelle che restano nascoste. — The most praiseworthy deeds are those that remain hidden. — B. Pascal",
  "Come dai è più importante di cosa dai. — How you give is more important than what you give. — P. Corneille",
];

// Kiss particles animation component with radial spread
const KissParticles = ({ isActive }: { isActive: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2;
      const distance = 60 + Math.random() * 50;
      return {
        id: i,
        symbol: ['💋', '♥', '💕', '✨', '💗'][Math.floor(Math.random() * 5)],
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance - 20,
        delay: Math.random() * 0.4,
        size: 14 + Math.random() * 8,
      };
    }), []
  );

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20" style={{ width: '200%', height: '200%', left: '-50%', top: '-50%' }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute left-1/2 top-1/2 animate-kiss-burst"
          style={{
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animationDelay: `${p.delay}s`,
            fontSize: `${p.size}px`,
          } as React.CSSProperties}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};

// Social share card modal
const ShareModal = ({ loveNote, onClose }: { loveNote: string; onClose: () => void }) => {
  const shareText = `💋 My Bacio love note from Perugia: "${loveNote}" ✨ #BaciPerugina #Umbria #Italy`;
  
  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };
  
  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`, '_blank');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="relative max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        {/* Share card with romantic Italian background */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          {/* Background gradient with romantic Italian vibes */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-amber-800 to-rose-950" />
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          {/* Silver foil accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-300 via-white to-slate-300" />
          
          <div className="relative p-8 text-center">
            {/* Baci star decoration */}
            <div className="flex justify-center mb-4">
              <span className="text-4xl">💋</span>
            </div>
            
            {/* Love note */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
              <p className="text-white text-lg italic font-medium leading-relaxed">
                "{loveNote}"
              </p>
            </div>
            
            {/* Branding */}
            <p className="text-white/80 text-sm mb-6">
              🍫 A Bacio love note from Perugia, Umbria
            </p>
            
            {/* Share buttons */}
            <div className="flex justify-center gap-3">
              <Button 
                onClick={shareToTwitter}
                size="sm"
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
              >
                𝕏 Share
              </Button>
              <Button 
                onClick={shareToFacebook}
                size="sm"
                className="bg-[#4267B2] hover:bg-[#365899] text-white"
              >
                Facebook
              </Button>
              <Button 
                onClick={copyToClipboard}
                size="sm"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function UmbriaChocolateCity() {
  const [activeTab, setActiveTab] = useState<'story' | 'timeline' | 'visit'>('story');
  const [loveNote, setLoveNote] = useState<string | null>(null);
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const unwrapBacio = () => {
    setIsUnwrapping(true);
    setShowParticles(true);
    setTimeout(() => {
      const randomNote = loveNotes[Math.floor(Math.random() * loveNotes.length)];
      setLoveNote(randomNote);
      setIsUnwrapping(false);
    }, 1500);
    // Reset particles after animation completes
    setTimeout(() => setShowParticles(false), 2500);
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
            and today hosts Europe's largest chocolate festival every November.
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
                {/* Baci Card with hover unwrap effect */}
                <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:animate-card-unwrap hover:shadow-xl relative">
                  {/* Silver shimmer overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] animate-foil-shimmer" />
                  
                  <img src={baciImage} alt="Baci Perugina chocolates" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <CardContent className="p-6 relative">
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
                    <Heart className="h-8 w-8 mx-auto mb-3 text-rose-500" />
                    <h4 className="font-bold mb-2">Unwrap Your Bacio</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click to reveal a classic Italian love note
                    </p>
                    <div className="relative inline-block">
                      <Button 
                        onClick={unwrapBacio} 
                        disabled={isUnwrapping}
                        className={`
                          relative overflow-visible
                          bg-gradient-to-r from-amber-600 to-rose-600 
                          hover:from-amber-700 hover:to-rose-700
                          ${isUnwrapping ? 'bg-[length:200%_100%] animate-foil-shimmer bg-gradient-to-r from-slate-300 via-white to-slate-300' : ''}
                        `}
                      >
                        <KissParticles isActive={showParticles} />
                        {isUnwrapping ? (
                          <span className="animate-pulse">Unwrapping...</span>
                        ) : (
                          <>
                            <Heart className="h-4 w-4 mr-2" />
                            Unwrap a Bacio
                          </>
                        )}
                      </Button>
                    </div>
                    {loveNote && (
                      <div className="mt-4 p-4 bg-white/80 rounded-lg border border-rose-200 animate-scale-in">
                        <p className="italic text-rose-800 font-medium mb-3">{loveNote}</p>
                        <Button
                          onClick={() => setShowShareModal(true)}
                          size="sm"
                          variant="outline"
                          className="gap-2 border-rose-300 text-rose-700 hover:bg-rose-50"
                        >
                          <Share2 className="h-3 w-3" />
                          Share Your Note
                        </Button>
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
                      Every November, Perugia transforms into chocolate heaven. Over 1 million visitors descend 
                      for 10 days of tastings, sculptures, and workshops from artisan chocolatiers worldwide.
                    </p>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-sm font-medium text-amber-800">
                        📅 Next Edition: November 13–22, 2026
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
              src="https://www.poggiodegliolivi.com/wp-content/uploads/2021/09/4-1.jpg" 
              alt="Eurochocolate festival in Perugia" 
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm font-medium">Eurochocolate transforms Perugia's medieval streets each November</p>
              <p className="text-xs text-muted-foreground">Europe's largest chocolate festival since 1993</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Modal */}
      {showShareModal && loveNote && (
        <ShareModal loveNote={loveNote} onClose={() => setShowShareModal(false)} />
      )}
    </section>
  );
}

export default UmbriaChocolateCity;
