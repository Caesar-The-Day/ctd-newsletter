import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react';
import { yearEvents } from './friuliIdentityData';

const seasonLabel: Record<string, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn'
};

export default function FriuliYear() {
  const [idx, setIdx] = useState(0);
  const ev = yearEvents[idx];
  if (!ev) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <CalendarDays className="h-10 w-10 mx-auto mb-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Friuli-Venezia Giulia</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">A Year in Friuli</h2>
          <p className="text-lg text-muted-foreground">
            Bonfires read for the coming harvest, a Madonna carried across a lagoon, two thousand boats on one start
            line, and Saint Nicholas rather than Santa. The calendar here is Mitteleuropean, not Mediterranean.
          </p>
        </div>

        {/* Month rail */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 justify-start md:justify-center">
            {yearEvents.map((e, i) => (
              <button
                key={`${e.name}-${i}`}
                onClick={() => setIdx(i)}
                aria-pressed={i === idx}
                className={cn(
                  'shrink-0 rounded-2xl px-3 py-2 text-xs font-semibold transition-all ring-1',
                  i === idx
                    ? 'bg-primary text-primary-foreground ring-primary shadow-soft'
                    : 'bg-background text-muted-foreground ring-border hover:text-foreground'
                )}
              >
                {e.short}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={`${ev.name}-${idx}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto grid gap-0 md:grid-cols-5 rounded-3xl overflow-hidden bg-background ring-1 ring-border shadow-soft mb-12"
          >
            {ev.image && (
              <div className="md:col-span-2">
                <img src={ev.image} alt={ev.imageAlt ?? ev.name} loading="lazy" className="h-48 md:h-full w-full object-cover" />
              </div>
            )}
            <div className={cn('p-6 md:p-8', ev.image ? 'md:col-span-3' : 'md:col-span-5')}>
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{ev.month}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{seasonLabel[ev.season]}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{ev.name}</h3>
              <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                <MapPin className="h-3.5 w-3.5" /> {ev.place}
              </p>
              <p className="text-base leading-relaxed">{ev.what}</p>
              {ev.link && (
                <a
                  href={ev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Official information <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </motion.article>
        </AnimatePresence>

        {/* Full year grid */}
        <div className="max-w-6xl mx-auto grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {yearEvents.map((e, i) => (
            <button
              key={`grid-${e.name}-${i}`}
              onClick={() => setIdx(i)}
              className={cn(
                'text-left rounded-2xl p-4 ring-1 transition-all',
                i === idx ? 'bg-primary/5 ring-primary/30' : 'bg-background ring-border hover:ring-primary/30'
              )}
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">{e.month}</p>
              <p className="font-semibold text-sm mt-0.5">{e.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{e.place}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
