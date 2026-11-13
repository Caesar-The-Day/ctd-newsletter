import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Play, Pause, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sunTowns } from './aostaData';
import { AostaSection } from './AostaSection';

const sideLabel = { adret: 'Adret · sunny side', envers: 'Envers · shaded side', valley: 'Valley floor' } as const;
const RISE = 7.9, SET = 16.6; // mid-December sunrise/sunset (flat horizon)

// Sun position over a valley cross-section (south on the left, where the sun sits in winter)
function sunXY(h: number) {
  const p = (h - RISE) / (SET - RISE);
  return { x: 60 + p * 480, y: 150 - Math.sin(Math.PI * Math.min(1, Math.max(0, p))) * 120 };
}

export default function AostaSunFinder() {
  const [i, setI] = useState(0);
  const [hour, setHour] = useState(12);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      setHour((h) => { const n = h + dt * 1.4; if (n > SET) { setPlaying(false); return SET; } return n; });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing]);

  if (!sunTowns.length) return null;
  const t = sunTowns[i];
  const litFrom = 12.1 - t.decSunHours / 2, litTo = 12.1 + t.decSunHours / 2;
  const lit = hour >= litFrom && hour <= litTo;
  const sun = sunXY(hour);
  const up = hour > RISE && hour < SET;
  // town position on the cross-section
  const town = t.side === 'envers' ? { x: 150, y: 175 } : t.side === 'adret' ? { x: 450, y: 170 } : { x: 300, y: 205 };
  const fmt = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
  const play = () => { if (hour >= SET - 0.05) setHour(RISE); setPlaying((p) => !p); };

  return (
    <AostaSection eyebrow="Adret vs Envers" title="Sun or Shade? Pick Your Side of the Valley" intro="The valley runs east to west. In December the sun stays low in the south, so north-facing villages sit in the mountain's shadow while the opposite slope is bright. Pick a town, then play a winter day.">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {sunTowns.map((s, k) => (
          <button key={s.name} onClick={() => setI(k)} aria-pressed={k === i}
            className={cn('rounded-full border px-4 py-2 text-sm font-medium transition-all inline-flex items-center gap-1.5',
              k === i ? 'border-primary bg-primary text-primary-foreground shadow-soft scale-105' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground')}>
            {s.side === 'envers' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}{s.name}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-background overflow-hidden shadow-soft">
        <div className="relative">
          <svg viewBox="0 0 600 260" className="w-full h-auto block" role="img" aria-label={`${t.name} is ${lit ? 'in sun' : 'in shade'} at ${fmt(hour)}`}>
            <defs>
              <linearGradient id="vdaSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={up ? 'hsl(var(--primary) / 0.25)' : 'hsl(var(--foreground) / 0.55)'} />
                <stop offset="1" stopColor={up ? 'hsl(var(--background))' : 'hsl(var(--foreground) / 0.25)'} />
              </linearGradient>
              <radialGradient id="vdaGlow"><stop offset="0" stopColor="hsl(var(--primary) / 0.6)" /><stop offset="1" stopColor="hsl(var(--primary) / 0)" /></radialGradient>
            </defs>
            <motion.rect width="600" height="260" fill="url(#vdaSky)" animate={{ opacity: 1 }} />
            {/* sun arc */}
            <path d={`M60 150 Q300 -90 540 150`} fill="none" stroke="hsl(var(--primary) / 0.3)" strokeDasharray="4 6" />
            {up && <g><circle cx={sun.x} cy={sun.y} r="34" fill="url(#vdaGlow)" /><circle cx={sun.x} cy={sun.y} r="12" fill="hsl(var(--primary))" /></g>}
            {/* sun rays toward town when lit */}
            {up && lit && <motion.line x1={sun.x} y1={sun.y} x2={town.x} y2={town.y} stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" strokeDasharray="3 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
            {/* south ridge (envers slope faces north, away from sun) */}
            <path d="M0 90 L60 60 L110 95 L170 150 L240 200 L300 215 L360 200 L430 160 L500 120 L560 80 L600 100 L600 260 L0 260Z" fill="hsl(var(--foreground) / 0.12)" />
            <path d="M0 90 L60 60 L110 95 L170 150 L240 200 L300 215 L0 260Z" fill={lit && t.side === 'envers' ? 'hsl(var(--primary) / 0.12)' : 'hsl(var(--foreground) / 0.18)'} />
            <path d="M300 215 L360 200 L430 160 L500 120 L560 80 L600 100 L600 260Z" fill={up ? 'hsl(var(--primary) / 0.14)' : 'hsl(var(--foreground) / 0.18)'} />
            <path d="M48 66 L60 60 L72 70Z M548 86 L560 80 L572 90Z" fill="hsl(var(--background))" />
            <text x="40" y="250" fontSize="11" fill="hsl(var(--muted-foreground))">SOUTH · envers</text>
            <text x="470" y="250" fontSize="11" fill="hsl(var(--muted-foreground))">NORTH · adret</text>
            <text x="268" y="250" fontSize="11" fill="hsl(var(--muted-foreground))">Dora Baltea</text>
            {/* town */}
            <motion.g animate={{ x: town.x, y: town.y }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
              <motion.circle r="16" animate={{ fill: lit ? 'hsl(var(--primary) / 0.35)' : 'hsl(var(--foreground) / 0.2)', scale: lit ? [1, 1.25, 1] : 1 }} transition={{ repeat: lit ? Infinity : 0, duration: 2 }} />
              <path d="M-7 4 L-7 -3 L0 -9 L7 -3 L7 4Z" fill={lit ? 'hsl(var(--primary))' : 'hsl(var(--foreground) / 0.6)'} />
            </motion.g>
          </svg>
          <AnimatePresence mode="wait">
            <motion.div key={`${t.name}-${lit}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={cn('absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold inline-flex items-center gap-1.5', lit ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background')}>
              {lit ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}{fmt(hour)} · {lit ? 'in the sun' : 'in shade'}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 md:p-8 border-t border-border">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={play} aria-label={playing ? 'Pause' : 'Play a December day'} className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center hover:scale-105 transition-transform">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
            <div className="relative flex-1">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div className="absolute h-full bg-primary/70" animate={{ left: `${((litFrom - RISE) / (SET - RISE)) * 100}%`, width: `${(t.decSunHours / (SET - RISE)) * 100}%` }} />
              </div>
              <input type="range" min={RISE} max={SET} step={0.05} value={hour} onChange={(e) => { setPlaying(false); setHour(Number(e.target.value)); }} aria-label="Time of day, 21 December" className="relative w-full accent-[hsl(var(--primary))] bg-transparent" />
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground pl-[52px] mb-6"><span>Sunrise {fmt(RISE)}</span><span>21 December</span><span>Sunset {fmt(SET)}</span></div>

          <motion.div key={t.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{sideLabel[t.side]} · {t.altitude} m</p>
              <h3 className="text-2xl md:text-3xl font-bold mt-1 mb-3 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />{t.name}</h3>
              <p className="text-muted-foreground leading-relaxed">{t.note}</p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-5">
              <p className="text-4xl font-bold text-primary">≈ {t.decSunHours} h</p>
              <p className="text-sm text-muted-foreground mb-4">direct sun on a mid-December day</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-2">Days around the solstice without sun</p>
              <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1" aria-label={`${t.sunlessDays} sunless days`}>
                {Array.from({ length: 60 }).map((_, d) => (
                  <motion.span key={d} className={cn('aspect-square rounded-[3px]', d < t.sunlessDays ? 'bg-foreground/70' : 'bg-primary/30')} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: d * 0.008 }} />
                ))}
              </div>
              <p className="text-xs mt-2">{t.sunlessDays > 0 ? <>Some hamlets: <strong>about {t.sunlessDays} dark days</strong> out of the 60 around the solstice.</> : 'No sunless weeks.'}</p>
            </div>
          </motion.div>
          <p className="text-xs text-muted-foreground mt-5">Estimates based on slope orientation and the ridge to the south. Visit in December before you buy.</p>
        </div>
      </div>
    </AostaSection>
  );
}
