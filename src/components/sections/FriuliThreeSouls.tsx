import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Waves, Wheat, Mountain, Check, X, Euro, Stethoscope, MessageCircle,
  ThermometerSun, Wind, Snowflake, MapPin
} from 'lucide-react';
import coastImg from '@/assets/friuli/soul-coast.jpg';
import plainImg from '@/assets/friuli/soul-plain.jpg';
import alpsImg from '@/assets/friuli/soul-alps.jpg';

interface Meter { label: string; value: number; note: string }

interface Soul {
  id: string;
  name: string;
  subtitle: string;
  icon: typeof Waves;
  image: string;
  imageAlt: string;
  towns: string;
  climate: string;
  cost: string;
  healthcare: string;
  language: string;
  meters: Meter[];
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
    image: coastImg,
    imageAlt: 'The Adriatic waterfront of Trieste seen from the limestone Karst coastline at dusk',
    towns: 'Trieste, Muggia, Duino, Grado, Sistiana',
    climate: 'Mildest winters in the region; the Bora wind is the price of admission. Humid, busy summers on the lagoon.',
    cost: 'Highest rents in FVG — Trieste city centre commands a premium, but Muggia and the Karst villages run 25–35% cheaper.',
    healthcare: 'Best in the region. Trieste hosts the Cattinara and Maggiore hospitals plus Burlo Garofolo; specialists are local, not a drive away.',
    language: 'Italian with a strong Triestino dialect, plus Slovene as an official minority language in the Karst villages.',
    meters: [
      { label: 'Cost of living', value: 85, note: 'Priciest band' },
      { label: 'Healthcare depth', value: 95, note: 'Teaching hospitals in town' },
      { label: 'Winter mildness', value: 80, note: 'Rarely below freezing' },
      { label: 'Quiet factor', value: 35, note: 'City rhythm, port traffic' }
    ],
    suits: ['You want a real city with cafés, concerts and a hospital in it', 'You like sea air and never want to shovel snow', 'You want Slovenia and Croatia within an hour'],
    avoid: ['Wind bothers you — Bora days are not rare', 'You want a big garden for a small budget', 'You dislike summer crowds around Grado and Barcola'],
    blurb: 'This is the Habsburg Adriatic: coffee houses, Slovene bakeries, limestone plateaus and a port that still faces east rather than west.'
  },
  {
    id: 'plain',
    name: 'Central Plain',
    subtitle: 'Udine, Palmanova, Pordenone, Cividale',
    icon: Wheat,
    image: plainImg,
    imageAlt: 'Vineyards and maize fields on the Friulian plain with a market town bell tower in morning mist',
    towns: 'Udine, Palmanova, Pordenone, Cividale, San Daniele, Spilimbergo',
    climate: 'Continental — cold, foggy winters and hot, sticky summers. Very heavy autumn rainfall; this is one of Italy\'s wettest zones.',
    cost: 'The value sweet spot. Restored town apartments and small houses cost well under coastal prices, with full services attached.',
    healthcare: 'Strong. Udine\'s Santa Maria della Misericordia is the regional teaching hospital; Pordenone and Palmanova cover the west and south.',
    language: 'Italian plus everyday Friulian (furlan) — you will hear it in markets and bars, and locals notice when you try it.',
    meters: [
      { label: 'Cost of living', value: 55, note: 'Best value in FVG' },
      { label: 'Healthcare depth', value: 85, note: 'Regional teaching hospital' },
      { label: 'Winter mildness', value: 45, note: 'Fog and frost, little snow' },
      { label: 'Quiet factor', value: 65, note: 'Market-town pace' }
    ],
    suits: ['You want the most house, town and service per euro', 'You like flat terrain for cycling and walking', 'You want to be 45 minutes from everything without living in a tourist town'],
    avoid: ['Grey, foggy winters flatten your mood', 'You need sea views or mountain drama daily', 'You want an established English-speaking expat circle'],
    blurb: 'The plain is where Friuli actually lives: market towns, wine bars pouring the ritual tajut, and a food culture that outclasses the price tag.'
  },
  {
    id: 'alps',
    name: 'Alps & Border',
    subtitle: 'Tarvisio, Gemona, Venzone, Tolmezzo',
    icon: Mountain,
    image: alpsImg,
    imageAlt: 'Snow-dusted Julian Alps above an alpine village near Tarvisio in winter light',
    towns: 'Tarvisio, Gemona del Friuli, Venzone, Tolmezzo, Sappada',
    climate: 'Genuine Alpine. Real snow from December, cool nights all summer, and the clearest air in the region.',
    cost: 'Cheapest property in FVG by a wide margin — but heating, winter tyres and a capable car are non-negotiable running costs.',
    healthcare: 'Thinnest coverage. Gemona and Tolmezzo handle the basics; anything serious means Udine, 40–70 minutes down the valley.',
    language: 'Italian, Friulian, and in the Val Canale, German and Slovene — Tarvisio sits where three languages meet.',
    meters: [
      { label: 'Cost of living', value: 35, note: 'Cheapest property' },
      { label: 'Healthcare depth', value: 45, note: 'Basics local, rest in Udine' },
      { label: 'Winter mildness', value: 15, note: 'Snow from December' },
      { label: 'Quiet factor', value: 95, note: 'Villages, not towns' }
    ],
    suits: ['You hike, ski or cycle and want it out the front door', 'You want Austria and Slovenia as your weekly errand radius', 'You value quiet and cool summers over convenience'],
    avoid: ['Winter driving worries you', 'You need specialist medical care close by', 'Small villages in February feel isolating to you'],
    blurb: 'The Julian and Carnic Alps: three-border living, tiny communities, and the region\'s most honest test of whether you actually like solitude.'
  }
];

const soulAccent: Record<string, typeof Wind> = {
  coast: Wind,
  plain: Wheat,
  alps: Snowflake
};

export default function FriuliThreeSouls() {
  const [active, setActive] = useState(souls[0].id);
  const soul = souls.find((s) => s.id === active)!;
  const Icon = soul.icon;
  const Accent = soulAccent[soul.id];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Friuli-Venezia Giulia</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Three Friulis</h2>
          <p className="text-lg text-muted-foreground">
            One small region, three completely different lives. Pick a band and see the one you'd actually be living.
          </p>
        </div>

        {/* Photo selector */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {souls.map((s) => {
            const SIcon = s.icon;
            const on = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                aria-pressed={on}
                className={cn(
                  'group relative overflow-hidden rounded-2xl text-left transition-all duration-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  on ? 'ring-2 ring-primary shadow-lg scale-[1.01]' : 'ring-1 ring-border hover:ring-primary/50'
                )}
              >
                <img
                  src={s.image}
                  alt={s.imageAlt}
                  loading="lazy"
                  width={1600}
                  height={1008}
                  className={cn(
                    'h-32 sm:h-40 w-full object-cover transition-all duration-700',
                    on ? 'scale-105' : 'grayscale-[55%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <SIcon className="h-4 w-4 text-background" />
                    <span className="font-semibold text-background">{s.name}</span>
                  </div>
                  <p className="text-[11px] leading-snug text-background/75">{s.subtitle}</p>
                </div>
                <span
                  className={cn(
                    'absolute top-3 right-3 h-2.5 w-2.5 rounded-full transition-all duration-300',
                    on ? 'bg-primary scale-125 shadow-[0_0_0_4px_hsl(var(--primary)/0.25)]' : 'bg-background/50'
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div key={soul.id} className="max-w-5xl mx-auto animate-fade-in">
          <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
            {/* Hero strip */}
            <div className="relative h-56 md:h-72">
              <img
                src={soul.image}
                alt={soul.imageAlt}
                loading="lazy"
                width={1600}
                height={1008}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/45 to-foreground/10" />
              <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-xl bg-background/15 backdrop-blur-sm p-2.5 ring-1 ring-background/25">
                    <Icon className="h-6 w-6 text-background" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-background">{soul.name}</h3>
                  <Accent className="h-5 w-5 text-background/60" />
                </div>
                <p className="max-w-2xl text-background/85 text-sm md:text-base leading-relaxed">{soul.blurb}</p>
              </div>
            </div>

            {/* Meters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 md:p-8 border-b border-border bg-muted/20">
              {soul.meters.map((m) => (
                <div key={m.label}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{m.label}</span>
                    <span className="text-sm font-bold text-primary tabular-nums">{m.value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                      style={{ width: `${m.value}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">{m.note}</p>
                </div>
              ))}
            </div>

            <div className="p-6 md:p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <Fact icon={ThermometerSun} label="Climate" value={soul.climate} />
                <Fact icon={Euro} label="Cost reality" value={soul.cost} />
                <Fact icon={Stethoscope} label="Healthcare" value={soul.healthcare} />
                <Fact icon={MessageCircle} label="What you'll hear" value={soul.language} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
                  <p className="font-semibold mb-3 text-xs uppercase tracking-[0.15em] text-primary">Suits you if</p>
                  <ul className="space-y-2.5">
                    {soul.suits.map((t) => (
                      <li key={t} className="flex gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-5">
                  <p className="font-semibold mb-3 text-xs uppercase tracking-[0.15em] text-destructive">Think twice if</p>
                  <ul className="space-y-2.5">
                    {soul.avoid.map((t) => (
                      <li key={t} className="flex gap-2.5 text-sm">
                        <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Towns in this band
                </span>
                {soul.towns.split(',').map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground/80"
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fact({ icon: I, label, value }: { icon: typeof Waves; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/30 border border-border p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center gap-2 mb-1.5 text-primary">
        <I className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.15em]">{label}</span>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{value}</p>
    </div>
  );
}
