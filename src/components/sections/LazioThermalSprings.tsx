import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Droplets,
  Thermometer,
  Euro,
  Clock,
  Car,
  LayoutGrid,
  Table2,
  Repeat,
  Sun,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import bullicameImg from '@/assets/lazio/springs/bullicame.jpg';
import papiImg from '@/assets/lazio/springs/papi.jpg';
import fiuggiImg from '@/assets/lazio/springs/fiuggi.jpg';
import acqueAlbuleImg from '@/assets/lazio/springs/acque-albule.jpg';
import cretoneImg from '@/assets/lazio/springs/cretone.jpg';
import stiglianoImg from '@/assets/lazio/springs/stigliano.jpg';

interface Spring {
  id: string;
  name: string;
  place: string;
  temp: string;
  tempC: number;
  minerals: string;
  access: 'free' | 'paid';
  price: string;
  priceLevel: 0 | 1 | 2 | 3;
  hours: string;
  fromRome: string;
  driveMin: number;
  season: 'year-round' | 'seasonal';
  verdict: string;
  resident: 'weekly' | 'occasional';
  image: string;
  link?: string;
}

const SPRINGS: Spring[] = [
  {
    id: 'bullicame',
    name: 'Bullicame',
    place: 'Viterbo (Tuscia)',
    temp: '58°C at source, ~40°C in the pools',
    tempC: 58,
    minerals: 'Sulphurous, calcium-sulphate, high sulphur smell',
    access: 'free',
    price: 'Free, public',
    priceLevel: 0,
    hours: 'Open air, effectively 24/7 (parking gates close overnight)',
    fromRome: '~1h20 by car (SS Cassia / A1 Orte)',
    driveMin: 80,
    season: 'year-round',
    resident: 'weekly',
    image: bullicameImg,
    verdict:
      'The one locals actually use. Bring flip-flops and a towel, expect a mixed crowd at dawn and after dinner. Cited by Dante in the Inferno, still free eight centuries later.',
    link: 'https://www.italia.it/en/lazio/viterbo/things-to-do/bullicame-thermal-springs',
  },
  {
    id: 'papi',
    name: 'Terme dei Papi',
    place: 'Viterbo',
    temp: '58°C source, ~40°C pool',
    tempC: 58,
    minerals: 'Sulphurous-bicarbonate, same aquifer as Bullicame',
    access: 'paid',
    price: '€12–25 day ticket; night openings cost more',
    priceLevel: 2,
    hours: 'Wed–Mon, closed Tue for cleaning',
    fromRome: '~1h20 by car; train to Viterbo + bus ~2h',
    driveMin: 80,
    season: 'year-round',
    resident: 'occasional',
    image: papiImg,
    verdict:
      'A 2,000 m² monumental pool with a spa attached. Worth the ticket in winter when the steam sits over the water; too pricey to be a habit.',
    link: 'https://www.termedeipapi.it/en/',
  },
  {
    id: 'fiuggi',
    name: 'Fonte Bonifacio VIII / Terme di Fiuggi',
    place: 'Fiuggi (Ciociaria)',
    temp: '~13°C — this is a drinking cure, not a soak',
    tempC: 13,
    minerals: 'Low-mineral diuretic water, famous for kidney stones',
    access: 'paid',
    price: '€10–15 entry to the fonti park; treatment packages higher',
    priceLevel: 1,
    hours: 'Seasonal, roughly April–November',
    fromRome: '~1h10 by car (A1 Anagni)',
    driveMin: 70,
    season: 'seasonal',
    resident: 'occasional',
    image: fiuggiImg,
    verdict:
      'Not a hot spring. Fiuggi is Italy\'s classic termalismo town — shaded parks, bandstands, prescribed glasses of water. Charming, medical, and closed half the year.',
    link: 'https://www.termedifiuggi.it/',
  },
  {
    id: 'acque-albule',
    name: 'Acque Albule / Terme di Roma',
    place: 'Tivoli (Bagni di Tivoli)',
    temp: '23–24°C, sulphurous cold-warm',
    tempC: 24,
    minerals: 'Sulphurous-calcic, strongly carbonated',
    access: 'paid',
    price: '€15–20 day ticket',
    priceLevel: 2,
    hours: 'Daily, extended summer hours',
    fromRome: '~35 min by car (A24) or regional train to Bagni di Tivoli',
    driveMin: 35,
    season: 'year-round',
    resident: 'weekly',
    image: acqueAlbuleImg,
    verdict:
      'The closest real spa to Rome, and reachable without a car. The water is cooler than you expect, so it reads as a summer swim more than a winter soak.',
    link: 'https://www.termediroma.org/',
  },
  {
    id: 'cretone',
    name: 'Terme di Cretone',
    place: 'Palombara Sabina (Sabina)',
    temp: '~29°C',
    tempC: 29,
    minerals: 'Sulphurous, mildly mineralised',
    access: 'paid',
    price: '€10–14 day ticket',
    priceLevel: 1,
    hours: 'Broadly April–October, weekends off-season',
    fromRome: '~45 min by car (via Salaria/Nomentana)',
    driveMin: 45,
    season: 'seasonal',
    resident: 'occasional',
    image: cretoneImg,
    verdict:
      'Unpretentious pools in the Sabine hills, popular with Roman families in summer. Basic facilities, low prices, very local.',
  },
  {
    id: 'stigliano',
    name: 'Terme di Stigliano',
    place: 'Canale Monterano (Bracciano hinterland)',
    temp: '35–58°C across the various springs',
    tempC: 50,
    minerals: 'Sulphurous and ferruginous, Etruscan-era use',
    access: 'paid',
    price: '€20–30, spa-hotel pricing',
    priceLevel: 3,
    hours: 'Daily, booking recommended',
    fromRome: '~1h by car (Braccianese)',
    driveMin: 60,
    season: 'year-round',
    resident: 'occasional',
    image: stiglianoImg,
    verdict:
      'The prettiest setting of the lot — woodland, a small hotel, Etruscan and Roman ruins in the grounds. Priced as a treat, not as a routine.',
    link: 'https://www.termedistigliano.it/',
  },
];

type Filter = 'all' | 'free' | 'paid' | 'year-round' | 'near-rome';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All springs' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
  { id: 'year-round', label: 'Year-round' },
  { id: 'near-rome', label: 'Under an hour from Rome' },
];

const NEAR_ROME = new Set(['acque-albule', 'cretone', 'stigliano']);

const MIN_TEMP = 10;
const MAX_TEMP = 60;
const MAX_DRIVE = 90;

function TempBar({ value }: { value: number }) {
  const pct = ((value - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;
  return (
    <div className="w-full">
      <div className="relative h-2 rounded-full overflow-hidden bg-gradient-to-r from-sky-400/40 via-amber-400/40 to-rose-500/60">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-background border-2 border-primary shadow"
          initial={{ left: '0%' }}
          animate={{ left: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>10°C</span>
        <span>60°C</span>
      </div>
    </div>
  );
}

function CostMeter({ level }: { level: 0 | 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 w-6 rounded-full transition-colors',
              i <= level && level > 0 ? 'bg-primary' : 'bg-muted-foreground/20',
              level === 0 && i === 0 ? 'bg-emerald-500' : '',
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {level === 0 ? 'Free' : level === 1 ? 'Cheap' : level === 2 ? 'Mid' : 'Treat'}
      </span>
    </div>
  );
}

function DriveDial({ minutes }: { minutes: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, minutes / MAX_DRIVE);
  const label = minutes >= 60 ? `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}` : `${minutes}m`;
  return (
    <div className="relative w-[68px] h-[68px] shrink-0">
      <svg viewBox="0 0 68 68" className="w-full h-full -rotate-90">
        <circle cx="34" cy="34" r={r} fill="none" strokeWidth="5" className="stroke-muted-foreground/15" />
        <motion.circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          className="stroke-primary"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-foreground leading-none">{label}</span>
        <span className="text-[9px] text-muted-foreground mt-0.5">from Rome</span>
      </div>
    </div>
  );
}

function ScatterPlot({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Heat vs. distance, all six at once</h3>
        <span className="text-xs text-muted-foreground">Tap a dot</span>
      </div>
      <div className="relative h-56 rounded-lg bg-gradient-to-tr from-sky-500/5 via-transparent to-rose-500/10 border border-border/60">
        {/* grid */}
        {[0.25, 0.5, 0.75].map((g) => (
          <div key={`h${g}`} className="absolute left-0 right-0 border-t border-border/40" style={{ top: `${g * 100}%` }} />
        ))}
        {[0.25, 0.5, 0.75].map((g) => (
          <div key={`v${g}`} className="absolute top-0 bottom-0 border-l border-border/40" style={{ left: `${g * 100}%` }} />
        ))}

        {SPRINGS.map((s) => {
          const x = Math.min(96, (s.driveMin / MAX_DRIVE) * 100);
          const y = 100 - ((s.tempC - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;
          const isActive = s.id === selected;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${x}%`, top: `${Math.min(92, Math.max(8, y))}%` }}
              aria-label={s.name}
            >
              <span
                className={cn(
                  'block rounded-full transition-all',
                  isActive
                    ? 'w-4 h-4 bg-primary ring-4 ring-primary/25'
                    : 'w-3 h-3 bg-foreground/40 group-hover:bg-primary',
                )}
              />
              <span
                className={cn(
                  'absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap text-[10px] px-1.5 py-0.5 rounded bg-background/90 border border-border transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                )}
              >
                {s.name.split(' / ')[0]}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
        <span>Closer to Rome</span>
        <span>Further away</span>
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">Vertical axis: water temperature, cold at the bottom.</p>
    </div>
  );
}

export default function LazioThermalSprings() {
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [selected, setSelected] = useState<string>('bullicame');

  const springs = useMemo(() => {
    switch (filter) {
      case 'free':
        return SPRINGS.filter((s) => s.access === 'free');
      case 'paid':
        return SPRINGS.filter((s) => s.access === 'paid');
      case 'year-round':
        return SPRINGS.filter((s) => s.season === 'year-round');
      case 'near-rome':
        return SPRINGS.filter((s) => NEAR_ROME.has(s.id));
      default:
        return SPRINGS;
    }
  }, [filter]);

  const active = SPRINGS.find((s) => s.id === selected) ?? SPRINGS[0];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-muted/30 via-background to-muted/40">
      {/* Decorative steam waves */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.06]" aria-hidden="true">
        <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 120 Q150 60 300 120 T600 120 T900 120 T1200 120 V200 H0Z" fill="hsl(var(--primary))" />
          <path d="M0 150 Q150 100 300 150 T600 150 T900 150 T1200 150 V200 H0Z" fill="hsl(var(--foreground))" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <Droplets className="w-4 h-4" />
            Volcanic water
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lazio's thermal springs, compared
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The same dead volcanoes that gave Lazio its lakes also gave it hot water. Some of it is
            free and open to the sky at six in the morning; some of it comes with a €25 ticket and a
            robe. Here's which is which — and which ones a resident actually returns to.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {FILTERS.map((f) => (
            <Button
              key={f.id}
              size="sm"
              variant={filter === f.id ? 'default' : 'outline'}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
          <div className="ml-2 flex gap-1">
            <Button
              size="sm"
              variant={view === 'cards' ? 'secondary' : 'ghost'}
              onClick={() => setView('cards')}
              aria-label="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={view === 'table' ? 'secondary' : 'ghost'}
              onClick={() => setView('table')}
              aria-label="Comparison table"
            >
              <Table2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {view === 'cards' ? (
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-6 items-start">
            <motion.div layout className="grid sm:grid-cols-2 gap-4 content-start">
              <AnimatePresence mode="popLayout">
                {springs.map((s) => (
                  <motion.button
                    key={s.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setSelected(s.id)}
                    className={cn(
                      'group relative text-left rounded-xl overflow-hidden border bg-card transition-all hover:shadow-lg',
                      s.id === selected ? 'border-primary shadow-lg ring-1 ring-primary/30' : 'border-border',
                    )}
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={s.image}
                        alt={`${s.name} thermal spring in ${s.place}`}
                        loading="lazy"
                        width={1200}
                        height={800}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      <Badge
                        variant={s.access === 'free' ? 'default' : 'secondary'}
                        className="absolute top-2 right-2 text-xs"
                      >
                        {s.access === 'free' ? 'Free' : 'Paid'}
                      </Badge>
                      <div className="absolute bottom-2 left-3 right-3">
                        <h3 className="text-sm font-semibold text-foreground leading-tight drop-shadow">
                          {s.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">{s.place}</p>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 font-medium text-foreground">
                          <Thermometer className="w-3.5 h-3.5 text-primary" />
                          {s.tempC}°C
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Car className="w-3.5 h-3.5" />
                          {s.driveMin >= 60
                            ? `${Math.floor(s.driveMin / 60)}h${String(s.driveMin % 60).padStart(2, '0')}`
                            : `${s.driveMin} min`}
                        </span>
                      </div>
                      <TempBar value={s.tempC} />
                      <div className="flex items-center justify-between pt-1">
                        <CostMeter level={s.priceLevel} />
                        <span className="inline-flex items-center gap-1 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="w-3 h-3" /> View
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
              {springs.length === 0 && (
                <p className="text-sm text-muted-foreground italic">Nothing matches that filter.</p>
              )}
            </motion.div>

            <div className="space-y-6 lg:sticky lg:top-24">
              <Card className="overflow-hidden">
                <div className="relative h-52 md:h-64">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={active.id}
                      src={active.image}
                      alt={`${active.name} in ${active.place}`}
                      loading="lazy"
                      width={1200}
                      height={800}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground drop-shadow">{active.name}</h3>
                      <p className="text-sm text-muted-foreground">{active.place}</p>
                    </div>
                    <Badge
                      variant={active.resident === 'weekly' ? 'default' : 'outline'}
                      className="text-xs shrink-0 gap-1"
                    >
                      {active.resident === 'weekly' ? (
                        <><Repeat className="w-3 h-3" /> Habit-forming</>
                      ) : (
                        <><Sun className="w-3 h-3" /> Day trip</>
                      )}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-5 mb-5">
                    <DriveDial minutes={active.driveMin} />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1">
                        <Thermometer className="w-4 h-4 text-primary" />
                        {active.temp}
                      </div>
                      <TempBar value={active.tempC} />
                      <div className="mt-3">
                        <CostMeter level={active.priceLevel} />
                      </div>
                    </div>
                  </div>

                  <dl className="space-y-3 text-sm border-t border-border pt-4">
                    <div className="flex gap-3">
                      <Droplets className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <dt className="font-medium text-foreground">Water</dt>
                        <dd className="text-muted-foreground">{active.minerals}</dd>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Euro className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <dt className="font-medium text-foreground">Cost</dt>
                        <dd className="text-muted-foreground">{active.price}</dd>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <dt className="font-medium text-foreground">When it's open</dt>
                        <dd className="text-muted-foreground">{active.hours}</dd>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Car className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <dt className="font-medium text-foreground">From Rome</dt>
                        <dd className="text-muted-foreground">{active.fromRome}</dd>
                      </div>
                    </div>
                  </dl>

                  <p className="mt-5 pt-5 border-t border-border text-sm text-muted-foreground leading-relaxed italic">
                    {active.verdict}
                  </p>

                  {active.link && (
                    <a
                      href={active.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
                    >
                      More information →
                    </a>
                  )}
                </CardContent>
              </Card>

              <ScatterPlot selected={selected} onSelect={setSelected} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="p-3 font-semibold text-foreground">Spring</th>
                  <th className="p-3 font-semibold text-foreground">Temperature</th>
                  <th className="p-3 font-semibold text-foreground">Cost</th>
                  <th className="p-3 font-semibold text-foreground">Season</th>
                  <th className="p-3 font-semibold text-foreground">From Rome</th>
                </tr>
              </thead>
              <tbody>
                {springs.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <div className="font-medium text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.place}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">{s.temp}</td>
                    <td className="p-3 text-muted-foreground">{s.price}</td>
                    <td className="p-3 text-muted-foreground capitalize">{s.season}</td>
                    <td className="p-3 text-muted-foreground">{s.fromRome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6 max-w-3xl mx-auto">
          Prices and opening patterns move year to year — treat these as planning ranges, not quotes.
          Free springs have no lifeguards, no changing rooms, and sulphur will tarnish silver jewellery.
        </p>
      </div>
    </section>
  );
}
