import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrainFront,
  Bus,
  Footprints,
  Bike,
  Car,
  Route,
  Clock,
  Users,
  Lightbulb,
  Euro,
  CalendarClock,
  Check,
  X,
  Compass,
} from 'lucide-react';

type ModeId = 'metro' | 'rail' | 'bus' | 'walk' | 'bike' | 'car';

interface Mode {
  id: ModeId;
  label: string;
  tag: string;
  icon: typeof TrainFront;
  photo: string;
  coverage: string;
  frequency: string;
  hours: string;
  cost: string;
  worksIf: string[];
  failsIf: string[];
  reliability: number; // 1-5
  verdict: string;
}

const PHOTO_DIR = '/images/lazio/rome-mobility';

const MODES: Mode[] = [
  {
    id: 'metro',
    label: 'Metro',
    tag: '€1.50',
    icon: TrainFront,
    photo: 'metro',
    coverage:
      'Three lines (A, B/B1, C) covering roughly 60 km for a city of 2.7 million. Archaeology under every street is the reason it stops where it stops.',
    frequency: 'Every 4–8 minutes at peak, 8–12 off-peak',
    hours: '05:30–23:30 (Fri/Sat until 01:30)',
    cost: '€1.50 single (100 min) · €35 monthly Metrebus Roma · free for over-70 Rome residents',
    worksIf: ['Prati / Ottaviano', 'San Giovanni', 'Ostiense–Piramide', 'Furio Camillo–Colli Albani', 'EUR'],
    failsIf: ['Monteverde', 'Trieste / Salario', 'Montesacro', 'Garbatella fringes', 'Casalotti'],
    reliability: 4,
    verdict:
      'If your address is within 10 walking minutes of Line A or B, Rome becomes an easy city. If it is not, the metro is largely irrelevant to your daily life.',
  },
  {
    id: 'rail',
    label: 'Regional rail',
    tag: '€1.50–5',
    icon: Route,
    photo: 'rail',
    coverage:
      'FL1–FL8 regional lines plus Termini and Tiburtina high-speed. The genuinely strong part of Rome mobility and the reason a car-free life is workable.',
    frequency: 'Every 15–30 min on FL1 and FL5, hourly on quieter branches',
    hours: '05:00–22:30 typical',
    cost: '€1.50–5 regional legs · €50–90 monthly for outer Metrebus zones · Naples 1h10, Florence 1h30, Milan 3h',
    worksIf: ['Anywhere near Trastevere, Tiburtina, Ostiense or Tuscolana stations', 'Weekend trips to the coast or Castelli'],
    failsIf: ['Evenings after 22:30', 'Sunday services on branch lines', 'Cross-suburb journeys that force you back through the centre'],
    reliability: 4,
    verdict:
      'Coast in 45–60 minutes, Castelli in 35, Viterbo in 1h45. Regional rail is the argument for living in Rome without owning a car.',
  },
  {
    id: 'bus',
    label: 'Bus & tram',
    tag: '€1.50',
    icon: Bus,
    photo: 'bus',
    coverage:
      'ATAC runs a very wide network — around 350 bus routes and six tram lines — that fills every gap the metro leaves. Coverage is not the problem; the timetable is.',
    frequency: 'Advertised 5–15 min, realistically 10–30 min',
    hours: '05:30–midnight, plus a night network (routes prefixed N)',
    cost: 'Same €1.50 ticket and €35 monthly pass as the metro',
    worksIf: ['Monteverde (tram 8)', 'Trastevere', 'Trieste / Nomentano', 'Anywhere on a tram corridor'],
    failsIf: ['Time-critical appointments', 'August, when frequencies thin out', 'Routes crossing the centro storico at midday'],
    reliability: 2,
    verdict:
      'Reliability is the standing complaint of every Roman. Trams (2, 3, 8, 19) are the exception — treat them as light metro and build your address around them if you can.',
  },
  {
    id: 'walk',
    label: 'Walking',
    tag: 'Free',
    icon: Footprints,
    photo: 'walk',
    coverage:
      'The historic core is compact: Piazza del Popolo to the Colosseum is a 30-minute walk. Rome rewards walking more than any other Italian capital-scale city.',
    frequency: 'Always available',
    hours: 'All day; summer afternoons are punishing',
    cost: 'Free',
    worksIf: ['Monti', 'Centro storico', 'Testaccio', 'Trastevere', 'Celio'],
    failsIf: ['Sampietrini cobbles with wheeled luggage or mobility issues', 'July and August 13:00–17:00', 'Crossing the Tiber at rush hour'],
    reliability: 5,
    verdict:
      'For a resident inside the ring, walking replaces most short journeys. Budget for good shoes: the cobbles destroy soles and ankles alike.',
  },
  {
    id: 'bike',
    label: 'Bike & scooter',
    tag: '€0.20/min',
    icon: Bike,
    photo: 'bike',
    coverage:
      'Dockless e-scooters and e-bikes are everywhere; dedicated cycle infrastructure is thin, apart from the Tiber riverside path and the Appia Antica.',
    frequency: 'On demand via app',
    hours: 'Scooter operators cap use overnight in some zones',
    cost: '€1 unlock + €0.20–0.25/min · monthly e-bike subscriptions from ~€25',
    worksIf: ['Flat riverside routes', 'EUR and Ostiense', 'Short hops the bus makes slow'],
    failsIf: ['Rome’s seven hills on a non-electric bike', 'Cobbled centro streets', 'Anyone uncomfortable in unprotected traffic'],
    reliability: 3,
    verdict:
      'A useful supplement, not a primary mode. The Tiber path is the one genuinely pleasant cycling corridor in the city.',
  },
  {
    id: 'car',
    label: 'Car',
    tag: '€90–200/mo',
    icon: Car,
    photo: 'car',
    coverage:
      'The GRA ring road and radial consular roads move you around the outside of the city. Inside it, ZTL cameras and parking define everything.',
    frequency: 'n/a',
    hours: 'ZTL centro storico: Mon–Fri 06:30–18:00, Sat 14:00–18:00; Trastevere and San Lorenzo have evening ZTLs',
    cost: '€1.20/hour blue-line parking · €90–200/month garage · insurance well above the national average',
    worksIf: ['Outer neighbourhoods with garages', 'Anyone regularly leaving the city', 'Households with mobility needs'],
    failsIf: ['Centro storico, Trastevere, Testaccio, San Lorenzo residents', 'Anyone without a permanent parking spot'],
    reliability: 2,
    verdict:
      'Inside the ring a car is a liability. Live semi-central, use rail for the region, and rent for the weekends that actually need one — ZTL fines arrive by post months later.',
  },
];

/* --------------------------- transit schematic ---------------------------- */

interface SchemaNode {
  id: string;
  label: string;
  x: number;
  y: number;
  /** modes that genuinely serve this place */
  served: ModeId[];
}

/** Simplified schematic of the city: centre, the three metro lines, the ring. */
const SCHEMA_NODES: SchemaNode[] = [
  { id: 'ottaviano', label: 'Prati / Ottaviano', x: 118, y: 92, served: ['metro', 'bus', 'walk'] },
  { id: 'flaminio', label: 'Flaminio', x: 196, y: 62, served: ['metro', 'bus', 'bike'] },
  { id: 'termini', label: 'Termini', x: 300, y: 128, served: ['metro', 'rail', 'bus'] },
  { id: 'monti', label: 'Monti / Centro', x: 232, y: 140, served: ['walk', 'bus'] },
  { id: 'trastevere', label: 'Trastevere', x: 176, y: 186, served: ['rail', 'bus', 'walk', 'bike'] },
  { id: 'monteverde', label: 'Monteverde', x: 96, y: 200, served: ['bus'] },
  { id: 'sangiovanni', label: 'San Giovanni', x: 336, y: 190, served: ['metro', 'bus'] },
  { id: 'tiburtina', label: 'Tiburtina', x: 396, y: 96, served: ['rail', 'metro', 'bus'] },
  { id: 'trieste', label: 'Trieste / Salario', x: 330, y: 52, served: ['bus'] },
  { id: 'ostiense', label: 'Ostiense', x: 244, y: 236, served: ['metro', 'rail', 'bike'] },
  { id: 'eur', label: 'EUR', x: 268, y: 292, served: ['metro', 'car', 'bike'] },
  { id: 'montesacro', label: 'Montesacro', x: 418, y: 40, served: ['bus', 'car'] },
  { id: 'casalotti', label: 'Casalotti', x: 44, y: 118, served: ['bus', 'car'] },
];

const SCHEMA_LINES: { id: string; d: string; label: string; modes: ModeId[] }[] = [
  { id: 'a', label: 'Metro A', d: 'M118 92 L196 62 L300 128 L336 190', modes: ['metro'] },
  { id: 'b', label: 'Metro B/B1', d: 'M418 40 L396 96 L300 128 L244 236 L268 292', modes: ['metro'] },
  { id: 'c', label: 'Metro C', d: 'M336 190 L400 214', modes: ['metro'] },
  { id: 'fl', label: 'Regional rail', d: 'M96 240 L176 186 L244 236 L396 96 L448 70', modes: ['rail'] },
];

function TransitSchematic({ activeMode }: { activeMode: ModeId }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">
          Who this mode actually reaches
        </p>
      </div>
      <svg viewBox="0 0 500 330" className="w-full h-auto" role="img" aria-label="Schematic map of Rome transit coverage">
        {/* GRA ring */}
        <ellipse
          cx="250"
          cy="165"
          rx="228"
          ry="150"
          className={activeMode === 'car' ? 'stroke-primary' : 'stroke-border'}
          strokeWidth={activeMode === 'car' ? 3 : 1.5}
          strokeDasharray="6 7"
          fill="none"
        />
        {/* Tiber */}
        <path
          d="M150 20 C 190 100, 150 160, 210 230 S 240 300, 232 320"
          className={activeMode === 'bike' ? 'stroke-primary' : 'stroke-muted-foreground/25'}
          strokeWidth={activeMode === 'bike' ? 5 : 3}
          fill="none"
          strokeLinecap="round"
        />
        {/* lines */}
        {SCHEMA_LINES.map((l) => {
          const on = l.modes.includes(activeMode);
          return (
            <motion.path
              key={l.id}
              d={l.d}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={on ? 'stroke-primary' : 'stroke-muted-foreground/20'}
              animate={{ strokeWidth: on ? 6 : 3, opacity: on ? 1 : 0.55 }}
              transition={{ duration: 0.35 }}
            />
          );
        })}
        {/* nodes */}
        {SCHEMA_NODES.map((n) => {
          const on = n.served.includes(activeMode);
          return (
            <g key={n.id}>
              <motion.circle
                cx={n.x}
                cy={n.y}
                className={on ? 'fill-primary' : 'fill-muted-foreground/30'}
                animate={{ r: on ? 7 : 4, opacity: on ? 1 : 0.5 }}
                transition={{ duration: 0.3 }}
              />
              <motion.text
                x={n.x + 11}
                y={n.y + 4}
                className={`text-[11px] ${on ? 'fill-foreground' : 'fill-muted-foreground'}`}
                animate={{ opacity: on ? 1 : 0.45 }}
                transition={{ duration: 0.3 }}
              >
                {n.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-muted-foreground mt-2">
        Schematic, not to scale. Highlighted dots are the neighbourhoods this mode genuinely serves;
        the dashed ring is the GRA and the pale curve is the Tiber cycle path.
      </p>
    </div>
  );
}

/* -------------------------------- corridors ------------------------------- */

type Pressure = 'Heavy' | 'Moderate' | 'Seasonal';

interface Corridor {
  name: string;
  mode: string;
  photo: string;
  pressure: Pressure;
  peak: string;
  problem: string;
  workaround: string;
}

const CORRIDORS: Corridor[] = [
  {
    name: 'Termini ↔ Colosseo',
    mode: 'Metro B southbound',
    photo: 'metro',
    pressure: 'Heavy',
    peak: '09:00–11:00 and 16:00–18:00, March to October',
    problem:
      'Two stops that carry most of the city’s day-trip traffic. Platforms at Termini back up and you routinely let two trains pass.',
    workaround:
      'Walk it in 20 minutes via Via Cavour and Monti, or take tram 3 from Porta Maggiore round the outside.',
  },
  {
    name: 'Ottaviano / Vatican',
    mode: 'Metro A northbound',
    photo: 'metro',
    pressure: 'Heavy',
    peak: 'Weekday mornings 08:00–11:00; Wednesdays (papal audience) all morning',
    problem:
      'Museum queues empty into a single station. Wednesday and Sunday add pilgrimage crowds on top of commuters.',
    workaround:
      'Use Cipro one stop further out — same walk to the museums, a fraction of the crush. Or take the FL3 to San Pietro.',
  },
  {
    name: 'Bus 64 and 40 · Termini ↔ St. Peter’s',
    mode: 'Bus',
    photo: 'bus',
    pressure: 'Heavy',
    peak: 'All day, every day in season',
    problem:
      'The most notorious pickpocket corridor in Italy, and packed to the doors with luggage for most of its length.',
    workaround:
      'Take the 40 Express only if you must, otherwise metro A to Cipro. Residents heading that way generally walk from Piazza Navona.',
  },
  {
    name: 'Spagna / Barberini',
    mode: 'Metro A',
    photo: 'walk',
    pressure: 'Moderate',
    peak: 'Midday to early evening',
    problem:
      'Spagna exits into the Trinità dei Monti bottleneck; the station is occasionally closed on crowd-control grounds at weekends.',
    workaround:
      'Get off at Flaminio and walk down Via del Babuino, or use Barberini and approach from above.',
  },
  {
    name: 'Trastevere & Campo de’ Fiori',
    mode: 'Walking / night buses',
    photo: 'walk',
    pressure: 'Moderate',
    peak: 'Thursday–Saturday, 21:00–02:00',
    problem:
      'Evening crush, noise complaints and near-impossible taxi pickup. Residents on Via della Lungaretta live inside a nightly bar crawl.',
    workaround:
      'Cross at Ponte Sisto on foot and pick up tram 8 at Belli; taxis are far easier from Piazza Sonnino than inside the lanes.',
  },
  {
    name: 'Leonardo Express · Termini ↔ Fiumicino',
    mode: 'Airport rail',
    photo: 'rail',
    pressure: 'Seasonal',
    peak: 'Arrival banks: 07:00–10:00 and 18:00–21:00, June to September',
    problem:
      '€14 for 32 minutes, and in high season it is standing-room with suitcases from the first metre.',
    workaround:
      'The FL1 regional to Trastevere or Ostiense costs €8, takes ten minutes longer and is usually half-empty.',
  },
  {
    name: 'Lungotevere & the Tiber bridges',
    mode: 'Car / bus',
    photo: 'bike',
    pressure: 'Heavy',
    peak: 'Weekday 07:30–09:30 and 17:00–19:30',
    problem:
      'Every north–south car movement funnels onto a handful of bridges. Buses on the embankment lose 15–20 minutes to it.',
    workaround:
      'Cross on foot or by bike on the riverside path below road level — it bypasses the jam entirely.',
  },
  {
    name: 'Piazza Venezia',
    mode: 'All surface transport',
    photo: 'car',
    pressure: 'Heavy',
    peak: 'Continuous; worse during Metro C works',
    problem:
      'The single worst interchange in the city: no metro station, a dozen bus lines converging, and an open archaeological worksite.',
    workaround:
      'Never plan a change here. Break the journey at Argentina or Colosseo and walk the last stretch.',
  },
];

const pressureStyles: Record<Pressure, { chip: string; bar: string; fill: number }> = {
  Heavy: { chip: 'bg-destructive/15 text-destructive border-destructive/30', bar: 'bg-destructive', fill: 100 },
  Moderate: { chip: 'bg-primary/15 text-primary border-primary/30', bar: 'bg-primary', fill: 62 },
  Seasonal: { chip: 'bg-muted text-muted-foreground border-border', bar: 'bg-muted-foreground/50', fill: 38 },
};

function Photo({ name, alt, className }: { name: string; alt: string; className?: string }) {
  return (
    <img
      src={`${PHOTO_DIR}/${name}-1024.webp`}
      srcSet={`${PHOTO_DIR}/${name}-640.webp 640w, ${PHOTO_DIR}/${name}-1024.webp 1024w`}
      sizes="(max-width: 767px) 100vw, 50vw"
      alt={alt}
      loading="lazy"
      decoding="async"
      width={1024}
      height={576}
      className={className}
    />
  );
}

function CorridorCard({ c }: { c: Corridor }) {
  const [open, setOpen] = useState(false);
  const style = pressureStyles[c.pressure];

  return (
    <Card className="border-border/60 h-full overflow-hidden">
      <div className="relative h-28 overflow-hidden">
        <Photo name={c.photo} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        <span
          className={`absolute top-3 right-3 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${style.chip}`}
        >
          {c.pressure}
        </span>
      </div>

      <CardContent className="p-5 -mt-6 relative">
        <h4 className="text-lg font-bold text-foreground leading-snug">{c.name}</h4>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{c.mode}</p>

        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${style.bar}`}
            initial={{ width: 0 }}
            whileInView={{ width: `${style.fill}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <p className="flex items-start gap-2 text-xs text-muted-foreground mt-3">
          <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{c.peak}</span>
        </p>

        <p className="text-sm text-foreground/90 leading-relaxed mt-3">{c.problem}</p>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Lightbulb className="h-4 w-4" />
          {open ? 'Hide the workaround' : 'Show the resident workaround'}
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <p className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm text-foreground/90 leading-relaxed">
                {c.workaround}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

/* --------------------------------- section -------------------------------- */

export default function RomeMobilityExplorer() {
  const [activeMode, setActiveMode] = useState<ModeId>('metro');
  const [heavyOnly, setHeavyOnly] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mode = MODES.find((m) => m.id === activeMode) ?? MODES[0];
  const ModeIcon = mode.icon;
  const corridors = heavyOnly ? CORRIDORS.filter((c) => c.pressure === 'Heavy') : CORRIDORS;

  return (
    <section
      ref={sectionRef}
      className={`py-20 md:py-28 bg-muted/30 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      aria-labelledby="rome-mobility-heading"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <TrainFront className="w-4 h-4" />
            Rome, practically
          </div>
          <h2
            id="rome-mobility-heading"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            How you actually get around Rome
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Six ways to move through the city, what each one costs, where it works and where it
            quietly fails you — followed by the corridors where living here means sharing your
            commute with thirty-five million visitors a year.
          </p>
        </div>

        {/* Mode selector */}
        <div
          className="flex gap-3 overflow-x-auto pb-3 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center"
          role="tablist"
          aria-label="Transit modes"
        >
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = m.id === activeMode;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveMode(m.id)}
                className={`relative shrink-0 w-[104px] rounded-xl border px-3 py-3 text-center transition-all ${
                  active
                    ? 'border-primary/50 bg-primary/10 -translate-y-0.5 shadow-soft'
                    : 'border-border bg-card hover:border-primary/30 hover:-translate-y-0.5'
                }`}
              >
                <Icon
                  className={`h-6 w-6 mx-auto mb-1.5 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <span className="block text-xs font-semibold text-foreground leading-tight">
                  {m.label}
                </span>
                <span className="block text-[11px] text-muted-foreground mt-0.5">{m.tag}</span>
                {active && (
                  <motion.span
                    layoutId="rome-mode-indicator"
                    className="absolute -bottom-px left-4 right-4 h-0.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mode panel */}
        <Card className="mb-16 border-border/60 overflow-hidden shadow-soft">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="relative h-44 md:h-56 overflow-hidden">
                <Photo
                  name={mode.photo}
                  alt={`${mode.label} in Rome`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-4 left-5 md:left-8 flex items-center gap-3">
                  <div className="rounded-full bg-background/90 backdrop-blur-sm p-3">
                    <ModeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">{mode.label}</h3>
                </div>
              </div>

              <CardContent className="p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed mb-6">{mode.coverage}</p>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: CalendarClock, label: 'Frequency', value: mode.frequency },
                    { icon: Clock, label: 'Hours', value: mode.hours },
                    { icon: Euro, label: 'Cost', value: mode.cost },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border/60 bg-background p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <s.icon className="h-4 w-4 text-primary" />
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          {s.label}
                        </p>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                    <p className="text-sm font-bold text-foreground mb-3">Works well if you live in…</p>
                    <ul className="space-y-2">
                      {mode.worksIf.map((w, i) => (
                        <motion.li
                          key={w}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * i, duration: 0.25 }}
                          className="flex items-start gap-2 text-sm text-foreground/90"
                        >
                          <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                          <span>{w}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 p-5">
                    <p className="text-sm font-bold text-foreground mb-3">Falls apart if…</p>
                    <ul className="space-y-2">
                      {mode.failsIf.map((f, i) => (
                        <motion.li
                          key={f}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * i, duration: 0.25 }}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <X className="h-4 w-4 mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <TransitSchematic activeMode={mode.id} />
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-sm font-semibold text-foreground">Resident reliability</span>
                  <div
                    className="flex gap-1.5 flex-1 min-w-[160px] max-w-xs"
                    aria-label={`${mode.reliability} out of 5`}
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.span
                        key={i}
                        className={`h-2.5 flex-1 rounded-full ${
                          i <= mode.reliability
                            ? mode.reliability >= 4
                              ? 'bg-primary'
                              : mode.reliability === 3
                                ? 'bg-primary/60'
                                : 'bg-destructive'
                            : 'bg-muted'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        style={{ originX: 0 }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {mode.reliability}/5
                  </span>
                </div>

                <blockquote className="border-l-2 border-primary pl-4 text-foreground/90 italic leading-relaxed">
                  {mode.verdict}
                </blockquote>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Tourist pressure corridors */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <Users className="w-4 h-4" />
            Tourist pressure corridors
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Where tourism collides with your commute
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-5">
            Roughly 35 million visitors a year concentrate into about four square kilometres. These
            are the specific corridors residents learn to route around — tap a card for the
            workaround.
          </p>
          <Button
            variant={heavyOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setHeavyOnly((v) => !v)}
            aria-pressed={heavyOnly}
            className="rounded-full"
          >
            {heavyOnly ? 'Showing heavy pressure only' : 'Show only heavy pressure'}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {corridors.map((c) => (
            <CorridorCard key={c.name} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
