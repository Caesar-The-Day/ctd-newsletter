import { useState } from 'react';
import { Wine, ExternalLink, Grape, MapPin, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WineProfile {
  id: string;
  name: string;
  personality: string;
  classification: 'DOCG' | 'DOC';
  type: 'Red' | 'White' | 'Rosé';
  color: string;
  bgGradient: string;
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
    bgGradient: 'bg-gradient-to-br from-red-950/20 to-red-900/10',
    borderColor: 'border-red-800/40 hover:border-red-600/60',
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
    bgGradient: 'bg-gradient-to-br from-amber-100/30 to-yellow-50/20',
    borderColor: 'border-amber-400/40 hover:border-amber-400/70',
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
    bgGradient: 'bg-gradient-to-br from-emerald-50/30 to-green-50/20',
    borderColor: 'border-emerald-400/40 hover:border-emerald-500/60',
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
    bgGradient: 'bg-gradient-to-br from-rose-50/30 to-pink-50/20',
    borderColor: 'border-rose-400/40 hover:border-rose-500/60',
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-[hsl(345,30%,12%)] to-[hsl(345,25%,8%)]">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-900/40 text-red-200 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-red-800/30">
            <Wine className="h-4 w-4" />
            Wine Identity
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            What's Your <span className="text-red-300">Veneto Pour?</span>
          </h2>
          <p className="text-lg text-red-100/70 max-w-2xl mx-auto">
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
                "relative rounded-xl border-2 p-6 text-left transition-all duration-500 group",
                wine.borderColor,
                selected === wine.id
                  ? `${wine.bgGradient} ring-2 ring-white/20 scale-[1.02]`
                  : selected
                    ? 'opacity-50 hover:opacity-80'
                    : `${wine.bgGradient} hover:scale-[1.02]`
              )}
            >
              {/* Wine glass icon */}
              <div className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center mb-4",
                wine.color
              )}>
                <Wine className="h-6 w-6 text-white" />
              </div>
              
              {/* Personality word */}
              <p className="text-xs font-bold uppercase tracking-widest text-red-300/80 mb-1">
                {wine.personality}
              </p>
              
              {/* Wine name */}
              <h3 className="text-sm md:text-base font-bold text-white leading-tight">
                {wine.name}
              </h3>

              {/* Badges */}
              <div className="flex gap-1.5 mt-3">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  wine.type === 'Red' ? 'bg-red-800/60 text-red-200' : 'bg-amber-700/40 text-amber-200'
                )}>
                  {wine.type}
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white/80">
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
            <div className={cn("rounded-2xl border border-white/10 p-6 md:p-8", selectedWine.bgGradient)}>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Story */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-red-300/80 mb-2">
                    {selectedWine.personality}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedWine.name}</h3>
                  <p className="text-red-200/60 text-sm italic mb-6">{selectedWine.tagline}</p>
                  
                  {/* Flavor profile pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedWine.flavorProfile.map(f => (
                      <span key={f} className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs border border-white/5">
                        {f}
                      </span>
                    ))}
                  </div>

                  {selectedWine.description.split('\n\n').map((p, i) => (
                    <p key={i} className="text-red-100/70 mb-4 leading-relaxed text-sm">{p}</p>
                  ))}
                </div>

                {/* Right: Details */}
                <div className="space-y-6">
                  {/* Where it's made */}
                  <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-red-300" />
                      <h4 className="font-bold text-white text-sm">Where It's Made</h4>
                    </div>
                    <p className="text-xs font-semibold text-red-300 mb-1">{selectedWine.whereMade}</p>
                    <p className="text-red-100/60 text-sm">{selectedWine.whereGeo}</p>
                  </div>

                  {/* Town vibe */}
                  <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <h4 className="font-bold text-white text-sm mb-1">
                      The Town Vibe It Pairs With: <span className="text-red-300">{selectedWine.townVibe}</span>
                    </h4>
                    <p className="text-red-100/60 text-sm">{selectedWine.townVibeDesc}</p>
                  </div>

                  {/* Pairing & Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <UtensilsCrossed className="h-3.5 w-3.5 text-red-300" />
                        <span className="text-xs font-bold text-white">Pairs With</span>
                      </div>
                      <p className="text-red-100/60 text-xs">{selectedWine.foodPairing}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <span className="text-xs font-bold text-white block mb-1">Price Range</span>
                      <p className="text-red-300 font-semibold">{selectedWine.priceRange}</p>
                    </div>
                  </div>

                  {/* Link */}
                  <Button asChild variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
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
        <div className="mt-10 bg-gradient-to-r from-red-950/40 to-rose-950/30 rounded-2xl p-6 md:p-8 border border-red-800/20">
          <h4 className="font-bold mb-2 flex items-center gap-2 text-white">
            <Grape className="h-5 w-5 text-red-300" />
            The Insider Take
          </h4>
          <p className="text-red-100/70 text-sm leading-relaxed">
            <strong className="text-white">The secret fourth move:</strong> order a Valpolicella Ripasso. It uses the same dried-grape skins from Amarone production to re-ferment a lighter Valpolicella — giving you 70% of Amarone's complexity at a third of the price. Every local knows this. Most tourists don't. Also: Bardolino Chiaretto is having a moment as one of Italy's best rosés. At €8-10 a bottle, it's absurdly underpriced for what you get.
          </p>
        </div>
      </div>
    </section>
  );
}
