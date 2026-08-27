import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse,
  Hospital,
  Plane,
  Train,
  Car,
  Ship,
  Mountain,
  Timer,
  ExternalLink,
  ShieldCheck,
  TriangleAlert,
  Users,
  Ambulance,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ----------------------------------------------------------------- data */

const stats = [
  { value: '28.9%', label: 'Of Ligurians are over 65 — the oldest region in Italy, and among the oldest places on earth' },
  { value: '5', label: 'Health authorities (ASL 1–5) strung along 350 km of coast, one after the other' },
  { value: '2', label: 'IRCCS national research hospitals, both in Genoa: San Martino and the Gaslini' },
  { value: '≈35 km', label: 'Average distance from any coastal town to a hospital with a staffed emergency room' },
];

type AslId = 'asl1' | 'asl2' | 'asl3' | 'asl4' | 'asl5';

interface Asl {
  id: AslId;
  label: string;
  area: string;
  towns: string;
  link: string;
  hub: string;
  x: number; // 0–100 position along the coast strip, west → east
  rows: { k: string; v: string }[];
  honest: string;
}

const asls: Asl[] = [
  {
    id: 'asl1',
    label: 'ASL 1 · Imperiese',
    area: 'Riviera dei Fiori — Ventimiglia to Andora',
    towns: 'Sanremo, Imperia, Bordighera, Ventimiglia, Diano Marina, Dolcedo',
    link: 'https://www.asl1.liguria.it/',
    hub: 'Ospedale di Imperia (Borea, Sanremo as the twin pole)',
    x: 8,
    rows: [
      { k: 'What you get locally', v: 'Two paired hospitals — Imperia for surgery and medicine, Sanremo Borea for emergency and maternity — plus Bordighera for day services.' },
      { k: 'Anything complex', v: 'Genoa, two hours east by motorway. Many residents instead cross to Monaco or Nice privately for speed.' },
      { k: 'GP density', v: 'Thin and ageing. New arrivals often wait for a list to open — ask the ASL district office which medico is accepting.' },
      { k: 'Language', v: 'Italian only in the public system, but French gets you a long way in Ventimiglia and Bordighera.' },
    ],
    honest: 'The far west is the furthest anyone in Liguria lives from a teaching hospital. Beautiful, sunny, and medically the most exposed corner of the region.',
  },
  {
    id: 'asl2',
    label: 'ASL 2 · Savonese',
    area: 'Riviera di Ponente — Alassio to Varazze and the Bormida valleys',
    towns: 'Savona, Albenga, Alassio, Finale Ligure, Pietra Ligure, Cairo Montenotte',
    link: 'https://www.asl2.liguria.it/',
    hub: 'Santa Corona, Pietra Ligure',
    x: 30,
    rows: [
      { k: 'The trump card', v: 'Santa Corona at Pietra Ligure is a genuine regional trauma and orthopaedic centre — people travel *to* it from Genoa, not away from it.' },
      { k: 'Second hospital', v: 'San Paolo in Savona covers the eastern half of the province with a full emergency room.' },
      { k: 'Inland', v: 'Albenga and Cairo Montenotte run reduced hospitals; the Bormida valleys look north to Piemonte as much as south to the sea.' },
      { k: 'Sweet spot', v: 'Between Albenga and Pietra Ligure you are ten minutes from serious orthopaedics — an underrated reason retirees settle here.' },
    ],
    honest: 'Ponente\'s quiet advantage: the best bones-and-trauma hospital on the Riviera, in a stretch of coast that costs less than Levante.',
  },
  {
    id: 'asl3',
    label: 'ASL 3 · Genovese',
    area: 'Greater Genoa and the Polcevera and Bisagno valleys',
    towns: 'Genova, Sampierdarena, Nervi, Voltri, Sestri Ponente, Camogli',
    link: 'https://www.asl3.liguria.it/',
    hub: 'IRCCS Policlinico San Martino',
    x: 52,
    rows: [
      { k: 'Depth', v: 'San Martino is one of Italy\'s largest hospitals; the Gaslini is a world-referenced paediatric institute; the Galliera is a centuries-old general hospital that punches well above its size.' },
      { k: 'Neighbourhood hospitals', v: 'Villa Scassi (Sampierdarena), Micone (Sestri Ponente), Gallino (Pontedecimo), Evangelico Internazionale (Voltri and Castelletto).' },
      { k: 'Getting there', v: 'Traffic, not distance, is the variable. San Martino sits above Albaro; from the western districts allow 40 minutes at the wrong hour.' },
      { k: 'Specialists', v: 'Everything is here — oncology, cardiology, neurosurgery, transplants. This is why Genoa is the safe medical choice for the whole region.' },
    ],
    honest: 'If health is your first filter, live within reach of Genoa. Nothing else in Liguria comes close for depth of care.',
  },
  {
    id: 'asl4',
    label: 'ASL 4 · Chiavarese',
    area: 'Tigullio and the Fontanabuona and Aveto valleys',
    towns: 'Chiavari, Rapallo, Santa Margherita, Sestri Levante, Lavagna, Portofino',
    link: 'https://www.asl4.liguria.it/',
    hub: 'Ospedale di Lavagna (N.S. di Montallegro)',
    x: 72,
    rows: [
      { k: 'The one hospital', v: 'Lavagna carries the whole Tigullio: emergency room, surgery, cardiology, imaging. Sestri Levante and Rapallo run outpatient and rehab.' },
      { k: 'Summer load', v: 'The resident population roughly doubles in August. July–September waits at Lavagna\'s pronto soccorso are the region\'s worst-kept complaint.' },
      { k: 'Complex cases', v: 'Genoa, 45 minutes by A12 or an hour by regional train from Chiavari station.' },
      { k: 'Valleys', v: 'Fontanabuona and Aveto add 20–40 minutes of hairpins. Fine in June, a different calculation in a February storm.' },
    ],
    honest: 'One hospital for the prettiest, busiest stretch of coast. It works — until everyone else\'s holiday collides with your appointment.',
  },
  {
    id: 'asl5',
    label: 'ASL 5 · Spezzino',
    area: 'Golfo dei Poeti, Cinque Terre and Val di Vara',
    towns: 'La Spezia, Lerici, Sarzana, Levanto, Monterosso, Portovenere',
    link: 'https://www.asl5.liguria.it/',
    hub: 'Ospedale Sant\'Andrea, La Spezia',
    x: 92,
    rows: [
      { k: 'Now', v: 'Sant\'Andrea in La Spezia is the emergency and acute hub, with San Bartolomeo in Sarzana as the second site.' },
      { k: 'Coming', v: 'The Felettino hospital, under construction above La Spezia, is meant to replace Sant\'Andrea with a single modern acute site.' },
      { k: 'Cinque Terre', v: 'No hospital in the five villages. Ambulances work the coast road and the rail line; serious cases go to La Spezia or by helicopter.' },
      { k: 'Neighbours', v: 'Massa, Carrara and Pisa are close enough that Spezzini cross into Tuscany for specialist care as a matter of routine.' },
    ],
    honest: 'The east is the only corner of Liguria with a genuine second option next door — Tuscany\'s hospitals are half an hour away.',
  },
];

interface HospitalItem {
  name: string;
  city: string;
  asl: AslId;
  emergency: boolean;
  role: string;
  specialties: string[];
  link: string;
}

const hospitals: HospitalItem[] = [
  {
    name: 'IRCCS Ospedale Policlinico San Martino',
    city: 'Genova',
    asl: 'asl3',
    emergency: true,
    role: 'The region\'s teaching hospital and national research institute — the end of every referral chain in Liguria.',
    specialties: ['Oncology', 'Cardiac surgery', 'Neurosurgery', 'Transplants', 'Trauma'],
    link: 'https://www.ospedalesanmartino.it/',
  },
  {
    name: 'IRCCS Istituto Giannina Gaslini',
    city: 'Genova',
    asl: 'asl3',
    emergency: true,
    role: 'Paediatric research hospital with an international reputation — relevant if grandchildren visit for long stretches.',
    specialties: ['Paediatrics', 'Rare disease', 'Paediatric surgery'],
    link: 'https://www.gaslini.org/',
  },
  {
    name: 'E.O. Ospedali Galliera',
    city: 'Genova',
    asl: 'asl3',
    emergency: true,
    role: 'A general hospital with a dedicated geriatrics tradition — one of Italy\'s reference centres for care of the very old.',
    specialties: ['Geriatrics', 'Internal medicine', 'Orthopaedics', 'Ophthalmology'],
    link: 'https://www.galliera.it/',
  },
  {
    name: 'Ospedale Villa Scassi',
    city: 'Genova Sampierdarena',
    asl: 'asl3',
    emergency: true,
    role: 'The western Genoa emergency hospital, serving Sampierdarena, Cornigliano and the Polcevera.',
    specialties: ['Emergency', 'General surgery', 'Cardiology'],
    link: 'https://www.asl3.liguria.it/',
  },
  {
    name: 'Ospedale Santa Corona',
    city: 'Pietra Ligure',
    asl: 'asl2',
    emergency: true,
    role: 'Regional trauma and orthopaedic centre. The hospital Ligurians name when they talk about broken bones and spines.',
    specialties: ['Trauma', 'Orthopaedics', 'Neurosurgery', 'Spinal unit'],
    link: 'https://www.asl2.liguria.it/',
  },
  {
    name: 'Ospedale San Paolo',
    city: 'Savona',
    asl: 'asl2',
    emergency: true,
    role: 'The provincial general hospital for Savona and its valleys.',
    specialties: ['Emergency', 'Oncology', 'Cardiology', 'Maternity'],
    link: 'https://www.asl2.liguria.it/',
  },
  {
    name: 'Ospedale Santa Maria di Misericordia',
    city: 'Albenga',
    asl: 'asl2',
    emergency: false,
    role: 'Reduced hospital with a first-aid point, day surgery and outpatient specialties for the Ingauna plain.',
    specialties: ['Day surgery', 'Outpatient', 'Diagnostics'],
    link: 'https://www.asl2.liguria.it/',
  },
  {
    name: 'Ospedale di Imperia',
    city: 'Imperia',
    asl: 'asl1',
    emergency: true,
    role: 'Surgical and medical pole of the far west, paired administratively with Sanremo.',
    specialties: ['General surgery', 'Oncology', 'Internal medicine'],
    link: 'https://www.asl1.liguria.it/',
  },
  {
    name: 'Ospedale Borea',
    city: 'Sanremo',
    asl: 'asl1',
    emergency: true,
    role: 'Emergency room and maternity for the Riviera dei Fiori.',
    specialties: ['Emergency', 'Maternity', 'Cardiology'],
    link: 'https://www.asl1.liguria.it/',
  },
  {
    name: 'Ospedale Saint Charles',
    city: 'Bordighera',
    asl: 'asl1',
    emergency: false,
    role: 'Day hospital and outpatient site for the French border strip.',
    specialties: ['Outpatient', 'Rehabilitation', 'Diagnostics'],
    link: 'https://www.asl1.liguria.it/',
  },
  {
    name: 'Ospedale N.S. di Montallegro',
    city: 'Lavagna',
    asl: 'asl4',
    emergency: true,
    role: 'The Tigullio\'s acute hospital — the only emergency room between Genoa Nervi and Sestri Levante.',
    specialties: ['Emergency', 'Cardiology', 'Surgery', 'Imaging'],
    link: 'https://www.asl4.liguria.it/',
  },
  {
    name: 'Ospedale Sant\'Andrea',
    city: 'La Spezia',
    asl: 'asl5',
    emergency: true,
    role: 'Acute hub for the gulf, the Cinque Terre and the Val di Vara.',
    specialties: ['Emergency', 'Oncology', 'Cardiology', 'Neurology'],
    link: 'https://www.asl5.liguria.it/',
  },
  {
    name: 'Ospedale San Bartolomeo',
    city: 'Sarzana',
    asl: 'asl5',
    emergency: true,
    role: 'Second site of the Spezzino, and the closest Ligurian hospital to Tuscany.',
    specialties: ['Emergency', 'Surgery', 'Maternity'],
    link: 'https://www.asl5.liguria.it/',
  },
];

const aslLabel: Record<AslId, string> = {
  asl1: 'Imperiese',
  asl2: 'Savonese',
  asl3: 'Genovese',
  asl4: 'Chiavarese',
  asl5: 'Spezzino',
};

/* ---------------------------------------------------------- the corridor */

interface Base {
  id: string;
  name: string;
  note: string;
  times: Record<string, { car: number; rail: number | null; note: string }>;
}

const destinations = [
  { id: 'goa', label: 'Genoa airport (GOA)' },
  { id: 'nce', label: 'Nice airport (NCE)' },
  { id: 'psa', label: 'Pisa airport (PSA)' },
  { id: 'mil', label: 'Milan centre' },
  { id: 'tur', label: 'Turin centre' },
  { id: 'rom', label: 'Rome centre' },
];

const bases: Base[] = [
  {
    id: 'sanremo',
    name: 'Sanremo',
    note: 'Far west. France is your nearest big city, not Italy.',
    times: {
      goa: { car: 140, rail: 165, note: 'Two hours plus on the A10 viaducts; the train is scenic and slow.' },
      nce: { car: 60, rail: 105, note: 'The practical airport for the Riviera dei Fiori — one hour door to terminal.' },
      psa: { car: 260, rail: 315, note: 'A long haul. Fly from Nice instead.' },
      mil: { car: 210, rail: 300, note: 'Via the A10 then A26 or A7 — the inland motorways do the work.' },
      tur: { car: 175, rail: 270, note: 'Over the Colle di Nava or up from Savona; Piemonte is closer than it looks.' },
      rom: { car: 400, rail: 480, note: 'A full travel day either way.' },
    },
  },
  {
    id: 'savona',
    name: 'Savona',
    note: 'The hinge: motorways north to Turin and Milan start here.',
    times: {
      goa: { car: 45, rail: 55, note: 'Comfortable. Savona is the western commuter belt for Genoa airport.' },
      nce: { car: 145, rail: 210, note: 'Doable for a cheap flight, not for a Monday morning.' },
      psa: { car: 195, rail: 240, note: 'Straight through Genoa on the A12.' },
      mil: { car: 130, rail: 145, note: 'A6 to Turin or A26 to Milan — Savona is the best-connected inland exit on the Riviera.' },
      tur: { car: 105, rail: 130, note: 'The A6 Torino–Savona is the reason Piemontesi keep beach flats here.' },
      rom: { car: 330, rail: 375, note: 'Change in Genoa; the Frecce run from there.' },
    },
  },
  {
    id: 'genova',
    name: 'Genova',
    note: 'The only place in Liguria where every mode actually converges.',
    times: {
      goa: { car: 15, rail: 20, note: 'The airport is inside the city, on the sea at Sestri Ponente.' },
      nce: { car: 195, rail: 265, note: 'Only worth it for a specific flight.' },
      psa: { car: 150, rail: 165, note: 'A12 the whole way, or an Intercity down the coast.' },
      mil: { car: 105, rail: 95, note: 'Frecciarossa and Frecciabianca run hourly; the Terzo Valico tunnel will cut this to under an hour.' },
      tur: { car: 105, rail: 105, note: 'The historic Giovi line, doubled by the A7.' },
      rom: { car: 300, rail: 270, note: 'Direct Frecciarossa without changing. The single best rail argument for living in Genoa.' },
    },
  },
  {
    id: 'chiavari',
    name: 'Chiavari',
    note: 'Levante commuter town with Intercity stops, which matters more than it sounds.',
    times: {
      goa: { car: 55, rail: 60, note: 'Train to Brignole, then the airport shuttle or Volabus.' },
      nce: { car: 240, rail: 320, note: 'Not a realistic route.' },
      psa: { car: 100, rail: 115, note: 'Tuscany is genuinely close from the Tigullio.' },
      mil: { car: 150, rail: 145, note: 'Change at Genova Piazza Principe for the Frecce.' },
      tur: { car: 150, rail: 165, note: 'Via Genoa; no direct service.' },
      rom: { car: 255, rail: 240, note: 'Some Intercity and Frecciabianca services stop at Chiavari itself.' },
    },
  },
  {
    id: 'laspezia',
    name: 'La Spezia',
    note: 'Half in Liguria, half in Tuscany\'s orbit.',
    times: {
      goa: { car: 95, rail: 105, note: 'Ninety minutes west — the reason Spezzini often fly from Pisa instead.' },
      nce: { car: 285, rail: 380, note: 'Forget it.' },
      psa: { car: 60, rail: 65, note: 'One hour to a full international airport. The east\'s quiet advantage.' },
      mil: { car: 180, rail: 180, note: 'Direct Frecciabianca services via Parma exist and are pleasant.' },
      tur: { car: 195, rail: 210, note: 'Via Genoa or Parma; neither is quick.' },
      rom: { car: 240, rail: 210, note: 'Direct Frecciarossa from La Spezia Centrale — three and a half hours to Termini.' },
    },
  },
];

interface SpineLine {
  id: string;
  name: string;
  kind: 'road' | 'rail' | 'sea';
  detail: string;
  serves: string;
}

const spine: SpineLine[] = [
  {
    id: 'a10',
    name: 'A10 Autostrada dei Fiori',
    kind: 'road',
    detail: 'Genoa to Ventimiglia and the French border: a continuous chain of viaducts and tunnels clinging to the cliff. Fast when open, and the works never really end.',
    serves: 'Ventimiglia · Sanremo · Imperia · Albenga · Savona · Genova',
  },
  {
    id: 'a12',
    name: 'A12 Genova–Rosignano',
    kind: 'road',
    detail: 'The Levante motorway through the Tigullio to La Spezia and on into Tuscany. Same engineering, same summer queues at Rapallo and Sestri.',
    serves: 'Genova · Rapallo · Chiavari · Sestri Levante · La Spezia',
  },
  {
    id: 'a7a26',
    name: 'A7 & A26 — the way north',
    kind: 'road',
    detail: 'The two mountain motorways over the Apennines to Milan and Alessandria. The A7 Serravalle is the historic lifeline; the A26 out of Voltri carries the freight.',
    serves: 'Genova · Serravalle · Milano · Alessandria · Gravellona',
  },
  {
    id: 'aurelia',
    name: 'SS1 Via Aurelia',
    kind: 'road',
    detail: 'The Roman road, still the local street of every coastal town. Beautiful, slow, and the only way through when the motorway shuts.',
    serves: 'Every single coastal comune, end to end',
  },
  {
    id: 'railwest',
    name: 'Genova–Ventimiglia line',
    kind: 'rail',
    detail: 'Doubled and moved inland through Ponente, which made it faster and took the stations away from the sea. Regional trains stop everywhere; a handful of Intercity run through to France.',
    serves: 'Ventimiglia · Sanremo · Imperia · Albenga · Finale · Savona · Genova',
  },
  {
    id: 'raileast',
    name: 'Genova–La Spezia–Pisa line',
    kind: 'rail',
    detail: 'The Levante line, including the Cinque Terre stations that make the villages reachable without a car. Frecce continue to Rome and Milan from La Spezia.',
    serves: 'Genova · Camogli · Chiavari · Levanto · Cinque Terre · La Spezia',
  },
  {
    id: 'terzovalico',
    name: 'Terzo Valico dei Giovi',
    kind: 'rail',
    detail: 'The high-speed freight and passenger tunnel under the Apennines to the Po valley — the largest infrastructure project in the region\'s modern history, and the one that finally puts Milan under an hour from Genoa.',
    serves: 'Genova · Novi Ligure · Tortona · Milano · Torino',
  },
  {
    id: 'sea',
    name: 'The sea route',
    kind: 'sea',
    detail: 'Genoa is one of the Mediterranean\'s biggest ports: ferries to Sardinia, Sicily, Corsica, Barcelona and Tangier, plus the year-round Golfo Paradiso and Cinque Terre coastal boats.',
    serves: 'Genova · Savona · Camogli · Portofino · Cinque Terre · Portovenere',
  },
];

const airports = [
  {
    code: 'GOA',
    name: 'Genova Cristoforo Colombo',
    detail: 'On a peninsula in the sea, fifteen minutes from the old town. Small, easy, and honest about it: Rome, a handful of European capitals, seasonal charters.',
    good: 'Domestic hops and short European runs without a two-hour drive.',
    link: 'https://www.airport.genova.it/',
  },
  {
    code: 'NCE',
    name: 'Nice Côte d\'Azur',
    detail: 'Sixty minutes from Sanremo and one of the best-connected airports in southern Europe — including the long-haul flights home that Genoa cannot offer.',
    good: 'Anyone west of Savona flying to North America or northern Europe.',
    link: 'https://www.nice.aeroport.fr/',
  },
  {
    code: 'PSA',
    name: 'Pisa Galileo Galilei',
    detail: 'An hour from La Spezia with a station in the terminal. The Levante\'s default low-cost airport.',
    good: 'The east coast, and anyone chasing Ryanair and easyJet fares.',
    link: 'https://www.pisa-airport.com/',
  },
  {
    code: 'MXP',
    name: 'Milano Malpensa',
    detail: 'Under two hours from Genoa by motorway, with direct coaches. The long-haul answer for the centre and east of the region.',
    good: 'Intercontinental flights and a wide choice of carriers.',
    link: 'https://www.milanomalpensa-airport.com/',
  },
];

/* --------------------------------------------------------- the fragility */

const fragilities = [
  {
    icon: TriangleAlert,
    title: 'One line, no alternative',
    body: 'Liguria is 350 km long and rarely more than 30 km deep. Motorway, railway and Aurelia run in the same narrow strip. When one closes — landslide, viaduct works, an accident in a tunnel — the others absorb it and the whole coast slows down.',
    workaround: 'Live within a short drive of a rail station. The train is the only mode unaffected by a motorway closure.',
  },
  {
    icon: Mountain,
    title: 'The valleys add time, not distance',
    body: 'Dolcedo is 12 km from Imperia and 25 minutes away. Fontanabuona, Val di Vara and the Bormida valleys all work the same way: hairpins, single lanes, and a different calculation entirely after heavy rain.',
    workaround: 'Judge inland houses in minutes to the pronto soccorso, never in kilometres.',
  },
  {
    icon: Ambulance,
    title: 'Volunteers carry the ambulances',
    body: 'Croce Verde, Croce Bianca, Croce Rossa and the Misericordie run most of Liguria\'s ambulance service, town by town, with paid crews at the hospitals. It is genuinely good — and it is one of the easiest ways for a newcomer to become part of a town.',
    workaround: 'Ring 112. Dispatch decides ambulance, medicalised car, or the Grifo helicopter for a valley address.',
  },
  {
    icon: Users,
    title: 'The oldest region ages the queue',
    body: 'Nearly three Ligurians in ten are pensioners. Demand for geriatrics, cardiology and orthopaedics is structurally high, which is why waiting lists for scheduled specialist visits are longer than the quality of the hospitals suggests.',
    workaround: 'Use the CUP booking line the day slots open, and keep a private studio in reserve for imaging — an MRI runs roughly €150–300 within days.',
  },
];

const enrolSteps = [
  { step: 'Codice fiscale', detail: 'Agenzia delle Entrate, free, same day. Nothing else in Italy moves without it.' },
  { step: 'Residenza at the comune', detail: 'The anagrafe registers you and the vigile calls round to confirm you actually live there.' },
  { step: 'ASL district office', detail: 'Your distretto in ASL 1–5. Bring passport, visa or permesso, residency certificate and codice fiscale.' },
  { step: 'Tessera sanitaria + medico di base', detail: 'Choose a GP from the district list on the spot. In busy coastal towns, ask which lists are actually open before you pick a neighbourhood.' },
];

const emergencyNumbers = [
  { n: '112', label: 'Single European emergency number — police, fire, ambulance' },
  { n: '118', label: 'Still routed for medical emergencies' },
  { n: '1530', label: 'Coast guard at sea — the one to programme if you keep a boat' },
  { n: '116117', label: 'Out-of-hours GP (guardia medica)' },
];

/* ------------------------------------------------------------- component */

type TabId = 'care' | 'lines' | 'reality';

const tabs: { id: TabId; label: string; icon: typeof HeartPulse }[] = [
  { id: 'care', label: 'Care along the line', icon: HeartPulse },
  { id: 'lines', label: 'The one-line region', icon: Train },
  { id: 'reality', label: 'When the line breaks', icon: TriangleAlert },
];

function CoastStrip({ active, onSelect }: { active: AslId; onSelect: (id: AslId) => void }) {
  const width = 1000;
  const height = 150;
  const coastY = (x: number) => 78 + Math.sin(((x / width) * Math.PI)) * -26;
  const path = Array.from({ length: 41 }, (_, i) => {
    const x = (i / 40) * width;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${coastY(x).toFixed(1)}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Liguria's coast with its five health authorities">
      <defs>
        <linearGradient id="lig-land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--muted))" />
          <stop offset="100%" stopColor="hsl(var(--background))" />
        </linearGradient>
        <linearGradient id="lig-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.28)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.06)" />
        </linearGradient>
      </defs>
      <path d={`${path} L${width},0 L0,0 Z`} fill="url(#lig-land)" />
      <path d={`${path} L${width},${height} L0,${height} Z`} fill="url(#lig-sea)" />
      <path d={path} stroke="hsl(var(--primary))" strokeWidth={2} fill="none" />

      {asls.map((a) => {
        const x = (a.x / 100) * width;
        const y = coastY(x);
        const isActive = a.id === active;
        return (
          <g
            key={a.id}
            transform={`translate(${x} ${y})`}
            className="cursor-pointer"
            onClick={() => onSelect(a.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(a.id)}
          >
            <circle r={isActive ? 13 : 9} fill="hsl(var(--primary))" opacity={isActive ? 1 : 0.55} />
            <circle r={isActive ? 5 : 3.5} fill="hsl(var(--primary-foreground))" />
            <text
              y={-22}
              textAnchor="middle"
              className="text-[15px] font-semibold"
              fill="hsl(var(--foreground))"
              opacity={isActive ? 1 : 0.6}
            >
              {aslLabel[a.id]}
            </text>
          </g>
        );
      })}
      <text x={12} y={height - 12} className="text-[14px]" fill="hsl(var(--muted-foreground))">West · France</text>
      <text x={width - 12} y={height - 12} textAnchor="end" className="text-[14px]" fill="hsl(var(--muted-foreground))">East · Tuscany</text>
    </svg>
  );
}

export default function LiguriaHealthcareInfrastructure() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<TabId>('care');
  const [aslId, setAslId] = useState<AslId>('asl3');
  const [erOnly, setErOnly] = useState(false);
  const [baseId, setBaseId] = useState(bases[2].id);
  const [destId, setDestId] = useState(destinations[3].id);
  const [spineId, setSpineId] = useState(spine[0].id);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const asl = asls.find((a) => a.id === aslId) ?? asls[2];
  const base = bases.find((b) => b.id === baseId) ?? bases[0];
  const line = spine.find((s) => s.id === spineId) ?? spine[0];
  const leg = base.times[destId];

  const filteredHospitals = useMemo(
    () => hospitals.filter((h) => (!erOnly || h.emergency)),
    [erOnly]
  );

  const maxLeg = 480;

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
            Healthcare &amp; infrastructure
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">A Region Shaped Like a Corridor</h2>
          <p className="text-lg text-muted-foreground">
            Liguria is 350 kilometres long and almost nowhere wide. Everything — hospitals, motorways, railway, the
            Aurelia — is threaded along the same strip between mountain and sea. That geometry decides how fast care
            reaches you, how easily you leave, and what happens on the day one link fails.
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-background p-5 text-center shadow-soft"
            >
              <p className="text-2xl md:text-3xl font-bold text-primary mb-2">{s.value}</p>
              <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors',
                  tab === t.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ------------------------------------------------------ TAB 1 */}
          {tab === 'care' && (
            <motion.div
              key="care"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-6xl mx-auto space-y-10"
            >
              <div className="rounded-3xl border border-border bg-background p-5 md:p-8 shadow-soft">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Five health authorities, west to east</h3>
                <p className="text-muted-foreground mb-6">
                  Click along the coast. Each ASL is its own world: its own hub hospital, its own waiting lists, its own
                  answer to the question of what happens when something serious goes wrong.
                </p>
                <CoastStrip active={aslId} onSelect={setAslId} />

                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                  {asls.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAslId(a.id)}
                      className={cn(
                        'rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors',
                        a.id === aslId
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                      )}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={asl.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">{asl.area}</p>
                      <h4 className="text-xl font-bold mb-1">{asl.label}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{asl.towns}</p>
                      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 mb-4">
                        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Hub hospital</p>
                        <p className="text-sm font-semibold">{asl.hub}</p>
                      </div>
                      <p className="text-sm text-foreground/90 italic leading-relaxed mb-4">{asl.honest}</p>
                      <a
                        href={asl.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                      >
                        {asl.label} official site <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <div className="space-y-3">
                      {asl.rows.map((r) => (
                        <div key={r.k} className="rounded-xl border border-border bg-muted/30 p-4">
                          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">{r.k}</p>
                          <p className="text-sm leading-relaxed">{r.v}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Hospital roster */}
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-1">The hospitals, named</h3>
                    <p className="text-muted-foreground text-sm">
                      Thirteen sites you would actually be sent to, with what each is genuinely good at.
                    </p>
                  </div>
                  <button
                    onClick={() => setErOnly((v) => !v)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors',
                      erOnly
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:text-foreground'
                    )}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Emergency room only
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHospitals.map((h, i) => (
                    <motion.article
                      key={h.name}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.4) }}
                      className="rounded-2xl border border-border bg-background p-5 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="font-bold leading-snug">{h.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {h.city} · ASL {h.asl.slice(3)} {aslLabel[h.asl]}
                          </p>
                        </div>
                        <Hospital className="h-5 w-5 text-primary flex-shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1">{h.role}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {h.emergency && (
                          <span className="rounded-full bg-primary/15 text-primary text-[11px] font-semibold px-2.5 py-1">
                            Pronto soccorso
                          </span>
                        )}
                        {h.specialties.map((s) => (
                          <span key={s} className="rounded-full bg-muted text-muted-foreground text-[11px] px-2.5 py-1">
                            {s}
                          </span>
                        ))}
                      </div>
                      <a
                        href={h.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        Official site <ExternalLink className="h-3 w-3" />
                      </a>
                    </motion.article>
                  ))}
                </div>
              </div>

              {/* Enrolment + numbers */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Getting onto the SSN</h3>
                  </div>
                  <ol className="space-y-4">
                    {enrolSteps.map((s, i) => (
                      <li key={s.step} className="flex gap-4">
                        <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
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
                  <div className="flex items-center gap-2 mb-4">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Numbers worth memorising</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {emergencyNumbers.map((e) => (
                      <div key={e.n} className="rounded-2xl border border-border bg-muted/30 p-4">
                        <p className="text-2xl font-bold text-primary mb-1">{e.n}</p>
                        <p className="text-xs text-muted-foreground leading-snug">{e.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                    Along the border strip, the operator will handle French; in Genoa's port districts, English is
                    usually available on the 112 line.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------ TAB 2 */}
          {tab === 'lines' && (
            <motion.div
              key="lines"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-6xl mx-auto space-y-10"
            >
              {/* Reach comparator */}
              <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">How far is the rest of the world?</h3>
                <p className="text-muted-foreground mb-6">
                  Pick where you would live, then where you need to get to. The answer changes more between Sanremo and
                  La Spezia than it does between most Italian regions.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Home base</p>
                    <div className="flex flex-wrap gap-2">
                      {bases.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setBaseId(b.id)}
                          className={cn(
                            'rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors',
                            b.id === baseId
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                          )}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 italic">{base.note}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Destination</p>
                    <div className="flex flex-wrap gap-2">
                      {destinations.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDestId(d.id)}
                          className={cn(
                            'rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors',
                            d.id === destId
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Car, label: 'By car', minutes: leg.car },
                    { icon: Train, label: 'By train', minutes: leg.rail },
                  ].map((row) => {
                    const Icon = row.icon;
                    const mins = row.minutes;
                    return (
                      <div key={row.label}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="inline-flex items-center gap-2 font-semibold">
                            <Icon className="h-4 w-4 text-primary" />
                            {row.label}
                          </span>
                          <span className="text-muted-foreground">
                            {mins === null
                              ? 'no useful service'
                              : `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`}
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${((mins ?? 0) / maxLeg) * 100}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground mt-5 leading-relaxed border-l-2 border-primary/40 pl-4">
                  {leg.note}
                </p>
              </div>

              {/* Spine */}
              <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">The spine</h3>
                <p className="text-muted-foreground mb-6">
                  Four roads, three railways and a port. Between them they carry everything and everyone in Liguria.
                </p>
                <div className="grid lg:grid-cols-[240px,1fr] gap-6">
                  <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {spine.map((s) => {
                      const Icon = s.kind === 'rail' ? Train : s.kind === 'sea' ? Ship : Car;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSpineId(s.id)}
                          className={cn(
                            'flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors whitespace-nowrap lg:whitespace-normal',
                            s.id === spineId
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-muted/30 text-muted-foreground border-border hover:text-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-2xl border border-border bg-muted/20 p-6"
                    >
                      <h4 className="text-xl font-bold mb-3">{line.name}</h4>
                      <p className="text-sm leading-relaxed mb-4">{line.detail}</p>
                      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Serves</p>
                      <p className="text-sm text-muted-foreground">{line.serves}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Airports */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-5">Four airports, and which one is yours</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {airports.map((a, i) => (
                    <motion.div
                      key={a.code}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-2xl border border-border bg-background p-6 shadow-soft"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="rounded-lg bg-primary/10 text-primary font-bold px-3 py-1.5 text-sm">{a.code}</span>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-primary" />
                          <h4 className="font-bold">{a.name}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{a.detail}</p>
                      <p className="text-sm mb-3">
                        <span className="font-semibold">Best for: </span>
                        {a.good}
                      </p>
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        Flight information <ExternalLink className="h-3 w-3" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------ TAB 3 */}
          {tab === 'reality' && (
            <motion.div
              key="reality"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-5">
                {fragilities.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.article
                      key={f.title}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-2xl border border-border bg-background p-6 shadow-soft flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold">{f.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{f.body}</p>
                      <div className="border-t border-border pt-3">
                        <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-1">What locals do</p>
                        <p className="text-sm text-foreground/90 leading-snug">{f.workaround}</p>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="h-5 w-5 text-primary" />
                  <h3 className="text-xl md:text-2xl font-bold">The rule of thumb</h3>
                </div>
                <p className="text-base leading-relaxed">
                  In Liguria, judge a house by three numbers: minutes to a pronto soccorso, minutes to a railway station,
                  and minutes to the motorway ramp. Get all three under twenty and the corridor works for you — the
                  hospitals are good, the trains are frequent, and Milan, Nice and Pisa are all a manageable day.
                  Push any one of them past forty and you have bought a beautiful house with a commute attached to
                  every appointment for the rest of your life.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
