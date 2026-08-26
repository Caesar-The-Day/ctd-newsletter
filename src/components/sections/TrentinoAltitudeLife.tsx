import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Snowflake, Sun, Flame, Car, Stethoscope, CalendarDays, MapPin } from 'lucide-react';
import { altitudeBands } from './trentinoData';

export default function TrentinoAltitudeLife() {
  const [index, setIndex] = useState(0);
  const band = altitudeBands[index];

  // Position of the marker along the mountain cross-section (0 = valley, 1 = summit)
  const t = index / (altitudeBands.length - 1);
  const markerX = 120 + t * 300;
  const markerY = 260 - t * 175;

  const stats = [
    { icon: CalendarDays, label: 'Winter length', value: `${band.winterDays} days below 10°C` },
    { icon: Snowflake, label: 'Snow days', value: `${band.snowDays} a year` },
    { icon: Sun, label: 'Light', value: band.sunHours },
    { icon: Flame, label: 'Heating', value: band.heating },
    { icon: Car, label: 'Driving', value: band.driving },
    { icon: Stethoscope, label: 'To a hospital', value: band.hospital },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">The question nobody answers</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How High Do You Want to Live?</h2>
          <p className="text-lg text-muted-foreground">
            In this region altitude is the real variable — more than province, more than language. Two towns twenty
            minutes apart can differ by two months of winter. Slide up the mountain and watch your life change.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-6 items-start">
          {/* Cross-section */}
          <div className="rounded-3xl border border-border bg-background p-6 shadow-soft">
            <svg viewBox="0 0 560 300" className="w-full h-auto" role="img" aria-label="Mountain cross-section showing three altitude bands">
              <defs>
                <linearGradient id="tn-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary) / 0.14)" />
                  <stop offset="100%" stopColor="hsl(var(--background))" />
                </linearGradient>
                <linearGradient id="tn-rock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--foreground) / 0.28)" />
                  <stop offset="100%" stopColor="hsl(var(--foreground) / 0.08)" />
                </linearGradient>
              </defs>

              <rect x="0" y="0" width="560" height="300" fill="url(#tn-sky)" rx="16" />

              {/* Inversion fog on the valley floor */}
              <motion.rect
                x="0" y="252" width="560" height="26" rx="13"
                fill="hsl(var(--muted-foreground) / 0.18)"
                animate={{ opacity: index === 0 ? 1 : 0.25, x: [0, 10, 0] }}
                transition={{ opacity: { duration: 0.5 }, x: { duration: 9, repeat: Infinity, ease: 'easeInOut' } }}
              />

              {/* Mountain */}
              <path d="M0 280 L120 262 L250 150 L330 190 L430 78 L560 280 Z" fill="url(#tn-rock)" />
              {/* Snow cap */}
              <path d="M430 78 L470 145 L400 132 L415 108 Z" fill="hsl(var(--background))" opacity="0.85" />

              {/* Band guide lines */}
              {altitudeBands.map((b, i) => {
                const bt = i / (altitudeBands.length - 1);
                const y = 260 - bt * 175;
                const active = i === index;
                return (
                  <g key={b.id} onClick={() => setIndex(i)} className="cursor-pointer">
                    <line
                      x1="40" y1={y} x2="520" y2={y}
                      stroke={active ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                      strokeWidth={active ? 2 : 1}
                      strokeDasharray="4 6"
                    />
                    <text x="40" y={y - 8} fontSize="11" fill={active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} fontWeight={active ? 700 : 400}>
                      {b.range}
                    </text>
                  </g>
                );
              })}

              {/* Marker */}
              <motion.g animate={{ x: markerX, y: markerY }} transition={{ type: 'spring', stiffness: 90, damping: 16 }}>
                <circle r="9" fill="hsl(var(--primary))" />
                <circle r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.4" />
              </motion.g>
            </svg>

            <div className="mt-5">
              <input
                type="range"
                min={0}
                max={altitudeBands.length - 1}
                step={1}
                value={index}
                onChange={(e) => setIndex(Number(e.target.value))}
                aria-label="Choose an altitude band"
                className="w-full accent-[hsl(var(--primary))]"
              />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {altitudeBands.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setIndex(i)}
                    aria-pressed={i === index}
                    className={cn(
                      'rounded-xl border px-2 py-2 text-xs font-semibold transition-colors',
                      i === index ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                    )}
                  >
                    {b.label}
                    <span className="block font-normal text-[10px] mt-0.5">{b.range}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Readout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={band.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">{band.range}</p>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">{band.label}</h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{band.verdict}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {band.towns.map((t2) => (
                  <span key={t2} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium">
                    <MapPin className="h-3 w-3 text-primary" /> {t2}
                  </span>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {stats.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 h-fit">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
