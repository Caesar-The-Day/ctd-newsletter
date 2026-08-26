import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Plane, Fuel, ShoppingBasket, Stethoscope, Mountain, Globe2, Info, MapPin } from 'lucide-react';
import borderTrieste from '@/assets/friuli/borders/border-trieste.jpg';
import borderGorizia from '@/assets/friuli/borders/border-gorizia.jpg';
import borderTarvisio from '@/assets/friuli/borders/border-tarvisio.jpg';

type Country = 'it' | 'si' | 'at' | 'hr';

interface Reach {
  label: string;
  time: string;
  minutes: number;
  country: Country;
}

interface Airport extends Reach {
  code: string;
}

interface Base {
  id: string;
  name: string;
  country: string;
  image: string;
  alt: string;
  crossings: Reach[];
  airports: Airport[];
  errands: { icon: typeof Fuel; label: string; note: string }[];
  summary: string;
}

const countryLabel: Record<Country, string> = {
  it: 'Italy',
  si: 'Slovenia',
  at: 'Austria',
  hr: 'Croatia'
};

const bases: Base[] = [
  {
    id: 'trieste',
    name: 'Trieste',
    country: 'Slovenia in 15 minutes, Croatia in an hour',
    image: borderTrieste,
    alt: 'The Karst plateau above Trieste dropping to the deep blue Adriatic, a border road winding along the ridge',
    summary:
      'A city that treats two other countries as suburbs. Slovene bakeries in the Karst villages, Croatian coast for the weekend, Ljubljana for a concert.',
    crossings: [
      { label: 'Slovenian border (Fernetti / Lipica)', time: '~15 min', minutes: 15, country: 'si' },
      { label: 'Ljubljana', time: '~1h30', minutes: 90, country: 'si' },
      { label: 'Croatian Istria (Buje, Umag)', time: '~1h', minutes: 60, country: 'hr' }
    ],
    airports: [
      { code: 'TRS', label: 'Trieste Airport (Ronchi)', name: 'Trieste Airport (Ronchi)', time: '~35 min, direct rail link', minutes: 35, country: 'it' } as Airport & { name: string },
      { code: 'LJU', label: 'Ljubljana', time: '~1h45', minutes: 105, country: 'si' },
      { code: 'VCE', label: 'Venice Marco Polo', time: '~2h', minutes: 120, country: 'it' }
    ],
    errands: [
      { icon: Fuel, label: 'Fuel', note: 'Slovenian pumps just over the border are habitually cheaper; the queue at Fernetti is the proof.' },
      { icon: ShoppingBasket, label: 'Groceries', note: 'Slovene supermarkets in Sežana and Divača are a routine run for many Trieste households.' },
      { icon: Stethoscope, label: 'Dentistry', note: 'Cross-border dental clinics in Slovenia and Croatia are a long-standing habit for Italians — privately paid, not covered by the SSN.' }
    ]
  },
  {
    id: 'gorizia',
    name: 'Gorizia',
    country: 'One city, two countries',
    image: borderGorizia,
    alt: 'Piazza Transalpina in Gorizia at low sun, the Italy–Slovenia border line running through the paving',
    summary:
      'Gorizia and Nova Gorica share a square and a tram-less border you walk across. They hold the European Capital of Culture title jointly for 2025 — the only such pairing in Europe.',
    crossings: [
      { label: 'Nova Gorica (Slovenia)', time: 'On foot, ~5 min', minutes: 5, country: 'si' },
      { label: 'Vipava valley wine country', time: '~30 min', minutes: 30, country: 'si' },
      { label: 'Ljubljana', time: '~1h30', minutes: 90, country: 'si' }
    ],
    airports: [
      { code: 'TRS', label: 'Trieste Airport (Ronchi)', time: '~30 min', minutes: 30, country: 'it' },
      { code: 'LJU', label: 'Ljubljana', time: '~1h30', minutes: 90, country: 'si' },
      { code: 'VCE', label: 'Venice Marco Polo', time: '~1h45', minutes: 105, country: 'it' }
    ],
    errands: [
      { icon: ShoppingBasket, label: 'Groceries', note: 'Two national price structures within walking distance; residents shop the difference weekly.' },
      { icon: Fuel, label: 'Fuel', note: 'Slovenian stations are a five-minute drive, not an expedition.' },
      { icon: Globe2, label: 'Culture', note: 'Two national theatre and festival programmes for the price of one address.' }
    ]
  },
  {
    id: 'tarvisio',
    name: 'Tarvisio',
    country: 'Italy, Austria and Slovenia meet here',
    image: borderTarvisio,
    alt: 'The Val Canale near Tarvisio, an alpine valley ringed by the Julian Alps with a small town on the valley floor',
    summary:
      'The Val Canale is the only place in Italy where three countries and four languages meet in one valley. Austria is closer than the regional capital.',
    crossings: [
      { label: 'Austrian border (Coccau)', time: '~10 min', minutes: 10, country: 'at' },
      { label: 'Kranjska Gora, Slovenia', time: '~25 min', minutes: 25, country: 'si' },
      { label: 'Villach, Austria', time: '~30 min', minutes: 30, country: 'at' }
    ],
    airports: [
      { code: 'KLU', label: 'Klagenfurt, Austria', time: '~1h', minutes: 60, country: 'at' },
      { code: 'LJU', label: 'Ljubljana', time: '~1h15', minutes: 75, country: 'si' },
      { code: 'TRS', label: 'Trieste Airport (Ronchi)', time: '~1h45', minutes: 105, country: 'it' }
    ],
    errands: [
      { icon: Mountain, label: 'Skiing', note: 'The Sella Nevea and Kranjska Gora areas are local; Austrian resorts sit within a short drive.' },
      { icon: ShoppingBasket, label: 'Groceries', note: "Villach for the big Austrian shop, Tarvisio's Saturday market for everything else." },
      { icon: Stethoscope, label: 'Healthcare', note: 'Routine care is Italian and local; anything specialist means Udine, roughly an hour south.' }
    ]
  }
];

const MAX_MIN = 120;

/** Smoothly counts to a target number. */
function useCountTo(value: number) {
  const [display, setDisplay] = useState(value);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = display;
    const start = performance.now();
    const dur = 600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * e));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}

function countryClass(c: Country) {
  switch (c) {
    case 'si':
      return 'text-primary';
    case 'at':
      return 'text-accent-foreground';
    case 'hr':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
}

/** Radial time chart: base at centre, destinations plotted by travel time. */
function ReachRadar({
  base,
  active,
  onHover
}: {
  base: Base;
  active: string | null;
  onHover: (label: string | null) => void;
}) {
  const reduced = useReducedMotion();
  const size = 320;
  const c = size / 2;
  const rMax = c - 30;
  const rings = [15, 30, 60, 90, 120];

  const points = [...base.crossings, ...base.airports].map((p, idx, arr) => {
    const angle = (idx / arr.length) * Math.PI * 2 - Math.PI / 2;
    const r = 22 + (Math.min(p.minutes, MAX_MIN) / MAX_MIN) * (rMax - 22);
    return {
      ...p,
      isAirport: 'code' in p,
      x: c + Math.cos(angle) * r,
      y: c + Math.sin(angle) * r
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[340px] mx-auto" role="img" aria-label={`Travel times from ${base.name}`}>
      {rings.map((m, i) => (
        <motion.circle
          key={m}
          cx={c}
          cy={c}
          r={22 + (m / MAX_MIN) * (rMax - 22)}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
          strokeDasharray="3 5"
          initial={reduced ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: `${c}px ${c}px` }}
        />
      ))}

      {rings.map((m) => (
        <text
          key={`l-${m}`}
          x={c}
          y={c - (22 + (m / MAX_MIN) * (rMax - 22)) + 10}
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: 8, letterSpacing: '0.08em' }}
        >
          {m}m
        </text>
      ))}

      {points.map((p, i) => (
        <motion.line
          key={`line-${p.label}-${i}`}
          x1={c}
          y1={c}
          x2={p.x}
          y2={p.y}
          stroke="hsl(var(--primary))"
          strokeWidth={active === p.label ? 2 : 1}
          strokeOpacity={active === p.label ? 0.8 : 0.25}
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
        />
      ))}

      {/* centre */}
      <circle cx={c} cy={c} r={16} fill="hsl(var(--primary))" fillOpacity={0.14} />
      <circle cx={c} cy={c} r={6} fill="hsl(var(--primary))" />
      <text x={c} y={c + 30} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>
        {base.name}
      </text>

      {points.map((p, i) => (
        <motion.g
          key={`pt-${p.label}-${i}`}
          initial={reduced ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 220, damping: 16 }}
          style={{ transformOrigin: `${p.x}px ${p.y}px`, cursor: 'pointer' }}
          onMouseEnter={() => onHover(p.label)}
          onMouseLeave={() => onHover(null)}
        >
          <circle
            cx={p.x}
            cy={p.y}
            r={active === p.label ? 9 : 5}
            fill={p.isAirport ? 'hsl(var(--background))' : 'hsl(var(--primary))'}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
          <text
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            className="fill-foreground"
            style={{ fontSize: 9, fontWeight: 600, opacity: active === p.label ? 1 : 0.72 }}
          >
            {'code' in p ? (p as { code: string }).code : p.label.split(' (')[0].split(',')[0]}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

function TimeBar({
  item,
  active,
  onHover,
  delay,
  prefix
}: {
  item: Reach & { code?: string };
  active: string | null;
  onHover: (l: string | null) => void;
  delay: number;
  prefix?: boolean;
}) {
  const pct = Math.min(100, (item.minutes / MAX_MIN) * 100);
  const isActive = active === item.label;
  return (
    <li
      onMouseEnter={() => onHover(item.label)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        'rounded-md px-2 py-1.5 transition-colors',
        isActive ? 'bg-primary/10' : 'hover:bg-muted/60'
      )}
    >
      <div className="flex justify-between gap-3 text-sm mb-1">
        <span className="text-foreground/85">
          {prefix && item.code && <span className="font-bold text-primary mr-1">{item.code}</span>}
          {item.label}
        </span>
        <span className="font-semibold whitespace-nowrap tabular-nums">{item.time}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', item.country === 'it' ? 'bg-muted-foreground/50' : 'bg-primary')}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay, duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{countryLabel[item.country]}</p>
    </li>
  );
}

export default function FriuliCrossBorder() {
  const [id, setId] = useState(bases[0].id);
  const [hover, setHover] = useState<string | null>(null);
  const base = bases.find((b) => b.id === id)!;
  const reduced = useReducedMotion();

  const nearest = Math.min(...base.crossings.map((c) => c.minutes));
  const shownNearest = useCountTo(nearest);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-muted/30">
      {/* Drifting border-line motif */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.16]">
        <motion.svg
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          className="w-full h-full"
          animate={reduced ? undefined : { x: [0, -60, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M-100 300 C 200 180, 340 340, 560 220 S 900 90, 1300 200"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="14 12"
          />
          <path
            d="M-100 150 C 260 60, 420 240, 700 140 S 1000 260, 1300 110"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
            strokeDasharray="6 14"
          />
        </motion.svg>
      </div>
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Globe2 className="h-10 w-10 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Living on Three Borders</h2>
          <p className="text-lg text-muted-foreground">
            In Friuli, "abroad" is a short drive. Pick a base and see what having Slovenia and Austria next door actually gets you.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Nearest border from {base.name}:{' '}
            <span className="text-primary font-bold text-xl tabular-nums align-middle">{shownNearest}</span> minutes
          </p>
        </div>

        {/* Photo-led base selector */}
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 mb-8" role="tablist" aria-label="Border bases">
          {bases.map((b) => {
            const selected = b.id === id;
            return (
              <motion.button
                key={b.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setId(b.id)}
                layout
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                className={cn(
                  'relative overflow-hidden rounded-xl border-2 text-left h-36 sm:h-48 group',
                  selected ? 'border-primary sm:flex-[2.2]' : 'border-border sm:flex-1'
                )}
              >
                <img
                  src={b.image}
                  alt={b.alt}
                  width={1600}
                  height={1000}
                  loading="lazy"
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover transition-all duration-700',
                    selected ? 'scale-105 saturate-100' : 'saturate-[0.45] group-hover:saturate-90 scale-100'
                  )}
                />
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500',
                    selected
                      ? 'bg-gradient-to-t from-background via-background/40 to-transparent'
                      : 'bg-gradient-to-t from-background/95 via-background/60 to-background/30'
                  )}
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className={cn('h-4 w-4', selected ? 'text-primary' : 'text-muted-foreground')} />
                    <span className="font-bold text-foreground">{b.name}</span>
                  </div>
                  <AnimatePresence>
                    {selected && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-primary font-medium mt-1"
                      >
                        {b.country}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto rounded-2xl border-2 border-primary/20 bg-card/90 backdrop-blur-sm p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={base.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <div className="grid lg:grid-cols-[1.25fr_1fr] gap-8 items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{base.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">{base.country}</p>
                  <p className="text-foreground/80 mb-6 leading-relaxed">{base.summary}</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-background/70 border border-border p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-primary" /> Border reach
                      </p>
                      <ul className="space-y-2">
                        {[...base.crossings]
                          .sort((a, b) => a.minutes - b.minutes)
                          .map((cItem, i) => (
                            <TimeBar key={cItem.label} item={cItem} active={hover} onHover={setHover} delay={0.1 + i * 0.1} />
                          ))}
                      </ul>
                    </div>

                    <div className="rounded-lg bg-background/70 border border-border p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-2">
                        <Plane className="h-4 w-4 text-primary" /> Airports in range
                      </p>
                      <ul className="space-y-2">
                        {[...base.airports]
                          .sort((a, b) => a.minutes - b.minutes)
                          .map((a, i) => (
                            <TimeBar key={a.code} item={a} active={hover} onHover={setHover} delay={0.15 + i * 0.1} prefix />
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 text-center">
                    Reach radar — travel time from {base.name}
                  </p>
                  <ReachRadar base={base} active={hover} onHover={setHover} />
                  <p className="text-[11px] text-muted-foreground text-center mt-2">
                    Filled dots are land crossings, hollow dots airports. Hover to match a point with its row.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mt-6">
                {base.errands.map((e, i) => {
                  const EIcon = e.icon;
                  return (
                    <motion.div
                      key={e.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.09, duration: 0.4 }}
                      className="group rounded-lg bg-muted/50 border border-border p-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1 text-primary">
                        <EIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" />
                        <span className="text-sm font-semibold">{e.label}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{e.note}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 mt-6 rounded-lg border-l-4 border-l-primary border border-border bg-background/80 p-4">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">The practical caveat:</span> cheap fuel and cross-border dentistry are
              conveniences, not a plan. Your residency, tax position and healthcare enrolment stay Italian — treat foreign clinics as
              private, out-of-pocket care unless you have arranged EU cover.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
