/**
 * Data for the "Friuli Afloat" section — harbours of the Gulf of Trieste and
 * the Grado/Marano lagoon, plus what you can reach by boat from each of them.
 *
 * Distances are indicative straight-line/coastal nautical miles, good enough
 * for planning a day out, not for navigation.
 */

export type Water = 'lagoon' | 'gulf';
export type Bora = 'sheltered' | 'moderate' | 'exposed';

export type Marina = {
  id: string;
  name: string;
  town: string;
  water: Water;
  /** 0 = Veneto border, 100 = Slovenian border at Muggia */
  x: number;
  berths: number;
  maxLoa: number;
  depth: string;
  /** indicative annual berth band for a 12 m boat, EUR */
  rate12: [number, number];
  bora: Bora;
  boraNote: string;
  summary: string;
  walkable: string;
  vibe: string;
  image?: string;
  link?: string;
  linkLabel?: string;
};

export const marinas: Marina[] = [
  {
    id: 'lignano',
    name: 'Marina Punta Faro & Marina Uno',
    town: 'Lignano Sabbiadoro',
    water: 'lagoon',
    x: 4,
    berths: 1500,
    maxLoa: 30,
    depth: '2.5–4 m',
    rate12: [2800, 5200],
    bora: 'sheltered',
    boraNote: 'Behind the Tagliamento mouth; the Bora arrives tired this far west.',
    summary:
      'The biggest concentration of berths in the region, spread across several basins on the Marano lagoon side of the peninsula. Boats here are used for family cruising, not display, and the yards, chandlers and winter storage all sit within a few kilometres.',
    walkable: 'The beach front, the pine wood at Riviera, supermarkets and a summer town that empties in October.',
    vibe: 'Big, practical, family cruising',
    image: '/images/friuli-venezia-giulia/afloat-lignano.jpg',
    link: 'https://www.marinapuntafaro.it/',
    linkLabel: 'marinapuntafaro.it',
  },
  {
    id: 'aprilia',
    name: 'Aprilia Marittima',
    town: 'Latisana / Marano lagoon',
    water: 'lagoon',
    x: 11,
    berths: 2500,
    maxLoa: 40,
    depth: '2.5–3.5 m',
    rate12: [2200, 4600],
    bora: 'sheltered',
    boraNote: 'Inland canals — you can leave the boat for a month in January without worrying.',
    summary:
      'A purpose-built boating village of canals and pontoons at the top of the lagoon, with several marinas side by side, travel lifts and the cheapest serious berths in the upper Adriatic. Half an hour of no-wake channel to open water, which is exactly why it is cheap.',
    walkable: 'Pontoons, yards, a couple of bars and restaurants; for a real town you drive to Latisana.',
    vibe: 'Boatyard town, value berths',
    image: '/images/friuli-venezia-giulia/afloat-aprilia-marittima.jpg',
    link: 'https://www.marinacaponord.it/',
    linkLabel: 'marinacaponord.it',
  },
  {
    id: 'marano',
    name: 'Porto di Marano Lagunare',
    town: 'Marano Lagunare',
    water: 'lagoon',
    x: 18,
    berths: 400,
    maxLoa: 18,
    depth: '1.5–3 m',
    rate12: [1600, 3000],
    bora: 'sheltered',
    boraNote: 'Fully enclosed. The wind is a noise, not a problem.',
    summary:
      'A fishing town that never became a resort — Venetian dialect, a trawler fleet, and a lagoon of channels, casoni and bird reserves behind it. Shallow draft only, and you learn the marks or you follow someone who has.',
    walkable: 'The whole village in ten minutes: fish market, campanile, two very good trattorie.',
    vibe: 'Working fishing port, shallow water',
    image: '/images/friuli-venezia-giulia/afloat-marano-lagunare.jpg',
    link: 'https://www.turismofvg.it/en',
    linkLabel: 'turismofvg.it',
  },
  {
    id: 'grado',
    name: 'Marina Porto San Vito & Darsena Grado',
    town: 'Grado',
    water: 'lagoon',
    x: 30,
    berths: 800,
    maxLoa: 25,
    depth: '2.5–4 m',
    rate12: [2600, 5000],
    bora: 'moderate',
    boraNote: 'Basins are protected, but the channel out can be uncomfortable in a strong easterly.',
    summary:
      'The best compromise on this coast: a real year-round town with hospital, thermal baths and a Byzantine old centre, a protected marina, and both the lagoon and the open Adriatic within twenty minutes of the fairway.',
    walkable: 'Old town calli, the basilica, the seafront, the market, the terme and a hospital.',
    vibe: 'Year-round town with proper marina',
    image: '/images/friuli-venezia-giulia/afloat-grado-lagoon.jpg',
    link: 'https://www.portosanvito.it/',
    linkLabel: 'portosanvito.it',
  },
  {
    id: 'monfalcone',
    name: 'Marina Hannibal & Marina Nauta',
    town: 'Monfalcone',
    water: 'gulf',
    x: 48,
    berths: 700,
    maxLoa: 60,
    depth: '3–5 m',
    rate12: [3200, 6500],
    bora: 'exposed',
    boraNote: 'Bora country. Basins are dredged and walled, but doubled lines and good fenders are standard here.',
    summary:
      'Industrial in the best sense: the Fincantieri cruise-ship yard is next door, so the technical skills, riggers, engineers and haul-out capacity are of a different order to a resort marina. Deep water, immediate access to the Gulf.',
    walkable: 'The Panzano quarter, the marina restaurants; the town centre and station are a short ride away.',
    vibe: 'Shipyard town, serious technical back-up',
    image: '/images/friuli-venezia-giulia/afloat-monfalcone.jpg',
    link: 'https://www.marinahannibal.com/',
    linkLabel: 'marinahannibal.com',
  },
  {
    id: 'duino',
    name: 'Porto di Duino & Sistiana bay',
    town: 'Duino-Aurisina',
    water: 'gulf',
    x: 58,
    berths: 300,
    maxLoa: 15,
    depth: '2–4 m',
    rate12: [2400, 4200],
    bora: 'exposed',
    boraNote: 'Directly under the Carso escarpment — the classic Bora chute. Small boats come out in winter.',
    summary:
      'Two tiny bays cut into the white limestone under Duino castle, with the Rilke path along the cliff above. More club than marina, and one of the loveliest places in Italy to keep a small boat if you can get a place.',
    walkable: 'The Rilke path, the castle, the WWF Falesie reserve; almost no shops.',
    vibe: 'Cliff-foot coves, club moorings',
    image: '/images/friuli-venezia-giulia/afloat-duino.jpg',
    link: 'https://www.turismofvg.it/en',
    linkLabel: 'turismofvg.it',
  },
  {
    id: 'portopiccolo',
    name: 'Portopiccolo Sistiana',
    town: 'Sistiana',
    water: 'gulf',
    x: 64,
    berths: 120,
    maxLoa: 40,
    depth: '3–6 m',
    rate12: [7000, 14000],
    bora: 'moderate',
    boraNote: 'A quarry bowl with high walls — better protected than the coast either side of it.',
    summary:
      'A former limestone quarry rebuilt as a resort marina: spa, pool, restaurants and the priciest water in the region. Polished rather than salty, but the berths are new, the depth is real and the Gulf is right outside.',
    walkable: 'The resort itself, the beach club, the Rilke path up on the cliff.',
    vibe: 'Resort marina, premium pricing',
    image: '/images/friuli-venezia-giulia/afloat-sistiana.jpg',
    link: 'https://www.portopiccolosistiana.it/',
    linkLabel: 'portopiccolosistiana.it',
  },
  {
    id: 'barcola',
    name: 'Società Velica Barcola Grignano',
    town: 'Barcola, Trieste',
    water: 'gulf',
    x: 76,
    berths: 250,
    maxLoa: 20,
    depth: '2–4 m',
    rate12: [3000, 5500],
    bora: 'exposed',
    boraNote: 'The Bora front row. Also why this water produces so many good sailors.',
    summary:
      'Not really a marina — the club that invented the Barcolana, with moorings under the Miramare headland and a racing calendar that runs most weekends of the year. The place to join rather than simply pay.',
    walkable: 'The Barcola pineta and its concrete terraces, the seafront bus into Trieste in ten minutes.',
    vibe: 'Racing club, membership culture',
    image: '/images/friuli-venezia-giulia/afloat-barcolana.jpg',
    link: 'https://www.svbg.it/',
    linkLabel: 'svbg.it',
  },
  {
    id: 'trieste',
    name: 'Sacchetta & Marina San Giusto',
    town: 'Trieste',
    water: 'gulf',
    x: 84,
    berths: 500,
    maxLoa: 50,
    depth: '3–7 m',
    rate12: [3600, 8000],
    bora: 'exposed',
    boraNote: 'Ropes across the pontoons and Bora chains on the streets above; the city is built for it.',
    summary:
      'Berths inside a Habsburg city — step off the pontoon into Piazza Unità, a teaching hospital, an airport bus and Slovenian border twenty minutes away. Yacht Club Adriaco and the Sacchetta basin sit at the foot of the old town.',
    walkable: 'Piazza Unità, the Borgo Teresiano cafés, the Carciotti and the fish market; everything.',
    vibe: 'City-centre mooring, full urban life',
    image: '/images/friuli-venezia-giulia/afloat-trieste-porto.jpg',
    link: 'https://www.yachtclubadriaco.it/',
    linkLabel: 'yachtclubadriaco.it',
  },
  {
    id: 'muggia',
    name: 'Porto San Rocco & Marina San Rocco',
    town: 'Muggia',
    water: 'gulf',
    x: 94,
    berths: 500,
    maxLoa: 35,
    depth: '3–5 m',
    rate12: [3200, 6000],
    bora: 'moderate',
    boraNote: 'The southern shore of the Gulf takes the Bora on the beam rather than head-on.',
    summary:
      'The last Italian harbour before Slovenia, in the only Venetian-looking town in the region. A ferry crosses to Trieste in half an hour, Piran is a lunch run, and Croatian entry ports are inside a morning.',
    walkable: 'Muggia’s Venetian piazza and mandracchio, the ferry pontoon, bakeries and osmize up the hill.',
    vibe: 'Venetian border town, cruising springboard',
    image: '/images/friuli-venezia-giulia/afloat-muggia.jpg',
    link: 'https://www.portosanrocco.it/',
    linkLabel: 'portosanrocco.it',
  },
];

export type HubId = 'lignano' | 'grado' | 'monfalcone' | 'trieste' | 'muggia';

export const homePorts: { id: HubId; label: string; sub: string; coastNm: number }[] = [
  { id: 'lignano', label: 'Lignano & Aprilia', sub: 'Lagoon berths, cheapest water', coastNm: 5 },
  { id: 'grado', label: 'Grado', sub: 'Lagoon town, open sea close', coastNm: 15 },
  { id: 'monfalcone', label: 'Monfalcone', sub: 'Deep water, shipyard back-up', coastNm: 28 },
  { id: 'trieste', label: 'Trieste & Barcola', sub: 'City mooring, race fleet', coastNm: 40 },
  { id: 'muggia', label: 'Muggia', sub: 'Last port before Slovenia', coastNm: 46 },
];

export type DestinationGroup = 'lagoon' | 'gulf' | 'slovenia' | 'istria';

export const destinationGroups: { id: DestinationGroup; label: string; blurb: string }[] = [
  {
    id: 'lagoon',
    label: 'Lagoon & river mouths',
    blurb: 'Shallow, sheltered, birds everywhere — the world behind the sandbars.',
  },
  {
    id: 'gulf',
    label: 'The Gulf of Trieste',
    blurb: 'Castles, cliffs and cities on a stretch of water you can cross before lunch.',
  },
  {
    id: 'slovenia',
    label: 'Slovenia — no border at all',
    blurb: 'Schengen: same rules as sailing to the next Italian town.',
  },
  {
    id: 'istria',
    label: 'Croatia & Istria',
    blurb: 'Clear-in required, and then the best cruising ground in the northern Adriatic.',
  },
];

export type SeaDestination = {
  id: string;
  name: string;
  note: string;
  group: DestinationGroup;
  image?: string;
  link?: string;
  from: Record<HubId, number>;
};

/** Coastal position in nm measured from the Veneto border, heading east and then south. */
const along = (
  id: string,
  name: string,
  group: DestinationGroup,
  coastNm: number,
  note: string,
  extra: { image?: string; link?: string } = {}
): SeaDestination => ({
  id,
  name,
  group,
  note,
  ...extra,
  from: homePorts.reduce(
    (acc, h) => ({ ...acc, [h.id]: Math.max(2, Math.round(Math.abs(coastNm - h.coastNm))) }),
    {} as Record<HubId, number>
  ),
});

export const seaDestinations: SeaDestination[] = [
  // Lagoon
  along('casoni', 'Casoni di Marano', 'lagoon', 10, 'Reed-thatched fishermen’s huts on stilts; anchor off, row in, eat what was caught.', {
    image: '/images/friuli-venezia-giulia/afloat-marano-lagunare.jpg',
  }),
  along('stella', 'Foci dello Stella', 'lagoon', 12, 'A spring-fed river mouth reserve — the quietest water in the region, herons and no engines.'),
  along('barbana', 'Isola di Barbana', 'lagoon', 16, 'Island sanctuary in the Grado lagoon, reached by the pilgrim channel; tie up at the pontoon.', {
    image: '/images/friuli-venezia-giulia/afloat-grado-lagoon.jpg',
  }),
  along('portobuso', 'Porto Buso', 'lagoon', 13, 'The lagoon’s sea gate between the sandbars — the entry everyone learns first.'),
  along('cona', 'Isola della Cona', 'lagoon', 25, 'Isonzo mouth reserve: white Camargue horses, 320 bird species, a tender landing.'),
  along('grado-pineta', 'Grado Pineta & Primero', 'lagoon', 17, 'Sheltered swim water behind the pines, five minutes from the town quay.'),

  // Gulf of Trieste
  along('panzano', 'Baia di Panzano', 'gulf', 27, 'Cruise ships under construction on one side, mussel farms on the other.'),
  along('sistiana-bay', 'Sistiana bay', 'gulf', 36, 'Anchor in the old quarry bay under the Rilke path and swim off the boat.', {
    image: '/images/friuli-venezia-giulia/afloat-sistiana.jpg',
  }),
  along('duino-falesie', 'Duino cliffs', 'gulf', 34, 'White limestone falesie dropping into deep water; the castle above, no road below.', {
    image: '/images/friuli-venezia-giulia/afloat-duino.jpg',
  }),
  along('miramare', 'Miramare marine reserve', 'gulf', 38, 'Italy’s first marine protected area, right under Maximilian’s white castle. No anchoring in zone A.', {
    image: '/images/friuli-venezia-giulia/afloat-miramare.jpg',
    link: 'https://www.riservamarinamiramare.it/',
  }),
  along('trieste-molo', 'Trieste — Molo Audace', 'gulf', 40, 'Arrive by sea into a Habsburg piazza; the only Italian city you enter better by boat.', {
    image: '/images/friuli-venezia-giulia/afloat-trieste-porto.jpg',
  }),
  along('muggia-hop', 'Muggia mandracchio', 'gulf', 46, 'Venetian piazza, small-boat harbour, and the last Italian coffee before Slovenia.', {
    image: '/images/friuli-venezia-giulia/afloat-muggia.jpg',
  }),

  // Slovenia
  along('koper', 'Koper', 'slovenia', 52, 'A container port with a Venetian old town hidden behind it; marina inside the breakwater.'),
  along('izola', 'Izola', 'slovenia', 58, 'Fishing town turned marina, the friendliest clear-in-free lunch stop over the border.'),
  along('piran', 'Piran', 'slovenia', 62, 'The set-piece of the Slovenian coast: Tartini’s square, walls above, 100 berths below.', {
    image: '/images/friuli-venezia-giulia/afloat-piran.jpg',
  }),
  along('portoroz', 'Portorož & Sečovlje salt pans', 'slovenia', 64, 'Big marina, and a salt-pan reserve you can reach by tender up the Dragonja.'),

  // Croatia / Istria
  along('umag', 'Umag', 'istria', 70, 'First Croatian entry port going south — clear in here and the day is still yours.'),
  along('novigrad', 'Novigrad (Cittanova)', 'istria', 79, 'Walled Venetian harbour, a good marina and the Mirna river behind it.'),
  along('porec', 'Poreč', 'istria', 90, 'The Euphrasian basilica mosaics are UNESCO; anchor off the islet and tender in.'),
  along('rovinj', 'Rovinj', 'istria', 108, 'The single best arrival in the northern Adriatic — the campanile on the point, islands to anchor behind.', {
    image: '/images/friuli-venezia-giulia/afloat-rovinj.jpg',
  }),
  along('brijuni', 'Brijuni islands', 'istria', 124, 'National park archipelago; mooring and park fees, Roman ruins and a straight-line dinosaur trail.', {
    image: '/images/friuli-venezia-giulia/afloat-brijuni.jpg',
    link: 'https://www.np-brijuni.hr/en',
  }),
  along('pula', 'Pula', 'istria', 133, 'Amphitheatre over the harbour and the biggest chandlery choice south of Trieste.'),
  along('cres', 'Cres & Lošinj', 'istria', 165, 'Kvarner proper — an overnight, dolphins on the way, and a different price level ashore.'),
];

export const boatingFacts = [
  {
    title: 'Slovenia is not a border, Croatia is',
    body: 'Both are in Schengen and the EU, so passports are not the issue — Croatia’s boating paperwork is. An Italian-flagged boat cruising Croatian waters must clear in at a designated entry port (Umag, Novigrad, Poreč, Pula are the northern ones), buy the annual or short-term navigation permit (vinjeta) and carry a crew list. Budget a couple of hundred euro a season for a mid-size boat and half an hour at the harbourmaster.',
    link: 'https://mmpi.gov.hr/',
    linkLabel: 'Croatian ministry of the sea',
  },
  {
    title: 'When you need a licence',
    body: 'No patente nautica for engines up to 40 hp within 6 miles of the coast — which covers the whole lagoon and most of the Gulf. Beyond 6 miles, or over 40 hp, you need the licence. Given Croatia is the point of living here, most people do the oltre 12 miglia exam in their first winter.',
  },
  {
    title: 'The Bora decides everything',
    body: 'A north-easterly katabatic wind off the Carso that arrives with almost no warning and can gust past 100 km/h, most often between October and March. It flattens plans, not boats — the harbours are built for it — but it is the reason a Friulian owner checks the forecast before touching a mooring line, and the reason berth prices vary so much between lagoon and Gulf.',
  },
  {
    title: 'Lagoon draft, Gulf depth',
    body: 'Grado and Marano are a shallow world of marked channels, tide tables and a metre and a half at low water in places. The Gulf drops to twenty metres almost straight away. Sailors with a fin keel end up east of Grado; anyone with a motor cruiser or a lifting keel takes the cheaper lagoon berth.',
  },
  {
    title: 'What a berth actually costs',
    body: 'Roughly 1,600–3,000 euro a year for a 12 m boat in the Marano lagoon, 2,600–5,000 at Grado, 3,000–6,500 in the Gulf, and double that at Portopiccolo. Add haul-out, antifouling and insurance — about 1,200–2,500 a year — plus the winter storage that almost everyone here uses between November and March.',
  },
  {
    title: 'Getting afloat without owning a boat',
    body: 'This is a club coast. Società Velica di Barcola e Grignano, Yacht Club Adriaco, the Grado and Lignano circoli all run sailing schools, keel-boat courses and crew lists — the normal way in is a season of crewing on someone else’s Wednesday-night racing. Charter bases at Lignano, Monfalcone and Muggia make a weekend in Istria straightforward.',
    link: 'https://www.svbg.it/',
    linkLabel: 'svbg.it',
  },
];

export const boraMonths: { month: string; boraDays: number; sea: number; note: string }[] = [
  { month: 'Jan', boraDays: 9, sea: 10, note: 'Bora season; club racing continues, cruising does not.' },
  { month: 'Feb', boraDays: 8, sea: 9, note: 'Coldest water of the year, clearest air.' },
  { month: 'Mar', boraDays: 7, sea: 11, note: 'Launch season; yards are full.' },
  { month: 'Apr', boraDays: 5, sea: 14, note: 'First Istria weekends, still wearing a jacket.' },
  { month: 'May', boraDays: 3, sea: 18, note: 'Best month to cruise — empty, warm enough, cheap ashore.' },
  { month: 'Jun', boraDays: 2, sea: 22, note: 'Thermal breeze most afternoons, swimming everywhere.' },
  { month: 'Jul', boraDays: 1, sea: 25, note: 'Lagoon like a bath; book Croatian berths ahead.' },
  { month: 'Aug', boraDays: 1, sea: 26, note: 'Peak crowding, occasional violent thunderstorm fronts.' },
  { month: 'Sep', boraDays: 3, sea: 23, note: 'The connoisseur’s month: warm sea, empty anchorages.' },
  { month: 'Oct', boraDays: 6, sea: 19, note: 'Barcolana. The whole Gulf turns into a start line.' },
  { month: 'Nov', boraDays: 8, sea: 15, note: 'Haul-out and covers; Bora returns in earnest.' },
  { month: 'Dec', boraDays: 9, sea: 12, note: 'Winter racing for the committed only.' },
];
