import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Apple, Home, ExternalLink } from 'lucide-react';
import { appleYear, masoFacts } from './trentinoData';
import orchard from '@/assets/trentino/val-di-non-apples.jpg';

export default function TrentinoAppleMasi() {
  const [step, setStep] = useState(3);
  const phase = appleYear[step];
  const size = 300;
  const r = 118;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Mele e masi</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">A Valley That Is One Orchard</h2>
          <p className="text-lg text-muted-foreground">
            Val di Non grows apples on a scale that is hard to believe until you drive it — a whole alpine valley
            planted in rows. And the farms above it are held together by a medieval inheritance law that is still
            live in Italian courts.
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-border shadow-soft mb-8">
          <div className="relative h-56 md:h-80">
            <img
              src={orchard}
              alt="Rows of apple orchards heavy with red fruit filling the floor of Val di Non, with mountains behind"
              loading="lazy"
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-background/85 text-sm md:text-base max-w-2xl leading-relaxed">
                Val di Non is one of the largest contiguous apple-growing areas in Europe. Melinda, the valley's
                cooperative, has stored fruit in a disused dolomite mine 300 metres inside the mountain since 2014.
              </p>
            </figcaption>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
          {/* Apple year wheel */}
          <div className="rounded-3xl border border-border bg-background p-6 shadow-soft">
            <h3 className="font-bold mb-4 text-center">The apple year</h3>
            <div className="relative mx-auto" style={{ width: size, height: size }}>
              <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * r}
                  animate={{ strokeDashoffset: 2 * Math.PI * r * (1 - (step + 1) / appleYear.length) }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                {appleYear.map((p, i) => {
                  const a = (i / appleYear.length) * Math.PI * 2 - Math.PI / 2;
                  const cx = size / 2 + Math.cos(a) * r;
                  const cy = size / 2 + Math.sin(a) * r;
                  const on = i === step;
                  return (
                    <g key={p.month} onClick={() => setStep(i)} className="cursor-pointer">
                      <circle cx={cx} cy={cy} r={on ? 17 : 14} fill={on ? 'hsl(var(--primary))' : 'hsl(var(--background))'} stroke="hsl(var(--border))" strokeWidth="1.5" />
                      <text
                        x={cx}
                        y={cy + 4}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill={on ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))'}
                      >
                        {p.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phase.month}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="text-center px-10"
                  >
                    <Apple className="h-6 w-6 text-primary mx-auto mb-1" />
                    <p className="font-bold leading-tight">{phase.title}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={phase.month}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mt-4 text-sm text-muted-foreground leading-relaxed text-center min-h-[64px]"
              >
                {phase.body}
              </motion.p>
            </AnimatePresence>
            <div className="mt-3 flex justify-center gap-1.5">
              {appleYear.map((p, i) => (
                <button
                  key={p.month}
                  onClick={() => setStep(i)}
                  aria-label={`Show ${p.title}`}
                  aria-pressed={i === step}
                  className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-6 bg-primary' : 'w-1.5 bg-border')}
                />
              ))}
            </div>
          </div>

          {/* Maso chiuso */}
          <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">The farm that cannot be divided</h3>
            </div>
            <div className="space-y-5">
              {masoFacts.map((m) => (
                <div key={m.title}>
                  <p className="font-semibold mb-1">{m.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <a
                href="https://www.melinda.it/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                Melinda, the Val di Non cooperative <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.roterhahn.it/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                Roter Hahn — South Tyrol's farm network <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
