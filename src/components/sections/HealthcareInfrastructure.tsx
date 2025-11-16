import React, { useState } from 'react';
import { Building2, Plane, ExternalLink, TrainFront, Train, Mountain, BusFront, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PugliaCityReachMap } from './PugliaCityReachMap';
import { PugliaRailNetworkMap } from './PugliaRailNetworkMap';
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal';

interface HealthcareInfrastructureProps {
  region?: string;
  healthcare: {
    intro: string;
    hospitals?: Array<{
      name: string;
      location: string;
      link?: string;
      mapLink?: string;
      specialties?: string[];
      emergency?: boolean;
    }>;
    airports?: Array<{
      name: string;
      code?: string;
      website?: string;
      mapLink?: string;
      description?: string;
    }>;
    trains?: {
      header: string;
      subcopy: string;
      networks: Array<{
        id: string;
        name: string;
        icon: string;
        color: string;
        description: string;
      }>;
      closing: string;
      travelMatrix: {
        withinPuglia: Record<string, Record<string, string>>;
        toMajorCities: Record<string, Record<string, string>>;
      };
    };
  };
}

export function HealthcareInfrastructure({ region, healthcare }: HealthcareInfrastructureProps) {
  const [travelMode, setTravelMode] = useState<'withinPuglia' | 'toMajorCities'>('withinPuglia');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  
  const trains = healthcare.trains;
  const travelTime = origin && destination && trains
    ? trains.travelMatrix[travelMode]?.[origin]?.[destination]
    : null;

  // Extract network badges from travel time string
  const getNetworkBadges = (timeString: string | null) => {
    if (!timeString) return [];
    const badges: Array<{ name: string; color: string }> = [];
    if (timeString.includes('FSE')) {
      badges.push({ name: 'FSE', color: 'hsl(142 76% 36%)' });
    }
    // Default to Trenitalia if no specific network mentioned
    if (badges.length === 0) {
      badges.push({ name: 'Trenitalia', color: 'hsl(142 71% 45%)' });
    }
    return badges;
  };

  const getRouteComplexity = (timeString: string | null) => {
    if (!timeString) return null;
    const duration = timeString.toLowerCase();
    if (duration.includes('fse') || duration.includes('–')) return '🟡';
    if (parseInt(duration) > 180) return '🟠'; // More than 3 hours
    return '🟢';
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      'train-front': TrainFront,
      'train': Train,
      'train-track': Train,
      'mountain': Mountain,
      'bus-front': BusFront,
    };
    return icons[iconName] || Train;
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Healthcare & Infrastructure —<br />Life Runs on Human Scale Here
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {healthcare.intro}
          </p>
        </div>

        {/* Tabs for Hospitals, Airports, and Trains */}
        <Tabs defaultValue="hospitals" className="mb-16">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="airports">Airports</TabsTrigger>
            <TabsTrigger value="trains">Trains</TabsTrigger>
          </TabsList>

          <TabsContent value="hospitals">
            {healthcare.hospitals && healthcare.hospitals.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {healthcare.hospitals.map((hospital, idx) => (
                  <FacilityCard key={idx} index={idx}>
                    <div className="flex items-start gap-4">
                      <Building2 className="w-8 h-8 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{hospital.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{hospital.location}</p>
                        
                        {hospital.specialties && hospital.specialties.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Specialties:</p>
                            <div className="flex flex-wrap gap-2">
                              {hospital.specialties.map((specialty, i) => (
                                <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          {hospital.link && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={hospital.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Website
                              </a>
                            </Button>
                          )}
                          {hospital.mapLink && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={hospital.mapLink} target="_blank" rel="noopener noreferrer">
                                <Building2 className="w-3 h-3 mr-1" />
                                Map
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </FacilityCard>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="airports">
            {healthcare.airports && healthcare.airports.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                {healthcare.airports.map((airport, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Plane className="w-8 h-8 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-bold text-base mb-1">{airport.name}</h4>
                          {airport.code && (
                            <p className="text-xs text-primary font-mono mb-2">{airport.code}</p>
                          )}
                          {airport.description && (
                            <p className="text-sm text-muted-foreground mb-3">{airport.description}</p>
                          )}
                          
                          <div className="flex gap-2 flex-wrap">
                            {airport.website && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={airport.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Website
                                </a>
                              </Button>
                            )}
                            {airport.mapLink && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={airport.mapLink} target="_blank" rel="noopener noreferrer">
                                  <Plane className="w-3 h-3 mr-1" />
                                  Map
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trains">
            {trains && (
              <div className="space-y-12">
                {/* Animated Train Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-8 border border-primary/20">
                  <div className="absolute top-4 right-4 animate-[slide-train_20s_linear_infinite]">
                    <TrainFront className="w-12 h-12 text-primary opacity-30" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    {trains.header}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    {trains.subcopy}
                  </p>
                </div>

                {/* Transit Networks Accordion */}
                <Accordion type="single" collapsible className="space-y-4">
                  {trains.networks.map((network, idx) => {
                    const IconComponent = getIconComponent(network.icon);
                    return (
                      <AccordionItem
                        key={network.id}
                        value={network.id}
                        className="border rounded-lg px-6 hover:border-primary/50 transition-colors"
                      >
                        <AccordionTrigger className="hover:no-underline py-6">
                          <div className="flex items-center gap-4 text-left">
                            <div
                              className="p-3 rounded-lg"
                              style={{ backgroundColor: `${network.color.replace('hsl(var(--primary))', 'hsl(var(--primary) / 0.1)')}15` }}
                            >
                              <IconComponent 
                                className="w-6 h-6" 
                                style={{ color: network.color }}
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{network.name}</h4>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-6">
                          <p className="text-muted-foreground leading-relaxed">
                            {network.description}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>

                {/* Closing Statement */}
                <div className="text-center py-6 px-8 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-lg font-medium text-foreground italic">
                    {trains.closing}
                  </p>
                </div>

                {/* Visual Rail Network Map */}
                {region === 'puglia' && <PugliaRailNetworkMap networks={trains.networks} />}

                {/* Interactive Travel Time Selector */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                  <h4 className="text-2xl font-bold text-foreground mb-6 text-center">
                    Train Travel Time Matrix
                  </h4>
                  
                  {/* Mode Toggle */}
                  <div className="flex justify-center gap-4 mb-8">
                    <Button
                      variant={travelMode === 'withinPuglia' ? 'default' : 'outline'}
                      onClick={() => {
                        setTravelMode('withinPuglia');
                        setOrigin('');
                        setDestination('');
                      }}
                      className="min-w-[160px]"
                    >
                      Within Puglia
                    </Button>
                    <Button
                      variant={travelMode === 'toMajorCities' ? 'default' : 'outline'}
                      onClick={() => {
                        setTravelMode('toMajorCities');
                        setOrigin('');
                        setDestination('');
                      }}
                      className="min-w-[160px]"
                    >
                      To Major Cities
                    </Button>
                  </div>

                  {/* Origin & Destination Selectors */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        Origin
                      </label>
                      <Select value={origin} onValueChange={setOrigin}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select departure city" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(trains.travelMatrix[travelMode]).map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        Destination
                      </label>
                      <Select 
                        value={destination} 
                        onValueChange={setDestination}
                        disabled={!origin}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={origin ? "Select arrival city" : "Choose origin first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {origin && trains.travelMatrix[travelMode][origin] &&
                            Object.keys(trains.travelMatrix[travelMode][origin]).map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Travel Time Result */}
                  {travelTime && (
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg p-8 text-center animate-fade-in">
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <TrainFront className="w-8 h-8 text-primary animate-pulse" />
                        <p className="text-sm font-medium text-muted-foreground">
                          {origin} → {destination}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <p className="text-4xl font-bold text-primary">
                          {travelTime.replace(/\s*\(.*?\)\s*/g, '')}
                        </p>
                        <span className="text-2xl">
                          {getRouteComplexity(travelTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {getNetworkBadges(travelTime).map((badge, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            style={{
                              borderColor: badge.color,
                              backgroundColor: `${badge.color}20`,
                              color: badge.color,
                            }}
                          >
                            {badge.name}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Estimated travel time
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        🟢 Direct • 🟡 Simple (1 transfer) • 🟠 Complex (2+ transfers)
                      </p>
                    </div>
                  )}

                  {!travelTime && origin && destination && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No direct route available for this selection.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* City Reach Map */}
        {region === 'puglia' && <PugliaCityReachMap />}

        {/* Closing Statement */}
        <div className="text-center max-w-2xl mx-auto mt-16">
          <p className="text-muted-foreground leading-relaxed">
            {region === 'puglia' 
              ? 'Infrastructure in Puglia is designed to support comfortable, connected living — whether you\'re here seasonally or year-round.'
              : 'Healthcare and infrastructure are designed to support comfortable, connected living — whether you\'re here seasonally or year-round.'
            }
          </p>
        </div>
      </div>
    </section>
  );
}

function FacilityCard({ 
  children, 
  index 
}: { 
  children: React.ReactNode; 
  index: number;
}) {
  const { isVisible, elementRef } = useStaggeredReveal();

  return (
    <Card 
      ref={elementRef as any}
      className={`border-l-4 border-l-primary hover:shadow-lg transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}
