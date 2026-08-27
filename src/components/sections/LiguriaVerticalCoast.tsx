import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Waves, Building2, Grape, Trees, Mountain } from 'lucide-react';

type Band = {
  id: string;
  name: string;
  altitude: string;
  icon: typeof Waves;
  image: string;
  imageAlt: string;
  line: string;
  price: string;
  car: string;
  sun: string;
  reality: string;
};

const bands: Band[] = [
  {
    id: 'sea',
    name: 'The waterline',
    altitude: '0–20 m',
    icon: Waves,
    image: '/images/liguria/alassio.jpg',
    imageAlt: 'The seafront promenade and beach at Alassio on the Riviera di Ponente',
    line: 'Promenade, beach concessions, the port and the coastal railway — all packed into a strip 200 metres deep.',
    price: 'Highest per square metre in the region; sea view doubles it.',
    car: 'You can live without one. Trains every 20–30 minutes along the whole coast.',
    sun: 'Humid, mild winters. Salt on everything, including the car.',
    reality: 'Everything you need is walkable, but you share August with the whole of Piedmont and Lombardy.',
  },
  {
    id: 'caruggi',
    name: 'Caruggi and centro storico',
    altitude: '10–80 m',
    icon: Building2,
    image: '/images/liguria/genova-caruggi.jpg',
    imageAlt: 'The historic centre of Genoa seen from the water',
    line: 'Vertical stone alleys where nothing wider than a scooter passes and the shutters are three metres apart.',
    price: 'The bargain band — big flats in old buildings, often needing full renovation.',
    car: 'A car is a liability. Parking is a permit lottery or 150 euro a month in a garage.',
    sun: 'Shaded and cool in summer, damp on the ground floors in winter.',
    reality: 'Buy above the second floor, ask about umidità di risalita, and check who else lives in the building.',
  },
  {
    id: 'terraces',
    name: 'The terraces',
    altitude: '80–350 m',
    icon: Grape,
    image: '/images/liguria/coast-terrazze.jpg',
    imageAlt: 'Dry-stone terraced vineyards above the Cinque Terre coast',
    line: 'Dry-stone walls — thousands of kilometres of them — holding vines, olives and lemon trees to the slope.',
    price: 'Sea view without seafront pricing, if you accept the steps.',
    car: 'Essential, plus nerves for the hairpins. Some houses are reachable only on foot or by monorack.',
    sun: 'Best light in Liguria: sun all day, breeze off the water, no fog.',
    reality: 'A terraced garden is a second job. Wall maintenance (muretti a secco) is a real annual cost.',
  },
  {
    id: 'chestnut',
    name: 'Chestnut and oak belt',
    altitude: '350–900 m',
    icon: Trees,
    image: '/images/liguria/coast-castagneti.jpg',
    imageAlt: 'Chestnut woodland in the Ligurian hinterland',
    line: 'Ten minutes inland and thirty years back: stone villages, chestnut woods, wild boar and empty houses.',
    price: 'The cheapest habitable property in northern Italy sits here.',
    car: 'Two cars, honestly. Buses exist but run for the school day.',
    sun: 'Real winters, occasional snow, and eight degrees cooler than the beach in August.',
    reality: 'Check the distance to the nearest pharmacy and hospital before falling for the price per square metre.',
  },
  {
    id: 'ridge',
    name: 'The ridge — Alta Via',
    altitude: '900–2,200 m',
    icon: Mountain,
    image: '/images/liguria/coast-altavia.jpg',
    imageAlt: 'The Ligurian Apennine ridge in winter',
    line: 'The Alta Via dei Monti Liguri runs 440 km from Ventimiglia to Ceparana with the sea on one side and Piedmont on the other.',
    price: 'Refuges and seasonal houses; not a place to buy for daily living.',
    car: 'Access roads close in snow. This is a destination, not an address.',
    sun: 'Alpine air an hour from the beach — the reason Ligurians say they ski and swim the same day.',
    reality: 'Best used as your back garden: day hikes, trail running, mountain biking and a whole different climate.',
  },
];

export default function LiguriaVerticalCoast() {
  const [activeIndex, setActiveIndex] = useState(2);
  const band = bands[activeIndex];
  if (!band) return null;
  const Icon = band.icon;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Liguria</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Vertical Coast</h2>
          <p className="text-lg text-muted-foreground">
            Liguria is barely thirty kilometres deep and rises to over two thousand metres. Where you live is less
            about which town than about which band of the slope. Climb it.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-5">
          {/* Ladder */}
          <div className="lg:col-span-2 flex flex-col-reverse gap-2">
            {bands.map((b, i) => {
              const BIcon = b.icon;
              const on = i === activeIndex;
              return (
                <button
                  key={b.id}
                  onClick={() => setActiveIndex(i)}
                  aria-pressed={on}
                  className={cn(
                    'group flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300',
                    on
                      ? 'bg-primary text-primary-foreground shadow-soft scale-[1.02]'
                      : 'bg-card ring-1 ring-border hover:ring-primary/50'
                  )}
                  style={{ marginLeft: `${i * 6}%` }}
                >
                  <span
                    className={cn(
                      'rounded-xl p-2',
                      on ? 'bg-primary-foreground/15' : 'bg-primary/10 text-primary'
                    )}
                  >
                    <BIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-sm leading-tight">{b.name}</span>
                    <span className={cn('block text-[11px]', on ? 'opacity-80' : 'text-muted-foreground')}>
                      {b.altitude}
                    </span>
                  </span>
                </button>
              );
            })}
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground pl-1">Sea level ↑ ridge</p>
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.article
                key={band.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border"
              >
                <div className="relative h-56 md:h-72">
                  <img src={band.image} alt={band.imageAlt} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-center gap-3">
                      <span className="rounded-xl bg-background/15 p-2 ring-1 ring-background/25 backdrop-blur-sm">
                        <Icon className="h-5 w-5 text-background" />
                      </span>
                      <div>
                        <h3 className="text-2xl font-bold text-background leading-tight">{band.name}</h3>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-background/70">{band.altitude}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-base leading-relaxed">{band.line}</p>
                  <dl className="grid gap-3 sm:grid-cols-3">
                    {[
                      { k: 'Price', v: band.price },
                      { k: 'Car', v: band.car },
                      { k: 'Climate', v: band.sun },
                    ].map((row) => (
                      <div key={row.k} className="rounded-2xl bg-muted/50 p-3">
                        <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">{row.k}</dt>
                        <dd className="text-sm leading-snug">{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold mb-1">
                      What nobody tells you
                    </p>
                    <p className="text-sm leading-relaxed">{band.reality}</p>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
