/**
 * Cinque Terre — data for the "Five Lands, honestly" module.
 * Figures are indicative and drawn from the Parco Nazionale delle Cinque Terre,
 * Trenitalia timetables and comune population registers.
 */

export type Village = {
  id: string;
  name: string;
  order: number;
  /** 0–1 position along the coast strip, west (Monterosso) to east (Riomaggiore) */
  x: number;
  character: string;
  residents: string;
  station: string;
  beach: string;
  cars: string;
  climb: string;
  photo: string;
  photoAlt: string;
  winter: string;
  august: string;
  links: { label: string; href: string }[];
};

export const villages: Village[] = [
  {
    id: 'monterosso',
    name: 'Monterosso al Mare',
    order: 1,
    x: 0.06,
    character: 'The beach one — the only village with real sand and sun loungers.',
    residents: '~1,400 residents',
    station: 'On the line, station right behind the beach',
    beach: 'Fegina: the largest sandy beach in the five',
    cars: 'Reachable by road, small paid car parks that fill by 9am',
    climb: 'Flattest of the five; the old town and Fegina are split by a tunnel',
    photo: '/images/liguria/ct-monterosso.jpg',
    photoAlt: 'Monterosso al Mare seen from the Convento dei Cappuccini above the bay',
    winter: 'Half the restaurants shutter from November. The beach is yours and the wind comes straight in.',
    august: 'Day-trippers arrive by train from 9am and thin out after 6pm. Loungers are booked days ahead.',
    links: [
      { label: 'Comune di Monterosso', href: 'https://www.comune.monterosso.sp.it/' },
      { label: 'Parco Nazionale', href: 'https://www.parconazionale5terre.it/' },
    ],
  },
  {
    id: 'vernazza',
    name: 'Vernazza',
    order: 2,
    x: 0.29,
    character: 'The harbour amphitheatre — the photograph everyone has seen.',
    residents: '~750 residents',
    station: 'On the line, station tunnels straight into the main street',
    beach: 'A pocket of sand inside the harbour, plus rocks',
    cars: 'Effectively car-free; parking is above the village, then you walk down',
    climb: 'Steep lanes and stairs everywhere off the single main street',
    photo: '/images/liguria/ct-vernazza.jpg',
    photoAlt: 'Vernazza harbour and the tower of the Doria castle above the sea',
    winter: 'A working village of a few hundred people. One or two bars open, boats hauled up on the piazza.',
    august: 'The main street is a slow-moving queue between 10am and 5pm. Go at dawn or after dinner.',
    links: [
      { label: 'Comune di Vernazza', href: 'https://www.comune.vernazza.sp.it/' },
      { label: 'UNESCO listing', href: 'https://whc.unesco.org/en/list/826/' },
    ],
  },
  {
    id: 'corniglia',
    name: 'Corniglia',
    order: 3,
    x: 0.5,
    character: 'The one up the stairs — the only village not touching the water.',
    residents: '~150 residents',
    station: 'On the line, but the station is at sea level and the village is 100 m above',
    beach: 'No harbour; a rocky swim spot reached by a long descent',
    cars: 'A narrow road climbs from the coast; almost no parking at the top',
    climb: 'The Lardarina staircase: 382 steps, or the shuttle bus from the station',
    photo: '/images/liguria/ct-corniglia.jpg',
    photoAlt: 'Corniglia perched on its terrace of rock above the Ligurian sea',
    winter: 'The quietest of the five by a distance. Vineyards, cats, and the shuttle bus.',
    august: 'The stairs filter the crowd. Busy in the middle of the day, calm by early evening.',
    links: [
      { label: 'Comune di Vernazza (Corniglia)', href: 'https://www.comune.vernazza.sp.it/' },
      { label: 'Park trail info', href: 'https://www.parconazionale5terre.it/sentieri.php' },
    ],
  },
  {
    id: 'manarola',
    name: 'Manarola',
    order: 4,
    x: 0.74,
    character: 'The sunset one — houses stacked above a slipway of a harbour.',
    residents: '~350 residents',
    station: 'On the line, short tunnel walk into the village',
    beach: 'No beach. You jump off the rocks at Punta Bonfiglio',
    cars: 'Road access from Volastra above; parking is scarce and paid',
    climb: 'One steep main street; the vineyard path above is the classic photo spot',
    photo: '/images/liguria/ct-manarola.jpg',
    photoAlt: 'Manarola at dusk, coloured houses stacked above the small harbour',
    winter: 'Famous for the hillside nativity of lights from December. Otherwise very quiet.',
    august: 'The sunset crowd on the Nessun Dorma terrace is a queue in itself. Lunch is calmer.',
    links: [
      { label: 'Comune di Riomaggiore', href: 'https://www.comune.riomaggiore.sp.it/' },
      { label: 'Sciacchetrà & Cinque Terre DOC', href: 'https://www.cantinacinqueterre.com/' },
    ],
  },
  {
    id: 'riomaggiore',
    name: 'Riomaggiore',
    order: 5,
    x: 0.95,
    character: 'The working one — the biggest, closest to La Spezia, most lived-in.',
    residents: '~1,500 residents in the comune',
    station: 'On the line, 8 minutes from La Spezia Centrale',
    beach: 'Rocks and a tiny shingle cove beside the harbour',
    cars: 'Road in from La Spezia; parking above the village on the Via di Litoranea',
    climb: 'Long main street rising from the harbour; plenty of stairs off it',
    photo: '/images/liguria/ct-riomaggiore.jpg',
    photoAlt: 'Riomaggiore seen from the sea, houses climbing the ravine above the harbour',
    winter: 'The most functional of the five: a grocery, a pharmacy nearby, buses to La Spezia.',
    august: 'Busy but absorbs it better than Vernazza. The Via dell\'Amore end is the pinch point.',
    links: [
      { label: 'Comune di Riomaggiore', href: 'https://www.comune.riomaggiore.sp.it/' },
      { label: 'Cinque Terre Card', href: 'https://card.parconazionale5terre.it/' },
    ],
  },
];

export type MonthEntry = {
  month: string;
  short: string;
  /** 0–100 visitor pressure */
  crowd: number;
  seaC: number;
  open: string;
  trails: string;
  verdict: string;
  tone: 'good' | 'ok' | 'hard';
};

export const crowdClock: MonthEntry[] = [
  { month: 'January', short: 'Jan', crowd: 8, seaC: 13, open: 'Many kitchens closed; one bar per village stays open for residents.', trails: 'Open but wet; landslide closures are most likely now.', verdict: 'The villages are yours. Bring a raincoat and low expectations of dinner.', tone: 'ok' },
  { month: 'February', short: 'Feb', crowd: 10, seaC: 13, open: 'Slow reopening after Carnival; ferries still laid up.', trails: 'Muddy, occasionally closed after storms.', verdict: 'Cheap, empty, honest. Not the postcard.', tone: 'ok' },
  { month: 'March', short: 'Mar', crowd: 30, seaC: 14, open: 'Most restaurants back by mid-month; ferries restart late March.', trails: 'Excellent walking temperatures, hills still green.', verdict: 'One of the two sweet spots. Go now.', tone: 'good' },
  { month: 'April', short: 'Apr', crowd: 62, seaC: 15, open: 'Everything open. Easter is a spike, not a season.', trails: 'Perfect, but the Sentiero Azzurro already queues at midday.', verdict: 'Lovely — walk early, eat late.', tone: 'good' },
  { month: 'May', short: 'May', crowd: 82, seaC: 18, open: 'Full service, full boats, full trains.', trails: 'Busy. Hot on the exposed Corniglia sections by noon.', verdict: 'Beautiful and crowded. Stay overnight or skip the middle of the day.', tone: 'ok' },
  { month: 'June', short: 'Jun', crowd: 90, seaC: 22, open: 'Everything running at capacity.', trails: 'Start before 8am or take the boat instead.', verdict: 'Swimmable sea, unswimmable pavements.', tone: 'hard' },
  { month: 'July', short: 'Jul', crowd: 96, seaC: 25, open: 'Peak. Reservations required everywhere.', trails: 'Hot, exposed, heavily trafficked.', verdict: 'Go by boat, swim, and leave the trails to the very early risers.', tone: 'hard' },
  { month: 'August', short: 'Aug', crowd: 100, seaC: 26, open: 'Peak plus Italian holidays. Trains standing-room only.', trails: 'Avoid 10am–4pm entirely.', verdict: 'The hardest month. Locals hide in the hills.', tone: 'hard' },
  { month: 'September', short: 'Sep', crowd: 84, seaC: 24, open: 'Full service; the grape harvest starts on the terraces.', trails: 'Warm and busy, but the light is the best of the year.', verdict: 'Second half of September starts to breathe again.', tone: 'ok' },
  { month: 'October', short: 'Oct', crowd: 55, seaC: 21, open: 'Open until roughly Ognissanti; ferries wind down.', trails: 'Ideal — cool mornings, sea still warm enough to swim.', verdict: 'The best month of the year. Late October especially.', tone: 'good' },
  { month: 'November', short: 'Nov', crowd: 18, seaC: 18, open: 'Closures begin; the olive harvest takes over.', trails: 'Wettest month. Check park closures before setting out.', verdict: 'Quiet and green, with real risk of rain.', tone: 'ok' },
  { month: 'December', short: 'Dec', crowd: 20, seaC: 15, open: 'Manarola\'s hillside nativity draws an evening crowd.', trails: 'Short days; walk the high paths, not the coastal ledges.', verdict: 'Atmospheric if you come for the lights, not the sea.', tone: 'ok' },
];

export type Leg = {
  id: string;
  from: string;
  to: string;
  trail: {
    name: string;
    km: number;
    ascentM: number;
    minutes: number;
    difficulty: string;
    status: string;
    ticketed: boolean;
  };
  train: { minutes: number; frequency: string; fare: string };
  ferry: { available: boolean; minutes?: number; note: string };
};

export const legs: Leg[] = [
  {
    id: 'mon-ver',
    from: 'Monterosso',
    to: 'Vernazza',
    trail: { name: 'Sentiero Azzurro SVA 592-2', km: 3.5, ascentM: 200, minutes: 90, difficulty: 'Moderate — steady stairs both ways', status: 'Open, ticketed', ticketed: true },
    train: { minutes: 4, frequency: 'Every 15–30 min', fare: '€5 single (Cinque Terre Express)' },
    ferry: { available: true, minutes: 15, note: 'Runs roughly late March to early November, sea permitting.' },
  },
  {
    id: 'ver-cor',
    from: 'Vernazza',
    to: 'Corniglia',
    trail: { name: 'Sentiero Azzurro SVA 592-3', km: 3.0, ascentM: 210, minutes: 90, difficulty: 'Moderate — the prettiest of the four legs', status: 'Open, ticketed', ticketed: true },
    train: { minutes: 3, frequency: 'Every 15–30 min', fare: '€5 single' },
    ferry: { available: false, note: 'No ferry stop at Corniglia — it sits 100 m above the water.' },
  },
  {
    id: 'cor-man',
    from: 'Corniglia',
    to: 'Manarola',
    trail: { name: 'Coastal path closed; high route via Volastra (586/506)', km: 6.5, ascentM: 400, minutes: 150, difficulty: 'Demanding — long climb through the vineyard terraces', status: 'Coastal section long closed by landslide; the Volastra high route is the way through', ticketed: false },
    train: { minutes: 4, frequency: 'Every 15–30 min', fare: '€5 single' },
    ferry: { available: false, note: 'No ferry stop at Corniglia.' },
  },
  {
    id: 'man-rio',
    from: 'Manarola',
    to: 'Riomaggiore',
    trail: { name: 'Via dell\'Amore', km: 1.0, ascentM: 20, minutes: 25, difficulty: 'Easy — paved, level, accessible', status: 'Reopened in 2024 after more than a decade; timed entry, capacity capped', ticketed: true },
    train: { minutes: 2, frequency: 'Every 15–30 min', fare: '€5 single' },
    ferry: { available: true, minutes: 10, note: 'Seasonal; the shortest hop of the lot.' },
  },
];

export type Settlement = {
  name: string;
  photo: string;
  photoAlt: string;
  minutesToVillages: string;
  why: string;
};

export const settleInstead: Settlement[] = [
  {
    name: 'Levanto',
    photo: '/images/liguria/ct-levanto.jpg',
    photoAlt: 'Levanto seen from the coast road, its bay and beach below the hills',
    minutesToVillages: '4 min by train to Monterosso',
    why: 'Flat, sandy, has supermarkets and a surf school. The obvious choice for people who want the Cinque Terre without the stairs.',
  },
  {
    name: 'La Spezia',
    photo: '/images/liguria/la-spezia.jpg',
    photoAlt: 'The waterfront and naval port of La Spezia',
    minutesToVillages: '8 min by train to Riomaggiore',
    why: 'A real city: hospital, market, cinema, cheap flats. Not pretty, entirely practical, and the rail hub for everything.',
  },
  {
    name: 'Portovenere',
    photo: '/images/liguria/ct-portovenere.jpg',
    photoAlt: 'Portovenere seen across the gulf, with its church on the headland',
    minutesToVillages: 'Boat to Riomaggiore in ~30 min',
    why: 'UNESCO-listed alongside the five, but reached by road and bus rather than the railway. Grander, quieter, still expensive.',
  },
  {
    name: 'Bonassola',
    photo: '/images/liguria/ct-bonassola.jpg',
    photoAlt: 'Bonassola seen from above, its bay and beach framed by wooded hills',
    minutesToVillages: '10 min by train to Monterosso',
    why: 'A small sandy bay with the old railway tunnels turned into a flat walking and cycling path to Levanto.',
  },
  {
    name: 'Framura',
    photo: '/images/liguria/ct-framura.jpg',
    photoAlt: 'The scattered hamlets of Framura above the Ligurian coast',
    minutesToVillages: '15 min by train to Monterosso',
    why: 'Five scattered hamlets, a lift down to the station, and almost no tourism. The cheapest option on this list.',
  },
];
