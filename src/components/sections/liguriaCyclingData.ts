export type CoastSegment = {
  id: string;
  name: string;
  km: string;
  image: string;
  imageAlt: string;
  surface: string;
  access: string;
  rental: string;
  stops: string;
  honesty: string;
};

/** The Ponente cycleway, west to east, on the old Genoa–Ventimiglia railway bed. */
export const coastSegments: CoastSegment[] = [
  {
    id: 'ospedaletti',
    name: 'Ospedaletti – Sanremo',
    km: '6 km',
    image: '/images/liguria/cycling-ospedaletti.jpg',
    imageAlt: 'The seafront and bay at Ospedaletti on the Riviera dei Fiori',
    surface: 'Asphalt, dead flat, two marked lanes plus a walking side.',
    access: 'Free and paid parking at the Ospedaletti end; Sanremo station is a five-minute roll away.',
    rental: 'Bike and e-bike hire at both ends, including trailers and adapted cycles at Sanremo.',
    stops: 'Beach bars every kilometre, the old Ospedaletti station, showers and toilets at Sanremo Portosole.',
    honesty:
      'The busiest stretch of the whole path. On a Sunday in July you ride at walking pace behind prams. Go early or go east.',
  },
  {
    id: 'sanremo-arma',
    name: 'Sanremo – Arma di Taggia',
    km: '5 km',
    image: '/images/liguria/cycling-arma-di-taggia.jpg',
    imageAlt: 'Taggia and Arma di Taggia seen from the hills above the coast',
    surface: 'Asphalt with three lit former railway tunnels — cool in August, sunglasses off.',
    access: 'Big car park at Arma; the path runs past Sanremo Portosole and the Solaro sports fields.',
    rental: 'The main hire hub sits by Sanremo Portosole; e-bikes go quickly in high season.',
    stops: 'Bagni and kiosks on the seaward side, plus a supermarket at Arma just off the path.',
    honesty:
      'The tunnels are the best bit — and the only shade. The stretch is exposed to the westerly that usually builds after lunch.',
  },
  {
    id: 'riva-santo-stefano',
    name: 'Riva Ligure – Santo Stefano al Mare',
    km: '4 km',
    image: '/images/liguria/cycling-santo-stefano-al-mare.jpg',
    imageAlt: 'The harbour and old town of Santo Stefano al Mare',
    surface: 'Asphalt right on the rocks, the closest the path gets to the water.',
    access: 'Parking at Marina degli Aregai, which is also the best coffee stop on the line.',
    rental: 'Hire at Aregai and at Riva; several outfits will deliver to your door.',
    stops: 'Aregai marina, small pebble coves, a couple of year-round trattorie.',
    honesty:
      'Spray comes over the wall in a winter storm and the path closes for a day or two. Nobody warns you; the barriers just appear.',
  },
  {
    id: 'san-lorenzo',
    name: 'San Lorenzo al Mare terminus',
    km: '3 km',
    image: '/images/liguria/cycling-ciclabile-ponente.jpg',
    imageAlt: 'The Ponente Ligure coastal cycleway running along the sea',
    surface: 'Asphalt, ending at the old San Lorenzo station and the marina.',
    access: 'The official western trailhead: large car park, hire centre, toilets, bike wash.',
    rental: 'The biggest rental fleet on the route, including tandems and cargo bikes.',
    stops: 'Marina di San Lorenzo, a gelateria worth the stop, and the tunnel toward Imperia.',
    honesty:
      'Beyond here the extension toward Imperia has opened in pieces for years. Check locally before you plan a through-ride.',
  },
  {
    id: 'imperia-link',
    name: 'Toward Imperia and Diano',
    km: 'in progress',
    image: '/images/liguria/imperia.jpg',
    imageAlt: 'The port and old town of Imperia',
    surface: 'Part path, part quiet road, part building site depending on the year.',
    access: 'Imperia Porto Maurizio station; the seafront promenade links onward to Diano Marina.',
    rental: 'Shops in Porto Maurizio and Diano Marina, geared to road and e-bikes.',
    stops: 'Porto Maurizio old town on its hill, the Diano beachfront.',
    honesty:
      'The dream of one unbroken Ventimiglia–Genoa line is real policy but slow money. Ride what exists, not what the map promises.',
  },
];

export type RideType = {
  id: string;
  label: string;
  blurb: string;
  routes: Route[];
};

export type Route = {
  name: string;
  where: string;
  distance: string;
  ascent: string;
  surface: string;
  note: string;
  image: string;
  imageAlt: string;
  link?: { label: string; url: string };
};

export const rideTypes: RideType[] = [
  {
    id: 'family',
    label: 'Flat family spin',
    blurb: 'No gradient, no traffic, ice cream at the end. What the old railway line was made for.',
    routes: [
      {
        name: 'Ponente cycleway, any segment',
        where: 'San Lorenzo al Mare to Ospedaletti',
        distance: '24 km one way',
        ascent: 'essentially none',
        surface: 'asphalt',
        note: 'Ride out with the morning land breeze, come back before the afternoon sea breeze builds.',
        image: '/images/liguria/cycling-ciclabile-ponente.jpg',
        imageAlt: 'Cyclists on the coastal cycleway in western Liguria',
        link: { label: 'Parco Costiero Riviera dei Fiori', url: 'https://www.pistaciclabile.com/' },
      },
      {
        name: 'Piana di Albenga lanes',
        where: 'Albenga, Ceriale, Villanova',
        distance: '20–35 km loops',
        ascent: '50–150 m',
        surface: 'quiet farm asphalt',
        note: 'Liguria\'s only real flat plain — greenhouses, artichokes and the medieval towers of Albenga in the middle.',
        image: '/images/liguria/cycling-albenga-piana.jpg',
        imageAlt: 'The medieval towers and old town of Albenga',
      },
      {
        name: 'Ventimiglia to Menton',
        where: 'the French border',
        distance: '12 km one way',
        ascent: '120 m',
        surface: 'coast road and promenade',
        note: 'Cross at Ponte San Ludovico, ride the Menton promenade, come home with French bread. Bring ID.',
        image: '/images/liguria/cycling-ventimiglia-menton.jpg',
        imageAlt: 'Ventimiglia old town above the sea near the French border',
      },
    ],
  },
  {
    id: 'road',
    label: 'Hill road climb',
    blurb: 'The reason pro teams winter here: you can climb from sea level every single day of the year.',
    routes: [
      {
        name: 'Cipressa and the Poggio',
        where: 'above Sanremo',
        distance: '5.6 km and 3.7 km',
        ascent: '240 m / 130 m',
        surface: 'asphalt, narrow',
        note: 'The Milano–Sanremo finale. Gentle numbers, brutal when ridden at race pace after 280 km.',
        image: '/images/liguria/cycling-cipressa.jpg',
        imageAlt: 'The hill village of Cipressa above the Riviera dei Fiori',
      },
      {
        name: 'Colle San Bartolomeo',
        where: 'Val Prino to Val Tanaro',
        distance: '13 km',
        ascent: '620 m',
        surface: 'asphalt',
        note: 'The classic escape from Imperia into the back country. Steady, shaded, and quiet outside weekends.',
        image: '/images/liguria/cycling-san-bartolomeo.jpg',
        imageAlt: 'Colle San Bartolomeo seen from the Impero valley',
      },
      {
        name: 'Colle di Nava',
        where: 'Pieve di Teco to Piedmont',
        distance: '10 km',
        ascent: '560 m',
        surface: 'asphalt, main road',
        note: 'Lavender fields at the top and a genuine change of climate. Traffic is real on the SS28 — ride it early.',
        image: '/images/liguria/cycling-colle-di-nava.jpg',
        imageAlt: 'The Colle di Nava pass between Liguria and Piedmont',
      },
      {
        name: 'Passo del Turchino',
        where: 'behind Genoa',
        distance: '25 km from Voltri',
        ascent: '530 m',
        surface: 'asphalt',
        note: 'The old Milano–Sanremo crossing. Sea on one side, Po plain fog on the other, in under an hour.',
        image: '/images/liguria/cycling-turchino.jpg',
        imageAlt: 'The Passo del Turchino road pass above Genoa',
      },
    ],
  },
  {
    id: 'gravel',
    label: 'Gravel and hinterland',
    blurb: 'Olive-terrace service roads, mule tracks and villages where the bar is also the shop.',
    routes: [
      {
        name: 'Valle Argentina to Triora',
        where: 'inland from Arma di Taggia',
        distance: '35 km one way',
        ascent: '900 m',
        surface: 'asphalt with gravel variants',
        note: 'The witch village at the head of the valley, chestnut woods, and Molini for lunch on the way back.',
        image: '/images/liguria/cycling-valle-argentina.jpg',
        imageAlt: 'The upper Valle Argentina and Monte Saccarello',
      },
      {
        name: 'Prino valley olive roads',
        where: 'Dolcedo and around',
        distance: '25–40 km loops',
        ascent: '700–1,100 m',
        surface: 'concrete ramps and gravel',
        note: 'Steep concrete strips built for the olive harvest. A 34x34 gear is not optional here.',
        image: '/images/liguria/dolcedo.jpg',
        imageAlt: 'The medieval bridge and houses of Dolcedo in the Prino valley',
      },
      {
        name: 'Val Nervia: Dolceacqua and Apricale',
        where: 'inland from Ventimiglia',
        distance: '45 km loop',
        ascent: '1,100 m',
        surface: 'asphalt and old mule tracks',
        note: 'Two of the finest villages in Liguria, Rossese wine in both, and a long descent home to the sea.',
        image: '/images/liguria/cycling-val-nervia.jpg',
        imageAlt: 'The Nervia valley below the villages of Pigna and Castel Vittorio',
      },
    ],
  },
  {
    id: 'mtb',
    label: 'Technical MTB',
    blurb: 'Limestone, loam and 1,000 m descents that finish on a beach. This is why riders move here.',
    routes: [
      {
        name: 'Finale Ligure trail network',
        where: 'Finalborgo, Manie, NATO base',
        distance: '200+ marked trails',
        ascent: 'shuttle or pedal',
        surface: 'limestone slab, loam, rock',
        note: 'DH-Ale, Rollercoaster, Isallo Pro. Europe\'s enduro capital, and the reason Finalborgo is full of bike shops.',
        image: '/images/liguria/cycling-finale-trails.jpg',
        imageAlt: 'Finale Ligure and the limestone hills behind the town',
        link: { label: 'Finale Outdoor Region', url: 'https://www.finaleoutdoor.com/' },
      },
      {
        name: 'Via del Sale — Limone to Ventimiglia',
        where: 'the Ligurian ridge',
        distance: '90 km',
        ascent: '2,000 m',
        surface: 'high military dirt road',
        note: 'The great one: two days along the crest at 2,000 m, ending with a descent to the Mediterranean.',
        image: '/images/liguria/cycling-via-del-sale.jpg',
        imageAlt: 'The high mountains above Limone Piemonte at the head of the salt road',
      },
      {
        name: 'Alta Via dei Monti Liguri, MTB sections',
        where: 'Ventimiglia to Ceparana',
        distance: '440 km in stages',
        ascent: 'relentless',
        surface: 'singletrack and forest road',
        note: 'Not all of it is rideable, but the Beigua, Antola and Aveto sections are superb multi-day riding.',
        image: '/images/liguria/cycling-alta-via.jpg',
        imageAlt: 'The Alta Via ridge path along the Ligurian Apennines',
        link: { label: 'Alta Via dei Monti Liguri', url: 'https://www.altaviadeimontiliguri.it/' },
      },
      {
        name: 'Beigua park descents',
        where: 'above Varazze and Arenzano',
        distance: '30–50 km loops',
        ascent: '1,000–1,400 m',
        surface: 'rock and loam',
        note: 'Varazze is the Ponente\'s quieter answer to Finale: shuttle days, sea views, fewer people.',
        image: '/images/liguria/cycling-beigua.jpg',
        imageAlt: 'The summit ridge of Monte Beigua above the Ligurian coast',
      },
    ],
  },
];

export type SeasonBand = {
  months: string;
  coast: string;
  hills: string;
  verdict: 'best' | 'good' | 'mixed' | 'avoid';
};

export const seasonBands: SeasonBand[] = [
  { months: 'Jan–Feb', coast: 'Empty path, 12–15 °C, pro teams training', hills: 'Ridge trails wet or snowed above 1,200 m', verdict: 'good' },
  { months: 'Mar–Apr', coast: 'Perfect. Mimosa, then wisteria', hills: 'Finale peak season, trails tacky and fast', verdict: 'best' },
  { months: 'May–Jun', coast: 'Warm, busy at weekends only', hills: 'Everything open, high ridge clears by June', verdict: 'best' },
  { months: 'Jul–Aug', coast: 'Ride before 09:00 or not at all', hills: 'Too hot below 800 m; go high or go early', verdict: 'avoid' },
  { months: 'Sep–Oct', coast: 'The local secret: warm sea, empty path', hills: 'Second Finale season, plus hunting days midweek', verdict: 'best' },
  { months: 'Nov–Dec', coast: 'Storm closures, spray over the wall', hills: 'Mud, short days, chestnut leaf on the rocks', verdict: 'mixed' },
];

export const practicalities = [
  {
    title: 'Bikes on trains',
    body:
      'Regional trains along the coast take bikes for a small supplement, and the Ventimiglia–Genoa line is your shuttle: ride one way, train back. Intercity and high-speed services need a bagged bike.',
    link: { label: 'Trenitalia bike rules', url: 'https://www.trenitalia.com/en/information/travelling_withpets_luggagebikes/bike.html' },
  },
  {
    title: 'Where the bike lives',
    body:
      'This is the real question in a caruggi flat with four floors and no lift. Ask about a cantina or a garage box before you sign anything. Bike theft in Genoa and Sanremo is routine — use two locks, never leave it on the street overnight.',
  },
  {
    title: 'E-bikes change the map',
    body:
      'On a coast where every village sits 300 m above the sea, an e-bike turns a project into an errand. Most hire fleets are now electric, and inland bars have charging points for riders.',
  },
  {
    title: 'The Aurelia is not a cycle route',
    body:
      'The SS1 is narrow, busy and full of blind bends between tunnels. Locals climb inland and drop back down. Lights, mirror and a bright jacket if you must use it, and never on a summer Sunday.',
  },
  {
    title: 'Shuttles, passes and guides',
    body:
      'Finale runs a full commercial shuttle economy in spring and autumn; a trail pass supports the volunteers who maintain the network. Varazze, Molini di Triora and Sanremo have their own smaller operations.',
    link: { label: 'Finale Outdoor Region', url: 'https://www.finaleoutdoor.com/' },
  },
];
