import { Mountain, Grape, Trees } from 'lucide-react';

import soulTrentino from '@/assets/trentino/soul-trentino.jpg';
import soulSudtirol from '@/assets/trentino/soul-sudtirol.jpg';
import soulLadin from '@/assets/trentino/soul-ladin.jpg';

export interface TrentinoBand {
  id: string;
  name: string;
  subtitle: string;
  language: string;
  icon: typeof Mountain;
  image: string;
  imageAlt: string;
  caption: string;
  reality: string;
  towns: string[];
  meters: { label: string; value: number; note: string }[];
  good: string[];
  hard: string[];
}

export const bands: TrentinoBand[] = [
  {
    id: 'trentino',
    name: 'Trentino',
    subtitle: 'Italian-speaking south',
    language: 'Italian first, German rare',
    icon: Grape,
    image: soulTrentino,
    imageAlt: 'The Adige valley near Trento with terraced vineyards, apple orchards and a bell tower under evening light',
    caption:
      'Trento, Rovereto, the Adige valley and the lakes. Italy with alpine discipline: the paperwork is in Italian, the roads still get plowed, and the wine is very good.',
    reality:
      'This is the half of the region that feels recognisably Italian. Trento is a university city of about 120,000 with a real centre, a hospital that works, and trains that leave on time. Costs sit above the national average but well below Bolzano. If you want mountains without learning German, this is the answer.',
    towns: ['Trento', 'Rovereto', 'Arco', 'Riva del Garda', 'Levico Terme', 'Cavalese', 'Mezzocorona'],
    meters: [
      { label: 'Cost of living', value: 68, note: 'Above Italian average, below Südtirol' },
      { label: 'Healthcare access', value: 82, note: 'Trento hospital + strong provincial network' },
      { label: 'German needed', value: 12, note: 'Almost none in daily life' },
      { label: 'Winter severity', value: 45, note: 'Valley floors are mild; snow is up the side valleys' },
      { label: 'Quiet', value: 55, note: 'Busy valley, calm hills' },
    ],
    good: ['Italian-language bureaucracy', 'Cheapest of the three', 'Lake Garda in under an hour', 'Verona airport 1h'],
    hard: ['Valley traffic and inversion fog', 'Housing in Trento is tight', 'Summer tourism on the lakes'],
  },
  {
    id: 'sudtirol',
    name: 'Südtirol',
    subtitle: 'German-speaking north',
    language: 'German first, Italian second',
    icon: Mountain,
    image: soulSudtirol,
    imageAlt: 'A South Tyrolean village with painted farmhouses, wooden balconies and an onion-dome church below Dolomite peaks',
    caption:
      'Bolzano, Merano, the Val Venosta and the Isarco. The richest province in Italy — and the one where being a foreigner is most obviously an administrative choice.',
    reality:
      'Roughly seven in ten residents speak German as a first language. Public jobs require certified bilingualism, schools are split by language, and everything from the bus timetable to your tax notice arrives in two columns. Services are the best in Italy. So are the prices — Bolzano is routinely Italy\'s most expensive city to live in.',
    towns: ['Bolzano (Bozen)', 'Merano (Meran)', 'Bressanone (Brixen)', 'Brunico (Bruneck)', 'Vipiteno (Sterzing)', 'Appiano'],
    meters: [
      { label: 'Cost of living', value: 92, note: "Bolzano is Italy's priciest city" },
      { label: 'Healthcare access', value: 95, note: 'Shortest waiting lists in Italy' },
      { label: 'German needed', value: 85, note: 'You will not blend in without it' },
      { label: 'Winter severity', value: 60, note: 'Cold, dry, sunny; real snow above 800m' },
      { label: 'Quiet', value: 45, note: 'Orderly, not sleepy' },
    ],
    good: ['Services that actually work', 'Bilingual signage everywhere', 'Innsbruck and Munich by train', 'Highest incomes in Italy'],
    hard: ['Housing rules favour residents (see below)', 'Social circles close early', 'Prices near Austrian levels'],
  },
  {
    id: 'ladin',
    name: 'The Ladin valleys',
    subtitle: 'Third language, oldest culture',
    language: 'Ladin, plus German and Italian',
    icon: Trees,
    image: soulLadin,
    imageAlt: 'A Ladin valley in the Dolomites with wooden farmsteads on green meadows below pale limestone peaks at sunset',
    caption:
      'Val Gardena, Val Badia, Fassa. Around 30,000 people speaking a Rhaeto-Romance language older than either Italian or German, in the most photographed mountains on earth.',
    reality:
      'Ladin is an official language here: schools teach in three, road signs carry three names, and the provincial administration answers in all of them. Life is beautiful and expensive and seasonal. Winter brings the ski economy; November and May bring near-silence. Nearest full hospital can be 45–70 minutes of mountain road away.',
    towns: ['Ortisei (St. Ulrich)', 'Corvara', 'Canazei', 'San Martino in Badia', 'Selva di Val Gardena'],
    meters: [
      { label: 'Cost of living', value: 88, note: 'Resort pricing, thin rental market' },
      { label: 'Healthcare access', value: 55, note: 'Clinics local, hospitals down-valley' },
      { label: 'German needed', value: 70, note: 'Plus Ladin to be truly inside' },
      { label: 'Winter severity', value: 88, note: 'Long, snowy, genuinely alpine' },
      { label: 'Quiet', value: 75, note: 'Silent shoulder seasons, packed peak weeks' },
    ],
    good: ['UNESCO Dolomites at the door', 'Trilingual schools', 'Tight, intact community', 'Superb winter infrastructure'],
    hard: ['Almost no property comes to market', 'Two dead seasons a year', 'Winter driving is a skill'],
  },
];

export interface HousingTown {
  town: string;
  province: 'Südtirol' | 'Trentino';
  constraint: 'strict' | 'moderate' | 'open';
  headline: string;
  detail: string;
}

// Alto Adige/Südtirol restricts new "conventioned" housing to residents and caps
// second homes; most municipalities are legally closed to new holiday homes.
export const housingTowns: HousingTown[] = [
  {
    town: 'Bolzano (Bozen)',
    province: 'Südtirol',
    constraint: 'strict',
    headline: 'Closed to new second homes',
    detail:
      'Bolzano is over the provincial second-home threshold, so new holiday-home use is not permitted. Buying is realistic only if you take residency and live there. Prices are the highest in Italy.',
  },
  {
    town: 'Merano (Meran)',
    province: 'Südtirol',
    constraint: 'strict',
    headline: 'Residency-linked purchase',
    detail:
      'A large share of the housing stock is "conventioned" — reserved for people resident or working in the province for the required period. Free-market stock exists but is small and priced accordingly.',
  },
  {
    town: 'Bressanone (Brixen)',
    province: 'Südtirol',
    constraint: 'strict',
    headline: 'Conventioned stock dominates',
    detail:
      'New builds are largely bound to residents. Older free-market apartments in the historic centre are the usual route in for incomers, with long search times.',
  },
  {
    town: 'Ortisei (St. Ulrich)',
    province: 'Südtirol',
    constraint: 'strict',
    headline: 'Effectively no new holiday homes',
    detail:
      'Ladin resort municipalities are the tightest market in the region. Turnover is mostly inheritance and inter-family transfer. Renting long term is often the only realistic option.',
  },
  {
    town: 'Vipiteno (Sterzing)',
    province: 'Südtirol',
    constraint: 'moderate',
    headline: 'Possible with residency',
    detail:
      'Smaller northern towns still have free-market stock, but the same conventioned-housing framework applies to anything new. Take residency and the picture changes completely.',
  },
  {
    town: 'Brunico (Bruneck)',
    province: 'Südtirol',
    constraint: 'moderate',
    headline: 'Tight but not closed',
    detail:
      'Pusteria valley demand is high and locally driven. Expect competition from resident buyers who qualify for subsidised conventioned housing you cannot access.',
  },
  {
    town: 'Trento',
    province: 'Trentino',
    constraint: 'open',
    headline: 'Normal Italian rules',
    detail:
      'Trentino does not run the Südtirol second-home regime. Anyone can buy; the constraint is supply and price in a university city, not eligibility.',
  },
  {
    town: 'Rovereto',
    province: 'Trentino',
    constraint: 'open',
    headline: 'Open market, softer prices',
    detail:
      'The most accessible mid-size town in the region for a foreign buyer. Good stock of period apartments, hospital in town, motorway and rail on the doorstep.',
  },
  {
    town: 'Arco / Riva del Garda',
    province: 'Trentino',
    constraint: 'moderate',
    headline: 'Open, but holiday demand is fierce',
    detail:
      'No eligibility restriction, but you are bidding against northern-European second-home buyers. Some municipalities apply tourism-use limits on new builds.',
  },
  {
    town: 'Levico Terme',
    province: 'Trentino',
    constraint: 'open',
    headline: 'Quietly buyable',
    detail:
      'Spa town in Valsugana with a real year-round population, open market, and prices well under the Bolzano orbit.',
  },
  {
    town: 'Cavalese',
    province: 'Trentino',
    constraint: 'moderate',
    headline: 'Open with ski-season pricing',
    detail:
      'Val di Fiemme is Trentino, so no residency test — but resort demand keeps the market thin and seasonal.',
  },
  {
    town: 'Mezzocorona',
    province: 'Trentino',
    constraint: 'open',
    headline: 'Best value in the region',
    detail:
      'Wine-country village on the Trento rail line. Open market, working population, and the cheapest entry point of any town on this page.',
  },
];

export interface AltitudeBand {
  id: string;
  label: string;
  range: string;
  metres: number;
  towns: string[];
  winterDays: number;
  snowDays: number;
  sunHours: string;
  heating: string;
  driving: string;
  hospital: string;
  verdict: string;
}

export const altitudeBands: AltitudeBand[] = [
  {
    id: 'floor',
    label: 'Valley floor',
    range: '190–350 m',
    metres: 270,
    towns: ['Bolzano', 'Trento', 'Merano', 'Rovereto', 'Riva del Garda'],
    winterDays: 95,
    snowDays: 8,
    sunHours: '~2,000 h/yr, but winter inversion fog on the Adige',
    heating: '€900–1,400 a year for a well-insulated flat',
    driving: 'Snow tyres by law Nov–Apr; roads clear within hours',
    hospital: '5–15 minutes to a full hospital',
    verdict:
      'Mediterranean-ish summers, hot in Bolzano (35°C+ is normal in July), soft winters. This is where the palms and the vineyards are, and where nearly everyone actually lives.',
  },
  {
    id: 'mid',
    label: 'Mid-slope terraces',
    range: '500–900 m',
    metres: 700,
    towns: ['Appiano', 'Renon / Ritten', 'Bressanone', 'Cavalese', 'Levico Terme'],
    winterDays: 130,
    snowDays: 30,
    sunHours: 'Above the fog line — the sunniest place to live in the region',
    heating: '€1,300–2,000 a year',
    driving: 'Steep access roads; a winter-capable car stops being optional',
    hospital: '20–35 minutes down-valley',
    verdict:
      'The locals\' secret. You sit above the winter inversion, so you get sunshine while the valley is grey, and you get 5–8°C off the summer heat. The trade is the drive and the price.',
  },
  {
    id: 'alpine',
    label: 'Alpine shelf',
    range: '1,200–1,600 m',
    metres: 1400,
    towns: ['Ortisei', 'Corvara', 'Canazei', 'Sesto / Sexten', 'Madonna di Campiglio'],
    winterDays: 175,
    snowDays: 75,
    sunHours: 'Brilliant, but the sun drops behind the peaks by mid-afternoon in December',
    heating: '€2,200–3,500 a year, plus what you pay to keep the roof clear',
    driving: 'Chains, passes that close, 45+ minutes to anything administrative',
    hospital: '45–70 minutes, longer in weather',
    verdict:
      'Spectacular and demanding. Beautiful for an active 60-year-old; a serious question at 80. Everyone who lives up here has a plan for how they get down when they stop driving.',
  },
];

export const autonomyFacts = [
  {
    stat: '~90%',
    label: 'of taxes stay local',
    body:
      'Under the Statute of Autonomy, Trento and Bolzano retain roughly nine tenths of the tax revenue raised on their territory. Most Italian regions retain a fraction of that.',
  },
  {
    stat: '2 provinces',
    label: 'not one region',
    body:
      'Almost every power that matters — health, schools, housing, transport, planning — sits with the autonomous provinces, not with the region. Rules genuinely differ between Trento and Bolzano.',
  },
  {
    stat: '3 languages',
    label: 'officially recognised',
    body:
      'Italian, German and Ladin. Public administration must answer in your language; public jobs require a certified bilingual (or trilingual) qualification.',
  },
  {
    stat: 'Top of Italy',
    label: 'on almost every index',
    body:
      'Highest GDP per head, highest employment, shortest healthcare waiting lists, best-rated public transport. This is what the money buys.',
  },
];

export const autonomyEffects = [
  { title: 'Healthcare that answers', body: 'Shortest waiting lists in the country and a provincial fund that tops up the national system. Specialist appointments in weeks, not seasons.' },
  { title: 'Roads and rails maintained', body: 'Mountain roads are cleared before dawn. Rural bus lines survive because the province pays for them, not because they are profitable.' },
  { title: 'Buses that turn up', body: 'Integrated ticketing across bus, train and even cable cars. Timetables that hold in February.' },
  { title: 'Bilingual bureaucracy', body: 'Every form, notice and hearing in your official language. It works — and it is also why public jobs are effectively closed without certification.' },
];

export const autonomyCatch = [
  'Cost of living is the highest in Italy; Bolzano regularly tops the national table.',
  'Housing is scarce and, in Südtirol, legally reserved for residents in large part.',
  'Social circles are old, small and language-bound. Integration is slow and real.',
  'Wages and prices are Austrian; an Italian pension does not stretch the way it does further south.',
];

export const appleYear = [
  { month: 'Apr', title: 'Blossom', body: 'Val di Non turns white for ten days. Frost nights are fought with sprinklers that coat the buds in protective ice.' },
  { month: 'Jun', title: 'Thinning', body: 'Fruit is thinned by hand so the remaining apples size up. Whole families still turn out for it.' },
  { month: 'Aug', title: 'First varieties', body: 'Gala comes off first. The valley roads fill with tractors and crate trailers.' },
  { month: 'Sep', title: 'Peak harvest', body: 'Golden Delicious, the valley\'s signature. Pickers arrive from across Europe; every spare bed is rented.' },
  { month: 'Oct', title: 'Late fruit & Törggelen', body: 'Fuji and Braeburn come in as the new wine opens in Südtirol. Chestnuts, speck, cloudy Nosiola.' },
  { month: 'Jan', title: 'Pruning', body: 'Bare rows, frozen ground, and the quiet mechanical work that decides next year\'s crop.' },
];

export const masoFacts = [
  {
    title: 'The maso chiuso',
    body:
      'A closed mountain farm cannot be split between heirs. One child inherits the whole farm and compensates the others. The law dates to the Middle Ages, was preserved through Austrian rule, and is still on the books in Südtirol today.',
  },
  {
    title: 'Why the landscape looks like this',
    body:
      'Because farms were never subdivided, the valleys kept viable holdings instead of dissolving into unworkable strips. That is why you see intact farmsteads on impossible slopes rather than abandonment.',
  },
  {
    title: 'What it means if you are buying',
    body:
      'A maso chiuso comes with obligations and provincial consent requirements. Charming farmhouse listings are often bound properties — always establish the status before you fall in love with one.',
  },
];

export const mobilityLegs = [
  { to: 'Innsbruck (AT)', from: 'Bolzano', mode: 'Rail via Brenner', time: '2h 00', note: 'Direct regional and EC trains over the pass' },
  { to: 'Verona', from: 'Trento', mode: 'Rail', time: '1h 00', note: 'Gateway to the whole Italian network' },
  { to: 'Munich (DE)', from: 'Bolzano', mode: 'Rail / bus', time: '4h 00', note: 'Direct EC and Flixbus; airport hub' },
  { to: 'Milan', from: 'Trento', mode: 'Rail via Verona', time: '3h 15', note: 'Change at Verona Porta Nuova' },
  { to: 'Venice', from: 'Trento', mode: 'Rail via Verona', time: '3h 00', note: 'Marco Polo airport for long-haul' },
  { to: 'Rome', from: 'Trento', mode: 'Rail via Verona', time: '4h 30', note: 'One change, Frecciarossa onward' },
];

export const mobilityAirports = [
  { name: 'Verona Villafranca (VRN)', drive: '1h 10 from Trento', note: 'Closest full airport; European network' },
  { name: 'Innsbruck (INN)', drive: '1h 45 from Bolzano', note: 'Over the Brenner; strong winter routes' },
  { name: 'Venice Marco Polo (VCE)', drive: '2h 30 from Trento', note: 'Intercontinental connections' },
  { name: 'Munich (MUC)', drive: '4h 00 from Bolzano', note: 'The region\'s real long-haul hub' },
  { name: 'Bolzano Dolomiti (BZO)', drive: 'In Bolzano', note: 'Small; seasonal links to Rome and northern Europe' },
];

export const cableCarLines = [
  { name: 'Renon / Ritten', detail: 'Bolzano to a 1,200 m plateau in 12 minutes, then a narrow-gauge tram. People commute on it daily.' },
  { name: 'Mendola / Mendel', detail: 'One of the steepest funiculars in Europe, running since 1903, linking the Adige valley to the Mendola pass.' },
  { name: 'San Genesio / Jenesien', detail: 'A cable car as a village bus route — the fastest way in or out for the whole community.' },
  { name: 'Trento–Sardagna', detail: 'Three minutes from the city centre to a hillside village 300 m above it.' },
];

export const seasonPhases = [
  {
    id: 'winter',
    name: 'Ski season',
    months: 'Dec – Mar',
    tone: 'Peak',
    body: 'Dolomiti Superski runs at full tilt. Resort valleys are full, prices peak, and roads to the passes queue on Saturdays. Valley cities carry on almost normally.',
    living: 'Book anything early. Avoid resort-valley errands on weekends.',
    image: 'season-ski',
    imageAlt: 'Skiers on wide Dolomiti Superski slopes with dramatic pale limestone peaks under a clear blue winter sky',
  },
  {
    id: 'mud',
    name: 'The quiet weeks',
    months: 'Apr – mid Jun',
    tone: 'Dead',
    body: 'Lifts close, hotels shut for maintenance, and some mountain restaurants simply lock the door. The valleys bloom and empty at the same time.',
    living: 'Cheapest time to visit, worst time to need a mountain service.',
    image: 'season-quiet',
    imageAlt: 'Spring apple blossom in Val di Non with an empty valley road and snow-capped Dolomites in the distance',
  },
  {
    id: 'summer',
    name: 'Hiking & lakes',
    months: 'Late Jun – Aug',
    tone: 'Busy',
    body: 'German and Austrian visitors fill the high valleys; Garda fills with everyone else. Bolzano gets genuinely hot — 35°C in the valley is normal.',
    living: 'Head uphill. 700 m of altitude is worth several degrees.',
    image: 'season-lakes',
    imageAlt: 'Hikers beside a turquoise alpine lake reflecting pine forests and jagged Dolomite peaks on a bright summer day',
  },
  {
    id: 'autumn',
    name: 'Törggelen',
    months: 'Sep – Nov',
    tone: 'Best',
    body: 'Harvest, new wine, chestnuts, and farm taverns opening for the season. The apples come in, the light goes gold, and the crowds go home.',
    living: 'The locals\' favourite season, and the one to plan a scouting trip around.',
    image: 'season-torggelen',
    imageAlt: 'A rustic farm tavern table with chestnuts, speck and new wine overlooking golden autumn vineyards',
  },
  {
    id: 'markets',
    name: 'Christmas markets',
    months: 'Late Nov – 6 Jan',
    tone: 'Peak',
    body: 'Bolzano, Merano, Bressanone, Brunico and Vipiteno run the five original South Tyrolean markets. Day-trip coaches arrive by the hundred.',
    living: 'Beautiful, and a month of not being able to park in your own town centre.',
    image: 'christmas-market',
    imageAlt: 'A South Tyrolean Christmas market at dusk with lit wooden stalls, snow and a church tower',
  },
];
