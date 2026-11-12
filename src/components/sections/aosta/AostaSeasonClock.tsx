import { useState } from 'react';
import { cn } from '@/lib/utils';
import { seasonMonths } from './aostaData';
import { AostaSection } from './AostaSection';

export default function AostaSeasonClock() {
  const [i, setI] = useState(0);
  if (!seasonMonths.length) return null;
  return (
    <AostaSection muted eyebrow="Plan your year" title="The Snow Season Clock" intro="Life here has two high seasons and two dead ones. Tap a month to see what's open and what's going on.">
      <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-6">
        {seasonMonths.map((m, k) => (
          <button key={m.m} onClick={() => setI(k)} aria-pressed={k === i}
            className={cn('rounded-xl border py-3 text-sm font-semibold transition-colors', k === i ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/40')}>
            {m.m}
            <span className="block mt-1 mx-auto h-1.5 rounded-full" style={{ width: `${10 + m.ski * 8}px`, background: m.ski ? 'hsl(var(--primary) / 0.7)' : 'hsl(var(--muted-foreground) / 0.3)' }} />
          </button>
        ))}
      </div>
      <div className="rounded-3xl border border-border bg-background p-6 shadow-soft text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Ski: {['off', 'early', 'spring', 'full'][seasonMonths[i].ski]}</p>
        <p className="text-lg font-medium mt-2">{seasonMonths[i].tag}</p>
      </div>
    </AostaSection>
  );
}
