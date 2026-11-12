import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Clock, Ticket, Plane, Building2, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { doorstep } from './aostaData';
import { AostaSection } from './AostaSection';

// Schematic positions (not to scale) relative to Aosta at the centre.
const POS: Record<string, { x: number; y: number; flag: string; icon: typeof Car }> = {
  'Turin': { x: 470, y: 300, flag: '🇮🇹', icon: Building2 },
  'Chamonix (France)': { x: 95, y: 120, flag: '🇫🇷', icon: Mountain },
  'Geneva airport': { x: 130, y: 35, flag: '🇨🇭', icon: Plane },
  'Martigny (Switzerland)': { x: 290, y: 40, flag: '🇨🇭', icon: Mountain },
  'Milan': { x: 560, y: 205, flag: '🇮🇹', icon: Building2 },
};
const AOSTA = { x: 270, y: 200 };

export default function AostaDoorstep() {
  const [i, setI] = useState(0);
  if (!doorstep.length) return null;
  const d = doorstep[i];
  return (
    <AostaSection eyebrow="Three countries, one valley" title="Switzerland and France on Your Doorstep" intro="Can you live here and fly out of Geneva, or shop in Chamonix? Yes, if you plan around the tunnels. Tap a destination. Times are by car in good weather.">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-stretch">
        <div className="relative rounded-3xl border border-border overflow-hidden shadow-soft bg-gradient-to-br from-primary/10 via-background to-accent/20">
          <svg viewBox="0 0 620 340" className="w-full h-auto" role="img" aria-label="Schematic map of routes from the Aosta Valley">
            {/* mountain silhouette */}
            <path d="M0 150 L60 90 L100 125 L150 60 L200 115 L250 70 L300 120 L350 55 L400 110 L440 80 L480 130 L520 100 L620 160 L620 0 L0 0Z" fill="hsl(var(--muted-foreground) / 0.08)" />
            <path d="M150 60 L135 78 L165 78Z M350 55 L335 74 L366 74Z M250 70 L238 85 L262 85Z" fill="hsl(var(--background))" opacity="0.9" />
            <text x="40" y="20" className="fill-muted-foreground" fontSize="11" letterSpacing="2">SWITZERLAND · FRANCE</text>
            <text x="40" y="330" className="fill-muted-foreground" fontSize="11" letterSpacing="2">ITALY</text>
            {doorstep.map((r, k) => {
              const p = POS[r.place]; if (!p) return null;
              const active = k === i;
              const mid = { x: (AOSTA.x + p.x) / 2 + (p.y < AOSTA.y ? -30 : 20), y: (AOSTA.y + p.y) / 2 - 20 };
              const dPath = `M${AOSTA.x} ${AOSTA.y} Q${mid.x} ${mid.y} ${p.x} ${p.y}`;
              return (
                <g key={r.place}>
                  <path d={dPath} fill="none" stroke="hsl(var(--muted-foreground) / 0.25)" strokeWidth="2" strokeDasharray="4 6" />
                  {active && (
                    <motion.path key={`a${k}`} d={dPath} fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
                  )}
                  {active && (
                    <motion.circle key={`c${k}`} r="6" fill="hsl(var(--primary))"
                      initial={{ offsetDistance: '0%' } as never} animate={{ offsetDistance: '100%' } as never}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ offsetPath: `path('${dPath}')` } as React.CSSProperties} />
                  )}
                  <g onClick={() => setI(k)} className="cursor-pointer" role="button" aria-label={r.place}>
                    <motion.circle cx={p.x} cy={p.y} r={active ? 20 : 15} animate={{ r: active ? 20 : 15 }}
                      fill={active ? 'hsl(var(--primary))' : 'hsl(var(--background))'} stroke="hsl(var(--primary))" strokeWidth="2" />
                    <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14">{p.flag}</text>
                    <text x={p.x} y={p.y + 36} textAnchor="middle" fontSize="12" fontWeight="600" className="fill-foreground">{r.place.replace(/ \(.*\)/, '')}</text>
                  </g>
                </g>
              );
            })}
            <motion.circle cx={AOSTA.x} cy={AOSTA.y} r="26" fill="hsl(var(--primary) / 0.15)" animate={{ r: [22, 32, 22] }} transition={{ duration: 2.5, repeat: Infinity }} />
            <circle cx={AOSTA.x} cy={AOSTA.y} r="11" fill="hsl(var(--foreground))" />
            <text x={AOSTA.x} y={AOSTA.y + 30} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-foreground">Aosta</text>
          </svg>
          <p className="absolute bottom-2 left-4 text-[10px] uppercase tracking-widest text-muted-foreground">Schematic, not to scale</p>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div key={d.place} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
              className="rounded-3xl bg-primary text-primary-foreground p-6 shadow-soft">
              <p className="text-4xl mb-2">{POS[d.place]?.flag}</p>
              <h3 className="text-2xl font-bold">{d.place}</h3>
              <p className="text-sm opacity-90 mt-1">{d.note}</p>
              <div className="grid grid-cols-3 gap-2 mt-5">
                {[{ I: Car, l: 'Route', v: d.via }, { I: Clock, l: 'Drive', v: d.time }, { I: Ticket, l: 'Toll', v: d.toll }].map(({ I, l, v }) => (
                  <div key={l} className="rounded-2xl bg-primary-foreground/15 p-3">
                    <I className="h-4 w-4 mb-1 opacity-80" />
                    <p className="text-[10px] uppercase tracking-widest opacity-75">{l}</p>
                    <p className="text-sm font-semibold leading-tight">{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-wrap gap-2">
            {doorstep.map((r, k) => (
              <button key={r.place} onClick={() => setI(k)} aria-pressed={k === i}
                className={cn('rounded-full border px-3 py-1.5 text-sm transition-all', k === i ? 'border-primary bg-primary/10 text-primary font-semibold' : 'border-border hover:border-primary/40')}>
                {POS[r.place]?.flag} {r.place.replace(/ \(.*\)/, '')}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-auto">Tolls are approximate car fares. Check current prices with the tunnel operators.</p>
        </div>
      </div>
    </AostaSection>
  );
}
