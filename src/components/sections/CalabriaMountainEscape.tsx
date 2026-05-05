import { Mountain, Thermometer, TreePine, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MountainPark {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  elevationRange: string;
  augustHigh: string;
  coastComparison: { town: string; temp: string };
  features: string[];
  hilltopTowns: string[];
  driveToCoast: string;
  vibe: string;
}

const parks: MountainPark[] = [
  {
    id: 'sila',
    name: 'Parco Nazionale della Sila',
    subtitle: 'Calabria\'s alpine plateau',
    image: '/images/calabria/sila-lake.jpg',
    elevationRange: '1,000 – 1,928 m',
    augustHigh: '24°C',
    coastComparison: { town: 'Crotone', temp: '34°C' },
    features: [
      'Three large alpine lakes — Cecita, Arvo, Ampollino',
      'Beech and Calabrian pine forests, often called Italy\'s \"Little Switzerland\"',
      'Wolves, deer, and one of Europe\'s densest porcini concentrations',
      'Ski station at Lorica for genuine winter snow',
    ],
    hilltopTowns: ['Camigliatello Silano', 'San Giovanni in Fiore', 'Lorica', 'Taverna'],
    driveToCoast: '45–60 min to either coast',
    vibe: 'Cool, green, and quiet. The Sila is where Calabrian families historically escaped August.',
  },
  {
    id: 'aspromonte',
    name: 'Parco Nazionale dell\'Aspromonte',
    subtitle: 'The wild south',
    image: '/images/calabria/aspromonte-ridge.jpg',
    elevationRange: '0 – 1,955 m',
    augustHigh: '26°C',
    coastComparison: { town: 'Reggio Calabria', temp: '33°C' },
    features: [
      'Dramatic canyon and ridge landscape — feels more rugged than Sila',
      'Greek-speaking (Grecanico) villages still active in the foothills',
      'Centuries-old chestnut and fir forests, hidden waterfalls',
      'View of Mount Etna across the Strait on clear days',
    ],
    hilltopTowns: ['Gambarie', 'Bova', 'Gerace', 'Santo Stefano in Aspromonte'],
    driveToCoast: '30–50 min from either side',
    vibe: 'Wilder, less developed, deeply tied to ancient cultures. For people who like genuine solitude.',
  },
];

// Elevation pins for the visual slider
const elevationPins = [
  { label: 'Sea level', height: 0, x: 2 },
  { label: 'Reggio', height: 31, x: 10 },
  { label: 'Cosenza', height: 238, x: 20 },
  { label: 'Bova', height: 820, x: 45 },
  { label: 'Camigliatello', height: 1290, x: 70 },
  { label: 'Gambarie', height: 1310, x: 73 },
  { label: 'Botte Donato', height: 1928, x: 98 },
];

export function CalabriaMountainEscape() {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <Mountain className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">The Mountains Above the Sea</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Calabria is the most mountainous region in southern Italy. Two national parks
            sit within an hour of either coast — making 35°C August afternoons optional, not inevitable.
          </p>
        </div>

        {/* Park comparison cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {parks.map((p) => (
            <article key={p.id} className="rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.subtitle}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={1280}
                  height={800}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white/80 text-xs uppercase tracking-wider mb-1">{p.subtitle}</p>
                  <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                </div>
              </div>

              <div className="p-5 md:p-6 space-y-4">
                <p className="italic text-foreground/90">{p.vibe}</p>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                      <Mountain className="h-3.5 w-3.5" /> Elevation
                    </div>
                    <p className="font-semibold text-foreground text-sm">{p.elevationRange}</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-wide text-primary">
                      <Thermometer className="h-3.5 w-3.5" /> August high
                    </div>
                    <p className="font-semibold text-foreground text-sm">
                      {p.augustHigh}{' '}
                      <span className="text-muted-foreground font-normal">vs {p.coastComparison.temp} in {p.coastComparison.town}</span>
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TreePine className="h-4 w-4 text-primary" />
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">What you find here</p>
                  </div>
                  <ul className="space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Towns + drive */}
                <div className="pt-3 border-t border-border space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {p.hilltopTowns.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{p.driveToCoast}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Elevation slider */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-8">
          <h3 className="text-lg font-semibold mb-1">Elevation in 60 minutes</h3>
          <p className="text-sm text-muted-foreground mb-8">
            From Mediterranean sea level to nearly 2,000 m — without leaving the region.
          </p>

          <div className="relative h-32 md:h-40">
            {/* Gradient slope background */}
            <div
              className="absolute inset-x-0 bottom-0 h-full rounded-md"
              style={{
                background: 'linear-gradient(to top right, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.25))',
                clipPath: 'polygon(0% 100%, 100% 0%, 100% 100%)',
              }}
            />
            {/* Pins */}
            {elevationPins.map((pin) => {
              const bottom = (pin.height / 1928) * 100;
              return (
                <div
                  key={pin.label}
                  className="absolute -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${pin.x}%`, bottom: `${bottom}%` }}
                >
                  <div className="text-[10px] md:text-xs font-semibold text-foreground whitespace-nowrap mb-1">
                    {pin.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-1">{pin.height} m</div>
                  <div className="h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                </div>
              );
            })}
            {/* Baseline */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
}