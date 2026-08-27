import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Ship, Ruler, Waves, ExternalLink, Compass, Gauge, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { marinas, seaDestinations, boatingFacts, type Marina } from './liguriaMarinaData';

const euro = (n: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
    Math.round(n / 50) * 50
  );

/** Berth pricing scales faster than length — roughly with beam x length. */
const scaleForLength = (len: number) => Math.pow(len / 12, 1.7);

/**
 * Stylised Ligurian shoreline in a 0..100 x / 0..40 y viewBox.
 * Land sits above the line, sea below; the coast bows down to its lowest
 * point around Genoa, the way the Gulf of Genoa actually curves.
 */
const COAST_TOP = 15;
const COAST_BOW = 7;
const coastY = (x: number) => COAST_TOP + COAST_BOW * Math.sin((Math.PI * x) / 100);

const coastPoints = Array.from({ length: 101 }, (_, i) => `${i},${coastY(i).toFixed(2)}`).join(' ');

/** Where Ponente becomes Levante, just west of Genoa. */
const SPLIT_X = 45;


type Hub = 'ponente' | 'genova' | 'levante';

const hubs: { id: Hub; label: string; sub: string }[] = [
  { id: 'ponente', label: 'Riviera di Ponente', sub: 'Sanremo · Imperia' },
  { id: 'genova', label: 'Genoa', sub: 'Porto Antico' },
  { id: 'levante', label: 'Riviera di Levante', sub: 'Lavagna · La Spezia' },
];

export default function LiguriaAfloat() {
  const [activeId, setActiveId] = useState<string>('imperia');
  const [length, setLength] = useState(12);
  const [hub, setHub] = useState<Hub>('genova');
  const [speed, setSpeed] = useState(18);
  const [hours, setHours] = useState(6);

  const active: Marina | undefined = useMemo(
    () => marinas.find((m) => m.id === activeId) ?? marinas[0],
    [activeId]
  );

  /** Pins sit on the shoreline; crowded neighbours get lifted with a leader line. */
  const placements = useMemo(() => {
    const sorted = [...marinas].sort((a, b) => a.x - b.x);
    let prevX = -99;
    let prevLift = 0;
    return sorted.map((m) => {
      const crowded = m.x - prevX < 8;
      const lift = crowded && prevLift === 0 ? 34 : 0;
      prevX = m.x;
      prevLift = lift;
      const size = 24 + (Math.min(m.berths, 1500) / 1500) * 12;
      return { marina: m, lift, size, top: (coastY(m.x) / 40) * 100 };
    });
  }, []);


  if (!marinas.length || !active) return null;

  const factor = scaleForLength(length);
  const low = active.rate12[0] * factor;
  const high = active.rate12[1] * factor;

  // Half the time out, half back, minus a safety margin for stopping.
  const rangeNm = Math.round(((speed * hours) / 2) * 0.8);
  const reachable = seaDestinations.filter((d) => d.from[hub] <= rangeNm);
  const justOut = seaDestinations
    .filter((d) => d.from[hub] > rangeNm)
    .sort((a, b) => a.from[hub] - b.from[hub])
    .slice(0, 2);

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-foreground text-background">
      {/* animated sea backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.55),transparent_60%)]" />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, hsl(var(--background)/0.35) 0 2px, transparent 2px 46px)',
            maskImage: 'linear-gradient(to top, black, transparent)',
          }}
          animate={{ backgroundPositionX: ['0px', '46px'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-background/60 font-semibold mb-3">Liguria Afloat</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">A Coast Built Around Boats</h2>
          <p className="text-lg text-background/75">
            Three hundred kilometres of coast, more than twenty tourist ports and something like 25,000 berths — the
            densest concentration of marinas in Italy. Here is what it actually costs, what you can reach in a day,
            and where the space really is.
          </p>
        </div>

        {/* Coast strip */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="relative h-56 md:h-72 rounded-3xl bg-background/5 ring-1 ring-background/15 overflow-hidden">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              {/* sea below the shoreline */}
              <polygon
                points={`0,40 100,40 100,${coastY(100)} ${coastPoints} 0,${coastY(0)}`}
                fill="hsl(var(--primary) / 0.28)"
              />
              {/* shoreline */}
              <polyline
                points={coastPoints}
                fill="none"
                stroke="hsl(var(--background) / 0.55)"
                strokeWidth="0.4"
                strokeLinecap="round"
              />
              {/* ponente / levante divider */}
              <line
                x1={SPLIT_X}
                y1="2"
                x2={SPLIT_X}
                y2="38"
                stroke="hsl(var(--background) / 0.2)"
                strokeWidth="0.25"
                strokeDasharray="1 1.5"
              />
            </svg>

            <span className="absolute left-4 top-3 text-[10px] uppercase tracking-[0.2em] text-background/50">
              French border
            </span>
            <span className="absolute right-4 top-3 text-[10px] uppercase tracking-[0.2em] text-background/50">
              Tuscany
            </span>
            <span className="absolute left-1/2 top-3 hidden -translate-x-[130%] text-[10px] uppercase tracking-[0.2em] text-background/35 md:inline">
              Ponente
            </span>
            <span className="absolute left-1/2 top-3 hidden translate-x-[10%] text-[10px] uppercase tracking-[0.2em] text-background/35 md:inline">
              Levante
            </span>
            <span className="absolute left-[30%] top-[8%] hidden text-[10px] uppercase tracking-[0.2em] text-background/20 lg:inline">
              Apennine hinterland
            </span>


            <span className="absolute left-4 bottom-3 text-[10px] uppercase tracking-[0.2em] text-background/30">
              Ligurian Sea
            </span>

            {placements.map(({ marina: m, lift, size, top }) => {
              const on = m.id === activeId;
              return (
                <div key={m.id} className="absolute" style={{ left: `${m.x}%`, top: `${top}%` }}>
                  {lift > 0 && (
                    <span
                      aria-hidden
                      className="absolute left-0 w-px bg-background/25"
                      style={{ height: lift, top: -lift }}
                    />
                  )}
                  <button
                    onClick={() => setActiveId(m.id)}
                    aria-pressed={on}
                    aria-label={`${m.name}, ${m.town} — ${m.berths} berths`}
                    className="absolute left-0 -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                    style={{ top: -lift }}
                  >
                    <span
                      className={cn(
                        'flex items-center justify-center rounded-full ring-1 transition-all duration-300',
                        on
                          ? 'bg-primary text-primary-foreground ring-primary scale-110 shadow-lg'
                          : 'bg-background/15 text-background ring-background/30 group-hover:bg-background/30 group-focus-visible:ring-background'
                      )}
                      style={{ height: size, width: size }}
                    >
                      <Anchor style={{ height: size * 0.45, width: size * 0.45 }} />
                    </span>
                    <span
                      className={cn(
                        'absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium transition-colors',
                        lift > 0 ? 'bottom-full mb-1' : 'top-full mt-1',
                        on ? 'block text-background' : 'hidden text-background/55 group-hover:text-background/90 md:block'
                      )}
                    >

                      {m.town}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-background/45">
            Pins sit where each port meets the water; larger circles mean more berths. Tap one for costs and detail.
          </p>
        </div>


        {/* Marina detail + calculator */}
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-5">
          <AnimatePresence mode="wait">
            <motion.article
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3 overflow-hidden rounded-3xl bg-background/5 ring-1 ring-background/15"
            >
              {active.image ? (
                <div className="relative h-56 md:h-72">
                  <img
                    src={active.image}
                    alt={`${active.name} in ${active.town}, Liguria`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-background/60">
                      {active.coast === 'ponente' ? 'Riviera di Ponente' : 'Riviera di Levante'}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold">{active.name}</h3>
                    <p className="text-sm text-background/75">{active.town} — {active.vibe}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 pb-0">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-background/60">
                    {active.coast === 'ponente' ? 'Riviera di Ponente' : 'Riviera di Levante'}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold">{active.name}</h3>
                  <p className="text-sm text-background/75">{active.town} — {active.vibe}</p>
                </div>
              )}

              <div className="p-6 space-y-5">
                <p className="text-background/85 leading-relaxed">{active.summary}</p>

                <dl className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Ship, label: 'Berths', value: active.berths.toLocaleString('it-IT') },
                    { icon: Ruler, label: 'Max LOA', value: `${active.maxLoa} m` },
                    { icon: Waves, label: 'Depth', value: active.depth },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-2xl bg-background/10 p-3 text-center">
                      <Icon className="mx-auto mb-1 h-4 w-4 text-background/70" />
                      <dt className="text-[10px] uppercase tracking-[0.16em] text-background/55">{label}</dt>
                      <dd className="text-base font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="rounded-2xl bg-background/10 p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-background/55 mb-1">From the pontoon gate</p>
                  <p className="text-sm text-background/85">{active.walkable}</p>
                </div>

                {active.link && (
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {active.linkLabel ?? 'Official site'}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.article>

            {/* Calculator */}
            <motion.div
              key={`calc-${active.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="lg:col-span-2 rounded-3xl bg-background/5 ring-1 ring-background/15 p-6 flex flex-col"
            >
              <h3 className="text-xl font-bold mb-1">What would a berth cost?</h3>
              <p className="text-sm text-background/70 mb-6">
                Indicative annual fee at {active.name} for a boat of the length you choose.
              </p>

              <label htmlFor="loa" className="flex items-center justify-between text-sm mb-2">
                <span className="text-background/75">Boat length</span>
                <span className="font-semibold">{length} m</span>
              </label>
              <input
                id="loa"
                type="range"
                min={8}
                max={24}
                step={1}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-[0.15em] text-background/45 mt-1">
                <span>8 m day boat</span>
                <span>24 m</span>
              </div>

              <div className="mt-6 rounded-2xl bg-primary/15 ring-1 ring-primary/30 p-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-background/60 mb-1">Annual berth, indicative</p>
                <motion.p
                  key={`${active.id}-${length}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl md:text-3xl font-bold"
                >
                  {euro(low)} – {euro(high)}
                </motion.p>
                <p className="text-xs text-background/65 mt-2">
                  Roughly {euro(low / 12)} – {euro(high / 12)} a month, before insurance, haul-out and fuel.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-center text-xs">
                <div className="rounded-xl bg-background/10 p-3">
                  <p className="text-background/55 uppercase tracking-[0.14em] text-[10px]">Summer only</p>
                  <p className="font-semibold text-sm">{euro(low * 0.55)} – {euro(high * 0.6)}</p>
                </div>
                <div className="rounded-xl bg-background/10 p-3">
                  <p className="text-background/55 uppercase tracking-[0.14em] text-[10px]">Winter only</p>
                  <p className="font-semibold text-sm">{euro(low * 0.25)} – {euro(high * 0.3)}</p>
                </div>
              </div>

              <p className="mt-auto pt-5 flex gap-2 text-[11px] leading-relaxed text-background/55">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                Bands are editorial estimates from published tariffs and owner reports. Always confirm the current
                listino with the marina — Ligurian ports re-price every spring.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Day-trip radius */}
        <div className="max-w-6xl mx-auto mt-10 rounded-3xl bg-background/5 ring-1 ring-background/15 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Compass className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-xl md:text-2xl font-bold">How far is a day out?</h3>
              <p className="text-sm text-background/70">Pick a home port, a cruising speed and how long you want to be away.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-background/55 mb-2">Home port</p>
              <div className="flex flex-col gap-2">
                {hubs.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setHub(h.id)}
                    aria-pressed={hub === h.id}
                    className={cn(
                      'rounded-xl px-3 py-2 text-left text-sm transition-colors',
                      hub === h.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background/10 text-background/80 hover:bg-background/20'
                    )}
                  >
                    <span className="font-semibold">{h.label}</span>
                    <span className="block text-[11px] opacity-75">{h.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <label htmlFor="speed" className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-2 text-background/75"><Gauge className="h-4 w-4" /> Cruising speed</span>
                  <span className="font-semibold">{speed} kn</span>
                </label>
                <input
                  id="speed"
                  type="range"
                  min={6}
                  max={30}
                  step={1}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-[0.15em] text-background/45 mt-1">
                  <span>Sail / trawler</span>
                  <span>Fast planing</span>
                </div>
              </div>

              <div>
                <label htmlFor="hours" className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-2 text-background/75"><Clock className="h-4 w-4" /> Hours out</span>
                  <span className="font-semibold">{hours} h</span>
                </label>
                <input
                  id="hours"
                  type="range"
                  min={2}
                  max={12}
                  step={1}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="rounded-2xl bg-primary/15 ring-1 ring-primary/30 px-5 py-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-background/60">Round-trip reach</p>
                <p className="text-2xl font-bold">{rangeNm} nautical miles</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {seaDestinations.map((d) => {
              const nm = d.from[hub];
              const on = nm <= rangeNm;
              return (
                <motion.div
                  key={d.id}
                  layout
                  animate={{ opacity: on ? 1 : 0.4 }}
                  className={cn(
                    'rounded-2xl p-4 ring-1 transition-colors',
                    on ? 'bg-primary/20 ring-primary/40' : 'bg-background/5 ring-background/10'
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-semibold text-sm">{d.name}</h4>
                    <span className="text-[11px] text-background/60 shrink-0">{nm} nm</span>
                  </div>
                  <p className="mt-1 text-xs text-background/70 leading-relaxed">{d.note}</p>
                  {!on && (
                    <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-background/45">Overnight it</p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {reachable.length === 0 && justOut.length > 0 && (
            <p className="mt-4 text-sm text-background/65">
              Nothing in reach yet — {justOut[0].name} needs {justOut[0].from[hub]} nm. Add speed or hours.
            </p>
          )}
        </div>

        {/* Practicalities */}
        <div className="max-w-6xl mx-auto mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {boatingFacts.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-2xl bg-background/5 ring-1 ring-background/15 p-5"
            >
              <h4 className="font-semibold mb-2">{f.title}</h4>
              <p className="text-sm text-background/75 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
