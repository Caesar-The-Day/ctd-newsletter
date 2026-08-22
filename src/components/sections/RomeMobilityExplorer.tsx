import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

type ModeId = 'metro' | 'rail' | 'bus' | 'walk' | 'bike' | 'car';

interface Mode {
  id: ModeId;
  label: string;
  icon: typeof TrainFront;
  coverage: string;
  frequency: string;
  hours: string;
  cost: string;
  worksIf: string[];
  failsIf: string[];
  reliability: number; // 1-5
  verdict: string;
}

const MODES: Mode[] = [
  {
    id: 'metro',
    label: 'Metro',
    icon: TrainFront,
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
    icon: Route,
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
    icon: Bus,
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
    icon: Footprints,
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
    icon: Bike,
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
    icon: Car,
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

type Pressure = 'Heavy' | 'Moderate' | 'Seasonal';

interface Corridor {
  name: string;
  mode: string;
  pressure: Pressure;
  peak: string;
  problem: string;
  workaround: string;
}

const CORRIDORS: Corridor[] = [
  {
    name: 'Termini ↔ Colosseo',
    mode: 'Metro B southbound',
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
    pressure: 'Heavy',
    peak: 'Continuous; worse during Metro C works',
    problem:
      'The single worst interchange in the city: no metro station, a dozen bus lines converging, and an open archaeological worksite.',
    workaround:
      'Never plan a change here. Break the journey at Argentina or Colosseo and walk the last stretch.',
  },
];

const pressureStyles: Record<Pressure, string> = {
  Heavy: 'bg-destructive/15 text-destructive border-destructive/30',
  Moderate: 'bg-primary/15 text-primary border-primary/30',
  Seasonal: 'bg-muted text-muted-foreground border-border',
};

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
        <div className="max-w-3xl mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-primary mb-3">Rome, practically</p>
          <h2
            id="rome-mobility-heading"
            className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-5"
          >
            How you actually get around Rome
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Six ways to move through the city, what each one costs, where it works and where it quietly
            fails you — followed by the corridors where living here means sharing your commute with
            thirty-five million visitors a year.
          </p>
        </div>

        {/* Mode selector */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap"
          role="tablist"
          aria-label="Transit modes"
        >
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = m.id === activeMode;
            return (
              <Button
                key={m.id}
                role="tab"
                aria-selected={active}
                variant={active ? 'default' : 'outline'}
                onClick={() => setActiveMode(m.id)}
                className="shrink-0 gap-2"
              >
                <Icon className="h-4 w-4" />
                {m.label}
              </Button>
            );
          })}
        </div>

        {/* Mode panel */}
        <Card className="mb-16 border-border/60">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="rounded-full bg-primary/10 p-3 shrink-0">
                <ModeIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{mode.label}</h3>
                <p className="text-muted-foreground leading-relaxed">{mode.coverage}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg border border-border/60 bg-background p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Frequency</p>
                <p className="text-sm text-foreground">{mode.frequency}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Hours</p>
                <p className="text-sm text-foreground">{mode.hours}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Cost</p>
                <p className="text-sm text-foreground">{mode.cost}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Works well if you live in…</p>
                <div className="flex flex-wrap gap-2">
                  {mode.worksIf.map((w) => (
                    <Badge key={w} variant="secondary" className="font-normal">
                      {w}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Falls apart if…</p>
                <div className="flex flex-wrap gap-2">
                  {mode.failsIf.map((f) => (
                    <Badge key={f} variant="outline" className="font-normal text-muted-foreground">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-semibold text-foreground">Resident reliability</span>
              <div className="flex gap-1" aria-label={`${mode.reliability} out of 5`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`h-2 w-8 rounded-full ${
                      i <= mode.reliability ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{mode.reliability}/5</span>
            </div>

            <blockquote className="border-l-2 border-primary pl-4 text-foreground/90 italic leading-relaxed">
              {mode.verdict}
            </blockquote>
          </CardContent>
        </Card>

        {/* Tourist pressure corridors */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3 flex items-center gap-3">
              <Users className="h-6 w-6 text-primary shrink-0" />
              Where tourism collides with your commute
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Roughly 35 million visitors a year concentrate into about four square kilometres. These are
              the specific corridors residents learn to route around.
            </p>
          </div>
          <Button
            variant={heavyOnly ? 'default' : 'outline'}
            onClick={() => setHeavyOnly((v) => !v)}
            aria-pressed={heavyOnly}
            className="shrink-0"
          >
            {heavyOnly ? 'Showing heavy pressure only' : 'Show only heavy pressure'}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {corridors.map((c) => (
            <Card key={c.name} className="border-border/60 h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground leading-snug">{c.name}</h4>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                      {c.mode}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${pressureStyles[c.pressure]}`}
                  >
                    {c.pressure}
                  </span>
                </div>

                <p className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                  <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{c.peak}</span>
                </p>

                <p className="text-sm text-foreground/90 leading-relaxed mb-4">{c.problem}</p>

                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <p className="flex items-start gap-2 text-sm text-foreground/90">
                    <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold">Resident workaround: </span>
                      {c.workaround}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
