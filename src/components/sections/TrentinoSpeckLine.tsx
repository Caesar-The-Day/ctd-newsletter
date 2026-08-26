import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, MoveHorizontal, Wheat, Flame } from 'lucide-react';

interface Stop {
  pos: number;
  place: string;
  tongue: string;
  plate: string;
  starch: string;
  fat: string;
  dessert: string;
  drink: string;
  note: string;
}

const STOPS: Stop[] = [
  {
    pos: 0,
    place: 'Brunico / Bruneck',
    tongue: 'German first, Italian second',
    plate: 'Speck, Graukäse and rye bread — a Marende board',
    starch: 'Rye and dumplings',
    fat: 'Butter and lard',
    dessert: 'Apfelstrudel with cream',
    drink: 'Vernatsch, or a Forst beer',
    note: 'A Gasthaus with a wood-panelled Stube, a tiled stove, and a menu you could read in Innsbruck without noticing you had crossed a border.',
  },
  {
    pos: 33,
    place: 'Val Badia (Ladin)',
    tongue: 'Ladin, then German, then Italian',
    plate: 'Turtres — fried pastry with spinach and ricotta',
    starch: 'Barley, buckwheat, rye',
    fat: 'Butter, with olive oil appearing',
    dessert: 'Kaiserschmarrn, or fritters',
    drink: 'Kerner from the Isarco valley',
    note: 'The Ladin valleys are the hinge. Barley soup and dumplings sit next to pasta on the same menu, and nobody treats it as fusion.',
  },
  {
    pos: 62,
    place: 'Bolzano / Bozen',
    tongue: 'Italian city, German province',
    plate: 'Canederli in brodo, then Lagrein',
    starch: 'Bread dumplings and the first polenta',
    fat: 'Butter losing ground to oil',
    dessert: 'Zelten in December',
    drink: 'Santa Maddalena, by the glass',
    note: 'The one place where both kitchens are on every street. A German butcher on one side of the piazza, a Neapolitan pizzeria on the other, both busy.',
  },
  {
    pos: 100,
    place: 'Trento and the Garda end',
    tongue: 'Italian, and only Italian',
    plate: 'Carne salada with borlotti beans',
    starch: 'Yellow polenta, stirred slow',
    fat: 'Olive oil from Lake Garda',
    dessert: 'Torta di grano saraceno',
    drink: 'Teroldego, or a Trentodoc',
    note: 'South of the Salorno gorge the smoke disappears and the food becomes recognisably Italian — with lake fish, olive oil and a dialect closer to Veneto.',
  },
];

function interpolate(pos: number) {
  let lower = STOPS[0];
  let upper = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (pos >= STOPS[i].pos && pos <= STOPS[i + 1].pos) {
      lower = STOPS[i];
      upper = STOPS[i + 1];
      break;
    }
  }
  return pos - lower.pos <= upper.pos - pos ? lower : upper;
}

export function TrentinoSpeckLine() {
  const [pos, setPos] = useState(50);
  const stop = interpolate(pos);
  const germanShare = Math.round(100 - pos);

  return (
    <div className="mt-12 md:mt-16 rounded-2xl border border-border/60 bg-card/60 overflow-hidden">
      <div className="p-6 md:p-10 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
          <MoveHorizontal className="h-4 w-4" />
          Interactive — the speck line
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Drag south and watch dinner change</h3>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          There is no signpost for it, but there is a line across this region where butter gives way to olive oil and
          the dumpling surrenders to polenta. Slide from Brunico down to Lake Garda and watch the plate reorganise
          itself.
        </p>
      </div>

      <div className="p-6 md:p-10">
        {/* Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground mb-2">
            <span>North · Tyrolean</span>
            <span>South · Italian</span>
          </div>
          <div className="relative">
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-primary/70 via-muted to-primary/30 overflow-hidden" />
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Move north to south across the region"
              className="absolute inset-0 h-3 w-full cursor-pointer opacity-0"
            />
            <motion.div
              className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-primary bg-background shadow-md"
              animate={{ left: `${pos}%` }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {STOPS.map((s) => (
              <button
                key={s.place}
                type="button"
                onClick={() => setPos(s.pos)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  s.place === stop.place
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {s.place}
              </button>
            ))}
          </div>
        </div>

        {/* Balance bars */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-border/60 bg-background p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
              <Wheat className="h-3.5 w-3.5 text-primary" /> Rye, smoke &amp; butter
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${germanShare}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              />
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">{germanShare}%</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-background p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
              <Flame className="h-3.5 w-3.5 text-primary" /> Polenta, oil &amp; lake fish
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${pos}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              />
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">{pos}%</div>
          </div>
        </div>

        {/* Plate */}
        <motion.div
          key={stop.place}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl border border-border/60 bg-background p-5 md:p-7"
        >
          <div className="flex items-start gap-3 mb-4">
            <Utensils className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-xl md:text-2xl font-bold text-foreground">{stop.place}</h4>
              <p className="text-sm text-muted-foreground">{stop.tongue}</p>
            </div>
          </div>

          <p className="text-lg md:text-xl font-semibold text-foreground mb-5">{stop.plate}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {[
              ['Starch', stop.starch],
              ['Fat', stop.fat],
              ['Dessert', stop.dessert],
              ['In the glass', stop.drink],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{label}</div>
                <div className="text-sm text-foreground">{value}</div>
              </div>
            ))}
          </div>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{stop.note}</p>
        </motion.div>
      </div>
    </div>
  );
}
