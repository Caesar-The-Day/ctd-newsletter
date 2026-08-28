import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor,
  Ship,
  Ruler,
  Waves,
  ExternalLink,
  Wind,
  Gauge,
  Clock,
  Trophy,
  Thermometer,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  marinas,
  seaDestinations,
  boatingFacts,
  homePorts,
  destinationGroups,
  boraMonths,
  type Marina,
  type HubId,
  type DestinationGroup,
  type Water,
} from './friuliMarinaData';

const euro = (n: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
    Math.round(n / 50) * 50
  );

/** Berth pricing scales faster than length — roughly with beam x length. */
const scaleForLength = (len: number) => Math.pow(len / 12, 1.7);

/**
 * Stylised Gulf of Trieste in a 0..100 x / 0..40 y viewBox: flat lagoon shore
 * in the west, the Carso cliff rising in the east, sea below the line.
 */
const coastY = (x: number) => 14 + 6 * Math.sin((Math.PI * Math.min(x, 100)) / 130) + (x > 70 ? (x - 70) * 0.12 : 0);
const coastPoints = Array.from({ length: 101 }, (_, i) => `${i},${coastY(i).toFixed(2)}`).join(' ');

/** Where the lagoon ends and the open Gulf begins. */
const SPLIT_X = 40;

const boraStyle: Record<Marina['bora'], { label: string; cls: string }> = {
  sheltered: { label: 'Bora sheltered', cls: 'bg-emerald-400/20 text-emerald-200 ring-emerald-300/30' },
  moderate: { label: 'Bora moderate', cls: 'bg-amber-400/20 text-amber-200 ring-amber-300/30' },
  exposed: { label: 'Bora exposed', cls: 'bg-rose-400/20 text-rose-200 ring-rose-300/30' },
};

export default function FriuliAfloat() {
  const [activeId, setActiveId] = useState<string>('grado');
  const [waterFilter, setWaterFilter] = useState<Water | 'all'>('all');
  const [length, setLength] = useState(12);
  const [hub, setHub] = useState<HubId>('grado');
  const [speed, setSpeed] = useState(16);
  const [hours, setHours] = useState(8);
  const [groupFilter, setGroupFilter] = useState<DestinationGroup | 'all'>('all');

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
      const crowded = m.x - prevX < 9;
      const lift = crowded && prevLift === 0 ? 34 : 0;
      prevX = m.x;
      prevLift = lift;
      const size = 24 + (Math.min(m.berths, 2500) / 2500) * 12;
      return { marina: m, lift, size, top: (coastY(m.x) / 40) * 100 };
    });
  }, []);

  const maxBora = useMemo(() => Math.max(...boraMonths.map((m) => m.boraDays)), []);

  if (!marinas.length || !active) return null;

  const factor = scaleForLength(length);
  const low = active.rate12[0] * factor;
  const high = active.rate12[1] * factor;

  // Half the time out, half back, minus a margin for stopping.
  const rangeNm = Math.round(((speed * hours) / 2) * 0.8);
  const reachable = seaDestinations.filter((d) => d.from[hub] <= rangeNm);

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
          <p className="text-xs uppercase tracking-[0.25em] text-background/60 font-semibold mb-3">Friuli Afloat</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Gulf, the Lagoon and the Croatian Horizon</h2>
          <p className="text-lg text-background/75">
            A hundred kilometres of coast that does more than coasts twice its length: a lagoon of channels and
            stilt huts in the west, deep water and limestone cliffs in the east, the largest sailing race on earth
            every October, and Slovenia and Istria close enough to be a Saturday.
          </p>
        </div>

        {/* Water filter */}
        <div className="max-w-6xl mx-auto mb-4 flex flex-wrap justify-center gap-2">
          {([
            { id: 'all' as const, label: 'All harbours' },
            { id: 'lagoon' as const, label: 'Lagoon & shallow draft' },
            { id: 'gulf' as const, label: 'Open Gulf & deep water' },
          ]).map((chip) => (
            <button
              key={chip.id}
              onClick={() => setWaterFilter(chip.id)}
              aria-pressed={waterFilter === chip.id}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
                waterFilter === chip.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background/10 text-background/75 hover:bg-background/20'
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Coast strip */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="relative h-56 md:h-72 rounded-3xl bg-background/5 ring-1 ring-background/15 overflow-hidden">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <polygon
                points={`0,40 100,40 100,${coastY(100)} ${coastPoints} 0,${coastY(0)}`}
                fill="hsl(var(--primary) / 0.28)"
              />
              <polyline
                points={coastPoints}
                fill="none"
                stroke="hsl(var(--background) / 0.55)"
                strokeWidth="0.4"
                strokeLinecap="round"
              />
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
              Veneto border
            </span>
            <span className="absolute right-4 top-3 text-[10px] uppercase tracking-[0.2em] text-background/50">
              Slovenia
            </span>
            <span className="absolute left-[16%] top-3 hidden text-[10px] uppercase tracking-[0.2em] text-background/35 md:inline">
              Lagoon
            </span>
            <span className="absolute left-[52%] top-3 hidden text-[10px] uppercase tracking-[0.2em] text-background/35 md:inline">
              Carso cliffs
            </span>
            <span className="absolute left-4 bottom-3 text-[10px] uppercase tracking-[0.2em] text-background/30">
              Gulf of Trieste
            </span>

            {placements.map(({ marina: m, lift, size, top }) => {
              const on = m.id === activeId;
              const dimmed = waterFilter !== 'all' && m.water !== waterFilter;
              return (
                <div
                  key={m.id}
                  className={cn('absolute transition-opacity', dimmed && 'opacity-25')}
                  style={{ left: `${m.x}%`, top: `${top}%` }}
                >
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
                      {m.town.split(',')[0]}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-background/45">
            {marinas.length} harbours from the Tagliamento mouth to the Slovenian border. Larger circles mean more
            berths. Tap one for costs, depth and how it handles the Bora.
          </p>
          <p className="mt-2 text-center text-xs text-background/40">
            Rough rule: the further west you keep the boat, the cheaper and calmer the berth and the longer the run
            to open water. The further east, the deeper the water, the better the yards — and the more the wind
            matters.
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
                    alt={`${active.name} at ${active.town}, Friuli-Venezia Giulia`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-background/60">
                      {active.water === 'lagoon' ? 'Lagoon of Marano & Grado' : 'Gulf of Trieste'}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold">{active.name}</h3>
                    <p className="text-sm text-background/75">
                      {active.town} — {active.vibe}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 pb-0">
                  <h3 className="text-2xl md:text-3xl font-bold">{active.name}</h3>
                  <p className="text-sm text-background/75">
                    {active.town} — {active.vibe}
                  </p>
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
                  <div className="flex items-center gap-2 mb-1">
                    <Wind className="h-4 w-4 text-background/70" />
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ring-1',
                        boraStyle[active.bora].cls
                      )}
                    >
                      {boraStyle[active.bora].label}
                    </span>
                  </div>
                  <p className="text-sm text-background/75 leading-relaxed">{active.boraNote}</p>
                </div>

                <div className="rounded-2xl bg-background/10 p-4">
                  <label htmlFor="loa" className="flex items-center justify-between text-sm mb-2">
                    <span className="text-background/75">Your boat</span>
                    <span className="font-semibold">{length} m</span>
                  </label>
                  <input
                    id="loa"
                    type="range"
                    min={6}
                    max={Math.min(active.maxLoa, 30)}
                    step={1}
                    value={Math.min(length, Math.min(active.maxLoa, 30))}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <p className="mt-3 text-center">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-background/55">
                      Indicative annual berth
                    </span>
                    <span className="text-2xl font-bold">
                      {euro(low)} – {euro(high)}
                    </span>
                  </p>
                </div>

                <p className="text-sm text-background/70">
                  <MapPin className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                  {active.walkable}
                </p>

                {active.link && (
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-background/85 underline underline-offset-4 hover:text-background"
                  >
                    {active.linkLabel ?? 'Marina website'} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.article>

            {/* Barcolana + racing culture */}
            <motion.aside
              key={`${active.id}-side`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="overflow-hidden rounded-3xl bg-background/5 ring-1 ring-background/15">
                <div className="relative h-44">
                  <img
                    src="/images/friuli-venezia-giulia/afloat-barcolana.jpg"
                    alt="The Barcolana regatta filling the Gulf of Trieste with sails"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-background/70">
                      <Trophy className="h-3.5 w-3.5" /> Second Sunday of October
                    </p>
                    <h3 className="text-2xl font-bold">Barcolana</h3>
                  </div>
                </div>
                <div className="p-5 space-y-3 text-sm text-background/80 leading-relaxed">
                  <p>
                    Two thousand boats on one start line, the largest sailing regatta in the world, and a city that
                    simply stops to watch it. Anyone can enter — Maxi yachts share the water with retired couples in
                    thirty-year-old cruisers, and most of the fleet is there to be in it rather than to win.
                  </p>
                  <p className="text-background/65">
                    The week before is a floating festival along the Rive; the week after, everyone hauls out for the
                    Bora season.
                  </p>
                  <a
                    href="https://www.barcolana.it/en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-medium text-background/85 underline underline-offset-4 hover:text-background"
                  >
                    barcolana.it <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="rounded-3xl bg-background/5 ring-1 ring-background/15 p-5">
                <h4 className="font-semibold mb-3">Getting on the water without a boat</h4>
                <ul className="space-y-3 text-sm text-background/75">
                  {[
                    {
                      name: 'Società Velica di Barcola e Grignano',
                      note: 'Founded the Barcolana; sailing school, keel-boat courses and Wednesday-night racing that always needs crew.',
                      href: 'https://www.svbg.it/',
                    },
                    {
                      name: 'Yacht Club Adriaco, Trieste',
                      note: 'The city club at the Sacchetta — offshore fleet, junior sailing, and the social side of Triestine boating.',
                      href: 'https://www.yachtclubadriaco.it/',
                    },
                    {
                      name: 'Circoli at Grado & Lignano',
                      note: 'Lagoon clubs with dinghies, windsurf and small-keelboat courses — the cheapest way to start.',
                      href: 'https://www.turismofvg.it/en',
                    },
                  ].map((c) => (
                    <li key={c.name}>
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-background underline underline-offset-4"
                      >
                        {c.name}
                      </a>
                      <p className="text-background/65">{c.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          </AnimatePresence>
        </div>

        {/* Day out dial */}
        <div className="max-w-6xl mx-auto mt-12 rounded-3xl bg-background/5 ring-1 ring-background/15 p-6 md:p-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">How far is a day out?</h3>
            <p className="text-background/70 text-sm max-w-2xl mx-auto">
              Pick a home port, a cruising speed and the hours you want to be away. Everything inside the round-trip
              range lights up — including two other countries.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-background/55 mb-2">Home port</p>
              <div className="flex flex-col gap-2">
                {homePorts.map((h) => (
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
                <label htmlFor="fvg-speed" className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-2 text-background/75">
                    <Gauge className="h-4 w-4" /> Cruising speed
                  </span>
                  <span className="font-semibold">{speed} kn</span>
                </label>
                <input
                  id="fvg-speed"
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-[0.15em] text-background/45 mt-1">
                  <span>Sail / lagoon boat</span>
                  <span>Fast planing</span>
                </div>
              </div>

              <div>
                <label htmlFor="fvg-hours" className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-2 text-background/75">
                    <Clock className="h-4 w-4" /> Hours out
                  </span>
                  <span className="font-semibold">{hours} h</span>
                </label>
                <input
                  id="fvg-hours"
                  type="range"
                  min={2}
                  max={14}
                  step={1}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="rounded-2xl bg-primary/15 ring-1 ring-primary/30 px-5 py-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-background/60">Round-trip reach</p>
                <p className="text-2xl font-bold">{rangeNm} nautical miles</p>
                <p className="text-xs text-background/70 mt-1">
                  {reachable.length} of {seaDestinations.length} destinations inside a day out
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {[{ id: 'all' as const, label: 'Everything' }, ...destinationGroups.map((g) => ({ id: g.id, label: g.label }))].map(
              (chip) => (
                <button
                  key={chip.id}
                  onClick={() => setGroupFilter(chip.id)}
                  aria-pressed={groupFilter === chip.id}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                    groupFilter === chip.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/10 text-background/75 hover:bg-background/20'
                  )}
                >
                  {chip.label}
                </button>
              )
            )}
          </div>

          <div className="space-y-8">
            {destinationGroups
              .filter((g) => groupFilter === 'all' || groupFilter === g.id)
              .map((g) => {
                const items = seaDestinations
                  .filter((d) => d.group === g.id)
                  .sort((a, b) => a.from[hub] - b.from[hub]);
                if (!items.length) return null;
                const inReach = items.filter((d) => d.from[hub] <= rangeNm).length;
                return (
                  <div key={g.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-background/80">{g.label}</h4>
                        <p className="text-xs text-background/55">{g.blurb}</p>
                      </div>
                      <span className="text-[11px] text-background/55">
                        {inReach}/{items.length} in reach
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {items.map((d) => {
                        const nm = d.from[hub];
                        const on = nm <= rangeNm;
                        return (
                          <motion.div
                            key={d.id}
                            layout
                            animate={{ opacity: on ? 1 : 0.4 }}
                            className={cn(
                              'overflow-hidden rounded-2xl ring-1 transition-colors',
                              on ? 'bg-primary/20 ring-primary/40' : 'bg-background/5 ring-background/10'
                            )}
                          >
                            {d.image && (
                              <img
                                src={d.image}
                                alt={d.name}
                                loading="lazy"
                                className="h-24 w-full object-cover"
                              />
                            )}
                            <div className="p-4">
                              <div className="flex items-baseline justify-between gap-2">
                                <h5 className="font-semibold text-sm">{d.name}</h5>
                                <span className="text-[11px] text-background/60 shrink-0">{nm} nm</span>
                              </div>
                              <p className="mt-1 text-xs text-background/70 leading-relaxed">{d.note}</p>
                              {d.link && (
                                <a
                                  href={d.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center gap-1 text-[11px] text-background/80 underline underline-offset-4"
                                >
                                  More <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {!on && (
                                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-background/45">
                                  Overnight it
                                </p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Season & wind band */}
        <div className="max-w-6xl mx-auto mt-12 rounded-3xl bg-background/5 ring-1 ring-background/15 p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold">The boating year</h3>
              <p className="text-sm text-background/65">
                Bora days per month against sea temperature — the two numbers that decide when the covers come off.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-background/60">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Bora days
              </span>
              <span className="flex items-center gap-1.5">
                <Thermometer className="h-3.5 w-3.5" /> Sea °C
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 md:grid-cols-12">
            {boraMonths.map((m) => (
              <div key={m.month} className="group text-center" title={m.note}>
                <div className="flex h-28 items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(m.boraDays / maxBora) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-5 rounded-t bg-primary/80 group-hover:bg-primary"
                  />
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-background/55">{m.month}</p>
                <p className="text-[11px] font-semibold">{m.sea}°</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-background/55">
            Hover a month for what it actually feels like. May, September and early October are the months locals
            protect; January and February belong to the Bora and the boatyard.
          </p>
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
              {'link' in f && f.link && (
                <a
                  href={f.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-background/85 underline underline-offset-4"
                >
                  {f.linkLabel ?? 'Read more'} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
