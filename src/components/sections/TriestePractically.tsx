import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Building2, Wind, Euro, ThumbsUp, ThumbsDown, TrainFront } from 'lucide-react';
import { rioni, triesteFacts, triesteCosts, triesteTruths } from './friuliCityAlpsData';

export default function TriestePractically() {
  const [id, setId] = useState(rioni[0].id);
  const r = rioni.find((x) => x.id === id);
  if (!r) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Building2 className="h-10 w-10 mx-auto mb-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Friuli-Venezia Giulia</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Trieste, Practically</h2>
          <p className="text-lg text-muted-foreground">
            The region has one real city, and most people who move here land in it. Here is what living in it costs,
            which district suits which life, and what nobody puts in the brochure.
          </p>
        </div>

        {/* Facts strip */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {triesteFacts.map((f) => (
            <div key={f.label} className="rounded-2xl bg-background ring-1 ring-border p-4 text-center shadow-soft">
              <p className="text-2xl md:text-3xl font-bold text-primary">{f.value}</p>
              <p className="text-xs font-semibold mt-1">{f.label}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{f.note}</p>
            </div>
          ))}
        </div>

        {/* Rione explorer */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-2">Where in the city?</h3>
          <p className="text-center text-muted-foreground mb-6">
            Trieste is small but stratified — sea level to 350 m in twenty minutes, and the wind changes with it.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {rioni.map((x) => (
              <button
                key={x.id}
                onClick={() => setId(x.id)}
                aria-pressed={x.id === id}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all ring-1',
                  x.id === id
                    ? 'bg-primary text-primary-foreground ring-primary shadow-soft'
                    : 'bg-background text-muted-foreground ring-border hover:text-foreground'
                )}
              >
                {x.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-0 md:grid-cols-5 rounded-3xl overflow-hidden bg-background ring-1 ring-border shadow-soft"
            >
              <figure className="relative m-0 md:col-span-2">
                <img src={r.image} alt={r.imageAlt} loading="lazy" className="h-56 md:h-full w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/90 to-transparent p-5">
                  <h4 className="text-xl font-bold text-background">{r.name}</h4>
                  <p className="text-xs text-background/80">{r.tag}</p>
                </figcaption>
              </figure>

              <div className="md:col-span-3 p-6 md:p-8">
                <div className="grid sm:grid-cols-3 gap-3 mb-5">
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Rent</p>
                    <p className="text-sm font-semibold">{r.rent}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Buy</p>
                    <p className="text-sm font-semibold">{r.buy}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Wind className="h-3 w-3" /> Bora exposure
                    </p>
                    <div className="flex gap-1 mt-1.5" aria-label={`Bora exposure ${r.bora} of 3`}>
                      {[1, 2, 3].map((n) => (
                        <span
                          key={n}
                          className={cn('h-2 flex-1 rounded-full', n <= r.bora ? 'bg-primary' : 'bg-border')}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm mb-2"><span className="font-semibold">Getting about: </span>{r.lift}</p>
                <p className="text-sm text-muted-foreground mb-5"><span className="font-semibold text-foreground">Suits: </span>{r.who}</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    {r.good.map((g) => (
                      <li key={g} className="flex gap-2 text-sm">
                        <ThumbsUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2">
                    {r.bad.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                        <ThumbsDown className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Costs */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="rounded-3xl bg-background ring-1 ring-border shadow-soft p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <Euro className="h-5 w-5 text-primary" />
              <h3 className="text-xl md:text-2xl font-bold">What the city actually costs</h3>
            </div>
            <ul className="divide-y divide-border">
              {triesteCosts.map((c) => (
                <li key={c.item} className="py-3 flex flex-wrap items-baseline justify-between gap-2">
                  <div className="min-w-[60%]">
                    <p className="text-sm font-medium">{c.item}</p>
                    <p className="text-xs text-muted-foreground">{c.note}</p>
                  </div>
                  <p className="text-base font-bold text-primary">{c.cost}</p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              Indicative 2026 figures for a couple; central sea-view apartments and August lets sit well above these bands.
            </p>
          </div>
        </div>

        {/* Truths */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">The honest ledger</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {triesteTruths.map((t) => (
              <div
                key={t.title}
                className={cn(
                  'rounded-2xl p-5 ring-1',
                  t.tone === 'good' ? 'bg-primary/5 ring-primary/20' : 'bg-background ring-border'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {t.tone === 'good' ? (
                    <ThumbsUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <h4 className="font-semibold">{t.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="max-w-3xl mx-auto text-center text-sm text-muted-foreground mt-8 inline-flex items-center gap-2 justify-center w-full">
            <TrainFront className="h-4 w-4" />
            Venice is two hours by train, Ljubljana ninety minutes by bus, Vienna six hours on rails.
          </p>
        </div>
      </div>
    </section>
  );
}
