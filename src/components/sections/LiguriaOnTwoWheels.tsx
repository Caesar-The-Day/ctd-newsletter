import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Bike,
  Mountain,
  TrainFront,
  ArrowUpRight,
  MapPin,
  Route as RouteIcon,
  CalendarRange,
} from 'lucide-react';
import {
  coastSegments,
  rideTypes,
  seasonBands,
  practicalities,
} from './liguriaCyclingData';

const verdictStyles: Record<string, string> = {
  best: 'bg-primary text-primary-foreground',
  good: 'bg-primary/25 text-foreground',
  mixed: 'bg-muted text-muted-foreground',
  avoid: 'bg-destructive/15 text-destructive',
};

export default function LiguriaOnTwoWheels() {
  const [segment, setSegment] = useState(0);
  const [ride, setRide] = useState(0);

  const seg = coastSegments[segment];
  const type = rideTypes[ride];
  if (!seg || !type) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Liguria</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Liguria on Two Wheels</h2>
          <p className="text-lg text-muted-foreground">
            One region, two entirely different cycling lives: a flat seaside railway line anyone can ride, and
            limestone hills that made Finale Ligure the mountain-bike capital of Europe. Both start at the same
            front door.
          </p>
        </div>

        {/* 1. Coastal cycleway */}
        <div className="max-w-6xl mx-auto mb-20">
          <header className="flex items-center gap-3 mb-6">
            <span className="rounded-xl bg-primary/10 p-2 text-primary">
              <Bike className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-2xl font-bold leading-tight">The Ponente cycleway</h3>
              <p className="text-sm text-muted-foreground">
                24 km of old Genoa–Ventimiglia railway, flat, car-free, sea the whole way.
              </p>
            </div>
          </header>

          {/* Rail-line strip */}
          <div className="relative mb-8 overflow-x-auto pb-2 pt-1">
            <div className="relative flex min-w-[640px] items-start">
              <div className="absolute left-0 right-0 top-[17px] h-[3px] rounded-full bg-border" />
              {coastSegments.map((s, i) => {
                const on = i === segment;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSegment(i)}
                    aria-pressed={on}
                    className="group relative flex flex-1 flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={cn(
                        'relative z-10 flex h-7 w-7 items-center justify-center rounded-full ring-2 transition-all duration-300',
                        on
                          ? 'bg-primary text-primary-foreground ring-primary scale-110'
                          : 'bg-card text-muted-foreground ring-border group-hover:ring-primary/60'
                      )}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <span
                      className={cn(
                        'px-1 text-[11px] leading-tight transition-colors',
                        on ? 'font-semibold text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {s.name}
                      <span className="block text-[10px] opacity-70">{s.km}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={seg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-0 overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border md:grid-cols-2"
            >
              <div className="relative h-56 md:h-full md:min-h-[320px]">
                <img src={seg.image} alt={seg.imageAlt} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent md:bg-gradient-to-r" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h4 className="text-xl font-bold text-background">{seg.name}</h4>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-background/75">{seg.km}</p>
                </div>
              </div>
              <div className="space-y-3 p-6">
                {[
                  { k: 'Surface', v: seg.surface },
                  { k: 'Getting there', v: seg.access },
                  { k: 'Hire', v: seg.rental },
                  { k: 'Along the way', v: seg.stops },
                ].map((row) => (
                  <div key={row.k}>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{row.k}</p>
                    <p className="text-sm leading-snug">{row.v}</p>
                  </div>
                ))}
                <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-4">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    What it is actually like
                  </p>
                  <p className="text-sm leading-relaxed">{seg.honesty}</p>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* 2. Ride-type dial */}
        <div className="max-w-6xl mx-auto mb-20">
          <header className="flex items-center gap-3 mb-6">
            <span className="rounded-xl bg-primary/10 p-2 text-primary">
              <RouteIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-2xl font-bold leading-tight">What kind of rider are you?</h3>
              <p className="text-sm text-muted-foreground">Pick a profile and see the routes that actually suit it.</p>
            </div>
          </header>

          <div className="mb-6 flex flex-wrap gap-2">
            {rideTypes.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setRide(i)}
                aria-pressed={i === ride}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300',
                  i === ride
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-card ring-1 ring-border text-muted-foreground hover:ring-primary/50'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-5 max-w-2xl text-base text-muted-foreground">{type.blurb}</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {type.routes.map((r) => (
                  <article
                    key={r.name}
                    className="group overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.imageAlt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm">
                        {r.where}
                      </span>
                    </div>
                    <div className="space-y-3 p-5">
                      <h4 className="text-lg font-bold leading-tight">{r.name}</h4>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {[r.distance, `${r.ascent} up`, r.surface].map((chip) => (
                          <span key={chip} className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                            {chip}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{r.note}</p>
                      {r.link && (
                        <a
                          href={r.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          {r.link.label}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. Finale panel */}
        <div className="max-w-6xl mx-auto mb-20 overflow-hidden rounded-3xl ring-1 ring-border">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[260px]">
              <img
                src="/images/liguria/cycling-finale-trails.jpg"
                alt="Finale Ligure and the limestone hills that carry its mountain-bike trails"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="bg-card p-7 md:p-9">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Mountain className="h-3.5 w-3.5" /> Finale Ligure
              </span>
              <h3 className="mb-3 text-2xl font-bold md:text-3xl">The town that mountain biking built</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Finale is not a place with some trails. It is a year-round economy of shuttle vans, bike hotels,
                workshops and 200-plus marked descents dropping off the Manie plateau and the old NATO base to the
                sea. Riders arrive from Britain and Germany in March and again in October, and the town lives on it.
              </p>
              <dl className="mb-5 grid gap-3 sm:grid-cols-2">
                {[
                  { k: 'Season', v: 'March–May and September–November. July is too hot to ride hard.' },
                  { k: 'Rock', v: 'Finale limestone — grippy dry, glass when wet. Give it a day after rain.' },
                  { k: 'Access', v: 'Commercial shuttles daily in season; pedal-up loops from Finalborgo any day.' },
                  { k: 'Support', v: 'A trail pass funds the volunteers who cut and repair the network.' },
                ].map((row) => (
                  <div key={row.k} className="rounded-2xl bg-muted/50 p-3">
                    <dt className="mb-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{row.k}</dt>
                    <dd className="text-sm leading-snug">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href="https://www.finaleoutdoor.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Finale Outdoor Region
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 4. Season band */}
        <div className="max-w-6xl mx-auto mb-20">
          <header className="flex items-center gap-3 mb-6">
            <span className="rounded-xl bg-primary/10 p-2 text-primary">
              <CalendarRange className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-2xl font-bold leading-tight">When to ride what</h3>
              <p className="text-sm text-muted-foreground">
                The coast and the hills have opposite calendars. Learn both and you ride twelve months a year.
              </p>
            </div>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {seasonBands.map((b) => (
              <div key={b.months} className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold">{b.months}</p>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]',
                      verdictStyles[b.verdict]
                    )}
                  >
                    {b.verdict}
                  </span>
                </div>
                <p className="mb-2 flex gap-2 text-sm leading-snug">
                  <Bike className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{b.coast}</span>
                </p>
                <p className="flex gap-2 text-sm leading-snug text-muted-foreground">
                  <Mountain className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{b.hills}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Practicalities */}
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center gap-3 mb-6">
            <span className="rounded-xl bg-primary/10 p-2 text-primary">
              <TrainFront className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-2xl font-bold leading-tight">The practical bit nobody tells you</h3>
              <p className="text-sm text-muted-foreground">Trains, theft, gradients and where the bike actually sleeps.</p>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {practicalities.map((p) => (
              <div key={p.title} className="rounded-3xl bg-muted/40 p-6 ring-1 ring-border">
                <h4 className="mb-2 text-base font-bold">{p.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                {p.link && (
                  <a
                    href={p.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    {p.link.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
