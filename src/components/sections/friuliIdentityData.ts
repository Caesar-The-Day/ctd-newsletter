/**
 * Data for the Friuli-Venezia Giulia identity modules:
 * languages, the moving border, the 1976 earthquake and the year's calendar.
 * All photos are real, freely-licensed images stored locally.
 */

const img = (name: string) => `/images/friuli-venezia-giulia/${name}.jpg`;

/* ------------------------------------------------------------------ */
/* A. Four tongues                                                     */
/* ------------------------------------------------------------------ */

export interface Phrase {
  en: string;
  say: string;
  hint: string;
}

export interface Tongue {
  id: string;
  name: string;
  nativeName: string;
  speakers: string;
  where: string;
  towns: string[];
  status: string;
  image: string;
  imageAlt: string;
  blurb: string;
  practical: string;
  phrases: Phrase[];
  /** rough position on the schematic region strip, 0 (west) → 100 (east) */
  x: number;
  y: number;
}

export const tongues: Tongue[] = [
  {
    id: 'friulian',
    name: 'Friulian',
    nativeName: 'Furlan',
    speakers: '≈ 600,000 speakers',
    where: 'The plain and the hills — Udine, Pordenone and Gorizia provinces',
    towns: ['Udine', 'Cividale', 'San Daniele', 'Gemona', 'Spilimbergo'],
    status: 'Protected minority language (law 482/1999 and regional law 29/2007): bilingual road signs, optional school hours, official use in local government.',
    image: img('lang-natisone'),
    imageAlt: 'A Friulian village in the Natisone valley below wooded hills',
    blurb:
      'Not a dialect of Italian — a separate Rhaeto-Romance language, closer in family terms to Ladin and Romansh than to Tuscan. Newspapers, radio, church services and a real literature exist in it.',
    practical:
      'You never need Friulian: everyone speaks Italian. But the moment you greet a market stallholder with "mandi" you stop being a tourist. Older people in villages often think in Friulian first.',
    phrases: [
      { en: 'Hello / goodbye', say: 'Mandi', hint: 'One word for both. The single most useful thing on this page.' },
      { en: 'How much is it?', say: 'Trop kustial?', hint: 'Lit. "how much does it cost".' },
      { en: 'Thank you', say: 'Graciis', hint: 'GRA-chiis.' },
      { en: 'A glass of wine', say: 'Un tajut', hint: 'The ritual small glass — an institution, not a drink order.' },
      { en: 'See you at the bar', say: 'Si viodìn tal bar', hint: 'si vyo-DEEN tal bar.' }
    ],
    x: 42,
    y: 44
  },
  {
    id: 'slovene',
    name: 'Slovene',
    nativeName: 'Slovenščina',
    speakers: '≈ 50,000 speakers',
    where: 'The Karst above Trieste, the Gorizia hinterland, the Natisone, Torre and Resia valleys',
    towns: ['Opicina', 'Doberdò', 'San Pietro al Natisone', 'Resia', 'Tarvisio'],
    status: 'Fully protected (law 38/2001): Slovene-language state schools from nursery to secondary, bilingual signage and paperwork in listed municipalities.',
    image: img('lang-resia'),
    imageAlt: 'The Resia valley, a Slovene-speaking valley beneath the Julian Alps',
    blurb:
      'A national minority, not an immigrant community — these villages were Slovene before any modern border existed. Resia speaks its own archaic variant that other Slovenes struggle to follow.',
    practical:
      'On the Karst plateau you can genuinely run a life in Slovene: schools, banks, a theatre and two daily papers in Trieste. Slovene also travels — Ljubljana is 90 minutes away and the language works there.',
    phrases: [
      { en: 'Good morning', say: 'Dobro jutro', hint: 'DOH-bro YOO-tro.' },
      { en: 'How much is it?', say: 'Koliko stane?', hint: 'KO-lee-ko STA-neh.' },
      { en: 'Thank you', say: 'Hvala', hint: 'HVA-la.' },
      { en: 'A glass of Vitovska', say: 'Kozarec vitovske', hint: 'The Karst white, ordered on its home ground.' },
      { en: 'See you later', say: 'Se vidimo', hint: 'seh VEE-dee-mo.' }
    ],
    x: 78,
    y: 62
  },
  {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch / Zahre / Tischlbong',
    speakers: '≈ 2,000 speakers',
    where: 'Val Canale around Tarvisio, plus the linguistic islands of Sauris, Timau and Sappada',
    towns: ['Tarvisio', 'Malborghetto', 'Sauris', 'Timau', 'Sappada'],
    status: 'Recognised German-speaking minority; Val Canale runs quadrilingual (Italian, German, Slovene, Friulian) signage and schooling support.',
    image: img('lang-sauris'),
    imageAlt: 'The wooden alpine houses of Sauris, a German-speaking village in Carnia',
    blurb:
      'Medieval Carinthian and Bavarian settlers left villages that still speak archaic German dialects — Zahre in Sauris, Tischlbongarisch in Timau — surrounded on all sides by Italian and Friulian.',
    practical:
      'In Tarvisio, German is the second working language: Austrian shoppers, Austrian doctors, Austrian ski traffic. If you already speak German, this corner of Italy is the easiest landing in the country.',
    phrases: [
      { en: 'Good day', say: 'Grüß Gott', hint: 'The Alpine greeting, not "guten Tag".' },
      { en: 'How much is it?', say: 'Was kostet das?', hint: '' },
      { en: 'Hello (Sauris dialect)', say: 'Guatn tok', hint: 'Zahrar — the local variant of "guten Tag".' },
      { en: 'Thank you', say: 'Vergelt\u2019s Gott', hint: 'Heard from older speakers; "danke" is fine.' },
      { en: 'Two beers', say: 'Zwei Bier, bitte', hint: 'Useful within sight of the Austrian border.' }
    ],
    x: 30,
    y: 12
  },
  {
    id: 'triestino',
    name: 'Triestino',
    nativeName: 'Triestin',
    speakers: 'Everyday speech of the city',
    where: 'Trieste, Muggia and the coast — a Venetian-based dialect with German and Slavic loanwords',
    towns: ['Trieste', 'Muggia', 'Monfalcone', 'Grado (own variant)'],
    status: 'Not a protected language, but the actual language of the street, the market and the buffet.',
    image: img('trieste-piazza-unita'),
    imageAlt: 'Piazza Unità d\u2019Italia in Trieste, open on one side to the Adriatic',
    blurb:
      'Trieste never spoke Friulian. It speaks a Venetian dialect seasoned by a century of Habsburg administration — "cocolo" from Venice, "štrudl" from Vienna, "patoc" from Slovene, all in one sentence.',
    practical:
      'Nobody expects you to speak it, but you will hear it constantly and misread menus without it. Grado, 40 km west, speaks Graisan — an older, related dialect that Triestini find quaint.',
    phrases: [
      { en: 'Hello / bye (informal)', say: 'Ciò!', hint: 'CHO — the all-purpose Triestino interjection.' },
      { en: 'A macchiato in a glass', say: 'Un capo in b', hint: 'The city\u2019s signature coffee order.' },
      { en: 'How are you?', say: 'Come ti sta?', hint: 'Venetian "ti" instead of standard "stai".' },
      { en: 'Nice, lovely', say: 'Mularia bela', hint: '"Mulo/mula" = lad/lass — pure Trieste.' },
      { en: 'Let\u2019s go eat', say: 'Andemo magnar', hint: 'Ideally at a buffet, standing up, around 11am.' }
    ],
    x: 88,
    y: 82
  }
];

/* ------------------------------------------------------------------ */
/* B. The border that moved                                            */
/* ------------------------------------------------------------------ */

export interface BorderStop {
  year: string;
  title: string;
  /** where the eastern frontier sat, 0 = deep in today's Veneto, 100 = deep in today's Slovenia */
  border: number;
  flag: string;
  summary: string;
  detail: string;
  image?: string;
  imageAlt?: string;
}

export const borderStops: BorderStop[] = [
  {
    year: '1866',
    title: 'Friuli joins Italy — Trieste does not',
    border: 34,
    flag: 'Kingdom of Italy / Austria-Hungary',
    summary: 'The Third War of Independence hands Udine and the plain to Italy. The border stops at the Judrio stream, a few kilometres west of Gorizia.',
    detail:
      'For fifty years two Friulis exist side by side: an Italian one around Udine and an Austrian one running from Gorizia through Trieste to Istria. Families straddle the line, and the Austrian half is by far the richer of the two.'
  },
  {
    year: '1915–18',
    title: 'The Isonzo front',
    border: 40,
    flag: 'Front line',
    summary: 'Twelve battles along a river. More than a million casualties across a landscape the size of a county.',
    detail:
      'The war is fought on the Carso and the Isonzo/Soča, ending with the rout at Caporetto (Kobarid) in 1917. Gorizia is shelled to rubble; villages on the Karst are erased. The cemeteries here are the size of towns.',
    image: img('war-san-michele'),
    imageAlt: 'Trenches and rock defences of the Isonzo front on the Karst plateau'
  },
  {
    year: '1920',
    title: 'Italy reaches the Julian Alps',
    border: 80,
    flag: 'Kingdom of Italy',
    summary: 'The Treaty of Rapallo pushes the border deep into what is now Slovenia and Croatia. Trieste, Istria and Rijeka become Italian.',
    detail:
      'Under Fascism, Slovene and Croatian schools, newspapers and even surnames are Italianised — the wound that shapes everything that follows on this frontier.'
  },
  {
    year: '1943–45',
    title: 'Occupation, and the darkest year',
    border: 78,
    flag: 'Adriatisches Küstenland',
    summary: 'German annexation, partisan war, the Risiera di San Sabba in Trieste — the only Nazi camp with a crematorium on Italian soil.',
    detail:
      'Trieste is liberated in a contested race between Yugoslav and Allied forces in May 1945. The foibe killings and the exodus of Italians from Istria follow — a history still argued over at kitchen tables here.'
  },
  {
    year: '1947',
    title: 'The border is cut through the middle of Gorizia',
    border: 52,
    flag: 'Italy / Free Territory of Trieste',
    summary: 'The Paris treaty splits Gorizia: the town stays Italian, its railway station and hinterland become Yugoslav. Yugoslavia builds Nova Gorica next door from scratch.',
    detail:
      'A fence runs across gardens and a cemetery. Trieste and its coast become the Free Territory of Trieste under Allied and Yugoslav administration — briefly, a country of its own.',
    image: img('border-transalpina'),
    imageAlt: 'Piazza Transalpina in Gorizia, the square split between Italy and Slovenia'
  },
  {
    year: '1954',
    title: 'Trieste returns to Italy',
    border: 60,
    flag: 'Italy',
    summary: 'The London Memorandum gives Zone A, with Trieste, to Italy and Zone B to Yugoslavia. Crowds fill Piazza Unità.',
    detail:
      'The city gains a country and loses a hinterland: a great imperial port left with a border a few kilometres up the hill and no empire behind it. Trieste has been recalibrating ever since.',
    image: img('trieste-piazza-unita'),
    imageAlt: 'Piazza Unità d\u2019Italia in Trieste, open to the sea'
  },
  {
    year: '1963–75',
    title: 'Autonomy, then the Osimo settlement',
    border: 62,
    flag: 'Special-statute region',
    summary: 'Friuli-Venezia Giulia becomes an autonomous region in 1963; the 1975 Treaty of Osimo finally fixes the border for good.',
    detail:
      'Autonomy is granted precisely because of this frontier and its minorities — it is the reason the region controls its own health service, schools funding and language policy today.'
  },
  {
    year: '1991',
    title: 'Slovenia becomes a country',
    border: 62,
    flag: 'Italy / Slovenia',
    summary: 'The Ten-Day War is fought within earshot of Gorizia. The neighbour changes name, flag and system in a fortnight.',
    detail:
      'For the border towns this is less rupture than renewal: the shopping, smuggling and family traffic across the line resumes almost immediately.'
  },
  {
    year: '2004 · 2007',
    title: 'The line disappears',
    border: 62,
    flag: 'European Union / Schengen',
    summary: 'Slovenia joins the EU, then Schengen. On 21 December 2007 the fence in Gorizia comes down and the border simply stops existing.',
    detail:
      'People still alive here have needed a passport, a permit, a visa and finally nothing at all to walk to the same bakery. It is the single fact that explains the region\u2019s temperament.'
  },
  {
    year: '2025',
    title: 'GO!2025 — one city, two countries',
    border: 62,
    flag: 'Gorizia + Nova Gorica',
    summary: 'Gorizia and Nova Gorica hold the European Capital of Culture together — the first cross-border pairing ever chosen.',
    detail:
      'Piazza Transalpina, where the fence ran, is now a single square with a mosaic marking the old line. You can stand with one foot in each country, then have coffee on whichever side is cheaper.',
    image: img('border-transalpina'),
    imageAlt: 'The square on the Gorizia\u2013Nova Gorica border, once divided by a fence'
  }
];

export interface WarSite {
  name: string;
  place: string;
  what: string;
  visit: string;
  image?: string;
  imageAlt?: string;
  link?: string;
}

export const warRoute: WarSite[] = [
  {
    name: 'Sacrario di Redipuglia',
    place: 'Fogliano Redipuglia, 25 min from Gorizia',
    what: 'The largest war memorial in Italy: 100,187 soldiers, 60,330 of them unnamed, on twenty-two granite steps up a hillside.',
    visit: 'Free, always open, quietly overwhelming. The museum and the trenches of Colle Sant\u2019Elia sit at the foot.',
    image: img('war-redipuglia'),
    imageAlt: 'The vast stepped war memorial of Redipuglia',
    link: 'https://www.turismofvg.it/en/localita/redipuglia'
  },
  {
    name: 'Monte San Michele',
    place: 'Sagrado, on the Karst above the Isonzo',
    what: 'The hill fought over in five battles, where gas was first used on the Italian front. Trenches, galleries and craters are still in the rock.',
    visit: 'An open-air museum with marked paths; walkable in an afternoon, and the view explains the whole campaign.',
    image: img('war-san-michele'),
    imageAlt: 'Preserved trenches on Monte San Michele above the Isonzo'
  },
  {
    name: 'Kobarid / Caporetto',
    place: 'Slovenia, 45 min from Cividale',
    what: 'The name that entered the Italian language as a synonym for disaster. The museum here is one of Europe\u2019s best on the First World War.',
    visit: 'A day out across a border that no longer stops you: museum, Italian charnel house, and the turquoise Soča below.',
    image: img('war-kobarid'),
    imageAlt: 'The town of Kobarid in the Soča valley, Slovenia',
    link: 'https://www.kobariski-muzej.si/en/'
  },
  {
    name: 'Risiera di San Sabba',
    place: 'Trieste, Ratto della Pileria 43',
    what: 'A rice mill turned into the only Nazi camp with a crematorium in Italy. Now a national monument.',
    visit: 'Free entry, an hour, and not something you shake off quickly. The counterweight to the region\u2019s café-and-sailing image.',
    link: 'https://www.risierasansabba.it/'
  }
];

/* ------------------------------------------------------------------ */
/* E. Rebuilt from rubble — the 1976 earthquake                        */
/* ------------------------------------------------------------------ */

export interface QuakeTown {
  name: string;
  image: string;
  imageAlt: string;
  then: string;
  now: string;
}

export const quakeTowns: QuakeTown[] = [
  {
    name: 'Venzone',
    image: img('quake-venzone'),
    imageAlt: 'The rebuilt medieval walls and cathedral of Venzone',
    then: 'The 14th-century duomo collapsed twice in 1976. Every fallen stone was numbered, catalogued and stored in the fields.',
    now: 'Rebuilt stone by stone in its original position — anastylosis, the same method used on Greek temples. Venzone is now a national monument and regularly voted one of Italy\u2019s most beautiful villages.'
  },
  {
    name: 'Gemona del Friuli',
    image: img('quake-gemona'),
    imageAlt: 'The rebuilt cathedral of Gemona del Friuli',
    then: 'The epicentral town: some 400 dead in a single minute, and the medieval centre reduced to a slope of rubble.',
    now: 'Reconstructed "com\u2019era, dov\u2019era" — as it was, where it was — and today a working town of 10,000 with a hospital, a rail link and Udine half an hour away.'
  }
];

export interface QuakeFact {
  value: string;
  label: string;
  note: string;
}

export const quakeFacts: QuakeFact[] = [
  { value: '6.5', label: 'Magnitude, 6 May 1976', note: 'Two shocks: May, then a second, in some ways crueller, in September.' },
  { value: '990', label: 'Lives lost', note: 'Across 137 municipalities, most of them in the space of 55 seconds.' },
  { value: '100k', label: 'People made homeless', note: 'Nearly a fifth of the province, through a winter in prefabs and railway carriages.' },
  { value: '10 yrs', label: 'To rebuild', note: 'A regional, locally-run reconstruction now taught internationally as the model case.' }
];

export const quakeChecklist: { title: string; body: string }[] = [
  {
    title: 'Most of Friuli\u2019s housing stock is newer than it looks',
    body: 'In the quake zone — Gemona, Venzone, Osoppo, Tolmezzo, Buja, Trasaghis and dozens more — buildings that read as medieval were rebuilt or structurally rebuilt between 1977 and 1988 to seismic standards of their day. That is usually good news for a buyer.'
  },
  {
    title: 'Ask what happened to the building in 1976',
    body: 'The useful question to any seller or geometra in the north of the region: was it repaired, rebuilt, or untouched? "Ricostruito post-sisma" with paperwork beats "original" here.'
  },
  {
    title: 'Check the seismic classification',
    body: 'The Alpine north and the Tarcento–Gemona belt sit in zone 1 and 2, Italy\u2019s highest categories; Trieste and the coast are in the mildest zone 3–4. Classification affects both renovation rules and insurance.'
  },
  {
    title: 'Sismabonus still applies',
    body: 'Italian tax deductions for seismic upgrading apply to older properties and are worth pricing into any renovation quote in the north — ask your geometra before, not after, the work is designed.'
  }
];

/* ------------------------------------------------------------------ */
/* F. A year in Friuli                                                 */
/* ------------------------------------------------------------------ */

export interface YearEvent {
  month: string;
  short: string;
  name: string;
  place: string;
  what: string;
  season: 'winter' | 'spring' | 'summer' | 'autumn';
  link?: string;
  image?: string;
  imageAlt?: string;
}

export const yearEvents: YearEvent[] = [
  {
    month: 'January',
    short: 'Jan',
    name: 'Pignarûl — Epiphany bonfires',
    place: 'Across the Friulian plain; the biggest at Tarcento',
    what: 'On 5 January every village burns a bonfire and reads the smoke: drifting east means a good year, west means a poor one. Pre-Christian, entirely serious, and followed by mulled wine.',
    season: 'winter',
    link: 'https://www.turismofvg.it/en'
  },
  {
    month: 'February',
    short: 'Feb',
    name: 'Carnevale di Muggia',
    place: 'Muggia, on the bay south of Trieste',
    what: 'The region\u2019s great carnival: seven competing companies, months of secret float-building, and a small Venetian harbour town that loses its mind for a week.',
    season: 'winter',
    link: 'https://www.carnevaldemuja.com'
  },
  {
    month: 'March',
    short: 'Mar',
    name: 'Castle gardens open at Duino',
    place: 'Duino, on the Karst cliffs',
    what: 'The Rilke season: the castle and its terraces reopen, the cliff path above the Gulf is at its best, and the coast is briefly yours alone.',
    season: 'spring',
    link: 'https://www.castellodiduino.it/en/'
  },
  {
    month: 'April',
    short: 'Apr',
    name: 'Osmize season peaks',
    place: 'The Karst villages above Trieste',
    what: 'A leafy branch hung at a junction means a farmhouse is open to sell its own wine and ham for a few weeks. No sign, no menu, no card machine.',
    season: 'spring',
    link: 'https://www.parovel.com/index.php/en/terroir/the-osmiza-tradition'
  },
  {
    month: 'May',
    short: 'May',
    name: 'Cantine Aperte in the Collio',
    place: 'Collio, Colli Orientali and the Carso',
    what: 'The last Sunday in May: producers throw open the cellars. The best single day of the year to work out which Friulano you actually like.',
    season: 'spring',
    link: 'https://www.movimentoturismovino.it/en/'
  },
  {
    month: 'June',
    short: 'Jun',
    name: 'Aria di Festa',
    place: 'San Daniele del Friuli',
    what: 'Four days when the prosciutto cellars open to the public and a hill town of 8,000 becomes the centre of Italian charcuterie.',
    season: 'summer',
    link: 'https://www.prosciuttosandaniele.it/en/'
  },
  {
    month: 'July',
    short: 'Jul',
    name: 'Perdòn di Barbana',
    place: 'Grado lagoon',
    what: 'The first Sunday in July: a procession of decorated boats carries a Madonna across the lagoon to the island sanctuary of Barbana. Unbroken since 1237.',
    season: 'summer',
    link: 'https://www.santuariobarbana.it/',
    image: img('year-barbana'),
    imageAlt: 'The island sanctuary of Barbana in the Grado lagoon'
  },
  {
    month: 'July',
    short: 'Jul',
    name: 'Mittelfest',
    place: 'Cividale del Friuli',
    what: 'Theatre, music and dance from central Europe in a UNESCO Lombard town — the festival that best expresses what "Mitteleuropa" means here.',
    season: 'summer',
    link: 'https://www.mittelfest.org/'
  },
  {
    month: 'September',
    short: 'Sep',
    name: 'Friuli DOC',
    place: 'Udine, city centre',
    what: 'Four days when the whole regional larder sets up in the squares of Udine: frico, cjarsons, San Daniele, and every wine zone pouring at once.',
    season: 'autumn',
    link: 'https://www.friuli-doc.it/'
  },
  {
    month: 'October',
    short: 'Oct',
    name: 'Barcolana',
    place: 'Gulf of Trieste',
    what: 'The second Sunday in October: over 2,000 boats on one start line, the largest sailing regatta in the world, and a city that stops to watch from the shore.',
    season: 'autumn',
    link: 'https://www.barcolana.it/en',
    image: img('afloat-barcolana'),
    imageAlt: 'A vast fleet of sails on the Gulf of Trieste during the Barcolana regatta'
  },
  {
    month: 'November',
    short: 'Nov',
    name: 'San Martino and the new wine',
    place: 'Wine villages everywhere; chestnut fairs in Carnia',
    what: '11 November: the vino novello is broached, roast chestnuts appear on every corner, and the osmize refill for the cold months.',
    season: 'autumn',
    link: 'https://www.turismofvg.it/en'
  },
  {
    month: 'December',
    short: 'Dec',
    name: 'San Nicolò and the Christmas markets',
    place: 'Trieste, Gorizia, Tarvisio, Sappada',
    what: 'This is where the region is most obviously Austrian: 6 December belongs to Saint Nicholas, not Santa, and the markets smell of Glühwein rather than panettone.',
    season: 'winter',
    link: 'https://www.turismofvg.it/en'
  }
];
