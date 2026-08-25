import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Bus,
  ChevronDown,
  Euro,
  Flame,
  
  Plane,
  Stamp,
  Stethoscope,
  Train,
  TrainFront,
  TrafficCone,
  TriangleAlert,
  Trash2,
  Users,
} from 'lucide-react';
import { useCountUp } from '@/hooks/use-count-up';
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal';

type TabId = 'cost' | 'access' | 'friction';

/* ------------------------------ header stats ----------------------------- */

const STATS = [
  { value: 2.7, suffix: 'M', decimals: 1, label: 'Residents', sub: 'in the comune' },
  { value: 35, suffix: 'M', decimals: 0, label: 'Visitors a year', sub: 'in roughly 4 km²' },
  { value: 3, suffix: '', decimals: 0, label: 'Metro lines', sub: 'A, B/B1 and C' },
  { value: 2900, prefix: '€', decimals: 0, label: 'Monthly, a couple', sub: 'semi-central, all in' },
];

function StatCounter({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const scale = stat.decimals ? 10 : 1;
  const { count, elementRef } = useCountUp(Math.round(stat.value * scale), 1200 + index * 150);
  const shown = (count / scale).toLocaleString('en-GB', {
    minimumFractionDigits: stat.decimals,
    maximumFractionDigits: stat.decimals,
  });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className="flex-1 min-w-[130px] px-4 py-4 text-center"
    >
      <p className="text-2xl md:text-3xl font-bold text-primary tabular-nums">
        {stat.prefix ?? ''}
        {shown}
        {stat.suffix ?? ''}
      </p>
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground mt-1">
        {stat.label}
      </p>
      <p className="text-xs text-muted-foreground">{stat.sub}</p>
    </div>
  );
}

/* --------------------------------- cost ---------------------------------- */

interface Band {
  id: string;
  ring: string;
  areas: string;
  rent: string;
  /** relative bar weight, 0–100 */
  weight: number;
  buy: string;
  note: string;
  chips: string[];
}

const BANDS: Band[] = [
  {
    id: 'centre',
    ring: 'Centro storico',
    areas: 'Centro storico · Trastevere · Prati',
    rent: '€1,400–2,200 / month',
    weight: 100,
    buy: '€6,000–9,000 / m² to buy',
    note: 'Short-let competition has pushed long lets up sharply since 2022; furnished stock dominates. Restoration on a historic building is slow and permit-heavy — budget contingency and time.',
    chips: ['Condo fees €150–250', 'ZTL permit required', 'Tourist pressure year-round'],
  },
  {
    id: 'semi',
    ring: 'Semi-central',
    areas: 'Monteverde · Trieste · San Giovanni · Ostiense',
    rent: '€900–1,400 / month',
    weight: 68,
    buy: '€2,500–3,800 / m² to buy',
    note: 'The realistic band for most people who want to live in Rome rather than visit it. Close enough to walk into the core on a good day, far enough that the street still belongs to residents.',
    chips: ['Condo fees €80–180', 'Metro or tram within reach', 'Markets close the price gap'],
  },
  {
    id: 'outer',
    ring: 'Outer ring',
    areas: 'EUR periphery · Montesacro · Torrino · Casalotti',
    rent: '€650–1,000 / month',
    weight: 42,
    buy: '€1,800–2,500 / m² to buy',
    note: 'Space and parking, but you are now dependent on a bus feeder to the metro. The saving is real; the daily time cost is the trade.',
    chips: ['Condo fees €80–140', 'Car usually needed', 'Bus feeder to the metro'],
  },
];

const BUDGET = [
  { label: 'Rent', amount: 1200, hint: 'semi-central 2-bed' },
  { label: 'Utilities', amount: 175, hint: '€130–220, high summer AC load' },
  { label: 'Condo fees', amount: 130, hint: 'lifts, porters, courtyards' },
  { label: 'Food & out', amount: 600, hint: '10–20% above the Lazio average' },
  { label: 'Everything else', amount: 795, hint: 'transport, health, life' },
];
const BUDGET_TOTAL = BUDGET.reduce((s, b) => s + b.amount, 0);
const BUDGET_TONES = ['bg-primary', 'bg-primary/70', 'bg-primary/50', 'bg-accent', 'bg-muted-foreground/40'];

function CostPanel() {
  const [open, setOpen] = useState<string | null>('semi');

  return (
    <div className="space-y-8">
      <p className="text-base text-foreground leading-relaxed">
        Rome is the second most expensive city in Italy to rent in, and the gap between the centre
        and the ring is enormous. These are the numbers residents quote, not the ones in relocation
        brochures.
      </p>

      <div className="space-y-3">
        {BANDS.map((band) => {
          const isOpen = open === band.id;
          return (
            <div
              key={band.id}
              className={`rounded-xl border transition-colors ${
                isOpen ? 'border-primary/50 bg-primary/5' : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : band.id)}
                className="w-full text-left p-4 md:p-5"
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-foreground">{band.ring}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{band.areas}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-primary whitespace-nowrap">{band.rent}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{band.buy}</p>
                  </div>
                </div>

                <div className="mt-3 h-2.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${band.weight}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                </div>

                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                  {isOpen ? 'Hide detail' : 'What it really costs'}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-5 pb-5 -mt-1">
                      <p className="text-sm text-muted-foreground leading-relaxed">{band.note}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {band.chips.map((c) => (
                          <span
                            key={c}
                            className="text-xs px-2.5 py-1 rounded-full bg-background border border-border text-foreground"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground">A couple's month, semi-central</h4>
          <p className="text-sm font-semibold text-primary">€2,600–3,200</p>
        </div>
        <div className="flex h-4 rounded-full overflow-hidden bg-muted">
          {BUDGET.map((b, i) => (
            <motion.div
              key={b.label}
              className={BUDGET_TONES[i]}
              initial={{ width: 0 }}
              whileInView={{ width: `${(b.amount / BUDGET_TOTAL) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
            />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-4">
          {BUDGET.map((b, i) => (
            <div key={b.label} className="flex items-start gap-2 text-xs">
              <span className={`mt-1 w-2.5 h-2.5 rounded-sm shrink-0 ${BUDGET_TONES[i]}`} />
              <span className="text-foreground font-medium">{b.label}</span>
              <span className="text-muted-foreground">{b.hint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- access --------------------------------- */

interface Node {
  id: string;
  name: string;
  time: string;
  minutes: number;
  mode: string;
  cost: string;
  note: string;
  icon: typeof Plane;
}

const NODES: Node[] = [
  {
    id: 'fco',
    name: 'Fiumicino (FCO)',
    time: '32 min',
    minutes: 32,
    mode: 'Leonardo Express from Termini',
    cost: '€14',
    note: "Italy's main intercontinental hub, direct to North America and Asia.",
    icon: Plane,
  },
  {
    id: 'castelli',
    name: 'Castelli Romani',
    time: '35 min',
    minutes: 35,
    mode: 'Regional rail from Termini',
    cost: '€2.10–3.60',
    note: 'Frascati, Castel Gandolfo and the lake towns as an ordinary afternoon out.',
    icon: Train,
  },
  {
    id: 'cia',
    name: 'Ciampino (CIA)',
    time: '~40 min',
    minutes: 40,
    mode: 'Bus + train combo',
    cost: '€1.20–6',
    note: 'Low-cost carriers across Europe; small, chaotic, cheap.',
    icon: Plane,
  },
  {
    id: 'coast',
    name: 'The coast',
    time: '45–60 min',
    minutes: 55,
    mode: 'Regional rail (Roma–Lido, FL1)',
    cost: '€1.50–5',
    note: 'The reason living in Rome without a car is workable: a weekend out is a ticket, not an expedition.',
    icon: Train,
  },
  {
    id: 'naples',
    name: 'Naples',
    time: '1h10',
    minutes: 70,
    mode: 'High-speed rail from Termini',
    cost: '€25–45',
    note: 'Close enough for a day trip, far enough to feel like another country.',
    icon: TrainFront,
  },
  {
    id: 'florence',
    name: 'Florence',
    time: '1h30',
    minutes: 90,
    mode: 'High-speed rail from Termini',
    cost: '€30–50',
    note: 'Termini and Tiburtina make Rome the best-connected address in Italy, full stop.',
    icon: TrainFront,
  },
  {
    id: 'viterbo',
    name: 'Viterbo',
    time: '1h45',
    minutes: 105,
    mode: 'Regional rail (FL3)',
    cost: '€5–7',
    note: 'Slow line, but it keeps northern Tuscia inside reach without a car.',
    icon: Train,
  },
  {
    id: 'milan',
    name: 'Milan',
    time: '3h',
    minutes: 180,
    mode: 'High-speed rail from Termini',
    cost: '€40–90',
    note: 'City centre to city centre, faster than flying once you count the airports.',
    icon: TrainFront,
  },
];

const IN_CITY = [
  {
    icon: Train,
    title: 'Metro A, B/B1, C',
    value: '~60 km · every 4–8 min',
    note: 'Three lines for 2.7 million people, because you cannot dig anywhere without hitting archaeology. Line C is still creeping towards the centre.',
  },
  {
    icon: Bus,
    title: 'Buses and trams',
    value: 'Extensive, unpredictable',
    note: 'ATAC coverage is wide but reliability is the standing complaint of every resident.',
  },
  {
    icon: Euro,
    title: 'Monthly pass',
    value: '€35 urban · €50–90 regional',
    note: 'Over-70 Rome residents travel free on the urban network — worth checking eligibility.',
  },
];

function AccessPanel() {
  const [selected, setSelected] = useState<string>('fco');
  const node = NODES.find((n) => n.id === selected)!;
  const Icon = node.icon;
  const maxMin = 180;

  return (
    <div className="space-y-8">
      <p className="text-base text-foreground leading-relaxed">
        Rome has three metro lines for 2.7 million people — a fraction of what a city this size
        should have. What saves it is the regional rail network and the fact that the historic core
        is genuinely walkable.
      </p>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          From Termini — pick a destination
        </p>
        <div className="space-y-1.5">
          {NODES.map((n) => {
            const active = n.id === selected;
            const NIcon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => setSelected(n.id)}
                className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                  active ? 'bg-primary/10' : 'hover:bg-muted/60'
                }`}
              >
                <NIcon
                  className={`w-4 h-4 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <span
                  className={`text-sm w-36 shrink-0 ${
                    active ? 'font-semibold text-foreground' : 'text-foreground/80'
                  }`}
                >
                  {n.name}
                </span>
                <span className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.span
                    className={`block h-full rounded-full ${active ? 'bg-primary' : 'bg-primary/35'}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(n.minutes / maxMin) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </span>
                <span
                  className={`text-xs tabular-nums w-16 text-right ${
                    active ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {n.time}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">{node.name}</h4>
              <span className="text-xs text-muted-foreground">
                · {node.mode} · {node.cost}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{node.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {IN_CITY.map((c) => {
          const CIcon = c.icon;
          return (
            <div key={c.title} className="rounded-xl border border-border bg-card p-4">
              <CIcon className="w-5 h-5 text-primary mb-2" />
              <h4 className="text-sm font-bold text-foreground">{c.title}</h4>
              <p className="text-xs font-medium text-primary mt-0.5">{c.value}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">{c.note}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-xl border-2 border-destructive/50 bg-destructive/5 p-4">
        <TrafficCone className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-foreground">
            ZTL — centro storico, Trastevere, Testaccio, San Lorenzo
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            Residents get a permit for their own zone. Non-residents get fines by post, often months
            later. Inside the ring a car is a liability: parking is a blood sport. Live semi-central,
            use rail for the region, and rent a car for the weekends you actually need one.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- friction -------------------------------- */

interface Friction {
  id: string;
  icon: typeof Users;
  title: string;
  value: string;
  severity: number;
  note: string;
  workaround: string;
}

const FRICTION: Friction[] = [
  {
    id: 'tourism',
    icon: Users,
    title: 'Mass tourism',
    value: '~35M visitors a year in ~4 km²',
    severity: 5,
    note: 'Centro storico, Vatican and Colosseo are effectively theme parks from March to October.',
    workaround: 'Monti, Testaccio and Garbatella still feel like neighbourhoods. Choose the street, not the postcode.',
  },
  {
    id: 'rents',
    icon: Euro,
    title: 'Short-let pressure on rents',
    value: 'Thousands of units moved to tourist letting',
    severity: 5,
    note: 'The biggest single driver of rent rises since 2022, and the main reason locals have moved outward.',
    workaround: 'Long-let stock exists off the tourist grid — search Monteverde, Trieste and Ostiense, and sign for 4+4.',
  },
  {
    id: 'traffic',
    icon: TrafficCone,
    title: 'Traffic and parking',
    value: 'Among the worst congestion in Europe',
    severity: 5,
    note: 'Peak commutes routinely run 40–60% over free-flow times. Resident permits do not guarantee a space.',
    workaround: 'Go car-free inside the ring and use car-sharing for the handful of trips rail cannot cover.',
  },
  {
    id: 'heat',
    icon: Flame,
    title: 'Summer heat',
    value: '35–40°C stretches in July and August',
    severity: 4,
    note: 'Stone city, little shade, night temperatures that barely drop.',
    workaround: 'Romans leave in August for a reason — plan the coast, the Castelli or the mountains into your year.',
  },
  {
    id: 'bureaucracy',
    icon: Stamp,
    title: 'Bureaucracy',
    value: 'Residency, codice fiscale, health card: weeks to months',
    severity: 4,
    note: 'Appointments are scarce and often only bookable online at odd hours.',
    workaround: 'A commercialista or a patronato pays for itself in the first month.',
  },
  {
    id: 'services',
    icon: Trash2,
    title: 'Services and upkeep',
    value: 'Waste collection and roads are inconsistent',
    severity: 3,
    note: 'Varies enormously by municipio.',
    workaround: 'Walk the block on a Monday morning before you commit to it.',
  },
  {
    id: 'health',
    icon: Stethoscope,
    title: 'Healthcare',
    value: 'Excellent hospitals, long public waiting lists',
    severity: 2,
    note: "Gemelli, Umberto I and Sant'Andrea are top-tier.",
    workaround: 'Many residents hold a modest private policy for diagnostics and skip the queue.',
  },
];

function FrictionCard({ item }: { item: Friction }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = item.icon;

  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="text-left rounded-xl border border-border bg-card p-4 hover-lift transition-all hover:border-primary/40 h-full"
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3" aria-label={`Severity ${item.severity} of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < item.severity
                ? item.severity >= 5
                  ? 'bg-destructive'
                  : item.severity >= 4
                    ? 'bg-primary'
                    : 'bg-primary/60'
                : 'bg-muted'
            }`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            style={{ originX: 0 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={flipped ? 'work' : 'note'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={`text-xs leading-relaxed mt-3 ${
            flipped ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {flipped ? (
            <>
              <span className="font-semibold text-primary">The workaround · </span>
              {item.workaround}
            </>
          ) : (
            item.note
          )}
        </motion.p>
      </AnimatePresence>

      <span className="inline-block text-xs font-medium text-primary mt-3">
        {flipped ? 'Back to the problem' : 'Show the workaround'}
      </span>
    </button>
  );
}

function FrictionPanel() {
  return (
    <div className="space-y-6">
      <p className="text-base text-foreground leading-relaxed">
        None of this is a reason not to live in Rome. It is a reason to choose your street
        carefully, and to know what you are signing up for before the second summer. Tap a card for
        the workaround residents actually use.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FRICTION.map((f) => (
          <FrictionCard key={f.id} item={f} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- comparison ------------------------------- */

/** lean: -100 = strongly favours the hill town, +100 = strongly favours Rome */
const COMPARISON = [
  { metric: 'Rent, 2-bed', rome: '€1,200–1,600', town: '€450–650', lean: -70 },
  { metric: 'Buy, per m²', rome: '€3,500–6,000', town: '€900–1,500', lean: -75 },
  { metric: 'Car needed?', rome: 'No', town: 'Yes, always', lean: 45 },
  { metric: 'Hospital access', rome: 'World-class, within 20 min', town: '30–60 min to a full hospital', lean: 60 },
  { metric: 'International airport', rome: '30–40 min', town: '1h30–2h', lean: 65 },
  { metric: 'Tourist pressure', rome: 'Constant in the core', town: 'A few weekends a year', lean: -60 },
  { metric: 'English spoken', rome: 'Widely', town: 'Rarely', lean: 50 },
];

function ComparisonRow({ row, index }: { row: (typeof COMPARISON)[number]; index: number }) {
  const { isVisible, elementRef } = useStaggeredReveal();
  const romeWins = row.lean > 0;
  const magnitude = Math.abs(row.lean);

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6 py-3 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="text-right">
        <p className={`text-sm ${romeWins ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
          {row.rome}
        </p>
      </div>

      <div className="w-[38%] min-w-[110px] md:min-w-[200px] justify-self-center">
        <p className="text-[11px] uppercase tracking-wide text-center text-muted-foreground font-semibold mb-1">
          {row.metric}
        </p>
        <div className="relative h-2 rounded-full bg-muted">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3.5 bg-border" />
          <motion.span
            className={`absolute top-0 h-2 rounded-full ${romeWins ? 'bg-primary' : 'bg-accent'}`}
            initial={{ width: 0 }}
            whileInView={{ width: `${magnitude / 2}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.05 }}
            style={romeWins ? { left: '50%' } : { right: '50%' }}
          />
        </div>
      </div>

      <div>
        <p className={`text-sm ${!romeWins ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
          {row.town}
        </p>
      </div>
    </div>
  );
}

/* --------------------------------- section -------------------------------- */

const TABS: { id: TabId; label: string; icon: typeof Euro; verdict: string }[] = [
  {
    id: 'cost',
    label: 'Cost',
    icon: Euro,
    verdict:
      'A couple can live comfortably but not lavishly in Rome on roughly €2,600–3,200 a month all in, if they are semi-central and do not run two cars. The same money in Viterbo or Frosinone buys a house with a garden and a much shorter to-do list.',
  },
  {
    id: 'access',
    label: 'Getting around',
    icon: TrainFront,
    verdict:
      'Inside the ring, a car is a liability: parking is a blood sport and the ZTL cameras are unforgiving. Live semi-central, use rail for the region, and rent a car for the weekends you actually need one.',
  },
  {
    id: 'friction',
    label: 'The friction',
    icon: TriangleAlert,
    verdict:
      'Rome rewards the patient and punishes the impatient. If your daily life needs efficiency, this is the wrong city. If it needs texture, beauty and the best connections in the country, nowhere in Lazio comes close.',
  },
];

export default function RomeResidentReality() {
  const [tabId, setTabId] = useState<TabId>('cost');
  const tab = TABS.find((t) => t.id === tabId)!;

  return (
    <section className="py-20 bg-gradient-to-b from-muted/40 via-background to-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <Building2 className="w-4 h-4" />
            The capital, as a resident
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Living in Rome, not visiting it
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Forget the fountains for a moment. What matters when Rome is your address is what it
            costs, how you move, and what wears you down by the third year. Here is the honest
            ledger — both sides of it.
          </p>
        </div>

        <div className="flex flex-wrap justify-center divide-x divide-border rounded-xl border border-border bg-card/70 backdrop-blur-sm mb-8">
          {STATS.map((s, i) => (
            <StatCounter key={s.label} stat={s} index={i} />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <Button
                key={t.id}
                size="sm"
                variant={t.id === tabId ? 'default' : 'outline'}
                onClick={() => setTabId(t.id)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </Button>
            );
          })}
        </div>

        <Card className="overflow-hidden shadow-soft">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tabId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {tabId === 'cost' && <CostPanel />}
                {tabId === 'access' && <AccessPanel />}
                {tabId === 'friction' && <FrictionPanel />}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-border bg-primary/5 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-6">
              <p className="text-sm font-semibold text-primary mb-1">The verdict</p>
              <p className="text-sm text-foreground leading-relaxed">{tab.verdict}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-foreground text-center mb-1">
            Rome vs. a Lazio hill town
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Same region, same healthcare system, entirely different life.
          </p>

          <div className="rounded-xl border border-border bg-card p-4 md:p-6">
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 md:gap-6 pb-3 border-b border-border">
              <p className="text-right text-sm font-bold text-foreground">Rome (semi-central)</p>
              <p className="w-[38%] min-w-[110px] md:min-w-[200px] justify-self-center text-center text-[11px] uppercase tracking-wide text-muted-foreground">
                Leans towards
              </p>
              <p className="text-sm font-bold text-foreground">Hill town (Tuscia / Ciociaria)</p>
            </div>
            <div className="divide-y divide-border/60">
              {COMPARISON.map((row, i) => (
                <ComparisonRow key={row.metric} row={row} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
