import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mountain, Waves, Trees, Wheat, Snowflake, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import lakesImg from '@/assets/lazio-volcanic-lakes.jpg';
import coastImg from '@/assets/lazio-coast.jpg';
import mountainsImg from '@/assets/lazio-mountains.jpg';
import countrysideImg from '@/assets/lazio-countryside.jpg';

interface Place {
  name: string;
  living: string;
  data: string;
}

interface Landscape {
  id: string;
  label: string;
  icon: typeof Waves;
  image: string;
  lead: string;
  winter: string;
  places: Place[];
}

const LANDSCAPES: Landscape[] = [
  {
    id: 'lakes',
    label: 'Volcanic lakes',
    icon: Waves,
    image: lakesImg,
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
      },
      {
        name: 'Lake Bolsena',
        living:
          'The biggest volcanic lake in Europe and the most affordable. Cheap houses, thin winter services, a genuinely warm summer scene.',
        data: '305 m · ~120 km from Rome · car essential',
      },
      {
        name: 'Lake Albano (Castelli Romani)',
        living:
          'Rome\'s wine hills. Frascati, Castel Gandolfo, Nemi — expensive, green, and 40 minutes from the centre on a good day.',
        data: '293 m · ~25 km from Rome · frequent regional rail',
      },
      {
        name: 'Lake Vico',
        living:
          'A protected nature reserve rather than a resort. Almost no lakefront building, which is exactly the appeal.',
        data: '510 m · ~65 km from Rome · car essential',
      },
    ],
  },
  {
    id: 'coast',
    label: 'Coast',
    icon: Trees,
    image: coastImg,
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
      },
      {
        name: 'Gaeta',
        living:
          'A real working town with a naval base, a medieval quarter and beaches that stay open in winter. Best year-round coastal bet.',
        data: '~120 km from Rome · direct trains to Formia, then Rome in ~70 min',
      },
      {
        name: 'Sperlonga',
        living:
          'Whitewashed and vertical, beautiful and seasonal. Wonderful for six months, very quiet for the other six.',
        data: '~130 km from Rome · car or bus from Fondi station',
      },
      {
        name: 'Anzio & Nettuno',
        living:
          'The commuter coast. Cheapest sea-view property within an hour of Rome, with the traffic and the crowds that implies.',
        data: '~55 km from Rome · direct regional train ~60 min',
      },
    ],
  },
  {
    id: 'mountains',
    label: 'Mountains',
    icon: Mountain,
    image: mountainsImg,
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
      },
      {
        name: 'Monti Ernici & Ciociaria highlands',
        living:
          'Stone villages above Frosinone with the lowest property prices in the region and a strong local food culture.',
        data: '600–1,200 m · ~90 km from Rome',
      },
      {
        name: 'Monti Lepini',
        living:
          'A limestone wall behind the Pontine plain — Sermoneta, Norma, Carpineto. Rome visible from your terrace on a clear day.',
        data: '400–1,500 m · ~60 km from Rome',
      },
      {
        name: 'Monti della Laga / Leonessa',
        living:
          'The far north-east near Rieti. Snow country, seismic zone, spectacular emptiness. Only for the committed.',
        data: '~970 m (Leonessa) · ~130 km from Rome',
      },
    ],
  },
  {
    id: 'countryside',
    label: 'Countryside',
    icon: Wheat,
    image: countrysideImg,
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
      },
      {
        name: 'Sabina',
        living:
          'Olive-oil hills north-east of Rome. Rustic but well connected — many Rome workers live here full time.',
        data: '~50 km from Rome · Fara Sabina station, 35 min to Tiburtina',
      },
      {
        name: 'Ciociaria (Frosinone province)',
        living:
          'Underrated, unpretentious, and served by the A1 and the Rome–Naples rail line. Very low cost of living.',
        data: '~80 km from Rome · Frosinone station ~50 min to Termini',
      },
      {
        name: 'Valle dell\'Aniene',
        living:
          'The river corridor through Tivoli towards Subiaco: villas, waterfalls, monasteries, and a fast road to Rome.',
        data: '~35–70 km from Rome · A24 motorway',
      },
    ],
  },
];

export default function LazioBeyondRome() {
  const [activeId, setActiveId] = useState('lakes');
  const active = LANDSCAPES.find((l) => l.id === activeId)!;

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
                onClick={() => setActiveId(l.id)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </Button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src={active.image}
              alt={`${active.label} landscape in Lazio, Italy`}
              className="w-full h-[320px] lg:h-[420px] object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <p className="text-base text-foreground leading-relaxed mb-4">{active.lead}</p>
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-6">
              <Snowflake className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span><span className="font-medium text-foreground">Winter reality:</span> {active.winter}</span>
            </div>

            <div className="space-y-3">
              {active.places.map((p) => (
                <Card key={p.name} className={cn('transition-all hover:shadow-md')}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {p.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">{p.living}</p>
                    <Badge variant="secondary" className="text-xs font-normal">{p.data}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
