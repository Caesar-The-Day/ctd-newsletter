import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Train, Plane, CableCar, Ticket } from 'lucide-react';
import { mobilityLegs, mobilityAirports, cableCarLines } from './trentinoData';
import cableCarPhoto from '@/assets/trentino/cable-car-commute.jpg';

const maxMinutes = 270;

const toMinutes = (t: string) => {
  const [h, m] = t.split('h').map((s) => parseInt(s.trim(), 10));
  return (h || 0) * 60 + (m || 0);
};

export default function TrentinoMountainMobility() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Getting around, getting out</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Cable Cars as Public Transport</h2>
          <p className="text-lg text-muted-foreground">
            This is the only part of Italy where a gondola is on the bus timetable, where the motorway runs to Munich,
            and where Innsbruck is closer than Milan. Mobility here works differently — usually in your favour.
          </p>
        </div>

        {/* Reach bars */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Train className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">How far is out</h3>
          </div>
          <div className="space-y-4">
            {mobilityLegs.map((leg, i) => {
              const pct = Math.min(100, (toMinutes(leg.time) / maxMinutes) * 100);
              return (
                <div key={leg.to}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                    <p className="font-semibold text-sm">
                      {leg.to}
                      <span className="ml-2 font-normal text-xs text-muted-foreground">
                        from {leg.from} · {leg.mode}
                      </span>
                    </p>
                    <p className="text-sm font-bold text-primary">{leg.time}</p>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={visible ? { width: `${pct}%` } : { width: 0 }}
                      transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{leg.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
          {/* Cable cars */}
          <div className="rounded-3xl overflow-hidden border border-border bg-background shadow-soft">
            <div className="relative h-48">
              <img
                src={cableCarPhoto}
                alt="A gondola cable car climbing above Bolzano with the city and vineyards far below"
                loading="lazy"
                width={1600}
                height={900}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 to-transparent" />
              <div className="absolute bottom-4 left-6 flex items-center gap-2">
                <CableCar className="h-5 w-5 text-background" />
                <p className="text-background font-bold text-lg">Funivie as commuter lines</p>
              </div>
              {/* Drifting cabin */}
              <motion.div
                aria-hidden="true"
                initial={{ x: '-10%' }}
                animate={{ x: '110%' }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="absolute top-6 left-0"
              >
                <CableCar className="h-6 w-6 text-background/70" />
              </motion.div>
            </div>
            <div className="p-6 space-y-4">
              {cableCarLines.map((c) => (
                <div key={c.name}>
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.detail}</p>
                </div>
              ))}
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 flex gap-3">
                <Ticket className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">One ticket, everything.</strong> The provincial mobility cards
                  (Alto Adige Pass / Trentino Guest Pass) cover buses, regional trains and most cable cars on a single
                  fare — and residents over 65 travel at heavily reduced rates.
                </p>
              </div>
            </div>
          </div>

          {/* Airports */}
          <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
            <div className="flex items-center gap-2 mb-5">
              <Plane className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Airports that matter</h3>
            </div>
            <div className="space-y-4">
              {mobilityAirports.map((a) => (
                <div key={a.name} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-sm">{a.name}</p>
                    <p className="text-xs font-medium text-primary">{a.drive}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{a.note}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-5 leading-relaxed">
              The Brenner corridor is the through-line: the A22 motorway and the Verona–Innsbruck–Munich rail axis run
              the length of the region, which is why nowhere here feels as remote as it looks on the map.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
