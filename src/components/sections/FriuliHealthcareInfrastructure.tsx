import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Ambulance,
  Anchor,
  Bike,
  Building2,
  Bus,
  Car,
  Compass,
  ExternalLink,
  HeartPulse,
  Hospital,
  Info,
  Landmark,
  Languages,
  Plane,
  Ship,
  Stethoscope,
  Train,
  UserRound,
  Waves
} from 'lucide-react';
import { cn } from '@/lib/utils';
import careRoad from '@/assets/friuli/infrastructure/care-alpine-road.jpg';
import ferryPier from '@/assets/friuli/infrastructure/trieste-ferry-pier.jpg';
import cyclePath from '@/assets/friuli/infrastructure/alpe-adria-cycle.jpg';
import borderStone from '@/assets/friuli/infrastructure/border-milestone-snow.jpg';

/* ------------------------------------------------------------------ data */

const stats = [
  { value: 3, suffix: '', label: 'Top-3 Italian region for healthcare performance (LEA scoring)' },
  { value: 11, suffix: '', label: 'Hospitals with a 24h emergency room across four provinces' },
  { value: 2, suffix: '', label: 'National research institutes: Burlo Garofolo and CRO Aviano' },
  { value: 3, suffix: '', label: 'Countries reachable before an Italian motorway toll adds up' }
];

const careTiers = [
  {
    icon: UserRound,
    tier: 'Medico di base',
    what: 'Your assigned GP. Free at point of use, prescriptions, referrals, home visits for the housebound.',
    distance: 'In your own town, even in villages'
  },
  {
    icon: Stethoscope,
    tier: 'Ospedale di rete',
    what: 'District hospitals: emergency room, imaging, day surgery, outpatient specialists.',
    distance: 'Gorizia, Palmanova, Latisana, San Daniele, Tolmezzo, San Vito — 15–35 min from most addresses'
  },
  {
    icon: Hospital,
    tier: 'Regional hub',
    what: 'Full teaching hospitals: cardiology, stroke units, oncology, complex surgery.',
    distance: 'Trieste (Cattinara/Maggiore), Udine (Santa Maria della Misericordia), Pordenone'
  },
  {
    icon: Landmark,
    tier: 'National institutes',
    what: 'IRCCS-level research care. Burlo Garofolo for maternal and child health, CRO Aviano for oncology.',
    distance: 'Trieste and Aviano — both inside the region'
  }
];

interface HospitalItem {
  name: string;
  city: string;
  province: string;
  emergency: boolean;
  specialties: string[];
  note: string;
  link: string;
  mapLink: string;
}

const hospitals: HospitalItem[] = [
  {
    name: 'Ospedale di Cattinara (ASUGI)',
    city: 'Trieste',
    province: 'Trieste',
    emergency: true,
    specialties: ['Cardiology', 'Emergency', 'Neurosurgery', 'Orthopaedics'],
    note: 'The region\'s eastern teaching hospital, paired with Ospedale Maggiore in the city centre.',
    link: 'https://asugi.sanita.fvg.it/',
    mapLink: 'https://www.google.com/maps/search/Ospedale+di+Cattinara+Trieste'
  },
  {
    name: 'Santa Maria della Misericordia (ASUFC)',
    city: 'Udine',
    province: 'Udine',
    emergency: true,
    specialties: ['Oncology', 'Transplants', 'Cardiac surgery', 'Trauma'],
    note: 'The largest hospital in Friuli and the referral centre for the whole northern half of the region.',
    link: 'https://asufc.sanita.fvg.it/',
    mapLink: 'https://www.google.com/maps/search/Ospedale+Santa+Maria+della+Misericordia+Udine'
  },
  {
    name: 'IRCCS Burlo Garofolo',
    city: 'Trieste',
    province: 'Trieste',
    emergency: true,
    specialties: ['Paediatrics', 'Maternity', 'Genetics', 'Research'],
    note: 'A national research institute for mothers and children — unusual depth for a region this size.',
    link: 'https://www.burlo.trieste.it/',
    mapLink: 'https://www.google.com/maps/search/IRCCS+Burlo+Garofolo+Trieste'
  },
  {
    name: 'CRO Aviano — Centro di Riferimento Oncologico',
    city: 'Aviano',
    province: 'Pordenone',
    emergency: false,
    specialties: ['Oncology', 'Radiotherapy', 'Clinical trials'],
    note: 'One of Italy\'s leading cancer institutes, and the reason people move west for treatment rather than south.',
    link: 'https://www.cro.sanita.fvg.it/',
    mapLink: 'https://www.google.com/maps/search/CRO+Aviano'
  },
  {
    name: 'Ospedale Santa Maria degli Angeli',
    city: 'Pordenone',
    province: 'Pordenone',
    emergency: true,
    specialties: ['Emergency', 'General surgery', 'Cardiology', 'Maternity'],
    note: 'The western hub, covering Pordenone province and the Veneto border towns.',
    link: 'https://asfo.sanita.fvg.it/',
    mapLink: 'https://www.google.com/maps/search/Ospedale+Santa+Maria+degli+Angeli+Pordenone'
  },
  {
    name: 'Ospedale San Giovanni di Dio',
    city: 'Gorizia',
    province: 'Gorizia',
    emergency: true,
    specialties: ['Emergency', 'Internal medicine', 'Orthopaedics'],
    note: 'Serves the border district; Slovene-speaking staff are routine here.',
    link: 'https://asugi.sanita.fvg.it/',
    mapLink: 'https://www.google.com/maps/search/Ospedale+San+Giovanni+di+Dio+Gorizia'
  },
  {
    name: 'Ospedale di Palmanova',
    city: 'Palmanova',
    province: 'Udine',
    emergency: true,
    specialties: ['Emergency', 'Day surgery', 'Diagnostics'],
    note: 'The plain\'s practical answer: central, easy parking, quick triage.',
    link: 'https://asufc.sanita.fvg.it/',
    mapLink: 'https://www.google.com/maps/search/Ospedale+di+Palmanova'
  },
  {
    name: 'Ospedale di Tolmezzo (Sant\'Antonio Abate)',
    city: 'Tolmezzo',
    province: 'Udine',
    emergency: true,
    specialties: ['Emergency', 'Mountain trauma', 'Internal medicine'],
    note: 'Carnia\'s lifeline. Anything complex is transferred down the valley to Udine.',
    link: 'https://asufc.sanita.fvg.it/',
    mapLink: 'https://www.google.com/maps/search/Ospedale+di+Tolmezzo'
  }
];

interface BandAccess {
  id: string;
  name: string;
  er: number;
  hub: number;
  verdict: string;
}

const bands: BandAccess[] = [
  {
    id: 'coast',
    name: 'Coast & Karst',
    er: 12,
    hub: 15,
    verdict: 'Two hospitals and a national institute inside the city. This is as good as regional Italy gets.'
  },
  {
    id: 'plain',
    name: 'Central Plain',
    er: 18,
    hub: 30,
    verdict: 'District hospitals within twenty minutes, the region\'s biggest hospital within forty. Flat roads, no winter drama.'
  },
  {
    id: 'alps',
    name: 'Alps & Border',
    er: 35,
    hub: 70,
    verdict: 'Tolmezzo or Gemona handle the basics. Anything serious means the valley road to Udine — plan for snow tyres, not optimism.'
  }
];

const ssnSteps = [
  { step: 'Codice fiscale', detail: 'From the Agenzia delle Entrate. Free, same-day, needed for everything else.' },
  { step: 'Residency', detail: 'Register at the comune. The vigile visits to confirm you actually live there.' },
  { step: 'ASUGI / ASUFC district office', detail: 'Enrol in the SSN with residency, passport, codice fiscale and proof of cover.' },
  { step: 'Tessera sanitaria + doctor', detail: 'Card arrives by post; pick your medico di base from the district list the same day.' }
];

const crossBorderCare = [
  'EHIC and the S1 form travel with you: routine care in Slovenia and Austria is covered for emergencies, not electives.',
  'Planned treatment abroad needs prior authorisation from your ASL — the cross-border directive reimburses at Italian rates.',
  'Private dentistry in Slovenia and Croatia is a long-standing habit here. It is out of pocket, and it is still cheaper.',
  'In Gorizia and the Val Canale you can be treated in Slovene or German without anyone raising an eyebrow.'
];

/* ------------------------------------------------------- compass / reach */

interface Destination {
  id: string;
  name: string;
  country: string;
  angle: number; // degrees, 0 = north
  dist: number; // 0..1 along the spoke
  car: number; // minutes
  rail: number | null;
  fly: number | null;
  why: string;
}

const destinations: Destination[] = [
  { id: 'vienna', name: 'Vienna', country: 'Austria', angle: 15, dist: 0.95, car: 300, rail: 330, fly: 70, why: 'A concert weekend, on the same railway that built Trieste.' },
  { id: 'salzburg', name: 'Salzburg', country: 'Austria', angle: 345, dist: 0.8, car: 240, rail: 300, fly: null, why: 'Alpine Austria without changing continent — an easy overnight.' },
  { id: 'klagenfurt', name: 'Klagenfurt', country: 'Austria', angle: 0, dist: 0.42, car: 90, rail: 150, fly: null, why: 'The Austrian big shop, and an airport most Italians forget exists.' },
  { id: 'munich', name: 'Munich', country: 'Germany', angle: 325, dist: 1, car: 330, rail: 390, fly: 75, why: 'The long-haul escape hatch: direct flights to everywhere your family lives.' },
  { id: 'ljubljana', name: 'Ljubljana', country: 'Slovenia', angle: 75, dist: 0.35, car: 85, rail: 160, fly: null, why: 'Dentist, opera, and a capital city closer than Venice.' },
  { id: 'zagreb', name: 'Zagreb', country: 'Croatia', angle: 100, dist: 0.7, car: 175, rail: null, fly: null, why: 'A different Adriatic hinterland, doable in a day if you start early.' },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', angle: 60, dist: 1, car: 390, rail: 450, fly: 90, why: 'The far end of the old empire — and the thermal baths are worth the drive.' },
  { id: 'venice', name: 'Venice', country: 'Italy', angle: 250, dist: 0.4, car: 100, rail: 105, fly: null, why: 'Marco Polo airport, and the nearest city that needs no explanation.' },
  { id: 'milan', name: 'Milan', country: 'Italy', angle: 265, dist: 0.95, car: 240, rail: 235, fly: null, why: 'Frecciarossa direct from Trieste; consulates, specialists, and a real airport hub.' },
  { id: 'rome', name: 'Rome', country: 'Italy', angle: 215, dist: 1, car: 420, rail: 400, fly: 80, why: 'Embassies and bureaucracy that cannot be done by email.' }
];

const airports = [
  { code: 'TRS', name: 'Trieste — Ronchi dei Legionari', drive: '30–40 min from Trieste, 40 min from Udine', note: 'Its own railway station on the platform. Domestic hops plus Munich, Frankfurt, London.' },
  { code: 'VCE', name: 'Venice Marco Polo', drive: '1h45 from Udine', note: 'The workhorse for long-haul connections and most of Europe.' },
  { code: 'TSF', name: 'Treviso', drive: '2h from Udine', note: 'Low-cost carriers. Cheap tickets, awkward hours.' },
  { code: 'LJU', name: 'Ljubljana Jože Pučnik', drive: '1h30 from Gorizia', note: 'Small, calm, often cheaper — and no Italian strike days.' },
  { code: 'KLU', name: 'Klagenfurt', drive: '1h from Tarvisio', note: 'Austria\'s quiet back door, useful for Vienna connections.' },
  { code: 'MUC', name: 'Munich', drive: '5h30 by car, direct rail via Villach', note: 'When you need a genuine intercontinental hub, this is the one people drive to.' }
];

const spineLines = [
  { id: 'a4', label: 'A4 Serenissima', kind: 'road', towns: 'Trieste — Monfalcone — Palmanova — Portogruaro — Venice', note: 'The east–west artery. Tolled, busy with freight, but reliably fast.' },
  { id: 'a23', label: 'A23 Alpe-Adria', kind: 'road', towns: 'Palmanova — Udine — Gemona — Tarvisio — Villach', note: 'Climbs from the plain to Austria in about ninety minutes.' },
  { id: 'rail-ns', label: 'Vienna–Villach–Udine–Venice rail', kind: 'rail', towns: 'Tarvisio — Gemona — Udine — Cervignano — Venice', note: 'The Habsburg north–south spine, still the most useful line in the region.' },
  { id: 'rail-tr', label: 'Trieste–Ljubljana / Trieste–Venice', kind: 'rail', towns: 'Trieste — Monfalcone — Cervignano — Venice; plus the Villa Opicina crossing', note: 'Frecce run west to Venice, Milan and Rome; the eastern line is slow and beautiful.' }
];

const microMobility = [
  { icon: Bike, title: 'Alpe-Adria cycle route', text: 'Salzburg to Grado on a former railway grade — and for residents, a flat, traffic-free way to reach the next town.' },
  { icon: Bus, title: 'Border and ski buses', text: 'Regular services Gorizia–Nova Gorica, Trieste–Sežana, Tarvisio–Villach and the winter ski shuttles.' },
  { icon: Car, title: 'Where a car is non-negotiable', text: 'Carnia, the Val Canale side valleys and the Karst villages. On the plain and in Trieste you can genuinely live without one.' }
];

/* ------------------------------------------------------------- ferries */

const ferries = [
  { route: 'Trieste ↔ Muggia', operator: 'Delfino Verde (TPL FVG)', season: 'Year-round, reduced in winter', time: '30 min', fare: '~€5', passport: false, note: 'A commuter boat that happens to cross a bay. Locals use it instead of the coast road.' },
  { route: 'Trieste ↔ Grado / Lignano', operator: 'Delfino Verde', season: 'Summer season', time: '1h45–2h30', fare: '~€22–28', passport: false, note: 'The lagoon run. Slower than driving, and nobody who takes it minds.' },
  { route: 'Trieste ↔ Piran / Izola', operator: 'Liberty Lines / seasonal operators', season: 'Late spring to September', time: '~45 min', fare: '~€10–15', passport: true, note: 'Slovenia by sea. Carry ID — Schengen or not, the crew will ask.' },
  { route: 'Trieste ↔ Rovinj / Poreč (Istria)', operator: 'Kompas / Adriatic Lines', season: 'June–September', time: '2h–3h', fare: '~€35–60', passport: true, note: 'Croatia for lunch. The single most persuasive argument for living on this coast.' },
  { route: 'Grado ↔ Aquileia and the lagoon', operator: 'Local motonavi', season: 'Easter–October', time: '1h', fare: '~€15', passport: false, note: 'Roman ruins by water, through the reed channels of the Marano lagoon.' },
  { route: 'Ancona ↔ Split / Zadar (onward Adriatic)', operator: 'Jadrolinija, SNAV', season: 'Year-round', time: '9–11h overnight', fare: 'from ~€55', passport: true, note: 'Not in Friuli, but it is how you take a car to Dalmatia without driving round the top.' }
];

const portFacts = [
  { label: 'Italy\'s largest port by tonnage', text: 'Trieste moves more cargo than Genoa. The city faces east because its business always did.' },
  { label: 'A free port since 1719', text: 'The Habsburg free-port status still exists in law and still shapes the customs regime.' },
  { label: 'Cruise season', text: 'Ships berth on the Molo Bersaglieri, in the middle of town — spectacular, and occasionally crowded.' },
  { label: 'The Bora caveat', text: 'Winter gusts cancel sailings with little warning. Never book a ferry as the last leg to a flight.' }
];

/* -------------------------------------------------------------- helpers */

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function CountUp({ to, active }: { to: number; active: boolean }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!active || reduce) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 900, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active, reduce]);
  return <>{n}</>;
}

function Dial({ minutes, max, label }: { minutes: number; max: number; label: string }) {
  const pct = Math.min(minutes / max, 1);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} className="fill-none stroke-muted" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            className="fill-none stroke-primary"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: c, strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - c * pct }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-2xl text-foreground">{minutes}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">min</span>
        </div>
      </div>
      <span className="text-center text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------ component */

type Tab = 'care' | 'out' | 'water';

export function FriuliHealthcareInfrastructure() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>('care');
  const [band, setBand] = useState<BandAccess>(bands[1]);
  const [dest, setDest] = useState<Destination>(destinations[4]);
  const [line, setLine] = useState<string | null>(null);
  const { ref: statsRef, inView: statsIn } = useInView<HTMLDivElement>(0.3);

  const maxTravel = useMemo(
    () => Math.max(dest.car, dest.rail ?? 0, dest.fly ?? 0) || 1,
    [dest]
  );

  const tabs: { id: Tab; label: string; icon: typeof HeartPulse }[] = [
    { id: 'care', label: 'Care, honestly', icon: HeartPulse },
    { id: 'out', label: 'Out of Friuli', icon: Compass },
    { id: 'water', label: 'Adriatic by water', icon: Ship }
  ];

  return (
    <section className="relative overflow-hidden bg-background py-20">
      {/* soft backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <img src={borderStone} alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Healthcare &amp; Infrastructure</p>
          <h2 className="font-serif text-4xl text-foreground md:text-5xl">Well cared for, and never far from a border</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Friuli treats healthcare as a point of pride and geography as an advantage. Three countries, two seas of
            traffic, a working port and an airport with its own railway platform — all inside a region smaller than Wales.
          </p>
        </header>

        {/* stat strip */}
        <div ref={statsRef} className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={statsIn ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-xl border border-border bg-card/70 p-5 text-center backdrop-blur"
            >
              <div className="font-serif text-4xl text-primary">
                <CountUp to={s.value} active={statsIn} />
                {s.suffix}
              </div>
              <p className="mt-2 text-xs leading-snug text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card/60 text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={active}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ------------------------------------------------ TAB 1: CARE */}
          {tab === 'care' && (
            <motion.div
              key="care"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="mt-12 space-y-14"
            >
              <div className="grid gap-8 md:grid-cols-2">
                <figure className="overflow-hidden rounded-2xl border border-border">
                  <img
                    src={careRoad}
                    alt="An ambulance on a winding mountain road in the Julian Alps at dawn"
                    width={1400}
                    height={900}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <figcaption className="bg-card px-4 py-3 text-xs text-muted-foreground">
                    The honest version of alpine living: the care is good, the road to it is long.
                  </figcaption>
                </figure>
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl text-foreground">Four rungs, and you rarely climb past two</h3>
                  {careTiers.map((t, i) => {
                    const Icon = t.icon;
                    return (
                      <motion.div
                        key={t.tier}
                        initial={reduce ? false : { opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ delay: i * 0.08, duration: 0.45 }}
                        className="flex gap-4 rounded-xl border border-border bg-card/70 p-4"
                      >
                        <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{t.tier}</p>
                          <p className="text-sm text-muted-foreground">{t.what}</p>
                          <p className="mt-1 text-xs italic text-muted-foreground/80">{t.distance}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* hospitals */}
              <div>
                <h3 className="mb-6 text-center font-serif text-2xl text-foreground">Where you would actually be treated</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {hospitals.map((h, i) => (
                    <motion.article
                      key={h.name}
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: (i % 4) * 0.06, duration: 0.45 }}
                      className="group rounded-xl border border-border bg-card/70 p-5 transition-transform hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-medium leading-tight text-foreground">{h.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {h.city} · {h.province}
                          </p>
                        </div>
                        {h.emergency && (
                          <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-destructive">
                            <Ambulance className="h-3 w-3" /> 24h ER
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{h.note}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {h.specialties.map((s) => (
                          <span key={s} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-4 text-xs">
                        <a href={h.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                          Website <ExternalLink className="h-3 w-3" />
                        </a>
                        <a href={h.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                          Map <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>

              {/* band access */}
              <div className="rounded-2xl border border-border bg-card/70 p-6 md:p-8">
                <h3 className="text-center font-serif text-2xl text-foreground">Where you live changes your care</h3>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {bands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBand(b)}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm transition-colors',
                        band.id === b.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:justify-center">
                  <Dial minutes={band.er} max={80} label="to the nearest emergency room" />
                  <Dial minutes={band.hub} max={80} label="to a full teaching hospital" />
                  <p className="max-w-sm text-center text-sm text-muted-foreground md:text-left">{band.verdict}</p>
                </div>
              </div>

              {/* SSN steps */}
              <div>
                <h3 className="mb-6 text-center font-serif text-2xl text-foreground">Getting into the system</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  {ssnSteps.map((s, i) => (
                    <motion.div
                      key={s.step}
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: i * 0.1, duration: 0.45 }}
                      className="relative rounded-xl border border-border bg-card/70 p-5"
                    >
                      <span className="font-serif text-3xl text-primary/40">{i + 1}</span>
                      <p className="mt-1 font-medium text-foreground">{s.step}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card/70 p-5">
                    <p className="mb-3 flex items-center gap-2 font-medium text-foreground">
                      <Languages className="h-4 w-4 text-primary" /> Care across the border
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {crossBorderCare.map((c) => (
                        <li key={c} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border bg-card/70 p-5">
                    <p className="mb-3 flex items-center gap-2 font-medium text-foreground">
                      <Info className="h-4 w-4 text-primary" /> Numbers worth memorising
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ['112', 'Single emergency number'],
                        ['118', 'Ambulance'],
                        ['115', 'Fire'],
                        ['1500', 'Health ministry line']
                      ].map(([n, l]) => (
                        <div key={n} className="rounded-lg border border-border bg-background px-4 py-3 text-center">
                          <span className="block font-serif text-2xl text-foreground">{n}</span>
                          <span className="text-[11px] text-muted-foreground">{l}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Operators in Trieste and Gorizia handle Slovene; in the Val Canale, German is normal too.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------- TAB 2: OUT */}
          {tab === 'out' && (
            <motion.div
              key="out"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="mt-12 space-y-14"
            >
              <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
                {/* compass */}
                <div className="relative mx-auto w-full max-w-[520px]">
                  <svg viewBox="-70 -20 540 440" className="h-auto w-full" role="img" aria-label="Compass of destinations reachable from Friuli">
                    <defs>
                      <radialGradient id="fvg-rose" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="200" cy="200" r="190" fill="url(#fvg-rose)" />
                    {[70, 120, 170].map((r) => (
                      <circle key={r} cx="200" cy="200" r={r} className="fill-none stroke-border" strokeDasharray="3 6" />
                    ))}
                    {/* rotating needle */}
                    <motion.g
                      style={{ originX: '200px', originY: '200px' }}
                      animate={reduce ? undefined : { rotate: 360 }}
                      transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
                    >
                      <polygon points="200,160 206,200 200,196 194,200" className="fill-primary/40" />
                      <polygon points="200,240 194,200 200,204 206,200" className="fill-muted-foreground/30" />
                    </motion.g>

                    {destinations.map((d) => {
                      const rad = ((d.angle - 90) * Math.PI) / 180;
                      const R = 55 + d.dist * 125;
                      const x = 200 + Math.cos(rad) * R;
                      const y = 200 + Math.sin(rad) * R;
                      const active = dest.id === d.id;
                      return (
                        <g key={d.id} onClick={() => setDest(d)} className="cursor-pointer">
                          <line
                            x1={200}
                            y1={200}
                            x2={x}
                            y2={y}
                            className={active ? 'stroke-primary' : 'stroke-border'}
                            strokeWidth={active ? 2 : 1}
                          />
                          <circle cx={x} cy={y} r={active ? 7 : 4.5} className={active ? 'fill-primary' : 'fill-muted-foreground/60'} />
                          <text
                            x={x + (x > 200 ? 10 : -10)}
                            y={y + 4}
                            textAnchor={x > 200 ? 'start' : 'end'}
                            className={cn('text-[11px]', active ? 'fill-foreground' : 'fill-muted-foreground')}
                          >
                            {d.name}
                          </text>
                        </g>
                      );
                    })}
                    <circle cx="200" cy="200" r="9" className="fill-primary" />
                    <text x="200" y="224" textAnchor="middle" className="fill-muted-foreground text-[10px] uppercase tracking-widest">
                      Friuli
                    </text>
                  </svg>
                </div>

                {/* destination detail */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dest.id}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-border bg-card/80 p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{dest.country}</p>
                    <h3 className="font-serif text-3xl text-foreground">{dest.name}</h3>
                    <p className="mt-2 text-sm italic text-muted-foreground">{dest.why}</p>
                    <div className="mt-6 space-y-4">
                      {([
                        ['Car', Car, dest.car],
                        ['Rail', Train, dest.rail],
                        ['Fly', Plane, dest.fly]
                      ] as const).map(([label, Icon, mins]) => (
                        <div key={label}>
                          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Icon className="h-3.5 w-3.5" /> {label}
                            </span>
                            <span>{mins ? `${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, '0')}` : 'no sensible option'}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className={cn('h-full rounded-full', mins ? 'bg-primary' : 'bg-transparent')}
                              initial={{ width: 0 }}
                              animate={{ width: `${((mins ?? 0) / maxTravel) * 100}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 text-xs text-muted-foreground">
                      Flight times are gate-to-gate from Trieste, Venice or Ljubljana, whichever is sane. Add the drive to the airport.
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* airports */}
              <div>
                <h3 className="mb-6 text-center font-serif text-2xl text-foreground">Six airports, three countries</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {airports.map((a, i) => (
                    <motion.div
                      key={a.code}
                      initial={reduce ? false : { opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: (i % 3) * 0.08, duration: 0.45 }}
                      className="rounded-xl border border-border bg-card/70 p-5 transition-transform hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-primary/10 px-2 py-1 font-mono text-sm text-primary">{a.code}</span>
                        <Plane className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="mt-3 font-medium text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.drive}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{a.note}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* spine */}
              <div className="rounded-2xl border border-border bg-card/70 p-6 md:p-8">
                <h3 className="text-center font-serif text-2xl text-foreground">The spine: two motorways, two railways</h3>
                <svg viewBox="0 0 600 260" className="mx-auto mt-6 h-auto w-full max-w-3xl" role="img" aria-label="Schematic of Friuli motorways and railways">
                  {/* A4 east-west */}
                  <g onMouseEnter={() => setLine('a4')} onMouseLeave={() => setLine(null)} onClick={() => setLine('a4')} className="cursor-pointer">
                    <line x1="40" y1="200" x2="560" y2="200" className={line === 'a4' ? 'stroke-primary' : 'stroke-muted-foreground/40'} strokeWidth={line === 'a4' ? 7 : 5} strokeLinecap="round" />
                    <text x="46" y="222" className="fill-muted-foreground text-[11px]">A4 Venice ← → Trieste</text>
                  </g>
                  {/* A23 north */}
                  <g onMouseEnter={() => setLine('a23')} onMouseLeave={() => setLine(null)} onClick={() => setLine('a23')} className="cursor-pointer">
                    <line x1="330" y1="200" x2="330" y2="40" className={line === 'a23' ? 'stroke-primary' : 'stroke-muted-foreground/40'} strokeWidth={line === 'a23' ? 7 : 5} strokeLinecap="round" />
                    <text x="340" y="46" className="fill-muted-foreground text-[11px]">A23 → Tarvisio / Austria</text>
                  </g>
                  {/* rail north-south */}
                  <g onMouseEnter={() => setLine('rail-ns')} onMouseLeave={() => setLine(null)} onClick={() => setLine('rail-ns')} className="cursor-pointer">
                    <line x1="300" y1="200" x2="300" y2="40" className={line === 'rail-ns' ? 'stroke-primary' : 'stroke-accent-foreground/30'} strokeWidth={3} strokeDasharray="8 6" />
                    <text x="188" y="36" className="fill-muted-foreground text-[11px]">Vienna rail</text>
                  </g>
                  {/* rail trieste */}
                  <g onMouseEnter={() => setLine('rail-tr')} onMouseLeave={() => setLine(null)} onClick={() => setLine('rail-tr')} className="cursor-pointer">
                    <line x1="60" y1="176" x2="540" y2="176" className={line === 'rail-tr' ? 'stroke-primary' : 'stroke-accent-foreground/30'} strokeWidth={3} strokeDasharray="8 6" />
                    <text x="440" y="168" className="fill-muted-foreground text-[11px]">Frecce &amp; regionali</text>
                  </g>
                  {[
                    ['Venice', 60, 200],
                    ['Pordenone', 180, 200],
                    ['Palmanova', 330, 200],
                    ['Monfalcone', 450, 200],
                    ['Trieste', 545, 200],
                    ['Udine', 330, 140],
                    ['Gemona', 330, 96],
                    ['Tarvisio', 330, 46]
                  ].map(([label, x, y]) => (
                    <g key={label as string}>
                      <circle cx={x as number} cy={y as number} r="6" className="fill-background stroke-foreground" strokeWidth="2" />
                      <text x={(x as number) + 10} y={(y as number) - 8} className="fill-foreground text-[11px]">
                        {label}
                      </text>
                    </g>
                  ))}
                </svg>
                <div className="mt-4 min-h-[3.5rem] text-center text-sm text-muted-foreground">
                  {line ? (
                    <>
                      <span className="font-medium text-foreground">{spineLines.find((l) => l.id === line)?.label}</span>
                      {' — '}
                      {spineLines.find((l) => l.id === line)?.note}
                      <br />
                      <span className="text-xs">{spineLines.find((l) => l.id === line)?.towns}</span>
                    </>
                  ) : (
                    'Hover or tap a line to see what it serves.'
                  )}
                </div>
              </div>

              {/* micromobility */}
              <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
                <figure className="overflow-hidden rounded-2xl border border-border">
                  <img
                    src={cyclePath}
                    alt="The Alpe-Adria cycle route running through an alpine valley past a stone viaduct in autumn"
                    width={1400}
                    height={900}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </figure>
                <div className="space-y-4">
                  {microMobility.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.title} className="rounded-xl border border-border bg-card/70 p-5">
                        <p className="flex items-center gap-2 font-medium text-foreground">
                          <Icon className="h-4 w-4 text-primary" /> {m.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ----------------------------------------------- TAB 3: WATER */}
          {tab === 'water' && (
            <motion.div
              key="water"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="mt-12 space-y-12"
            >
              {/* sea panel */}
              <div className="relative overflow-hidden rounded-2xl border border-border">
                <img
                  src={ferryPier}
                  alt="A passenger ferry leaving the Trieste waterfront at golden hour"
                  width={1400}
                  height={900}
                  loading="lazy"
                  className="h-[320px] w-full object-cover md:h-[420px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                {/* drifting wake lines */}
                <svg viewBox="0 0 800 200" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <motion.path
                      key={i}
                      d={`M -100 ${120 + i * 22} C 100 ${100 + i * 22}, 300 ${140 + i * 22}, 500 ${118 + i * 22} S 800 ${132 + i * 22}, 900 ${120 + i * 22}`}
                      className="fill-none stroke-primary/25"
                      strokeWidth="2"
                      animate={reduce ? undefined : { x: [0, 120, 0] }}
                      transition={{ duration: 14 + i * 5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                  <motion.g
                    animate={reduce ? undefined : { x: [-80, 880] }}
                    transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
                  >
                    <circle cx="0" cy="112" r="5" className="fill-primary" />
                  </motion.g>
                </svg>
                <div className="absolute inset-x-0 bottom-0 bg-background/85 px-6 py-5 backdrop-blur-sm">
                  <h3 className="font-serif text-3xl text-foreground">The Adriatic is a road here</h3>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    Trieste is Italy's biggest port by tonnage and a free port since 1719. For residents that translates into
                    something simpler: boats to Slovenia, Croatia and the lagoon leave from the middle of town.
                  </p>
                </div>
              </div>


              {/* ferry routes */}
              <div className="grid gap-4 md:grid-cols-2">
                {ferries.map((f, i) => (
                  <motion.div
                    key={f.route}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: (i % 2) * 0.08, duration: 0.45 }}
                    className="rounded-xl border border-border bg-card/70 p-5 transition-transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="flex items-center gap-2 font-medium text-foreground">
                        <Waves className="h-4 w-4 text-primary" /> {f.route}
                      </h4>
                      {f.passport && (
                        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                          ID needed
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{f.note}</p>
                    <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      {[
                        ['Crossing', f.time],
                        ['Fare', f.fare],
                        ['Season', f.season]
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-lg bg-muted/50 px-2 py-2">
                          <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</dt>
                          <dd className="mt-0.5 text-foreground">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-3 text-xs italic text-muted-foreground/80">{f.operator}</p>
                  </motion.div>
                ))}
              </div>

              {/* port facts */}
              <div className="grid gap-4 md:grid-cols-4">
                {portFacts.map((p, i) => (
                  <motion.div
                    key={p.label}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="rounded-xl border border-border bg-card/70 p-5"
                  >
                    <Anchor className="h-5 w-5 text-primary" />
                    <p className="mt-3 font-medium text-foreground">{p.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                  </motion.div>
                ))}
              </div>

              <p className="flex items-start gap-2 rounded-xl border border-border bg-card/70 p-5 text-sm text-muted-foreground">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Fares and seasons shift every year. Treat these as the shape of the network, not a timetable — check the
                operator before you plan a day around a boat.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FriuliHealthcareInfrastructure;
