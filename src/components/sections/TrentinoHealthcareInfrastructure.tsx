import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse,
  Hospital,
  Languages,
  Mountain,
  Plane,
  Stethoscope,
  Timer,
  ExternalLink,
  ClipboardList,
  Snowflake,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------------------------------------------- data */

const stats = [
  { value: '2', label: 'Separate provincial health services — Trento (APSS) and Alto Adige (Sabes)' },
  { value: '#1', label: 'Alto Adige and Trentino sit at the top of Italy’s LEA care-quality scoring' },
  { value: '13', label: 'Hospitals with a staffed emergency room across the two provinces' },
  { value: '4', label: 'Rescue helicopters on permanent standby: Pelikan 1–3 and Aiut Alpin Dolomites' },
];

type SystemId = 'trento' | 'bolzano';

const systems: Record<
  SystemId,
  {
    label: string;
    subtitle: string;
    authority: string;
    link: string;
    language: string;
    rows: { k: string; v: string }[];
    honest: string;
  }
> = {
  trento: {
    label: 'Trentino · APSS',
    subtitle: 'Provincia Autonoma di Trento',
    authority: 'Azienda Provinciale per i Servizi Sanitari',
    link: 'https://www.apss.tn.it/',
    language: 'Italian throughout. German is useful in Val di Fassa’s Ladin communes, never required.',
    rows: [
      { k: 'Who runs it', v: 'The province, not Rome. Trento funds and manages its own health service out of the autonomy budget.' },
      { k: 'Registering', v: 'Residency at the comune → APSS distretto office → tessera sanitaria and a medico di base, usually same week.' },
      { k: 'Ticket (co-pay)', v: 'Provincial scale, exempt over a modest income threshold for pensioners. Specialist visits typically €20–50.' },
      { k: 'Hub hospital', v: 'Santa Chiara, Trento — plus the new Trentino hospital network with Rovereto as second pole.' },
      { k: 'Waiting lists', v: 'Among Italy’s shortest, but valley clinics book slower than the city. Book in Trento if you can travel.' },
    ],
    honest: 'Trentino behaves like a very well-run Italian region: familiar rules, better funding, less paperwork drama.',
  },
  bolzano: {
    label: 'Alto Adige · Sabes',
    subtitle: 'Provincia Autonoma di Bolzano – Südtirol',
    authority: 'Azienda Sanitaria dell’Alto Adige / Südtiroler Sanitätsbetrieb',
    link: 'https://www.sabes.it/',
    language: 'Bilingual by law. Staff must hold the patentino; you can be treated entirely in German or entirely in Italian.',
    rows: [
      { k: 'Who runs it', v: 'A single provincial company with four health districts: Bolzano, Merano, Bressanone, Brunico.' },
      { k: 'Registering', v: 'Same sequence, but the district office paperwork exists in both languages — bring the one you read best.' },
      { k: 'Ticket (co-pay)', v: 'Provincial tariff, with broader exemptions than the national scheme. Pharmacy cover is generous.' },
      { k: 'Hub hospital', v: 'Ospedale San Maurizio / Krankenhaus Bozen — the referral centre for the whole province.' },
      { k: 'The bilingual catch', v: 'The patentino requirement shrinks the hiring pool; some specialties run short-staffed and recruit from Austria.' },
    ],
    honest: 'The best-resourced health system in Italy — with a language rule that occasionally leaves a rota unfilled.',
  },
};

interface HospitalItem {
  name: string;
  city: string;
  province: 'Trento' | 'Bolzano';
  emergency: boolean;
  role: string;
  specialties: string[];
  link: string;
}

const hospitals: HospitalItem[] = [
  {
    name: 'Ospedale San Maurizio / Krankenhaus Bozen',
    city: 'Bolzano',
    province: 'Bolzano',
    emergency: true,
    role: 'Provincial hub',
    specialties: ['Cardiac surgery', 'Neurosurgery', 'Oncology', 'Trauma'],
    link: 'https://www.sabes.it/',
  },
  {
    name: 'Ospedale Santa Chiara',
    city: 'Trento',
    province: 'Trento',
    emergency: true,
    role: 'Provincial hub',
    specialties: ['Cardiology', 'Stroke unit', 'Oncology', 'Complex surgery'],
    link: 'https://www.apss.tn.it/',
  },
  {
    name: 'Ospedale Santa Maria del Carmine',
    city: 'Rovereto',
    province: 'Trento',
    emergency: true,
    role: 'Second pole',
    specialties: ['Emergency', 'Orthopaedics', 'Maternity', 'Diagnostics'],
    link: 'https://www.apss.tn.it/',
  },
  {
    name: 'Ospedale di Merano / Krankenhaus Meran',
    city: 'Merano',
    province: 'Bolzano',
    emergency: true,
    role: 'District hospital',
    specialties: ['Emergency', 'Internal medicine', 'Rehabilitation'],
    link: 'https://www.sabes.it/',
  },
  {
    name: 'Ospedale di Bressanone / Brixen',
    city: 'Bressanone',
    province: 'Bolzano',
    emergency: true,
    role: 'District hospital',
    specialties: ['Emergency', 'Surgery', 'Maternity'],
    link: 'https://www.sabes.it/',
  },
  {
    name: 'Ospedale di Brunico / Bruneck',
    city: 'Brunico',
    province: 'Bolzano',
    emergency: true,
    role: 'District hospital',
    specialties: ['Emergency', 'Mountain trauma', 'Orthopaedics'],
    link: 'https://www.sabes.it/',
  },
  {
    name: 'Ospedale di Vipiteno / Sterzing',
    city: 'Vipiteno',
    province: 'Bolzano',
    emergency: true,
    role: 'Small valley hospital',
    specialties: ['Emergency', 'Day surgery', 'Sports medicine'],
    link: 'https://www.sabes.it/',
  },
  {
    name: 'Ospedale di Silandro / Schlanders',
    city: 'Silandro',
    province: 'Bolzano',
    emergency: true,
    role: 'Small valley hospital',
    specialties: ['Emergency', 'Internal medicine'],
    link: 'https://www.sabes.it/',
  },
  {
    name: 'Ospedale di Cavalese',
    city: 'Cavalese',
    province: 'Trento',
    emergency: true,
    role: 'Valley hospital',
    specialties: ['Emergency', 'Ski trauma', 'Rehabilitation'],
    link: 'https://www.apss.tn.it/',
  },
  {
    name: 'Ospedale di Cles',
    city: 'Cles',
    province: 'Trento',
    emergency: true,
    role: 'Valley hospital',
    specialties: ['Emergency', 'Surgery', 'Diagnostics'],
    link: 'https://www.apss.tn.it/',
  },
  {
    name: 'Ospedale San Lorenzo',
    city: 'Borgo Valsugana',
    province: 'Trento',
    emergency: true,
    role: 'Valley hospital',
    specialties: ['Emergency', 'Internal medicine', 'Geriatrics'],
    link: 'https://www.apss.tn.it/',
  },
  {
    name: 'Ospedale di Arco',
    city: 'Arco',
    province: 'Trento',
    emergency: false,
    role: 'Specialist centre',
    specialties: ['Rehabilitation', 'Neuro-rehab', 'Long-term care'],
    link: 'https://www.apss.tn.it/',
  },
  {
    name: 'Ospedale di Tione',
    city: 'Tione di Trento',
    province: 'Trento',
    emergency: true,
    role: 'Valley hospital',
    specialties: ['Emergency', 'Ski trauma', 'General medicine'],
    link: 'https://www.apss.tn.it/',
  },
];

interface Band {
  id: string;
  label: string;
  altitude: string;
  examples: string;
  gp: number;
  er: number;
  hub: number;
  heli: number;
  winter: string;
  verdict: string;
}

const bands: Band[] = [
  {
    id: 'valley-city',
    label: 'Valley cities',
    altitude: '200–300 m',
    examples: 'Bolzano, Trento, Rovereto, Merano',
    gp: 5,
    er: 10,
    hub: 10,
    heli: 8,
    winter: 'Roads cleared before dawn; snow chains are a formality, not a plan.',
    verdict: 'A full teaching hospital inside the city. This is metropolitan-grade care with mountain air.',
  },
  {
    id: 'wine-belt',
    label: 'Wine belt & lake shore',
    altitude: '200–500 m',
    examples: 'Appiano, Termeno, Mezzocorona, Riva del Garda, Arco',
    gp: 8,
    er: 20,
    hub: 30,
    heli: 10,
    winter: 'Mild. The Garda end rarely sees settled snow at all.',
    verdict: 'Twenty minutes to an emergency room, half an hour to a hub. The sweet spot for most retirees.',
  },
  {
    id: 'side-valley',
    label: 'Side valleys',
    altitude: '500–900 m',
    examples: 'Cavalese, Cles, Bressanone, Brunico, Borgo Valsugana',
    gp: 10,
    er: 15,
    hub: 55,
    heli: 12,
    winter: 'Well-ploughed valley floors; the pass roads above you are the ones that close.',
    verdict: 'Your own valley hospital handles the basics; anything complex is a drive down to Trento or Bolzano.',
  },
  {
    id: 'high-village',
    label: 'High villages',
    altitude: '1,000–1,500 m',
    examples: 'Ortisei, Canazei, Selva, Sesto, Madonna di Campiglio',
    gp: 15,
    er: 40,
    hub: 90,
    heli: 15,
    winter: 'Passes close, roads convoy behind the plough, and an hour becomes two after heavy snow.',
    verdict: 'Beautiful, and the honest trade: routine care is fine, but plan around the drive for anything scheduled.',
  },
];

const heliUnits = [
  {
    name: 'Pelikan 1, 2 & 3',
    detail: 'Provincial air rescue based at Bolzano, Bressanone and Laives — crewed with an emergency doctor, flying year-round.',
    link: 'https://www.provinz.bz.it/sicherheit-zivilschutz/zivilschutz/flugrettung.asp',
  },
  {
    name: 'Aiut Alpin Dolomites',
    detail: 'The Dolomite rescue helicopter out of Pontives, run with the alpine rescue corps and mountain-trained medics.',
    link: 'https://www.aiut-alpin-dolomites.com/',
  },
  {
    name: 'Trentino Emergenza 112',
    detail: 'One number for both provinces. The dispatcher decides ambulance or helicopter — for a mountain address, often the latter.',
    link: 'https://www.trentinoemergenza.it/',
  },
];

const enrolSteps = [
  { step: 'Codice fiscale', detail: 'Agenzia delle Entrate, free and same-day. Nothing else moves without it.' },
  { step: 'Residency at the comune', detail: 'The anagrafe registers you; the local vigile confirms you actually live at the address.' },
  { step: 'District health office', detail: 'APSS distretto in Trentino, Sabes Sprengel in Alto Adige. Bring passport, permesso/visa, residency, codice fiscale.' },
  { step: 'Tessera sanitaria + medico di base', detail: 'Choose your GP from the district list on the spot; the card follows by post within weeks.' },
];

const crossBorder = [
  'Innsbruck is 90 minutes from Bolzano by motorway, and the Austrian clinics there are used routinely for second opinions and specialised treatment.',
  'Cross-border care inside the EU runs on the S1 form and the European health card — emergencies are covered, electives need prior authorisation from your province.',
  'Both provinces keep formal agreements with Austrian hospitals; ask the district office for the *assistenza transfrontaliera* desk rather than arranging it yourself.',
  'Private clinics (Villa Bianca in Trento, Bonvicini in Bolzano) exist for speed, not necessity — an MRI in days rather than weeks for a few hundred euro.',
];

/* ------------------------------------------------------------ component */

export default function TrentinoHealthcareInfrastructure() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [system, setSystem] = useState<SystemId>('bolzano');
  const [provinceFilter, setProvinceFilter] = useState<'all' | 'Trento' | 'Bolzano'>('all');
  const [erOnly, setErOnly] = useState(false);
  const [bandId, setBandId] = useState<string>(bands[1].id);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const filteredHospitals = useMemo(
    () =>
      hospitals.filter(
        (h) => (provinceFilter === 'all' || h.province === provinceFilter) && (!erOnly || h.emergency)
      ),
    [provinceFilter, erOnly]
  );

  const band = bands.find((b) => b.id === bandId) ?? bands[0];
  const maxMin = 90;
  const active = systems[system];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
            Healthcare &amp; infrastructure
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Two Health Systems, One Mountain Range</h2>
          <p className="text-lg text-muted-foreground">
            Autonomy means Rome does not run the hospitals here — the provinces do, with their own budgets, their own
            rules and, in Alto Adige, their own language law. The result is the best-funded care in Italy, delivered
            across terrain that decides how quickly it reaches you.
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-background p-5 text-center shadow-soft"
            >
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{s.value}</p>
              <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* System switcher */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Languages className="h-5 w-5 text-primary" />
            <h3 className="text-xl md:text-2xl font-bold">Which system are you actually in?</h3>
          </div>
          <div className="inline-flex rounded-full border border-border bg-background p-1 mb-5">
            {(Object.keys(systems) as SystemId[]).map((id) => (
              <button
                key={id}
                onClick={() => setSystem(id)}
                className={cn(
                  'px-5 py-2 rounded-full text-sm font-semibold transition-colors',
                  system === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {systems[id].label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={system}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
                <div>
                  <p className="font-bold text-lg">{active.authority}</p>
                  <p className="text-sm text-muted-foreground">{active.subtitle}</p>
                </div>
                <a
                  href={active.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  Official site <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="rounded-2xl bg-primary/5 border-l-4 border-primary p-4 mb-5">
                <p className="text-sm text-foreground/90">
                  <span className="font-semibold">Language: </span>
                  {active.language}
                </p>
              </div>

              <dl className="grid md:grid-cols-2 gap-4">
                {active.rows.map((r) => (
                  <div key={r.k} className="rounded-2xl bg-muted/50 p-4">
                    <dt className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">{r.k}</dt>
                    <dd className="text-sm text-foreground/85 leading-relaxed">{r.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-sm italic text-muted-foreground">{active.honest}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Altitude access */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Mountain className="h-5 w-5 text-primary" />
            <h3 className="text-xl md:text-2xl font-bold">How fast does help arrive where you live?</h3>
          </div>
          <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
            <div className="flex flex-wrap gap-2 mb-6">
              {bands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBandId(b.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                    bandId === b.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={band.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-5">
                  <p className="font-bold">{band.label}</p>
                  <p className="text-sm text-primary font-semibold">{band.altitude}</p>
                  <p className="text-sm text-muted-foreground">{band.examples}</p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Stethoscope, label: 'Walk-in to your medico di base', value: band.gp },
                    { icon: HeartPulse, label: 'Drive to the nearest emergency room', value: band.er },
                    { icon: Hospital, label: 'Drive to a hub hospital (Trento / Bolzano)', value: band.hub },
                    { icon: Plane, label: 'Helicopter on scene, 112 call to landing', value: band.heli },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                        <p className="flex items-center gap-2 text-sm font-medium">
                          <row.icon className="h-4 w-4 text-primary" />
                          {row.label}
                        </p>
                        <p className="text-sm font-bold text-primary">{row.value} min</p>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (row.value / maxMin) * 100)}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="rounded-2xl bg-muted/50 p-4">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                      <Snowflake className="h-3.5 w-3.5" /> Winter reality
                    </p>
                    <p className="text-sm text-foreground/85">{band.winter}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/5 border-l-4 border-primary p-4">
                    <p className="text-sm text-foreground/90">{band.verdict}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <p className="mt-6 text-xs text-muted-foreground">
              Figures are typical door-to-door times in fair weather, not guarantees. In the high valleys the helicopter
              is frequently the faster option, and the dispatcher will make that call for you.
            </p>
          </div>
        </div>

        {/* Air rescue */}
        <div className="max-w-5xl mx-auto mb-12 grid md:grid-cols-3 gap-4">
          {heliUnits.map((u, i) => (
            <motion.a
              key={u.name}
              href={u.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 * i }}
              className="rounded-2xl border border-border bg-background p-5 shadow-soft hover:shadow-lg transition-shadow"
            >
              <p className="flex items-center gap-2 font-semibold mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {u.name}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{u.detail}</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                Details <ExternalLink className="h-3 w-3" />
              </span>
            </motion.a>
          ))}
        </div>

        {/* Hospitals */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Hospital className="h-5 w-5 text-primary" />
            <h3 className="text-xl md:text-2xl font-bold">Where the hospitals actually are</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            {(['all', 'Trento', 'Bolzano'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProvinceFilter(p)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm border transition-colors',
                  provinceFilter === p
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {p === 'all' ? 'Both provinces' : `Province of ${p}`}
              </button>
            ))}
            <button
              onClick={() => setErOnly((v) => !v)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm border transition-colors',
                erOnly
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              24h emergency room only
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredHospitals.map((h) => (
              <motion.div
                key={h.name}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-border bg-background p-5 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold leading-snug">{h.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {h.city} · {h.role}
                    </p>
                  </div>
                  {h.emergency && (
                    <span className="shrink-0 rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-1">
                      24h ER
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {h.specialties.map((s) => (
                    <span key={s} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-foreground/75">
                      {s}
                    </span>
                  ))}
                </div>
                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  Health authority <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enrolment + cross-border */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
            <div className="flex items-center gap-2 mb-5">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Getting on the books</h3>
            </div>
            <ol className="space-y-4">
              {enrolSteps.map((s, i) => (
                <li key={s.step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{s.step}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
            <div className="flex items-center gap-2 mb-5">
              <Timer className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Austria, private clinics and the short cuts</h3>
            </div>
            <ul className="space-y-3">
              {crossBorder.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-foreground/85 leading-relaxed">
                  <span className="text-primary mt-1">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
