import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { seasonPhases } from './trentinoData';
import seasonSki from '@/assets/trentino/season-ski.jpg';
import seasonQuiet from '@/assets/trentino/season-quiet.jpg';
import seasonLakes from '@/assets/trentino/season-lakes.jpg';
import seasonTorggelen from '@/assets/trentino/season-torggelen.jpg';
import seasonMarkets from '@/assets/trentino/christmas-market.jpg';

const seasonImages: Record<string, string> = {
  winter: seasonSki,
  mud: seasonQuiet,
  summer: seasonLakes,
  autumn: seasonTorggelen,
  markets: seasonMarkets,
};

const toneStyle: Record<string, string> = {
  Peak: 'bg-destructive/10 text-destructive border-destructive/30',
  Busy: 'bg-primary/10 text-primary border-primary/30',
  Dead: 'bg-muted text-muted-foreground border-border',
  Best: 'bg-primary text-primary-foreground border-primary',
};

export default function TrentinoSeasonClock() {
  const [active, setActive] = useState(seasonPhases.length - 1);
  const phase = seasonPhases[active];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">The year, honestly</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Five Seasons, Not Four</h2>
          <p className="text-lg text-muted-foreground">
            A mountain economy swings hard. Knowing which weeks your town is packed, dead, expensive or perfect is
            the difference between loving it here and feeling ambushed twice a year.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Timeline */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {seasonPhases.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs font-semibold transition-all',
                  i === active
                    ? 'bg-primary text-primary-foreground border-primary shadow-soft'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                )}
              >
                {p.name}
                <span className="ml-2 font-normal opacity-75">{p.months}</span>
              </button>
            ))}
          </div>

          <div className="rounded-3xl overflow-hidden border border-border bg-background shadow-soft">
            <div className="grid md:grid-cols-2">
              <div className="relative h-56 md:h-auto md:min-h-[360px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={phase.id}
                    src={seasonImages[phase.id]}
                    alt={phase.imageAlt}
                    loading="lazy"
                    width={1600}
                    height={900}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-foreground/70 to-transparent pointer-events-none" />
              </div>

              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={cn('rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]', toneStyle[phase.tone])}>
                        {phase.tone}
                      </span>
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{phase.months}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">{phase.name}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-5">{phase.body}</p>
                    <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 flex gap-3">
                      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">If you live here: </strong>
                        {phase.living}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Year bar */}
          <div className="mt-6 rounded-2xl border border-border bg-background p-5 shadow-soft">
            <div className="flex h-3 rounded-full overflow-hidden">
              {seasonPhases.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${p.name}`}
                  className={cn(
                    'flex-1 transition-all',
                    i === active ? 'bg-primary' : 'bg-muted hover:bg-primary/40'
                  )}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span>Dec</span><span>Apr</span><span>Jul</span><span>Sep</span><span>Dec</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
