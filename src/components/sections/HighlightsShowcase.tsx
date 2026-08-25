import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ExternalLink,
  ChevronDown,
  Wine,
  Utensils,
  Landmark,
  Grape,
  MapPin,
  Euro,
  CalendarDays,
  Soup,
  Sparkles,
  Clock,
  Route,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useImageReveal } from '@/hooks/use-image-reveal';
import { Highlights } from '@/utils/getRegionData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HighlightsShowcaseProps {
  highlights: Highlights;
}

const PROFILE_LABELS: Record<string, string> = {
  body: 'Body',
  acidity: 'Acidity',
  tannin: 'Tannin',
  sweetness: 'Sweetness',
  aromatics: 'Aromatics',
};

export function HighlightsShowcase({ highlights }: HighlightsShowcaseProps) {
  const defaultCategory = { title: '', intro: '', backgroundImage: '', cards: [] };

  const categories = [
    { key: 'wine', label: 'Wine', icon: Wine, data: highlights?.wine ?? defaultCategory },
    { key: 'food', label: 'Food', icon: Utensils, data: highlights?.food ?? defaultCategory },
    { key: 'culture', label: 'Culture', icon: Landmark, data: highlights?.culture ?? defaultCategory },
  ];

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* soft ambient shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <Sparkles className="w-4 h-4" />
            The table and the timeline
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Food, Wine &amp; Culture</h2>
          <div className="mx-auto mb-5 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          {highlights?.sectionIntro && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {highlights.sectionIntro}
            </p>
          )}
        </div>

        <Tabs defaultValue="wine" className="w-full">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 mb-8 md:mb-10 h-auto p-1">
            {categories.map(({ key, label, icon: Icon }) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2 py-2.5 text-sm md:text-base">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(({ key, data }) => (
            <TabsContent key={key} value={key} className="animate-fade-in">
              <CategoryPanel categoryKey={key} data={data} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function CategoryPanel({ categoryKey, data }: { categoryKey: string; data: any }) {
  const cards: any[] = data?.cards ?? [];

  // Culture: build era filters when the data supplies them
  const eras = useMemo(
    () => Array.from(new Set(cards.map((c) => c.era).filter(Boolean))) as string[],
    [cards],
  );
  const [activeEra, setActiveEra] = useState<string | null>(null);

  // Food: highlight the "quartet" (region-supplied flag)
  const hasQuartet = cards.some((c) => c.quartet);
  const [quartetOnly, setQuartetOnly] = useState(false);

  const visibleCards = cards.filter((c) => {
    if (categoryKey === 'culture' && activeEra) return c.era === activeEra;
    if (categoryKey === 'food' && quartetOnly) return !!c.quartet;
    return true;
  });

  return (
    <>
      <div className="mb-8 md:mb-10 relative overflow-hidden rounded-2xl border border-border/60">
        {data.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${data.backgroundImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="relative p-6 md:p-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">{data.title}</h3>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">{data.intro}</p>
        </div>
      </div>

      {(eras.length > 1 || hasQuartet) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categoryKey === 'culture' && eras.length > 1 && (
            <>
              <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">Filter by era</span>
              <FilterChip active={activeEra === null} onClick={() => setActiveEra(null)}>
                All
              </FilterChip>
              {eras.map((era) => (
                <FilterChip key={era} active={activeEra === era} onClick={() => setActiveEra(era)}>
                  {era}
                </FilterChip>
              ))}
            </>
          )}
          {categoryKey === 'food' && hasQuartet && (
            <>
              <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">Filter</span>
              <FilterChip active={!quartetOnly} onClick={() => setQuartetOnly(false)}>
                Everything
              </FilterChip>
              <FilterChip active={quartetOnly} onClick={() => setQuartetOnly(true)}>
                The pasta quartet
              </FilterChip>
            </>
          )}
        </div>
      )}

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <HighlightCard card={card} categoryKey={categoryKey} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function ProfileBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(5, value)) * 20;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
      <span>{children}</span>
    </div>
  );
}

function HighlightCard({ card, categoryKey }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible, imageRef } = useImageReveal();

  const chips: string[] = card.pairings ?? card.ingredients ?? [];
  const chipLabel = card.pairings ? 'Pairs with' : card.ingredients ? 'What is in it' : '';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="group h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <div className="relative aspect-video overflow-hidden">
              <img
                ref={imageRef}
                src={card.image}
                alt={`${card.title} — ${String(card.description ?? '').substring(0, 100)}`}
                loading="lazy"
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {(card.era || card.course || card.grape) && (
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                  {card.era ?? card.course ?? card.grape}
                </span>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1">{card.title}</h3>
                  <p className="text-white/85 text-sm">{card.subtitle}</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-white/80">
                  {isOpen ? 'Less' : 'More'}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        {/* Always-visible quick facts */}
        {(card.profile || chips.length > 0) && (
          <div className="border-b border-border/60 px-4 py-3 md:px-6">
            {categoryKey === 'wine' && card.profile && (
              <div className="space-y-2">
                {Object.entries(card.profile)
                  .filter(([, v]) => typeof v === 'number')
                  .map(([k, v]) => (
                    <ProfileBar key={k} label={PROFILE_LABELS[k] ?? k} value={v as number} />
                  ))}
              </div>
            )}
            {categoryKey !== 'wine' && chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {chips.map((chip) => (
                  <Badge key={chip} variant="secondary" className="text-[11px] font-normal">
                    {chip}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <CollapsibleContent>
          <CardContent className="p-4 md:p-6">
            <div className="mb-4 space-y-1.5">
              {card.zone && <MetaRow icon={MapPin}>{card.zone}</MetaRow>}
              {card.place && <MetaRow icon={MapPin}>{card.place}</MetaRow>}
              {card.access && <MetaRow icon={Route}>{card.access}</MetaRow>}
              {card.grape && categoryKey === 'wine' && <MetaRow icon={Grape}>{card.grape}</MetaRow>}
              {card.priceBand && <MetaRow icon={Euro}>{card.priceBand}</MetaRow>}
              {card.season && <MetaRow icon={CalendarDays}>{card.season}</MetaRow>}
              {card.difficulty && <MetaRow icon={Clock}>{card.difficulty}</MetaRow>}
            </div>

            {categoryKey === 'wine' && chips.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <Soup className="h-3.5 w-3.5 text-primary" />
                  {chipLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {chips.map((chip) => (
                    <Badge key={chip} variant="secondary" className="text-[11px] font-normal">
                      {chip}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 mb-4">
              {String(card.description ?? '')
                .split('\n\n')
                .map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
            </div>

            {card.links?.length > 0 && (
              <div className="flex flex-col gap-2">
                {card.links.map((link: any) => {
                  const href = link.href ?? link.url;
                  if (!href) return null;
                  return (
                    <Button
                      key={link.label}
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-start h-auto py-2 px-3"
                    >
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 min-w-0"
                        title={link.label}
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate text-xs">{link.label}</span>
                      </a>
                    </Button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
