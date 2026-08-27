export type Marina = {
  id: string;
  name: string;
  town: string;
  coast: 'ponente' | 'levante';
  /** horizontal position along the stylised coast strip, 0 = French border, 100 = Tuscan border */
  x: number;
  /** vertical nudge so markers don't collide, in % of strip height */
  y: number;
  berths: number;
  maxLoa: number; // metres
  depth: string;
  /** indicative annual berth fee band for a 12 m boat, in EUR */
  rate12: [number, number];
  summary: string;
  walkable: string;
  vibe: string;
  image?: string;
  link?: string;
  linkLabel?: string;
};

export const marinas: Marina[] = [
  {
    id: 'ventimiglia',
    name: 'Cala del Forte',
    town: 'Ventimiglia',
    coast: 'ponente',
    x: 2,
    y: 20,
    berths: 178,
    maxLoa: 70,
    depth: '3–6 m',
    rate12: [4800, 7500],
    summary:
      'Owned and run by the Port of Monaco, three nautical miles from the principality and a fraction of its berth price. New basin, new pontoons, and a shuttle that treats Monaco as the neighbourhood.',
    walkable: 'Ventimiglia old town over the bridge, the Friday market, the station for Nice in forty minutes.',
    vibe: 'Monaco annex on Italian soil',
    link: 'https://www.caladelforte-ventimiglia.it/',
    linkLabel: 'caladelforte-ventimiglia.it',
  },
  {
    id: 'bordighera',
    name: 'Porto Turistico di Bordighera',
    town: 'Bordighera',
    coast: 'ponente',
    x: 5,
    y: 58,
    berths: 300,
    maxLoa: 25,
    depth: '2.5–4 m',
    rate12: [3000, 4800],
    summary:
      'A small, friendly basin under the palm terraces of the most English town on the Riviera. Boats here are used, not displayed — day-boats, small cruisers, and a fishing fleet that still lands.',
    walkable: 'Lungomare Argentina, the Città Alta, the covered market and a hospital ten minutes up the hill.',
    vibe: 'Genteel, small-boat, unhurried',
    image: '/images/liguria/bordighera.jpg',
    link: 'https://www.portodibordighera.it/',
    linkLabel: 'portodibordighera.it',
  },
  {

    id: 'sanremo',
    name: 'Portosole Sanremo',
    town: 'Sanremo',
    coast: 'ponente',
    x: 8,
    y: 30,
    berths: 804,
    maxLoa: 90,
    depth: '3–7 m',
    rate12: [4200, 6500],
    summary:
      'The Riviera dei Fiori\'s superyacht address, 25 nautical miles from Monaco and open all year. Deep water, full technical yard, and a fuel dock that never closes in August.',
    walkable: 'Old town, casino, the Thursday market and the seafront cycle path all within ten minutes on foot.',
    vibe: 'Monaco spillover with Italian prices',
    image: '/images/liguria/marina-sanremo.jpg',
    link: 'https://www.portosole.it/',
    linkLabel: 'portosole.it',
  },
  {
    id: 'imperia',
    name: 'Porto Maurizio (Go Marina)',
    town: 'Imperia',
    coast: 'ponente',
    x: 17,
    y: 62,
    berths: 1200,
    maxLoa: 90,
    depth: '4–8 m',
    rate12: [3200, 5200],
    summary:
      'One of the largest basins in the western Mediterranean, and still half-empty outside July. Imperia is where liveaboards and retirees who actually use the boat end up.',
    walkable: 'Parasio hill town, hospital, supermarkets and the Imperia–San Lorenzo cycle path from the pontoon gate.',
    vibe: 'Real town, real boatyard, no velvet rope',
    image: '/images/liguria/imperia.jpg',
    link: 'https://www.gomarina.it/',
    linkLabel: 'gomarina.it',
  },
  {
    id: 'aregai',
    name: 'Marina degli Aregai',
    town: 'Santo Stefano al Mare',
    coast: 'ponente',
    x: 12,
    y: 12,
    berths: 980,
    maxLoa: 40,
    depth: '3–5 m',
    rate12: [3000, 4800],
    summary:
      'A purpose-built resort marina between Sanremo and Imperia: quiet pontoons, its own hotel and pool, and a waiting list that moves faster than the Levante ports.',
    walkable: 'Marina village, beach clubs and the Ospedaletti–San Lorenzo cycle path; the village itself is a short walk inland.',
    vibe: 'Suburban calm, easy parking',
    link: 'https://www.marinadegliaregai.it/',
    linkLabel: 'marinadegliaregai.it',
  },
  {
    id: 'loano',
    name: 'Marina di Loano',
    town: 'Loano',
    coast: 'ponente',
    x: 30,
    y: 40,
    berths: 1000,
    maxLoa: 77,
    depth: '4–6 m',
    rate12: [3800, 6000],
    summary:
      'The Ponente\'s modern flagship: blue-flag, all-year services, 24-hour security and a travel lift big enough for most of what floats here.',
    walkable: 'Loano promenade, the old town arcades and the train station in fifteen minutes.',
    vibe: 'Polished, family-friendly, well run',
    image: '/images/liguria/marina-loano.jpg',
    link: 'https://www.marinadiloano.it/',
    linkLabel: 'marinadiloano.it',
  },
  {
    id: 'varazze',
    name: 'Marina di Varazze',
    town: 'Varazze',
    coast: 'ponente',
    x: 40,
    y: 16,
    berths: 800,
    maxLoa: 60,
    depth: '3–6 m',
    rate12: [4000, 6400],
    summary:
      'Forty minutes from Genoa airport with the marina village built right onto the quay. The last comfortable big basin before the city.',
    walkable: 'Marina piazza restaurants, Varazze beach and the coastal cycleway to Cogoleto from the gate.',
    vibe: 'Weekend Genoese, lively year-round',
    image: '/images/liguria/marina-varazze.jpg',
    link: 'https://www.marinadivarazze.it/',
    linkLabel: 'marinadivarazze.it',
  },
  {
    id: 'genova',
    name: 'Marina Porto Antico',
    town: 'Genoa',
    coast: 'levante',
    x: 50,
    y: 55,
    berths: 280,
    maxLoa: 90,
    depth: '4–9 m',
    rate12: [5000, 8000],
    summary:
      'Tie up inside a working port city — aquarium on one side, the medieval caruggi on the other. Nowhere else in Italy do you step off a boat into a metropolis this size.',
    walkable: 'Everything: opera, hospital, metro, Via Garibaldi palaces, the fish market and Principe station.',
    vibe: 'City living, boat as front door',
    image: '/images/liguria/marina-genova.jpg',
    link: 'https://www.marinaportoantico.it/',
    linkLabel: 'marinaportoantico.it',
  },
  {
    id: 'rapallo',
    name: 'Porto Carlo Riva',
    town: 'Rapallo',
    coast: 'levante',
    x: 62,
    y: 24,
    berths: 400,
    maxLoa: 65,
    depth: '3–6 m',
    rate12: [7000, 12000],
    summary:
      'The Gulf of Tigullio\'s prestige berth, built by the Riva family and priced accordingly. Portofino is fifteen minutes away by tender.',
    walkable: 'Rapallo seafront, castle, the Montallegro cable car and a mainline station with direct Milan trains.',
    vibe: 'Old-money Tigullio',
    image: '/images/liguria/marina-rapallo.jpg',
    link: 'https://www.portocarloriva.it/',
    linkLabel: 'portocarloriva.it',
  },
  {
    id: 'chiavari',
    name: 'Porto di Chiavari',
    town: 'Chiavari',
    coast: 'levante',
    x: 68,
    y: 62,
    berths: 480,
    maxLoa: 30,
    depth: '3–4 m',
    rate12: [3600, 5600],
    summary:
      'The sensible Tigullio option: a proper market town with arcaded streets, a hospital and a station, and berths at a fraction of Rapallo\'s ask.',
    walkable: 'Caruggi arcades, Saturday market, hospital and station — all inside a ten-minute radius.',
    vibe: 'Everyday Liguria that happens to have a port',
    image: '/images/liguria/chiavari.jpg',
    link: 'https://www.calataovest.it/',
    linkLabel: 'calataovest.it',
  },
  {
    id: 'lavagna',
    name: 'Porto di Lavagna',
    town: 'Lavagna',
    coast: 'levante',
    x: 72,
    y: 22,
    berths: 1500,
    maxLoa: 45,
    depth: '3–5 m',
    rate12: [3400, 5400],
    summary:
      'Among the largest tourist marinas in the Mediterranean by berth count — which means availability when the rest of the Tigullio says no.',
    walkable: 'Lavagna beach, the basilica, the station and a supermarket; Chiavari is one stop on the train.',
    vibe: 'Volume port, easy entry',
    link: 'https://www.portodilavagna.it/',
    linkLabel: 'portodilavagna.it',
  },
  {
    id: 'portovenere',
    name: 'Porto Venere',
    town: 'Porto Venere',
    coast: 'levante',
    x: 88,
    y: 48,
    berths: 200,
    maxLoa: 30,
    depth: '3–6 m',
    rate12: [4500, 7500],
    summary:
      'A UNESCO waterfront and the gateway to Palmaria, Tino and the Cinque Terre by sea. Small, seasonal, and the most photographed approach in Liguria.',
    walkable: 'The whole village, the Doria castle and the Byron grotto — it is 400 metres end to end.',
    vibe: 'Postcard mooring, summer crush',
    image: '/images/liguria/map-portovenere.jpg',
  },
  {
    id: 'laspezia',
    name: 'Porto Mirabello / Porto Lotti',
    town: 'La Spezia',
    coast: 'levante',
    x: 94,
    y: 20,
    berths: 400,
    maxLoa: 100,
    depth: '5–9 m',
    rate12: [5500, 9500],
    summary:
      'Deep, sheltered and open all winter inside the Gulf of Poets. The technical hub of the eastern Riviera, with yards that refit 40-metre boats.',
    walkable: 'La Spezia centre, Sant\'Agostino market, hospital and the station for Cinque Terre trains.',
    vibe: 'All-year, technical, unglamorous in the good way',
    image: '/images/liguria/la-spezia.jpg',
    link: 'https://www.portomirabello.it/',
    linkLabel: 'portomirabello.it',
  },
  {
    id: 'dianomarina',
    name: 'Marina di Diano Marina',
    town: 'Diano Marina',
    coast: 'ponente',
    x: 20,
    y: 18,
    berths: 320,
    maxLoa: 30,
    depth: '2.5–4 m',
    rate12: [2800, 4400],
    summary:
      'A modest basin behind the longest sandy beach on the Riviera dei Fiori, and one of the cheapest places in Liguria to keep a mid-size boat all year.',
    walkable: 'The whole flat town centre, the beach promenade and the Riviera cycle path from the quay.',
    vibe: 'Beach town, sensible money',
    image: '/images/liguria/diano-marina.jpg',
  },
  {
    id: 'andora',
    name: 'Marina di Andora',
    town: 'Andora',
    coast: 'ponente',
    x: 23,
    y: 55,
    berths: 900,
    maxLoa: 30,
    depth: '2.5–4 m',
    rate12: [2600, 4200],
    summary:
      'One of the best value-per-berth ports on the coast: big, workmanlike, with a yard and a slipway, and real availability when the glamour ports are full.',
    walkable: 'Andora station on the pontoon side, supermarkets, and the cycle path towards Laigueglia.',
    vibe: 'Unpretentious, plenty of room',
    image: '/images/liguria/andora.jpg',
    link: 'https://www.marinadiandora.it/',
    linkLabel: 'marinadiandora.it',
  },
  {
    id: 'alassio',
    name: 'Porto Luca Ferrari',
    town: 'Alassio',
    coast: 'ponente',
    x: 26,
    y: 24,
    berths: 400,
    maxLoa: 30,
    depth: '2.5–4 m',
    rate12: [3400, 5400],
    summary:
      'A compact marina at the end of a four-kilometre beach, sheltered by Capo Mele. Gallinara island is a twenty-minute motor away and the anchorages start immediately.',
    walkable: 'Budello shopping street, the muretto, cafés, hospital in Albenga eight minutes by car.',
    vibe: 'Holiday coast with a permanent population',
    image: '/images/liguria/alassio.jpg',
  },
  {
    id: 'savona',
    name: 'Marina di Savona / Vecchia Darsena',
    town: 'Savona',
    coast: 'ponente',
    x: 36,
    y: 62,
    berths: 260,
    maxLoa: 40,
    depth: '4–7 m',
    rate12: [3200, 5200],
    summary:
      'Berths inside a working city port, next to the Priamàr fortress and the cruise terminal. Deep water, all-year services, and a real hospital and rail hub on the doorstep.',
    walkable: 'The old darsena restaurants, Savona centre, the covered market, the station for Genoa in 35 minutes.',
    vibe: 'City port, everything open in February',
    image: '/images/liguria/map-savona.jpg',
  },
  {
    id: 'arenzano',
    name: 'Marina di Arenzano',
    town: 'Arenzano',
    coast: 'ponente',
    x: 44,
    y: 26,
    berths: 400,
    maxLoa: 25,
    depth: '2.5–4 m',
    rate12: [3400, 5200],
    summary:
      'The last Ponente basin before Genoa, tucked under the Beigua park. Twenty minutes from the airport, and Genoese owners keep boats here to avoid the city traffic.',
    walkable: 'Arenzano pine park, the seafront, the station and a good weekly market.',
    vibe: 'Green hills behind, city in reach',
  },
  {
    id: 'genova-aeroporto',
    name: 'Marina Genova (Aeroporto)',
    town: 'Genoa — Sestri Ponente',
    coast: 'levante',
    x: 47,
    y: 14,
    berths: 500,
    maxLoa: 143,
    depth: '5–9 m',
    rate12: [4600, 7600],
    summary:
      'The superyacht end of Genoa, literally beside the runway: deep water, a 200-tonne travel lift and refit yards. Land at 10 and be aboard by 10.30.',
    walkable: 'Airport terminal, Sestri Ponente shops and station; the city centre is a fifteen-minute train.',
    vibe: 'Technical, international, plane-to-pontoon',
    link: 'https://www.marinagenova.it/',
    linkLabel: 'marinagenova.it',
  },
  {
    id: 'portofino',
    name: 'Marina Molo Umberto I',
    town: 'Portofino',
    coast: 'levante',
    x: 59,
    y: 34,
    berths: 130,
    maxLoa: 70,
    depth: '3–8 m',
    rate12: [18000, 40000],
    summary:
      'The most expensive water in Italy and the shortest list. Around 130 berths in the piazzetta bay, most on long concessions — a summer night alongside can cost more than a month elsewhere.',
    walkable: 'The piazzetta, Castello Brown, the path to San Fruttuoso; nothing else, and that is the point.',
    vibe: 'Trophy mooring, not a home port',
    image: '/images/liguria/map-portofino.jpg',
  },
  {
    id: 'santamargherita',
    name: 'Porto di Santa Margherita Ligure',
    town: 'Santa Margherita Ligure',
    coast: 'levante',
    x: 61,
    y: 66,
    berths: 390,
    maxLoa: 45,
    depth: '3–6 m',
    rate12: [8000, 15000],
    summary:
      'Portofino prices minus a third, with a town that actually functions in winter. The practical way to keep a boat in the Golfo del Tigullio if you can get in at all.',
    walkable: 'The seafront, the market, the basilica, the hospital and a station with Rome trains.',
    vibe: 'Grande dame, working town underneath',
    image: '/images/liguria/santa-margherita-ligure.jpg',
  },
  {
    id: 'sestrilevante',
    name: 'Porto di Sestri Levante',
    town: 'Sestri Levante',
    coast: 'levante',
    x: 76,
    y: 30,
    berths: 200,
    maxLoa: 20,
    depth: '2–4 m',
    rate12: [3000, 5000],
    summary:
      'A small-boat harbour between the Bay of Silence and the Bay of Fables, and the natural jumping-off point for the Cinque Terre without the Tigullio price tag.',
    walkable: 'Both bays, the caruggio, the station and the Riva Trigoso yards down the coast.',
    vibe: 'Two bays, one town, modest boats',
    image: '/images/liguria/sestri-levante.jpg',
  },
];

export type HubId = 'fiori' | 'palme' | 'genova' | 'tigullio' | 'poets';

export const homePorts: { id: HubId; label: string; sub: string; coastNm: number }[] = [
  { id: 'fiori', label: 'Riviera dei Fiori', sub: 'Ventimiglia · Sanremo', coastNm: 12 },
  { id: 'palme', label: 'Riviera delle Palme', sub: 'Alassio · Loano', coastNm: 52 },
  { id: 'genova', label: 'Genoa & Savona', sub: 'Porto Antico · Varazze', coastNm: 92 },
  { id: 'tigullio', label: 'Golfo del Tigullio', sub: 'Rapallo · Lavagna', coastNm: 122 },
  { id: 'poets', label: 'Gulf of Poets', sub: 'La Spezia · Porto Venere', coastNm: 177 },
];

export type DestinationGroup = 'coast' | 'anchorage' | 'france' | 'islands';

export const destinationGroups: { id: DestinationGroup; label: string; blurb: string }[] = [
  { id: 'coast', label: 'Ligurian coast hops', blurb: 'Ports and beach towns you can tie up in or land a tender at.' },
  { id: 'anchorage', label: 'Anchorages & swim stops', blurb: 'No berth, no booking — drop the hook, eat aboard, swim.' },
  { id: 'france', label: 'Over the border', blurb: 'The Côte d’Azur is a day out, not a holiday.' },
  { id: 'islands', label: 'Islands & crossings', blurb: 'Open water, early starts, a weather window that matters.' },
];

export type SeaDestination = {
  id: string;
  name: string;
  note: string;
  group: DestinationGroup;
  /** nautical miles from each home port */
  from: Record<HubId, number>;
};

/** Distances along the shoreline, measured from the French border in nautical miles. */
const coastal = (
  id: string,
  name: string,
  group: DestinationGroup,
  coastNm: number,
  note: string
): SeaDestination => ({
  id,
  name,
  group,
  note,
  from: homePorts.reduce(
    (acc, h) => ({ ...acc, [h.id]: Math.max(2, Math.round(Math.abs(coastNm - h.coastNm))) }),
    {} as Record<HubId, number>
  ),
});

export const seaDestinations: SeaDestination[] = [
  // Ligurian coast hops
  coastal('bordighera', 'Bordighera', 'coast', 10, 'Palm terraces, a small friendly basin, lunch ashore.'),
  coastal('imperia', 'Imperia & Porto Maurizio', 'coast', 32, 'The Parasio hill town seen the way it was built to be seen.'),
  coastal('dianomarina', 'Diano Marina', 'coast', 36, 'Long sand, shallow water, easy tender landing.'),
  coastal('gallinara', 'Isola Gallinara', 'coast', 48, 'Protected islet off Albenga — circle it, anchor outside the reserve.'),
  coastal('alassio', 'Alassio', 'coast', 50, 'Four kilometres of beach and the muretto behind it.'),
  coastal('noli', 'Noli & Varigotti', 'coast', 62, 'A medieval maritime republic with the best cliffs in Ponente.'),
  coastal('savona', 'Savona', 'coast', 70, 'A working city port; berth for the night and eat in the darsena.'),
  coastal('varazze', 'Varazze', 'coast', 76, 'Marina village on the quay, one of the easiest arrivals on the coast.'),
  coastal('genova', 'Genoa Porto Antico', 'coast', 92, 'Step off the boat into a metropolis — aquarium, caruggi, opera.'),
  coastal('camogli', 'Camogli', 'coast', 106, 'Tall painted houses, a pebble beach, and the Portofino park behind.'),
  coastal('portofino', 'Portofino', 'coast', 112, 'The anchorage everyone else arrives at by bus.'),
  coastal('sestri', 'Baia del Silenzio', 'coast', 143, 'Sestri Levante’s bay of silence, best entered under engine at dawn.'),
  coastal('cinqueterre', 'Cinque Terre', 'coast', 163, 'Vernazza and Monterosso from the water, no train queue.'),
  coastal('portovenere', 'Porto Venere', 'coast', 175, 'UNESCO waterfront and the gate to the Gulf of Poets.'),
  coastal('lerici', 'Lerici & Tellaro', 'coast', 181, 'The prettiest corner of the gulf, and Shelley’s bay.'),

  // Anchorages
  coastal('saraceni', 'Baia dei Saraceni', 'anchorage', 60, 'Turquoise water under the Varigotti headland; go early.'),
  coastal('bergeggi', 'Isola di Bergeggi', 'anchorage', 66, 'Marine reserve islet — anchor in the permitted zone, snorkel the drop.'),
  coastal('puntachiappa', 'Punta Chiappa', 'anchorage', 104, 'Sheer rock off San Rocco, deep water right up to the shore.'),
  coastal('sanfruttuoso', 'San Fruttuoso', 'anchorage', 110, 'Abbey in a cove reachable only by sea or on foot; buoy field in summer.'),
  coastal('paraggi', 'Paraggi', 'anchorage', 113, 'The green bay next door to Portofino, at a tenth of the drama.'),
  coastal('puntamanara', 'Punta Manara', 'anchorage', 145, 'Quiet lee under the Sestri headland, good for a lunch stop.'),
  coastal('mesco', 'Punta Mesco', 'anchorage', 159, 'The Cinque Terre’s western cape — clear water, no crowd.'),
  coastal('palmaria', 'Palmaria & Tino', 'anchorage', 176, 'Swim stop in the Gulf of Poets, lighthouse island alongside.'),

  // France
  coastal('menton', 'Menton', 'france', -4, 'Lemon town over the border; clear in, eat, come back.'),
  coastal('monaco', 'Monaco', 'france', -9, 'Lunch in the principality, home for dinner.'),
  coastal('villefranche', 'Villefranche-sur-Mer', 'france', -22, 'The deepest natural roadstead on the Côte d’Azur.'),
  coastal('lerins', 'Îles de Lérins (Cannes)', 'france', -40, 'Monastery island anchorage off the Croisette.'),
  coastal('sttropez', 'Saint-Tropez', 'france', -78, 'A long day each way, or an overnight with a reason.'),

  // Islands and crossings
  { id: 'capraia', name: 'Capraia', group: 'islands', note: 'Volcanic, almost empty, whale corridor on the way.', from: { fiori: 140, palme: 105, genova: 82, tigullio: 62, poets: 44 } },
  { id: 'gorgona', name: 'Gorgona', group: 'islands', note: 'The smallest Tuscan island — permit needed to land, worth the pass-by.', from: { fiori: 150, palme: 116, genova: 94, tigullio: 72, poets: 46 } },
  { id: 'elba', name: 'Elba', group: 'islands', note: 'Overnight hop into the Tuscan Archipelago.', from: { fiori: 168, palme: 132, genova: 106, tigullio: 82, poets: 60 } },
  { id: 'giglio', name: 'Giglio', group: 'islands', note: 'Further south, clearer water, a proper passage plan.', from: { fiori: 198, palme: 162, genova: 136, tigullio: 112, poets: 92 } },
  { id: 'calvi', name: 'Corsica — Calvi', group: 'islands', note: 'The classic crossing: flat sea, early start, citadel at dusk.', from: { fiori: 110, palme: 104, genova: 104, tigullio: 96, poets: 86 } },
  { id: 'bastia', name: 'Corsica — Bastia', group: 'islands', note: 'The practical Corsican landfall from the Levante.', from: { fiori: 122, palme: 112, genova: 100, tigullio: 90, poets: 76 } },
];


export const boatingFacts = [
  {
    title: 'When you need a licence',
    body: 'No patente nautica for engines up to 40 hp and boats under 24 m staying within 6 miles of the coast. Beyond 6 miles, or above 40 hp, you need the licence — the entro/oltre 12 miglia exam is doable in a few weekends and recognised across the EU.',
  },
  {
    title: 'Berth, dry stack or trailer',
    body: 'A wet berth is the big number. Dry storage on racks (rimessaggio a secco) runs roughly 40–60 percent less for boats under 8 m, and a trailer plus a public slipway costs almost nothing if you are happy launching each time.',
  },
  {
    title: 'The Pelagos Sanctuary',
    body: 'Liguria sits inside the Pelagos Sanctuary for Mediterranean marine mammals — 87,500 km² shared with France and Monaco. Fin whales and striped dolphins are a normal summer sighting an hour offshore from Genoa and Imperia.',
  },
  {
    title: 'Wind and season',
    body: 'Libeccio from the southwest is the one that ruins plans, strongest in autumn and spring. Summer mornings are usually glass, with a sea breeze filling in after two. Winter sailing is genuinely possible in the Gulf of La Spezia and off Imperia.',
  },
  {
    title: 'What it really costs beyond the berth',
    body: 'Budget insurance, antifouling and haul-out (roughly 1,200–2,500 euro a year for a 12 m boat), plus fuel at Italian marina prices. Many owners keep the boat in Liguria and register maintenance with a local yard on an annual contract.',
  },
  {
    title: 'Waiting lists are real',
    body: 'Ponente basins (Imperia, Loano, Aregai) usually have space. Rapallo, Portofino and Porto Venere effectively do not, and multi-year berth rights trade privately. If a marina answers your email in August, that tells you something useful.',
  },
];
