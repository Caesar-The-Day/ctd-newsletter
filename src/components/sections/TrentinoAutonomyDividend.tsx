import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Coins } from 'lucide-react';
import { autonomyFacts, autonomyEffects, autonomyCatch } from './trentinoData';

export default function TrentinoAutonomyDividend() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Why it doesn't feel like Italy</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Autonomy Dividend</h2>
          <p className="text-lg text-muted-foreground">
            People arrive here and say the buses run and the hospitals answer and they can't work out why. The answer
            is constitutional: roughly nine tenths of the tax raised in Trento and Bolzano stays in Trento and Bolzano.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="rounded-3xl border border-border bg-background p-6 md:p-10 shadow-soft">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-4">
              <div className="text-center sm:w-40">
                <div className="mx-auto rounded-2xl bg-primary/10 p-3 w-fit mb-2">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <p className="font-bold">€100 of tax</p>
                <p className="text-xs text-muted-foreground">raised in the provinces</p>
              </div>

              <div className="flex-1 w-full">
                <div className="relative h-16 rounded-2xl bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={visible ? { width: '90%' } : { width: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-y-0 left-0 bg-primary flex items-center px-4"
                  >
                    <span className="text-primary-foreground font-bold text-sm whitespace-nowrap">~€90 stays local</span>
                  </motion.div>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground">
                    ~€10 to Rome
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Most Italian regions keep a small fraction of this. That gap is the whole story.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Facts */}
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {autonomyFacts.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 18 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-background p-6 shadow-soft"
            >
              <p className="text-3xl font-bold text-primary leading-none mb-1">{f.stat}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">{f.label}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>

        {/* What you notice / the catch */}
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
            <h3 className="text-xl md:text-2xl font-bold mb-5">What you actually notice</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {autonomyEffects.map((e) => (
                <div key={e.title}>
                  <p className="font-semibold mb-1">{e.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{e.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="text-xl md:text-2xl font-bold">So what's the catch</h3>
            </div>
            <ul className="space-y-3">
              {autonomyCatch.map((c) => (
                <li key={c} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
