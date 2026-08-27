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
];

export type SeaDestination = {
  id: string;
  name: string;
  note: string;
  /** nautical miles from each hub */
  from: { ponente: number; genova: number; levante: number };
};

export const seaDestinations: SeaDestination[] = [
  { id: 'monaco', name: 'Monaco', note: 'Lunch in the principality, home for dinner.', from: { ponente: 25, genova: 90, levante: 145 } },
  { id: 'lerins', name: 'Îles de Lérins (Cannes)', note: 'Monastery island anchorage off the Croisette.', from: { ponente: 45, genova: 110, levante: 165 } },
  { id: 'portofino', name: 'Portofino', note: 'The anchorage everyone else arrives at by bus.', from: { ponente: 75, genova: 18, levante: 22 } },
  { id: 'cinqueterre', name: 'Cinque Terre', note: 'Vernazza and Monterosso from the water, no train queue.', from: { ponente: 120, genova: 55, levante: 12 } },
  { id: 'palmaria', name: 'Palmaria & Tino', note: 'Swim stop in the Gulf of Poets.', from: { ponente: 130, genova: 62, levante: 4 } },
  { id: 'elba', name: 'Elba', note: 'Overnight hop into the Tuscan Archipelago.', from: { ponente: 175, genova: 105, levante: 60 } },
  { id: 'corsica', name: 'Corsica (Calvi)', note: 'The classic crossing — flat sea, early start.', from: { ponente: 110, genova: 105, levante: 95 } },
  { id: 'gorgona', name: 'Gorgona & Capraia', note: 'Wild islands, whale corridor on the way.', from: { ponente: 150, genova: 85, levante: 45 } },
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
