// Valle d'Aosta signature module content. Figures marked as estimates are editorial approximations.

export interface SunTown { name: string; side: 'adret' | 'envers' | 'valley'; altitude: number; decSunHours: number; sunlessDays: number; note: string }
export const sunTowns: SunTown[] = [
  { name: 'Aosta', side: 'valley', altitude: 583, decSunHours: 4.5, sunlessDays: 0, note: 'Valley floor, wide open to the south. Fog some mornings, but the sun reaches the old town all winter.' },
  { name: 'Saint-Pierre', side: 'adret', altitude: 676, decSunHours: 6, sunlessDays: 0, note: 'Classic sunny-side village. Vineyards grow here for a reason.' },
  { name: 'Quart', side: 'adret', altitude: 535, decSunHours: 5.5, sunlessDays: 0, note: 'South-facing slope east of Aosta, ten minutes from the hospital. Among the best winter light in the valley.' },
  { name: 'Chambave', side: 'adret', altitude: 486, decSunHours: 5.5, sunlessDays: 0, note: 'Muscat vineyards, mild for the altitude, on the rail line.' },
  { name: 'Aymavilles', side: 'envers', altitude: 646, decSunHours: 3, sunlessDays: 0, note: 'Shaded side, but the valley is wide here, so you still get a few hours of sun.' },
  { name: 'Gressan', side: 'envers', altitude: 626, decSunHours: 2.5, sunlessDays: 10, note: 'Popular and close to Aosta, but some hamlets lose direct sun around the solstice.' },
  { name: 'Cogne', side: 'envers', altitude: 1534, decSunHours: 3, sunlessDays: 0, note: 'High, open meadow and bright snow. Cold, but not dark.' },
  { name: 'Champorcher', side: 'envers', altitude: 1427, decSunHours: 1.5, sunlessDays: 30, note: 'Deep side valley. Some hamlets go about a month without direct winter sun.' },
  { name: 'Pontboset', side: 'envers', altitude: 783, decSunHours: 0.5, sunlessDays: 60, note: 'Steep gorge. Beautiful in summer. In December the sun barely clears the ridge.' },
];

export interface AltitudeStop { altitude: number; town: string; snowDays: number; heating: string; roads: string; hospital: string; population: string; verdict: string }
export const altitudeStops: AltitudeStop[] = [
  { altitude: 345, town: 'Pont-Saint-Martin', snowDays: 8, heating: '≈ €1,100 / yr', roads: 'Motorway and train at the door', hospital: '45 min to Aosta, 20 min to Ivrea', population: 'Full town all year', verdict: 'The mildest corner of the region, with almost a Piemonte climate. Easiest choice for a car-light life.' },
  { altitude: 583, town: 'Aosta', snowDays: 15, heating: '≈ €1,400 / yr', roads: 'Rarely closed', hospital: '10 min', population: 'Region capital, ~33,000', verdict: 'Services, the hospital, the train and the Pila gondola. Most retirees should start their search here.' },
  { altitude: 1000, town: 'Saint-Nicolas / Introd', snowDays: 35, heating: '≈ €1,900 / yr', roads: 'Snow chains or winter tyres from Nov 15 to Apr 15', hospital: '20–25 min', population: 'Quiet villages, small shops', verdict: 'A balcony above the valley. Great light, but you will drive for everything.' },
  { altitude: 1224, town: 'Courmayeur', snowDays: 60, heating: '≈ €2,400 / yr', roads: 'Motorway to the Mont Blanc tunnel', hospital: '35–40 min', population: 'Doubles in season, quiet in spring', verdict: 'World-class mountain town with Chamonix through the tunnel. Rents are high in season.' },
  { altitude: 1534, town: 'Cogne', snowDays: 80, heating: '≈ €2,800 / yr', roads: 'One road in, sometimes closed by avalanche risk', hospital: '35 min in good weather', population: '~1,400 residents', verdict: 'Gran Paradiso at your door. Only for people who really love winter and are fine being cut off now and then.' },
  { altitude: 2050, town: 'Breuil-Cervinia', snowDays: 120, heating: '≈ €3,500 / yr', roads: 'Long climb from Châtillon, frequent closures', hospital: '50+ min', population: 'Resort town, emptier off-season', verdict: 'A place for a ski season, not for retirement. Ask yourself what May looks like here.' },
];

export const phrases = [
  { en: 'Hello', it: 'Buongiorno', fr: 'Bonjour', pa: 'Bondzor' },
  { en: 'Thank you', it: 'Grazie', fr: 'Merci', pa: 'Mersì' },
  { en: 'Town hall', it: 'Municipio', fr: 'Maison communale', pa: 'Mézon de la Quemeua' },
  { en: 'Village / hamlet', it: 'Frazione', fr: 'Hameau', pa: 'Velado' },
  { en: 'Cheers', it: 'Salute', fr: 'Santé', pa: 'Santé' },
  { en: 'Goodbye', it: 'Arrivederci', fr: 'Au revoir', pa: 'A la revià' },
];
export const frenchWhere = [
  { place: 'Road & place signs', detail: 'Place names are officially French (Courmayeur, Saint-Vincent). Most signs are bilingual.' },
  { place: 'Schools', detail: 'Italian and French get equal teaching time by law. Kids leave school bilingual.' },
  { place: 'The Comune', detail: 'Paperwork happens in Italian. French is a legal right but rarely used at the counter.' },
  { place: 'Daily life', detail: 'Italian everywhere. Patois (Franco-Provençal) among older locals in side valleys. Walser German in Gressoney and Issime.' },
];

export const autonomy = [
  { title: 'Regional fuel discounts', who: 'Residents with a registered car, when the scheme is active', detail: 'The region has run resident discounts on fuel in some years. Check the current terms with the Regione before counting on them.', link: 'https://www.regione.vda.it' },
  { title: 'Home renovation & energy grants', who: 'Owners who are residents (rules change yearly)', detail: 'Regional calls for energy-efficiency work and for bringing mountain houses back into use. They often add to the national bonuses.', link: 'https://www.regione.vda.it' },
  { title: 'Stronger local services', who: 'Everyone who is a resident', detail: 'The region keeps most of its taxes, which pays for snow clearing, buses into side valleys and mountain rescue. You notice it in winter.', link: 'https://www.regione.vda.it' },
  { title: 'Health top-ups', who: 'SSN-registered residents', detail: 'The regional health service adds some services on top of national ones. Ask the USL in Aosta which ones apply to you.', link: 'https://www.ausl.vda.it' },
];

export const alpageSteps = [
  { month: 'Late May–June', title: 'Inalpe: up the mountain', text: 'Herds walk up to the summer pastures (alpages). Bells everywhere, roads blocked by cows.' },
  { month: 'July–August', title: 'Fontina season', text: 'Cheese is made twice a day from raw milk at the alpage huts. Many sell at the door: bring cash and a cool bag.' },
  { month: 'Late Sept–October', title: 'Désalpe: coming home', text: 'Decorated cows come back down. In Cogne and elsewhere it turns into a village festival.' },
  { month: 'March–October', title: 'Bataille des Reines', text: 'Cows (Valdostana Castana breed) push heads to decide the "queen". No blood, real passion. The final is in October at Croix-Noire, Aosta.' },
];

export const seasonMonths = [
  { m: 'Jan', ski: 3, tag: 'Fiera di Sant\u2019Orso (Jan 30–31): 1,000-year-old craft fair in Aosta' },
  { m: 'Feb', ski: 3, tag: 'Peak ski. Carnival in Pont-Saint-Martin' },
  { m: 'Mar', ski: 3, tag: 'Best snow and long days' },
  { m: 'Apr', ski: 2, tag: 'Season ends after Easter. Winter tyre rule ends Apr 15' },
  { m: 'May', ski: 0, tag: 'Mud season: many resort shops and hotels close' },
  { m: 'Jun', ski: 0, tag: 'Inalpe, high passes start to open' },
  { m: 'Jul', ski: 0, tag: 'Cervinia summer skiing on the glacier. Great St Bernard pass open' },
  { m: 'Aug', ski: 0, tag: 'Busy valleys, Ferragosto crowds' },
  { m: 'Sep', ski: 0, tag: 'Grape harvest on the steep terraces' },
  { m: 'Oct', ski: 0, tag: 'Désalpe, Bataille des Reines final, high passes close' },
  { m: 'Nov', ski: 1, tag: 'Winter tyre rule from Nov 15. Cervinia opens early' },
  { m: 'Dec', ski: 3, tag: 'Resorts open. Shortest sun in the shaded villages' },
];

export const doorstep = [
  { place: 'Turin', via: 'A5 motorway', time: '1h15', toll: '≈ €15', note: 'Turin Caselle airport, specialist hospitals, Italian city life.' },
  { place: 'Chamonix (France)', via: 'Mont Blanc Tunnel', time: '40 min from Courmayeur', toll: '≈ €65 one way', note: 'The tunnel has had planned autumn closures for renovation in recent years. Check before booking.' },
  { place: 'Geneva airport', via: 'Mont Blanc Tunnel', time: '1h45 from Aosta', toll: '≈ €65 + Swiss vignette', note: 'Many Aosta residents fly long-haul from here.' },
  { place: 'Martigny (Switzerland)', via: 'Great St Bernard Tunnel', time: '1h from Aosta', toll: '≈ €35 one way', note: 'Open all year. The pass road above it opens only in summer.' },
  { place: 'Milan', via: 'A5 / A4', time: '2h', toll: '≈ €25', note: 'Malpensa is about 2h. Trains need a change at Ivrea or Chivasso.' },
];

export const hospitalTimes = [
  { from: 'Aosta / Sarre / Quart', mins: 10 },
  { from: 'Saint-Vincent / Châtillon', mins: 25 },
  { from: 'Cogne', mins: 35 },
  { from: 'Courmayeur', mins: 40 },
  { from: 'Pont-Saint-Martin', mins: 45 },
  { from: 'Breuil-Cervinia', mins: 55 },
  { from: 'Gressoney-La-Trinité', mins: 70 },
];
