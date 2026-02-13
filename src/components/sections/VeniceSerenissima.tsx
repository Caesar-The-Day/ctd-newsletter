import { useState, useEffect, useRef } from 'react';
import { useCountUp } from '@/hooks/use-count-up';
import { cn } from '@/lib/utils';
import { MapPin, Compass } from 'lucide-react';
import SestiereSVGMap from './venice/SestiereSVGMap';
import GettingAroundVenice from './venice/GettingAroundVenice';

/* ── Sestieri Data ── */
interface Sestiere {
  name: string;
  vibe: string;
  image: string;
  color: string;
  paragraphs: string[];
  caesarPick: { title: string; description: string };
}

const sestieri: Sestiere[] = [
  {
    name: 'San Marco',
    vibe: 'Grand & Theatrical',
    image: '/images/veneto/sestiere-san-marco.jpg',
    color: 'text-amber-600',
    paragraphs: [
      'Yes, it\'s the most visited square on earth. Yes, the pigeons outnumber the Venetians. But dismiss San Marco at your peril — because Piazza San Marco at dawn, before the cruise ships disgorge their cargo, is still one of the most sublime experiences in Western civilization. Napoleon called it "the drawing room of Europe," and he wasn\'t wrong.',
      'Beyond the Piazza, this sestiere hides the Teatro La Fenice (rebuilt after its third fire), the labyrinthine Mercerie shopping streets, and some of the most jaw-dropping palazzo facades on the Grand Canal. The trick is timing: arrive at 6:30am or after 8pm, and the Grand Stage becomes yours alone.',
    ],
    caesarPick: {
      title: 'Caffè Florian at 7am',
      description: 'The oldest café in the world (1720) before the tourist hordes. Sit outside, order an espresso, watch the light hit the Basilica\'s mosaics. It\'ll cost you €12 for a coffee. It\'s worth €12,000.',
    },
  },
  {
    name: 'Dorsoduro',
    vibe: 'Artisan & Bohemian',
    image: '/images/veneto/sestiere-dorsoduro.jpg',
    color: 'text-rose-600',
    paragraphs: [
      'If San Marco is Venice\'s opera house, Dorsoduro is its jazz club. This is where the Peggy Guggenheim Collection sits in quiet defiance of convention, where the Gallerie dell\'Accademia houses the greatest collection of Venetian painting outside the churches themselves, and where Ca\' Foscari university students keep the neighborhood alive with actual youth.',
      'The southern edge — the Zattere — offers a long, sun-drenched promenade facing Giudecca, perfect for a late-afternoon passeggiata. But the real heart is Campo Santa Margherita: a wide, unpretentious piazza surrounded by bars where locals and students drink spritz at prices that won\'t bankrupt you.',
    ],
    caesarPick: {
      title: 'Campo Santa Margherita at aperitivo hour',
      description: 'The most "local" piazza in Venice. No gondolier costumes, no glass souvenirs — just Venetians and university students sharing tables, arguing about football, and drinking Aperol Spritz at €4 instead of €14.',
    },
  },
  {
    name: 'San Polo',
    vibe: 'Market Heart & Foodie Soul',
    image: '/images/veneto/sestiere-san-polo.jpg',
    color: 'text-orange-600',
    paragraphs: [
      'The smallest sestiere holds the biggest personality. San Polo is where Venice eats, drinks, and has eaten and drunk for a thousand years. The Rialto fish market — the Pescheria — has been selling the lagoon\'s catch since 1097. Stand there at 7am and watch the fishermen unload crates of moeche (soft-shell crabs), seppia (cuttlefish), and scampi still twitching.',
      'This is also bacaro country — Venice\'s answer to tapas bars. These tiny, standing-room-only wine bars serve cicchetti (small bites) on the counter: baccalà mantecato on crostini, sarde in saor, folded slices of mortadella. You eat standing up, you drink an ombra (a small glass of wine), and you move to the next one. It\'s the original bar crawl, invented 500 years before Brooklyn.',
    ],
    caesarPick: {
      title: 'All\'Arco — standing-room cicchetti',
      description: 'A bacaro so small you\'ll miss it. Run by father and son, serving the best cicchetti in Venice from a counter the size of a piano. Get the baccalà and whatever\'s on the crostini that morning. Cash only. No seats. Perfection.',
    },
  },
  {
    name: 'Cannaregio',
    vibe: 'Quiet & Residential',
    image: '/images/veneto/sestiere-cannaregio.jpg',
    color: 'text-teal-600',
    paragraphs: [
      'Walk ten minutes north of the train station and you\'ll enter a different Venice entirely. Cannaregio is where Venetians actually live — where laundry hangs between buildings across canals, where old women lean out of windows to gossip, where the local bar doesn\'t have an English menu because it doesn\'t need one.',
      'This sestiere is also home to the Ghetto — the world\'s first Jewish ghetto (the word "ghetto" itself comes from the Venetian word for foundry). Founded in 1516, it\'s a place of extraordinary history and quiet beauty, with its unusually tall buildings (Jews were confined to a small area and built upward) and synagogues that still hold services today.',
    ],
    caesarPick: {
      title: 'Fondamenta della Misericordia at night',
      description: 'A long canal-side strip of bars and restaurants where young Venetians gather after dark. It\'s rowdy, it\'s real, and it\'s the closest thing Venice has to a "going out" street. Try Paradiso Perduto for live jazz and enormous seafood platters.',
    },
  },
  {
    name: 'Castello',
    vibe: 'Green & Unhurried',
    image: '/images/veneto/sestiere-castello.jpg',
    color: 'text-emerald-600',
    paragraphs: [
      'The largest sestiere stretches from the grand Arsenale — once the most powerful shipyard in the world, where Venice built a warship a day at its peak — all the way to the Biennale gardens and the quiet residential streets that tourists never reach. This is where Venice breathes.',
      'Via Garibaldi, the widest street in Venice (technically it\'s the only real "street"), hosts a daily market where you can buy produce, fish, and cheese from vendors who\'ve worked the same stalls for generations. Beyond it, the Giardini della Biennale host the world\'s most prestigious art exhibition every two years — and in the off-years, they\'re simply a beautiful park where locals walk their dogs.',
    ],
    caesarPick: {
      title: 'Via Garibaldi market street',
      description: 'Venice\'s only proper street, lined with fruit stalls, fish vendors, and bakeries. Grab a tramezzino from the bar on the corner, sit on the bench by the canal, and watch Castello\'s residents go about their morning. Not a selfie stick in sight.',
    },
  },
  {
    name: 'Santa Croce',
    vibe: 'The Gateway & Local Hub',
    image: '/images/veneto/sestiere-santa-croce.jpg',
    color: 'text-indigo-600',
    paragraphs: [
      'Santa Croce is where the car meets the boat. It\'s home to Piazzale Roma — the last point where wheels touch Venetian soil — and the gateway through which most visitors pass without stopping. Their loss. Because once you step away from the bus station, Santa Croce reveals itself as one of the most genuinely lived-in corners of the city.',
      'This sestiere has no blockbuster attractions, and that\'s precisely its charm. It has quiet campos where children play football against medieval walls, neighborhood trattorias where the menu changes daily based on what the cook found at the market, and the hidden Giardino Papadopoli — a small park that most guidebooks don\'t mention, where old men play cards under the trees.',
    ],
    caesarPick: {
      title: 'Giardino Papadopoli — the hidden park',
      description: 'One of Venice\'s only green spaces, tucked behind Piazzale Roma where no tourist ever ventures. Benches, shade trees, a fountain, and absolute silence. The perfect antidote to Venetian sensory overload.',
    },
  },
];

/* ── Stat Counter Row ── */
interface StatProps {
  end: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

function StatCounter({ end, label, suffix = '', prefix = '' }: StatProps) {
  const { count, elementRef } = useCountUp(end, 2000);
  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className="text-center px-3">
      <p className="text-2xl md:text-4xl font-bold text-foreground tabular-nums">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ── Sestiere Card ── */
function SestiereCard({ s, isActive, onClick }: { s: Sestiere; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full text-left rounded-xl overflow-hidden border transition-all duration-300',
        isActive
          ? 'border-primary/40 shadow-lg ring-2 ring-primary/20'
          : 'border-border/40 hover:border-primary/30 hover:shadow-md'
      )}
    >
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img
          src={s.image}
          alt={`${s.name} sestiere, Venice`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h4 className="text-lg font-bold text-white">{s.name}</h4>
          <span className="text-xs text-white/80 italic">{s.vibe}</span>
        </div>
      </div>
    </button>
  );
}

/* ── Main Component ── */
export default function VeniceSerenissima() {
  const [activeSestiere, setActiveSestiere] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const active = sestieri[activeSestiere];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Hero Image ── */}
        <div className={cn(
          'relative rounded-2xl overflow-hidden mb-12 transition-all duration-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <img
            src="/images/veneto/venice-hero.jpg"
            alt="Venice Grand Canal at golden hour with gondolas"
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 md:left-10">
            <p className="text-white/70 text-xs uppercase tracking-[0.3em] mb-2">A Venice Tribute</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white italic">La Serenissima</h2>
            <p className="text-white/80 text-sm md:text-base mt-1">Lost & Found</p>
          </div>
          {/* Decorative Lion watermark */}
          <svg className="absolute top-4 right-4 w-16 h-16 md:w-24 md:h-24 text-white/10" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 C30 10 15 25 15 45 C15 55 20 63 28 68 L22 90 L38 80 L50 90 L62 80 L78 90 L72 68 C80 63 85 55 85 45 C85 25 70 10 50 10 Z M35 40 C37.5 40 40 42.5 40 45 C40 47.5 37.5 50 35 50 C32.5 50 30 47.5 30 45 C30 42.5 32.5 40 35 40 Z M65 40 C67.5 40 70 42.5 70 45 C70 47.5 67.5 50 65 50 C62.5 50 60 47.5 60 45 C60 42.5 62.5 40 65 40 Z M50 65 C44 65 39 60 39 55 L61 55 C61 60 56 65 50 65 Z" />
          </svg>
        </div>

        {/* ── Editorial Essay ── */}
        <div className={cn(
          'max-w-3xl mx-auto mb-16 space-y-6 transition-all duration-700 delay-200',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <p className="text-lg md:text-xl leading-relaxed text-foreground/90">
            For 1,100 years — from 697 to 1797 — the Most Serene Republic of Venice was the greatest maritime power the world had ever seen. A city built on 118 islands, connected by 435 bridges, governed by elected doges in a system so stable it outlasted every empire on the continent. Venice invented modern banking, pioneered diplomatic intelligence, controlled the spice trade, and built an arsenal that could produce a fully equipped warship in a single day.
          </p>
          <p className="text-lg md:text-xl leading-relaxed text-foreground/90">
            Then Napoleon arrived. Then the tourists. The population that once stood at 175,000 in the 1950s has collapsed to under 50,000 today — and dropping. Thirty million visitors a year now flood a city built for a fraction of that number. Venice has become the world's most beautiful theme park: a €5 entry fee at the gates, cruise ships the size of apartment blocks in the Giudecca Canal, and locals who can't afford rent because every apartment is an Airbnb.
          </p>
          <p className="text-lg md:text-xl leading-relaxed text-foreground/90">
            And yet. <em>And yet.</em> Get lost in a calle at dusk — and you will get lost, because Venice was designed to confuse invaders — and something happens. You turn a corner and stumble into a campo where an old man plays accordion to no one in particular. The light on the lagoon at golden hour turns the water into hammered copper. A gondolier sings — not for tourists, but because his father sang, and his father's father. The MOSE flood barriers rise and fall with the tides, a €6 billion bet that this impossible city will survive another century.
          </p>
          <p className="text-lg md:text-xl leading-relaxed text-foreground/90 italic">
            Venice is dying. Venice is sinking. Venice is the most overtouristed city on earth. And Venice is still, without question, the most magical, mysterious, heartbreaking, and beautiful place human beings have ever built. The trick is knowing where to look.
          </p>
        </div>

        {/* ── Venice by the Numbers ── */}
        <div className={cn(
          'grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 py-10 px-6 rounded-xl bg-muted/40 border border-border/30 mb-16 transition-all duration-700 delay-300',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <StatCounter end={49000} label="Population today" />
          <StatCounter end={30} label="Annual tourists" suffix="M" />
          <StatCounter end={118} label="Islands" />
          <StatCounter end={435} label="Bridges" />
          <StatCounter end={1100} label="Years a Republic" />
        </div>

        {/* ── Sestieri Explorer ── */}
        <div className={cn(
          'transition-all duration-700 delay-400',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-primary" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">Interactive Guide</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-foreground">The Six Sestieri</h3>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Venice is divided into six historic districts, each with a completely different personality. Click to explore the real Venice beyond San Marco.
            </p>
          </div>

          {/* Interactive SVG Map */}
          <SestiereSVGMap activeSestiere={activeSestiere} onSelect={setActiveSestiere} />

          {/* Grid of sestiere cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {sestieri.map((s, i) => (
              <SestiereCard key={s.name} s={s} isActive={i === activeSestiere} onClick={() => setActiveSestiere(i)} />
            ))}
          </div>

          {/* Expanded detail panel */}
          <div className="rounded-xl border border-border/40 bg-card p-6 md:p-10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className={cn('w-5 h-5', active.color)} />
              <span className={cn('text-xs font-semibold uppercase tracking-wider', active.color)}>{active.vibe}</span>
            </div>
            <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{active.name}</h4>

            <div className="grid md:grid-cols-[1fr_280px] gap-8">
              <div className="space-y-4">
                {active.paragraphs.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-foreground/85">{p}</p>
                ))}
              </div>

              {/* Caesar's Pick */}
              <div className="rounded-lg bg-muted/50 border border-border/30 p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">🏛️ Caesar's Pick</p>
                <p className="font-bold text-foreground mb-2">{active.caesarPick.title}</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{active.caesarPick.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Getting Around Venice ── */}
        <GettingAroundVenice />

        {/* ── Closing Pull Quote ── */}
        <div className={cn(
          'text-center mt-16 max-w-2xl mx-auto transition-all duration-700 delay-500',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <blockquote className="text-xl md:text-2xl italic text-foreground/80 leading-relaxed">
            "Venice is like eating an entire box of chocolate liqueurs in one go."
          </blockquote>
          <cite className="text-sm text-muted-foreground mt-3 block not-italic">— Truman Capote</cite>
        </div>

      </div>
    </section>
  );
}
