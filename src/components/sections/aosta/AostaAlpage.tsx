import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { alpageSteps } from './aostaData';
import { AostaSection } from './AostaSection';

// Where the herd stands on the mountain for each step (SVG coords).
const SPOTS = [{ x: 300, y: 120 }, { x: 420, y: 62 }, { x: 560, y: 160 }, { x: 160, y: 215 }];
const EMOJI = ['🐄', '🧀', '🌸', '👑'];

export default function AostaAlpage() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || !alpageSteps.length) return;
    const t = setInterval(() => setI((v) => (v + 1) % alpageSteps.length), 4000);
    return () => clearInterval(t);
  }, [auto]);
  if (!alpageSteps.length) return null;
  const s = alpageSteps[i];
  const spot = SPOTS[i % SPOTS.length];
  const pick = (k: number) => { setAuto(false); setI(k); };
  return (
    <AostaSection eyebrow="Fontina DOP" title="The Alpage Summer" intro="Here the year follows the cows. Fontina is only real if it's made from raw milk of Valdostana cows, and the best wheels come from the summer pastures.">
      <div className="rounded-3xl border border-border overflow-hidden shadow-soft bg-gradient-to-b from-accent/30 via-background to-primary/10">
        <svg viewBox="0 0 700 260" className="w-full h-auto" aria-hidden>
          <motion.circle cx="610" cy="50" r="26" fill="hsl(var(--primary) / 0.35)" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 4, repeat: Infinity }} />
          <path d="M0 200 L120 120 L200 160 L300 90 L420 40 L520 110 L600 70 L700 140 L700 260 L0 260Z" fill="hsl(var(--muted-foreground) / 0.18)" />
          <path d="M395 58 L420 40 L445 58 L430 62 L420 55 L410 62Z" fill="hsl(var(--background))" />
          <path d="M0 230 Q180 180 350 200 T700 190 L700 260 L0 260Z" fill="hsl(var(--primary) / 0.25)" />
          <path d="M160 215 C230 170 260 140 300 120 C350 95 390 70 420 62 C480 90 520 130 560 160" fill="none" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" strokeDasharray="5 6" />
          <text x="20" y="250" fontSize="11" letterSpacing="2" className="fill-muted-foreground">VALLEY · 600 m</text>
          <text x="380" y="30" fontSize="11" letterSpacing="2" className="fill-muted-foreground">ALPAGE · 2,000 m+</text>
          {SPOTS.slice(0, alpageSteps.length).map((p, k) => (
            <g key={k} onClick={() => pick(k)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r="16" fill={k === i ? 'hsl(var(--primary))' : 'hsl(var(--background))'} stroke="hsl(var(--primary))" strokeWidth="2" />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="13" fontWeight="700" className={k === i ? 'fill-primary-foreground' : 'fill-primary'}>{k + 1}</text>
            </g>
          ))}
          <motion.g animate={{ x: spot.x, y: spot.y - 34 }} transition={{ type: 'spring', stiffness: 60, damping: 12 }}>
            <motion.text textAnchor="middle" fontSize="30" animate={{ y: [0, -5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>{EMOJI[i % EMOJI.length]}</motion.text>
          </motion.g>
        </svg>
        <div className="grid md:grid-cols-[auto_1fr] gap-6 p-6 md:p-8 border-t border-border bg-background/80">
          <div className="flex md:flex-col gap-2">
            {alpageSteps.map((st, k) => (
              <button key={st.title} onClick={() => pick(k)} aria-pressed={k === i}
                className={cn('relative rounded-2xl px-4 py-2 text-left text-sm transition-colors overflow-hidden', k === i ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted')}>
                <span className="font-semibold">{k + 1}. {st.title.split(':')[0]}</span>
                {k === i && auto && <motion.span key={`p${i}`} className="absolute bottom-0 left-0 h-0.5 bg-primary-foreground/70" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 4, ease: 'linear' }} />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={s.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">{s.month}</p>
              <h3 className="text-2xl md:text-3xl font-bold mt-1 flex items-center gap-3"><span className="text-3xl">{EMOJI[i % EMOJI.length]}</span>{s.title}</h3>
              <p className="text-muted-foreground mt-2 text-lg max-w-2xl">{s.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AostaSection>
  );
}
