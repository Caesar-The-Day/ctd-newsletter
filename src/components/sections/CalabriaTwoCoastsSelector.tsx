import { useState } from 'react';
import { Waves, Sunset, Sunrise, Users, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Coast {
  id: 'tyrrhenian' | 'ionian';
  name: string;
  subtitle: string;
  image: string;
  vibe: string;
  water: string;
  beach: string;
  orientation: string;
  orientationIcon: typeof Sunset;
  towns: string[];
  crowds: string;
  bestFor: string;
  augustWaterTemp: string;
}

const coasts: Coast[] = [
  {
    id: 'tyrrhenian',
    name: 'Tyrrhenian Coast',
    subtitle: 'The dramatic west',
    image: '/images/calabria/coast-tyrrhenian.jpg',
    vibe: 'Sandstone cliffs, Stromboli on the horizon, lively summer towns built into the rock.',
    water: 'Deep, clear, often blue-violet. Drops off quickly from shore.',
    beach: 'Mostly small sandy coves between cliffs; a few wide stretches.',
    orientation: 'Faces west — sunset over the sea.',
    orientationIcon: Sunset,
    towns: ['Tropea', 'Scilla', 'Pizzo', 'Diamante', 'Capo Vaticano'],
    crowds: 'Busy in July–August; quiet by mid-September.',
    bestFor: 'Lively piazza life, dramatic photography, evening passeggiata.',
    augustWaterTemp: '26°C',
  },
  {
    id: 'ionian',
    name: 'Ionian Coast',
    subtitle: 'The quiet east',
    image: '/images/calabria/coast-ionian.jpg',
    vibe: 'Long sandy beaches, shallow turquoise water, slower pace, fewer postcards.',
    water: 'Warmer, calmer, shallower. Walk-out swimming for a hundred meters.',
    beach: 'Wide sandy stretches with dunes; easier on knees and umbrellas.',
    orientation: 'Faces east — sunrise over the sea.',
    orientationIcon: Sunrise,
    towns: ['Soverato', 'Roccella Ionica', 'Capo Rizzuto', 'Locri', 'Caulonia Marina'],
    crowds: 'Italian-family beach culture; rarely overwhelmed.',
    bestFor: 'Daily swimming, retirees with mobility considerations, quieter living.',
    augustWaterTemp: '28°C',
  },
];

const comparisonRows: Array<{ label: string; key: keyof Pick<Coast, 'augustWaterTemp' | 'beach' | 'orientation' | 'crowds'> }> = [
  { label: 'August water', key: 'augustWaterTemp' },
  { label: 'Beach character', key: 'beach' },
  { label: 'Sun orientation', key: 'orientation' },
  { label: 'Crowd level', key: 'crowds' },
];

export function CalabriaTwoCoastsSelector() {
  const [active, setActive] = useState<Coast['id']>('tyrrhenian');

  return (
    <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <Waves className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Two Coasts, Two Calabrias</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Calabria is the only Italian region with two genuinely different seas.
            The choice between them shapes nearly everything about daily life here.
          </p>
        </div>

        {/* Mobile tab toggle */}
        <div className="md:hidden flex gap-2 mb-6 p-1 bg-muted rounded-lg">
          {coasts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                active === c.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Desktop split view */}
        <div className="hidden md:grid grid-cols-2 gap-6 mb-10">
          {coasts.map((c) => (
            <CoastCard key={c.id} coast={c} />
          ))}
        </div>

        {/* Mobile single view */}
        <div className="md:hidden mb-10">
          {coasts.filter((c) => c.id === active).map((c) => (
            <CoastCard key={c.id} coast={c} />
          ))}
        </div>

        {/* At-a-glance comparison */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-3 px-4 md:px-6 py-3 bg-muted/50 text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <div>At a glance</div>
            <div className="text-center">Tyrrhenian</div>
            <div className="text-center">Ionian</div>
          </div>
          {comparisonRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 px-4 md:px-6 py-3 border-t border-border text-sm items-start"
            >
              <div className="font-medium text-foreground">{row.label}</div>
              <div className="text-center text-muted-foreground">{coasts[0][row.key]}</div>
              <div className="text-center text-muted-foreground">{coasts[1][row.key]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoastCard({ coast }: { coast: Coast }) {
  const OrientationIcon = coast.orientationIcon;
  return (
    <article className="rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={coast.image}
          alt={`${coast.name} — ${coast.vibe}`}
          className="w-full h-full object-cover"
          loading="lazy"
          width={1280}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white/80 text-xs uppercase tracking-wider mb-1">{coast.subtitle}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white">{coast.name}</h3>
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-4">
        <p className="italic text-foreground/90 leading-relaxed">{coast.vibe}</p>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Waves className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Water: </span>{coast.water}</p>
          </div>
          <div className="flex items-start gap-3">
            <OrientationIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">{coast.orientation}</p>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Best for: </span>{coast.bestFor}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">Signature towns</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {coast.towns.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}