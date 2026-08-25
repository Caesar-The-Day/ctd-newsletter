import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Waves, Wheat, Mountain, Check, X, Euro, Stethoscope, MessageCircle, ThermometerSun } from 'lucide-react';

interface Soul {
  id: string;
  name: string;
  subtitle: string;
  icon: typeof Waves;
  towns: string;
  climate: string;
  cost: string;
  healthcare: string;
  language: string;
  suits: string[];
  avoid: string[];
  blurb: string;
}

const souls: Soul[] = [
  {
    id: 'coast',
    name: 'Coast & Karst',
    subtitle: 'Trieste, Muggia, Grado, Duino',
    icon: Waves,
    towns: 'Trieste, Muggia, Duino, Grado, Sistiana',
    climate: 'Mildest winters in the region; the Bora wind is the price of admission. Humid, busy summers on the lagoon.',
    cost: 'Highest rents in FVG — Trieste city centre commands a premium, but Muggia and the Karst villages run 25–35% cheaper.',
    healthcare: 'Best in the region. Trieste hosts the Cattinara and Maggiore hospitals plus Burlo Garofolo; specialists are local, not a drive away.',
    language: 'Italian with a strong Triestino dialect, plus Slovene as an official minority language in the Karst villages.',
    suits: ['You want a real city with cafés, concerts and a hospital in it', 'You like sea air and never want to shovel snow', 'You want Slovenia and Croatia within an hour'],
    avoid: ['Wind bothers you — Bora days are not rare', 'You want a big garden for a small budget', 'You dislike summer crowds around Grado and Barcola'],
    blurb: 'This is the Habsburg Adriatic: coffee houses, Slovene bakeries, limestone plateaus and a port that still faces east rather than west.'
  },
  {
    id: 'plain',
    name: 'Central Plain',
    subtitle: 'Udine, Palmanova, Pordenone, Cividale',
    icon: Wheat,
    towns: 'Udine, Palmanova, Pordenone, Cividale, San Daniele, Spilimbergo',
    climate: 'Continental — cold, foggy winters and hot, sticky summers. Very heavy autumn rainfall; this is one of Italy\'s wettest zones.',
    cost: 'The value sweet spot. Restored town apartments and small houses cost well under coastal prices, with full services attached.',
    healthcare: 'Strong. Udine\'s Santa Maria della Misericordia is the regional teaching hospital; Pordenone and Palmanova cover the west and south.',
    language: 'Italian plus everyday Friulian (furlan) — you will hear it in markets and bars, and locals notice when you try it.',
    suits: ['You want the most house, town and service per euro', 'You like flat terrain for cycling and walking', 'You want to be 45 minutes from everything without living in a tourist town'],
    avoid: ['Grey, foggy winters flatten your mood', 'You need sea views or mountain drama daily', 'You want an established English-speaking expat circle'],
    blurb: 'The plain is where Friuli actually lives: market towns, wine bars pouring the ritual tajut, and a food culture that outclasses the price tag.'
  },
  {
    id: 'alps',
    name: 'Alps & Border',
    subtitle: 'Tarvisio, Gemona, Venzone, Tolmezzo',
    icon: Mountain,
    towns: 'Tarvisio, Gemona del Friuli, Venzone, Tolmezzo, Sappada',
    climate: 'Genuine Alpine. Real snow from December, cool nights all summer, and the clearest air in the region.',
    cost: 'Cheapest property in FVG by a wide margin — but heating, winter tyres and a capable car are non-negotiable running costs.',
    healthcare: 'Thinnest coverage. Gemona and Tolmezzo handle the basics; anything serious means Udine, 40–70 minutes down the valley.',
    language: 'Italian, Friulian, and in the Val Canale, German and Slovene — Tarvisio sits where three languages meet.',
    suits: ['You hike, ski or cycle and want it out the front door', 'You want Austria and Slovenia as your weekly errand radius', 'You value quiet and cool summers over convenience'],
    avoid: ['Winter driving worries you', 'You need specialist medical care close by', 'Small villages in February feel isolating to you']
    ,
    blurb: 'The Julian and Carnic Alps: three-border living, tiny communities, and the region\'s most honest test of whether you actually like solitude.'
  }
];

export default function FriuliThreeSouls() {
  const [active, setActive] = useState(souls[0].id);
  const soul = souls.find((s) => s.id === active)!;
  const Icon = soul.icon;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">The Three Friulis</h2>
          <p className="text-lg text-muted-foreground">
            One small region, three completely different lives. Choose the one you'd actually be living.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {souls.map((s) => {
            const SIcon = s.icon;
            const on = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  'rounded-xl border-2 p-4 text-left transition-all duration-300',
                  on ? 'border-primary bg-primary/10 shadow-soft' : 'border-border bg-background hover:border-primary/50'
                )}
              >
                <SIcon className={cn('h-6 w-6 mb-2', on ? 'text-primary' : 'text-muted-foreground')} />
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.subtitle}</div>
              </button>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{soul.name}</h3>
                  <p className="text-muted-foreground">{soul.blurb}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <Fact icon={ThermometerSun} label="Climate" value={soul.climate} />
                <Fact icon={Euro} label="Cost reality" value={soul.cost} />
                <Fact icon={Stethoscope} label="Healthcare" value={soul.healthcare} />
                <Fact icon={MessageCircle} label="What you'll hear" value={soul.language} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Suits you if</p>
                  <ul className="space-y-2">
                    {soul.suits.map((t) => (
                      <li key={t} className="flex gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Think twice if</p>
                  <ul className="space-y-2">
                    {soul.avoid.map((t) => (
                      <li key={t} className="flex gap-2 text-sm">
                        <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-6">Towns in this band: {soul.towns}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Fact({ icon: I, label, value }: { icon: typeof Waves; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background border border-border p-4">
      <div className="flex items-center gap-2 mb-1 text-primary">
        <I className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{value}</p>
    </div>
  );
}
