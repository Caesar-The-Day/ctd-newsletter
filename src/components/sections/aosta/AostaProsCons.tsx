import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Check, X, Scale } from 'lucide-react';
import { prosConsGroups, fitFactors, suitsYou, notForYou } from './aostaLiving';
import { AostaSection } from './AostaSection';

type FinalTake = { headline?: string; text?: string; conclusion?: string };

export default function AostaProsCons({ finalTake }: { finalTake?: FinalTake }) {
  const [theme, setTheme] = useState(prosConsGroups[0].theme);
  const [picked, setPicked] = useState<string[]>(['nature', 'safety', 'health']);
  const g = prosConsGroups.find(x => x.theme === theme) ?? prosConsGroups[0];
  const fit = useMemo(() => {
    const sel = fitFactors.filter(f => picked.includes(f.id));
    if (!sel.length) return 0;
    return Math.round((sel.reduce((a, f) => a + f.score, 0) / (sel.length * 10)) * 100);
  }, [picked]);
  const verdict = fit >= 75 ? 'A strong match' : fit >= 55 ? 'Worth a long visit first' : 'Probably not your valley';
  const toggle = (id: string) => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <AostaSection eyebrow="Pros & cons" title="The Alpine Reality" intro="Living at the top of Italy needs both a sturdy heart and a sturdy pair of boots. Here is the honest trade-off, theme by theme.">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {prosConsGroups.map(x => (
          <button key={x.theme} onClick={() => setTheme(x.theme)} className={`relative px-4 py-2 rounded-full text-sm font-semibold ${x.theme === theme ? 'text-primary-foreground' : 'bg-muted'}`}>
            {x.theme === theme && <motion.span layoutId="aosta-pc" className="absolute inset-0 rounded-full bg-primary" />}<span className="relative">{x.theme}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={g.theme} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid md:grid-cols-2 gap-4 mb-10">
          {[{ list: g.pros, pro: true }, { list: g.cons, pro: false }].map(({ list, pro }) => (
            <div key={String(pro)} className={`rounded-3xl p-6 border ${pro ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'}`}>
              <p className={`font-bold mb-4 flex items-center gap-2 ${pro ? 'text-primary' : 'text-destructive'}`}>{pro ? <ThumbsUp className="h-5 w-5" /> : <ThumbsDown className="h-5 w-5" />}{pro ? 'Why it works' : 'What to plan for'}</p>
              <ul className="space-y-3">{list.map((t, i) => (
                <motion.li key={t} initial={{ opacity: 0, x: pro ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-2 text-sm">
                  {pro ? <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" /> : <X className="h-4 w-4 mt-0.5 text-destructive shrink-0" />}<span>{t}</span>
                </motion.li>))}</ul>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 mb-10">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Is this your valley?</h3>
        <p className="text-sm text-muted-foreground mb-5">Tap what matters most to you, and we'll score how well Valle d'Aosta delivers it.</p>
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div className="grid sm:grid-cols-2 gap-2">
            {fitFactors.map(f => { const on = picked.includes(f.id); return (
              <button key={f.id} onClick={() => toggle(f.id)} className={`rounded-xl px-3 py-2.5 border text-left text-sm transition-all ${on ? 'border-primary bg-primary/10 font-semibold' : 'border-border hover:border-primary/40'}`}>
                <span className="flex justify-between items-center gap-2">{f.label}<span className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <span key={i} className={`w-1.5 h-3 rounded-sm ${i < Math.round(f.score / 2) ? 'bg-primary' : 'bg-muted'}`} />)}</span></span>
              </button>); })}
          </div>
          <div className="text-center">
            <div className="relative w-44 h-44 mx-auto">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" className="stroke-muted" strokeWidth="12" fill="none" />
                <motion.circle cx="60" cy="60" r="52" className="stroke-primary" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={326.7} animate={{ strokeDashoffset: 326.7 * (1 - fit / 100) }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-bold">{fit}%</span><span className="text-xs text-muted-foreground">fit</span></div>
            </div>
            <p className="font-semibold mt-3">{picked.length ? verdict : 'Pick a few priorities'}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="rounded-3xl border border-border bg-background p-6"><p className="font-bold mb-3">You'll thrive here if…</p><ul className="space-y-2">{suitsYou.map(t => <li key={t} className="flex gap-2 text-sm"><Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />{t}</li>)}</ul></div>
        <div className="rounded-3xl border border-border bg-background p-6"><p className="font-bold mb-3">Think twice if…</p><ul className="space-y-2">{notForYou.map(t => <li key={t} className="flex gap-2 text-sm"><X className="h-4 w-4 mt-0.5 text-destructive shrink-0" />{t}</li>)}</ul></div>
      </div>

      {finalTake?.text && (
        <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] opacity-80 mb-3">{finalTake.headline || 'The Bottom Line'}</p>
          <p className="text-xl md:text-2xl font-semibold mb-3">{finalTake.text}</p>
          {finalTake.conclusion && <p className="opacity-90 italic">{finalTake.conclusion}</p>}
        </div>
      )}
    </AostaSection>
  );
}
