import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { UtensilsCrossed, Wine, Landmark, Pause, Play, Mountain, CalendarDays } from 'lucide-react';
import { withBase as assetPath } from '@/lib/basePath';

type Card = { id: string; title: string; subtitle?: string; description: string };
type Cat = { title?: string; intro?: string; cards?: Card[] };
type Highlights = { food?: Cat; wine?: Cat; culture?: Cat } | undefined;

const IMG = '/images/valle-daosta/';
const extras: Record<string, { img: string; notes: string[]; when?: string }> = {
  'fontina-dop': { img: 'hl-fontina.jpg', notes: ['Sweet', 'Nutty', 'Melts like silk'], when: 'Aged 80+ days' },
  'seupa-la-vapelenentse': { img: 'hl-seupa.jpg', notes: ['Bread', 'Cabbage', 'Fontina'], when: 'Valpelline, winter' },
  carbonada: { img: 'carbonnade-alla-valdostana.jpg', notes: ['Beef', 'Red wine', 'Onion'], when: 'With polenta' },
  'tegole-valdostane': { img: 'hl-tegole.jpg', notes: ['Hazelnut', 'Almond', 'Crisp'], when: 'With coffee' },
  'blanc-de-morgex-et-de-la-salle': { img: 'hl-morgex-wine.jpg', notes: ['Alpine herbs', 'Green apple', 'Bone dry'] },
  torrette: { img: 'hl-torrette.jpg', notes: ['Violets', 'Red fruit', 'Medium body'] },
  'enfer-d-arvier': { img: 'hl-enfer.jpg', notes: ['Dried fruit', 'Spice', 'Sun-baked'] },
  fumin: { img: 'hl-fumin.jpg', notes: ['Tobacco', 'Leather', 'Dark berries'] },
  'fiera-di-sant-orso': { img: 'hl-sant-orso.jpg', notes: ['Woodcarving', 'Lace', 'Mulled wine'], when: '30–31 January' },
  'forte-di-bard': { img: 'bard.jpg', notes: ['Museum of the Alps', 'Exhibitions'], when: 'Open year-round' },
  'great-st-bernard-pass': { img: 'hl-st-bernard.jpg', notes: ['Hospice', 'Via Francigena', 'Dogs'], when: 'Pass open ~June–Oct' },
};

// Approximate vineyard altitudes (metres)
const vineyards = [
  { name: 'Morgex et La Salle', m: 1200 },
  { name: "Enfer d'Arvier", m: 800 },
  { name: 'Torrette (Saint-Pierre)', m: 700 },
  { name: 'Chambave', m: 550 },
  { name: 'Donnas', m: 350 },
];

const chapters = [
  { key: 'food', label: 'Food', icon: UtensilsCrossed, kicker: 'At the table' },
  { key: 'wine', label: 'Wine', icon: Wine, kicker: 'Heroic vineyards' },
  { key: 'culture', label: 'Culture', icon: Landmark, kicker: 'A thousand years' },
] as const;

function daysToSantOrso() {
  const now = new Date();
  let t = new Date(now.getFullYear(), 0, 30);
  if (now > new Date(now.getFullYear(), 0, 31, 23, 59)) t = new Date(now.getFullYear() + 1, 0, 30);
  return Math.max(0, Math.ceil((t.getTime() - now.getTime()) / 86400000));
}

export default function AostaTable({ highlights }: { highlights: Highlights }) {
  const reduce = useReducedMotion();
  const [chap, setChap] = useState<(typeof chapters)[number]['key']>('food');
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const cards = useMemo(() => (highlights?.[chap]?.cards ?? []).filter(c => c?.id), [highlights, chap]);
  const card = cards[idx] ?? cards[0];

  useEffect(() => { setIdx(0); }, [chap]);
  useEffect(() => {
    if (!playing || reduce || cards.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % cards.length), 6000);
    return () => clearInterval(t);
  }, [playing, reduce, cards.length, chap]);

  if (!highlights || !card) return null;
  const ex = extras[card.id];
  const santOrso = daysToSantOrso();

  return (
    <section className="py-16 md:py-24" aria-labelledby="aosta-table-h">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Food, Wine & Culture</p>
          <h2 id="aosta-table-h" className="text-3xl md:text-5xl font-bold mb-4">A Valley You Can Taste</h2>
          <p className="text-lg text-muted-foreground">{highlights[chap]?.intro}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6" role="tablist">
          {chapters.map(c => {
            const Icon = c.icon; const on = c.key === chap;
            return (
              <button key={c.key} role="tab" aria-selected={on} onClick={() => setChap(c.key)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors ${on ? 'text-primary-foreground' : 'text-foreground bg-muted hover:bg-muted/70'}`}>
                {on && <motion.span layoutId="aosta-table-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <Icon className="relative w-4 h-4" /><span className="relative">{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Immersive stage */}
          <div className="relative overflow-hidden rounded-3xl aspect-[4/5] sm:aspect-[16/9] bg-muted shadow-2xl">
            <AnimatePresence mode="sync">
              {ex && (
                <motion.img key={card.id} src={assetPath(IMG + ex.img)} alt={`${card.title}, Valle d'Aosta`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: reduce ? 1.02 : 1.0 }}
                  exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.9 }, scale: { duration: 7, ease: 'linear' } }} />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />

            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-semibold uppercase tracking-wider">
                {chapters.find(c => c.key === chap)?.kicker} · {idx + 1}/{cards.length}
              </span>
              <button onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
                className="w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center">
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-background">
              <AnimatePresence mode="wait">
                <motion.div key={card.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }} className="max-w-2xl">
                  {card.subtitle && <p className="text-xs md:text-sm uppercase tracking-[0.2em] opacity-80 mb-2">{card.subtitle}</p>}
                  <h3 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">{card.title}</h3>
                  <p className="text-base md:text-lg opacity-90 mb-4">{card.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {ex?.notes.map((n, i) => (
                      <motion.span key={n} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.12 }}
                        className="px-3 py-1 rounded-full bg-background/20 backdrop-blur border border-background/30 text-sm">{n}</motion.span>
                    ))}
                    {ex?.when && <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">{ex.when}</span>}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* progress bar */}
            {playing && !reduce && (
              <motion.div key={`${chap}-${idx}`} className="absolute bottom-0 left-0 h-1 bg-primary" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 6, ease: 'linear' }} />
            )}
          </div>

          {/* Filmstrip */}
          <div className="grid gap-3 mt-4" style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0,1fr))` }}>
            {cards.map((c, i) => (
              <button key={c.id} onClick={() => { setIdx(i); setPlaying(false); }}
                className={`group relative overflow-hidden rounded-xl aspect-[3/2] ring-2 transition-all ${i === idx ? 'ring-primary' : 'ring-transparent opacity-70 hover:opacity-100'}`}>
                {extras[c.id] && <img src={assetPath(IMG + extras[c.id].img)} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                <span className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <span className="absolute bottom-1.5 left-2 right-2 text-left text-background text-xs md:text-sm font-semibold leading-tight line-clamp-2">{c.title}</span>
              </button>
            ))}
          </div>

          {/* Chapter extra */}
          <AnimatePresence mode="wait">
            <motion.div key={chap} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 rounded-2xl border bg-card p-6 md:p-8">
              {chap === 'wine' && (
                <div>
                  <div className="flex items-center gap-2 mb-1"><Mountain className="w-5 h-5 text-primary" /><h3 className="text-lg font-bold">How high the vines climb</h3></div>
                  <p className="text-sm text-muted-foreground mb-5">Approximate vineyard altitudes, from the Piemonte border up to the foot of Mont Blanc.</p>
                  <div className="space-y-3">
                    {vineyards.map((v, i) => (
                      <div key={v.name} className="flex items-center gap-3">
                        <span className="w-40 md:w-52 text-sm shrink-0">{v.name}</span>
                        <div className="flex-1 h-7 rounded-full bg-muted overflow-hidden">
                          <motion.div className="h-full rounded-full bg-primary flex items-center justify-end pr-3 text-xs font-semibold text-primary-foreground"
                            initial={{ width: 0 }} animate={{ width: `${(v.m / 1300) * 100}%` }} transition={{ delay: i * 0.12, duration: 0.9, ease: 'easeOut' }}>
                            {v.m.toLocaleString()} m
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Morgex's vines grow on low pergolas, which help protect them from frost. They're among the highest in Europe.</p>
                </div>
              )}
              {chap === 'food' && (
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  {[{ n: '100%', l: 'Fontina milk from Valdostan cows' }, { n: '2×', l: 'milkings, each made into cheese within hours' }, { n: '~3', l: 'months minimum ageing, often in rock caves' }].map((s, i) => (
                    <motion.div key={s.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                      <div className="text-4xl md:text-5xl font-bold text-primary mb-1">{s.n}</div>
                      <p className="text-sm text-muted-foreground">{s.l}</p>
                    </motion.div>
                  ))}
                </div>
              )}
              {chap === 'culture' && (
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-32 h-32 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="44" className="stroke-muted" strokeWidth="8" fill="none" />
                      <motion.circle cx="50" cy="50" r="44" className="stroke-primary" strokeWidth="8" fill="none" strokeLinecap="round"
                        strokeDasharray={276.5} initial={{ strokeDashoffset: 276.5 }} animate={{ strokeDashoffset: 276.5 * (santOrso / 365) }} transition={{ duration: 1.4, ease: 'easeOut' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{santOrso}</span><span className="text-xs text-muted-foreground">days</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1"><CalendarDays className="w-5 h-5 text-primary" /><h3 className="text-lg font-bold">Until the next Fiera di Sant'Orso</h3></div>
                    <p className="text-muted-foreground">Every 30–31 January, about a thousand craftspeople fill Aosta's old town. It's the best weekend of the year to meet the valley, so book a room early, because they're gone by autumn.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
