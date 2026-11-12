import { useState } from 'react';
import { motion } from 'framer-motion';
import { Snowflake, Flame, Car, Stethoscope, Users } from 'lucide-react';
import { altitudeStops } from './aostaData';
import { AostaSection } from './AostaSection';

export default function AostaAltitudeSlider() {
  const [i, setI] = useState(1);
  if (!altitudeStops.length) return null;
  const s = altitudeStops[i];
  const stats = [
    { icon: Snowflake, label: 'Snow days', value: `≈ ${s.snowDays} a year` },
    { icon: Flame, label: 'Heating (80 m² home)', value: s.heating },
    { icon: Car, label: 'Roads', value: s.roads },
    { icon: Stethoscope, label: 'Hospital in Aosta', value: s.hospital },
    { icon: Users, label: 'All year', value: s.population },
  ];
  return (
    <AostaSection muted eyebrow="From vineyard to glacier" title="1,700 Metres in One Hour's Drive" intro="Valle d'Aosta goes from 345 m to above 2,000 m with people living at every height. Drag up the valley and see how daily life changes.">
      <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
        <div className="flex items-end justify-between mb-2">
          <div><p className="text-5xl font-bold text-primary">{s.altitude.toLocaleString()} m</p><p className="text-xl font-semibold">{s.town}</p></div>
          <svg viewBox="0 0 120 60" className="w-32 h-16" aria-hidden><path d="M0 60 L40 30 L60 42 L90 8 L120 60Z" fill="hsl(var(--foreground) / 0.15)" />
            <motion.circle r="5" fill="hsl(var(--primary))" animate={{ cx: 10 + (i / (altitudeStops.length - 1)) * 80, cy: 55 - (i / (altitudeStops.length - 1)) * 45 }} /></svg>
        </div>
        <input type="range" min={0} max={altitudeStops.length - 1} value={i} onChange={(e) => setI(Number(e.target.value))} aria-label="Altitude" className="w-full accent-[hsl(var(--primary))] my-4" />
        <p className="text-muted-foreground leading-relaxed mb-6">{s.verdict}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-muted/40 p-4"><Icon className="h-4 w-4 text-primary mb-2" />
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className="text-sm font-medium">{value}</p></div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-5">Snow days and heating costs are estimates for a typical home with gas or pellet heating.</p>
      </div>
    </AostaSection>
  );
}
