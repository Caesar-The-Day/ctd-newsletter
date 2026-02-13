import { useState } from 'react';
import { Crown, Flame, Coffee, ChevronDown, Theater, Music, Users, Swords, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Decorative SVG Components ---

const VenetianMaskSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M60 10 Q20 10 10 35 Q5 50 15 60 Q25 70 40 65 Q50 62 60 55 Q70 62 80 65 Q95 70 105 60 Q115 50 110 35 Q100 10 60 10Z" />
    {/* Eye holes */}
    <ellipse cx="38" cy="35" rx="12" ry="8" />
    <ellipse cx="82" cy="35" rx="12" ry="8" />
    {/* Nose ridge */}
    <path d="M60 30 Q58 42 60 50" />
    {/* Decorative forehead */}
    <path d="M45 18 Q60 12 75 18" />
    <path d="M50 14 Q60 8 70 14" />
  </svg>
);

const ChessKnightSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 30 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 36 H22 V33 H8 Z" />
    <path d="M10 33 V28 Q10 20 14 16 Q10 14 8 10 Q8 5 14 4 Q16 4 18 6 Q22 10 22 16 Q22 22 20 26 V33" />
    <circle cx="14" cy="10" r="1.5" />
    <path d="M10 16 Q12 15 14 16" />
  </svg>
);

const ChessRookSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 28 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 36 H22 V33 H6 Z" />
    <path d="M8 33 V12 H20 V33" />
    <path d="M6 12 H22" />
    <path d="M6 8 H10 V4 H12 V8 H16 V4 H18 V8 H22 V12 H6 Z" />
  </svg>
);

const MaskPairSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 50 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Happy mask */}
    <circle cx="14" cy="14" r="10" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="12" r="2" />
    <path d="M9 18 Q14 22 19 18" />
    {/* Sad mask */}
    <circle cx="36" cy="14" r="10" />
    <circle cx="32" cy="12" r="2" />
    <circle cx="40" cy="12" r="2" />
    <path d="M31 20 Q36 16 41 20" />
  </svg>
);

const MusicalNotesSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="8" cy="24" rx="4" ry="3" />
    <path d="M12 24 V6" />
    <path d="M12 6 H28 V18" />
    <ellipse cx="24" cy="21" rx="4" ry="3" />
    <path d="M28 21 V9" />
    {/* Eighth note flag */}
    <path d="M12 6 Q18 4 20 8" />
  </svg>
);

const SpritzGlassSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 30 45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 5 L10 28" />
    <path d="M22 5 L20 28" />
    <path d="M8 5 H22" />
    <ellipse cx="15" cy="28" rx="5" ry="2" />
    <path d="M15 30 V38" />
    <path d="M10 38 H20" />
    {/* Ice + orange slice */}
    <path d="M12 14 H18" />
    <circle cx="20" cy="10" r="4" />
    <path d="M20 6 V14" />
  </svg>
);

const BautaMaskSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 5 Q5 8 3 22 Q2 32 8 38 L20 45 L32 38 Q38 32 37 22 Q35 8 20 5Z" />
    <ellipse cx="13" cy="20" rx="5" ry="4" />
    <ellipse cx="27" cy="20" rx="5" ry="4" />
    <path d="M20 24 V32 L17 35" />
  </svg>
);

// Venetian mask repeating background pattern
const maskPattern = `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 20 Q25 20 20 30 Q18 35 22 40 Q28 45 35 42 Q38 41 40 38 Q42 41 45 42 Q52 45 58 40 Q62 35 60 30 Q55 20 40 20Z' stroke='%232563eb' stroke-width='0.6' fill='none' opacity='0.06'/%3E%3Cellipse cx='33' cy='30' rx='5' ry='3' stroke='%232563eb' stroke-width='0.5' fill='none' opacity='0.05'/%3E%3Cellipse cx='47' cy='30' rx='5' ry='3' stroke='%232563eb' stroke-width='0.5' fill='none' opacity='0.05'/%3E%3C/svg%3E")`;

type TierId = 'grand' | 'living' | 'everyday';

interface CultureItem {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Crown;
  content: string;
  extra?: React.ReactNode;
  decorSvg?: React.ReactNode;
}

interface Tier {
  id: TierId;
  label: string;
  icon: typeof Crown;
  color: string;
  borderColor: string;
  badgeBg: string;
  items: CultureItem[];
}

// Carnevale sub-selector component
function CarnevaleSelector() {
  const [carnevale, setCarnevale] = useState<string | null>(null);

  const options = [
    {
      id: 'venice',
      emoji: '🖤',
      label: 'Venice — The Masked Republic',
      tone: 'Elegant. Ritualistic. Historical.',
      crowd: 'Enormous (3 million visitors over 2 weeks)',
      locals: 'Private balls, neighborhood campo parties, not Piazza San Marco',
      resident: 'You\'d attend a private dinner in a palazzo, wearing a bauta mask. The public spectacle is for tourists. The real Carnevale happens behind closed doors — concerts in churches, theatrical performances in candlelit salons, meals that last until dawn.',
    },
    {
      id: 'verona',
      emoji: '🤡',
      label: 'Verona — Bacanal del Gnoco',
      tone: 'Playful. Parades. Communal feasting.',
      crowd: 'Moderate (mostly locals and regional visitors)',
      locals: 'Everyone. This is Verona\'s Carnevale, not a tourist event.',
      resident: 'You\'d follow the parade led by Papà del Gnoco — a giant dumpling king who throws gnocchi into the crowd. Every neighborhood has its own float. Families cook together for weeks. It\'s joyful and slightly absurd in exactly the right way.',
    },
    {
      id: 'small',
      emoji: '🧒',
      label: 'Small-Town Carnevale',
      tone: 'Community-built floats. Family energy. Zero pretension.',
      crowd: 'Small (your neighbors, basically)',
      locals: 'Everyone participates — there\'s no audience, only participants.',
      resident: 'Marostica, Noale, Cittadella — each builds its own floats in garages, sews costumes over wine, and parades through medieval streets. Kids ride on the floats. Grandparents judge the costumes. Nobody posts it on Instagram. That\'s the point.',
    }
  ];

  return (
    <div className="mt-4">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Choose Your Carnevale</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={(e) => { e.stopPropagation(); setCarnevale(carnevale === opt.id ? null : opt.id); }}
            className={cn(
              "rounded-lg border p-3 text-left transition-all duration-300 text-xs",
              carnevale === opt.id
                ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-300/50'
                : 'border-border bg-white/80 hover:bg-amber-50/50'
            )}
          >
            <span className="text-lg">{opt.emoji}</span>
            <p className="font-semibold text-foreground mt-1 text-xs leading-tight">{opt.label}</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">{opt.tone}</p>
          </button>
        ))}
      </div>

      {carnevale && (() => {
        const opt = options.find(o => o.id === carnevale)!;
        return (
          <div className="bg-amber-50/60 rounded-lg p-4 border border-amber-200/40 space-y-2 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-amber-600">Crowd Level</p>
                <p className="text-xs text-muted-foreground">{opt.crowd}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-amber-600">What Locals Attend</p>
                <p className="text-xs text-muted-foreground">{opt.locals}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-amber-600">As a Resident, You'd...</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{opt.resident}</p>
            </div>
          </div>
        );
      })()}

      {/* Mask or No Mask? Cultural subtext */}
      <div className="mt-4 bg-slate-50 rounded-lg p-4 border-l-2 border-slate-300 relative overflow-hidden">
        {/* Bauta mask accent */}
        <BautaMaskSvg className="absolute top-2 right-2 w-8 h-10 text-slate-400 opacity-[0.12]" />
        <p className="text-xs font-bold text-slate-700 mb-1">Mask or No Mask?</p>
        <p className="text-xs text-muted-foreground leading-relaxed pr-10">
          In Venice, anonymity was once political power. Masks erased class distinctions — nobility and merchants mingled, 
          social boundaries blurred, and for a few weeks a year, the Republic's rigid hierarchy dissolved into theater. 
          The bauta mask wasn't costume — it was a democratic technology. That's not tourism trivia. That's identity.
        </p>
      </div>
    </div>
  );
}

const tiers: Tier[] = [
  {
    id: 'grand',
    label: 'Grand Stage',
    icon: Crown,
    color: 'text-amber-600',
    borderColor: 'border-amber-200/60',
    badgeBg: 'bg-amber-100 text-amber-700 border border-amber-200',
    items: [
      {
        id: 'arena',
        title: 'Arena di Verona & Open-Air Opera',
        subtitle: '2,000 years. 15,000 seats. No microphones needed.',
        icon: Theater,
        content: "Built 30 years before the Colosseum, the Arena is not a ruin — it's a working theater. Every summer, the world's greatest voices fill a Roman amphitheater with Verdi and Puccini under open skies. No amplification. No screens. Just human voices bouncing off 2,000-year-old stone.\n\nAs a resident, you'd buy a season pass. You'd bring a cushion and a bottle of wine. You'd watch the sunset paint the arches gold while the orchestra tunes up. By the third year, you'd have a favorite seat, a pre-show restaurant, and strong opinions about which soprano handles Aida's tomb scene best.\n\nPractical note: Season runs June–September. Unreserved stone seats (gradinata) cost €30-35. That's world-class opera for the price of a pizza dinner."
      },
      {
        id: 'scrovegni',
        title: 'Scrovegni Chapel & Giotto',
        subtitle: 'The frescoes that changed Western art. 15 minutes at a time.',
        icon: Crown,
        content: "In 1305, Giotto painted the interior of a small chapel in Padua and accidentally invented modern art. Before him, paintings were flat, symbolic, Byzantine. After him, human figures had weight, emotion, space. Art historians argue about who matters more — Giotto or Michelangelo — and it's not a settled question.\n\nYou enter in groups of 25, after 15 minutes in a dehumidification chamber. You get exactly 15 minutes inside. It sounds restrictive, but that limitation creates intensity — you look at these frescoes with the attention they deserve, not the glazed museum shuffle.\n\nAs a resident of Padua, you'd visit multiple times across different seasons. The light changes everything. January morning light on the Lamentation scene is a completely different experience from June afternoon light on the Last Judgment."
      }
    ]
  },
  {
    id: 'living',
    label: 'Living Traditions',
    icon: Flame,
    color: 'text-orange-600',
    borderColor: 'border-orange-200/60',
    badgeBg: 'bg-orange-100 text-orange-700 border border-orange-200',
    items: [
      {
        id: 'carnevale',
        title: 'Carnevale in Veneto',
        subtitle: 'Three versions. Three vibes. One is for you.',
        icon: Users,
        content: "Everyone knows Venice Carnevale. But Veneto actually has dozens of carnevali — each with completely different energy, crowd levels, and cultural DNA. The choice you make says something about who you are.",
        extra: <CarnevaleSelector />,
        decorSvg: <MaskPairSvg className="w-6 h-4 text-orange-400 opacity-50 inline-block ml-1.5 -mt-0.5" />
      },
      {
        id: 'marostica',
        title: 'Marostica Living Chess Game',
        subtitle: 'Every two years, the piazza becomes a chessboard. Humans are the pieces.',
        icon: Swords,
        content: "In the second weekend of September (even years), Marostica's main piazza transforms into a giant chessboard. Living actors in Renaissance costume play an actual chess game, recreating a 1454 match between two noblemen who competed for the hand of the castellan's daughter. Instead of a duel, they played chess. Instead of blood, they got spectacle.\n\n500+ performers. Renaissance costumes sewn by the town. Fire-breathers, flag-throwers, processions. The entire town participates — this isn't a tourist attraction, it's a community ritual that happens to be spectacular.\n\nMarostica is also the cherry capital of Veneto. If you visit in late May/early June, the cherry festival overlaps with the chess game rehearsals. It's a very specific kind of wonderful.",
        extra: (
          <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-200 relative overflow-hidden">
            {/* Chess rook accent */}
            <ChessRookSvg className="absolute top-2 right-2 w-5 h-7 text-amber-500 opacity-[0.18]" />
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
              <p className="text-xs font-bold text-foreground">Did You Know?</p>
            </div>
            <p className="text-xs text-muted-foreground pr-6">
              The chess moves played in each performance are different — the game is choreographed fresh each time by a chess master. The actors learn their positions through months of rehearsal. Marostica also hosts a miniature version for children in the off-years.
            </p>
          </div>
        ),
        decorSvg: <ChessKnightSvg className="w-5 h-6 text-orange-400 opacity-50 inline-block ml-1.5 -mt-0.5" />
      }
    ]
  },
  {
    id: 'everyday',
    label: 'Everyday Culture',
    icon: Coffee,
    color: 'text-stone-600',
    borderColor: 'border-stone-200/60',
    badgeBg: 'bg-stone-100 text-stone-700 border border-stone-200',
    items: [
      {
        id: 'vivaldi',
        title: 'Venetian Music Heritage',
        subtitle: 'Vivaldi\'s orphan musicians, La Fenice\'s rebirth, and why Venice still sounds different.',
        icon: Music,
        content: "Venice's four Ospedali — charitable institutions for orphaned girls — produced the finest musicians in 18th-century Europe. Vivaldi taught at the Ospedale della Pietà for decades, composing specifically for these young women whose talent drew audiences from across the continent. Royalty attended their concerts. Goethe wept.\n\nThis is wildly under-discussed. An all-female orchestra in the 1720s, performing at the highest level in Europe, trained by the most innovative composer alive. The music wasn't incidental — it was the institution's funding mechanism. The girls' virtuosity attracted donations that kept the orphanage running.\n\nLa Fenice — Venice's opera house — has burned down twice (1774, 1996) and been rebuilt both times, each time more beautiful. 'La Fenice' means 'The Phoenix.' The name was prophetic. Today it hosts world-class opera and symphony seasons. Resident tip: standing tickets are €15-20.",
        decorSvg: <MusicalNotesSvg className="w-7 h-5 text-stone-400 opacity-50 inline-block ml-1.5 -mt-0.5" />
      },
      {
        id: 'aperitivo',
        title: 'Aperitivo & Passeggiata',
        subtitle: 'The daily rituals that actually define life in Veneto.',
        icon: Coffee,
        content: "The spritz was born in Veneto — not as a trend, but as a habit. Austrian soldiers in the 19th century asked bartenders to 'spritz' (spray) their wine with water. Venetians added Aperol or Select, and a ritual was born. By 6 PM every day, the bacari fill up, cicchetti appear on counters, and the entire social fabric of Veneto life activates.\n\nThe passeggiata — the evening walk — is the other daily ritual no one explains to foreigners. Between 5-7 PM, entire towns empty onto their main streets. Families, couples, teenagers, elderly — everyone walks. You see people, you're seen, you stop and talk. It's not exercise. It's society operating as designed.\n\nIn Padua, the passeggiata route follows Prato della Valle to Via Roma. In Verona, it loops around Piazza Bra. In Treviso, it follows the canals. Learning your town's passeggiata route is the first step to becoming a local. The second step is having opinions about where to stop for your spritz.",
        decorSvg: <SpritzGlassSvg className="w-5 h-7 text-stone-400 opacity-50 inline-block ml-1.5 -mt-0.5" />
      }
    ]
  }
];

export default function VenetoCultureAlive() {
  const [expandedTier, setExpandedTier] = useState<TierId | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-blue-50/30 relative overflow-hidden">
      {/* Venetian mask repeating background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: maskPattern, backgroundSize: '80px 80px' }}
        aria-hidden="true"
      />

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 relative">
          {/* Large Venetian mask watermark behind header */}
          <VenetianMaskSvg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-44 text-blue-400 opacity-[0.05] pointer-events-none" />

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-200 relative">
            <Theater className="h-4 w-4" />
            Culture
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground relative">
            Not Just Pretty. <span className="text-blue-600">Alive.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto relative">
            Veneto's culture isn't in museums — it's in amphitheaters still hosting opera, 
            piazzas still playing chess, and bacari still pouring spritz at 6 PM sharp.
          </p>
        </div>

        {/* Three Tiers */}
        <div className="space-y-4">
          {tiers.map(tier => {
            const TierIcon = tier.icon;
            const isOpen = expandedTier === tier.id;

            return (
              <div key={tier.id} className={cn(
                "rounded-xl border transition-all duration-500 bg-white/80",
                tier.borderColor
              )}>
                {/* Tier header */}
                <button
                  onClick={() => setExpandedTier(isOpen ? null : tier.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("px-3 py-1 rounded-full text-xs font-bold", tier.badgeBg)}>
                      <TierIcon className="h-3.5 w-3.5 inline mr-1.5" />
                      {tier.label}
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {tier.items.length} {tier.items.length === 1 ? 'experience' : 'experiences'}
                    </span>
                  </div>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-300",
                    isOpen && 'rotate-180'
                  )} />
                </button>

                {/* Tier content */}
                <div className={cn(
                  "overflow-hidden transition-all duration-500",
                  isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                )}>
                  <div className="px-5 pb-5 space-y-3">
                    {tier.items.map(item => {
                      const ItemIcon = item.icon;
                      const isItemOpen = expandedItem === item.id;

                      return (
                        <div key={item.id} className="rounded-lg border border-border bg-white/80 overflow-hidden">
                          <button
                            onClick={() => setExpandedItem(isItemOpen ? null : item.id)}
                            className="w-full flex items-start justify-between p-4 text-left"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <ItemIcon className={cn("h-4 w-4", tier.color)} />
                                <h4 className="font-bold text-foreground text-sm">
                                  {item.title}
                                  {/* Inline decorative SVG next to title */}
                                  {item.decorSvg}
                                </h4>
                              </div>
                              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                            </div>
                            <ChevronDown className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0 mt-1",
                              isItemOpen && 'rotate-180'
                            )} />
                          </button>

                          <div className={cn(
                            "overflow-hidden transition-all duration-400",
                            isItemOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
                          )}>
                            <div className="px-4 pb-4">
                              {item.content.split('\n\n').map((p, i) => (
                                <p key={i} className="text-muted-foreground text-sm leading-relaxed mb-3">{p}</p>
                              ))}
                              {item.extra}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
