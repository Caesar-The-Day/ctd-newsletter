export interface NaturePark {
  id: string;
  name: string;
  local: string;
  image: string;
  imageAlt: string;
  character: string;
  feels: string;
  towns: string[];
  fromTrento: string;
  fromBolzano: string;
  elevation: string;
  bestMonths: string;
  publicTransport: string;
  bikes: string;
  dogs: string;
  link: { label: string; url: string };
}

const img = (f: string) => `/images/trentino-alto-adige/nature/${f}`;

export const parks: NaturePark[] = [
  {
    id: 'brenta',
    name: 'Adamello-Brenta',
    local: 'Parco Naturale Adamello-Brenta',
    image: img('adamello-brenta.jpg'),
    imageAlt: 'The pale limestone towers of the Brenta Dolomites rising above scree slopes',
    character: 'Trentino\'s biggest park: the Brenta Dolomites on one side, the Adamello glacier on the other.',
    feels:
      'The only Dolomite group west of the Adige, and the only place in the Alps with a resident brown bear population — around a hundred animals, which locals argue about constantly. Walk in from Molveno or Madonna di Campiglio and you are under vertical rock within two hours.',
    towns: ['Madonna di Campiglio', 'Molveno', 'Pinzolo', 'Cles'],
    fromTrento: '50–75 min',
    fromBolzano: '1 h 50',
    elevation: '800–3,558 m (Cima Presanella)',
    bestMonths: 'Late June – early October; ski touring Jan–Mar',
    publicTransport: 'Trentino Trasporti buses to Molveno and Campiglio; cable cars from both',
    bikes: 'Allowed on marked forest roads, not on high alpine paths',
    dogs: 'On lead; bear-country rules apply — keep them close',
    link: { label: 'Parco Adamello-Brenta', url: 'https://www.pnab.it/' },
  },
  {
    id: 'stelvio',
    name: 'Stelvio',
    local: 'Parco Nazionale dello Stelvio / Nationalpark Stilfserjoch',
    image: img('stelvio.jpg'),
    imageAlt: 'Glaciated peaks of the Ortler group above a high alpine valley in Stelvio National Park',
    character: 'One of Italy\'s largest national parks, straddling Trentino, Alto Adige and Lombardy.',
    feels:
      'This is the serious high-altitude end of the region: the Ortler at 3,905 m, glaciers you can still walk to, and the famous 48-hairpin pass road that closes for half the year. Villages like Solda and Trafoi are tiny and genuinely remote in winter.',
    towns: ['Silandro', 'Solda', 'Malè', 'Peio', 'Rabbi'],
    fromTrento: '1 h 30 (Val di Sole side)',
    fromBolzano: '1 h 20 (Val Venosta side)',
    elevation: '650–3,905 m (Ortles/Ortler)',
    bestMonths: 'July – September for high routes; pass road usually shut Nov–May',
    publicTransport: 'Venosta rail line to Silandro/Spondigna, then valley buses',
    bikes: 'Road cycling legend; MTB on designated tracks only',
    dogs: 'On lead year-round, banned in some wildlife zones',
    link: { label: 'Stelvio National Park', url: 'https://www.stelviopark.it/' },
  },
  {
    id: 'paneveggio',
    name: 'Paneveggio – Pale di San Martino',
    local: 'Parco Naturale Paneveggio – Pale di San Martino',
    image: img('paneveggio.jpg'),
    imageAlt: 'The Pale di San Martino massif glowing pink at sunset above forest',
    character: 'The violin forest, and behind it a wall of pale dolomite that turns pink at dusk.',
    feels:
      'Paneveggio\'s spruce has been cut for instrument soundboards since Stradivari\'s day — Fiemme timber still goes to Cremona. The Pale plateau above San Martino is a lunar limestone desert you reach by cable car and then hardly believe.',
    towns: ['San Martino di Castrozza', 'Predazzo', 'Cavalese', 'Fiera di Primiero'],
    fromTrento: '1 h 15',
    fromBolzano: '1 h 20',
    elevation: '1,000–3,192 m (Cima Vezzana)',
    bestMonths: 'June – October; Nordic skiing in Val di Fiemme all winter',
    publicTransport: 'Buses from Trento via Fiemme; Rosetta cable car from San Martino',
    bikes: 'Good gravel and forest-road network; the plateau is walking only',
    dogs: 'On lead, welcome on most trails',
    link: { label: 'Parco Paneveggio', url: 'https://parcopan.org' },
  },
  {
    id: 'puez-odle',
    name: 'Puez-Odle',
    local: 'Naturpark Puez-Geisler',
    image: img('puez-odle.jpg'),
    imageAlt: 'The jagged Odle/Geisler peaks above green meadows in Val di Funes',
    character: 'The Ladin heartland park: Odle spires above Funes, Puez plateaux above Val Gardena.',
    feels:
      'Geologists call it the Dolomites\' open textbook — every rock layer of the range is exposed here. For everyone else it is the postcard: the Odle teeth above the Santa Maddalena church, and hut-to-hut walking that never gets old.',
    towns: ['Ortisei', 'Santa Cristina', 'Selva', 'San Pietro (Funes)'],
    fromTrento: '1 h 50',
    fromBolzano: '40–55 min',
    elevation: '1,500–3,025 m (Sass Rigais)',
    bestMonths: 'Mid-June – mid-October',
    publicTransport: 'Very good: Val Gardena buses plus Seceda, Col Raiser and Dantercepies lifts',
    bikes: 'Lift-assisted MTB in Gardena; core park zones closed to bikes',
    dogs: 'On lead, and expect grazing cattle with guardian instincts',
    link: { label: 'Puez-Odle Nature Park', url: 'https://www.odlesdolomites.com/en/region/puez-odle-nature-park/' },
  },
  {
    id: 'sciliar',
    name: 'Sciliar-Catinaccio',
    local: 'Naturpark Schlern-Rosengarten',
    image: img('sciliar-catinaccio.jpg'),
    imageAlt: 'The Sciliar massif seen across the rolling meadows of the Alpe di Siusi',
    character: 'South Tyrol\'s oldest protected area, and the easiest big landscape to reach from Bolzano.',
    feels:
      'The Alpe di Siusi is the largest high alpine meadow in Europe and it is genuinely gentle — prams and eighty-year-olds manage it. Behind it the Catinaccio turns blood-red at sunset, which is where the Rosengarten legend comes from.',
    towns: ['Siusi', 'Castelrotto', 'Fiè allo Sciliar', 'Tires'],
    fromTrento: '1 h 15',
    fromBolzano: '25–35 min',
    elevation: '880–3,002 m (Catinaccio d\'Antermoia)',
    bestMonths: 'May – October; snowshoeing and Nordic skiing Dec–Mar',
    publicTransport: 'Excellent: bus from Bolzano plus the Siusi–Alpe cable car (car access restricted 9–17)',
    bikes: 'Meadow tracks open to bikes with time restrictions; check local signage',
    dogs: 'On lead; large working dogs guard the herds in summer',
    link: { label: 'Sciliar-Catinaccio Park', url: 'https://www.seiser-alm.it/en/highlights/nature-and-landscape/sciliarcatinaccio-nature-park/' },
  },
  {
    id: 'fanes',
    name: 'Fanes-Sennes-Braies',
    local: 'Naturpark Fanes-Sennes-Prags',
    image: img('fanes-sennes-braies.jpg'),
    imageAlt: 'Lago di Braies with its turquoise water and boathouse below the Croda del Becco',
    character: 'High karst plateaux, Ladin legend country, and the most photographed lake in Italy.',
    feels:
      'Braies is beautiful and it is also a cautionary tale: summer access now needs a booked slot or a bus, because the car park broke. Walk twenty minutes past the lake and the crowd evaporates into empty plateau for hours.',
    towns: ['Braies', 'San Vigilio di Marebbe', 'Dobbiaco', 'La Villa'],
    fromTrento: '2 h 20',
    fromBolzano: '1 h 15',
    elevation: '1,000–3,064 m (Piz dles Cunturines)',
    bestMonths: 'Late June – early October; ski touring in spring',
    publicTransport: 'Pusteria rail line to Villabassa then park buses; Braies shuttle in high season',
    bikes: 'Long gravel climbs into Fanes are a classic; lake shore path is walking only',
    dogs: 'On lead; not allowed in the Braies lake boats',
    link: { label: 'Fanes-Sennes-Braies Park', url: 'https://www.suedtirolerland.it/en/highlights/nature-and-landscape/nature-parks-in-south-tyrol/fanes-senes-braies/' },
  },
  {
    id: 'monte-corno',
    name: 'Monte Corno',
    local: 'Naturpark Trudner Horn',
    image: img('monte-corno.jpg'),
    imageAlt: 'Wooded ridges and low mountains of the Monte Corno nature park in southern Alto Adige',
    character: 'The low, warm, wooded park — Mediterranean plants at the region\'s southern edge.',
    feels:
      'This is the answer for people who like walking but not altitude. Chestnut woods, vineyards, orchid meadows and an easy climate barely 30 minutes from Bolzano. Almost no tourists, and the trails stay open most of the winter.',
    towns: ['Trodena', 'Salorno', 'Montagna', 'Egna'],
    fromTrento: '35 min',
    fromBolzano: '30 min',
    elevation: '220–1,817 m (Corno Bianco)',
    bestMonths: 'Year-round; superb in April–May and October',
    publicTransport: 'Brennero rail line to Egna/Ora, then local buses',
    bikes: 'Forest roads open; gentle enough for e-bike day loops',
    dogs: 'On lead, easy terrain, no high pastures',
    link: { label: 'Monte Corno Park', url: 'https://www.suedtirolerland.it/en/highlights/nature-and-landscape/nature-parks-in-south-tyrol/monte-corno/' },
  },
  {
    id: 'tovel',
    name: 'Tovel & the Val di Non lakes',
    local: 'Lago di Tovel',
    image: img('tovel.jpg'),
    imageAlt: 'Lago di Tovel, a clear alpine lake ringed by forest and rock walls',
    character: 'Low-effort water and forest, inside the Brenta park but reachable by anyone.',
    feels:
      'Tovel was famous for turning red in summer until the algae stopped in 1964 — the science is still debated. The circuit path is flat, an hour, and doable in trainers. Cars are capped in July and August; take the shuttle from Tuenno.',
    towns: ['Tuenno', 'Cles', 'Ville d\'Anaunia'],
    fromTrento: '1 h',
    fromBolzano: '1 h 25',
    elevation: '1,178 m lake level',
    bestMonths: 'May – October',
    publicTransport: 'Trento–Malè rail to Cles, then summer shuttle bus',
    bikes: 'Road climb from Tuenno; lake loop is on foot',
    dogs: 'On lead, welcome on the loop',
    link: { label: 'Lago di Tovel', url: 'https://www.trentino.com/en/highlights/nature-and-landscape/lakes/lake-tovel/' },
  },
];

export interface TrailLevel {
  id: string;
  label: string;
  effort: string;
  summary: string;
  gear: string;
  routes: { name: string; where: string; stats: string; note: string }[];
}

export const trailLevels: TrailLevel[] = [
  {
    id: 'stroll',
    label: 'Valley stroll',
    effort: '1–2 h · under 150 m ascent',
    summary: 'Flat, waymarked, open most of the year and doable after lunch without planning.',
    gear: 'Trainers. Water. That is the whole list.',
    routes: [
      { name: 'Lago di Braies shore loop', where: 'Fanes-Sennes-Braies', stats: '3.5 km · 40 m · 1 h', note: 'Book the access slot or arrive before 9 in July–August.' },
      { name: 'Lago di Tovel circuit', where: 'Val di Non', stats: '4 km · 60 m · 1 h', note: 'Shuttle from Tuenno when the road cap is in force.' },
      { name: 'Renon high plateau path', where: 'Above Bolzano', stats: '6 km · 120 m · 1 h 45', note: 'Cable car from Bolzano, then walk to the earth pyramids.' },
      { name: 'Sentiero della Pace, Val di Fiemme', where: 'Fiemme', stats: '5 km · 100 m · 1 h 30', note: 'WWI front line, interpretive boards in three languages.' },
    ],
  },
  {
    id: 'halfday',
    label: 'Half-day hike',
    effort: '3–5 h · 400–800 m ascent',
    summary: 'A proper climb, a hut lunch, and back down before the afternoon storms.',
    gear: 'Boots, rain shell, 1.5 l water, and a look at the 13:00 thunderstorm forecast.',
    routes: [
      { name: 'Seceda to Rifugio Firenze', where: 'Puez-Odle', stats: '8 km · 500 m · 3 h 30', note: 'Lift up, walk down — the classic Odle profile the whole way.' },
      { name: 'Alpe di Siusi to Rifugio Bolzano', where: 'Sciliar', stats: '11 km · 700 m · 4 h 30', note: 'The oldest hut in the Dolomites, 1885.' },
      { name: 'Malga Ritorto loop', where: 'Brenta', stats: '9 km · 550 m · 4 h', note: 'Five lakes below the Brenta towers, from Madonna di Campiglio.' },
      { name: 'Rifugio Rosetta from San Martino', where: 'Pale di San Martino', stats: '6 km · 450 m · 3 h', note: 'Or take the cable car and walk out onto the limestone plateau.' },
    ],
  },
  {
    id: 'hut',
    label: 'Hut to hut',
    effort: '2–8 days · 800–1,200 m per day',
    summary: 'Multi-day traverses sleeping in rifugi. The best thing this region offers, and the most planning.',
    gear: 'Sleeping-bag liner, cash, headtorch, booked beds. Huts fill by March for August.',
    routes: [
      { name: 'Alta Via 1', where: 'Braies to Belluno', stats: '120 km · 8–11 days', note: 'Starts at Braies, no ferrata required, the classic first traverse.' },
      { name: 'Alta Via 2', where: 'Bressanone to Feltre', stats: '160 km · 12 days', note: 'Harder, higher, several protected sections; the "high road of legends".' },
      { name: 'Brenta hut circuit', where: 'Adamello-Brenta', stats: '4–5 days', note: 'Tuckett, Brentei, Alimonta — glorious and often bookable later than Alta Via huts.' },
      { name: 'Puez-Odle traverse', where: 'Val Gardena to Val Badia', stats: '2 days', note: 'A short, achievable taste of the format.' },
    ],
  },
  {
    id: 'ferrata',
    label: 'Via ferrata',
    effort: 'Exposed cable routes · half to full day',
    summary: 'Steel cable, ladders, and long drops. Trentino invented the format and still keeps the hardest of it.',
    gear: 'Certified ferrata set, helmet, harness, gloves. Rent in any valley town. Do not improvise.',
    routes: [
      { name: 'Sentiero delle Bocchette Centrali', where: 'Brenta', stats: 'Full day · very exposed', note: 'The most famous ferrata in the Alps. Ledges cut across vertical faces.' },
      { name: 'Via ferrata Santner', where: 'Catinaccio', stats: '4–5 h · difficult', note: 'Straight up into the Rosengarten from Vigo di Fassa.' },
      { name: 'Ferrata delle Trincee', where: 'Marmolada area', stats: '5 h · hard', note: 'WWI tunnels and trenches along a black volcanic ridge.' },
      { name: 'Ferrata Rio Sallagoni', where: 'Near Arco', stats: '2 h · beginner', note: 'Low altitude gorge route, good first ferrata, open most of the year.' },
    ],
  },
];

export interface BikeSpot {
  name: string;
  kind: 'Bike park' | 'Long route' | 'Everyday';
  where: string;
  detail: string;
  season: string;
  link?: string;
}

export const bikeSpots: BikeSpot[] = [
  {
    name: 'Val di Sole Bike Land',
    kind: 'Bike park',
    where: 'Commezzadura / Daolasa',
    detail: 'The UCI World Cup downhill venue — Black Snake is genuinely world class, plus easier flow lines off the same gondola.',
    season: 'June – late September',
    link: 'https://www.valdisolebikeland.com/',
  },
  {
    name: 'Dolomiti Paganella Bike',
    kind: 'Bike park',
    where: 'Andalo / Fai della Paganella',
    detail: 'Italy\'s best-developed all-mountain area: 20+ trails from green flow to double black, all lift-served, 25 minutes from Trento.',
    season: 'Late May – October',
    link: 'https://www.dolomitipaganellabike.com/',
  },
  {
    name: 'Val Gardena and Alta Badia lifts',
    kind: 'Bike park',
    where: 'Ortisei, Selva, Corvara',
    detail: 'Summer lifts carry bikes into the Sella circuit; enduro rather than downhill, with hut stops that serve strudel.',
    season: 'Mid-June – late September',
  },
  {
    name: 'Val Venosta cycleway',
    kind: 'Long route',
    where: 'Resia pass to Merano',
    detail: '80 km of asphalt descending 1,000 m through apple country. Ride down, take the Venosta train back — bikes carried as standard.',
    season: 'April – November',
  },
  {
    name: 'Adige cycleway (Ciclabile dell\'Adige)',
    kind: 'Everyday',
    where: 'Resia to Verona via Bolzano and Trento',
    detail: 'The spine of the region: flat, separated from traffic, and used by residents for actual commuting and shopping, not just tourism.',
    season: 'Year-round in the valley',
  },
  {
    name: 'Valsugana cycleway',
    kind: 'Everyday',
    where: 'Trento to Bassano via Levico and Caldonazzo',
    detail: '80 km along lakes and river. Gentle enough for e-bikes and the easiest way to build daily mileage without climbing.',
    season: 'March – November',
  },
  {
    name: 'Pusteria and Drava route',
    kind: 'Long route',
    where: 'San Candido to Lienz, Austria',
    detail: 'A 44 km downhill run across the border into Austria, train back. The classic half-day family ride of the east.',
    season: 'May – October',
  },
  {
    name: 'Tour of the Sella / Dolomite passes',
    kind: 'Long route',
    where: 'Sella, Gardena, Pordoi, Campolongo',
    detail: 'Road cycling\'s holy ground, 55 km and 1,800 m of climbing. Two car-free "Sellaronda Bike Day" weekends each summer.',
    season: 'June – September',
  },
];

export const seasonBand = [
  { month: 'Jan', snow: 95, note: 'Ski touring and snowshoe season; high trails buried, passes shut' },
  { month: 'Feb', snow: 95, note: 'Deepest snow. Valley cycleways still rideable on clear days' },
  { month: 'Mar', snow: 80, note: 'Spring ski touring; hut booking opens for the summer and fills fast' },
  { month: 'Apr', snow: 55, note: 'Low parks wake up — Monte Corno, Arco, Garda. High routes still frozen' },
  { month: 'May', snow: 35, note: 'Waterfalls at full volume. Dolomite passes reopen mid-to-late month' },
  { month: 'Jun', snow: 15, note: 'Huts open from about the 20th. Snowfields linger above 2,500 m' },
  { month: 'Jul', snow: 5, note: 'Everything open, everything busy. Afternoon thunderstorms almost daily' },
  { month: 'Aug', snow: 3, note: 'Peak crowding and peak prices; Braies and Sella need booked access or an early start' },
  { month: 'Sep', snow: 5, note: 'The best month: stable weather, empty trails, huts still open' },
  { month: 'Oct', snow: 20, note: 'Larches turn gold. Most huts close around the 10th; first snow at altitude' },
  { month: 'Nov', snow: 45, note: 'The dead month. Lifts shut, passes closing, weather grey in the valleys' },
  { month: 'Dec', snow: 80, note: 'Ski season opens; walking moves down to the valley floor and the markets' },
];

export const hutFacts = [
  {
    title: 'Rifugio or Schutzhütte',
    body: 'Same institution, two languages. Most are run by CAI in Trentino and by AVS or private families in Alto Adige. Standards are high: hot meals, showers at the bigger ones, and a warden who will tell you honestly if you should not go on.',
  },
  {
    title: 'Book, and book early',
    body: 'For July and August, high-traffic huts on Alta Via 1 open reservations in March and fill within weeks. Half board is the normal booking — dinner, bed, breakfast — roughly €65–85 a night, cash still king in older huts.',
  },
  {
    title: 'CAI or AVS membership pays',
    body: 'An annual membership (about €45–60) cuts hut overnight rates by roughly half across Italy, Austria and Germany, and includes basic alpine rescue and repatriation cover. If you walk more than four hut nights a year it pays for itself.',
  },
  {
    title: 'Rescue is not free',
    body: 'Mountain rescue in both provinces can be charged to you if you were not injured or were plainly unprepared — helicopter callouts run into thousands. Membership cover or a dedicated alpine policy is the standard local answer.',
  },
];
