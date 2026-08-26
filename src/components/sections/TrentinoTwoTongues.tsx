import { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Check, X, MapPin, Languages } from 'lucide-react';
import { bands } from './trentinoData';

const languageRows = [
  { area: 'Doctor / hospital', trentino: 'Italian', sudtirol: 'German or Italian, your choice', ladin: 'German or Italian; Ladin locally' },
  { area: 'Comune paperwork', trentino: 'Italian', sudtirol: 'Both, by law', ladin: 'All three, by law' },
  { area: 'Schools', trentino: 'Italian', sudtirol: 'Separate Italian and German systems', ladin: 'Trilingual (Ladin schools)' },
  { area: 'Daily shopping', trentino: 'Italian', sudtirol: 'German in the villages', ladin: 'Ladin among locals' },
  { area: 'Public sector jobs', trentino: 'Italian', sudtirol: 'Certified bilingualism required', ladin: 'Certified trilingualism required' },
];

export default function TrentinoTwoTongues() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const band = bands[index];
  const Icon = band.icon;

  const go = (next: number) => {
    const wrapped = (next + bands.length) % bands.length;
    setDirection(wrapped > index || (index === bands.length - 1 && wrapped === 0) ? 1 : -1);
    setIndex(wrapped);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1);
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Trentino-Alto Adige</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Two Tongues, One Region</h2>
          <p className="text-lg text-muted-foreground">
            One region on the map, two autonomous provinces in practice — and a third language older than both.
            Pick the one you'd actually be living in.
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="relative overflow-hidden rounded-3xl bg-foreground/5 shadow-soft">
            <div className="relative h-64 md:h-[420px]">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.figure
                  key={band.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction >= 0 ? 120 : -120, scale: 1.03 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction >= 0 ? -120 : 120, scale: 1.03 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={onDragEnd}
                  className="absolute inset-0 m-0 cursor-grab active:cursor-grabbing"
                >
                  <img
                    src={band.image}
                    alt={band.imageAlt}
                    loading="lazy"
                    width={1600}
                    height={1008}
                    draggable={false}
                    className="h-full w-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/35 to-foreground/5" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-xl bg-background/15 backdrop-blur-sm p-2.5 ring-1 ring-background/25">
                        <Icon className="h-5 w-5 text-background" />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-background leading-tight">{band.name}</h3>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-background/70">{band.subtitle}</p>
                      </div>
                    </div>
                    <p className="max-w-2xl text-sm md:text-base text-background/85 leading-relaxed">{band.caption}</p>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>

              <button
                onClick={() => go(index - 1)}
                aria-label="Previous area"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur p-2 shadow-soft hover:bg-background transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="Next area"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur p-2 shadow-soft hover:bg-background transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {bands.map((b, i) => {
              const BIcon = b.icon;
              const on = i === index;
              return (
                <button
                  key={b.id}
                  onClick={() => go(i)}
                  aria-pressed={on}
                  className={cn(
                    'group relative overflow-hidden rounded-xl text-left transition-all duration-300',
                    on ? 'ring-2 ring-primary' : 'ring-1 ring-border hover:ring-primary/50'
                  )}
                >
                  <img
                    src={b.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={cn(
                      'h-16 sm:h-20 w-full object-cover transition-all duration-500',
                      on ? '' : 'grayscale-[60%] opacity-75 group-hover:grayscale-0 group-hover:opacity-100'
                    )}
                  />
                  <div className="absolute inset-0 bg-foreground/45" />
                  <span className="absolute inset-0 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold text-background text-center px-1">
                    <BIcon className="h-3.5 w-3.5 shrink-0" /> {b.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            key={band.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-border">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                  <Languages className="h-3.5 w-3.5" /> {band.language}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">{band.reality}</p>

                <div className="space-y-3">
                  {band.meters.map((m) => (
                    <div key={m.label}>
                      <div className="flex items-baseline justify-between text-sm mb-1">
                        <span className="font-medium">{m.label}</span>
                        <span className="text-xs text-muted-foreground">{m.note}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          key={`${band.id}-${m.label}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${m.value}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Where that is</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {band.towns.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium">
                      <MapPin className="h-3 w-3 text-primary" /> {t}
                    </span>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Works well</p>
                    <ul className="space-y-2">
                      {band.good.map((g) => (
                        <li key={g} className="flex gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Costs you</p>
                    <ul className="space-y-2">
                      {band.hard.map((h) => (
                        <li key={h} className="flex gap-2 text-sm">
                          <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Language reality check */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
            <div className="px-6 md:px-8 pt-6 pb-4 border-b border-border">
              <h3 className="text-xl md:text-2xl font-bold">The language reality check</h3>
              <p className="text-sm text-muted-foreground mt-1">
                What language you actually need, where, for what.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[620px]">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="px-4 md:px-6 py-3 font-semibold">Situation</th>
                    <th className="px-4 py-3 font-semibold">Trentino</th>
                    <th className="px-4 py-3 font-semibold">Südtirol</th>
                    <th className="px-4 md:px-6 py-3 font-semibold">Ladin valleys</th>
                  </tr>
                </thead>
                <tbody>
                  {languageRows.map((r, i) => (
                    <tr key={r.area} className={cn(i % 2 === 1 && 'bg-muted/20')}>
                      <td className="px-4 md:px-6 py-3 font-medium">{r.area}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.trentino}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.sudtirol}</td>
                      <td className="px-4 md:px-6 py-3 text-muted-foreground">{r.ladin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
