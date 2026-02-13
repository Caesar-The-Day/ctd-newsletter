import { useState } from 'react';
import { Wine, ExternalLink, Grape, MapPin, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Decorative SVG Components ---

const GrapeClusterSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="15" cy="20" r="5" />
    <circle cx="25" cy="20" r="5" />
    <circle cx="20" cy="28" r="5" />
    <circle cx="10" cy="28" r="5" />
    <circle cx="30" cy="28" r="5" />
    <circle cx="15" cy="36" r="5" />
    <circle cx="25" cy="36" r="5" />
    <circle cx="20" cy="44" r="5" />
    <path d="M20 4 Q22 10 20 16" />
    <path d="M20 4 Q16 2 12 4" />
    <path d="M20 4 Q24 2 28 4" />
  </svg>
);

const WineGlassSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 5 H45" />
    <path d="M15 5 Q14 35 20 45 Q25 50 30 55" />
    <path d="M45 5 Q46 35 40 45 Q35 50 30 55" />
    <path d="M30 55 V85" />
    <path d="M18 85 H42" />
    <path d="M16 20 Q30 28 44 20" />
  </svg>
);

const CorkscrewSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2 H16" />
    <path d="M12 2 V10" />
    <path d="M8 10 H16" />
    <path d="M12 10 Q15 14 9 18 Q15 22 9 26 Q15 30 9 34 Q12 38 12 38" />
  </svg>
);

// Grape vine repeating background pattern (SVG data URI)
const grapeVinePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 5 Q20 0 25 5 Q30 10 25 15' stroke='%23be123c' stroke-width='0.8' fill='none' opacity='0.12'/%3E%3Ccircle cx='28' cy='18' r='3' stroke='%23be123c' stroke-width='0.6' fill='none' opacity='0.1'/%3E%3Ccircle cx='22' cy='20' r='3' stroke='%23be123c' stroke-width='0.6' fill='none' opacity='0.1'/%3E%3Ccircle cx='25' cy='25' r='3' stroke='%23be123c' stroke-width='0.6' fill='none' opacity='0.08'/%3E%3Cpath d='M45 35 Q50 30 55 35 Q60 40 55 45' stroke='%23be123c' stroke-width='0.8' fill='none' opacity='0.12'/%3E%3Ccircle cx='52' cy='48' r='3' stroke='%23be123c' stroke-width='0.6' fill='none' opacity='0.1'/%3E%3Ccircle cx='48' cy='50' r='3' stroke='%23be123c' stroke-width='0.6' fill='none' opacity='0.1'/%3E%3C/svg%3E")`;

interface WineProfile {
  id: string;
  name: string;
  personality: string;
  classification: 'DOCG' | 'DOC';
  type: 'Red' | 'White' | 'Rosé';
  color: string;
  borderColor: string;
  tagline: string;
  flavorProfile: string[];
  description: string;
  whereMade: string;
  whereGeo: string;
  townVibe: string;
  townVibeDesc: string;
  priceRange: string;
  foodPairing: string;
  link: string;
  linkLabel: string;
}

const wines: WineProfile[] = [
  {
    id: 'amarone',
    name: 'Amarone della Valpolicella',
    personality: 'Contemplative',
    classification: 'DOCG',
    type: 'Red',
    color: 'from-red-950 to-red-800',
    borderColor: 'border-rose-200/60 hover:border-rose-400',
    tagline: 'Big, structured, patient — like Verona itself',
    flavorProfile: ['Dried cherry', 'Dark chocolate', 'Tobacco', 'Leather', 'Fig'],
    description: "Made from grapes dried on straw mats for months — a process called appassimento that concentrates everything. The result is one of Italy's most powerful reds: 15-16% alcohol, decades of aging potential, and a complexity that rewards the kind of person who reads slowly and thinks deeply.\n\nThis is not a wine you drink casually. This is the wine you open when the conversation matters.",
    whereMade: 'Valpolicella hills, north of Verona',
    whereGeo: 'The valleys between Verona and Lake Garda — terraced hillsides where families have dried grapes in lofts since the Roman Republic.',
    townVibe: 'Verona',
    townVibeDesc: 'Deep, patient, layered — a city that reveals itself over years, not weekends. The Arena, the river bends, the quiet osterie in Veronetta. Amarone people.',
    priceRange: '€30–€120',
    foodPairing: 'Aged Monte Veronese, brasato, risotto all\'Amarone',
    link: 'https://www.consorziovalpolicella.it/en/',
    linkLabel: 'Consorzio Valpolicella'
  },
  {
    id: 'prosecco',
    name: 'Prosecco Superiore DOCG',
    personality: 'Celebratory',
    classification: 'DOCG',
    type: 'White',
    color: 'from-amber-300 to-yellow-500',
    borderColor: 'border-amber-200/60 hover:border-amber-400',
    tagline: 'Bright, social, joyful — the real thing, not the supermarket version',
    flavorProfile: ['Green apple', 'White peach', 'Acacia flower', 'Pear', 'Almond'],
    description: "Forget everything the supermarket taught you. Real Prosecco Superiore DOCG comes from impossibly steep hillsides in the Conegliano-Valdobbiadene zone — UNESCO-protected terrain where tractors can't go and grapes are harvested by hand on 45-degree slopes.\n\nThe difference between this and a €6 bottle of generic Prosecco is the difference between a Venetian palazzo and a hotel lobby. Same category, different universe.",
    whereMade: 'Conegliano-Valdobbiadene hills',
    whereGeo: 'The steep, fog-wrapped hills between Conegliano and Valdobbiadene — 15 communes producing wine on gradients that would terrify a mountain goat. UNESCO World Heritage since 2019.',
    townVibe: 'Treviso',
    townVibeDesc: 'Bright, social, casually elegant — canals without the crowds, porticoed streets perfect for aperitivo, a town that celebrates without performing. Prosecco people.',
    priceRange: '€10–€25',
    foodPairing: 'Cicchetti, soft-shell crab, frittura mista, tiramisù',
    link: 'https://www.prosecco.it/en/',
    linkLabel: 'Consorzio Prosecco'
  },
  {
    id: 'soave',
    name: 'Soave Classico',
    personality: 'Elegant',
    classification: 'DOC',
    type: 'White',
    color: 'from-green-200 to-emerald-300',
    borderColor: 'border-emerald-200/60 hover:border-emerald-400',
    tagline: 'Crisp, mineral, restrained — volcanic soil in a glass',
    flavorProfile: ['Citrus blossom', 'Almond', 'Mineral', 'White flowers', 'Saline'],
    description: "Soave was nearly ruined in the 1980s by mass production. The Classico zone fought back — returning to volcanic hillside vineyards and proving that Garganega, an ancient grape most people dismiss, can produce whites of startling elegance.\n\nThe volcanic soils east of Verona give Soave Classico a mineral backbone that cheap versions from the plains will never have. This is the wine Vicenza drinks — understated, refined, and better than it needs to be.",
    whereMade: 'Volcanic hills east of Verona',
    whereGeo: 'Ancient volcanic slopes around the medieval town of Soave — castle-crowned hills where basalt soils produce whites with a mineral tension that betrays their fiery origins.',
    townVibe: 'Vicenza',
    townVibeDesc: 'Understated refinement — Palladian villas, quiet wealth, a city that doesn\'t need to prove anything. Gold jewelry district, world-class architecture, zero tourist crowds. Soave people.',
    priceRange: '€8–€18',
    foodPairing: 'Baccalà alla vicentina, risotto with asparagus, lake fish',
    link: 'https://www.ilsoave.com/en/',
    linkLabel: 'Consorzio Soave'
  },
  {
    id: 'bardolino',
    name: 'Bardolino',
    personality: 'Easygoing',
    classification: 'DOC',
    type: 'Red',
    color: 'from-rose-400 to-pink-500',
    borderColor: 'border-rose-200/60 hover:border-rose-400',
    tagline: 'Light, lakeside, unpretentious — aperitivo in a glass',
    flavorProfile: ['Fresh cherry', 'Strawberry', 'Rose petal', 'Herbs', 'Almond'],
    description: "Bardolino doesn't try to be Amarone. It doesn't try to be anything except exactly what it is: a light, fresh, cherry-bright red that's perfect slightly chilled on a warm evening by Lake Garda.\n\nThis is the wine that disappears fastest at any table — not because it's profound, but because it's irresistible. The Chiaretto rosé version is arguably even better, a pale salmon-pink that locals drink like water from April to October.",
    whereMade: 'Eastern shore of Lake Garda',
    whereGeo: 'The gentle morainic hills along Lake Garda\'s eastern bank — mild microclimate, olive groves, and vineyards that benefit from the lake\'s thermal regulation.',
    townVibe: 'Lake Garda towns',
    townVibeDesc: 'Relaxed, outdoor, unpretentious — sailing in the morning, aperitivo at sunset, dinner with friends that lasts until midnight. No agenda, no rush. Bardolino people.',
    priceRange: '€7–€14',
    foodPairing: 'Grilled lake fish, pizza, charcuterie, summer salads',
    link: 'https://www.winebardolino.it/',
    linkLabel: 'Consorzio Bardolino'
  }
];

export default function VenetoWinePourSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedWine = wines.find(w => w.id === selected);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-rose-50/40 relative overflow-hidden">
      {/* Grape vine repeating background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: grapeVinePattern, backgroundSize: '60px 60px' }}
        aria-hidden="true"
      />

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-rose-200">
            <Wine className="h-4 w-4" />
            Wine Identity
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            What's Your <span className="text-rose-600">Veneto Pour?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four wines. Four personalities. Four ways of living in Veneto. 
            Pick the one that sounds like you — and we'll show you where you belong.
          </p>
        </div>

        {/* Wine Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {wines.map(wine => (
            <button
              key={wine.id}
              onClick={() => setSelected(selected === wine.id ? null : wine.id)}
              className={cn(
                "relative rounded-xl border-2 p-6 text-left transition-all duration-500 group bg-white/80 overflow-hidden",
                wine.borderColor,
                selected === wine.id
                  ? 'ring-2 ring-rose-300/50 scale-[1.02] shadow-md'
                  : selected
                    ? 'opacity-50 hover:opacity-80'
                    : 'hover:scale-[1.02] hover:shadow-md'
              )}
            >
              {/* Decorative grape cluster watermark */}
              <GrapeClusterSvg className="absolute top-2 right-2 w-10 h-12 text-rose-400 opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-500" />

              {/* Wine glass icon */}
              <div className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center mb-4",
                wine.color
              )}>
                <Wine className="h-6 w-6 text-white" />
              </div>
              
              {/* Personality word */}
              <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-1">
                {wine.personality}
              </p>
              
              {/* Wine name */}
              <h3 className="text-sm md:text-base font-bold text-foreground leading-tight">
                {wine.name}
              </h3>

              {/* Badges */}
              <div className="flex gap-1.5 mt-3">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  wine.type === 'Red' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                )}>
                  {wine.type}
                </span>
                <span className="bg-muted px-2 py-0.5 rounded-full text-[10px] font-bold text-muted-foreground">
                  {wine.classification}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Expanded Detail Panel */}
        <div className={cn(
          "overflow-hidden transition-all duration-500",
          selectedWine ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          {selectedWine && (
            <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-lg relative overflow-hidden">
              {/* Wine glass watermark in detail panel */}
              <WineGlassSvg className="absolute bottom-4 right-4 w-24 h-40 text-rose-300 opacity-[0.06] pointer-events-none" />

              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                {/* Left: Story */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
                    {selectedWine.personality}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{selectedWine.name}</h3>
                  <p className="text-muted-foreground text-sm italic mb-6">{selectedWine.tagline}</p>
                  
                  {/* Flavor profile pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedWine.flavorProfile.map(f => (
                      <span key={f} className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs border border-rose-200/60">
                        {f}
                      </span>
                    ))}
                  </div>

                  {selectedWine.description.split('\n\n').map((p, i) => (
                    <p key={i} className="text-muted-foreground mb-4 leading-relaxed text-sm">{p}</p>
                  ))}
                </div>

                {/* Right: Details */}
                <div className="space-y-6">
                  {/* Where it's made */}
                  <div className="bg-rose-50/60 rounded-xl p-5 border border-rose-200/40">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-rose-600" />
                      <h4 className="font-bold text-foreground text-sm">Where It's Made</h4>
                    </div>
                    <p className="text-xs font-semibold text-rose-600 mb-1">{selectedWine.whereMade}</p>
                    <p className="text-muted-foreground text-sm">{selectedWine.whereGeo}</p>
                  </div>

                  {/* Town vibe */}
                  <div className="bg-rose-50/60 rounded-xl p-5 border border-rose-200/40">
                    <h4 className="font-bold text-foreground text-sm mb-1">
                      The Town Vibe It Pairs With: <span className="text-rose-600">{selectedWine.townVibe}</span>
                    </h4>
                    <p className="text-muted-foreground text-sm">{selectedWine.townVibeDesc}</p>
                  </div>

                  {/* Pairing & Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200/40">
                      <div className="flex items-center gap-1.5 mb-1">
                        <UtensilsCrossed className="h-3.5 w-3.5 text-rose-600" />
                        <span className="text-xs font-bold text-foreground">Pairs With</span>
                      </div>
                      <p className="text-muted-foreground text-xs">{selectedWine.foodPairing}</p>
                    </div>
                    <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200/40">
                      <span className="text-xs font-bold text-foreground block mb-1">Price Range</span>
                      <p className="text-rose-600 font-semibold">{selectedWine.priceRange}</p>
                    </div>
                  </div>

                  {/* Link */}
                  <Button asChild variant="outline" size="sm" className="w-full border-rose-200 text-rose-700 hover:bg-rose-50">
                    <a href={selectedWine.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {selectedWine.linkLabel}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Editorial Footer */}
        <div className="mt-10 bg-rose-50/60 rounded-2xl p-6 md:p-8 border border-rose-200/40">
          <h4 className="font-bold mb-2 flex items-center gap-2 text-foreground">
            <Grape className="h-5 w-5 text-rose-600" />
            The Insider Take
            <CorkscrewSvg className="h-6 w-4 text-rose-400 opacity-40" />
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            <strong className="text-foreground">The secret fourth move:</strong> order a Valpolicella Ripasso. It uses the same dried-grape skins from Amarone production to re-ferment a lighter Valpolicella — giving you 70% of Amarone's complexity at a third of the price. Every local knows this. Most tourists don't. Also: Bardolino Chiaretto is having a moment as one of Italy's best rosés. At €8-10 a bottle, it's absurdly underpriced for what you get.
          </p>
        </div>
      </div>
    </section>
  );
}
