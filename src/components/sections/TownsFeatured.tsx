import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FeaturedTown {
  id: string;
  name: string;
  bestFor: string;
  photo: string;
  summary: string;
  fullDescription?: string;
  mapUrl: string;
  gallery: string[];
  links?: Array<{
    label: string;
    href: string;
  }>;
  eligible7Percent?: boolean;
}

interface TownsFeaturedProps {
  towns: FeaturedTown[];
  region?: string;
}

export function TownsFeatured({ towns, region }: TownsFeaturedProps) {
  const [galleryIndices, setGalleryIndices] = useState<Record<string, number>>({});

  const nextImage = (townId: string, maxIndex: number) => {
    setGalleryIndices((prev) => ({
      ...prev,
      [townId]: ((prev[townId] || 0) + 1) % (maxIndex + 1),
    }));
  };

  const prevImage = (townId: string, maxIndex: number) => {
    setGalleryIndices((prev) => ({
      ...prev,
      [townId]: ((prev[townId] || 0) - 1 + (maxIndex + 1)) % (maxIndex + 1),
    }));
  };

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Towns</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The soul of {region || 'Italy'}—towns that balance beauty, culture, and real life
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {towns.map((town) => {
            const currentIndex = galleryIndices[town.id] || 0;
            const gallery = town.gallery || [];
            const currentImage = gallery[currentIndex] || town.photo;
            const hasGallery = gallery.length > 1;

            return (
              <Card key={town.id} className="overflow-hidden shadow-medium hover-lift">
                {/* Image Gallery */}
                <div className="relative h-64 group">
                    <img
                      src={currentImage}
                      alt={`${town.name} - Image ${currentIndex + 1} showcasing ${town.bestFor} - the charm of this Italian town for retirees`}
                      className="w-full h-full object-cover"
                    />
                  
                  {/* 7% Badge */}
                  {town.eligible7Percent && (
                    <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground font-bold text-2xl px-4 py-2 rounded-lg shadow-lg">
                      7%
                    </div>
                  )}
                  
                  {/* Gallery Controls */}
                  {hasGallery && (
                    <>
                      <button
                        onClick={() => prevImage(town.id, gallery.length - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => nextImage(town.id, gallery.length - 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {gallery.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === currentIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {town.bestFor}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{town.name}</h3>
                  <p className="text-foreground/80 mb-4 leading-relaxed">
                    {town.summary}
                  </p>

                  {/* Read More Button */}
                  {town.fullDescription && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm" className="w-full mb-2">
                          Read More
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-3xl">{town.name}</DialogTitle>
                          <DialogDescription className="text-base text-muted-foreground">
                            {town.bestFor}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                          {town.fullDescription.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-foreground/90 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Links */}
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a
                        href={town.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Map
                      </a>
                    </Button>

                    {town.links?.map((link) => (
                      <Button
                        key={link.label}
                        variant="ghost"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {link.label}
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
