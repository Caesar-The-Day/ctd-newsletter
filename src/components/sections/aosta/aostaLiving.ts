// Valle d'Aosta healthcare, cost and pros/cons content. Figures are editorial estimates (2026).
export const careFacilities = [
  { name: 'Ospedale Umberto Parini', place: 'Aosta', kind: 'Main hospital', note: 'The region\'s only full hospital: 24-hour emergency room, surgery, cardiology, oncology and intensive care.' },
  { name: 'Presidio Beauregard', place: 'Aosta', kind: 'Hospital site', note: 'Maternity, paediatrics and some outpatient specialties, a few minutes from the Parini.' },
  { name: 'Poliambulatorio di Morgex', place: 'Morgex', kind: 'Outpatient clinic', note: 'Blood tests, specialist visits and nursing for the upper valley, from Courmayeur to La Thuile.' },
  { name: 'Poliambulatorio di Châtillon', place: 'Châtillon', kind: 'Outpatient clinic', note: 'Central-valley clinic serving Saint-Vincent, Valtournenche and Cervinia.' },
  { name: 'Poliambulatorio di Donnas', place: 'Donnas', kind: 'Outpatient clinic', note: 'Lower valley and the Gressoney and Champorcher side valleys. Ivrea hospital (Piemonte) is close by.' },
  { name: 'Summer tourist medical posts', place: 'Resorts', kind: 'Seasonal', note: 'Courmayeur, Cervinia, Cogne and others open walk-in doctors in the high season. Don\'t rely on them the rest of the year.' },
];

export const careSteps = [
  { t: 'Get residency', d: 'Register at your Comune (anagrafe). Healthcare enrolment follows residency.' },
  { t: 'Enrol with the USL', d: 'At the Azienda USL Valle d\'Aosta desk, bring your permit, tax code and residency. ERV holders pay the voluntary yearly fee.' },
  { t: 'Pick a family doctor', d: 'Choose a medico di base from the list. In side valleys there may be only one, and some work part-week.' },
  { t: 'Book through CUP', d: 'Specialist visits and tests are booked through the regional CUP phone line or online with your doctor\'s prescription.' },
];

export type CareTown = { id: string; name: string; hospital: number; clinic: string; clinicMin: number; winter: string };
export const careTowns: CareTown[] = [
  { id: 'aosta', name: 'Aosta', hospital: 5, clinic: 'Aosta', clinicMin: 5, winter: 'No winter issue. You are next to the hospital.' },
  { id: 'sarre', name: 'Sarre / Gressan', hospital: 12, clinic: 'Aosta', clinicMin: 12, winter: 'Valley floor roads are cleared quickly.' },
  { id: 'saint-vincent', name: 'Saint-Vincent', hospital: 25, clinic: 'Châtillon', clinicMin: 5, winter: 'Motorway access makes this one of the safest bets.' },
  { id: 'morgex', name: 'Morgex', hospital: 30, clinic: 'Morgex', clinicMin: 2, winter: 'Fine on the main road. Fog and ice in the narrows near Arvier.' },
  { id: 'courmayeur', name: 'Courmayeur', hospital: 40, clinic: 'Morgex', clinicMin: 10, winter: 'Usually open, but heavy-snow days slow everything down.' },
  { id: 'pont-saint-martin', name: 'Pont-Saint-Martin', hospital: 45, clinic: 'Donnas', clinicMin: 5, winter: 'Mild for the region. Ivrea hospital is about 25 minutes away.' },
  { id: 'cogne', name: 'Cogne', hospital: 35, clinic: 'Aosta', clinicMin: 35, winter: 'One road in and out. Avalanche closures happen a few days in a big winter.' },
  { id: 'gressoney', name: 'Gressoney-Saint-Jean', hospital: 65, clinic: 'Donnas', clinicMin: 35, winter: 'A long dead-end valley. In practice the helicopter is your emergency plan.' },
];

export type Tier = 'modest' | 'comfortable' | 'premium';
export type CostTown = {
  id: string; name: string; altitude: number;
  rent: Record<Tier, number>; buyPerSqm: number; heatingWinter: number; note: string;
};
export const costTowns: CostTown[] = [
  { id: 'aosta', name: 'Aosta', altitude: 583, rent: { modest: 650, comfortable: 900, premium: 1400 }, buyPerSqm: 2300, heatingWinter: 220, note: 'The only place you can live without a car. Everything is in walking distance.' },
  { id: 'sarre', name: 'Sarre / Gressan', altitude: 650, rent: { modest: 600, comfortable: 850, premium: 1300 }, buyPerSqm: 2100, heatingWinter: 240, note: 'Sunny-side suburbs ten minutes from Aosta, with more space for the money.' },
  { id: 'saint-vincent', name: 'Saint-Vincent', altitude: 575, rent: { modest: 550, comfortable: 800, premium: 1200 }, buyPerSqm: 1900, heatingWinter: 200, note: 'A mild spa town with a train station, and a good price for what you get.' },
  { id: 'pont-saint-martin', name: 'Pont-Saint-Martin', altitude: 345, rent: { modest: 500, comfortable: 700, premium: 1000 }, buyPerSqm: 1500, heatingWinter: 170, note: 'The cheapest and mildest corner, with Piemonte prices and services next door.' },
  { id: 'morgex', name: 'Morgex', altitude: 1002, rent: { modest: 600, comfortable: 850, premium: 1300 }, buyPerSqm: 2600, heatingWinter: 280, note: 'An upper-valley village with Courmayeur 10 minutes away, at a fraction of its prices.' },
  { id: 'cogne', name: 'Cogne', altitude: 1534, rent: { modest: 700, comfortable: 1000, premium: 1600 }, buyPerSqm: 3800, heatingWinter: 330, note: 'A beautiful national-park village, but with long, cold winters and big heating bills.' },
  { id: 'courmayeur', name: 'Courmayeur', altitude: 1224, rent: { modest: 1100, comfortable: 1700, premium: 2800 }, buyPerSqm: 8500, heatingWinter: 320, note: 'Milan prices or higher. Long-term rentals are scarce because owners prefer ski-week lets.' },
];

export const tierSpend: Record<Tier, { groceries: number; dining: number; utilities: number; leisure: number }> = {
  modest: { groceries: 380, dining: 150, utilities: 140, leisure: 100 },
  comfortable: { groceries: 480, dining: 320, utilities: 170, leisure: 250 },
  premium: { groceries: 650, dining: 600, utilities: 220, leisure: 550 },
};

export const carMonthly = 260; // insurance, fuel, winter tyres, servicing, occasional A5 tolls
export const healthMonthly = Math.round(2000 / 12); // ERV voluntary SSN minimum

export const prosConsGroups = [
  { theme: 'Daily life', pros: ['Some of the cleanest air and tap water in Europe.', 'Very low crime, and small towns where people know each other.', 'Aosta is walkable, with Roman streets, markets and cafés.'], cons: ['Outside Aosta a car is not optional.', 'Side valleys go very quiet in May and November, when many shops and restaurants close.', 'Local social life can be reserved. It takes time to be invited in.'] },
  { theme: 'Money', pros: ['The central and lower valley costs less than its reputation suggests.', 'Regional schemes and fuel discounts help residents.', 'Well-run public services for the taxes you pay.'], cons: ['Heating a stone house costs €200–330 a month in winter.', 'Resort-town property costs as much as Milan.', 'Groceries cost a little more, because much of the food comes up from the plains.'] },
  { theme: 'Healthcare', pros: ['A good regional health service with short waits by Italian standards.', 'Helicopter rescue covers the whole region, day and night.', 'One well-equipped main hospital, simple to navigate.'], cons: ['There is only one full hospital. Complex cases go to Turin.', 'Side-valley family doctors can be part-time or have full patient lists.', 'Snow can turn a 40-minute drive into 90 minutes.'] },
  { theme: 'Getting around', pros: ['Geneva, Chamonix and Turin are all about 1–1.5 hours away.', 'The A5 motorway is excellent and well maintained.', 'There are great walking and skiing routes from your door.'], cons: ['The train line is slow, and it gets closed for long upgrade works.', 'Aosta\'s small airport has no regular airline flights. You fly from Turin, Milan or Geneva.', 'Tunnel and pass closures sometimes cut you off from France and Switzerland.'] },
  { theme: 'Culture & language', pros: ['Italian and French are both official, which is a gift if you speak some French.', 'Real traditions such as Sant\'Orso, the Bataille des Reines and alpage summers.', 'Fontina, alpine wines and mountain food.'], cons: ['Paperwork and schools can involve both languages.', 'Fewer cultural events than in a big city: no opera, and few international films.', 'Tourist weeks bring crowds and traffic to the resorts.'] },
];

export const fitFactors = [
  { id: 'nature', label: 'Outdoors & mountains', score: 10 },
  { id: 'cost', label: 'Low cost of living', score: 5 },
  { id: 'health', label: 'Hospital close by', score: 6 },
  { id: 'carfree', label: 'Living without a car', score: 3 },
  { id: 'social', label: 'Easy social life', score: 5 },
  { id: 'travel', label: 'Easy international travel', score: 7 },
  { id: 'climate', label: 'Mild winters', score: 2 },
  { id: 'safety', label: 'Safety & quiet', score: 10 },
];

export const suitsYou = ['You hike, ski or cycle, and want that in your daily life.', 'You\'re comfortable driving in snow, or will live in Aosta.', 'You enjoy a slower pace with seasons that set the rhythm.', 'You speak, or want to learn, a little French.'];
export const notForYou = ['You need sunshine all winter to feel good.', 'You want big-city culture on your doorstep.', 'You have a chronic condition that needs frequent specialist care in Turin.', 'You plan to stop driving in the next few years and want a side-valley village.'];
