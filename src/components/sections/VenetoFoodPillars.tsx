import { useState } from 'react';
import { Mountain, Waves, Wheat, MapPin, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Decorative SVG Components ---

const MountainSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 55 L25 15 L35 30 L45 10 L65 55" />
    <path d="M45 10 Q48 8 52 12 L55 18" />
    {/* Steam wisps */}
    <path d="M30 25 Q32 20 30 15" opacity="0.6" />
    <path d="M33 28 Q35 22 33 17" opacity="0.4" />
  </svg>
);

const WavesFishSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 25 Q15 15 25 25 Q35 35 45 25 Q55 15 65 25 Q75 35 80 30" />
    <path d="M5 35 Q15 25 25 35 Q35 45 45 35 Q55 25 65 35" opacity="0.5" />
    {/* Stylized fish */}
    <path d="M35 42 Q42 38 50 42 Q42 46 35 42" />
    <path d="M50 42 L55 38 L55 46 Z" />
    <circle cx="38" cy="42" r="1" />
  </svg>
);

const WheatSheafSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 75 V35" />
    <path d="M25 75 Q25 50 30 35" />
    <path d="M35 75 Q35 50 30 35" />
    {/* Wheat heads */}
    <path d="M30 35 Q25 28 30 20" />
    <path d="M30 30 Q22 25 25 18" />
    <path d="M30 30 Q38 25 35 18" />
    <path d="M30 25 Q20 22 22 14" />
    <path d="M30 25 Q40 22 38 14" />
    <path d="M30 20 Q24 15 26 8" />
    <path d="M30 20 Q36 15 34 8" />
    <path d="M30 15 Q28 10 30 5" />
  </svg>
);

const SteamingPotSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="20" cy="22" rx="14" ry="5" />
    <path d="M6 22 V30 Q6 36 20 36 Q34 36 34 30 V22" />
    <path d="M4 22 H36" />
    {/* Steam */}
    <path d="M14 18 Q15 14 13 10" opacity="0.6" />
    <path d="M20 16 Q21 12 19 8" opacity="0.5" />
    <path d="M26 18 Q27 14 25 10" opacity="0.6" />
  </svg>
);

// Wheat stalk repeating background pattern
const wheatPattern = `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 45 V25' stroke='%23d97706' stroke-width='0.6' fill='none' opacity='0.08'/%3E%3Cpath d='M25 30 Q20 26 22 20' stroke='%23d97706' stroke-width='0.6' fill='none' opacity='0.08'/%3E%3Cpath d='M25 30 Q30 26 28 20' stroke='%23d97706' stroke-width='0.6' fill='none' opacity='0.08'/%3E%3Cpath d='M25 25 Q22 20 24 14' stroke='%23d97706' stroke-width='0.6' fill='none' opacity='0.07'/%3E%3Cpath d='M25 25 Q28 20 26 14' stroke='%23d97706' stroke-width='0.6' fill='none' opacity='0.07'/%3E%3Cpath d='M25 20 Q24 16 25 10' stroke='%23d97706' stroke-width='0.6' fill='none' opacity='0.06'/%3E%3C/svg%3E")`;

// Map pillar ID to its watermark SVG
const pillarWatermarks: Record<string, typeof MountainSvg> = {
  alpine: MountainSvg,
  lagoon: WavesFishSvg,
  mainland: WheatSheafSvg,
};

interface FoodPillar {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Mountain;
  personality: string;
  colorAccent: string;
  cardBorder: string;
  geoIndicator: string;
  story: string;
  dishes: { name: string; desc: string }[];
  towns: { name: string; why: string }[];
}

const pillars: FoodPillar[] = [
  {
    id: 'alpine',
    title: 'Polenta & Mountain Cuisine',
    subtitle: 'Alpine Roots',
    icon: Mountain,
    personality: 'Hearty, smoky, communal',
    colorAccent: 'text-cyan-600',
    cardBorder: 'border-cyan-200/60 hover:border-cyan-400',
    geoIndicator: 'Dolomites & Pre-Alps',
    story: "Before pasta conquered Italy, the mountains ate polenta. Not the soft, creamy stuff you get at fancy restaurants — dense, firm polenta cooked in copper pots over wood fires, sliced with a thread and eaten with whatever the mountains offered: venison, wild mushrooms, smoked sausages, melted cheese.\n\nThis is cooperative cuisine. Asiago cheese still comes from communal dairies where farmers pool milk. Summer pasture migrations (transumanza) still happen. The food tastes like altitude and patience.",
    dishes: [
      { name: 'Polenta e Schiz', desc: 'Firm polenta with fried fresh cheese — the Belluno breakfast of champions' },
      { name: 'Pastìn', desc: 'Spiced pork sausage unique to Belluno province, crumbled over polenta or grilled' },
      { name: 'Casunziei', desc: 'Beetroot-filled ravioli from Cortina, dressed in butter and poppy seeds' },
      { name: 'Asiago Stravecchio', desc: 'Aged mountain cheese with crystalline texture — the Parmigiano of the Alps' }
    ],
    towns: [
      { name: 'Belluno', why: 'The gateway to the Dolomites where polenta isn\'t a side dish — it\'s the main event' },
      { name: 'Feltre', why: 'Medieval streets, mountain air, restaurants that still cook over wood fires' },
      { name: 'Bassano del Grappa', why: 'Alpine bridge town where grappa was born and white asparagus is worshipped' }
    ]
  },
  {
    id: 'lagoon',
    title: 'Risotto & Lagoon Influence',
    subtitle: 'Seafaring Traditions',
    icon: Waves,
    personality: 'Briny, inventive, theatrical',
    colorAccent: 'text-blue-600',
    cardBorder: 'border-blue-200/60 hover:border-blue-400',
    geoIndicator: 'Venice & the Lagoon',
    story: "Venice's kitchen is unlike anywhere else in Italy. A thousand years of maritime trade means your plate carries echoes of Constantinople, Alexandria, and the Spice Route. Sarde in saor — sardines in sweet-sour onion marinade — was invented so sailors could eat preserved fish on long voyages. Risotto al nero di seppia gets its dramatic black color from cuttlefish ink.\n\nThis is food shaped by water, commerce, and survival. Every dish has a story about trade routes, preservation, or the lagoon's fragile ecosystem. The Rialto fish market at dawn is still the best show in town.",
    dishes: [
      { name: 'Risotto al Nero di Seppia', desc: 'Black cuttlefish ink risotto — dramatic, briny, and unmistakably Venetian' },
      { name: 'Sarde in Saor', desc: 'Sweet-sour sardines with onions, raisins, pine nuts — a sailor\'s preservation trick turned delicacy' },
      { name: 'Baccalà Mantecato', desc: 'Whipped salt cod on grilled polenta — the city\'s most perfect cicchetto' },
      { name: 'Moleche', desc: 'Soft-shell crabs from the lagoon, dipped in egg and fried — seasonal, fleeting, unforgettable' }
    ],
    towns: [
      { name: 'Venice', why: 'Skip the tourist traps. Head to Cannaregio or Castello for bacari that haven\'t changed in 50 years' },
      { name: 'Chioggia', why: 'Venice\'s working-class fishing sister — same lagoon, better prices, more authentic fish restaurants' },
      { name: 'Burano', why: 'Beyond the colored houses: risotto de gò, a fish broth risotto that exists nowhere else' }
    ]
  },
  {
    id: 'mainland',
    title: 'Bigoli & Mainland Comfort',
    subtitle: 'The Veneto Heartland',
    icon: Wheat,
    personality: 'Generous, seasonal, rooted',
    colorAccent: 'text-amber-600',
    cardBorder: 'border-amber-200/60 hover:border-amber-400',
    geoIndicator: 'Padua, Treviso & Vicenza',
    story: "The mainland is where Veneto actually lives. Three university cities — Padua, Treviso, Vicenza — each with distinct food identities shaped by rivers, plains, and obstinate local pride. Treviso has radicchio the way Modena has balsamic: it's an identity, not an ingredient. Padua's contribution is bigoli — thick, rough-textured bronze-extruded pasta that grabs sauce like nothing else.\n\nThis is Sunday lunch food. Bigoli with duck ragù. Pumpkin tortelli in sage butter. Radicchio grilled over coals and drizzled with olive oil. It's not flashy. It's just deeply, profoundly good — the kind of food that makes you stop talking mid-sentence.",
    dishes: [
      { name: 'Bigoli in Salsa', desc: 'Thick spaghetti in anchovy-onion sauce — a Lenten tradition that transcends its simplicity' },
      { name: 'Bigoli con Ragù d\'Anatra', desc: 'The Sunday dish: slow-cooked duck ragù on hand-pressed pasta' },
      { name: 'Radicchio di Treviso alla Griglia', desc: 'Late-harvest radicchio, charred and dressed — bitter, sweet, smoky perfection' },
      { name: 'Baccalà alla Vicentina', desc: 'Vicenza\'s obsession: salt cod braised in milk and olive oil for 4+ hours. Wars have been fought over recipes.' }
    ],
    towns: [
      { name: 'Padua', why: 'University town energy, the oldest botanical garden in Europe, and bigoli in every trattoria' },
      { name: 'Treviso', why: 'Radicchio is religion here. The late-harvest IGP variety is forced in spring water — a process so labor-intensive it borders on madness' },
      { name: 'Vicenza', why: 'Baccalà alla vicentina has its own confraternity. They meet. They argue. They cook. This is serious.' }
    ]
  }
];

export default function VenetoFoodPillars() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-amber-50/40 relative overflow-hidden">
      {/* Wheat stalk repeating background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: wheatPattern, backgroundSize: '50px 50px' }}
        aria-hidden="true"
      />

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-amber-200">
            <ChefHat className="h-4 w-4" />
            Food as Geography
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Polenta, Risotto, or <span className="text-amber-600">Bigoli?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three culinary traditions. Three landscapes. Three ways Veneto feeds you — 
            all within an hour's drive of each other.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {pillars.map(pillar => {
            const Icon = pillar.icon;
            const isExpanded = expanded === pillar.id;
            const WatermarkSvg = pillarWatermarks[pillar.id];
            
            return (
              <button
                key={pillar.id}
                onClick={() => setExpanded(isExpanded ? null : pillar.id)}
                className={cn(
                  "relative rounded-xl border-2 p-6 text-left transition-all duration-500 bg-white/80 overflow-hidden group",
                  pillar.cardBorder,
                  isExpanded ? 'ring-2 ring-amber-300/50 scale-[1.01] shadow-md' : expanded ? 'opacity-50 hover:opacity-80' : 'hover:scale-[1.02] hover:shadow-md'
                )}
              >
                {/* Themed SVG watermark */}
                {WatermarkSvg && (
                  <WatermarkSvg className={cn(
                    "absolute bottom-2 right-2 w-16 h-12 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500",
                    pillar.colorAccent
                  )} />
                )}

                {/* Icon + geo indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className={cn("h-5 w-5", pillar.colorAccent)} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    {pillar.geoIndicator}
                  </span>
                </div>

                <p className={cn("text-xs font-bold uppercase tracking-widest mb-1", pillar.colorAccent)}>
                  {pillar.subtitle}
                </p>
                <h3 className="text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground italic">{pillar.personality}</p>
              </button>
            );
          })}
        </div>

        {/* Expanded Detail */}
        <div className={cn(
          "overflow-hidden transition-all duration-500",
          expanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          {expanded && (() => {
            const pillar = pillars.find(p => p.id === expanded)!;
            const Icon = pillar.icon;
            return (
              <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-lg">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Story */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className={cn("h-5 w-5", pillar.colorAccent)} />
                      <h3 className="text-xl font-bold text-foreground">{pillar.title}</h3>
                    </div>
                    {pillar.story.split('\n\n').map((p, i) => (
                      <p key={i} className="text-muted-foreground mb-4 leading-relaxed text-sm">{p}</p>
                    ))}
                  </div>

                  {/* Dishes + Towns */}
                  <div className="space-y-6">
                    {/* Key Dishes */}
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-3">Key Dishes</h4>
                      <div className="space-y-3">
                        {pillar.dishes.map(d => (
                          <div key={d.name} className="bg-muted/50 rounded-lg p-3 border border-border">
                            <p className="text-sm font-semibold text-foreground">{d.name}</p>
                            <p className="text-xs text-muted-foreground">{d.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Where You'll Feel This Most */}
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                        <MapPin className={cn("h-3.5 w-3.5", pillar.colorAccent)} />
                        Where You'll Feel This Most
                      </h4>
                      <div className="space-y-2">
                        {pillar.towns.map(t => (
                          <div key={t.name} className="flex gap-2">
                            <span className={cn("text-sm font-bold shrink-0", pillar.colorAccent)}>{t.name}:</span>
                            <span className="text-xs text-muted-foreground">{t.why}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Editorial Footer */}
        <div className="mt-10 bg-amber-50/60 rounded-2xl p-6 md:p-8 border border-amber-200/40">
          <h4 className="font-bold mb-2 flex items-center gap-2 text-foreground">
            <ChefHat className="h-5 w-5 text-amber-600" />
            The Veneto Table
            <SteamingPotSvg className="h-6 w-6 text-amber-500 opacity-40" />
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            <strong className="text-foreground">Here's what no one tells you:</strong> you can eat polenta with venison stew for lunch in Belluno, drive an hour south to Treviso for grilled radicchio and bigoli at dinner, and the next morning be eating baccalà mantecato on a crostino at a bacaro in Venice. Three completely different food cultures, three completely different landscapes — one region. That's Veneto's quiet superpower. It's not Italy's most famous food region, but it might be its most versatile.
          </p>
        </div>
      </div>
    </section>
  );
}
