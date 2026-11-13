import { useEffect, useState } from 'react';
import { Snowflake, Sun, Leaf, CloudRain, Grape, Mountain, Pause, Play, Users, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { seasonMonths } from './aostaData';
import { AostaSection } from './AostaSection';

// Rough, labelled estimates for the year view (season band, crowds, how much is open).
const extra = [
  { s: 'ski', crowd: 3, open: 4, icon: Snowflake }, { s: 'ski', crowd: 4, open: 4, icon: Snowflake },
  { s: 'ski', crowd: 3, open: 4, icon: Snowflake }, { s: 'mud', crowd: 2, open: 3, icon: CloudRain },
  { s: 'mud', crowd: 1, open: 1, icon: CloudRain }, { s: 'summer', crowd: 2, open: 3, icon: Mountain },
  { s: 'summer', crowd: 4, open: 4, icon: Sun }, { s: 'summer', crowd: 4, open: 4, icon: Sun },
  { s: 'summer', crowd: 2, open: 3, icon: Grape }, { s: 'mud', crowd: 2, open: 2, icon: Leaf },
  { s: 'mud', crowd: 1, open: 1, icon: CloudRain }, { s: 'ski', crowd: 4, open: 4, icon: Snowflake },
];
const seasonStyle: Record<string, { label: string; fill: string }> = {
  ski: { label: 'Ski season', fill: 'hsl(var(--primary))' },
  summer: { label: 'Summer season', fill: 'hsl(var(--accent))' },
  mud: { label: 'Quiet season', fill: 'hsl(var(--muted-foreground) / 0.45)' },
};

const R = 140, r = 88, C = 170;
const pt = (rad: number, a: number) => [C + rad * Math.sin(a), C - rad * Math.cos(a)];
function arc(k: number) {
  const a0 = (k / 12) * Math.PI * 2 + 0.02, a1 = ((k + 1) / 12) * Math.PI * 2 - 0.02;
  const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1), [x2, y2] = pt(r, a1), [x3, y3] = pt(r, a0);
  return `M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 0 0 ${x3},${y3} Z`;
}

function Meter({ n, label, Icon }: { n: number; label: string; Icon: typeof Users }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <span className="text-sm w-28 text-muted-foreground">{label}</span>
      <div className="flex gap-1">{[1, 2, 3, 4].map(v => (
        <span key={v} className={cn('h-2.5 w-7 rounded-full transition-all duration-500', v <= n ? 'bg-primary' : 'bg-muted')} style={{ transitionDelay: `${v * 60}ms` }} />
      ))}</div>
    </div>
  );
}

export default function AostaSeasonClock() {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(true);
  useEffect(() => {
    if (!play || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI(v => (v + 1) % 12), 2600);
    return () => clearInterval(t);
  }, [play]);
  if (seasonMonths.length !== 12) return null;
  const m = seasonMonths[i], e = extra[i], Icon = e.icon, st = seasonStyle[e.s];
  const pick = (k: number) => { setI(k); setPlay(false); };

  return (
    <AostaSection muted eyebrow="Plan your year" title="The Snow Season Clock" intro="Life here has two high seasons and two dead ones. Watch the year turn, or tap a month to see what's open and what's going on.">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative mx-auto w-full max-w-[380px]">
          <svg viewBox="0 0 340 340" className="w-full drop-shadow-sm" role="group" aria-label="Year wheel">
            {seasonMonths.map((mm, k) => {
              const [lx, ly] = pt((R + r) / 2, ((k + 0.5) / 12) * Math.PI * 2);
              return (
                <g key={mm.m} onClick={() => pick(k)} className="cursor-pointer" role="button" aria-label={mm.m} aria-pressed={k === i}>
                  <path d={arc(k)} fill={seasonStyle[extra[k].s].fill}
                    opacity={k === i ? 1 : 0.55}
                    style={{ transform: k === i ? 'scale(1.04)' : 'scale(1)', transformOrigin: `${C}px ${C}px`, transition: 'all .4s' }} />
                  <text x={lx} y={ly + 4} textAnchor="middle" className="text-[12px] font-semibold pointer-events-none" fill="hsl(var(--primary-foreground))">{mm.m}</text>
                </g>
              );
            })}
            {/* snow depth ring */}
            {seasonMonths.map((mm, k) => mm.ski > 0 && (
              <path key={'s' + k} d={(() => { const a0 = (k / 12) * Math.PI * 2 + 0.05, a1 = ((k + 1) / 12) * Math.PI * 2 - 0.05, rr = R + 8 + mm.ski * 3; const [x0, y0] = pt(rr, a0), [x1, y1] = pt(rr, a1); return `M${x0},${y0} A${rr},${rr} 0 0 1 ${x1},${y1}`; })()}
                stroke="hsl(var(--primary) / 0.35)" strokeWidth={mm.ski * 2.5} fill="none" strokeLinecap="round" />
            ))}
            <circle cx={C} cy={C} r={r - 6} fill="hsl(var(--background))" stroke="hsl(var(--border))" />
            <g style={{ transform: `rotate(${(i + 0.5) * 30}deg)`, transformOrigin: `${C}px ${C}px`, transition: 'transform .8s cubic-bezier(.5,1.6,.4,1)' }}>
              <line x1={C} y1={C} x2={C} y2={C - r + 14} stroke="hsl(var(--primary))" strokeWidth={3} strokeLinecap="round" />
              <circle cx={C} cy={C - r + 14} r={5} fill="hsl(var(--primary))" />
            </g>
            <circle cx={C} cy={C} r={6} fill="hsl(var(--primary))" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div key={i} className="flex flex-col items-center animate-fade-in pt-24">
              <Icon className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold mt-1">{m.m}</span>
            </div>
          </div>
          <button onClick={() => setPlay(p => !p)} className="absolute bottom-0 right-0 rounded-full border border-border bg-background p-2.5 shadow-soft hover:border-primary/50" aria-label={play ? 'Pause' : 'Play'}>
            {play ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>

        <div key={i} className="rounded-3xl border border-border bg-background p-7 shadow-soft animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground" style={{ background: st.fill }}>
            <Icon className="h-3.5 w-3.5" /> {st.label}
          </span>
          <p className="text-xl font-semibold mt-4 leading-snug">{m.tag}</p>
          <div className="mt-6 space-y-3">
            <Meter n={m.ski + (m.ski ? 1 : 0)} label="Ski" Icon={Snowflake} />
            <Meter n={e.crowd} label="Crowds" Icon={Users} />
            <Meter n={e.open} label="Shops open" Icon={Store} />
          </div>
          <div className="mt-6 flex gap-1.5">
            {seasonMonths.map((mm, k) => (
              <button key={mm.m} onClick={() => pick(k)} aria-label={mm.m} className={cn('h-1.5 flex-1 rounded-full transition-all', k === i ? 'bg-primary' : 'bg-muted hover:bg-primary/40')} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Crowd and opening levels are rough estimates for resort villages; Aosta town stays open year-round.</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        {Object.values(seasonStyle).map(s => (
          <span key={s.label} className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: s.fill }} />{s.label}</span>
        ))}
        <span className="inline-flex items-center gap-2"><span className="h-1.5 w-5 rounded-full bg-primary/35" />Snow depth</span>
      </div>
    </AostaSection>
  );
}
