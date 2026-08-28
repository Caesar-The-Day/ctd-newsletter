const img = (name: string) => `/images/friuli-venezia-giulia/${name}.jpg`;

/* ------------------------------------------------------------------ */
/* Trieste, practically                                                */
/* ------------------------------------------------------------------ */

export interface Rione {
  id: string;
  name: string;
  tag: string;
  image: string;
  imageAlt: string;
  rent: string;
  buy: string;
  bora: 1 | 2 | 3;
  lift: string;
  who: string;
  good: string[];
  bad: string[];
}

export const rioni: Rione[] = [
  {
    id: 'teresiano',
    name: 'Borgo Teresiano',
    tag: 'The Habsburg grid, on the flat',
    image: img('trieste-borgo-teresiano'),
    imageAlt: 'The Canal Grande in Trieste\u2019s Borgo Teresiano at dusk',
    rent: '€600–850 / month for a two-bed',
    buy: '€1,900–2,600 / m²',
    bora: 3,
    lift: 'Flat as a table — no steps, no funicular, no car needed.',
    who: 'Anyone who wants to walk to everything and never think about a hill or a bus again.',
    good: ['Everything within 10 minutes on foot', 'Grand 19th-century apartments with real ceilings', 'Station, ferries and buses on the doorstep'],
    bad: ['Full Bora exposure along the canal', 'Noisy at weekends', 'Courtyard flats can be dark']
  },
  {
    id: 'sanvito',
    name: 'San Vito & Città Vecchia',
    tag: 'Old town, quiet money',
    image: img('trieste-piazza-unita'),
    imageAlt: 'Trieste\u2019s Piazza Unità d\u2019Italia opening onto the Adriatic',
    rent: '€700–1,000 / month for a two-bed',
    buy: '€2,300–3,200 / m²',
    bora: 2,
    lift: 'Gently uphill; some streets are stepped.',
    who: 'Retirees who want the sea view, the cathedral bells and the calmest streets in the centre.',
    good: ['Best-kept part of the city', 'Sea views without leaving the centre', 'Sheltered from the worst gusts by the hill'],
    bad: ['The most expensive square metres in FVG', 'Parking is a genuine sport', 'Steps, if your knees are the deciding factor']
  },
  {
    id: 'barcola',
    name: 'Barcola & Roiano',
    tag: 'Swim before breakfast',
    image: img('trieste-barcola'),
    imageAlt: 'The seafront promenade and pines at Barcola, Trieste',
    rent: '€650–900 / month for a two-bed',
    buy: '€2,000–2,800 / m²',
    bora: 2,
    lift: 'Seafront flat, slopes behind rise fast.',
    who: 'People who will actually use the sea — locals swim here from May to October, and plenty year-round.',
    good: ['The city\u2019s free lido, 2 km of it', 'Bus 6 into the centre every few minutes', 'Pine shade and Miramare at the end of the walk'],
    bad: ['Packed on summer weekends', 'Barcolana week is chaos, gloriously', 'Coast road traffic']
  },
  {
    id: 'opicina',
    name: 'Opicina & the Karst villages',
    tag: 'Up on the plateau, bilingual',
    image: img('trieste-opicina'),
    imageAlt: 'The historic Opicina tram climbing above Trieste',
    rent: '€550–750 / month for a house share of space you can\u2019t get below',
    buy: '€1,300–1,900 / m²',
    bora: 3,
    lift: '350 m above the city — tram, bus 4 or a 15-minute drive down.',
    who: 'Anyone wanting a garden, cooler summers and Slovene neighbours, with the city still 20 minutes away.',
    good: ['Real gardens at half the coastal price', 'Cooler by 4–5°C in August', 'Osmize, woods and the Slovenian border on foot'],
    bad: ['Bora is fiercest up here', 'Snow a few days a year', 'A car makes life much easier']
  },
  {
    id: 'servola',
    name: 'Servola & Chiarbola',
    tag: 'Working city, best value',
    image: img('trieste-servola'),
    imageAlt: 'The hillside district of Servola above the port of Trieste',
    rent: '€480–650 / month for a two-bed',
    buy: '€1,100–1,600 / m²',
    bora: 2,
    lift: 'Hillside above the industrial port; buses are frequent.',
    who: 'Buyers on a budget who want a normal neighbourhood rather than a postcard.',
    good: ['Cheapest square metres in the city', 'Strong local bakeries and a real Slovene-Triestino mix', 'Cattinara hospital close by'],
    bad: ['Steelworks legacy and industrial views', 'Fewer cafés and no tourist polish', 'Air-quality debates are a local topic']
  }
];

export interface CityFact {
  label: string;
  value: string;
  note: string;
}

export const triesteFacts: CityFact[] = [
  { label: 'Population', value: '198,000', note: 'Shrinking slowly, and the oldest average age of any large Italian city.' },
  { label: 'Over-65s', value: '28%', note: 'Which is precisely why the health system here is built for you.' },
  { label: 'Bora days', value: '≈ 40/yr', note: 'Days above 60 km/h; a handful each winter go past 120 km/h.' },
  { label: 'Sea temperature, Aug', value: '25°C', note: 'And 12°C in February, when people still swim at Barcola.' }
];

export interface CityCost {
  item: string;
  cost: string;
  note: string;
}

export const triesteCosts: CityCost[] = [
  { item: 'Couple\u2019s monthly budget, renting', cost: '€1,900–2,400', note: 'Comfortable, eating out weekly, one car.' },
  { item: 'Couple\u2019s monthly budget, owning outright', cost: '€1,300–1,700', note: 'Condominio, IMU-free first home, heating included.' },
  { item: 'Annual public transport pass (over 65)', cost: '€120–180', note: 'Trieste Trasporti; regional discounts for pensioners.' },
  { item: 'Capo in b at the counter', cost: '€1.30', note: 'Sitting down at Piazza Unità costs three times that.' },
  { item: 'Winter heating, 80 m² flat', cost: '€90–160 / month', note: 'Mild winters keep this well below the Alpine north.' },
  { item: 'Condominio fees', cost: '€60–150 / month', note: 'Old buildings with lifts and courtyards sit at the top of the range.' }
];

export interface CityTruth {
  title: string;
  body: string;
  tone: 'good' | 'bad';
}

export const triesteTruths: CityTruth[] = [
  { tone: 'good', title: 'Healthcare you can walk to', body: 'Cattinara and Maggiore hospitals plus a university medical school inside the city. For a region of retirees this is the single strongest argument for Trieste over anywhere else in FVG.' },
  { tone: 'good', title: 'A city that works without a car', body: 'Dense, flat in the middle, buses every few minutes, and a ferry to Muggia. Plenty of residents in the centre simply don\u2019t own one.' },
  { tone: 'good', title: 'Two countries in your weekly radius', body: 'Slovenia is a 15-minute drive, Croatia under an hour. Dentists, fuel, hiking and a different supermarket culture are all routine errands.' },
  { tone: 'good', title: 'Culture out of proportion to its size', body: 'The Verdi opera house, Miramare, the Revoltella, Italy\u2019s best-known coffee houses and a literary history from Joyce to Svevo to Magris.' },
  { tone: 'bad', title: 'The Bora is not a quirk', body: 'Ropes used to be strung along streets for pedestrians. Choose the flat, the balcony and the awnings accordingly, and expect a few days a year when you simply stay in.' },
  { tone: 'bad', title: 'It is a terminus, not a hub', body: 'Rome is four hours by train, Milan four and a half. Ljubljana and Venice airports do the heavy lifting; Trieste airport is small and seasonal.' },
  { tone: 'bad', title: 'August empties out', body: 'Shops shut, neighbours vanish to Grado, and the city can feel abandoned for three weeks. The flip side of a place that still keeps its own rhythms.' },
  { tone: 'bad', title: 'An ageing, insular city', body: 'Warm once you\u2019re in, slow to let you in. Learning some Triestino and joining something — a choir, a sailing club, a hiking group — is the difference-maker.' }
];

/* ------------------------------------------------------------------ */
/* The Alps nobody books                                               */
/* ------------------------------------------------------------------ */

export type AlpKind = 'ski' | 'hike' | 'lake' | 'village';

export interface AlpPlace {
  id: string;
  name: string;
  area: string;
  kinds: AlpKind[];
  altitude: string;
  image: string;
  imageAlt: string;
  what: string;
  practical: string;
  link?: string;
}

export const alpPlaces: AlpPlace[] = [
  {
    id: 'fusine',
    name: 'Laghi di Fusine',
    area: 'Val Canale, 10 min from Tarvisio',
    kinds: ['lake', 'hike'],
    altitude: '930 m',
    image: img('alps-fusine'),
    imageAlt: 'The green Fusine lakes beneath the Mangart massif',
    what: 'Two glacial lakes under the wall of the Mangart, in a nature reserve on the three-country corner. Green water, larch forest, and a loop walk anyone can do.',
    practical: 'Paid parking in summer, free most of the year; a cleared winter path makes it one of the region\u2019s great cold-weather walks.',
    link: 'https://www.turismofvg.it/en'
  },
  {
    id: 'sella-nevea',
    name: 'Sella Nevea',
    area: 'Canin massif, above Chiusaforte',
    kinds: ['ski', 'hike'],
    altitude: '1,190–2,020 m',
    image: img('alps-sella-nevea'),
    imageAlt: 'The Sella Nevea saddle beneath the Montasio massif',
    what: 'The snowiest corner of Italy, linked by cable car to Bovec in Slovenia — one lift pass, two countries, and a season that runs late.',
    practical: 'Small, unglamorous, cheap by Alpine standards. An hour and a quarter from Udine; the road is well kept but wintry.',
    link: 'https://www.promoturismo.fvg.it/en/sella-nevea'
  },
  {
    id: 'tarvisio',
    name: 'Tarvisio & Monte Lussari',
    area: 'Three-border corner',
    kinds: ['ski', 'village'],
    altitude: '750–1,790 m',
    image: img('tarvisio'),
    imageAlt: 'The alpine town of Tarvisio in the Val Canale',
    what: 'Italy\u2019s three-country town: Austrian shoppers, Slovene neighbours, a pilgrimage church on a peak reached by cable car, and forest in every direction.',
    practical: 'Full services, a rail link, and a supermarket run to Austria that half the town does monthly. The Ciclovia Alpe Adria starts here.',
    link: 'https://www.turismofvg.it/en'
  },
  {
    id: 'sappada',
    name: 'Sappada / Plodn',
    area: 'Head of the Piave valley',
    kinds: ['ski', 'village'],
    altitude: '1,250 m',
    image: img('alps-sappada'),
    imageAlt: 'Wooden houses of Sappada in the Carnic Alps',
    what: 'A German-speaking island of dark timber houses, with the Dolomites in view and a Carnival that predates anyone\u2019s memory.',
    practical: 'Left Veneto for FVG in 2017 and gained the region\u2019s services. Isolated in the best way — but budget for winter driving.'
  },
  {
    id: 'forni',
    name: 'Forni di Sopra',
    area: 'Upper Carnia, Dolomiti Friulane',
    kinds: ['hike', 'ski', 'village'],
    altitude: '900 m',
    image: img('alps-forni'),
    imageAlt: 'Meadows and Dolomite peaks above Forni di Sopra',
    what: 'The gateway to the Friulian Dolomites nature park: hay meadows, wild river valleys and the least-trafficked Dolomite scenery in Italy.',
    practical: 'A working village with a small ski area, a handful of shops and a doctor. Tolmezzo hospital is 45 minutes away.',
    link: 'https://www.parcodolomitifriulane.it/'
  },
  {
    id: 'zoncolan',
    name: 'Monte Zoncolan & Ravascletto',
    area: 'Central Carnia',
    kinds: ['ski', 'hike'],
    altitude: '950–1,750 m',
    image: img('alps-zoncolan'),
    imageAlt: 'Ravascletto beneath the slopes of Monte Zoncolan',
    what: 'Famous to cyclists as the hardest climb in the Giro d\u2019Italia, and to everyone else as Carnia\u2019s main ski hill.',
    practical: 'Cable car from Ravascletto; the road up is a bucket-list ride in summer and a serious one in winter.'
  },
  {
    id: 'piancavallo',
    name: 'Piancavallo',
    area: 'Above Pordenone',
    kinds: ['ski', 'hike'],
    altitude: '1,280 m',
    image: img('alps-piancavallo'),
    imageAlt: 'The plateau and forests of Piancavallo above the Friulian plain',
    what: 'The closest snow to the plain — 40 minutes from Pordenone, with the whole Veneto plain and the sea laid out below on clear days.',
    practical: 'Purpose-built and functional rather than pretty, but the easiest mountain day in the region if you live in the west.'
  },
  {
    id: 'tolmezzo',
    name: 'Tolmezzo',
    area: 'Capital of Carnia',
    kinds: ['village'],
    altitude: '323 m',
    image: img('alps-tolmezzo'),
    imageAlt: 'The town of Tolmezzo below the Carnic Alps',
    what: 'The practical base for the mountains: a real town with a hospital, a market, schools and the Carnic museum, ringed by peaks.',
    practical: 'If you want mountain life without mountain isolation, this is the address. Udine is 45 minutes by the fast road.'
  }
];

export interface WinterTruth {
  title: string;
  body: string;
}

export const alpineTruths: WinterTruth[] = [
  { title: 'Snow tyres are the law, not a suggestion', body: 'From 15 November to 15 April on most mountain roads. Budget for a set plus chains, and expect a couple of white-knuckle drives each winter.' },
  { title: 'Heating is the real cost of altitude', body: 'A Carnia house can cost €1,800–2,800 a year to heat against maybe €900 on the coast. Cheap property, expensive comfort — price both together.' },
  { title: 'Healthcare is a valley drive', body: 'Tolmezzo and Gemona cover the basics; anything specialist means Udine, 40–70 minutes down the road. Helicopter rescue is excellent, routine appointments less so.' },
  { title: 'The border is your supermarket', body: 'From Tarvisio, Villach is 35 minutes and Kranjska Gora 20. Fuel, dentistry and weekly shopping across the line are normal, not exotic.' },
  { title: 'February is the honest test', body: 'Villages that hum in August have twenty people and one open bar in February. Rent through a winter before you buy — every long-term resident here will tell you the same.' }
];

export const alpeAdria = {
  title: 'Ciclovia Alpe Adria',
  summary: 'Salzburg to Grado, 415 km, almost all of it car-free and much of it downhill on the Italian side.',
  legs: [
    { name: 'Tarvisio → Venzone', km: '45 km', note: 'The old railway line: tunnels, viaducts and a steady descent through the Fella gorge. The single best ride in the region.' },
    { name: 'Venzone → Udine', km: '40 km', note: 'Out of the mountains into the plain, past Gemona and the quake-rebuilt towns.' },
    { name: 'Udine → Palmanova', km: '30 km', note: 'Flat farmland, quiet lanes and a star-shaped fortress at the end of it.' },
    { name: 'Palmanova → Grado', km: '40 km', note: 'Through Aquileia\u2019s mosaics and out along the lagoon causeway to the sea.' }
  ],
  practical: 'Bikes travel on the regional trains (Micotra runs Udine–Villach with bike carriages), so you can ride one way and come back on rails.',
  link: 'https://www.alpe-adria-radweg.com/en/'
};
