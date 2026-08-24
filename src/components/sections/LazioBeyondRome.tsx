import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mountain,
  Waves,
  Trees,
  Wheat,
  Snowflake,
  MapPin,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { photos, type Photo } from '@/assets/lazio/photos';

interface Place {
  name: string;
  living: string;
  data: string;
  image?: Photo;
}

interface Landscape {
  id: string;
  label: string;
  icon: typeof Waves;
  image: Photo;
  lead: string;
  winter: string;
  places: Place[];
}

const LANDSCAPES: Landscape[] = [
  {
    id: 'lakes',
    label: 'Volcanic lakes',
    icon: Waves,
    image: photos.lakes,
    lead:
      'Four collapsed volcanoes filled with water sit north and south of Rome. They are the closest thing Lazio has to a secret: swimmable, uncrowded outside August, and close enough that people commute from them.',
    winter:
      'Mild and damp. Lake fog is real from November to February, and lakeside houses need dehumidifiers more than they need heating.',
    places: [
      {
        name: 'Lake Bracciano',
        living:
          'Commuter belt with a swimmable lake: Trevignano and Anguillara have year-round life, not just summer shutters.',
        data: '164 m altitude · ~40 km from Rome · regional train to Roma Ostiense',
        image: photos.bracciano,
      },
      {
        name: 'Lake Bolsena',
        living:
          'The biggest volcanic lake in Europe and the most affordable. Cheap houses, thin winter services, a genuinely warm summer scene.',
        data: '305 m · ~120 km from Rome · car essential',
        image: photos.bolsena,
      },
      {
        name: 'Lake Albano (Castelli Romani)',
        living:
          "Rome's wine hills. Frascati, Castel Gandolfo, Nemi — expensive, green, and 40 minutes from the centre on a good day.",
        data: '293 m · ~25 km from Rome · frequent regional rail',
        image: photos.albano,
      },
      {
        name: 'Lake Vico',
        living:
          'A protected nature reserve rather than a resort. Almost no lakefront building, which is exactly the appeal.',
        data: '510 m · ~65 km from Rome · car essential',
        image: photos.vico,
      },
    ],
  },
  {
    id: 'coast',
    label: 'Coast',
    icon: Trees,
    image: photos.coast,
    lead:
      'Lazio has 360 km of coastline and Romans treat most of it as a back garden. The southern half — Circeo down to Gaeta — is where the water turns clear and the towns keep a winter population.',
    winter:
      'The mildest winters in the region: frost is rare, but January in a resort town can feel like a stage set with the lights off.',
    places: [
      {
        name: 'Sabaudia & Circeo National Park',
        living:
          'Dunes, a coastal lagoon system and a rationalist 1930s town. Strict building rules keep it from turning into a strip.',
        data: 'Circeo NP: 8,500 ha · ~100 km from Rome',
        image: photos.sabaudia,
      },
      {
        name: 'Gaeta',
        living:
          'A real working town with a naval base, a medieval quarter and beaches that stay open in winter. Best year-round coastal bet.',
        data: '~120 km from Rome · direct trains to Formia, then Rome in ~70 min',
        image: photos.gaeta,
      },
      {
        name: 'Sperlonga',
        living:
          'Whitewashed and vertical, beautiful and seasonal. Wonderful for six months, very quiet for the other six.',
        data: '~130 km from Rome · car or bus from Fondi station',
        image: photos.sperlonga,
      },
      {
        name: 'Anzio & Nettuno',
        living:
          'The commuter coast. Cheapest sea-view property within an hour of Rome, with the traffic and the crowds that implies.',
        data: '~55 km from Rome · direct regional train ~60 min',
        image: photos.anzio,
      },
    ],
  },
  {
    id: 'mountains',
    label: 'Mountains',
    icon: Mountain,
    image: photos.mountains,
    lead:
      'People forget that Lazio touches the high Apennines. Within two hours of the Colosseum there is beech forest, wolves, bears at the Abruzzo park border, and snow that lasts until April.',
    winter:
      'Genuinely alpine above 900 m. Snow tyres are a legal requirement on many roads from mid-November to mid-April.',
    places: [
      {
        name: 'Monti Simbruini Regional Park',
        living:
          'The largest protected area in Lazio. Subiaco and Filettino are cheap, cold and stunning; services are thin.',
        data: '30,000 ha · summits over 2,000 m · ~70 km from Rome',
        image: photos.simbruini,
      },
      {
        name: 'Monti Ernici & Ciociaria highlands',
        living:
          'Stone villages above Frosinone with the lowest property prices in the region and a strong local food culture.',
        data: '600–1,200 m · ~90 km from Rome',
        image: photos.ernici,
      },
      {
        name: 'Monti Lepini',
        living:
          'A limestone wall behind the Pontine plain — Sermoneta, Norma, Carpineto. Rome visible from your terrace on a clear day.',
        data: '400–1,500 m · ~60 km from Rome',
        image: photos.lepini,
      },
      {
        name: 'Monti della Laga / Leonessa',
        living:
          'The far north-east near Rieti. Snow country, seismic zone, spectacular emptiness. Only for the committed.',
        data: '~970 m (Leonessa) · ~130 km from Rome',
        image: photos.laga,
      },
    ],
  },
  {
    id: 'countryside',
    label: 'Countryside',
    icon: Wheat,
    image: photos.countryside,
    lead:
      'Between the lakes and the mountains sits farmland with three distinct characters: Etruscan tufa country in the north, olive-terraced Sabina in the middle, and the deep agricultural south of Ciociaria.',
    winter:
      'Cool, foggy mornings and short days. Old stone farmhouses are gorgeous and expensive to heat — budget for it honestly.',
    places: [
      {
        name: 'Tuscia (Viterbo province)',
        living:
          'Tufa gorges, Etruscan necropolises, hilltop towns like Civita di Bagnoregio. Cheapest historic property in the region.',
        data: '~90 km from Rome · Viterbo rail link ~1h45',
        image: photos.tuscia,
      },
      {
        name: 'Sabina',
        living:
          'Olive-oil hills north-east of Rome. Rustic but well connected — many Rome workers live here full time.',
        data: '~50 km from Rome · Fara Sabina station, 35 min to Tiburtina',
        image: photos.sabina,
      },
      {
        name: 'Ciociaria (Frosinone province)',
        living:
          'Underrated, unpretentious, and served by the A1 and the Rome–Naples rail line. Very low cost of living.',
        data: '~80 km from Rome · Frosinone station ~50 min to Termini',
        image: photos.ciociaria,
      },
      {
        name: "Valle dell'Aniene",
        living:
          'The river corridor through Tivoli towards Subiaco: villas, waterfalls, monasteries, and a fast road to Rome.',
        data: '~35–70 km from Rome · A24 motorway',
        image: photos.aniene,
      },
    ],
  },
];

const photoVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const transition = { duration: 0.35, ease: 'easeInOut' as const };

export default function LazioBeyondRome() {
  const [activeId, setActiveId] = useState('lakes');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const active = LANDSCAPES.find((l) => l.id === activeId)!;
  const selected = active.places.find((p) => p.name === selectedPlace && p.image);
  const displayImage = selected?.image ?? active.image;
  const displayAlt = selected
    ? `${selected.name}, Lazio, Italy`
    : `${active.label} landscape in Lazio, Italy`;

  // Warm the cache for the photos of the currently open landscape so card
  // clicks crossfade instantly instead of waiting on a fresh download.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const preload = active.places
      .map((p) => p.image)
      .filter(Boolean)
      .map((img) => (wide ? img!.large : img!.small));
    const timer = window.setTimeout(() => {
      preload.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <Mountain className="w-4 h-4" />
            Beyond the capital
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lazio is not just Rome
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Strip the capital out and you are left with a region of volcanic lakes, a long
            Tyrrhenian coast, high Apennine forest and three different kinds of farmland. Most people
            deciding where to live end up choosing one of these four, not a Roman postcode.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {LANDSCAPES.map((l) => {
            const Icon = l.icon;
            return (
              <Button
                key={l.id}
                size="sm"
                variant={l.id === activeId ? 'default' : 'outline'}
                onClick={() => {
                  setActiveId(l.id);
                  setSelectedPlace(null);
                }}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </Button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-xl overflow-hidden shadow-lg relative bg-muted h-[320px] lg:h-[420px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={displayImage}
                src={displayImage}
                alt={displayAlt}
                variants={photoVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={transition}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-4"
                >
                  <span className="text-sm font-medium text-background">{selected.name}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <p className="text-base text-foreground leading-relaxed mb-4">{active.lead}</p>
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-6">
              <Snowflake className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>
                <span className="font-medium text-foreground">Winter reality:</span> {active.winter}
              </span>
            </div>

            <div className="space-y-3">
              {active.places.map((p) => {
                const isSelected = selected?.name === p.name;
                const clickable = Boolean(p.image);
                return (
                  <Card
                    key={p.name}
                    role={clickable ? 'button' : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    aria-pressed={clickable ? isSelected : undefined}
                    onClick={
                      clickable
                        ? () => setSelectedPlace(isSelected ? null : p.name)
                        : undefined
                    }
                    onKeyDown={
                      clickable
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedPlace(isSelected ? null : p.name);
                            }
                          }
                        : undefined
                    }
                    className={cn(
                      'transition-all border',
                      clickable &&
                        'cursor-pointer hover:border-primary/50 hover:bg-muted/60 hover:shadow-md',
                      isSelected && 'ring-2 ring-primary border-primary/50 shadow-md'
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-semibold text-foreground flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {p.name}
                        </h3>
                        {clickable && (
                          <Badge
                            variant={isSelected ? 'default' : 'outline'}
                            className="text-xs font-normal gap-1.5"
                          >
                            <Camera className="w-3 h-3" />
                            {isSelected ? 'Showing photo' : 'View photo'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                        {p.living}
                      </p>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {p.data}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
