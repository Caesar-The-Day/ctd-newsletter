import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { History, ExternalLink, Flag } from 'lucide-react';
import { borderStops, warRoute } from './friuliIdentityData';

export default function FriuliBorderTimeline() {
  const [i, setI] = useState(borderStops.length - 1);
  const stop = borderStops[i];
  if (!stop) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <History className="h-10 w-10 mx-auto mb-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Friuli-Venezia Giulia</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Border That Moved</h2>
          <p className="text-lg text-muted-foreground">
            People still living here have needed a passport, a permit, a visa and finally nothing at all to walk to the
            same bakery. Drag through the century and watch the frontier slide.
          </p>
        </div>

        {/* Moving border diagram */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 ring-1 ring-border p-5 md:p-8 overflow-hidden">
            <svg viewBox="0 0 100 44" className="w-full h-32 md:h-44" role="img" aria-label="Diagram of the shifting eastern frontier">
              <text x="4" y="8" className="fill-muted-foreground text-[3.6px]">Veneto</text>
              <text x="30" y="8" className="fill-muted-foreground text-[3.6px]">Udine</text>
              <text x="52" y="8" className="fill-muted-foreground text-[3.6px]">Gorizia</text>
              <text x="68" y="8" className="fill-muted-foreground text-[3.6px]">Trieste</text>
              <text x="86" y="8" className="fill-muted-foreground text-[3.6px]">Slovenia</text>
              {[8, 32, 54, 70, 88].map((x) => (
                <circle key={x} cx={x} cy={26} r="1.4" className="fill-primary/60" />
              ))}
              <line x1="4" y1="26" x2="96" y2="26" className="stroke-border" strokeWidth="0.7" />
              <motion.rect
                animate={{ width: stop.border * 0.92 }}
                transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                x="4"
                y="18"
                height="16"
                rx="2"
                className="fill-primary/15"
              />
              <motion.g animate={{ x: stop.border * 0.92 }} transition={{ type: 'spring', stiffness: 90, damping: 18 }}>
                <line x1="4" y1="14" x2="4" y2="38" className="stroke-primary" strokeWidth="1.4" />
                <circle cx="4" cy="14" r="2" className="fill-primary" />
              </motion.g>
              <text x="4" y="42" className="fill-muted-foreground text-[3.2px]">← Italy</text>
              <text x="82" y="42" className="fill-muted-foreground text-[3.2px]">the other side →</text>
            </svg>

            <input
              type="range"
              min={0}
              max={borderStops.length - 1}
              step={1}
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              aria-label="Year"
              className="w-full mt-3 accent-primary"
            />
            <div className="flex justify-between mt-2 gap-1 overflow-x-auto">
              {borderStops.map((s, idx) => (
                <button
                  key={s.year}
                  onClick={() => setI(idx)}
                  aria-pressed={idx === i}
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
                    idx === i ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {s.year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stop detail */}
        <AnimatePresence mode="wait">
          <motion.article
            key={stop.year}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto grid gap-0 md:grid-cols-5 rounded-3xl overflow-hidden bg-background ring-1 ring-border shadow-soft"
          >
            {stop.image && (
              <div className="md:col-span-2">
                <img src={stop.image} alt={stop.imageAlt ?? stop.title} loading="lazy" className="h-48 md:h-full w-full object-cover" />
              </div>
            )}
            <div className={cn('p-6 md:p-8', stop.image ? 'md:col-span-3' : 'md:col-span-5')}>
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{stop.year}</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Flag className="h-3.5 w-3.5" /> {stop.flag}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">{stop.title}</h3>
              <p className="text-base leading-relaxed mb-3">{stop.summary}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{stop.detail}</p>
            </div>
          </motion.article>
        </AnimatePresence>

        {/* Great War route */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Where the century is still visible</h3>
            <p className="text-muted-foreground">
              Four places within an hour of each other that explain why this landscape feels the way it does. None of
              them is a tourist attraction; all of them are free or nearly so.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {warRoute.map((site) => (
              <article key={site.name} className="rounded-3xl overflow-hidden bg-background ring-1 ring-border shadow-soft flex flex-col">
                {site.image && (
                  <img src={site.image} alt={site.imageAlt ?? site.name} loading="lazy" className="h-44 w-full object-cover" />
                )}
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <h4 className="text-lg font-bold">{site.name}</h4>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">{site.place}</p>
                  <p className="text-sm leading-relaxed mb-3">{site.what}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{site.visit}</p>
                  {site.link && (
                    <a
                      href={site.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      More information <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
