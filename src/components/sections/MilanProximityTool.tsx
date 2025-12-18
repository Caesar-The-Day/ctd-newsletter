import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Train, Building2, Plane, Theater, MapPin } from 'lucide-react';

interface Town {
  id: string;
  name: string;
  trainTime: number;
  trainTimeLabel: string;
  station: string;
  lifestyle: string;
  whyItWorks: string;
  relevance: ('healthcare' | 'travel' | 'culture')[];
}

const towns: Town[] = [
  // Within 30 minutes
  {
    id: 'monza',
    name: 'Monza',
    trainTime: 12,
    trainTimeLabel: '10–15 min',
    station: 'Monza',
    lifestyle: 'Affluent, residential, highly organized, with major green space and zero tourist theater.',
    whyItWorks: "You're effectively inside Milan's ecosystem without paying Milan's lifestyle tax.",
    relevance: ['healthcare', 'travel', 'culture']
  },
  {
    id: 'sesto',
    name: 'Sesto San Giovanni',
    trainTime: 17,
    trainTimeLabel: '15–20 min',
    station: 'Sesto San Giovanni',
    lifestyle: 'Dense, practical, and well connected; historically industrial, now residential.',
    whyItWorks: 'Direct access to hospitals, transit, and services with no pretense.',
    relevance: ['healthcare', 'travel']
  },
  {
    id: 'lodi',
    name: 'Lodi',
    trainTime: 27,
    trainTimeLabel: '25–30 min',
    station: 'Lodi',
    lifestyle: 'Smaller city with a real local rhythm and reliable rail access.',
    whyItWorks: 'Calm daily life with Milan available on demand.',
    relevance: ['healthcare', 'travel', 'culture']
  },
  {
    id: 'pavia',
    name: 'Pavia',
    trainTime: 30,
    trainTimeLabel: '~30 min',
    station: 'Pavia',
    lifestyle: 'University town, walkable center, quieter intellectual atmosphere.',
    whyItWorks: "Access to Milan's gravity without losing identity.",
    relevance: ['healthcare', 'culture']
  },
  // Within 45 minutes
  {
    id: 'como',
    name: 'Como',
    trainTime: 37,
    trainTimeLabel: '35–40 min',
    station: 'Como San Giovanni',
    lifestyle: 'Functional lake city with year-round services and rail access.',
    whyItWorks: 'Lake access with urban reliability, if you accept tourism.',
    relevance: ['healthcare', 'travel', 'culture']
  },
  {
    id: 'busto',
    name: 'Busto Arsizio',
    trainTime: 37,
    trainTimeLabel: '35–40 min',
    station: 'Busto Arsizio',
    lifestyle: 'Unglamorous but extremely well connected; strong services.',
    whyItWorks: 'You trade charm for access and affordability.',
    relevance: ['healthcare', 'travel']
  },
  {
    id: 'varese',
    name: 'Varese',
    trainTime: 42,
    trainTimeLabel: '40–45 min',
    station: 'Varese',
    lifestyle: 'Green, residential, quietly affluent, near the Swiss border.',
    whyItWorks: 'Order, healthcare access, and breathing room.',
    relevance: ['healthcare', 'travel']
  },
  {
    id: 'bergamo',
    name: 'Bergamo',
    trainTime: 49,
    trainTimeLabel: '48–50 min',
    station: 'Bergamo',
    lifestyle: 'Historic upper city plus modern lower city; strong healthcare and airport access.',
    whyItWorks: "You get Milan's benefits without living under its pressure.",
    relevance: ['healthcare', 'travel', 'culture']
  },
  // Within 60 minutes
  {
    id: 'brescia',
    name: 'Brescia',
    trainTime: 53,
    trainTimeLabel: '52–55 min',
    station: 'Brescia',
    lifestyle: 'Industrial, understated, highly functional city with strong hospitals.',
    whyItWorks: "Full-service city life without Milan's density.",
    relevance: ['healthcare', 'travel']
  },
  {
    id: 'lecco',
    name: 'Lecco',
    trainTime: 57,
    trainTimeLabel: '55–60 min',
    station: 'Lecco',
    lifestyle: 'Mountain-lake city with strong rail links and active local life.',
    whyItWorks: 'Nature and function coexist without resort behavior.',
    relevance: ['healthcare', 'culture']
  },
  {
    id: 'cremona',
    name: 'Cremona',
    trainTime: 60,
    trainTimeLabel: '~60 min',
    station: 'Cremona',
    lifestyle: 'Elegant, unhurried, culturally rich, with stable daily rhythms.',
    whyItWorks: 'Traditional city life with predictable access when needed.',
    relevance: ['culture']
  },
  {
    id: 'mantova',
    name: 'Mantova',
    trainTime: 63,
    trainTimeLabel: '60–65 min',
    station: 'Mantova',
    lifestyle: 'Compact, Renaissance city with a calm, livable center.',
    whyItWorks: 'You accept distance in exchange for beauty and peace.',
    relevance: ['culture']
  }
];

const timeBands = [
  { value: 30, label: '30 minutes', description: 'Milan access without Milan intensity' },
  { value: 45, label: '45 minutes', description: 'The sweet spot for most retirees' },
  { value: 60, label: '60 minutes', description: 'Separation, not distance' }
];

const reasons = [
  { value: 'healthcare', label: 'Healthcare', icon: Building2 },
  { value: 'travel', label: 'Travel', icon: Plane },
  { value: 'culture', label: 'Culture', icon: Theater },
  { value: 'all', label: 'All of the above', icon: MapPin }
];

export function MilanProximityTool() {
  const [selectedTime, setSelectedTime] = useState<number>(45);
  const [selectedReason, setSelectedReason] = useState<string>('all');

  const filteredTowns = useMemo(() => {
    return towns.filter(town => {
      const withinTime = town.trainTime <= selectedTime;
      const matchesReason = selectedReason === 'all' || 
        town.relevance.includes(selectedReason as 'healthcare' | 'travel' | 'culture');
      return withinTime && matchesReason;
    });
  }, [selectedTime, selectedReason]);

  const getBandLabel = (time: number) => {
    if (time <= 30) return '30 min';
    if (time <= 45) return '45 min';
    return '60 min';
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Live Near Milan, Not In It
          </h2>
          <p className="text-lg text-muted-foreground">
            How far you can live from Milan and still use it when it matters
          </p>
        </div>

        {/* Intro text */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-muted-foreground italic">
            "Most people don't need to live in Milan. They need to be able to use Milan."
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-12 space-y-8">
          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Maximum train time to Milan
            </label>
            <div className="flex flex-wrap gap-3">
              {timeBands.map((band) => (
                <button
                  key={band.value}
                  onClick={() => setSelectedTime(band.value)}
                  className={cn(
                    "px-5 py-3 rounded-lg border-2 transition-all duration-200",
                    "hover:border-primary/50",
                    selectedTime === band.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground"
                  )}
                >
                  <span className="font-semibold">{band.label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {timeBands.find(b => b.value === selectedTime)?.description}
            </p>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Primary reason you care about Milan
            </label>
            <div className="flex flex-wrap gap-3">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <button
                    key={reason.value}
                    onClick={() => setSelectedReason(reason.value)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200",
                      "hover:border-primary/50",
                      selectedReason === reason.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{reason.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visual Distance Rings */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative aspect-[2/1] bg-background rounded-xl border border-border overflow-hidden">
            {/* Distance rings emanating from Milan */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* 60 min ring */}
              <div className={cn(
                "absolute w-[90%] h-[180%] rounded-full border-2 transition-all duration-500",
                selectedTime >= 60 ? "border-primary/30 bg-primary/5" : "border-border/30"
              )}>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background px-2">
                  60 min
                </span>
              </div>
              {/* 45 min ring */}
              <div className={cn(
                "absolute w-[60%] h-[120%] rounded-full border-2 transition-all duration-500",
                selectedTime >= 45 ? "border-primary/40 bg-primary/5" : "border-border/30"
              )}>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background px-2">
                  45 min
                </span>
              </div>
              {/* 30 min ring */}
              <div className={cn(
                "absolute w-[30%] h-[60%] rounded-full border-2 transition-all duration-500",
                selectedTime >= 30 ? "border-primary/50 bg-primary/10" : "border-border/30"
              )}>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background px-2">
                  30 min
                </span>
              </div>
              {/* Milan center point */}
              <div className="relative z-10 w-4 h-4 bg-primary rounded-full shadow-lg">
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-foreground whitespace-nowrap">
                  Milano
                </span>
              </div>
            </div>

            {/* Town dots positioned around */}
            {filteredTowns.map((town, index) => {
              const angle = (index / filteredTowns.length) * Math.PI * 2 - Math.PI / 2;
              const radius = (town.trainTime / 70) * 40; // Scale radius based on time
              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius * 0.5; // Flatten for ellipse effect
              
              return (
                <div
                  key={town.id}
                  className="absolute w-2.5 h-2.5 bg-foreground/70 rounded-full transition-all duration-500 hover:scale-150 hover:bg-primary cursor-pointer group"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                      {town.name} · {town.trainTimeLabel}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Rail line indicators */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Train className="w-3.5 h-3.5" />
              <span>Rail connections</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {filteredTowns.length} town{filteredTowns.length !== 1 ? 's' : ''} within {selectedTime} minutes
            </h3>
          </div>

          {filteredTowns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No towns match your current filters. Try expanding your time range.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTowns.map((town) => (
                <div
                  key={town.id}
                  className="bg-background rounded-lg border border-border p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-foreground">{town.name}</h4>
                        <span className="text-sm px-2 py-0.5 bg-muted rounded text-muted-foreground">
                          {getBandLabel(town.trainTime)}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {town.lifestyle}
                      </p>
                      <p className="text-foreground text-sm">
                        <span className="font-medium">Why it works:</span> {town.whyItWorks}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0 md:text-right">
                      <Train className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-foreground">{town.trainTimeLabel}</div>
                        <div className="text-xs">to Milano Centrale</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer text */}
        <div className="max-w-2xl mx-auto text-center mt-12 space-y-4">
          <p className="text-muted-foreground italic">
            "Lombardia works best when you treat Milan as a resource, not a residence."
          </p>
          <p className="text-xs text-muted-foreground/70">
            Train times are approximate and reflect normal daytime schedules, not peak disruptions.
          </p>
        </div>
      </div>
    </section>
  );
}
