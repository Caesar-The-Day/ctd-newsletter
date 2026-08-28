import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Mountain,
  Footprints,
  Bike,
  CalendarRange,
  ExternalLink,
  Clock,
  TrainFront,
  Dog,
  ArrowUpRight,
  Home,
} from 'lucide-react';
import { parks, trailLevels, bikeSpots, seasonBand, hutFacts } from './trentinoNatureData';

const TABS = [
  { id: 'parks', label: 'Protected lands', icon: Mountain },
  { id: 'trails', label: 'Trails by level', icon: Footprints },
  { id: 'bikes', label: 'On two wheels', icon: Bike },
  { id: 'season', label: 'Season & huts', icon: CalendarRange },
] as const;

const bikeImages: Record<string, string> = {
  'Val di Sole Bike Land': '/images/trentino-alto-adige/nature/val-di-sole.jpg',
  'Dolomiti Paganella Bike': '/images/trentino-alto-adige/nature/paganella.jpg',
  'Val Venosta cycleway': '/images/trentino-alto-adige/nature/val-venosta.jpg',
  'Val Gardena and Alta Badia lifts': '/images/trentino-alto-adige/nature/alpe-di-siusi.jpg',
};

export default function TrentinoDolomitesOutdoors() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('parks');
  const [parkId, setParkId] = useState(parks[0]?.id ?? '');
  const [levelId, setLevelId] = useState(trailLevels[1]?.id ?? trailLevels[0]?.id ?? '');
  const [monthIdx, setMonthIdx] = useState(8);

  if (!parks.length || !trailLevels.length) return null;

  const park = parks.find((p) => p.id === parkId) ?? parks[0];
  const level = trailLevels.find((l) => l.id === levelId) ?? trailLevels[0];
  const month = seasonBand[monthIdx] ?? seasonBand[0];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
            Fuori porta
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Dolomites Out the Back Door</h2>
          <p className="text-lg text-muted-foreground">
            Eight protected areas, three UNESCO Dolomite groups and a lift network built for skiing that
            quietly doubles as summer hiking infrastructure. Here is what is actually within reach, how
            hard it is, and when it is open.
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-wrap justify-center gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  on
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:text-foreground hover:border-primary/40'
                )}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ---------------- PARKS ---------------- */}
          {tab === 'parks' && (
            <motion.div
              key="parks"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
                {parks.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setParkId(p.id)}
                    className={cn(
                      'whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                      p.id === park.id
                        ? 'border-primary bg-primary/10 text-foreground shadow-soft'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <motion.div
                key={park.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-[1.15fr_1fr] gap-6 items-start"
              >
                <figure className="rounded-3xl overflow-hidden border border-border shadow-soft">
                  <div className="relative h-64 md:h-[26rem]">
                    <img
                      src={park.image}
                      alt={park.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-background/70 text-xs uppercase tracking-[0.2em] mb-2">
                        {park.local}
                      </p>
                      <p className="text-background text-lg md:text-xl font-semibold leading-snug max-w-xl">
                        {park.character}
                      </p>
                    </figcaption>
                  </div>
                </figure>

                <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
                  <h3 className="text-2xl font-bold mb-3">{park.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{park.feels}</p>

                  <dl className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
                    <Fact icon={Clock} label="From Trento" value={park.fromTrento} />
                    <Fact icon={Clock} label="From Bolzano" value={park.fromBolzano} />
                    <Fact icon={Mountain} label="Elevation" value={park.elevation} />
                    <Fact icon={CalendarRange} label="Best months" value={park.bestMonths} />
                    <Fact icon={TrainFront} label="Without a car" value={park.publicTransport} />
                    <Fact icon={Bike} label="Bikes" value={park.bikes} />
                    <Fact icon={Dog} label="Dogs" value={park.dogs} />
                  </dl>

                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Base towns
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {park.towns.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={park.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {park.link.label}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ---------------- TRAILS ---------------- */}
          {tab === 'trails' && (
            <motion.div
              key="trails"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {trailLevels.map((l, i) => {
                  const on = l.id === level.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLevelId(l.id)}
                      className={cn(
                        'rounded-2xl border p-4 text-left transition-all',
                        on
                          ? 'border-primary bg-primary/10 shadow-soft'
                          : 'border-border bg-background hover:border-primary/40'
                      )}
                    >
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 4 }).map((_, k) => (
                          <span
                            key={k}
                            className={cn(
                              'h-1.5 flex-1 rounded-full',
                              k <= i ? 'bg-primary' : 'bg-border'
                            )}
                          />
                        ))}
                      </div>
                      <p className="font-semibold text-sm">{l.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{l.effort}</p>
                    </button>
                  );
                })}
              </div>

              <motion.div
                key={level.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft"
              >
                <p className="text-lg font-medium mb-2">{level.summary}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  <span className="font-semibold text-foreground">What you need: </span>
                  {level.gear}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {level.routes.map((r) => {
                    const Wrapper = r.link ? 'a' : 'div';
                    return (
                      <Wrapper
                        key={r.name}
                        {...(r.link
                          ? {
                              href: r.link,
                              target: '_blank',
                              rel: 'noopener noreferrer',
                              'aria-label': `${r.name} — route details (opens in a new tab)`,
                            }
                          : {})}
                        className={`block rounded-2xl border border-border bg-muted/30 p-5 transition-colors ${
                          r.link ? 'hover:border-primary/40 hover:bg-muted/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className="font-bold">{r.name}</h4>
                          {r.link && <ArrowUpRight className="w-4 h-4 text-primary shrink-0 mt-1" />}
                        </div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                          {r.where} · {r.stats}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{r.note}</p>
                      </Wrapper>
                    );
                  })}
                </div>

              </motion.div>

              <div className="mt-6 rounded-2xl border border-border overflow-hidden">
                <img
                  src="/images/trentino-alto-adige/nature/alta-via.jpg"
                  alt="Walkers on a cabled via ferrata ledge in the Brenta Dolomites"
                  loading="lazy"
                  className="w-full h-56 md:h-72 object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* ---------------- BIKES ---------------- */}
          {tab === 'bikes' && (
            <motion.div
              key="bikes"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {bikeSpots.map((b) => {
                  const image = bikeImages[b.name];
                  return (
                    <div
                      key={b.name}
                      className="rounded-3xl border border-border bg-background overflow-hidden shadow-soft flex flex-col"
                    >
                      {image && (
                        <img
                          src={image}
                          alt={`${b.name}, ${b.where}`}
                          loading="lazy"
                          className="h-40 w-full object-cover"
                        />
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <span className="self-start rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 mb-3">
                          {b.kind}
                        </span>
                        <h4 className="font-bold text-lg">{b.name}</h4>
                        <p className="text-xs text-muted-foreground mb-3">{b.where}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{b.detail}</p>
                        <p className="text-xs font-semibold text-foreground mt-4">{b.season}</p>
                        {b.link && (
                          <a
                            href={b.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          >
                            Official site <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="max-w-3xl mx-auto mt-8 text-sm text-muted-foreground text-center leading-relaxed">
                Two practical notes locals learn fast: lifts only carry bikes in the summer season and
                usually charge a bike ticket on top, and regional trains along the Adige, Venosta and
                Pusteria lines take bikes as standard — which is why one-way descents are the normal way
                to ride here.
              </p>
            </motion.div>
          )}

          {/* ---------------- SEASON & HUTS ---------------- */}
          {tab === 'season' && (
            <motion.div
              key="season"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto"
            >
              <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft mb-6">
                <h3 className="font-bold mb-5">The outdoor year, month by month</h3>
                <div className="flex items-end gap-1.5 h-36 mb-4">
                  {seasonBand.map((m, i) => (
                    <button
                      key={m.month}
                      onClick={() => setMonthIdx(i)}
                      className="group flex-1 flex flex-col items-center justify-end h-full"
                      aria-label={m.month}
                    >
                      <motion.span
                        className={cn(
                          'w-full rounded-t-md transition-colors',
                          i === monthIdx ? 'bg-primary' : 'bg-primary/25 group-hover:bg-primary/50'
                        )}
                        initial={false}
                        animate={{ height: `${Math.max(m.snow, 4)}%` }}
                        transition={{ duration: 0.4 }}
                      />
                      <span
                        className={cn(
                          'mt-2 text-[11px] font-semibold',
                          i === monthIdx ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {m.month}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Snow cover at altitude
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={month.month}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="text-base md:text-lg font-medium"
                  >
                    {month.note}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="grid md:grid-cols-[1fr_1.1fr] gap-6 items-start">
                <div className="rounded-3xl overflow-hidden border border-border shadow-soft">
                  <img
                    src="/images/trentino-alto-adige/nature/rifugio.jpg"
                    alt="A stone mountain hut below the Brenta Dolomites"
                    loading="lazy"
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  {hutFacts.map((f) => (
                    <div key={f.title} className="rounded-2xl border border-border bg-background p-5">
                      <h4 className="font-bold flex items-center gap-2 mb-2">
                        <Home className="w-4 h-4 text-primary" />
                        {f.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
        <Icon className="w-3.5 h-3.5 text-primary" />
        {label}
      </dt>
      <dd className="text-sm text-foreground leading-snug">{value}</dd>
    </div>
  );
}
