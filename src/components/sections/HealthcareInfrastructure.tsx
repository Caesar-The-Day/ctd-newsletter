import React from 'react';
import { Building2, Plane, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PugliaCityReachMap } from './PugliaCityReachMap';

interface HealthcareInfrastructureProps {
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
  };
}

export function HealthcareInfrastructure({ healthcare }: HealthcareInfrastructureProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Healthcare & Infrastructure —<br />Life Runs on Human Scale Here
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {healthcare.intro}
          </p>
        </div>

        {/* Hospitals Section */}
        {healthcare.hospitals && healthcare.hospitals.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
              Major Medical Centers
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {healthcare.hospitals.map((hospital, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Airports Section */}
        {healthcare.airports && healthcare.airports.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
              Airports
            </h3>
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
          </div>
        )}

        {/* City Reach Map */}
        <PugliaCityReachMap />

        {/* Closing Statement */}
        <div className="text-center max-w-2xl mx-auto mt-16">
          <p className="text-muted-foreground leading-relaxed">
            Infrastructure in Puglia is designed to support comfortable, connected living — 
            whether you're here seasonally or year-round.
          </p>
        </div>
      </div>
    </section>
  );
}
