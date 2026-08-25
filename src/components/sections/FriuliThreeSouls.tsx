import { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Waves, Check, X, Euro, Stethoscope, MessageCircle,
  ThermometerSun, MapPin, ChevronLeft, ChevronRight
} from 'lucide-react';
import { souls } from './friuliSoulsData';

export default function FriuliThreeSouls() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const soul = souls[index];
  const Icon = soul.icon;

  const go = (next: number) => {
    const wrapped = (next + souls.length) % souls.length;
    setDirection(wrapped > index || (index === souls.length - 1 && wrapped === 0) ? 1 : -1);
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
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Friuli-Venezia Giulia</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Three Friulis</h2>
          <p className="text-lg text-muted-foreground">
            One small region, three completely different lives. Swipe through them, then read the one you'd actually be living.
          </p>
        </div>

        {/* Swipeable photo carousel */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="relative overflow-hidden rounded-3xl bg-foreground/5 shadow-soft">
            <div className="relative h-64 md:h-[420px]">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.figure
                  key={soul.id}
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
                    src={soul.image}
                    alt={soul.imageAlt}
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
                        <h3 className="text-2xl md:text-3xl font-bold text-background leading-tight">{soul.name}</h3>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-background/70">{soul.subtitle}</p>
                      </div>
                    </div>
                    <p className="max-w-2xl text-sm md:text-base text-background/85 leading-relaxed">{soul.caption}</p>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>

              <button
                onClick={() => go(index - 1)}
                aria-label="Previous Friuli"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur p-2 shadow-soft hover:bg-background transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="Next Friuli"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur p-2 shadow-soft hover:bg-background transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails / dots */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {souls.map((s, i) => {
              const SIcon = s.icon;
              const on = i === index;
              return (
                <button
                  key={s.id}
                  onClick={() => go(i)}
                  aria-pressed={on}
                  className={cn(
                    'group relative overflow-hidden rounded-xl text-left transition-all duration-300',
                    on ? 'ring-2 ring-primary' : 'ring-1 ring-border hover:ring-primary/50'
                  )}
                >
                  <img
                    src={s.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={cn(
                      'h-16 sm:h-20 w-full object-cover transition-all duration-500',
                      on ? '' : 'grayscale-[60%] opacity-75 group-hover:grayscale-0 group-hover:opacity-100'
                    )}
                  />
                  <div className="absolute inset-0 bg-foreground/45" />
                  <span className="absolute inset-0 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold text-background">
                    <SIcon className="h-3.5 w-3.5" /> {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            key={soul.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft"
          >
            {/* Meters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 md:p-8 border-b border-border bg-muted/20">
              {soul.meters.map((m) => (
                <div key={m.label}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{m.label}</span>
                    <span className="text-sm font-bold text-primary tabular-nums">{m.value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">{m.note}</p>
                </div>
              ))}
            </div>

            <div className="p-6 md:p-8">
              <p className="text-muted-foreground leading-relaxed mb-6">{soul.blurb}</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <Fact icon={ThermometerSun} label="Climate" value={soul.climate} />
                <Fact icon={Euro} label="Cost reality" value={soul.cost} />
                <Fact icon={Stethoscope} label="Healthcare" value={soul.healthcare} />
                <Fact icon={MessageCircle} label="What you'll hear" value={soul.language} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
                  <p className="font-semibold mb-3 text-xs uppercase tracking-[0.15em] text-primary">Suits you if</p>
                  <ul className="space-y-2.5">
                    {soul.suits.map((t) => (
                      <li key={t} className="flex gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-5">
                  <p className="font-semibold mb-3 text-xs uppercase tracking-[0.15em] text-destructive">Think twice if</p>
                  <ul className="space-y-2.5">
                    {soul.avoid.map((t) => (
                      <li key={t} className="flex gap-2.5 text-sm">
                        <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Towns in this band
                </span>
                {soul.towns.split(',').map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground/80"
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Fact({ icon: I, label, value }: { icon: typeof Waves; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/30 border border-border p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center gap-2 mb-1.5 text-primary">
        <I className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.15em]">{label}</span>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{value}</p>
    </div>
  );
}
