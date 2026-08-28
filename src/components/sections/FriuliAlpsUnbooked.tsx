import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mountain, Bike, Snowflake, ExternalLink, AlertTriangle } from 'lucide-react';
import { alpPlaces, alpineTruths, alpeAdria, type AlpKind } from './friuliCityAlpsData';

const filters: { id: AlpKind | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'ski', label: 'Snow' },
  { id: 'hike', label: 'Walking' },
  { id: 'lake', label: 'Water' },
  { id: 'village', label: 'Places to live' }
];

export default function FriuliAlpsUnbooked() {
  const [filter, setFilter] = useState<AlpKind | 'all'>('all');
  const [leg, setLeg] = useState(0);

  const places = filter === 'all' ? alpPlaces : alpPlaces.filter((p) => p.kinds.includes(filter));
  if (!alpPlaces.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Mountain className="h-10 w-10 mx-auto mb-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Friuli-Venezia Giulia</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Alps Nobody Books</h2>
          <p className="text-lg text-muted-foreground">
            Half of this region is mountain — the Julians and the Carnic Alps — and almost nobody outside Italy has heard
            of any of it. Same rock as the Dolomites, a third of the traffic, and prices to match.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all ring-1',
                filter === f.id
                  ? 'bg-primary text-primary-foreground ring-primary shadow-soft'
                  : 'bg-background text-muted-foreground ring-border hover:text-foreground'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {places.map((p, idx) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
              className="rounded-3xl overflow-hidden bg-background ring-1 ring-border shadow-soft flex flex-col"
            >
              <div className="relative">
                <img src={p.image} alt={p.imageAlt} loading="lazy" className="h-44 w-full object-cover" />
                <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold ring-1 ring-border">
                  {p.altitude}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">{p.area}</p>
                <p className="text-sm leading-relaxed mb-3">{p.what}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.practical}</p>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    More information <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Alpe Adria cycle route */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 ring-1 ring-border p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Bike className="h-5 w-5 text-primary" />
              <h3 className="text-2xl md:text-3xl font-bold">{alpeAdria.title}</h3>
            </div>
            <p className="text-muted-foreground mb-6">{alpeAdria.summary}</p>

            <div className="relative mb-6">
              <div className="h-1.5 rounded-full bg-border" />
              <div
                className="absolute top-0 h-1.5 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${((leg + 1) / alpeAdria.legs.length) * 100}%` }}
              />
              <div className="flex justify-between mt-3 gap-2">
                {alpeAdria.legs.map((l, idx) => (
                  <button
                    key={l.name}
                    onClick={() => setLeg(idx)}
                    aria-pressed={idx === leg}
                    className={cn(
                      'flex-1 rounded-2xl px-2 py-2 text-[11px] md:text-xs font-medium transition-all ring-1',
                      idx === leg
                        ? 'bg-primary text-primary-foreground ring-primary'
                        : 'bg-background text-muted-foreground ring-border hover:text-foreground'
                    )}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-background ring-1 ring-border p-5">
              <p className="text-sm font-semibold text-primary mb-1">{alpeAdria.legs[leg].km}</p>
              <p className="text-sm leading-relaxed">{alpeAdria.legs[leg].note}</p>
            </div>

            <p className="text-sm text-muted-foreground mt-4">{alpeAdria.practical}</p>
            <a
              href={alpeAdria.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Route details and stages <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Winter truths */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Snowflake className="h-5 w-5 text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold text-center">Living up here, honestly</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {alpineTruths.map((t) => (
              <div key={t.title} className="rounded-2xl bg-background ring-1 ring-border p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">{t.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
