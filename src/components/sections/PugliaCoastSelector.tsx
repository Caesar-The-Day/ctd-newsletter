import { useState } from 'react';
import { MapPin, Train, Car, Plane, ThumbsUp, AlertCircle, X, Waves } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CoastalRegion {
  id: string;
  name: string;
  image: string;
  vibe: string;
  towns: string[];
  access: string;
  pros: string[];
  cons: string[];
}

const coastalRegions: CoastalRegion[] = [
  {
    id: 'adriatic',
    name: 'Adriatic Coast',
    image: '/images/puglia/adriatic-coast.webp',
    vibe: 'Whitewashed towns, cliffs, coves, clear blue water; the postcard version of Puglia.',
    towns: ['Polignano a Mare', 'Monopoli', 'Ostuni', 'Trani'],
    access: 'Strong train network, easy access to Bari Airport.',
    pros: ['Walkable towns', 'Vibrant piazza life', 'Great healthcare access'],
    cons: ['More tourists in summer']
  },
  {
    id: 'ionian',
    name: 'Ionian Coast',
    image: '/images/puglia/ionian-coast.jpg',
    vibe: 'Warm, shallow, Caribbean-like seas; slower, softer, quieter.',
    towns: ['Porto Cesareo', 'Gallipoli', 'Manduria', 'Maruggio'],
    access: 'Best with a car; fewer direct train lines.',
    pros: ['Amazing beaches', 'Warmest water', 'Great seafood'],
    cons: ['Less winter activity', 'Quieter villages']
  },
  {
    id: 'salento',
    name: 'Salento',
    image: '/images/puglia/salento-coast.jpg',
    vibe: 'Dramatic cliffs, turquoise water, Greece-meets-Italy energy.',
    towns: ['Otranto', 'Santa Maria di Leuca', 'Castro', 'Nardò'],
    access: 'Primarily from Lecce; car recommended.',
    pros: ['Spectacular coastlines', 'Strong culture', 'Music festivals'],
    cons: ['Hot summers', 'Long drive to airports']
  },
  {
    id: 'gargano',
    name: 'Gargano Peninsula',
    image: '/images/puglia/gargano-coast.jpg',
    vibe: 'Forested, wild, mountainous — unlike anywhere else in Puglia.',
    towns: ['Vieste', 'Peschici', 'Monte Sant\'Angelo'],
    access: 'Limited trains; best by car.',
    pros: ['Stunning drives', 'National parks', 'Dramatic beaches'],
    cons: ['Less practical for daily commuting']
  },
  {
    id: 'alta-murgia',
    name: 'Alta Murgia',
    image: '/images/puglia/alta-murgia.jpg',
    vibe: 'Rolling stone plateaus, agriculture, olive groves, slow rural life.',
    towns: ['Altamura', 'Gravina', 'Ruvo', 'Andria'],
    access: 'Easy driving, moderate train access.',
    pros: ['Affordable housing', 'Authentic village life', 'Cooler temperatures'],
    cons: ['No coast', 'Requires a car']
  }
];

export function PugliaCoastSelector() {
  const [selectedRegion, setSelectedRegion] = useState<CoastalRegion | null>(null);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Waves className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Which Pugliese Coast Fits Your Lifestyle?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore five distinct coastal zones and inland regions. Each offers a unique vibe, 
            accessibility, and lifestyle for your Italian adventure.
          </p>
        </div>

        {/* Desktop Grid / Mobile Scroll */}
        <div className="relative">
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              {coastalRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className="flex-none w-[280px] h-[320px] relative rounded-xl overflow-hidden 
                           transition-all duration-300 hover:scale-105 snap-center
                           focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                      {region.name}
                    </h3>
                    <p className="text-sm text-white/90 line-clamp-2">
                      {region.vibe}
                    </p>
                  </div>
                  <MapPin className="absolute top-4 right-4 h-6 w-6 text-white drop-shadow-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {coastalRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                className="relative h-[300px] rounded-xl overflow-hidden 
                         transition-all duration-300 hover:scale-105 hover:shadow-xl
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                    {region.name}
                  </h3>
                  <p className="text-sm text-white/90 line-clamp-2">
                    {region.vibe}
                  </p>
                </div>
                <MapPin className="absolute top-4 right-4 h-6 w-6 text-white drop-shadow-lg" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal/Dialog */}
        <Dialog open={!!selectedRegion} onOpenChange={() => setSelectedRegion(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            {selectedRegion && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    {selectedRegion.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                  {/* Vibe */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">The Vibe</h3>
                    <p className="italic text-muted-foreground leading-relaxed">
                      {selectedRegion.vibe}
                    </p>
                  </div>

                  {/* Towns */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Recommended Towns</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegion.towns.map((town) => (
                        <Badge key={town} variant="secondary" className="text-sm px-3 py-1">
                          {town}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Access */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Getting There & Around</h3>
                    <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                      <Train className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{selectedRegion.access}</p>
                    </div>
                  </div>

                  {/* Pros */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Great for Retirees</h3>
                    <div className="space-y-2">
                      {selectedRegion.pros.map((pro, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground">{pro}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cons */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Things to Consider</h3>
                    <div className="space-y-2">
                      {selectedRegion.cons.map((con, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground">{con}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={selectedRegion.image}
                      alt={`${selectedRegion.name} landscape`}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
