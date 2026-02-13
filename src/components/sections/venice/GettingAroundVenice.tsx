import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Ship, Anchor, Hotel, ChevronDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/* ── Where to Stay data ── */
interface StayOption {
  lifestyle: string;
  neighborhood: string;
  why: string;
  description: string;
  bestFor: string;
}

const stayOptions: StayOption[] = [
  {
    lifestyle: 'Culture vulture',
    neighborhood: 'Dorsoduro',
    why: 'Walking distance to Guggenheim, Accademia, and university bars',
    description: 'The art-and-academia district where Peggy Guggenheim once held court. You\'ll stumble between world-class galleries during the day and share spritz with philosophy students after dark.',
    bestFor: 'Art lovers & intellectuals',
  },
  {
    lifestyle: 'Foodie',
    neighborhood: 'San Polo',
    why: 'Steps from Rialto market and the best bacari',
    description: 'Wake up to fishmongers shouting at the Pescheria, spend your afternoon on a bacaro crawl through standing-room wine bars, and eat cicchetti until you can\'t move. This is Venice\'s belly.',
    bestFor: 'Market lovers & wine drinkers',
  },
  {
    lifestyle: 'Peace & quiet',
    neighborhood: 'Castello',
    why: 'Residential, green, real neighborhood feel',
    description: 'The largest sestiere is also the least touristed. Tree-lined streets, a daily market on Via Garibaldi, locals walking dogs in the Biennale gardens. Venice as the Venetians live it.',
    bestFor: 'Long-stay visitors & writers',
  },
  {
    lifestyle: 'First-timer',
    neighborhood: 'San Marco area',
    why: 'Close to everything, easy orientation',
    description: 'Yes, it\'s the priciest. But for a first visit, being able to walk to the Basilica, Doge\'s Palace, and Rialto Bridge without a map is worth the premium. Just avoid ground-floor rooms during acqua alta.',
    bestFor: 'Short trips & orientation seekers',
  },
  {
    lifestyle: 'Budget-conscious',
    neighborhood: 'Cannaregio',
    why: 'Lower prices, local restaurants, near train station',
    description: 'The most residential district has honest-priced trattorias, the atmospheric Jewish Ghetto, and easy access to the train station. Hotel prices run 30-40% less than San Marco for comparable quality.',
    bestFor: 'Value seekers & history buffs',
  },
  {
    lifestyle: 'Romantic escape',
    neighborhood: 'Giudecca',
    why: 'Across the water, views back at Venice, feels private',
    description: 'A short vaporetto ride delivers you to a separate island with jaw-dropping views of the Venetian skyline. The Hilton Molino Stucky occupies a converted flour mill; smaller boutique hotels dot the waterfront.',
    bestFor: 'Couples & honeymooners',
  },
];

/* ── Vaporetto Route Card ── */
function RouteCard({ line, nickname, description }: { line: string; nickname: string; description: string }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="shrink-0 w-12 h-8 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
        {line}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{nickname}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

/* ── Stay Option Row ── */
function StayRow({ option }: { option: StayOption }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border border-border/40 rounded-lg p-4 hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{option.lifestyle}</span>
          <p className="font-semibold text-foreground">{option.neighborhood}</p>
          <p className="text-sm text-muted-foreground">{option.why}</p>
        </div>
        <ChevronDown className={cn('w-4 h-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <p className="text-sm text-foreground/85 leading-relaxed">{option.description}</p>
          <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            Best for: {option.bestFor}
          </span>
        </div>
      )}
    </button>
  );
}

/* ── Main Component ── */
export default function GettingAroundVenice() {
  return (
    <div className="mt-16 mb-8">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">Practical Guide</span>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">Getting Around Venice</h3>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
          No cars, no bikes, no Ubers. Here's how you actually move through a city built on water.
        </p>
      </div>

      <Tabs defaultValue="vaporetto" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="vaporetto" className="gap-1.5 text-xs md:text-sm">
            <Ship className="w-4 h-4" /> Vaporetto
          </TabsTrigger>
          <TabsTrigger value="taxis" className="gap-1.5 text-xs md:text-sm">
            <Anchor className="w-4 h-4" /> Taxis & Gondolas
          </TabsTrigger>
          <TabsTrigger value="stay" className="gap-1.5 text-xs md:text-sm">
            <Hotel className="w-4 h-4" /> Where to Stay
          </TabsTrigger>
        </TabsList>

        {/* ── Vaporetto Tab ── */}
        <TabsContent value="vaporetto" className="space-y-5">
          <div className="space-y-4">
            <RouteCard line="1" nickname='The "Local"' description="Every stop down the Grand Canal. Slow, scenic, and the best €9.50 sightseeing cruise you'll ever take." />
            <RouteCard line="2" nickname='The "Express"' description="San Marco → Rialto → Tronchetto. Skips half the stops. Use when you actually need to get somewhere." />
            <RouteCard line="5.1" nickname='The "Circular"' description="Around the outside of Venice, hitting Murano. Take clockwise (5.1) or counter-clockwise (5.2)." />
            <RouteCard line="12" nickname='The "Island Hopper"' description="Murano → Burano → Torcello. The classic day-trip chain. Budget 5-6 hours round trip." />
          </div>

          <div className="bg-muted/40 border border-border/30 rounded-lg p-4 mt-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Pricing (2025)</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              {[
                { label: 'Single', price: '€9.50' },
                { label: '24hr', price: '€25' },
                { label: '48hr', price: '€35' },
                { label: '72hr', price: '€45' },
                { label: '7-day', price: '€65' },
              ].map((p) => (
                <div key={p.label} className="bg-background/60 rounded-md py-2 px-3">
                  <p className="text-lg font-bold text-foreground">{p.price}</p>
                  <p className="text-xs text-muted-foreground">{p.label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-foreground/80 italic mt-4">
              💡 Pro tip: Never buy a single ticket. The 72-hour pass pays for itself by trip five.
            </p>
          </div>
        </TabsContent>

        {/* ── Taxis & Gondolas Tab ── */}
        <TabsContent value="taxis" className="space-y-5">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-border/40 rounded-lg p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Water Taxi</p>
              <p className="text-2xl font-bold text-foreground">€70–120</p>
              <p className="text-sm text-muted-foreground mt-1">Flat rate within Venice</p>
              <p className="text-xs text-muted-foreground mt-3">Airport transfer: ~€120</p>
              <p className="text-xs text-foreground/70 italic mt-2">Fast, private, feels like a Bond film.</p>
            </div>
            <div className="border border-border/40 rounded-lg p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Gondola</p>
              <p className="text-2xl font-bold text-foreground">€80 <span className="text-sm font-normal text-muted-foreground">/ 30 min</span></p>
              <p className="text-sm text-muted-foreground mt-1">€100 after 7pm · Max 6 people</p>
              <p className="text-xs text-foreground/70 italic mt-3">Split between 6 and it's €14 each. Suddenly reasonable.</p>
            </div>
            <div className="border border-primary/30 rounded-lg p-5 bg-primary/5">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">🏛️ The Traghetto</p>
              <p className="text-2xl font-bold text-foreground">€2</p>
              <p className="text-sm text-muted-foreground mt-1">Cross the Grand Canal standing up in a gondola</p>
              <p className="text-xs text-foreground/70 italic mt-3">The €2 gondola ride nobody knows about. Seven crossing points. Stand like a Venetian.</p>
            </div>
          </div>
        </TabsContent>

        {/* ── Where to Stay Tab ── */}
        <TabsContent value="stay" className="space-y-3">
          {stayOptions.map((opt) => (
            <StayRow key={opt.neighborhood} option={opt} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
