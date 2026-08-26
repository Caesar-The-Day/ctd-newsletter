import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, Thermometer, Grape, ArrowUpDown } from 'lucide-react';
import valleyFloor from '@/assets/trentino/altitude-valley-floor.jpg';
import hillside from '@/assets/trentino/altitude-hillside.jpg';
import highTerraces from '@/assets/trentino/altitude-high.jpg';

interface Band {
  id: string;
  label: string;
  range: string;
  minM: number;
  maxM: number;
  image: string;
  places: string;
  grapes: string[];
  temp: string;
  character: string;
  note: string;
}

const BANDS: Band[] = [
  {
    id: 'floor',
    label: 'Valley floor',
    range: '200–350 m',
    minM: 200,
    maxM: 350,
    image: valleyFloor,
    places: 'Campo Rotaliano, the Bolzano basin, Piana Rotaliana',
    grapes: ['Teroldego', 'Lagrein', 'Merlot'],
    temp: 'Warmest — summer days above 30 °C in the Bolzano bowl',
    character: 'Deep colour, ripe dark fruit, real structure',
    note: 'Gravel and alluvial soils that drain fast and hold the day\'s heat into the night. This is the only stratum in the region warm enough to fully ripen a serious red.',
  },
  {
    id: 'hillside',
    label: 'Hillside',
    range: '350–600 m',
    minM: 350,
    maxM: 600,
    image: hillside,
    places: 'Strada del Vino, Termeno, Caldaro, Santa Maddalena',
    grapes: ['Gewürztraminer', 'Schiava', 'Pinot Bianco', 'Chardonnay'],
    temp: 'Temperate — big day/night swing, lake-moderated at Caldaro',
    character: 'Aromatic whites and light, drinkable reds',
    note: 'The classic South Tyrolean band: south-facing slopes, pergola and guyot side by side, and the highest density of cellars you can reach on foot from a village.',
  },
  {
    id: 'high',
    label: 'High terraces',
    range: '600–900 m',
    minM: 600,
    maxM: 900,
    image: highTerraces,
    places: 'Val di Cembra, Valle Isarco, Alta Valle Venosta',
    grapes: ['Müller-Thurgau', 'Kerner', 'Sylvaner', 'Riesling'],
    temp: 'Coldest — nights near 10 °C even in August',
    character: 'Razor acidity, mountain herbs, low alcohol',
    note: 'Porphyry terraces held up by hand-built dry-stone walls. Everything is picked by hand because nothing mechanical fits. Europe\'s viticultural ceiling, more or less.',
  },
];

export function TrentinoAltitudeWineLadder() {
  const [activeId, setActiveId] = useState('hillside');
  const active = BANDS.find((b) => b.id === activeId) ?? BANDS[1];

  return (
    <div className="mt-12 md:mt-16 rounded-2xl border border-border/60 bg-card/60 overflow-hidden">
      <div className="p-6 md:p-10 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
          <ArrowUpDown className="h-4 w-4" />
          Interactive — the altitude ladder
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Read the wine by its elevation</h3>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          In most Italian regions the map explains the wine. Here it is the altimeter. Climb the ladder to see what
          grows at each height, and why the same 40 kilometres produce both an inky red and a wine with the acidity of
          a green apple.
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,320px)_1fr]">
        {/* Ladder */}
        <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-border/60 bg-muted/20">
          <div className="flex flex-col-reverse gap-3">
            {BANDS.map((band) => {
              const isActive = band.id === active.id;
              return (
                <button
                  key={band.id}
                  type="button"
                  onClick={() => setActiveId(band.id)}
                  className={`group relative w-full rounded-xl border p-4 text-left transition-all ${
                    isActive
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">{band.range}</div>
                      <div className="font-bold text-foreground">{band.label}</div>
                    </div>
                    <Mountain
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive ? 'text-primary' : 'text-muted-foreground/50 group-hover:text-primary/60'
                      }`}
                      style={{ transform: `scale(${0.75 + BANDS.indexOf(band) * 0.18})` }}
                    />
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={false}
                      animate={{ width: `${(band.maxM / 900) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Vines stop at roughly 1,000 m. Above that the orchards, then the pasture, then the rock.
          </p>
        </div>

        {/* Detail */}
        <div className="relative min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            >
              <img
                src={active.image}
                alt={`${active.label} vineyards, ${active.range}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/20" />
            </motion.div>
          </AnimatePresence>

          <div className="relative p-6 md:p-10 flex h-full flex-col justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{active.range}</div>
                <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{active.label}</h4>
                <p className="text-sm text-muted-foreground mb-4">{active.places}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {active.grapes.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground"
                    >
                      <Grape className="h-3 w-3 text-primary" />
                      {g}
                    </span>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg border border-border/60 bg-background/70 p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      <Thermometer className="h-3.5 w-3.5 text-primary" /> Climate
                    </div>
                    <p className="text-sm text-foreground">{active.temp}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/70 p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      <Grape className="h-3.5 w-3.5 text-primary" /> In the glass
                    </div>
                    <p className="text-sm text-foreground">{active.character}</p>
                  </div>
                </div>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">{active.note}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
