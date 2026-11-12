import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fuel, Home, Snowflake, HeartPulse, ExternalLink, Plus, Users } from 'lucide-react';
import { autonomy } from './aostaData';
import { AostaSection } from './AostaSection';

const ICONS = [Fuel, Home, Snowflake, HeartPulse];
const TONES = ['from-primary to-primary/60', 'from-accent to-primary/50', 'from-secondary to-primary/40', 'from-primary/80 to-accent'];

export default function AostaAutonomy() {
  const [open, setOpen] = useState<number | null>(0);
  if (!autonomy.length) return null;
  return (
    <AostaSection muted eyebrow="Special statute" title="What Autonomy Means for Your Wallet" intro="Valle d'Aosta keeps most of the taxes it collects. That doesn't mean lower taxes for you, but it does mean better-funded services and local schemes. Tap a card to see who qualifies.">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="text-center">
          <motion.p initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className="text-5xl md:text-6xl font-bold text-primary">~9/10</motion.p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">of taxes raised here stay in the region</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5 items-start">
        {autonomy.map((a, k) => {
          const Icon = ICONS[k % ICONS.length];
          const isOpen = open === k;
          return (
            <motion.button type="button" key={a.title} onClick={() => setOpen(isOpen ? null : k)} aria-expanded={isOpen}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.08 }}
              whileHover={{ y: -4 }}
              className="text-left rounded-3xl border border-border bg-background shadow-soft overflow-hidden">
              <div className={`relative h-24 bg-gradient-to-br ${TONES[k % TONES.length]} flex items-center px-6`}>
                <motion.div animate={{ rotate: isOpen ? 0 : -6, scale: isOpen ? 1.1 : 1 }} className="h-14 w-14 rounded-2xl bg-background/90 flex items-center justify-center shadow-soft">
                  <Icon className="h-7 w-7 text-primary" />
                </motion.div>
                <Icon className="absolute right-4 -bottom-4 h-24 w-24 text-background/20" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold">{a.title}</h3>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Plus className="h-4 w-4" /></motion.span>
                </div>
                <p className="inline-flex items-center gap-1.5 mt-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"><Users className="h-3 w-3" /> {a.who}</p>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="text-sm text-muted-foreground leading-relaxed mt-4 mb-3">{a.detail}</p>
                      <a href={a.link} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Official source <ExternalLink className="h-3.5 w-3.5" /></a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-5 text-center">Regional schemes change every year. Check before you count on any of them.</p>
    </AostaSection>
  );
}
