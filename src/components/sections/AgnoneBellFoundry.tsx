import { useEffect, useRef, useState } from 'react';
import { Bell, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const foundryImage = '/images/molise/agnone-foundry.jpg';

type BellEntry = {
  id: string;
  title: string;
  commissioner: string;
  year: string;
  weight: string;
  note: string; // strike note label, used for display only
  frequency: number; // Hz of the fundamental
  story: string;
  link?: { label: string; url: string };
};

// Marinelli Pontifical Foundry, Agnone — real commissions, paraphrased facts.
const BELLS: BellEntry[] = [
  {
    id: 'st-peters',
    title: "St Peter's Basilica",
    commissioner: 'Vatican — Great Jubilee 2000',
    year: '1999',
    weight: '~ 700 kg',
    note: 'C5',
    frequency: 523.25,
    story:
      "Cast in Agnone for the Jubilee of 2000 and blessed by John Paul II. The Marinelli family has been a papal supplier since the 14th century, when Pope Pius XI granted them the right to use the Vatican coat of arms.",
    link: {
      label: 'Marinelli Foundry — papal commissions',
      url: 'https://campanemarinelli.com/en/storia/',
    },
  },
  {
    id: 'montecassino',
    title: 'Abbey of Montecassino',
    commissioner: 'Benedictine Abbey',
    year: '1950s',
    weight: '~ 2,200 kg',
    note: 'G4',
    frequency: 392.0,
    story:
      "After the abbey was flattened in 1944, the Marinelli were asked to recast the bells. The peal that rings over Cassino today is Molisan bronze.",
    link: {
      label: 'Abbey of Montecassino — history',
      url: 'https://www.abbaziamontecassino.org/',
    },
  },
  {
    id: 'un-peace',
    title: 'Bell for the United Nations',
    commissioner: 'UN — Peace ceremony',
    year: '2000',
    weight: '~ 600 kg',
    note: 'A4',
    frequency: 440.0,
    story:
      'A jubilee peace bell cast in Agnone and gifted to mark the new millennium — one of several diplomatic bells the foundry has shipped abroad.',
    link: {
      label: 'Pontificia Fonderia Marinelli',
      url: 'https://campanemarinelli.com/en/',
    },
  },
  {
    id: 'expo-2015',
    title: 'Expo Milano 2015',
    commissioner: 'Italian Pavilion',
    year: '2015',
    weight: '~ 950 kg',
    note: 'E4',
    frequency: 329.63,
    story:
      "Rung daily at the Italian pavilion during the world's fair as a national emblem of craft. Marinelli also represented Italy at Expo 2010 in Shanghai.",
    link: {
      label: 'Expo Milano 2015 archive',
      url: 'https://www.expo2015.org/archive/en/index.html',
    },
  },
  {
    id: 'guadalupe',
    title: 'Basilica of Guadalupe',
    commissioner: 'Mexico City',
    year: '2002',
    weight: '~ 800 kg',
    note: 'F4',
    frequency: 349.23,
    story:
      "Commissioned for the canonization of Juan Diego. The bell crossed the Atlantic in a wooden crate stamped 'Agnone, Molise'.",
    link: {
      label: 'Basílica de Guadalupe',
      url: 'https://virgendeguadalupe.org.mx/',
    },
  },
  {
    id: 'agnone-cathedral',
    title: 'San Marco — Agnone',
    commissioner: 'Local parish',
    year: '19th c.',
    weight: '~ 450 kg',
    note: 'B4',
    frequency: 493.88,
    story:
      "The town's own bell, hung in the church a few hundred metres uphill from the workshop. It is the sound Agnone wakes up to.",
    link: {
      label: 'Comune di Agnone',
      url: 'https://www.comune.agnone.is.it/',
    },
  },
];

/**
 * Synthesise a bell-like tone with WebAudio.
 * Real bells have a complex partial structure; we approximate with the
 * classic five-partial set: hum, fundamental (prime), tierce (~ minor third
 * above), quint (~ fifth above), nominal (octave above). Exponential decay
 * per partial gives a credible strike + ring.
 */
function playBell(ctx: AudioContext, fundamental: number, duration = 3.5) {
  const now = ctx.currentTime;
  const partials = [
    { ratio: 0.5, gain: 0.35, decay: duration * 1.1 },   // hum
    { ratio: 1.0, gain: 0.5, decay: duration },          // prime
    { ratio: 1.2, gain: 0.3, decay: duration * 0.7 },    // tierce (minor 3rd-ish)
    { ratio: 1.5, gain: 0.22, decay: duration * 0.6 },   // quint
    { ratio: 2.0, gain: 0.28, decay: duration * 0.55 },  // nominal (octave)
  ];

  const master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);

  partials.forEach((p) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = fundamental * p.ratio;

    const g = ctx.createGain();
    // Sharp attack, exponential decay — mimics a clapper strike.
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(p.gain, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + p.decay + 0.05);
  });
}

export function AgnoneBellFoundry() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ringing, setRinging] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = () => {
    if (!ctxRef.current) {
      const Ctor =
        (window as any).AudioContext ?? (window as any).webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  };

  const ring = (bell: BellEntry) => {
    const ctx = ensureCtx();
    if (!ctx) return;
    playBell(ctx, bell.frequency);
    setActiveId(bell.id);
  };

  const ringAll = () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    setRinging(true);
    BELLS.forEach((bell, i) => {
      window.setTimeout(() => playBell(ctx, bell.frequency, 3), i * 600);
    });
    window.setTimeout(() => setRinging(false), BELLS.length * 600 + 3000);
  };

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  const active = BELLS.find((b) => b.id === activeId) ?? null;

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-10">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
            <img
              src={foundryImage}
              alt="Molten bronze poured into a bell mold inside the Marinelli foundry in Agnone, Molise"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <Bell className="h-5 w-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">
                Sounds of Molise
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              The Agnone Bell Foundry
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              In the mountain town of Agnone, the{' '}
              <strong>Pontificia Fonderia di Campane Marinelli</strong> has been
              casting bronze bells since around the year 1000 — roughly a
              thousand years of one family, one craft, one address. It is one
              of the oldest continuously operating businesses on earth and the
              Vatican's historical bell supplier.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Each bell below is a real Marinelli commission. Click one to hear
              an approximation of its strike tone, or ring the full peal.
            </p>
            <Button
              onClick={ringAll}
              disabled={ringing}
              size="lg"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {ringing ? 'Ringing the peal…' : 'Ring all bells'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          {BELLS.map((bell) => {
            const isActive = activeId === bell.id;
            return (
              <button
                key={bell.id}
                type="button"
                onClick={() => ring(bell)}
                className={`group text-left rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive ? 'border-primary shadow-lg' : 'border-border'
                }`}
                aria-pressed={isActive}
              >
                <Bell
                  className={`h-6 w-6 mb-3 transition-transform ${
                    isActive ? 'text-primary animate-pulse' : 'text-muted-foreground group-hover:text-primary'
                  }`}
                />
                <h3 className="font-semibold text-sm md:text-base leading-tight mb-1">
                  {bell.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {bell.year} · {bell.weight} · note {bell.note}
                </p>
              </button>
            );
          })}
        </div>

        {active && (
          <Card className="animate-fade-in">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-lg md:text-xl font-bold">
                    {active.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {active.commissioner} · {active.year}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wider text-primary whitespace-nowrap mt-1">
                  {active.weight}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {active.story}
              </p>
              {active.link && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={active.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="text-xs">{active.link.label}</span>
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          Tones are synthesised approximations using each bell's strike note —
          a real Marinelli bell has dozens of partials that no oscillator can
          fully reproduce. Visit the foundry in Agnone to hear the real thing.
        </p>
      </div>
    </section>
  );
}

export default AgnoneBellFoundry;