import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ExternalLink, Leaf, Droplets, Fish } from 'lucide-react';

type Pillar = {
  id: string;
  name: string;
  italian: string;
  icon: typeof Leaf;
  image: string;
  alt: string;
  lede: string;
  rules: { label: string; value: string }[];
  buy: string;
  links: { label: string; href: string }[];
};

const pillars: Pillar[] = [
  {
    id: 'basil',
    name: 'Basil',
    italian: 'Basilico Genovese DOP',
    icon: Leaf,
    image: '/images/liguria/pantry-basilico.jpg',
    alt: 'Genoese basil pounded into pesto with a mortar',
    lede:
      'Genoese basil is a protected variety grown in greenhouses on the coastal slopes, above all at Prà west of Genoa. Small leaves, no mint note — that faint mintiness in supermarket basil is exactly what disqualifies it.',
    rules: [
      { label: 'Where', value: 'Coastal Liguria below 800 m, from Ventimiglia to the Magra' },
      { label: 'Harvest', value: 'Young plants, hand-picked before flowering' },
      { label: 'The seven', value: 'Basil, Ligurian olive oil, pine nuts, garlic, Parmigiano, Fiore Sardo, coarse salt' },
      { label: 'The rule', value: 'Mortar and pestle, never heat — pesto is a raw sauce' },
    ],
    buy: 'Look for the DOP mark at Genoa\'s Mercato Orientale, or buy plants at the Prà growers direct. Pesto in a jar from a Ligurian producer beats basil flown to your kitchen.',
    links: [
      { label: 'Consorzio Basilico Genovese DOP', href: 'https://www.basilicogenovesedop.it/' },
      { label: 'Pesto World Championship', href: 'https://www.pestochampionship.it/' },
    ],
  },
  {
    id: 'oil',
    name: 'Olive oil',
    italian: 'Riviera Ligure DOP · Taggiasca',
    icon: Droplets,
    image: '/images/liguria/pantry-taggiasca.jpg',
    alt: 'Taggiasca olives on the branch in the Ligurian hills',
    lede:
      'The Taggiasca olive — small, brown-purple, named for Taggia — gives the gentlest oil in Italy: low bitterness, almond and artichoke, almost sweet. It is the reason Ligurian cooking tastes delicate rather than peppery.',
    rules: [
      { label: 'Three sub-zones', value: 'Riviera dei Fiori (west), Riviera del Ponente Savonese, Riviera di Levante' },
      { label: 'Terrain', value: 'Terraced groves on dry-stone walls, largely harvested by hand and net' },
      { label: 'Yield', value: 'Tiny — Liguria produces well under one percent of Italy\'s oil' },
      { label: 'Use it for', value: 'Pesto, raw fish, focaccia, and anything you would ruin with a Tuscan oil' },
    ],
    buy: 'Buy at a frantoio in the Valle Argentina or Valle Arroscia between November and February and taste before you commit. Olives in brine travel better than you think.',
    links: [
      { label: 'Consorzio Olio Riviera Ligure DOP', href: 'https://www.oliorivieraligure.it/' },
      { label: 'Museo dell\'Olivo, Imperia', href: 'https://www.museodellolivo.com/' },
    ],
  },
  {
    id: 'anchovy',
    name: 'Anchovies',
    italian: 'Acciughe di Monterosso',
    icon: Fish,
    image: '/images/liguria/pantry-acciughe.jpg',
    alt: 'Salt-cured anchovies from Monterosso layered in a jar with olive oil and lemon',
    lede:
      'Salt-cured anchovies from Monterosso are a Slow Food presidium: caught at night with lampara lamps, gutted by hand and layered in salt in the same jars families have used for generations.',
    rules: [
      { label: 'Season', value: 'April to September, when the fish are fat' },
      { label: 'Method', value: 'Layered in coarse salt under a weight for at least a month' },
      { label: 'Fresh version', value: 'Acciughe al limone — cured in citrus, eaten the same week' },
      { label: 'Eat with', value: 'Focaccia, Cinque Terre Sciacchetrà, or simply oil and lemon' },
    ],
    buy: 'Monterosso alimentari sell them by weight from the tin; the good ones are firm and rose-coloured, never grey or mushy.',
    links: [
      { label: 'Slow Food presidium', href: 'https://www.fondazioneslowfood.com/en/slow-food-presidia/monterosso-anchovies/' },
      { label: 'Cinque Terre National Park', href: 'https://www.parconazionale5terre.it/' },
    ],
  },
];

export default function LiguriaPantry() {
  const [activeId, setActiveId] = useState(pillars[0].id);
  const active = pillars.find((p) => p.id === activeId);
  if (!active) return null;
  const Icon = active.icon;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">The Ligurian pantry</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Basil, Olives, Anchovies</h2>
          <p className="text-lg text-muted-foreground">
            A cuisine of poverty and sea trade: almost no meat, no butter, and three ingredients doing nearly all the
            work. Learn these and you can cook Liguria.
          </p>
        </div>

        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-2 mb-8">
          {pillars.map((p) => {
            const PIcon = p.icon;
            const on = p.id === activeId;
            return (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                aria-pressed={on}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300',
                  on ? 'bg-primary text-primary-foreground shadow-soft scale-105' : 'bg-card ring-1 ring-border hover:ring-primary/50'
                )}
              >
                <PIcon className="h-4 w-4" />
                {p.name}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2 items-stretch"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-soft min-h-[280px]">
              <img src={active.image} alt={active.alt} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-background ring-1 ring-background/25 backdrop-blur-sm">
                  <Icon className="h-3.5 w-3.5" /> {active.italian}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-card p-6 md:p-8 ring-1 ring-border shadow-soft">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">{active.name}</h3>
              <p className="text-base leading-relaxed text-muted-foreground mb-5">{active.lede}</p>

              <dl className="grid gap-2 sm:grid-cols-2 mb-5">
                {active.rules.map((r, i) => (
                  <motion.div
                    key={r.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="rounded-2xl bg-muted/50 p-3"
                  >
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">{r.label}</dt>
                    <dd className="text-sm leading-snug">{r.value}</dd>
                  </motion.div>
                ))}
              </dl>

              <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-4 mb-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold mb-1">Where to buy it</p>
                <p className="text-sm leading-relaxed">{active.buy}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {active.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {l.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
