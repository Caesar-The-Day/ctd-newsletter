import { useState } from 'react';
import { Mountain, Waves, Wheat, MapPin, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Decorative SVG Components (Bold, Filled, Animated) ---

const MountainSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 70" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="mtn-fill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
        <stop offset="60%" stopColor="currentColor" stopOpacity="0.08" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
      </linearGradient>
    </defs>
    <path d="M5 65 L30 15 L45 35 L55 10 L80 55 L95 65 Z" fill="url(#mtn-fill)" stroke="currentColor" strokeWidth="1.5" />
    {/* Snow caps */}
    <path d="M55 10 L50 20 L55 18 L60 22 L55 10Z" fill="currentColor" opacity="0.15" />
    <path d="M30 15 L26 24 L30 22 L34 26 L30 15Z" fill="currentColor" opacity="0.12" />
    {/* Steam wisps */}
    <path d="M38 28 Q40 22 37 16" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
    <path d="M42 30 Q44 24 41 18" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" />
  </svg>
);

const WavesFishSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 70" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="wave-fill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    {/* Filled waves */}
    <path d="M0 30 Q15 15 30 30 Q45 45 60 30 Q75 15 90 30 L100 30 L100 65 L0 65 Z" fill="url(#wave-fill)" />
    <path d="M0 30 Q15 15 30 30 Q45 45 60 30 Q75 15 90 30" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    <path d="M0 42 Q15 32 30 42 Q45 52 60 42 Q75 32 90 42" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    {/* Stylized fish */}
    <path d="M40 52 Q50 46 62 52 Q50 58 40 52" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
    <path d="M62 52 L68 46 L68 58 Z" fill="currentColor" opacity="0.12" />
    <circle cx="45" cy="52" r="1.5" fill="currentColor" opacity="0.25" />
  </svg>
);

const WheatSheafSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 100" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="wheat-fill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
      </linearGradient>
    </defs>
    {/* Stalks */}
    <path d="M40 90 V40" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <path d="M32 90 Q33 60 40 40" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.25" />
    <path d="M48 90 Q47 60 40 40" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.25" />
    {/* Wheat heads — filled */}
    <path d="M40 40 Q34 32 38 22 Q40 18 42 22 Q46 32 40 40Z" fill="url(#wheat-fill)" stroke="currentColor" strokeWidth="0.8" />
    <path d="M36 38 Q28 32 30 20 Q32 16 34 20 Q38 28 36 38Z" fill="url(#wheat-fill)" stroke="currentColor" strokeWidth="0.8" />
    <path d="M44 38 Q52 32 50 20 Q48 16 46 20 Q42 28 44 38Z" fill="url(#wheat-fill)" stroke="currentColor" strokeWidth="0.8" />
    <path d="M33 30 Q24 26 26 14 Q28 10 30 14 Q34 22 33 30Z" fill="url(#wheat-fill)" stroke="currentColor" strokeWidth="0.8" />
    <path d="M47 30 Q56 26 54 14 Q52 10 50 14 Q46 22 47 30Z" fill="url(#wheat-fill)" stroke="currentColor" strokeWidth="0.8" />
    <path d="M38 26 Q32 18 36 8 Q38 4 40 8 Q42 18 38 26Z" fill="url(#wheat-fill)" stroke="currentColor" strokeWidth="0.8" />
    <path d="M42 26 Q48 18 44 8 Q42 4 40 8 Q38 18 42 26Z" fill="url(#wheat-fill)" stroke="currentColor" strokeWidth="0.8" />
  </svg>
);

const SteamingPotSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 50 50" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="pot-fill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Pot body */}
    <ellipse cx="25" cy="28" rx="16" ry="5" fill="url(#pot-fill)" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 28 V37 Q9 44 25 44 Q41 44 41 37 V28" stroke="currentColor" strokeWidth="1.5" fill="url(#pot-fill)" />
    <path d="M7 28 H43" stroke="currentColor" strokeWidth="1.5" />
    {/* Animated steam wisps */}
    <path d="M17 22 Q18 17 16 12" stroke="currentColor" strokeWidth="1.2" fill="none" className="animate-[svg-rise-fade_2s_ease-out_infinite] motion-reduce:animate-none" opacity="0.5" />
    <path d="M25 20 Q26 15 24 10" stroke="currentColor" strokeWidth="1.2" fill="none" className="animate-[svg-rise-fade_2s_ease-out_0.4s_infinite] motion-reduce:animate-none" opacity="0.4" />
    <path d="M33 22 Q34 17 32 12" stroke="currentColor" strokeWidth="1.2" fill="none" className="animate-[svg-rise-fade_2s_ease-out_0.8s_infinite] motion-reduce:animate-none" opacity="0.5" />
  </svg>
);

// Pillar-themed divider SVGs
const MountainDivider = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 600 20" preserveAspectRatio="none" fill="none">
    <path d="M0 18 L50 5 L80 12 L120 2 L160 14 L200 6 L240 16 L300 3 L360 16 L400 6 L440 14 L480 2 L520 12 L550 5 L600 18" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
  </svg>
);

const WaveDivider = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 600 20" preserveAspectRatio="none" fill="none">
    <path d="M0 10 Q50 0 100 10 Q150 20 200 10 Q250 0 300 10 Q350 20 400 10 Q450 0 500 10 Q550 20 600 10" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
  </svg>
);

const WheatDivider = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 600 20" preserveAspectRatio="none" fill="none">
    {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540].map(x => (
      <g key={x}>
        <path d={`M${x + 30} 18 V8`} stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <path d={`M${x + 30} 10 Q${x + 26} 6 ${x + 28} 2`} stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
        <path d={`M${x + 30} 10 Q${x + 34} 6 ${x + 32} 2`} stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      </g>
    ))}
  </svg>
);

// Wheat stalk repeating background pattern (boosted opacity, filled heads)
const wheatPattern = `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 45 V25' stroke='%23d97706' stroke-width='0.6' fill='none' opacity='0.14'/%3E%3Cpath d='M25 30 Q20 26 22 20' stroke='%23d97706' stroke-width='0.6' fill='%23d97706' fill-opacity='0.04' opacity='0.14'/%3E%3Cpath d='M25 30 Q30 26 28 20' stroke='%23d97706' stroke-width='0.6' fill='%23d97706' fill-opacity='0.04' opacity='0.14'/%3E%3Cpath d='M25 25 Q22 20 24 14' stroke='%23d97706' stroke-width='0.6' fill='%23d97706' fill-opacity='0.03' opacity='0.12'/%3E%3Cpath d='M25 25 Q28 20 26 14' stroke='%23d97706' stroke-width='0.6' fill='%23d97706' fill-opacity='0.03' opacity='0.12'/%3E%3Cpath d='M25 20 Q24 16 25 10' stroke='%23d97706' stroke-width='0.6' fill='none' opacity='0.1'/%3E%3C/svg%3E")`;

// Map pillar ID to its watermark SVG
const pillarWatermarks: Record<string, typeof MountainSvg> = {
  alpine: MountainSvg,
  lagoon: WavesFishSvg,
  mainland: WheatSheafSvg,
};

const pillarDividers: Record<string, typeof MountainDivider> = {
  alpine: MountainDivider,
  lagoon: WaveDivider,
  mainland: WheatDivider,
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
  image: string;
  story: string;
  dishes: { name: string; desc: string; link?: string }[];
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
    image: '/images/veneto/polenta-alpine.jpg',
    story: "Before pasta conquered Italy, the mountains ate polenta. Not the soft, creamy stuff you get at fancy restaurants — dense, firm polenta cooked in copper pots over wood fires, sliced with a thread and eaten with whatever the mountains offered: venison, wild mushrooms, smoked sausages, melted cheese.\n\nThis is cooperative cuisine. Asiago cheese still comes from communal dairies where farmers pool milk. Summer pasture migrations (transumanza) still happen. The food tastes like altitude and patience.",
    dishes: [
      { name: 'Polenta e Schiz', desc: 'Firm polenta with fried fresh cheese — the Belluno breakfast of champions', link: 'https://www.concagordina.it/en/experience/gusto/polenta-and-schiz/' },
      { name: 'Pastìn', desc: 'Spiced pork sausage unique to Belluno province, crumbled over polenta or grilled', link: 'https://pastin.it/en/pastin/' },
      { name: 'Casunziei', desc: 'Beetroot-filled ravioli from Cortina, dressed in butter and poppy seeds', link: 'https://www.ninaspastaproject.com/blog/casunziei-allampezzana' },
      { name: 'Asiago Stravecchio', desc: 'Aged mountain cheese with crystalline texture — the Parmigiano of the Alps', link: 'https://www.gourm.it/en/1785-pdo-aged-stravecchio-asiago/' }
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
    image: '/images/veneto/risotto-lagoon.jpg',
    story: "Venice's kitchen is unlike anywhere else in Italy. A thousand years of maritime trade means your plate carries echoes of Constantinople, Alexandria, and the Spice Route. Sarde in saor — sardines in sweet-sour onion marinade — was invented so sailors could eat preserved fish on long voyages. Risotto al nero di seppia gets its dramatic black color from cuttlefish ink.\n\nThis is food shaped by water, commerce, and survival. Every dish has a story about trade routes, preservation, or the lagoon's fragile ecosystem. The Rialto fish market at dawn is still the best show in town.",
    dishes: [
      { name: 'Risotto al Nero di Seppia', desc: 'Black cuttlefish ink risotto — dramatic, briny, and unmistakably Venetian', link: 'https://food52.com/recipes/27060-squid-ink-risotto-risotto-al-nero-di-seppia' },
      { name: 'Sarde in Saor', desc: 'Sweet-sour sardines with onions, raisins, pine nuts — a sailor\'s preservation trick turned delicacy', link: 'https://www.lacucinaitaliana.com/italian-food/italian-dishes/sarde-in-saor-recipe-all-the-flavor-of-venice-in-one-dish' },
      { name: 'Baccalà Mantecato', desc: 'Whipped salt cod on grilled polenta — the city\'s most perfect cicchetto', link: 'https://food52.com/recipes/23919-baccala-mantecato' },
      { name: 'Moleche', desc: 'Soft-shell crabs from the lagoon, dipped in egg and fried — seasonal, fleeting, unforgettable', link: 'https://italianfoodforever.com/2017/07/moleche-fried-soft-shell-crabs/' }
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
    image: '/images/veneto/bigoli-mainland.jpg',
    story: "The mainland is where Veneto actually lives. Three university cities — Padua, Treviso, Vicenza — each with distinct food identities shaped by rivers, plains, and obstinate local pride. Treviso has radicchio the way Modena has balsamic: it's an identity, not an ingredient. Padua's contribution is bigoli — thick, rough-textured bronze-extruded pasta that grabs sauce like nothing else.\n\nThis is Sunday lunch food. Bigoli with duck ragù. Pumpkin tortelli in sage butter. Radicchio grilled over coals and drizzled with olive oil. It's not flashy. It's just deeply, profoundly good — the kind of food that makes you stop talking mid-sentence.",
    dishes: [
      { name: 'Bigoli in Salsa', desc: 'Thick spaghetti in anchovy-onion sauce — a Lenten tradition that transcends its simplicity', link: 'https://www.greatitalianchefs.com/recipes/bigoli-in-salsa-recipe' },
      { name: 'Bigoli con Ragù d\'Anatra', desc: 'The Sunday dish: slow-cooked duck ragù on hand-pressed pasta', link: 'https://www.lacucinaitaliana.it/ricetta/primi/bigoli-con-ragu-danitra/' },
      { name: 'Radicchio di Treviso alla Griglia', desc: 'Late-harvest radicchio, charred and dressed — bitter, sweet, smoky perfection', link: 'https://blog.giallozafferano.it/cucinoperpassione/radicchio-trevigiano-grigliato/' },
      { name: 'Baccalà alla Vicentina', desc: 'Vicenza\'s obsession: salt cod braised in milk and olive oil for 4+ hours. Wars have been fought over recipes.', link: 'https://baccalaallavicentina.it/la-ricetta/?doing_wp_cron=1771009418.5164940357208251953125' }
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
      {/* Wheat stalk repeating background pattern (boosted) */}
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
                  "relative rounded-xl border-2 text-left transition-all duration-500 bg-white/80 overflow-hidden group",
                  pillar.cardBorder,
                  isExpanded ? 'ring-2 ring-amber-300/50 scale-[1.01] shadow-md' : expanded ? 'opacity-50 hover:opacity-80' : 'hover:scale-[1.02] hover:shadow-md'
                )}
              >
                {/* Pillar photo */}
                <div className="w-full h-32 overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 relative">
                  {/* Large themed illustration — swaying, filled */}
                  {WatermarkSvg && (
                    <WatermarkSvg className={cn(
                      "absolute bottom-1 right-1 w-24 h-20 opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-500 animate-[svg-sway_8s_ease-in-out_infinite] motion-reduce:animate-none",
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
                </div>
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
            const DividerSvg = pillarDividers[pillar.id];
            return (
              <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-lg">
                {/* Themed divider at top of expanded panel */}
                {DividerSvg && <DividerSvg className={cn("w-full h-5 mb-4", pillar.colorAccent)} />}

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
                            {d.link ? (
                              <a href={d.link} target="_blank" rel="noopener noreferrer" className={cn("text-sm font-semibold hover:underline", pillar.colorAccent)}>{d.name} ↗</a>
                            ) : (
                              <p className="text-sm font-semibold text-foreground">{d.name}</p>
                            )}
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
        <div className="mt-10 bg-amber-50/60 rounded-2xl p-6 md:p-8 border border-amber-200/40 relative overflow-hidden">
          <h4 className="font-bold mb-2 flex items-center gap-2 text-foreground">
            <ChefHat className="h-5 w-5 text-amber-600" />
            The Veneto Table
            <SteamingPotSvg className="h-8 w-8 text-amber-500 opacity-60" />
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            <strong className="text-foreground">Here's what no one tells you:</strong> you can eat polenta with venison stew for lunch in Belluno, drive an hour south to Treviso for grilled radicchio and bigoli at dinner, and the next morning be eating baccalà mantecato on a crostino at a bacaro in Venice. Three completely different food cultures, three completely different landscapes — one region. That's Veneto's quiet superpower. It's not Italy's most famous food region, but it might be its most versatile.
          </p>
        </div>
      </div>
    </section>
  );
}
