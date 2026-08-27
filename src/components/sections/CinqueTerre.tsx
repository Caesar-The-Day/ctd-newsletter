import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Waves, TrainFront, Footprints, Ship, Mountain, Ticket, Users,
  Thermometer, ArrowUpRight, Home, Info, ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { villages, crowdClock, legs, settleInstead } from './cinqueTerreData';

/**
 * Cinque Terre — the five lands, honestly.
 * Villages on a coast strip, a crowd clock, a walk/train/ferry comparator,
 * the dry-stone terraces, and where people actually settle.
 */
export function CinqueTerre() {
  const [activeVillage, setActiveVillage] = useState(villages[1].id);
  const [monthIndex, setMonthIndex] = useState(9);
  const [legId, setLegId] = useState(legs[3].id);

  const village = useMemo(
    () => villages.find((v) => v.id === activeVillage) ?? villages[0],
    [activeVillage]
  );
  const month = crowdClock[Math.min(Math.max(monthIndex, 0), 11)];
  const leg = useMemo(() => legs.find((l) => l.id === legId) ?? legs[0], [legId]);

  if (!villages.length) return null;

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28" aria-labelledby="cinque-terre-heading">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="container relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <header className="mb-12 max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Waves className="h-3.5 w-3.5 text-primary" /> The Five Lands
          </p>
          <h2 id="cinque-terre-heading" className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Cinque Terre, honestly
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Five villages, roughly 4,000 residents between them, and something close to three million visitors a year.
            It is genuinely one of the most beautiful stretches of coast in Europe — and it is a working place with
            stairs, closed seasons, and a train that does the job a road never could. Here is how it actually behaves.
          </p>
        </header>

        {/* 1. The five villages */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-5 md:p-8">
          <h3 className="text-xl font-bold text-foreground md:text-2xl">West to east, in order</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Tap a village. They sit within twelve kilometres of each other and could not be less alike.
          </p>

          <CoastStrip active={activeVillage} onSelect={setActiveVillage} />

          <AnimatePresence mode="wait">
            <motion.div
              key={village.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6 grid gap-6 md:grid-cols-[1.05fr_1fr]"
            >
              <figure className="overflow-hidden rounded-2xl border border-border/60">
                <img
                  src={village.photo}
                  alt={village.photoAlt}
                  loading="lazy"
                  className="h-64 w-full object-cover md:h-80"
                />
                <figcaption className="bg-background/80 px-4 py-2 text-xs text-muted-foreground">
                  {village.photoAlt}
                </figcaption>
              </figure>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h4 className="text-2xl font-bold text-foreground">{village.name}</h4>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    #{village.order} of five · {village.residents}
                  </span>
                </div>
                <p className="mt-2 text-base text-foreground/90">{village.character}</p>

                <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Fact icon={TrainFront} label="Railway" value={village.station} />
                  <Fact icon={Waves} label="Swimming" value={village.beach} />
                  <Fact icon={Home} label="Cars" value={village.cars} />
                  <Fact icon={Footprints} label="On foot" value={village.climb} />
                </dl>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <SeasonNote title="In February" body={village.winter} />
                  <SeasonNote title="In August" body={village.august} accent />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {village.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {l.label} <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2. The crowd clock */}
        <div className="mt-8 rounded-3xl border border-border/60 bg-card/60 p-5 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground md:text-2xl">The crowd clock</h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                When to come, and what you get for it. Drag through the year.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">{month.month}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {month.crowd}% of peak pressure
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-end gap-1.5" role="group" aria-label="Visitor pressure by month">
            {crowdClock.map((m, i) => (
              <button
                key={m.month}
                type="button"
                onClick={() => setMonthIndex(i)}
                aria-pressed={i === monthIndex}
                aria-label={`${m.month}: ${m.crowd}% of peak visitor pressure`}
                className="group flex flex-1 flex-col items-center gap-1.5"
              >
                <motion.span
                  animate={{ height: 24 + m.crowd * 0.9 }}
                  transition={{ type: 'spring', stiffness: 130, damping: 20 }}
                  className={cn(
                    'w-full rounded-t-md transition-colors',
                    i === monthIndex ? 'bg-primary' : toneBar(m.tone)
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium uppercase tracking-wide',
                    i === monthIndex ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {m.short}
                </span>
              </button>
            ))}
          </div>

          <input
            type="range"
            min={0}
            max={11}
            step={1}
            value={monthIndex}
            onChange={(e) => setMonthIndex(Number(e.target.value))}
            aria-label="Month"
            className="mt-4 w-full accent-[hsl(var(--primary))]"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={month.month}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-5 grid gap-3 md:grid-cols-4"
            >
              <MiniStat icon={Users} label="Crowds" value={crowdWord(month.crowd)} />
              <MiniStat icon={Thermometer} label="Sea" value={`${month.seaC}°C`} />
              <div className="rounded-xl border border-border/60 bg-background p-3 md:col-span-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">What is open</p>
                <p className="mt-1 text-sm text-foreground">{month.open}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background p-3 md:col-span-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Trails</p>
                <p className="mt-1 text-sm text-foreground">{month.trails}</p>
              </div>
              <div
                className={cn(
                  'rounded-xl border p-3 md:col-span-2',
                  month.tone === 'good'
                    ? 'border-primary/40 bg-primary/10'
                    : month.tone === 'hard'
                      ? 'border-destructive/30 bg-destructive/10'
                      : 'border-border/60 bg-muted/40'
                )}
              >
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">The verdict</p>
                <p className="mt-1 text-sm font-medium text-foreground">{month.verdict}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. Walk it or take the train */}
        <div className="mt-8 rounded-3xl border border-border/60 bg-card/60 p-5 md:p-8">
          <h3 className="text-xl font-bold text-foreground md:text-2xl">Walk it, or take the train?</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Four legs join the five villages. Pick one and compare the three ways of covering it.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {legs.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLegId(l.id)}
                aria-pressed={l.id === legId}
                className={cn(
                  'rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                  l.id === legId
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/60 bg-background text-foreground hover:border-primary/50'
                )}
              >
                {l.from} → {l.to}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={leg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mt-5 grid gap-3 md:grid-cols-3"
            >
              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Footprints className="h-4 w-4" />
                  <span className="text-sm font-semibold text-foreground">On foot</span>
                </div>
                <p className="text-xs text-muted-foreground">{leg.trail.name}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Metric value={`${leg.trail.km} km`} label="Distance" />
                  <Metric value={`${leg.trail.ascentM} m`} label="Ascent" />
                  <Metric value={`${leg.trail.minutes}′`} label="Walking" />
                </div>
                <p className="mt-3 text-sm text-foreground">{leg.trail.difficulty}</p>
                <p className="mt-2 text-xs text-muted-foreground">{leg.trail.status}</p>
                {leg.trail.ticketed && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                    <Ticket className="h-3 w-3" /> Cinque Terre Card required
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <TrainFront className="h-4 w-4" />
                  <span className="text-sm font-semibold text-foreground">By train</span>
                </div>
                <p className="text-xs text-muted-foreground">Cinque Terre Express, Levanto ↔ La Spezia</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <Metric value={`${leg.train.minutes}′`} label="Journey" />
                  <Metric value={leg.train.fare.split(' ')[0]} label="Single" />
                </div>
                <p className="mt-3 text-sm text-foreground">{leg.train.frequency}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Almost the whole line runs in tunnel — you get thirty seconds of sea between each village.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Ship className="h-4 w-4" />
                  <span className="text-sm font-semibold text-foreground">By boat</span>
                </div>
                {leg.ferry.available ? (
                  <>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-center">
                      <Metric value={`${leg.ferry.minutes}′`} label="Crossing" />
                    </div>
                    <p className="mt-3 text-sm text-foreground">
                      The only way to see the villages the way they were built to be seen — from the water.
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-foreground">Not possible on this leg.</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{leg.ferry.note}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-background p-4">
            <Info className="h-4 w-4 shrink-0 text-primary" />
            <p className="flex-1 text-sm text-muted-foreground">
              The trails are ticketed. The <strong className="text-foreground">Trekking Card</strong> covers the paths;
              the <strong className="text-foreground">Treno Card</strong> adds unlimited Levanto–La Spezia trains and the
              village buses. Prices and daily capacity change each season.
            </p>
            <a
              href="https://card.parconazionale5terre.it/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Cinque Terre Card <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* 4. The terraces */}
        <div className="mt-8 grid gap-6 overflow-hidden rounded-3xl border border-border/60 bg-card/60 md:grid-cols-2">
          <figure className="relative h-64 md:h-full">
            <img
              src="/images/liguria/ct-terraces.jpg"
              alt="Terraced vineyards and dry-stone walls above Manarola in the Cinque Terre"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </figure>
          <div className="p-5 md:p-8">
            <div className="mb-3 inline-flex items-center gap-2 text-primary">
              <Mountain className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">The walls</span>
            </div>
            <h3 className="text-xl font-bold text-foreground md:text-2xl">Nothing here stands up by itself</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The hillside you are photographing is a piece of infrastructure. Something in the order of{' '}
              <strong className="text-foreground">6,700 kilometres</strong> of dry-stone wall — the{' '}
              <em>muretti a secco</em> — hold these terraces to the rock, built up over a thousand years and laid
              without a gram of mortar. Estimates put the total stone volume on a par with the Great Wall of China.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              When the walls go unrepaired, the hill comes down. The October 2011 flood buried much of Vernazza and
              Monterosso in mud within hours, and abandonment of the terraces above was a large part of why. Roughly
              four-fifths of the historically cultivated terraces are no longer farmed.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The people rebuilding them are, mostly, winemakers. Every bottle of Cinque Terre DOC and every rare
              half-bottle of <strong className="text-foreground">Sciacchetrà</strong> pays for wall maintenance
              that no tourist ticket covers.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://www.parconazionale5terre.it/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                Parco Nazionale delle Cinque Terre <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://www.cantinacinqueterre.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                Cantina Cinque Terre & Sciacchetrà <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://whc.unesco.org/en/list/826/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                UNESCO World Heritage listing <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* 5. Living there vs visiting */}
        <div className="mt-8 rounded-3xl border border-border/60 bg-card/60 p-5 md:p-8">
          <h3 className="text-xl font-bold text-foreground md:text-2xl">Would you actually live in one?</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Very few incomers do, and the reasons are unglamorous: no car anywhere near the door, stairs between you
            and the groceries, prices set by holiday lets, a single small clinic between the villages with La Spezia
            for anything serious, and a winter in which half the village is shuttered. The people who move to this
            stretch of coast almost always settle just outside it and take the train in.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {settleInstead.map((s) => (
              <article key={s.name} className="overflow-hidden rounded-2xl border border-border/60 bg-background">
                <img src={s.photo} alt={s.photoAlt} loading="lazy" className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h4 className="text-base font-bold text-foreground">{s.name}</h4>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-primary">
                    <TrainFront className="h-3 w-3" /> {s.minutesToVillages}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-muted-foreground">{s.why}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Stylised coast strip: land above, sea below, the five villages on the shoreline. */
function CoastStrip({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const W = 100;
  const coastY = (x: number) => 26 + Math.sin((x / W) * Math.PI * 1.1 + 0.35) * 5;

  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/60 bg-background pt-2">
      <svg viewBox="0 0 100 46" preserveAspectRatio="none" className="h-40 w-full md:h-52" role="presentation">
        <defs>
          <linearGradient id="ct-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="ct-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* land mass above the coastline */}
        <path
          d={`M0,0 L100,0 L100,${coastY(100)} ${Array.from({ length: 51 })
            .map((_, i) => {
              const x = 100 - i * 2;
              return `L${x},${coastY(x)}`;
            })
            .join(' ')} Z`}
          fill="url(#ct-land)"
        />
        {/* terraces hint */}
        {[4, 8, 12].map((d) => (
          <path
            key={d}
            d={Array.from({ length: 51 })
              .map((_, i) => {
                const x = i * 2;
                return `${i === 0 ? 'M' : 'L'}${x},${coastY(x) - d}`;
              })
              .join(' ')}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.3"
            opacity="0.35"
          />
        ))}
        {/* sea */}
        <path
          d={`M0,46 L100,46 L100,${coastY(100)} ${Array.from({ length: 51 })
            .map((_, i) => {
              const x = 100 - i * 2;
              return `L${x},${coastY(x)}`;
            })
            .join(' ')} Z`}
          fill="url(#ct-sea)"
        />
        {/* coastline */}
        <path
          d={Array.from({ length: 51 })
            .map((_, i) => {
              const x = i * 2;
              return `${i === 0 ? 'M' : 'L'}${x},${coastY(x)}`;
            })
            .join(' ')}
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeWidth="0.4"
          opacity="0.45"
        />
      </svg>

      {/* village pins */}
      {villages.map((v) => {
        const isActive = v.id === active;
        const top = (coastY(v.x * 100) / 46) * 100;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            aria-pressed={isActive}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: `${6 + v.x * 88}%`, top: `${top}%` }}
          >
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border-2 shadow-sm transition-all',
                isActive
                  ? 'scale-125 border-primary bg-primary'
                  : 'border-foreground/40 bg-background hover:border-primary'
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-primary-foreground' : 'bg-foreground/50')} />
            </span>
            <span
              className={cn(
                'absolute left-1/2 top-6 w-24 -translate-x-1/2 text-center text-[10px] font-semibold leading-tight',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {v.name.replace(' al Mare', '')}
            </span>
          </button>
        );
      })}

      <span className="absolute bottom-2 right-3 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Ligurian Sea
      </span>
      <span className="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Terraced hills
      </span>
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Waves; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-3">
      <dt className="mb-1 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" /> {label}
      </dt>
      <dd className="text-sm leading-snug text-foreground">{value}</dd>
    </div>
  );
}

function SeasonNote({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-xl border p-3',
        accent ? 'border-primary/30 bg-primary/5' : 'border-border/60 bg-muted/40'
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm leading-snug text-foreground">{body}</p>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Waves; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-3">
      <div className="mb-1 flex items-center gap-1.5 text-primary">
        <Icon className="h-4 w-4" />
        <span className="text-lg font-bold text-foreground">{value}</span>
      </div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2">
      <div className="text-sm font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function toneBar(tone: 'good' | 'ok' | 'hard') {
  if (tone === 'good') return 'bg-primary/35';
  if (tone === 'hard') return 'bg-destructive/40';
  return 'bg-muted-foreground/30';
}

function crowdWord(crowd: number) {
  if (crowd < 20) return 'Empty';
  if (crowd < 45) return 'Easy';
  if (crowd < 75) return 'Busy';
  if (crowd < 92) return 'Heavy';
  return 'Peak';
}

export default CinqueTerre;
