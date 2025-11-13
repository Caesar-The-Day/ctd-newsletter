import React, { useState } from 'react';
import { MapPin, Plane, Train, Ship, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CityData {
  name: string;
  position: { top: string; left: string };
  hospitals: string[];
  airport: string;
  ferryRoutes?: string;
  trains: string;
  coastAccess: string;
}

const cities: CityData[] = [
  {
    name: 'Bari',
    position: { top: '25%', left: '70%' },
    hospitals: ['Polyclinic', 'Mater Dei'],
    airport: 'Bari BRI (15–25 mins)',
    ferryRoutes: 'Greece, Albania, Croatia',
    trains: 'Fastest connections in Puglia',
    coastAccess: 'Polignano/Monopoli 30–40 mins'
  },
  {
    name: 'Brindisi',
    position: { top: '55%', left: '85%' },
    hospitals: ['Brindisi Perrino'],
    airport: 'Brindisi BDS',
    ferryRoutes: 'Greece',
    trains: 'Southbound to Lecce',
    coastAccess: 'Torre Guaceto 20 mins'
  },
  {
    name: 'Lecce',
    position: { top: '70%', left: '75%' },
    hospitals: ['Lecce Vito Fazzi'],
    airport: '35–40 mins to BDS',
    trains: 'Local lines into Salento',
    coastAccess: 'Otranto 30 mins; Gallipoli 35 mins'
  },
  {
    name: 'Taranto',
    position: { top: '45%', left: '35%' },
    hospitals: ['Santissima Annunziata'],
    airport: 'Bari or Brindisi (1h10+)',
    trains: 'Good regional connections',
    coastAccess: 'Marina di Pulsano 20–25 mins'
  }
];

export const PugliaCityReachMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  return (
    <div className="my-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-foreground mb-4 text-center">
          Choose a City — See Your Reach
        </h3>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
          Click on any major city to explore what's accessible from that base point
        </p>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-8 items-start">
          {/* Map Area */}
          <div className="relative bg-muted/30 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <div className="absolute inset-0 p-8">
              <div className="relative w-full h-full">
                {cities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => setSelectedCity(city)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                      selectedCity?.name === city.name ? 'scale-125' : 'hover:scale-110'
                    }`}
                    style={{ top: city.position.top, left: city.position.left }}
                  >
                    <div className={`relative ${
                      selectedCity?.name === city.name ? 'animate-pulse' : ''
                    }`}>
                      <MapPin
                        className={`w-8 h-8 transition-colors ${
                          selectedCity?.name === city.name
                            ? 'text-primary fill-primary'
                            : 'text-muted-foreground fill-background group-hover:text-primary group-hover:fill-primary'
                        }`}
                      />
                      <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-foreground bg-background/90 px-2 py-1 rounded shadow-sm">
                        {city.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className={`transition-all duration-300 ${selectedCity ? 'opacity-100' : 'opacity-50'}`}>
            {selectedCity ? (
              <div className="bg-card border border-border rounded-lg p-6 space-y-6 animate-fade-in">
                <div className="border-b border-border pb-4">
                  <h4 className="text-2xl font-bold text-foreground">{selectedCity.name}</h4>
                  <p className="text-sm text-muted-foreground">Your base in Puglia</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Building2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Hospitals</p>
                      <p className="text-sm text-muted-foreground">{selectedCity.hospitals.join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Plane className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Airport</p>
                      <p className="text-sm text-muted-foreground">{selectedCity.airport}</p>
                    </div>
                  </div>

                  {selectedCity.ferryRoutes && (
                    <div className="flex gap-3">
                      <Ship className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Ferry Routes</p>
                        <p className="text-sm text-muted-foreground">{selectedCity.ferryRoutes}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Train className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Trains</p>
                      <p className="text-sm text-muted-foreground">{selectedCity.trains}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Coast Access</p>
                      <p className="text-sm text-muted-foreground">{selectedCity.coastAccess}</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCity(null)}
                  className="w-full"
                >
                  Clear Selection
                </Button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-muted-foreground">Select a city on the map to explore its connections</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
