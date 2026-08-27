import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Clock, Euro, TrendingUp } from 'lucide-react';

/**
 * "Heroic viticulture", quantified: what a slope costs in labour.
 * Figures are indicative ranges drawn from CERVIM / Cinque Terre park estimates
 * for terraced Mediterranean viticulture, presented as orders of magnitude.
 */
export function LiguriaHeroicVineyard() {
  const [slope, setSlope] = useState(45);

  const { hours, cost, mech, yieldHl, label } = useMemo(() => {
    const flatHours = 350; // hours per hectare per year, mechanised flat vineyard
    const factor = 1 + Math.pow(slope / 22, 2.1);
    const hours = Math.round(flatHours * factor);
    const cost = Math.round((hours * 14) / 100) * 100;
    const mech = Math.max(0, Math.round(100 - slope * 2.1));
    const yieldHl = Math.round(70 - slope * 0.75);
    const label =
      slope < 15
        ? 'Plain — tractors, machine harvest, commodity pricing'
        : slope < 30
          ? 'Hillside — crawler tractors still work the rows'
          : slope < 45
            ? 'Terraces — hand work, wheelbarrows and rails'
            : slope < 60
              ? 'Heroic — monorail, baskets, everything carried'
              : 'Vertical — rope work above the sea, Cinque Terre proper';
    return { hours, cost, mech, yieldHl, label };
  }, [slope]);

  return (
    <div className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-5 md:p-8">
      <div className="mb-5">
        <h4 className="text-xl md:text-2xl font-bold text-foreground">Why a Ligurian bottle costs what it costs</h4>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Liguria makes less wine than almost any Italian region, and nearly all of it on slopes a tractor cannot
          climb. Drag the gradient and watch the economics change.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-center">
        {/* slope visual */}
        <div className="relative overflow-hidden rounded-xl border border-border/60 bg-background">
          <svg viewBox="0 0 100 60" className="h-48 w-full md:h-60">
            <defs>
              <linearGradient id="sea-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="60" fill="hsl(var(--muted))" opacity="0.35" />
            {/* sea */}
            <rect x="0" y="48" width="100" height="12" fill="url(#sea-grad)" />
            {/* hill profile */}
            <motion.path
              animate={{ d: `M0,48 L${Math.max(12, 90 - slope)},${48 - slope * 0.62} L100,${48 - slope * 0.62} L100,60 L0,60 Z` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              fill="hsl(var(--foreground))"
              opacity="0.12"
            />
            {/* terraces */}
            {Array.from({ length: 7 }).map((_, i) => {
              const t = (i + 1) / 8;
              const x = Math.max(12, 90 - slope) * t;
              const y = 48 - slope * 0.62 * t;
              return (
                <motion.line
                  key={i}
                  animate={{ x1: x, y1: y, x2: 100, y2: y }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.5"
                  opacity="0.55"
                />
              );
            })}
          </svg>
          <div className="absolute bottom-2 left-3 text-[11px] font-medium text-muted-foreground">Sea level</div>
          <div className="absolute right-3 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[11px] font-medium text-foreground backdrop-blur">
            <Mountain className="h-3 w-3 text-primary" /> {slope}° gradient
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground" htmlFor="slope">
            Vineyard gradient
          </label>
          <input
            id="slope"
            type="range"
            min={5}
            max={70}
            step={1}
            value={slope}
            onChange={(e) => setSlope(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))]"
          />
          <p className="mt-2 text-sm font-medium text-foreground">{label}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat icon={Clock} value={`${hours.toLocaleString()} h`} label="Work per hectare, per year" />
            <Stat icon={Euro} value={`€${cost.toLocaleString()}`} label="Labour cost per hectare" />
            <Stat icon={TrendingUp} value={`${mech}%`} label="Of the work a machine can do" />
            <Stat icon={Mountain} value={`${yieldHl} hl`} label="Typical yield per hectare" />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Indicative ranges for terraced Mediterranean viticulture. At Cinque Terre gradients, the dry-stone walls
            alone need constant repair — which is why a bottle of Sciacchetrà is priced like a Burgundy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-3">
      <div className="mb-1 flex items-center gap-1.5 text-primary">
        <Icon className="h-4 w-4" />
        <motion.span key={value} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-bold text-foreground">
          {value}
        </motion.span>
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">{label}</p>
    </div>
  );
}

export default LiguriaHeroicVineyard;
