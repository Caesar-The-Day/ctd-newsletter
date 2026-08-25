import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, ShieldCheck, AlertTriangle, Navigation } from 'lucide-react';
import BoraWindField from './BoraWindField';
import boraChiara from '@/assets/friuli/bora/bora-1-chiara.jpg';
import boraProper from '@/assets/friuli/bora/bora-2-proper.jpg';
import boraScura from '@/assets/friuli/bora/bora-3-scura.jpg';
import boraRecord from '@/assets/friuli/bora/bora-4-record.jpg';

const levels = [
  {
    kmh: 40,
    name: 'Bora chiara, light day',
    detail: 'Clear skies, dry air, flags snapping. Locals call this good weather — the city looks scrubbed and the sea turns deep blue.',
    living: 'No impact beyond a jacket and a hand on your hat along the seafront.',
    tone: 'calm',
    image: boraChiara,
    alt: 'Trieste seafront on a clear Bora day, deep blue Adriatic and flags snapping in the wind'
  },
  {
    kmh: 70,
    name: 'A proper Bora',
    detail: 'Gusts you lean into. Outdoor café tables come inside, scooters get parked flat, awnings are rolled up.',
    living: 'Balcony furniture must be anchored or stored. Umbrellas are useless. Expect a few of these each winter month.',
    tone: 'watch',
    image: boraProper,
    alt: 'Whitecaps at Barcola with café chairs stacked and people leaning into the wind'
  },
  {
    kmh: 100,
    name: 'Bora scura, storm force',
    detail: 'Trieste strings ropes along exposed streets in the old days for a reason. Ferries and the Grado lagoon services can suspend.',
    living: 'Windows rattle in older single-glazed flats. Driving high-sided vehicles on the coastal road is genuinely unpleasant.',
    tone: 'strong',
    image: boraScura,
    alt: 'Storm-force waves exploding over the Molo Audace pier in Trieste under a grey sky'
  },
  {
    kmh: 130,
    name: 'Record territory',
    detail: 'Trieste has logged gusts above 150 km/h. Rare, but not folklore — it happens, usually a handful of times per decade.',
    living: 'Roof tiles, scaffolding and street furniture become the story. Schools and the port pause; the city carries on regardless.',
    tone: 'extreme',
    image: boraRecord,
    alt: 'Hurricane-force spray sweeping an Adriatic waterfront as a figure grips a rope strung along the street'
  }
];

const shelter = [
  { town: 'Trieste (Barcola, seafront)', level: 'Fully exposed', note: 'The Bora funnels straight off the Karst plateau onto the waterfront.', bad: true },
  { town: 'Trieste (Città Vecchia)', level: 'Partly sheltered', note: 'Narrow old-town streets break the gusts — worth targeting when flat-hunting.', bad: false },
  { town: 'Muggia', level: 'Partly sheltered', note: 'Tucked south of the bay, noticeably calmer than the Barcola side.', bad: false },
  { town: 'Duino / Sistiana', level: 'Exposed', note: 'Cliff-top position catches the full plateau wind.', bad: true },
  { town: 'Grado', level: 'Mild', note: 'Lagoon flats feel the wind but nothing like the Karst edge.', bad: false },
  { town: 'Udine & the plain', level: 'Calm', note: 'Forty minutes inland the Bora is a weather report, not a lifestyle factor.', bad: false }
];

/** Smoothly counts to a target number. */
function useCountTo(value: number) {
  const [display, setDisplay] = useState(value);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = display;
    const start = performance.now();
    const dur = 450;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * e));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}

export default function FriuliBoraMeter() {
  const [i, setI] = useState(1);
  const level = levels[i];
  const pct = (level.kmh / 150) * 100;
  const intensity = i / (levels.length - 1);
  const shownKmh = useCountTo(level.kmh);

  // Gusting jitter that grows with intensity
  const [jitter, setJitter] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    let t = 0;
    const id = window.setInterval(() => {
      t += 0.35;
      setJitter(Math.sin(t * 1.7) * (0.6 + intensity * 4.5) + Math.sin(t * 4.3) * intensity * 2);
    }, 90);
    return () => window.clearInterval(id);
  }, [intensity]);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Live wind field */}
      <div className="absolute inset-0 pointer-events-none opacity-90">
        <BoraWindField intensity={intensity} />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/60 via-transparent to-background/60" />

      <div className="container relative mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.div
            animate={{ rotate: [0, 8 + intensity * 22, -4 - intensity * 10, 0] }}
            transition={{ duration: 2.4 - intensity * 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex"
          >
            <Wind className="h-10 w-10 mb-4 text-primary" />
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3"
            animate={{ x: [0, intensity * 6, 0], skewX: [0, -intensity * 3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            The Bora, Honestly
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            No other Italian region has a wind with its own vocabulary. Drag the slider — the page blows with it.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-10">
          <Card className="border-2 border-primary/20 overflow-hidden bg-card/90 backdrop-blur-sm">
            {/* Photo band */}
            <div className="relative aspect-[16/7] w-full overflow-hidden">
              <AnimatePresence mode="sync">
                <motion.img
                  key={level.kmh}
                  src={level.image}
                  alt={level.alt}
                  width={1600}
                  height={900}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Gust strength</p>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">{level.name}</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-4xl md:text-5xl font-bold text-primary tabular-nums leading-none">
                    {shownKmh}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">km/h</span>
                </div>
              </div>

              {/* Wind vane */}
              <div className="absolute top-4 right-4 rounded-full bg-background/70 backdrop-blur p-2 border border-border">
                <motion.div
                  animate={{ rotate: 90 + jitter * 2 }}
                  transition={{ type: 'spring', stiffness: 60, damping: 8 }}
                >
                  <Navigation className="h-5 w-5 text-primary" />
                </motion.div>
              </div>
            </div>

            <CardContent className="p-6 md:p-8">
              <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-1">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  animate={{ width: `${Math.max(0, Math.min(100, pct + jitter))}%` }}
                  transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mb-4 h-4">
                {intensity > 0.3 ? 'gusting' : 'steady'}
              </p>

              <input
                type="range"
                min={0}
                max={levels.length - 1}
                step={1}
                value={i}
                onChange={(e) => setI(Number(e.target.value))}
                aria-label="Bora gust strength"
                className="w-full accent-primary cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-muted-foreground mt-1 mb-6">
                {levels.map((l) => (
                  <span key={l.kmh}>{l.kmh}</span>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={level.kmh}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-foreground/80 mb-4 leading-relaxed">{level.detail}</p>
                  <div className="rounded-lg bg-muted/50 border border-border p-4 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80">{level.living}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-center">Where the wind actually lands</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {shelter.map((s) => (
              <div
                key={s.town}
                className={cn(
                  'relative overflow-hidden rounded-lg border p-4 bg-card/90 backdrop-blur-sm',
                  s.bad ? 'border-destructive/40' : 'border-primary/30'
                )}
              >
                {s.bad && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.14] animate-wave-drift"
                    style={{
                      background:
                        'repeating-linear-gradient(100deg, transparent 0 10px, hsl(var(--destructive)) 10px 12px)'
                    }}
                  />
                )}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    {s.bad ? (
                      <Wind className="h-4 w-4 text-destructive" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-semibold text-sm">{s.town}</span>
                  </div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{s.level}</p>
                  <p className="text-sm text-foreground/80">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">
            Bora days cluster from late autumn to early spring. Figures are indicative of typical Trieste conditions, not a forecast.
          </p>
        </div>
      </div>
    </section>
  );
}
