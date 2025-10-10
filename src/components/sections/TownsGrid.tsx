import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface GridTown {
  id: string;
  name: string;
  bestFor: string;
  photo: string;
  mapUrl: string;
  blurb: string;
}

interface TownsGridProps {
  towns: GridTown[];
}

export function TownsGrid({ towns }: TownsGridProps) {
  return (
    <section className="py-8 md:py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">More Towns to Consider</h2>
          <p className="text-lg text-muted-foreground">
            Beyond the highlights—solid options worth exploring
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {towns.map((town) => (
            <Card key={town.id} className="overflow-hidden hover-lift shadow-soft">
              <div className="relative h-48">
                <img
                  src={town.photo}
                  alt={town.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">{town.name}</h3>
                  <p className="text-sm text-white drop-shadow-md">{town.bestFor}</p>
                </div>
              </div>

              <CardContent className="p-5">
                <p className="text-sm text-foreground/80 mb-4">{town.blurb}</p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href={town.mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
