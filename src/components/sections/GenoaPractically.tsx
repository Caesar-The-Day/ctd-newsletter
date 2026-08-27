import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpDown, Euro, TriangleAlert, Sparkles } from 'lucide-react';

type Quarter = {
  id: string;
  name: string;
  tag: string;
  price: string;
  priceValue: number; // €/m² for the bar
  who: string;
  upside: string;
  downside: string;
};

const quarters: Quarter[] = [
  {
    id: 'maddalena',
    name: 'Maddalena & the caruggi',
    tag: 'Medieval core',
    price: '1,300–2,200 €/m²',
    priceValue: 1750,
    who: 'Renovators, students, people who want Europe\'s largest medieval centre as a living room.',
    upside: 'Cheapest habitable square metres in any big Italian city, and the Rolli palaces are your neighbours.',
    downside: 'Damp ground floors, no daylight in the lower alleys, and blocks that change character street by street.',
  },
  {
    id: 'carignano',
    name: 'Carignano',
    tag: 'Quiet high ground',
    price: '2,600–3,800 €/m²',
    priceValue: 3200,
    who: 'The classic bourgeois answer: a hill above the old port, ten minutes\' walk from everything.',
    upside: 'Light, air, sea views and calm, without leaving the historic centre.',
    downside: 'Steps everywhere and limited parking; the good flats rarely reach the open market.',
  },
  {
    id: 'foce',
    name: 'Foce & Corso Italia',
    tag: 'Seafront modern',
    price: '3,000–4,500 €/m²',
    priceValue: 3750,
    who: 'Anyone who wants a lift, a garage and a two-kilometre promenade to walk each morning.',
    upside: 'Modern buildings, shops, the fiera, and the flattest walking in Genoa.',
    downside: 'The priciest residential district and the most traffic-exposed.',
  },
  {
    id: 'albaro',
    name: 'Albaro',
    tag: 'Villas and gardens',
    price: '3,200–5,000 €/m²',
    priceValue: 4100,
    who: 'Families and returning Genoese; villas, walled gardens, the university and Boccadasse below.',
    upside: 'Greenest central quarter, excellent schools, and a fishing village at the bottom of the hill.',
    downside: 'You will want a car, and the hill roads clog at school hours.',
  },
  {
    id: 'nervi',
    name: 'Nervi',
    tag: 'Seaside suburb',
    price: '2,800–4,200 €/m²',
    priceValue: 3500,
    who: 'The retirement pick inside the city limits — parks, a cliff promenade and its own station.',
    upside: 'Feels like a Riviera town but keeps you inside Genoa\'s services and hospitals.',
    downside: '25–30 minutes to the centre, and summer weekends bring the whole city to your promenade.',
  },
  {
    id: 'righi',
    name: 'Righi & the hill forts',
    tag: 'Above the city',
    price: '1,600–2,600 €/m²',
    priceValue: 2100,
    who: 'People who want a garden, a view of the whole gulf, and a funicular instead of a commute.',
    upside: 'Cool in summer, ringed by seventeenth-century forts and hiking straight from the door.',
    downside: 'Utterly dependent on the funicular or the car; nothing is walkable except the woods.',
  },
];

const lifts = [
  { name: 'Zecca–Righi funicular', detail: 'Six stops, 280 m of climb, runs until midnight', kind: 'Funicular' },
  { name: 'Sant\'Anna funicular', detail: 'The 1891 water-balance line, still in daily service', kind: 'Funicular' },
  { name: 'Castelletto lift', detail: 'Art nouveau cabin to the best terrace in the city', kind: 'Lift' },
  { name: 'Montegalletto lift', detail: 'Runs horizontally, then vertically — an engineering oddity', kind: 'Lift' },
  { name: 'Granarolo rack railway', detail: 'A cremagliera up to the hill villages', kind: 'Rack rail' },
  { name: 'Metro (Brin–Brignole)', detail: 'Eight stations along the valley floor', kind: 'Metro' },
];

const truths = [
  {
    title: 'The single ticket that changes the city',
    body: 'One AMT ticket covers buses, the metro, the funiculars, the public lifts and the rack railway. In Genoa, vertical transport is public transport — and residents over 70 travel free.',
  },
  {
    title: 'Humidity, not cold, is the enemy',
    body: 'Winters are mild, but sea humidity gets into ground and first floors in the old city. Ask for the energy certificate, look for a dehumidified wall treatment, and prefer flats above the third floor.',
  },
  {
    title: 'Parking is the real rent',
    body: 'A box auto in the centre costs 120–200 euro a month and sells for the price of a small studio elsewhere in Italy. Most people who live in the caruggi simply do not own a car.',
  },
  {
    title: 'Healthcare is a strength',
    body: 'San Martino is one of the largest hospital campuses in Europe, and Gaslini is a national paediatric reference. For a region with Italy\'s oldest population, this matters more than the view.',
  },
];

export default function GenoaPractically() {
  const [activeId, setActiveId] = useState('carignano');
  const active = quarters.find((q) => q.id === activeId);
  const maxPrice = Math.max(...quarters.map((q) => q.priceValue));
  if (!active) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Genoa, practically</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">A City You Climb</h2>
          <p className="text-lg text-muted-foreground">
            Six hundred thousand people, a medieval centre bigger than Venice's, and a public transport network that
            includes funiculars and lifts because the streets run out of horizontal. Here is Genoa as an address
            rather than a day trip.
          </p>
        </div>

        {/* Quarters */}
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-5 mb-12">
          <div className="lg:col-span-2 space-y-2">
            {quarters.map((q) => {
              const on = q.id === activeId;
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveId(q.id)}
                  aria-pressed={on}
                  className={cn(
                    'w-full rounded-2xl px-4 py-3 text-left transition-all duration-300',
                    on ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-card ring-1 ring-border hover:ring-primary/50'
                  )}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-sm">{q.name}</span>
                    <span className={cn('text-[11px] shrink-0', on ? 'opacity-80' : 'text-muted-foreground')}>
                      {q.tag}
                    </span>
                  </div>
                  <div className={cn('mt-2 h-1.5 rounded-full', on ? 'bg-primary-foreground/25' : 'bg-muted')}>
                    <motion.div
                      className={cn('h-full rounded-full', on ? 'bg-primary-foreground' : 'bg-primary/60')}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(q.priceValue / maxPrice) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="h-full rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{active.tag}</p>
                <h3 className="text-2xl md:text-3xl font-bold mb-1">{active.name}</h3>
                <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-4">
                  <Euro className="h-3.5 w-3.5" /> {active.price}
                </p>
                <p className="text-base leading-relaxed mb-4">{active.who}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-primary/5 p-4 ring-1 ring-primary/20">
                    <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-primary font-semibold mb-1">
                      <Sparkles className="h-3.5 w-3.5" /> Upside
                    </p>
                    <p className="text-sm leading-relaxed">{active.upside}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/60 p-4">
                    <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-1">
                      <TriangleAlert className="h-3.5 w-3.5" /> Downside
                    </p>
                    <p className="text-sm leading-relaxed">{active.downside}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Vertical transport */}
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 overflow-hidden rounded-3xl shadow-soft">
            <img
              src="/images/liguria/genova-funicolare.jpg"
              alt="A station on the Zecca–Righi funicular in Genoa"
              loading="lazy"
              className="h-full min-h-[240px] w-full object-cover"
            />
          </div>

          <div className="lg:col-span-3 rounded-3xl bg-card p-6 ring-1 ring-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-xl bg-primary/10 p-2 text-primary">
                <ArrowUpDown className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold">Public transport that goes up</h3>
                <p className="text-sm text-muted-foreground">Nine funiculars, lifts and rack lines on one city ticket.</p>
              </div>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {lifts.map((l, i) => (
                <motion.li
                  key={l.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="rounded-2xl bg-muted/50 p-3"
                >
                  <p className="text-sm font-semibold leading-tight">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.detail}</p>
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-primary">
                    {l.kind}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Truths */}
        <div className="max-w-6xl mx-auto mt-6 grid gap-4 md:grid-cols-2">
          {truths.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl bg-card p-5 ring-1 ring-border"
            >
              <h4 className="font-semibold mb-2">{t.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
