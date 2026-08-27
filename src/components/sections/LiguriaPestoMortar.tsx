import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, RotateCcw, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type Ingredient = {
  id: string;
  name: string;
  detail: string;
  dop: boolean;
  /** grams in the Consorzio's reference recipe (for ~4 portions) */
  grams: number;
};

const CANON: Ingredient[] = [
  { id: 'basil', name: 'Basilico Genovese DOP', detail: 'Small young leaves from Pra\u2019 — no mint note, no bitterness.', dop: true, grams: 50 },
  { id: 'oil', name: 'Ligurian extra virgin olive oil', detail: 'Taggiasca — sweet and low in polyphenols, so it never turns the sauce bitter.', dop: true, grams: 60 },
  { id: 'parmigiano', name: 'Parmigiano Reggiano (30 months)', detail: 'The savoury backbone. Grated, never pre-packed.', dop: true, grams: 60 },
  { id: 'pecorino', name: 'Pecorino Sardo (fiore sardo)', detail: 'The sheep\u2019s-milk edge. Roughly a third of the cheese weight.', dop: true, grams: 25 },
  { id: 'pinoli', name: 'Pine nuts (Mediterranean)', detail: 'Italian or Iberian pinoli. Chinese pine nuts leave a metallic aftertaste.', dop: false, grams: 15 },
  { id: 'garlic', name: 'Garlic — Vessalico', detail: 'One or two cloves from the Arroscia valley. Restrained, not aggressive.', dop: false, grams: 6 },
  { id: 'salt', name: 'Coarse sea salt', detail: 'Also the abrasive that tears the basil instead of bruising it.', dop: false, grams: 3 },
];

const IMPOSTORS: Ingredient[] = [
  { id: 'walnut', name: 'Walnuts instead of pine nuts', detail: 'Fine in salsa di noci — not in pesto. Cheap substitution you meet on tourist menus.', dop: false, grams: 0 },
  { id: 'cream', name: 'Cream', detail: 'The tell-tale sign of an industrial jar or a kitchen hiding thin sauce.', dop: false, grams: 0 },
  { id: 'lemon', name: 'Lemon juice', detail: 'Keeps the green bright for the camera; flattens the basil in the mouth.', dop: false, grams: 0 },
  { id: 'blender', name: 'Blender, run hot', detail: 'Friction cooks the basil and oxidises it. The mortar is a method, not nostalgia.', dop: false, grams: 0 },
];

export function LiguriaPestoMortar() {
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const all = useMemo(() => [...CANON, ...IMPOSTORS], []);
  const canonIds = CANON.map((i) => i.id);

  const toggle = (id: string) => {
    setChecked(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const correct = picked.filter((id) => canonIds.includes(id)).length;
  const wrong = picked.filter((id) => !canonIds.includes(id)).length;
  const missing = canonIds.length - correct;
  const score = Math.max(0, Math.round(((correct - wrong) / canonIds.length) * 100));

  const verdict =
    score === 100
      ? 'Consorzio-approved. That is the mortar recipe, exactly.'
      : score >= 70
        ? 'Close. A Genovese nonna would eat it and say nothing.'
        : score >= 40
          ? 'Edible. Not pesto genovese.'
          : 'This is the jar at the airport.';

  return (
    <div className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-5 md:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="text-xl md:text-2xl font-bold text-foreground">Build the mortar</h4>
          <p className="text-sm text-muted-foreground max-w-2xl mt-1">
            Pesto genovese has seven ingredients and no room for improvisation. Pick what belongs — and
            leave out what restaurants add when nobody local is watching.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPicked([]);
            setChecked(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((ing) => {
          const isPicked = picked.includes(ing.id);
          const isCanon = canonIds.includes(ing.id);
          const state = checked ? (isPicked ? (isCanon ? 'good' : 'bad') : isCanon ? 'missed' : 'idle') : isPicked ? 'picked' : 'idle';
          return (
            <button
              key={ing.id}
              type="button"
              onClick={() => toggle(ing.id)}
              className={cn(
                'group rounded-xl border p-3 text-left transition-all',
                state === 'idle' && 'border-border bg-background hover:border-primary/50',
                state === 'picked' && 'border-primary bg-primary/10',
                state === 'good' && 'border-primary bg-primary/15',
                state === 'bad' && 'border-destructive/60 bg-destructive/10',
                state === 'missed' && 'border-dashed border-primary/60 bg-background',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{ing.name}</span>
                {checked && state === 'good' && <Check className="h-4 w-4 shrink-0 text-primary" />}
                {checked && state === 'bad' && <X className="h-4 w-4 shrink-0 text-destructive" />}
                {checked && state === 'missed' && <Info className="h-4 w-4 shrink-0 text-primary" />}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{ing.detail}</p>
              {checked && isCanon && ing.grams > 0 && (
                <p className="mt-2 text-[11px] uppercase tracking-wide text-primary">{ing.grams} g in the reference recipe</p>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={picked.length === 0}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40"
        >
          Check the mortar
        </button>
        {checked && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-sm">
            <span className="font-semibold text-foreground">{score}% — {verdict}</span>
            <span className="ml-2 text-muted-foreground">
              {correct}/7 right{wrong > 0 && `, ${wrong} that do not belong`}
              {missing > 0 && `, ${missing} missing`}
            </span>
          </motion.div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Reference proportions from the Consorzio del Pesto Genovese mortar recipe. Order is fixed too: garlic and salt
        first, then basil, pine nuts, cheeses, oil last and never warm.
      </p>
    </div>
  );
}

export default LiguriaPestoMortar;
