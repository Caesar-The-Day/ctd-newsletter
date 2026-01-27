import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Waves, Bike, Castle, MapPin, 
  ExternalLink, Ship, Sailboat, TreePine, 
  Music, Wine, Bird, Mountain, PersonStanding
} from 'lucide-react';
import LakeTrasimenoMap from './LakeTrasimenoMap';

interface Activity {
  name: string;
  description: string;
  icon: React.ElementType;
  location?: string;
  imageUrl?: string;
}

const waterActivities: Activity[] = [
  {
    name: 'Windsurfing & Kitesurfing',
    description: 'The shallow, windy lake creates ideal conditions. Schools and rental outlets in Passignano and Castiglione del Lago.',
    icon: Waves,
    location: 'Passignano, Castiglione del Lago',
    imageUrl: 'https://www.umbriatourism.it/documents/20126/34101/sporttrasimeno%25283%25292.jpg/cf5af464-7ab4-fb64-bd0a-72a3ea24b09b?t=1583781669478&width=1080'
  },
  {
    name: 'SUP & Kayaking',
    description: 'Calm, scenic waters perfect for stand-up paddleboarding and kayaking along the shoreline.',
    icon: PersonStanding,
    location: 'Multiple access points',
    imageUrl: 'https://www.experiencetrasimeno.it/wp-content/uploads/2022/04/canoaclub-montedellago.jpg'
  },
  {
    name: 'Sailing & Boating',
    description: 'Sailboat and motorboat rentals available at multiple marinas around the lake.',
    icon: Sailboat,
    location: 'Tuoro, Passignano',
    imageUrl: 'https://www.portodelsole.it/wp-content/uploads/2018/02/barca_vela-2.jpg'
  },
  {
    name: 'Beaches & Swimming',
    description: 'Equipped beaches at Zocco Beach, Sualzo Beach, and San Feliciano. Warm shallow waters for swimming.',
    icon: Waves,
    location: 'Magione, San Feliciano',
    imageUrl: 'https://www.italyreview.com/uploads/2/6/3/6/26365745/tuoro-sul-trasimeno-umbria-italy-1a_orig.jpg'
  }
];

const islands: Activity[] = [
  {
    name: 'Isola Maggiore',
    description: 'Inhabited island with a charming 15th-century fishing village, Romanesque church of San Salvatore, and the famous Lace Museum.',
    icon: Ship,
    location: 'Ferry from Passignano & Tuoro',
    imageUrl: 'https://www.bellaumbria.net/wp-content/uploads/2017/07/Lago-Trasimeno_Isola-Maggiore_dall-altro2.jpg'
  },
  {
    name: 'Isola Polvese',
    description: 'The largest island, now a nature reserve focused on educational, scientific, and recreational activities with beautiful hiking trails.',
    icon: TreePine,
    location: 'Ferry from San Feliciano',
    imageUrl: 'https://www.bellaumbria.net/wp-content/uploads/2017/06/Trasimeno_Isola-Polvese_sentiero.jpg'
  }
];

const landActivities: Activity[] = [
  {
    name: '58km Cycling Trail',
    description: 'The Pista Ciclabile del Trasimeno circles the entire lake — a dedicated, mostly flat path perfect for all skill levels.',
    icon: Bike,
    location: 'Full lake circuit',
    imageUrl: 'https://www.umbriatourism.it/documents/20126/338198/BikeCastiglioneLago/6f8a6116-e1ae-d681-7140-a53987097e6d?width=780'
  },
  {
    name: 'Hiking Trails',
    description: 'La Via del Trasimeno and surrounding hill trails offer panoramic views of the lake and Umbrian countryside.',
    icon: Mountain,
    location: 'Various trailheads',
    imageUrl: 'https://www.umbriatourism.it/documents/20126/342208/laviadeltrasimeno%282%29.jpg/bd0561d8-c1de-eee5-2b0f-5633b81b6558?width=1200'
  },
  {
    name: 'Horseback Riding',
    description: 'Equestrian tours through olive groves and lakeside paths. Stables like Asd Bv Ranch offer guided excursions.',
    icon: PersonStanding,
    location: 'Local stables',
    imageUrl: 'https://www.lagotrasimeno.net/media/cache/fe_gallery_md/uploads/images/photos/6299dd39cdc32853353871.jpg'
  },
  {
    name: 'Golf',
    description: 'The 18-hole Lamborghini Golf Club offers a scenic course with lake views.',
    icon: TreePine,
    location: 'Near Castiglione del Lago',
    imageUrl: 'https://www.lagotrasimeno.net/media/cache/fe_gallery_md/uploads/images/photos/63e3a4eb4a5a3394908521.jpg'
  }
];

const cultureActivities: Activity[] = [
  {
    name: 'Medieval Villages',
    description: 'Explore Castiglione del Lago with its Rocca del Leone fortress, the artistic village of Panicale, and vibrant Città della Pieve.',
    icon: Castle,
    location: 'Around the lake',
    imageUrl: 'https://www.tenutedelcerro.it/wp-content/uploads/2025/03/Trasimeno-di-notte.jpg'
  },
  {
    name: 'Wine Tasting',
    description: 'Visit local wineries like Cantina Berioli for tastings of Umbrian wines paired with lake fish.',
    icon: Wine,
    location: 'Various wineries',
    imageUrl: 'https://villagioiella.com/wp-content/uploads/2024/12/rsz_1umbria-torism-archive-lake-vineyard-vigneto-vino.webp'
  },
  {
    name: 'Birdwatching',
    description: 'La Valle naturalistic oasis is a wetland paradise for bird enthusiasts, with hides and guided tours.',
    icon: Bird,
    location: 'La Valle Oasis',
    imageUrl: 'https://www.lagotrasimeno.net/media/cache/fe_primary_image_small/uploads/images/activities/627d08d78b13a407729033.jpg'
  },
  {
    name: 'Music Festivals',
    description: 'The Trasimeno Music Festival and Blues Festival bring world-class performances to lakeside venues.',
    icon: Music,
    location: 'Summer events',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjIcRLSgd7Nc63HP-2G1Y7xzoKL-Ymq_GAYQ&s'
  }
];

const categories = [
  { id: 'water', label: 'Water Sports', icon: Waves, activities: waterActivities },
  { id: 'islands', label: 'Islands', icon: Ship, activities: islands },
  { id: 'land', label: 'Land Sports', icon: Bike, activities: landActivities },
  { id: 'culture', label: 'Culture', icon: Castle, activities: cultureActivities }
];

function ActivityCard({ activity }: { activity: Activity }) {
  const Icon = activity.icon;
  const [imageError, setImageError] = useState(false);
  const showImage = activity.imageUrl && !imageError;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-blue-100 hover:border-blue-300 overflow-hidden">
      {showImage && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={activity.imageUrl}
            alt={activity.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      <CardContent className={showImage ? 'p-4' : 'p-5'}>
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{activity.name}</h4>
            {activity.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {activity.location}
              </p>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {activity.description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function UmbriaLakeTrasimeno() {
  const [activeTab, setActiveTab] = useState('water');

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50/50 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            <Waves className="w-3 h-3 mr-1.5" />
            Central Italy's Hidden Lake
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lake Trasimeno: Your Backyard Playground
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            One of only <span className="font-semibold text-foreground">three large lakes in central Italy</span> — 
            and the most accessible for outdoor recreation, island hopping, and village life within Umbria. 
            At 128 km², it's Italy's fourth-largest lake and a year-round destination for the active retiree.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="mb-10">
          <LakeTrasimenoMap />
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto p-1 bg-muted/50">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <div className={`grid gap-4 ${cat.activities.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
                {cat.activities.map((activity) => (
                  <ActivityCard key={activity.name} activity={activity} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
            asChild
          >
            <a 
              href="https://www.lagotrasimeno.net/en/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Official Lake Trasimeno Guide
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
