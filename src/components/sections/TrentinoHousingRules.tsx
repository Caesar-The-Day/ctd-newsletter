import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock, KeyRound, DoorOpen, ExternalLink, Home, Search } from 'lucide-react';
import { housingTowns, type HousingTown } from './trentinoData';

const constraintMeta: Record<HousingTown['constraint'], { label: string; icon: typeof Lock; className: string; dot: string }> = {
  strict: { label: 'Residency effectively required', icon: Lock, className: 'border-destructive/40 bg-destructive/5', dot: 'bg-destructive' },
  moderate: { label: 'Open, but tight', icon: KeyRound, className: 'border-primary/40 bg-primary/5', dot: 'bg-primary' },
  open: { label: 'Anyone can buy', icon: DoorOpen, className: 'border-border bg-background', dot: 'bg-muted-foreground' },
};

const filters: { id: 'all' | HousingTown['constraint']; label: string }[] = [
  { id: 'all', label: 'All towns' },
  { id: 'open', label: 'Anyone can buy' },
  { id: 'moderate', label: 'Open, but tight' },
  { id: 'strict', label: 'Residency required' },
];

export default function TrentinoHousingRules() {
  const [filter, setFilter] = useState<'all' | HousingTown['constraint']>('all');
  const [query, setQuery] = useState('');
  const [openTown, setOpenTown] = useState<string | null>(housingTowns[0]?.town ?? null);

  const shown = useMemo(
    () =>
      housingTowns.filter(
        (t) =>
          (filter === 'all' || t.constraint === filter) &&
          t.town.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [filter, query]
  );

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">Before you fall in love with a listing</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Can You Even Buy Here?</h2>
          <p className="text-lg text-muted-foreground">
            Südtirol is the only place in Italy where the answer is sometimes no. The province restricts holiday-home
            use and reserves a large share of housing for people who live and work there. Trentino, 40 minutes south,
            plays by normal Italian rules. Almost no guide tells you this before you book the viewing.
          </p>
        </div>

        {/* Rule explainer */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 mb-10">
          {[
            {
              title: 'Conventioned housing',
              body: 'A large slice of new build in Südtirol is legally bound to residents — people who have lived or worked in the province for the required period. You cannot buy it as an incomer.',
            },
            {
              title: 'The second-home cap',
              body: 'Municipalities above a provincial threshold of holiday homes cannot authorise new ones. In practice most desirable Südtirol towns are closed to new second-home use.',
            },
            {
              title: 'The way in: residency',
              body: 'Take residency, live there, and most of the wall comes down. This is a rule about second homes, not about foreigners — an elective-residency retiree who actually moves is on the right side of it.',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-background p-6 shadow-soft">
              <div className="rounded-xl bg-primary/10 p-2.5 w-fit mb-3">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Town lookup */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-5">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-semibold transition-colors border',
                    filter === f.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-primary/50 text-muted-foreground'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a town"
                aria-label="Find a town"
                className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {shown.map((t) => {
              const meta = constraintMeta[t.constraint];
              const MetaIcon = meta.icon;
              const open = openTown === t.town;
              return (
                <button
                  key={t.town}
                  onClick={() => setOpenTown(open ? null : t.town)}
                  aria-expanded={open}
                  className={cn(
                    'text-left rounded-2xl border p-5 transition-all duration-300 shadow-soft hover:shadow-lg',
                    meta.className,
                    open && 'ring-2 ring-primary/40'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('h-2 w-2 rounded-full', meta.dot)} />
                        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t.province}</span>
                      </div>
                      <h3 className="font-bold text-lg leading-tight">{t.town}</h3>
                      <p className="text-sm text-primary font-medium mt-0.5">{t.headline}</p>
                    </div>
                    <MetaIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden text-sm text-muted-foreground leading-relaxed"
                      >
                        <span className="block pt-3">{t.detail}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {shown.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">No towns match that filter.</p>
          )}

          <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Check before you commit.</strong> The categories above are a
              planning guide, not legal advice — municipalities update their second-home status and conventioned
              quotas regularly. Verify the current position for the specific property with the comune and a local
              notary.
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <a
                href="https://home.provinz.bz.it/de/home"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                Südtirol land & planning authority <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.provincia.tn.it/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                Provincia autonoma di Trento <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
