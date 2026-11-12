import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sunTowns } from './aostaData';
import { AostaSection } from './AostaSection';

const sideLabel = { adret: 'Adret (sunny side)', envers: 'Envers (shaded side)', valley: 'Valley floor' } as const;

export default function AostaSunFinder() {
  const [i, setI] = useState(0);
  if (!sunTowns.length) return null;
  const t = sunTowns[i];
  const pct = Math.min(100, (t.decSunHours / 7) * 100);
  return (
    <AostaSection eyebrow="Adret vs Envers" title="Sun or Shade? Pick Your Side of the Valley" intro="The valley runs east to west. North-facing villages can go weeks without direct sun in December, while the opposite slope is bright. Locals call the sides adret and envers. Choose a town and compare.">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        <div className="flex flex-wrap gap-2 content-start">
          {sunTowns.map((s, k) => (
            <button key={s.name} onClick={() => setI(k)} aria-pressed={k === i}
              className={cn('rounded-full border px-4 py-2 text-sm font-medium transition-colors inline-flex items-center gap-1.5',
                k === i ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40')}>
              {s.side === 'envers' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}{s.name}
            </button>
          ))}
        </div>
        <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{sideLabel[t.side]} · {t.altitude} m</p>
          <h3 className="text-2xl md:text-3xl font-bold mt-1 mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />{t.name}</h3>
          <p className="text-sm font-medium mb-2">Direct sun on a mid-December day: <span className="text-primary">≈ {t.decSunHours} h</span></p>
          <div className="h-3 rounded-full bg-muted overflow-hidden mb-4">
            <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
          </div>
          <p className="text-sm mb-4">{t.sunlessDays > 0 ? <>Some hamlets: <strong>about {t.sunlessDays} days</strong> without direct sun around the solstice.</> : 'No sunless weeks.'}</p>
          <p className="text-muted-foreground leading-relaxed">{t.note}</p>
          <p className="text-xs text-muted-foreground mt-5">Estimates based on slope orientation and the ridge to the south. Visit in December before you buy.</p>
        </motion.div>
      </div>
    </AostaSection>
  );
}
