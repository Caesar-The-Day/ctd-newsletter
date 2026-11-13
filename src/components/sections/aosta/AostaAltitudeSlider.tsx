import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Snowflake, Flame, Car, Stethoscope, Users, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { altitudeStops } from './aostaData';
import { AostaSection } from './AostaSection';

// Mountain profile: altitude 300 m -> y 330, 2,200 m -> y 40
const yFor = (alt: number) => 330 - ((alt - 300) / 1900) * 290;
const PROFILE = 'M0 340 L0 330 L80 325 L150 310 L220 285 L280 255 L330 220 L380 190 L430 150 L470 110 L510 80 L540 55 L565 40 L590 20 L620 45 L660 90 L700 140 L700 340Z';
const xFor = (alt: number) => { // approximate x on the left flank for a given altitude
  const pts: [number, number][] = [[0,330],[80,325],[150,310],[220,285],[280,255],[330,220],[380,190],[430,150],[470,110],[510,80],[540,55],[565,40],[590,20]];
  const y = yFor(alt);
  for (let k = 1; k < pts.length; k++) if (pts[k][1] <= y) { const [x0,y0]=pts[k-1],[x1,y1]=pts[k]; return x0 + ((y0 - y) / (y0 - y1)) * (x1 - x0); }
  return 590;
};

export default function AostaAltitudeSlider() {
  const [i, setI] = useState(1);
  if (!altitudeStops.length) return null;
  const s = altitudeStops[i];
  const max = altitudeStops.length - 1;
  const snowLineY = yFor(Math.max(300, 2300 - s.snowDays * 14)); // snow cover creeps down as you climb
  const flakes = Math.round(s.snowDays / 6);
  const stats = [
    { icon: Snowflake, label: 'Snow days', value: `≈ ${s.snowDays} a year`, meter: s.snowDays / 120 },
    { icon: Flame, label: 'Heating (80 m²)', value: s.heating, meter: (i + 1) / (max + 1) },
    { icon: Car, label: 'Roads', value: s.roads },
    { icon: Stethoscope, label: 'Hospital in Aosta', value: s.hospital },
    { icon: Users, label: 'All year', value: s.population },
  ];
  return (
    <AostaSection muted eyebrow="From vineyard to glacier" title="1,700 Metres in One Hour's Drive" intro="Valle d'Aosta goes from 345 m to above 2,000 m with people living at every height. Climb the mountain and watch daily life change.">
      <div className="rounded-3xl border border-border bg-background overflow-hidden shadow-soft">
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <div className="relative">
            <svg viewBox="0 0 700 340" className="w-full h-auto block" role="img" aria-label={`${s.town}, ${s.altitude} metres`}>
              <defs>
                <linearGradient id="vdaAltSky" x1="0" y1="0" x2="0" y2="1">
                  <motion.stop offset="0" animate={{ stopColor: `hsl(var(--primary) / ${0.06 + i * 0.03})` }} />
                  <stop offset="1" stopColor="hsl(var(--background))" />
                </linearGradient>
                <clipPath id="vdaMtn"><path d={PROFILE} /></clipPath>
              </defs>
              <rect width="700" height="340" fill="url(#vdaAltSky)" />
              {/* falling snow, more as you climb */}
              {Array.from({ length: flakes }).map((_, k) => (
                <motion.circle key={`${i}-${k}`} r={1.5 + (k % 3)} fill="hsl(var(--muted-foreground) / 0.5)" cx={(k * 97) % 700}
                  initial={{ cy: -10 }} animate={{ cy: 340 }} transition={{ duration: 5 + (k % 4), repeat: Infinity, delay: (k % 7) * 0.6, ease: 'linear' }} />
              ))}
              <path d={PROFILE} fill="hsl(var(--primary) / 0.45)" />
              {/* vineyard rows at the foot */}
              {Array.from({ length: 7 }).map((_, k) => <path key={k} d={`M${10 + k * 26} ${332 - k * 2} q8 -6 16 0`} stroke="hsl(var(--primary) / 0.6)" strokeWidth="2" fill="none" />)}
              {/* forest band */}
              {Array.from({ length: 9 }).map((_, k) => { const x = 250 + k * 22; const y = 270 - k * 9; return <path key={k} d={`M${x} ${y} l6 -14 l6 14z`} fill="hsl(var(--foreground) / 0.3)" />; })}
              {/* snow cover */}
              <motion.rect x="0" width="700" clipPath="url(#vdaMtn)" fill="hsl(var(--background))" animate={{ y: 0, height: snowLineY }} transition={{ type: 'spring', stiffness: 60, damping: 18 }} />
              <motion.line x1="0" x2="700" stroke="hsl(var(--muted-foreground) / 0.4)" strokeDasharray="4 6" animate={{ y1: snowLineY, y2: snowLineY }} />
              {/* road */}
              <path d={altitudeStops.map((a, k) => `${k ? 'L' : 'M'}${xFor(a.altitude)} ${yFor(a.altitude)}`).join(' ')} stroke="hsl(var(--foreground) / 0.35)" strokeWidth="2.5" strokeDasharray="6 5" fill="none" />
              {altitudeStops.map((a, k) => (
                <g key={a.town} onClick={() => setI(k)} className="cursor-pointer">
                  <circle cx={xFor(a.altitude)} cy={yFor(a.altitude)} r={k === i ? 0 : 6} fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
                  <text x={xFor(a.altitude) - 10} y={yFor(a.altitude) + 4} textAnchor="end" fontSize="11" fill="hsl(var(--muted-foreground))">{a.altitude} m</text>
                </g>
              ))}
              <motion.g animate={{ x: xFor(s.altitude), y: yFor(s.altitude) }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
                <motion.circle r="18" fill="hsl(var(--primary) / 0.25)" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
                <circle r="9" fill="hsl(var(--primary))" />
              </motion.g>
            </svg>
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <button onClick={() => setI(Math.min(max, i + 1))} disabled={i === max} aria-label="Climb higher" className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center disabled:opacity-40"><ChevronUp className="h-4 w-4" /></button>
              <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} aria-label="Go lower" className="h-9 w-9 rounded-full border border-border bg-background grid place-items-center disabled:opacity-40"><ChevronDown className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-border">
            <AnimatePresence mode="wait">
              <motion.div key={s.town} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.25 }}>
                <p className="text-5xl font-bold text-primary tabular-nums">{s.altitude.toLocaleString()} m</p>
                <p className="text-xl font-semibold mb-3">{s.town}</p>
                <p className="text-muted-foreground leading-relaxed">{s.verdict}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex border-t border-border overflow-x-auto">
          {altitudeStops.map((a, k) => (
            <button key={a.town} onClick={() => setI(k)} aria-pressed={k === i}
              className={cn('flex-1 min-w-[110px] px-3 py-3 text-xs font-medium transition-colors border-r border-border last:border-r-0', k === i ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50 text-muted-foreground')}>
              <span className="block font-semibold">{a.town}</span>{a.altitude} m
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 p-6 md:p-8 border-t border-border">
          {stats.map(({ icon: Icon, label, value, meter }) => (
            <motion.div key={label + s.town} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-muted/40 p-4">
              <Icon className="h-4 w-4 text-primary mb-2" />
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
              <p className="text-sm font-medium">{value}</p>
              {meter !== undefined && <div className="h-1.5 rounded-full bg-muted mt-2 overflow-hidden"><motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${Math.min(1, meter) * 100}%` }} transition={{ duration: 0.6 }} /></div>}
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground px-6 md:px-8 pb-6">Snow days and heating costs are estimates for a typical home with gas or pellet heating.</p>
      </div>
    </AostaSection>
  );
}
