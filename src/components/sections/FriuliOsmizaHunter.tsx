import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, ExternalLink, Euro, Clock, MapPin, Utensils, Ban } from 'lucide-react';

const STEPS = [
  {
    id: 'frasca',
    label: 'The branch',
    icon: Leaf,
    heading: 'Look for the frasca',
    body:
      'A leafy branch hung on a pole, a gate, or a road sign means an osmiza is open somewhere down that lane. Hand-painted arrows do the rest. There is no name, no logo, and frequently no phone number.',
    facts: ['Ivy or oak branch = open', 'Arrows point the way', 'Branch comes down = closed'],
  },
  {
    id: 'rules',
    label: 'The rules',
    icon: Ban,
    heading: 'Only what the farm makes',
    body:
      'The 1784 decree of Joseph II lets Karst farmers sell their own production direct from home for a limited run of days. That means their wine, their cured meat, their cheese and eggs. No coffee, no cooked restaurant dishes, no bought-in beer — selling those would make it a bar, and a bar needs a licence.',
    facts: ['Own wine only', 'Cold plates, no kitchen', 'No coffee, no spirits'],
  },
  {
    id: 'table',
    label: 'The table',
    icon: Utensils,
    heading: 'What lands in front of you',
    body:
      'A wooden board of home-cured prosciutto and pancetta, hard-boiled eggs, pickles, a wedge of cheese, coarse bread, and a jug of Terrano or Vitovska. You share long benches with whoever else found the branch that afternoon.',
    facts: ['Cured meat board', 'Hard-boiled eggs', 'Terrano or Vitovska by the jug'],
  },
  {
    id: 'cost',
    label: 'The bill',
    icon: Euro,
    heading: 'Roughly €10–€15 a head',
    body:
      'A plate plus a half-litre of wine typically lands around €10–€15 per person. Cash is expected, change is scarce, and nobody is chasing you for the table. It is the cheapest good afternoon in northeastern Italy.',
    facts: ['Cash only, usually', 'No cover charge', 'No reservations'],
  },
  {
    id: 'when',
    label: 'When',
    icon: Clock,
    heading: 'Eight days at a time',
    body:
      'Each farm opens in short rotating stints across the year, so the map changes weekly. Locals check the calendar before driving up the plateau — spring and early autumn weekends are the sweet spot.',
    facts: ['Rotating openings', 'Best: April–June, Sept–Oct', 'Check before you drive'],
  },
];

export function FriuliOsmizaHunter() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const Icon = step.icon;

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/images/friuli-venezia-giulia/highlights/culture-osmiza.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        <div className="relative p-5 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
              <Leaf className="h-3.5 w-3.5" />
              Interactive
            </span>
            <h4 className="text-xl md:text-2xl font-bold text-foreground">How to read an Osmiza</h4>
          </div>
          <p className="max-w-3xl text-muted-foreground leading-relaxed">
            No sign, no menu, no website — a Habsburg-era licence and a branch on a pole. Work through the five
            things a local knows before driving up onto the Karst.
          </p>
        </div>
      </div>

      <div className="border-t border-border/60 p-5 md:p-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  i === active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                <StepIcon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h5 className="mb-2 text-lg font-bold text-foreground">{step.heading}</h5>
              <p className="mb-4 max-w-2xl text-muted-foreground leading-relaxed">{step.body}</p>
              <div className="flex flex-wrap gap-1.5">
                {step.facts.map((f) => (
                  <Badge key={f} variant="secondary" className="text-[11px] font-normal">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Karst plateau, 15–30 minutes above Trieste
          </span>
          <Button variant="outline" size="sm" asChild>
            <a href="https://www.osmize.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ExternalLink className="h-3 w-3" />
              See which osmize are open now
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
