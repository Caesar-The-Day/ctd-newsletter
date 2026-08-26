import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Mountain, Waves, UtensilsCrossed } from 'lucide-react';

interface Stop {
  place: string;
  subtitle: string;
  influence: string;
  antipasto: string;
  primo: string;
  secondo: string;
  dolce: string;
  drink: string;
  note: string;
  alpine: number; // 0-100 alpine vs adriatic weighting
}

const STOPS: Stop[] = [
  {
    place: 'Tarvisio',
    subtitle: 'Alpine, tri-border',
    influence: 'Austrian & Slovenian',
    antipasto: 'Speck and mountain cheese',
    primo: 'Cjarsons with smoked butter',
    secondo: 'Venison goulash with polenta',
    dolce: 'Strudel di mele',
    drink: 'Dark beer, or a Müller-Thurgau',
    note: 'Three languages on the menu and dumplings outnumbering pasta. The Adriatic is 90 minutes away and might as well be another country.',
    alpine: 100,
  },
  {
    place: 'San Daniele',
    subtitle: 'Moraine hills',
    influence: 'Friulian heartland',
    antipasto: 'Prosciutto di San Daniele, 16 months',
    primo: 'Orzotto with beans and smoked ricotta',
    secondo: 'Frico with soft polenta',
    dolce: 'Gubana with grappa',
    drink: 'Friulano from the Colli Orientali',
    note: 'The classic Friulian table: cured pork, cheese, polenta, and a white wine engineered to cut through all three.',
    alpine: 72,
  },
  {
    place: 'Cividale',
    subtitle: 'Natisone valleys',
    influence: 'Slovenian border culture',
    antipasto: 'Cured meats with kren (horseradish)',
    primo: 'Barley and bean soup',
    secondo: 'Roast pork with turnips',
    dolce: 'Gubana — the original',
    drink: 'Schioppettino from Prepotto',
    note: 'Sweet and savoury stop pretending to be separate courses here. Cocoa turns up in the pasta filling and nobody blinks.',
    alpine: 55,
  },
  {
    place: 'Trieste',
    subtitle: 'Habsburg port',
    influence: 'Viennese, Slovenian, Greek, Jewish',
    antipasto: 'Sardoni in savor (marinated sardines)',
    primo: 'Jota — sauerkraut and bean stew',
    secondo: 'Bollito with senape and kren, from a buffet',
    dolce: 'Presnitz or putizza',
    drink: 'Terrano, or a capo in b',
    note: 'The least Italian-looking food in Italy. Boiled pork, mustard, horseradish, and a coffee vocabulary borrowed from Vienna.',
    alpine: 28,
  },
  {
    place: 'Grado',
    subtitle: 'Lagoon and Adriatic',
    influence: 'Venetian & maritime',
    antipasto: 'Raw scampi from the Gulf',
    primo: 'Risotto with lagoon fish',
    secondo: 'Boreto a la graisana — peppery fish stew with white polenta',
    dolce: 'Fritters and sea-buckthorn',
    drink: 'Vitovska or Malvasia Istriana',
    note: 'Olive oil replaces butter, vinegar replaces sauerkraut, and the polenta turns white. Same region, opposite kitchen.',
    alpine: 0,
  },
];

const COURSES: Array<{ key: keyof Pick<Stop, 'antipasto' | 'primo' | 'secondo' | 'dolce' | 'drink'>; label: string }> = [
  { key: 'antipasto', label: 'Antipasto' },
  { key: 'primo', label: 'Primo' },
  { key: 'secondo', label: 'Secondo' },
  { key: 'dolce', label: 'Dolce' },
  { key: 'drink', label: 'In the glass' },
];

export function FriuliBorderPlate() {
  const [index, setIndex] = useState(2);
  const stop = STOPS[index];

  return (
    <div className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-5 md:p-8 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          <UtensilsCrossed className="h-3.5 w-3.5" />
          Interactive
        </span>
        <h4 className="text-xl md:text-2xl font-bold text-foreground">The Border Plate</h4>
      </div>
      <p className="mb-8 max-w-3xl text-muted-foreground leading-relaxed">
        Drive 120 kilometres from the Austrian border to the lagoon and the menu rewrites itself twice. Slide
        from mountain to sea and watch the same four courses change nationality.
      </p>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Mountain className="h-3.5 w-3.5 text-primary" /> Alps
          </span>
          <span className="flex items-center gap-1.5">
            Adriatic <Waves className="h-3.5 w-3.5 text-primary" />
          </span>
        </div>
        <Slider
          value={[index]}
          min={0}
          max={STOPS.length - 1}
          step={1}
          onValueChange={(v) => setIndex(v[0])}
          aria-label="Position between the Alps and the Adriatic"
        />
        <div className="mt-3 grid grid-cols-5 gap-1 text-center">
          {STOPS.map((s, i) => (
            <button
              key={s.place}
              type="button"
              onClick={() => setIndex(i)}
              className={`truncate text-[11px] transition-colors ${
                i === index ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.place}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stop.place}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h5 className="text-2xl font-bold text-foreground">{stop.place}</h5>
            <span className="text-sm text-muted-foreground">{stop.subtitle}</span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              {stop.influence}
            </span>
          </div>

          {/* influence meter */}
          <div className="mb-6 flex items-center gap-3">
            <Mountain className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-primary/70"
                animate={{ width: `${stop.alpine}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
            <Waves className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {COURSES.map(({ key, label }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="rounded-xl border border-border/60 bg-background/70 p-4"
              >
                <p className="mb-1.5 text-[11px] uppercase tracking-wide text-primary">{label}</p>
                <p className="text-sm font-medium leading-snug text-foreground">{stop[key]}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-5 max-w-3xl border-l-2 border-primary/50 pl-4 text-muted-foreground italic leading-relaxed">
            {stop.note}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
