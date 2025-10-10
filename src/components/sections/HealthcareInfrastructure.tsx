import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ExternalLink, MapPin, Heart, Plane, Train, Trees } from 'lucide-react';

interface HealthcareInfrastructureProps {
  healthcare: {
    intro: {
      headline: string;
      lead: string;
    };
    hospitals: Array<{
      name: string;
      location: string;
      coords: [number, number];
      description: string;
      link: string;
      mapUrl: string;
    }>;
    airports: Array<{
      name: string;
      coords: [number, number];
      description: string;
      link: string;
      mapUrl: string;
    }>;
    railways: Array<{
      name: string;
      description: string;
      link: string;
    }>;
    highways: Array<{
      name: string;
      description: string;
      link: string;
    }>;
    parks: Array<{
      name: string;
      coords: [number, number];
      description: string;
      link: string;
      mapUrl: string;
    }>;
    travelTimes: Array<{
      from: string;
      to: Array<{
        destination: string;
        time: string;
      }>;
      nearestAirport: string;
    }>;
    quickInfo: {
      emergencyNumbers: string[];
      healthcare: {
        title: string;
        description: string;
        link: string;
      };
      transport: {
        title: string;
        description: string;
        link: string;
      };
    };
    closing: string;
  };
}

export function HealthcareInfrastructure({ healthcare }: HealthcareInfrastructureProps) {
  const [mapLayer, setMapLayer] = useState<'hospitals' | 'airports' | 'parks'>('hospitals');
  const [travelIndex, setTravelIndex] = useState(0);

  const currentTravel = healthcare.travelTimes[travelIndex];

  // Memoize map data to prevent unnecessary recalculations
  const mapData = React.useMemo(() => {
    switch (mapLayer) {
      case 'hospitals':
        return healthcare.hospitals.map(h => ({
          coords: h.coords,
          name: h.name,
          description: h.description,
          link: h.link,
          mapUrl: h.mapUrl,
          icon: '🏥'
        }));
      case 'airports':
        return healthcare.airports.map(a => ({
          coords: a.coords,
          name: a.name,
          description: a.description,
          link: a.link,
          mapUrl: a.mapUrl,
          icon: '✈️'
        }));
      case 'parks':
        return healthcare.parks.map(p => ({
          coords: p.coords,
          name: p.name,
          description: p.description,
          link: p.link,
          mapUrl: p.mapUrl,
          icon: '🏔️'
        }));
    }
  }, [mapLayer, healthcare]);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {healthcare.intro.headline}
            </h2>
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed max-w-4xl mx-auto">
              {healthcare.intro.lead}
            </p>
          </div>

          {/* Location Cards */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <Button
                variant={mapLayer === 'hospitals' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapLayer('hospitals')}
              >
                <Heart className="h-4 w-4 mr-2" />
                Hospitals
              </Button>
              <Button
                variant={mapLayer === 'airports' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapLayer('airports')}
              >
                <Plane className="h-4 w-4 mr-2" />
                Airports
              </Button>
              <Button
                variant={mapLayer === 'parks' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapLayer('parks')}
              >
                <Trees className="h-4 w-4 mr-2" />
                National Parks
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mapData && mapData.map((location, idx) => (
                <Card key={`${mapLayer}-${idx}`} className="shadow-soft hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      {mapLayer === 'hospitals' && <Heart className="h-5 w-5 text-red-500" />}
                      {mapLayer === 'airports' && <Plane className="h-5 w-5 text-blue-500" />}
                      {mapLayer === 'parks' && <Trees className="h-5 w-5 text-green-500" />}
                      {location.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">{location.description}</p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <a
                          href={location.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <a
                          href={location.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-3 w-3 mr-2" />
                          Get Directions
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Travel Time Slider */}
          <Card className="mb-12 shadow-soft">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                How Far Can You Go in 2 Hours?
              </h3>
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Starting from:</span>
                  <span className="text-xl font-bold text-primary">{currentTravel.from}</span>
                </div>
                <Slider
                  value={[travelIndex]}
                  onValueChange={(value) => setTravelIndex(value[0])}
                  max={healthcare.travelTimes.length - 1}
                  step={1}
                  className="mb-6"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  {healthcare.travelTimes.map((t, idx) => (
                    <span key={idx}>{t.from}</span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Travel Times
                  </h4>
                  {currentTravel.to.map((dest, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="font-medium">{dest.destination}</span>
                      <span className="text-sm text-muted-foreground">{dest.time}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center bg-accent/10 rounded-lg p-6">
                  <div className="text-center">
                    <Plane className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <p className="text-sm font-semibold mb-1">Nearest Airport</p>
                    <p className="text-muted-foreground">{currentTravel.nearestAirport}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transport & Healthcare Info Tabs */}
          <Tabs defaultValue="transport" className="mb-12">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="transport">
                <Train className="h-4 w-4 mr-2" />
                Transport
              </TabsTrigger>
              <TabsTrigger value="quick">
                <Heart className="h-4 w-4 mr-2" />
                Essential Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transport" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Train className="h-5 w-5 text-primary" />
                    Railways
                  </h4>
                  <div className="space-y-3">
                    {healthcare.railways.map((railway, idx) => (
                      <div key={idx} className="border-b border-border/50 pb-3 last:border-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold">{railway.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{railway.description}</p>
                          </div>
                          <a
                            href={railway.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4"
                          >
                            <ExternalLink className="h-4 w-4 text-primary" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-bold mb-4">Highways & Driving</h4>
                  {healthcare.highways.map((highway, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold">{highway.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{highway.description}</p>
                        </div>
                        <a
                          href={highway.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4"
                        >
                          <ExternalLink className="h-4 w-4 text-primary" />
                        </a>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-foreground/80">
                      <strong>Driving Reality Check:</strong> Driving in Piemonte is a pleasure — until you reach Turin's ZTL (Limited Traffic Zone), which fines the unaware. Outside the city, roads are well-maintained and signage clear.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quick" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-bold mb-3 text-red-600">Emergency Numbers</h4>
                    <ul className="space-y-2 text-sm">
                      {healthcare.quickInfo.emergencyNumbers.map((num, idx) => (
                        <li key={idx} className="font-mono">{num}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-bold mb-2">{healthcare.quickInfo.healthcare.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {healthcare.quickInfo.healthcare.description}
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a
                        href={healthcare.quickInfo.healthcare.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Learn More
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-bold mb-2">{healthcare.quickInfo.transport.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {healthcare.quickInfo.transport.description}
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a
                        href={healthcare.quickInfo.transport.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Visit Portal
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Closing Statement */}
          <div className="text-center">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed max-w-4xl mx-auto italic">
              {healthcare.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
