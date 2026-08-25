import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, ShieldCheck, AlertTriangle } from 'lucide-react';

const levels = [
  {
    kmh: 40,
    name: 'Bora chiara, light day',
    detail: 'Clear skies, dry air, flags snapping. Locals call this good weather — the city looks scrubbed and the sea turns deep blue.',
    living: 'No impact beyond a jacket and a hand on your hat along the seafront.',
    tone: 'calm'
  },
  {
    kmh: 70,
    name: 'A proper Bora',
    detail: 'Gusts you lean into. Outdoor café tables come inside, scooters get parked flat, awnings are rolled up.',
    living: 'Balcony furniture must be anchored or stored. Umbrellas are useless. Expect a few of these each winter month.',
    tone: 'watch'
  },
  {
    kmh: 100,
    name: 'Bora scura, storm force',
    detail: 'Trieste strings ropes along exposed streets in the old days for a reason. Ferries and the Grado lagoon services can suspend.',
    living: 'Windows rattle in older single-glazed flats. Driving high-sided vehicles on the coastal road is genuinely unpleasant.',
    tone: 'strong'
  },
  {
    kmh: 130,
    name: 'Record territory',
    detail: 'Trieste has logged gusts above 150 km/h. Rare, but not folklore — it happens, usually a handful of times per decade.',
    living: 'Roof tiles, scaffolding and street furniture become the story. Schools and the port pause; the city carries on regardless.',
    tone: 'extreme'
  }
];

const shelter = [
  { town: 'Trieste (Barcola, seafront)', level: 'Fully exposed', note: 'The Bora funnels straight off the Karst plateau onto the waterfront.', bad: true },
  { town: 'Trieste (Città Vecchia)', level: 'Partly sheltered', note: 'Narrow old-town streets break the gusts — worth targeting when flat-hunting.', bad: false },
  { town: 'Muggia', level: 'Partly sheltered', note: 'Tucked south of the bay, noticeably calmer than the Barcola side.', bad: false },
  { town: 'Duino / Sistiana', level: 'Exposed', note: 'Cliff-top position catches the full plateau wind.', bad: true },
  { town: 'Grado', level: 'Mild', note: 'Lagoon flats feel the wind but nothing like the Karst edge.', bad: false },
  { town: 'Udine & the plain', level: 'Calm', note: 'Forty minutes inland the Bora is a weather report, not a lifestyle factor.', bad: false }
];

export default function FriuliBoraMeter() {
  const [i, setI] = useState(1);
  const level = levels[i];
  const pct = (level.kmh / 150) * 100;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Wind className="h-10 w-10 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">The Bora, Honestly</h2>
          <p className="text-lg text-muted-foreground">
            No other Italian region has a wind with its own vocabulary. Before you buy on the Trieste coast, know what you're signing up for.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-10">
          <Card className="border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm uppercase tracking-wide text-muted-foreground">Gust strength</span>
                <span className="text-3xl font-bold text-primary tabular-nums">{level.kmh} km/h</span>
              </div>

              <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-4">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <input
                type="range"
                min={0}
                max={levels.length - 1}
                step={1}
                value={i}
                onChange={(e) => setI(Number(e.target.value))}
                aria-label="Bora gust strength"
                className="w-full accent-primary cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-muted-foreground mt-1 mb-6">
                {levels.map((l) => (
                  <span key={l.kmh}>{l.kmh}</span>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-2">{level.name}</h3>
              <p className="text-foreground/80 mb-4 leading-relaxed">{level.detail}</p>
              <div className="rounded-lg bg-muted/50 border border-border p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">{level.living}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-center">Where the wind actually lands</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {shelter.map((s) => (
              <div
                key={s.town}
                className={cn(
                  'rounded-lg border p-4 bg-background',
                  s.bad ? 'border-destructive/40' : 'border-primary/30'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {s.bad ? (
                    <Wind className="h-4 w-4 text-destructive" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  )}
                  <span className="font-semibold text-sm">{s.town}</span>
                </div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{s.level}</p>
                <p className="text-sm text-foreground/80">{s.note}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">
            Bora days cluster from late autumn to early spring. Figures are indicative of typical Trieste conditions, not a forecast.
          </p>
        </div>
      </div>
    </section>
  );
}
