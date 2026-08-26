import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Info } from 'lucide-react';

interface Stage {
  max: number;
  style: string;
  colorName: string;
  color: string;
  notes: string[];
  tannin: number;
  texture: number;
  oxidation: number;
  serve: string;
  producers: string;
  blurb: string;
}

const STAGES: Stage[] = [
  {
    max: 0,
    style: 'Pressed white',
    colorName: 'Pale straw',
    color: 'hsl(52 85% 78%)',
    notes: ['Green apple', 'Lemon zest', 'Wet stone'],
    tannin: 0,
    texture: 1,
    oxidation: 0,
    serve: '10–12°C, standard white glass',
    producers: 'The Collio mainstream — clean, cool-fermented Ribolla and Friulano.',
    blurb:
      'Juice off the skins immediately. This is the international style Friuli perfected in the 1970s under Mario Schiopetto: cold tanks, reductive handling, laser precision.',
  },
  {
    max: 4,
    style: 'Brief maceration',
    colorName: 'Straw gold',
    color: 'hsl(46 88% 66%)',
    notes: ['Yellow apple', 'Chamomile', 'Almond skin'],
    tannin: 1,
    texture: 2,
    oxidation: 1,
    serve: '11–13°C, standard white glass',
    producers: 'A common compromise across Collio and the Colli Orientali.',
    blurb:
      'A day or three on the skins for aroma and body, then pressed. Most drinkers would not call this an orange wine — but the texture has already changed.',
  },
  {
    max: 12,
    style: 'Skin-contact white',
    colorName: 'Deep gold',
    color: 'hsl(40 90% 56%)',
    notes: ['Dried apricot', 'Orange peel', 'Bruised pear', 'Hay'],
    tannin: 2,
    texture: 3,
    oxidation: 2,
    serve: '12–14°C, a wider glass helps',
    producers: 'The gateway bottles: entry-level Oslavia and Carso macerations.',
    blurb:
      'Colour arrives, and with it a grip on the tongue that whites are not supposed to have. Serve this to a sceptic and they usually convert.',
  },
  {
    max: 30,
    style: 'Orange wine',
    colorName: 'Amber',
    color: 'hsl(32 88% 48%)',
    notes: ['Dried apricot', 'Black tea', 'Walnut', 'Beeswax', 'Bitter orange'],
    tannin: 3,
    texture: 4,
    oxidation: 3,
    serve: '14–16°C, red-wine glass, decant 30 min',
    producers: 'Classic Oslavia territory — Ribolla Gialla fermented in wood or amphora.',
    blurb:
      'A month on the skins and the wine behaves like a red: tannin, structure, a savoury core. This is the style that put a village of 200 people on every natural-wine list on earth.',
  },
  {
    max: 60,
    style: 'Extended maceration',
    colorName: 'Deep amber',
    color: 'hsl(26 82% 40%)',
    notes: ['Dried fig', 'Toasted nut', 'Curry leaf', 'Rooibos', 'Salted caramel'],
    tannin: 4,
    texture: 5,
    oxidation: 4,
    serve: '16°C, decant an hour, treat as a red',
    producers: 'Radikon, Gravner and the Oslavia purists; long amphora and old-oak ageing.',
    blurb:
      'Two months or more, often in buried Georgian qvevri. Joško Gravner switched to amphora in 2001 and was told he had lost his mind. He had not.',
  },
  {
    max: 999,
    style: 'Ancestral / qvevri',
    colorName: 'Burnt amber',
    color: 'hsl(22 74% 33%)',
    notes: ['Dried fig', 'Cured peel', 'Smoke', 'Umami broth', 'Iodine'],
    tannin: 5,
    texture: 5,
    oxidation: 5,
    serve: '16–18°C, open the bottle hours ahead',
    producers: 'The extreme end: six months of skins, years in wood before release.',
    blurb:
      'Barely wine as most of Italy defines it, and closer to something a Georgian winemaker would recognise. Polarising, ageless, and the reason wine writers keep flying into Trieste.',
  },
];

const METRICS: Array<{ key: keyof Pick<Stage, 'tannin' | 'texture' | 'oxidation'>; label: string }> = [
  { key: 'tannin', label: 'Tannin' },
  { key: 'texture', label: 'Texture' },
  { key: 'oxidation', label: 'Savoury / oxidative' },
];

export function FriuliOrangeWineLab() {
  const [days, setDays] = useState<number>(21);
  const stage = useMemo(() => STAGES.find((s) => days <= s.max) ?? STAGES[STAGES.length - 1], [days]);

  const fillHeight = 58;

  return (
    <div className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-5 md:p-8 backdrop-blur-sm">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          <FlaskConical className="h-3.5 w-3.5" />
          Interactive
        </span>
        <h4 className="text-xl md:text-2xl font-bold text-foreground">The Orange Wine Lab</h4>
      </div>
      <p className="mb-8 max-w-3xl text-muted-foreground leading-relaxed">
        Orange wine is not a grape and not a rosé. It is white grapes left to ferment on their skins — a
        technique Friuli revived from the Caucasus and turned into an identity. Drag the dial and watch what
        time on the skins actually does.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
        {/* Glass */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 120 190" className="h-56 w-auto" role="img" aria-label={`Wine glass showing ${stage.colorName} colour after ${days} days of skin contact`}>
            <defs>
              <clipPath id="bowlClip">
                <path d="M30 22 h60 c0 34 -8 56 -30 62 c-22 -6 -30 -28 -30 -62 z" />
              </clipPath>
            </defs>
            <motion.rect
              x="30"
              width="60"
              clipPath="url(#bowlClip)"
              animate={{ fill: stage.color }}
              transition={{ duration: 0.5 }}
              y={84 - fillHeight}
              height={fillHeight}
              opacity={0.92}
            />
            <path
              d="M30 22 h60 c0 34 -8 56 -30 62 c-22 -6 -30 -28 -30 -62 z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-foreground/40"
            />
            <path d="M60 84 v58" stroke="currentColor" strokeWidth="1.6" className="text-foreground/40" />
            <path d="M38 168 q22 -10 44 0" stroke="currentColor" strokeWidth="1.6" fill="none" className="text-foreground/40" />
            <path d="M60 142 q0 20 -22 26 h44 q-22 -6 -22 -26" fill="currentColor" className="text-foreground/10" />
          </svg>
          <div className="mt-3 text-center">
            <p className="text-sm font-semibold text-foreground">{stage.colorName}</p>
            <p className="text-xs text-muted-foreground">{stage.serve}</p>
          </div>
        </div>

        {/* Controls + readout */}
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Days on the skins</span>
            <span className="text-2xl font-bold text-primary tabular-nums">
              {days >= 60 ? '60+' : days}
            </span>
          </div>
          <Slider
            value={[days]}
            min={0}
            max={60}
            step={1}
            onValueChange={(v) => setDays(v[0])}
            aria-label="Days of skin contact"
            className="mb-2"
          />
          <div className="mb-6 flex justify-between text-[11px] text-muted-foreground">
            <span>Pressed straight</span>
            <span>A week</span>
            <span>A month</span>
            <span>60+ days</span>
          </div>

          <motion.div key={stage.style} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h5 className="text-lg font-bold text-foreground mb-1">{stage.style}</h5>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{stage.blurb}</p>

            <div className="mb-5 flex flex-wrap gap-1.5">
              {stage.notes.map((note) => (
                <Badge key={note} variant="secondary" className="text-[11px] font-normal">
                  {note}
                </Badge>
              ))}
            </div>

            <div className="mb-5 space-y-2.5">
              {METRICS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {label}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      animate={{ width: `${(stage[key] / 5) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{stage.producers}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
