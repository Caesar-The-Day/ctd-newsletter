import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Ambulance,
  Ship,
  Building2,
  Car,
  ExternalLink,
  Flame,
  HeartPulse,
  MapPin,
  Phone,
  Plane,
  Shield,
  Signal,
  Stethoscope,
  Train,
  TrainFront,
  Wifi,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCountUp } from '@/hooks/use-count-up';
import { cn } from '@/lib/utils';

/* ------------------------------ header stats ----------------------------- */

const STATS = [
  { value: 5, label: 'Provinces', sub: 'Roma, Viterbo, Latina, Frosinone, Rieti' },
  { value: 32, suffix: 'min', label: 'Termini → FCO', sub: 'Leonardo Express, non-stop' },
  { value: 70, suffix: 'min', label: 'Rome → Naples', sub: 'Frecciarossa / Italo' },
  { value: 9, label: 'Major hospitals', sub: 'with full 24h emergency rooms' },
];

function StatCounter({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const { count, elementRef } = useCountUp(stat.value, 1100 + index * 150);
  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className="flex-1 min-w-[140px] px-4 py-4 text-center">
      <p className="text-2xl md:text-3xl font-bold text-primary tabular-nums">
        {count}
        {stat.suffix ? <span className="text-lg ml-0.5">{stat.suffix}</span> : null}
      </p>
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground mt-1">{stat.label}</p>
      <p className="text-xs text-muted-foreground">{stat.sub}</p>
    </div>
  );
}

/* ------------------------------- care tiers ------------------------------ */

const CARE_TIERS = [
  {
    icon: Stethoscope,
    tier: 'Tier 1',
    title: 'Medico di base & ASL clinic',
    handles: 'Prescriptions, referrals, blood work, vaccinations, routine follow-up.',
    distance: 'In your town — every comune has one',
  },
  {
    icon: Building2,
    tier: 'Tier 2',
    title: 'Provincial hospital',
    handles: 'Emergency room, surgery, maternity, imaging, most specialist clinics.',
    distance: '15–45 min from almost anywhere in Lazio',
  },
  {
    icon: HeartPulse,
    tier: 'Tier 3',
    title: 'Rome teaching hospital',
    handles: 'Oncology, cardiac surgery, neurology, transplants, rare disease programmes.',
    distance: '45–90 min from the provinces, by design',
  },
];

/* -------------------------------- hospitals ------------------------------ */

interface Hospital {
  name: string;
  city: string;
  province: string;
  blurb: string;
  specialties: string[];
  emergency: boolean;
  link?: string;
  map: string;
}

const HOSPITALS: Hospital[] = [
  {
    name: 'Policlinico Universitario A. Gemelli',
    city: 'Rome (Trionfale)',
    province: 'Roma',
    blurb:
      'The largest teaching hospital in Italy and the one the Vatican uses. Deep benches in oncology, cardiology and neurosurgery, plus a well-run international patient office.',
    specialties: ['Oncology', 'Cardiac surgery', 'Neurology', 'Transplants'],
    emergency: true,
    link: 'https://www.policlinicogemelli.it/',
    map: 'https://www.google.com/maps/search/Policlinico+Gemelli+Roma',
  },
  {
    name: 'Policlinico Umberto I',
    city: 'Rome (San Lorenzo)',
    province: 'Roma',
    blurb:
      'Sapienza University\'s giant public hospital. Enormous capacity and every specialty under one roof; busy, bureaucratic, and free at the point of care once you are enrolled in the SSN.',
    specialties: ['Trauma', 'Internal medicine', 'Infectious disease'],
    emergency: true,
    link: 'https://www.policlinicoumberto1.it/',
    map: 'https://www.google.com/maps/search/Policlinico+Umberto+I+Roma',
  },
  {
    name: 'Azienda Ospedaliera San Camillo-Forlanini',
    city: 'Rome (Monteverde)',
    province: 'Roma',
    blurb:
      'One of Rome\'s main emergency hubs, with a strong respiratory and thoracic tradition inherited from the Forlanini institute.',
    specialties: ['Emergency', 'Pulmonology', 'Cardiology'],
    emergency: true,
    link: 'https://www.scamilloforlanini.rm.it/',
    map: 'https://www.google.com/maps/search/San+Camillo+Forlanini+Roma',
  },
  {
    name: 'Ospedale Sant\'Andrea',
    city: 'Rome (north, Cassia)',
    province: 'Roma',
    blurb:
      'Modern, comparatively calm university hospital serving the northern quadrant — the practical choice if you live around Cassia, Flaminia or the Lake Bracciano side.',
    specialties: ['Orthopaedics', 'Oncology', 'Neurosurgery'],
    emergency: true,
    link: 'https://www.ospedalesantandrea.it/',
    map: 'https://www.google.com/maps/search/Ospedale+Sant+Andrea+Roma',
  },
  {
    name: 'Ospedale Pediatrico Bambino Gesù',
    city: 'Rome (Gianicolo) & Palidoro',
    province: 'Roma',
    blurb:
      'Europe\'s largest paediatric research hospital. Worth knowing about if grandchildren visit — it takes complex cases from across the continent.',
    specialties: ['Paediatrics', 'Paediatric cardiology', 'Genetics'],
    emergency: true,
    link: 'https://www.ospedalebambinogesu.it/',
    map: 'https://www.google.com/maps/search/Ospedale+Bambino+Gesu+Roma',
  },
  {
    name: 'Ospedale Belcolle',
    city: 'Viterbo',
    province: 'Viterbo',
    blurb:
      'The hub for all of Tuscia. Solid oncology and cardiology departments, a full emergency room, and short waits compared with Rome for imaging and day surgery.',
    specialties: ['Oncology', 'Cardiology', 'Emergency'],
    emergency: true,
    link: 'https://www.asl.vt.it/',
    map: 'https://www.google.com/maps/search/Ospedale+Belcolle+Viterbo',
  },
  {
    name: 'Ospedale Santa Maria Goretti',
    city: 'Latina',
    province: 'Latina',
    blurb:
      'The reference hospital for the Pontine plain and the southern coast, from Sabaudia down to Terracina. Reliable for everyday needs; Rome is an hour away for anything complex.',
    specialties: ['Emergency', 'Obstetrics', 'General surgery'],
    emergency: true,
    link: 'https://www.ausl.latina.it/',
    map: 'https://www.google.com/maps/search/Ospedale+Santa+Maria+Goretti+Latina',
  },
  {
    name: 'Ospedale Fabrizio Spaziani',
    city: 'Frosinone',
    province: 'Frosinone',
    blurb:
      'Main hospital of the Ciociaria valley, backed by smaller units in Sora, Cassino and Alatri. Rome is 70 minutes up the A1 if you need Tier 3 care.',
    specialties: ['Emergency', 'Orthopaedics', 'Nephrology'],
    emergency: true,
    link: 'https://www.asl.fr.it/',
    map: 'https://www.google.com/maps/search/Ospedale+Spaziani+Frosinone',
  },
  {
    name: 'Ospedale San Camillo de Lellis',
    city: 'Rieti',
    province: 'Rieti',
    blurb:
      'The Sabina and upper-valley hospital — the one that matters if you settle in the 7%-eligible towns around Leonessa, Amatrice or Cittaducale.',
    specialties: ['Emergency', 'Cardiology', 'Rehabilitation'],
    emergency: true,
    link: 'https://www.asl.rieti.it/',
    map: 'https://www.google.com/maps/search/Ospedale+San+Camillo+de+Lellis+Rieti',
  },
];

/* ------------------------------ base areas ------------------------------- */

interface BaseArea {
  id: string;
  name: string;
  towns: string;
  localMin: number;
  local: string;
  romeMin: number;
  rome: string;
  note: string;
}

const BASE_AREAS: BaseArea[] = [
  {
    id: 'tuscia',
    name: 'Tuscia',
    towns: 'Viterbo · Sutri · Bolsena · Caprarola',
    localMin: 25,
    local: 'Belcolle, Viterbo',
    romeMin: 80,
    rome: 'Sant\'Andrea, Rome',
    note: 'Belcolle covers most of what you will ever need; the Cassia or the FL3 gets you to Rome.',
  },
  {
    id: 'sabina',
    name: 'Sabina & Rieti',
    towns: 'Rieti · Leonessa · Casperia · Poggio Mirteto',
    localMin: 35,
    local: 'San Camillo de Lellis, Rieti',
    romeMin: 90,
    rome: 'Umberto I, Rome',
    note: 'Mountain roads add time in winter. Check the drive from your actual village, not from Rieti.',
  },
  {
    id: 'castelli',
    name: 'Castelli Romani',
    towns: 'Frascati · Nemi · Castel Gandolfo · Ariccia',
    localMin: 20,
    local: 'Ospedale dei Castelli, Ariccia',
    romeMin: 45,
    rome: 'San Camillo, Rome',
    note: 'The best-covered area outside Rome: a new hospital nearby and the capital half an hour away.',
  },
  {
    id: 'coast',
    name: 'Southern coast',
    towns: 'Sabaudia · Sperlonga · Gaeta · Terracina',
    localMin: 40,
    local: 'Santa Maria Goretti, Latina',
    romeMin: 105,
    rome: 'Gemelli, Rome',
    note: 'Summer traffic on the Pontina is the real variable — budget an extra 30 minutes in August.',
  },
  {
    id: 'ciociaria',
    name: 'Ciociaria',
    towns: 'Anagni · Alatri · Fiuggi · Frosinone',
    localMin: 30,
    local: 'Spaziani, Frosinone',
    romeMin: 75,
    rome: 'Umberto I, Rome',
    note: 'The A1 makes Rome genuinely close; the valley towns above 600 m are the slow ones.',
  },
  {
    id: 'rome',
    name: 'Rome',
    towns: 'Any quartiere inside the GRA',
    localMin: 15,
    local: 'Nearest of five major hospitals',
    romeMin: 30,
    rome: 'Gemelli or Umberto I',
    note: 'Choice, not distance, is the question here — pick your ASL and your medico di base carefully.',
  },
];

function Dial({ minutes, label, sub, tone }: { minutes: number; label: string; sub: string; tone: 'primary' | 'accent' }) {
  const pct = Math.min(minutes / 120, 1);
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-28 w-28 flex-shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={r} className="stroke-muted" strokeWidth="10" fill="none" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            className={tone === 'primary' ? 'stroke-primary' : 'stroke-foreground/60'}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - c * pct }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tabular-nums text-foreground">{minutes}</span>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">min</span>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide font-semibold text-primary">{label}</p>
        <p className="text-sm font-medium text-foreground">{sub}</p>
      </div>
    </div>
  );
}

/* --------------------------------- SSN ----------------------------------- */

const SSN_STEPS = [
  { title: 'Codice fiscale', body: 'Your Italian tax code, issued by the Agenzia delle Entrate. Nothing else can start without it.' },
  { title: 'Residenza', body: 'Register at the comune. The vigili will visit to confirm you actually live there.' },
  { title: 'ASL enrolment', body: 'Take passport, permesso/visa, codice fiscale and residency certificate to your local ASL office.' },
  { title: 'Tessera sanitaria', body: 'Choose a medico di base on the spot; the health card arrives by post within a few weeks.' },
];

const EMERGENCY = [
  { code: '112', label: 'Single emergency number', icon: Shield },
  { code: '118', label: 'Ambulance / medical', icon: Ambulance },
  { code: '115', label: 'Fire brigade', icon: Flame },
  { code: '1500', label: 'Health ministry info line', icon: Phone },
];

/* ------------------------------- airports -------------------------------- */

const AIRPORTS = [
  {
    code: 'FCO',
    name: 'Leonardo da Vinci – Fiumicino',
    role: 'Italy\'s primary intercontinental hub. Direct long-haul to North America, the Gulf and Asia; every European capital daily.',
    access: [
      { label: 'Leonardo Express from Termini', value: '32 min · €14' },
      { label: 'FL1 regional (Trastevere, Ostiense, Tiburtina)', value: '~45 min · €8' },
      { label: 'Taxi, fixed fare inside the Aurelian walls', value: '~45 min · €55' },
    ],
    link: 'https://www.adr.it/fiumicino',
  },
  {
    code: 'CIA',
    name: 'Ciampino – G. B. Pastine',
    role: 'The low-cost airport: Ryanair and Wizz to secondary European cities. Small, fast, and close to the Castelli.',
    access: [
      { label: 'Terravision / SIT bus from Termini', value: '~40 min · €6' },
      { label: 'Train to Ciampino + shuttle', value: '~35 min · €2.70' },
      { label: 'Taxi, fixed fare inside the walls', value: '~30 min · €40' },
    ],
    link: 'https://www.adr.it/ciampino',
  },
];

/* ------------------------------- rail lines ------------------------------ */

interface Line {
  id: string;
  name: string;
  kind: 'high-speed' | 'regional' | 'road';
  color: string;
  path: string;
  serves: string;
  detail: string;
}

const LINES: Line[] = [
  {
    id: 'av',
    name: 'High-speed spine (Frecciarossa / Italo)',
    kind: 'high-speed',
    color: 'hsl(var(--primary))',
    path: 'M 200 20 L 200 150 L 210 300',
    serves: 'Florence · Roma Termini · Naples',
    detail: 'Florence in 1h30, Naples in 1h10, Milan in 2h55, Bologna in 2h. Book ahead and it is cheaper than fuel.',
  },
  {
    id: 'fl1',
    name: 'FL1 — Fiumicino ↔ Orte',
    kind: 'regional',
    color: 'hsl(var(--foreground) / 0.55)',
    path: 'M 60 200 L 150 165 L 200 150 L 300 60',
    serves: 'Fiumicino · Trastevere · Ostiense · Tiburtina · Fara Sabina · Orte',
    detail: 'The workhorse. Every 15 minutes, and the reason Sabina commuters can live an hour from Rome.',
  },
  {
    id: 'fl3',
    name: 'FL3 — Rome ↔ Bracciano ↔ Viterbo',
    kind: 'regional',
    color: 'hsl(var(--foreground) / 0.55)',
    path: 'M 200 150 L 130 110 L 90 70',
    serves: 'Valle Aurelia · Cesano · Bracciano · Manziana · Viterbo',
    detail: 'Lake Bracciano in under an hour from central Rome. Viterbo takes about two — most people drive it.',
  },
  {
    id: 'fl4',
    name: 'FL4 — Castelli Romani',
    kind: 'regional',
    color: 'hsl(var(--foreground) / 0.55)',
    path: 'M 200 150 L 250 200 L 285 235',
    serves: 'Frascati · Albano · Velletri · Ciampino',
    detail: 'Three branches out of Termini. Frascati in 30 minutes; the reason the Castelli feel suburban.',
  },
  {
    id: 'fl5',
    name: 'FL5 — Rome ↔ Civitavecchia',
    kind: 'regional',
    color: 'hsl(var(--foreground) / 0.55)',
    path: 'M 200 150 L 120 175 L 45 185',
    serves: 'Ostiense · Ladispoli · Santa Marinella · Civitavecchia',
    detail: 'The coastal line to the port — ferries to Sardinia, Barcelona and Tunis leave from the end of it.',
  },
  {
    id: 'fl6',
    name: 'FL6 — Rome ↔ Frosinone ↔ Cassino',
    kind: 'regional',
    color: 'hsl(var(--foreground) / 0.55)',
    path: 'M 200 150 L 270 230 L 330 300',
    serves: 'Colleferro · Anagni · Frosinone · Cassino',
    detail: 'The Ciociaria commuter line, shadowing the A1 all the way to the Campania border.',
  },
  {
    id: 'a1',
    name: 'A1 Autostrada del Sole',
    kind: 'road',
    color: 'hsl(var(--muted-foreground) / 0.5)',
    path: 'M 250 20 L 235 140 L 300 320',
    serves: 'Florence ↔ Rome ↔ Naples',
    detail: 'Italy\'s central artery. Rome–Naples is roughly 2h15 by car, Rome–Florence about 3h.',
  },
  {
    id: 'a12',
    name: 'A12 Autostrada Azzurra',
    kind: 'road',
    color: 'hsl(var(--muted-foreground) / 0.5)',
    path: 'M 40 170 L 120 160 L 190 155',
    serves: 'Rome ↔ Civitavecchia ↔ Tuscany',
    detail: 'The northern coastal run, and the fast way out to Tarquinia and the Maremma.',
  },
  {
    id: 'a24',
    name: 'A24 Roma–L\'Aquila',
    kind: 'road',
    color: 'hsl(var(--muted-foreground) / 0.5)',
    path: 'M 205 148 L 290 120 L 370 95',
    serves: 'Rome ↔ Tivoli ↔ Abruzzo',
    detail: 'Over the Apennines to Gran Sasso in 90 minutes. Winter chains are a legal requirement, not a suggestion.',
  },
];

function RailSchematic({ active, onSelect }: { active: string | null; onSelect: (id: string) => void }) {
  return (
    <svg viewBox="0 0 400 340" className="w-full h-auto" role="img" aria-label="Schematic of Lazio rail lines and motorways">
      <rect x="0" y="0" width="400" height="340" className="fill-muted/30" rx="12" />
      {LINES.map((line) => {
        const isActive = active === line.id;
        const dimmed = active !== null && !isActive;
        return (
          <motion.path
            key={line.id}
            d={line.path}
            fill="none"
            stroke={line.color}
            strokeWidth={isActive ? 7 : line.kind === 'high-speed' ? 5 : 3.5}
            strokeLinecap="round"
            strokeDasharray={line.kind === 'road' ? '8 7' : undefined}
            className="cursor-pointer"
            animate={{ opacity: dimmed ? 0.22 : 1 }}
            transition={{ duration: 0.25 }}
            onClick={() => onSelect(line.id)}
          />
        );
      })}
      {/* Rome node */}
      <circle cx="200" cy="150" r="9" className="fill-primary stroke-background" strokeWidth="3" />
      <text x="214" y="146" className="fill-foreground text-[11px] font-semibold">Roma</text>
      <text x="214" y="158" className="fill-muted-foreground text-[9px]">Termini</text>
      {[
        { x: 60, y: 200, label: 'Fiumicino' },
        { x: 90, y: 70, label: 'Viterbo' },
        { x: 45, y: 185, label: 'Civitavecchia' },
        { x: 285, y: 235, label: 'Castelli' },
        { x: 330, y: 300, label: 'Cassino' },
        { x: 300, y: 60, label: 'Orte / Sabina' },
        { x: 370, y: 95, label: 'Abruzzo' },
        { x: 210, y: 300, label: 'Napoli' },
        { x: 200, y: 20, label: 'Firenze' },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="4.5" className="fill-background stroke-foreground/60" strokeWidth="2" />
          <text x={n.x + 8} y={n.y + 4} className="fill-muted-foreground text-[9px]">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------ reach times ------------------------------ */

const REACH = [
  { city: 'Fiumicino (FCO)', rail: 32, car: 45 },
  { city: 'Naples', rail: 70, car: 135 },
  { city: 'Florence', rail: 92, car: 180 },
  { city: 'Bologna', rail: 125, car: 230 },
  { city: 'Milan', rail: 175, car: 340 },
  { city: 'Bari', rail: 240, car: 265 },
];

const MAX_REACH = 340;

/* ------------------------------ connectivity ----------------------------- */

const CONNECTIVITY = [
  {
    icon: Wifi,
    title: 'Fiber',
    body: 'FTTH gigabit across Rome, Viterbo, Latina, Frosinone, Rieti and most coastal towns. Hill villages often run FWA at 100–300 Mbps.',
    takeaway: 'Check the exact street address on Open Fiber and TIM before you sign anything.',
  },
  {
    icon: Signal,
    title: 'Mobile signal',
    body: '4G/5G is dependable on the plains and along the A1. The Simbruini, Lepini and upper Sabina have real dead zones.',
    takeaway: 'Iliad and Vodafone are the usual winners inland; test on site before switching.',
  },
  {
    icon: Ship,
    title: 'Ferries',
    body: 'Civitavecchia sails to Sardinia, Sicily, Barcelona and Tunis. Formia and Terracina run to Ponza and Ventotene.',
    takeaway: 'Island hops from the Pontine coast are day trips, not expeditions.',
  },
  {
    icon: Car,
    title: 'Where a car is non-negotiable',
    body: 'Tuscia beyond Viterbo, the Ciociaria hill towns, most of Sabina and anything above 500 m.',
    takeaway: 'Rail-served towns — Bracciano, Frascati, Anagni, Fara Sabina — are the car-optional ones.',
  },
];

/* --------------------------------- section -------------------------------- */

export function LazioHealthcareInfrastructure() {
  const [area, setArea] = useState<BaseArea>(BASE_AREAS[0]);
  const [line, setLine] = useState<string | null>('av');
  const activeLine = LINES.find((l) => l.id === line) ?? null;

  return (
    <section className="relative py-16 md:py-24 bg-muted/30 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Activity className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Healthcare & Infrastructure</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Lazio has the densest concentration of hospitals, rail and runway in Italy — and all of it is
            organised around one city. Here is what that means from wherever you actually settle.
          </p>
        </div>

        <div className="mb-12 rounded-2xl border border-border bg-card/70 backdrop-blur-sm flex flex-wrap divide-x divide-border">
          {STATS.map((s, i) => (
            <StatCounter key={s.label} stat={s} index={i} />
          ))}
        </div>

        <Tabs defaultValue="healthcare">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-2 mb-10">
            <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
            <TabsTrigger value="mobility">Getting around & out</TabsTrigger>
          </TabsList>

          {/* ------------------------------ healthcare ---------------------------- */}
          <TabsContent value="healthcare" className="space-y-14">
            {/* Care tiers */}
            <div>
              <h3 className="text-2xl font-bold text-center text-foreground mb-6">How care is layered</h3>
              <div className="grid md:grid-cols-3 gap-5">
                {CARE_TIERS.map((tier, i) => {
                  const Icon = tier.icon;
                  return (
                    <motion.div
                      key={tier.tier}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.45, delay: i * 0.1 }}
                      className="relative rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
                    >
                      <span className="absolute top-4 right-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {tier.tier}
                      </span>
                      <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-bold text-lg text-foreground mb-2">{tier.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{tier.handles}</p>
                      <p className="text-sm font-medium text-foreground/90">{tier.distance}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Hospitals */}
            <div>
              <h3 className="text-2xl font-bold text-center text-foreground mb-2">The hospitals that matter</h3>
              <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
                Five in Rome, one per province. Every one below runs a 24-hour emergency room.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {HOSPITALS.map((h, i) => (
                  <motion.article
                    key={h.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="rounded-xl border border-border bg-card p-6 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-bold text-foreground leading-snug">{h.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {h.city}
                        </p>
                      </div>
                      {h.emergency && (
                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary flex-shrink-0">
                          <Ambulance className="h-3 w-3" /> 24h
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{h.blurb}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {h.specialties.map((s) => (
                        <span key={s} className="text-[11px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {h.link && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={h.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" /> Website
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" asChild>
                        <a href={h.map} target="_blank" rel="noopener noreferrer">
                          <MapPin className="w-3 h-3 mr-1" /> Map
                        </a>
                      </Button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Distance dial */}
            <div>
              <h3 className="text-2xl font-bold text-center text-foreground mb-2">How far is care, really?</h3>
              <p className="text-center text-muted-foreground mb-6">Pick where you are thinking of living.</p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {BASE_AREAS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setArea(a)}
                    className={cn(
                      'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all hover:border-primary/50',
                      area.id === a.id
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-background text-muted-foreground'
                    )}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
              <Card className="max-w-4xl mx-auto border-2 border-primary/20">
                <CardContent className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={area.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.28 }}
                    >
                      <p className="text-sm text-muted-foreground mb-6">{area.towns}</p>
                      <div className="grid sm:grid-cols-2 gap-8">
                        <Dial minutes={area.localMin} label="Nearest full hospital" sub={area.local} tone="primary" />
                        <Dial minutes={area.romeMin} label="Rome teaching hospital" sub={area.rome} tone="accent" />
                      </div>
                      <p className="mt-6 pt-4 border-t border-border text-sm text-foreground/90">{area.note}</p>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* SSN steps */}
            <div>
              <h3 className="text-2xl font-bold text-center text-foreground mb-2">Getting into the system</h3>
              <p className="text-center text-muted-foreground mb-6">
                Four steps, in this order. Skip one and the next office sends you home.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                {SSN_STEPS.map((s, i) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: i * 0.12 }}
                    className="relative rounded-xl border border-border bg-card p-5"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-3">
                      {i + 1}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center mt-5 max-w-3xl mx-auto">
                Not yet resident? Private cover bridges the gap — a specialist visit runs €80–150 in Rome and
                less in the provinces, usually within days rather than months.
              </p>
            </div>

            {/* Emergency numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {EMERGENCY.map((e) => {
                const Icon = e.icon;
                return (
                  <div key={e.code} className="rounded-xl border border-border bg-card p-5 text-center">
                    <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground tabular-nums">{e.code}</p>
                    <p className="text-xs text-muted-foreground mt-1">{e.label}</p>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ------------------------------- mobility ----------------------------- */}
          <TabsContent value="mobility" className="space-y-14">
            {/* Airports */}
            <div>
              <h3 className="text-2xl font-bold text-center text-foreground mb-6">Two airports, two jobs</h3>
              <div className="grid md:grid-cols-2 gap-5">
                {AIRPORTS.map((a, i) => (
                  <motion.div
                    key={a.code}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border flex items-start gap-4">
                      <Plane className="h-9 w-9 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-mono text-sm text-primary">{a.code}</p>
                        <h4 className="font-bold text-lg text-foreground">{a.name}</h4>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.role}</p>
                      <p className="text-xs uppercase tracking-wide font-semibold text-primary mb-2">
                        Getting there from central Rome
                      </p>
                      <ul className="space-y-2 mb-4">
                        {a.access.map((opt) => (
                          <li key={opt.label} className="flex justify-between gap-3 text-sm border-b border-border/60 pb-2 last:border-0">
                            <span className="text-muted-foreground">{opt.label}</span>
                            <span className="font-medium text-foreground whitespace-nowrap">{opt.value}</span>
                          </li>
                        ))}
                      </ul>
                      <Button size="sm" variant="outline" asChild>
                        <a href={a.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" /> Airport site
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Rail schematic */}
            <div>
              <h3 className="text-2xl font-bold text-center text-foreground mb-2">The lines that shape where you can live</h3>
              <p className="text-center text-muted-foreground mb-6">
                Tap a line on the schematic — or in the list — to see what it serves.
              </p>
              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 items-start">
                <div className="rounded-xl border border-border bg-card p-3">
                  <RailSchematic active={line} onSelect={setLine} />
                </div>
                <div className="space-y-2">
                  {LINES.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLine(l.id)}
                      className={cn(
                        'w-full text-left rounded-lg border-2 px-4 py-3 transition-all',
                        line === l.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-background hover:border-primary/40'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {l.kind === 'road' ? (
                          <Car className="h-4 w-4 text-muted-foreground" />
                        ) : l.kind === 'high-speed' ? (
                          <TrainFront className="h-4 w-4 text-primary" />
                        ) : (
                          <Train className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-medium text-sm text-foreground">{l.name}</span>
                      </div>
                      <AnimatePresence initial={false}>
                        {line === l.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-primary mt-2">{l.serves}</p>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{l.detail}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>
              </div>
              {activeLine && (
                <p className="sr-only" aria-live="polite">
                  {activeLine.name}: {activeLine.serves}
                </p>
              )}
            </div>

            {/* Reach comparison */}
            <div>
              <h3 className="text-2xl font-bold text-center text-foreground mb-2">Rail versus car, from Roma Termini</h3>
              <p className="text-center text-muted-foreground mb-6">Door-to-door minutes, typical off-peak.</p>
              <div className="max-w-3xl mx-auto space-y-5">
                {REACH.map((r, i) => (
                  <motion.div
                    key={r.city}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{r.city}</span>
                      <span className="text-muted-foreground tabular-nums">
                        rail {Math.floor(r.rail / 60)}h{String(r.rail % 60).padStart(2, '0')} · car{' '}
                        {Math.floor(r.car / 60)}h{String(r.car % 60).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(r.rail / MAX_REACH) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-foreground/40"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(r.car / MAX_REACH) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="flex justify-center gap-6 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-6 rounded-full bg-primary" /> Rail
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-6 rounded-full bg-foreground/40" /> Car
                  </span>
                </div>
              </div>
            </div>

            {/* Connectivity */}
            <div>
              <h3 className="text-2xl font-bold text-center text-foreground mb-6">The practical fine print</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                {CONNECTIVITY.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="rounded-xl border border-border bg-card p-6 flex flex-col"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2">{c.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{c.body}</p>
                      <p className="text-sm text-foreground/90 border-t border-border pt-3 leading-snug">{c.takeaway}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default LazioHealthcareInfrastructure;
