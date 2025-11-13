import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Map } from 'lucide-react';

interface GridTown {
  id: string;
  name: string;
  bestFor: string;
  photo: string;
  mapUrl: string;
  blurb: string;
  fullDescription?: string;
  eligible7Percent?: boolean;
}

interface TownsGridProps {
  towns: GridTown[];
}

export function TownsGrid({ towns }: TownsGridProps) {
  const [selectedTown, setSelectedTown] = useState<GridTown | null>(null);

  return (
    <>
      <section className="py-8 md:py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Map className="h-12 w-12 mx-auto mb-4 text-primary" />
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
                  {town.eligible7Percent && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground font-bold text-2xl px-4 py-2 rounded-lg shadow-lg">
                      7%
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">{town.name}</h3>
                    <p className="text-sm text-white drop-shadow-md">{town.bestFor}</p>
                  </div>
                </div>

                <CardContent className="p-5">
                  <p className="text-sm text-foreground/80 mb-2">{town.blurb}</p>
                  {town.fullDescription && (
                    <button
                      onClick={() => setSelectedTown(town)}
                      className="text-primary hover:underline text-sm font-medium mb-4 block"
                    >
                      Read More...
                    </button>
                  )}
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

      <Dialog open={!!selectedTown} onOpenChange={() => setSelectedTown(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              {selectedTown?.name}
              {selectedTown?.eligible7Percent && (
                <span className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1 rounded-md">
                  7%
                </span>
              )}
            </DialogTitle>
            <p className="text-muted-foreground italic">{selectedTown?.bestFor}</p>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed">{selectedTown?.blurb}</p>
            <p className="text-foreground leading-relaxed">{selectedTown?.fullDescription}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
