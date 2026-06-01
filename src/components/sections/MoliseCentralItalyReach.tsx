import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Train, BusFront, Plane, Compass, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'car' | 'train' | 'bus';

interface Leg {
  mode: Mode;
  time: string;
  via: string;
  cost?: string;
  note?: string;
}

interface Destination {
  id: string;
  name: string;
  kind: 'city' | 'airport';
  badge?: string;
  legs: Partial<Record<Mode, Leg>>;
  best: Mode;
}

interface OriginData {
  id: string;
  name: string;
  blurb: string;
  destinations: Destination[];
}

const DATA: OriginData[] = [
  {
    id: 'campobasso',
    name: 'Campobasso',
    blurb: 'The regional capital. Best balance of rail + road, but the mountains slow everything north of you.',
    destinations: [
      {
        id: 'rome', name: 'Rome', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~2h45', via: 'SS17 → A1 at San Vittore', cost: '€15 tolls + fuel' },
          train: { mode: 'train', time: '~3h30', via: 'Direct to Roma Tiburtina (electrification works ongoing)', cost: '€15–25' },
          bus: { mode: 'bus', time: '~3h15', via: 'Flixbus / SATI direct', cost: '€12–20' },
        },
        best: 'car',
      },
      {
        id: 'naples', name: 'Naples', kind: 'city', badge: 'Closest big city',
        legs: {
          car: { mode: 'car', time: '~1h45', via: 'A1 via Caianello', cost: '€10 tolls + fuel' },
          train: { mode: 'train', time: '~3h', via: '1 change at Vairano-Caianello', cost: '€12–18' },
          bus: { mode: 'bus', time: '~2h30', via: 'Molise Trasporti direct', cost: '€10–15' },
        },
        best: 'car',
      },
      {
        id: 'pescara', name: 'Pescara', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~1h45', via: 'SS17 → A14 via Vasto', cost: '€8 tolls + fuel' },
          bus: { mode: 'bus', time: '~2h30', via: 'GTM regional bus', cost: '€10' },
        },
        best: 'car',
      },
      {
        id: 'termoli', name: 'Termoli (coast)', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~1h', via: 'SS647 Fondo Valle del Biferno', cost: 'Fuel only' },
          bus: { mode: 'bus', time: '~1h30', via: 'SATI line', cost: '€5' },
        },
        best: 'car',
      },
      {
        id: 'nap', name: 'Naples Capodichino', kind: 'airport', badge: 'NAP',
        legs: {
          car: { mode: 'car', time: '~2h', via: 'A1 + Tangenziale di Napoli', cost: '€12 tolls' },
          bus: { mode: 'bus', time: '~2h45', via: 'Molise Trasporti to NAP', cost: '€15' },
        },
        best: 'car',
      },
      {
        id: 'fco', name: 'Rome Fiumicino', kind: 'airport', badge: 'FCO',
        legs: {
          car: { mode: 'car', time: '~3h15', via: 'SS17 → A1 → GRA', cost: '€18 tolls' },
          train: { mode: 'train', time: '~4h30', via: 'Roma Tiburtina + Leonardo Express', cost: '€30' },
        },
        best: 'car',
      },
    ],
  },
  {
    id: 'termoli',
    name: 'Termoli',
    blurb: 'The coastal escape hatch. Adriatic rail spine puts you on a Frecciarossa in minutes.',
    destinations: [
      {
        id: 'rome', name: 'Rome', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~3h15', via: 'SS650 Trignina → A1', cost: '€18 tolls' },
          train: { mode: 'train', time: '~4h', via: 'Adriatic line + change at Pescara', cost: '€35–55' },
          bus: { mode: 'bus', time: '~4h', via: 'Flixbus seasonal', cost: '€15–25' },
        },
        best: 'car',
      },
      {
        id: 'naples', name: 'Naples', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~3h', via: 'A14/SS16 → A16 Avellino', cost: '€16 tolls' },
          train: { mode: 'train', time: '~4h', via: 'Via Foggia or via Caianello', cost: '€25' },
        },
        best: 'car',
      },
      {
        id: 'bologna', name: 'Bologna', kind: 'city', badge: 'High-speed',
        legs: {
          train: { mode: 'train', time: '~3h45', via: 'Direct Frecciarossa / Frecciargento', cost: '€45–80' },
          car: { mode: 'car', time: '~4h30', via: 'A14 north', cost: '€30 tolls' },
        },
        best: 'train',
      },
      {
        id: 'bari', name: 'Bari', kind: 'city',
        legs: {
          train: { mode: 'train', time: '~1h45', via: 'Direct Frecciarossa', cost: '€25–45' },
          car: { mode: 'car', time: '~2h30', via: 'A14 south', cost: '€14 tolls' },
        },
        best: 'train',
      },
      {
        id: 'psr', name: 'Pescara — Abruzzo', kind: 'airport', badge: 'PSR',
        legs: {
          car: { mode: 'car', time: '~1h15', via: 'A14 north', cost: '€6 tolls' },
          train: { mode: 'train', time: '~1h15', via: 'Adriatic line to Pescara Centrale + bus', cost: '€12' },
        },
        best: 'car',
      },
      {
        id: 'bri', name: 'Bari Karol Wojtyła', kind: 'airport', badge: 'BRI',
        legs: {
          car: { mode: 'car', time: '~2h30', via: 'A14 south', cost: '€14 tolls' },
          train: { mode: 'train', time: '~2h30', via: 'Frecciarossa to Bari + airport shuttle', cost: '€30' },
        },
        best: 'car',
      },
    ],
  },
  {
    id: 'isernia',
    name: 'Isernia',
    blurb: 'The western pivot. Closest point in Molise to both Rome and Naples — A1 is twenty minutes away.',
    destinations: [
      {
        id: 'naples', name: 'Naples', kind: 'city', badge: 'Closest',
        legs: {
          car: { mode: 'car', time: '~1h30', via: 'A1 from Venafro', cost: '€7 tolls' },
          train: { mode: 'train', time: '~2h15', via: 'Via Vairano-Caianello', cost: '€10' },
        },
        best: 'car',
      },
      {
        id: 'rome', name: 'Rome', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~2h', via: 'A1 from Venafro', cost: '€12 tolls' },
          train: { mode: 'train', time: '~3h', via: 'Via Roccaravindola + Cassino', cost: '€15' },
        },
        best: 'car',
      },
      {
        id: 'campobasso', name: 'Campobasso', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~45 min', via: 'SS17 east', cost: 'Fuel only' },
          train: { mode: 'train', time: '~1h', via: 'Direct regional', cost: '€5' },
          bus: { mode: 'bus', time: '~1h', via: 'SATI line', cost: '€5' },
        },
        best: 'car',
      },
      {
        id: 'nap', name: 'Naples Capodichino', kind: 'airport', badge: 'NAP',
        legs: {
          car: { mode: 'car', time: '~1h30', via: 'A1 + Tangenziale', cost: '€8 tolls' },
        },
        best: 'car',
      },
      {
        id: 'fco', name: 'Rome Fiumicino', kind: 'airport', badge: 'FCO',
        legs: {
          car: { mode: 'car', time: '~2h30', via: 'A1 → GRA', cost: '€15 tolls' },
          train: { mode: 'train', time: '~4h', via: 'Train to Termini + Leonardo Express', cost: '€25' },
        },
        best: 'car',
      },
    ],
  },
  {
    id: 'agnone',
    name: 'Agnone',
    blurb: 'High Molise. Stunning, isolated, and honest about it: everything is at least 90 minutes away.',
    destinations: [
      {
        id: 'campobasso', name: 'Campobasso', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~1h30', via: 'SS86 mountain road', cost: 'Fuel only' },
        },
        best: 'car',
      },
      {
        id: 'isernia', name: 'Isernia', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~1h15', via: 'SS86 south', cost: 'Fuel only' },
        },
        best: 'car',
      },
      {
        id: 'rome', name: 'Rome', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~3h30', via: 'SS86 → A1', cost: '€15 tolls' },
        },
        best: 'car',
      },
      {
        id: 'naples', name: 'Naples', kind: 'city',
        legs: {
          car: { mode: 'car', time: '~3h', via: 'SS86 → A1', cost: '€12 tolls' },
        },
        best: 'car',
      },
      {
        id: 'psr', name: 'Pescara — Abruzzo', kind: 'airport', badge: 'PSR',
        legs: {
          car: { mode: 'car', time: '~2h', via: 'SS650 → A14', cost: '€8 tolls' },
        },
        best: 'car',
      },
    ],
  },
];

const MODE_META: Record<Mode, { icon: typeof Car; label: string }> = {
  car: { icon: Car, label: 'Car' },
  train: { icon: Train, label: 'Train' },
  bus: { icon: BusFront, label: 'Bus' },
};

export default function MoliseCentralItalyReach() {
  const [originId, setOriginId] = useState('campobasso');
  const [mode, setMode] = useState<Mode>('car');

  const origin = useMemo(() => DATA.find((o) => o.id === originId)!, [originId]);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <Compass className="w-4 h-4" />
            Reaching the rest of Italy
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How far is Molise, really?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Molise gets called "isolated." Pick your home base and see the honest numbers — Rome, Naples, the coast, the airports — by car, train, or bus.
          </p>
        </div>

        {/* Origin selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {DATA.map((o) => (
            <Button
              key={o.id}
              variant={o.id === originId ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOriginId(o.id)}
            >
              {o.name}
            </Button>
          ))}
        </div>

        {/* Origin blurb */}
        <p className="text-center text-sm text-muted-foreground italic max-w-2xl mx-auto mb-8">
          {origin.blurb}
        </p>

        {/* Mode toggle */}
        <div className="flex justify-center gap-2 mb-10">
          {(Object.keys(MODE_META) as Mode[]).map((m) => {
            const Icon = MODE_META[m].icon;
            return (
              <Button
                key={m}
                variant={m === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode(m)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {MODE_META[m].label}
              </Button>
            );
          })}
        </div>

        {/* Destinations grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {origin.destinations.map((dest) => {
            const leg = dest.legs[mode];
            const bestLeg = dest.legs[dest.best];
            const isBest = dest.best === mode && leg;
            const KindIcon = dest.kind === 'airport' ? Plane : ArrowRight;

            return (
              <Card
                key={dest.id}
                className={cn(
                  'transition-all',
                  isBest && 'border-primary/60 shadow-md',
                  !leg && 'opacity-60',
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <KindIcon className="w-4 h-4 text-primary flex-shrink-0" />
                      <h3 className="font-semibold text-foreground">{dest.name}</h3>
                    </div>
                    {dest.badge && (
                      <Badge variant="secondary" className="text-xs">{dest.badge}</Badge>
                    )}
                  </div>

                  {leg ? (
                    <>
                      <div className="text-2xl font-bold text-foreground mb-1">{leg.time}</div>
                      <p className="text-xs text-muted-foreground mb-2">{leg.via}</p>
                      {leg.cost && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Cost:</span> {leg.cost}
                        </p>
                      )}
                      {isBest && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <span className="text-xs font-medium text-primary">★ Fastest realistic option</span>
                        </div>
                      )}
                      {!isBest && bestLeg && (
                        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                          Faster by <span className="font-medium text-foreground">{MODE_META[dest.best].label.toLowerCase()}</span>: {bestLeg.time}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Not practical by {MODE_META[mode].label.toLowerCase()} — try {MODE_META[dest.best].label.toLowerCase()} ({bestLeg?.time}).
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Corridor summary */}
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <Card className="bg-card">
            <CardContent className="p-6">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="text-primary">↕</span> The Adriatic spine
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you live on the coast (Termoli), the A14 and the Frecciarossa rail line are your superpower. Bologna in under 4 hours, Bari in under 2.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-6">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="text-primary">↔</span> The Apennine crossing
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Inland (Campobasso, Isernia), your route to Rome and Naples is the A1 via Venafro. Mountain roads add 30–45 minutes vs. what Google Maps first suggests in winter.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}