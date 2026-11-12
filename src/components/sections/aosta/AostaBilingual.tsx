import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signpost, School, Landmark, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { phrases, frenchWhere } from './aostaData';
import { AostaSection } from './AostaSection';

const LANGS = [{ k: 'it', l: 'Italiano', f: '🇮🇹' }, { k: 'fr', l: 'Français', f: '🇫🇷' }, { k: 'pa', l: 'Patois', f: '🏔️' }] as const;
const WHERE_ICONS = [Signpost, School, Landmark, Coffee];

export default function AostaBilingual() {
  const [lang, setLang] = useState<(typeof LANGS)[number]['k']>('it');
  if (!phrases.length) return null;
  return (
    <AostaSection eyebrow="Italian, French, Patois" title="The Bilingual Valley" intro="French has been official here longer than Italian has. In practice you will live in Italian, see French on every sign, and hear Patois at the village bar. Switch language and watch the phrases change.">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-full border border-border bg-background p-1 shadow-soft">
          {LANGS.map((L) => (
            <button key={L.k} onClick={() => setLang(L.k)} aria-pressed={lang === L.k} className={cn('relative rounded-full px-4 py-2 text-sm font-semibold transition-colors', lang === L.k ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
              {lang === L.k && <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-primary" />}
              <span className="relative">{L.f} {L.l}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {phrases.map((p, k) => (
          <motion.div key={p.en} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.05 }}
            className="relative rounded-3xl border border-border bg-background p-5 shadow-soft overflow-hidden">
            <span className="absolute -top-3 -right-1 text-7xl font-bold text-primary/5 select-none">“</span>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{p.en}</p>
            <div className="h-9 relative" style={{ perspective: 600 }}>
              <AnimatePresence mode="wait">
                <motion.p key={lang} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }} transition={{ duration: 0.25 }}
                  className={cn('text-2xl font-bold', lang === 'pa' ? 'text-primary' : 'text-foreground')}>
                  {p[lang]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {frenchWhere.map((w, k) => {
          const I = WHERE_ICONS[k % WHERE_ICONS.length];
          return (
            <motion.div key={w.place} whileHover={{ y: -4 }} className="rounded-2xl border border-border bg-gradient-to-b from-primary/10 to-background p-5">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-3"><I className="h-5 w-5" /></div>
              <h3 className="font-semibold mb-1">{w.place}</h3><p className="text-sm text-muted-foreground">{w.detail}</p>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4">Patois spelling differs from valley to valley. These are common forms.</p>
    </AostaSection>
  );
}
