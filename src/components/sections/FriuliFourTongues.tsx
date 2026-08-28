import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Languages, MapPin, GraduationCap, Quote } from 'lucide-react';
import { tongues } from './friuliIdentityData';

export default function FriuliFourTongues() {
  const [active, setActive] = useState(tongues[0].id);
  const t = tongues.find((x) => x.id === active);
  if (!t) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Languages className="h-10 w-10 mx-auto mb-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Friuli-Venezia Giulia</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Four Tongues, One Region</h2>
          <p className="text-lg text-muted-foreground">
            Italian, Friulian, Slovene and German are all spoken here — three of them with legal protection. No other
            Italian region asks you to work out which language the next village uses.
          </p>
        </div>

        {/* Schematic region strip */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 ring-1 ring-border p-4 md:p-6">
            <svg viewBox="0 0 100 100" className="w-full h-40 md:h-56" role="img" aria-label="Schematic map of Friuli-Venezia Giulia language areas">
              {/* stylised region outline */}
              <path
                d="M8 34 L26 8 L52 6 L74 14 L92 26 L94 52 L84 68 L92 84 L74 94 L52 86 L30 88 L14 70 Z"
                className="fill-primary/5 stroke-primary/30"
                strokeWidth="0.8"
              />
              <path d="M8 34 L26 8 L52 6 L74 14 L92 26" className="fill-none stroke-primary/40" strokeWidth="1.4" strokeDasharray="3 2" />
              {tongues.map((z) => {
                const on = z.id === active;
                return (
                  <g key={z.id} onClick={() => setActive(z.id)} className="cursor-pointer">
                    <circle cx={z.x} cy={z.y} r={on ? 9 : 6} className={cn('transition-all', on ? 'fill-primary/30' : 'fill-primary/10')} />
                    <circle cx={z.x} cy={z.y} r={on ? 3.4 : 2.4} className={cn('transition-all', on ? 'fill-primary' : 'fill-primary/50')} />
                    <text
                      x={z.x}
                      y={z.y - (on ? 12 : 9)}
                      textAnchor="middle"
                      className={cn('text-[4px] font-semibold transition-all', on ? 'fill-foreground' : 'fill-muted-foreground')}
                    >
                      {z.nativeName.split(' / ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="text-center text-xs text-muted-foreground">
              Schematic, not to scale — sea to the south-east, Austria to the north, Slovenia to the east.
            </p>
          </div>
        </div>

        {/* Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tongues.map((z) => (
            <button
              key={z.id}
              onClick={() => setActive(z.id)}
              aria-pressed={z.id === active}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all ring-1',
                z.id === active
                  ? 'bg-primary text-primary-foreground ring-primary shadow-soft'
                  : 'bg-background text-muted-foreground ring-border hover:text-foreground'
              )}
            >
              {z.name}
              <span className="ml-2 text-xs opacity-70">{z.nativeName.split(' / ')[0]}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-5"
          >
            {/* Photo + blurb */}
            <div className="lg:col-span-3 rounded-3xl overflow-hidden bg-background ring-1 ring-border shadow-soft">
              <figure className="relative m-0">
                <img
                  src={t.image}
                  alt={t.imageAlt}
                  loading="lazy"
                  className="h-56 md:h-72 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-background leading-tight">{t.nativeName}</h3>
                  <p className="text-xs uppercase tracking-[0.18em] text-background/75 mt-1">{t.speakers}</p>
                </figcaption>
              </figure>
              <div className="p-5 md:p-6 space-y-4">
                <p className="text-base leading-relaxed">{t.blurb}</p>
                <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-4">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold mb-1">Where you\u2019ll hear it</p>
                    <p className="text-sm text-muted-foreground">{t.where}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {t.towns.map((town) => (
                        <span key={town} className="rounded-full bg-background px-2.5 py-1 text-xs ring-1 ring-border">
                          {town}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-primary/5 p-4 ring-1 ring-primary/15">
                  <GraduationCap className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold mb-1">Official status</p>
                    <p className="text-sm text-muted-foreground">{t.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phrasebook */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-3xl bg-background ring-1 ring-border shadow-soft p-5 md:p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">Say it here</p>
                <ul className="space-y-4">
                  {t.phrases.map((p) => (
                    <li key={p.en} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                      <p className="text-xs text-muted-foreground">{p.en}</p>
                      <p className="text-lg font-semibold text-primary">{p.say}</p>
                      {p.hint && <p className="text-xs text-muted-foreground mt-0.5">{p.hint}</p>}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-foreground text-background p-5 md:p-6">
                <Quote className="h-5 w-5 mb-3 opacity-60" />
                <p className="text-sm leading-relaxed text-background/90">{t.practical}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="max-w-3xl mx-auto text-center text-sm text-muted-foreground mt-8">
          You can live here perfectly well in Italian alone. But knowing which language the village uses — and greeting
          people in it — is the difference between renting a house and joining a place.
        </p>
      </div>
    </section>
  );
}
