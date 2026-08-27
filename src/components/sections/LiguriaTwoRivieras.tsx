import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sun, Euro, Users, TrainFront, Plane, Home, Sailboat } from 'lucide-react';

type Side = 'ponente' | 'levante';

const rows: { icon: typeof Sun; label: string; ponente: string; levante: string; edge: Side }[] = [
  {
    icon: Sun,
    label: 'Climate',
    ponente: 'The mildest winter in northern Italy. Bordighera and Sanremo average 11–12 °C in January; palms and mimosa flower in February.',
    levante: 'A touch cooler and wetter, with Apennine rain funnelling into the Tigullio. Glorious May to October.',
    edge: 'ponente',
  },
  {
    icon: Euro,
    label: 'Property prices',
    ponente: 'Roughly 2,300–4,000 €/m² on the coast, less inland in the Val Nervia and Valle Arroscia.',
    levante: 'Roughly 3,500–7,000 €/m², and Portofino, Santa Margherita and the Cinque Terre are in another bracket entirely.',
    edge: 'ponente',
  },
  {
    icon: Users,
    label: 'Crowds',
    ponente: 'Busy in August, breathable the rest of the year. The winter population is real, not seasonal.',
    levante: 'Cinque Terre and Portofino run at tourist saturation from April to October; villages empty out in winter.',
    edge: 'ponente',
  },
  {
    icon: TrainFront,
    label: 'Trains',
    ponente: 'The new inland double-track line is fast to Genoa (Sanremo–Genoa in about 1h45) but stations sit above the towns.',
    levante: 'Coastal line hugging the sea; Rapallo and Chiavari have direct intercity trains to Milan and Rome.',
    edge: 'levante',
  },
  {
    icon: Plane,
    label: 'Airports',
    ponente: 'Nice (NCE) is 45–70 minutes away with a global route map. Genoa is the backup.',
    levante: 'Genoa (GOA) is close but small; Pisa (PSA) serves the eastern end in about 1h15.',
    edge: 'ponente',
  },
  {
    icon: Sailboat,
    label: 'Boating',
    ponente: 'Space and value: Imperia, Loano, Aregai and Varazze have berths and shorter lists.',
    levante: 'Prestige and scarcity: Rapallo, Portofino and Porto Venere are effectively full and priced for it.',
    edge: 'ponente',
  },
  {
    icon: Home,
    label: 'Who it suits',
    ponente: 'Retirees who want a year-round town, a garden, a berth and a French border 40 minutes away.',
    levante: 'People who want the postcard, are happy to pay for it, and value being one train from Milan.',
    edge: 'ponente',
  },
];

const sides: Record<Side, { title: string; sub: string; image: string; alt: string; anchors: string }> = {
  ponente: {
    title: 'Riviera di Ponente',
    sub: 'Ventimiglia → Genoa',
    image: '/images/liguria/san-remo.jpg',
    alt: 'The seafront and hills of Sanremo on the Riviera di Ponente',
    anchors: 'Bordighera · Sanremo · Imperia · Alassio · Albenga · Finale · Noli · Varazze',
  },
  levante: {
    title: 'Riviera di Levante',
    sub: 'Genoa → Lerici',
    image: '/images/liguria/camogli.jpg',
    alt: 'The painted houses and harbour of Camogli on the Riviera di Levante',
    anchors: 'Camogli · Portofino · Santa Margherita · Rapallo · Chiavari · Sestri Levante · Cinque Terre · Lerici',
  },
};

export default function LiguriaTwoRivieras() {
  const [side, setSide] = useState<Side>('ponente');
  const other: Side = side === 'ponente' ? 'levante' : 'ponente';
  const wins = rows.filter((r) => r.edge === side).length;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Which side of Genoa?</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ponente or Levante</h2>
          <p className="text-lg text-muted-foreground">
            Liguria is a crescent split by one city. West of Genoa is warmer, wider and cheaper. East of Genoa is the
            coast on the postcards. Ligurians treat them as different countries — and they are right.
          </p>
        </div>

        {/* Split hero */}
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-2 mb-8">
          {(['ponente', 'levante'] as Side[]).map((s) => {
            const on = side === s;
            const d = sides[s];
            return (
              <button
                key={s}
                onClick={() => setSide(s)}
                aria-pressed={on}
                className={cn(
                  'group relative overflow-hidden rounded-3xl text-left transition-all duration-500',
                  on ? 'ring-2 ring-primary shadow-soft' : 'ring-1 ring-border opacity-70 hover:opacity-100'
                )}
              >
                <div className="relative h-56 md:h-72">
                  <img
                    src={d.image}
                    alt={d.alt}
                    loading="lazy"
                    className={cn(
                      'h-full w-full object-cover transition-transform duration-700',
                      on ? 'scale-105' : 'group-hover:scale-105'
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-background/70">{d.sub}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-background">{d.title}</h3>
                    <p className="mt-1 text-xs text-background/75 leading-relaxed">{d.anchors}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Comparison */}
        <div className="max-w-5xl mx-auto space-y-3">
          {rows.map((row, i) => {
            const Icon = row.icon;
            const favoured = row.edge === side;
            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="grid gap-3 rounded-2xl bg-card p-4 ring-1 ring-border md:grid-cols-[160px_1fr_1fr] md:items-start"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-sm">{row.label}</span>
                </div>
                {(['ponente', 'levante'] as Side[]).map((s) => (
                  <p
                    key={s}
                    className={cn(
                      'rounded-xl p-3 text-sm leading-relaxed transition-colors',
                      s === side
                        ? row.edge === s
                          ? 'bg-primary/10 ring-1 ring-primary/30'
                          : 'bg-muted/60'
                        : 'bg-transparent text-muted-foreground'
                    )}
                  >
                    <span className="md:hidden block text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
                      {sides[s].title}
                    </span>
                    {row[s]}
                  </p>
                ))}
                {favoured && <span className="sr-only">Advantage {sides[side].title}</span>}
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto mt-8 rounded-3xl bg-primary/5 ring-1 ring-primary/20 p-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">The verdict</p>
          <p className="text-base leading-relaxed">
            On the criteria that matter to someone actually moving here, {sides[side].title} takes {wins} of{' '}
            {rows.length}. Choose {sides[side].title} for{' '}
            {side === 'ponente'
              ? 'winter warmth, value and a boat you can afford to keep'
              : 'the scenery, the Milan train and the Tigullio social life'}
            — and visit {sides[other].title} in February before you sign anything.
          </p>
        </div>
      </div>
    </section>
  );
}
