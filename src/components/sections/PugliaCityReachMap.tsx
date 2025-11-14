import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Plane, Train, Ship, Building2 } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { Button } from '@/components/ui/button';

interface CityData {
  name: string;
  coords: [number, number];
  hospitals: string[];
  airport: string;
  ferryRoutes?: string;
  trains: string;
  coastAccess: string;
}

const cities: CityData[] = [
  {
    name: 'Bari',
    coords: [41.1171, 16.8719],
    hospitals: ['Polyclinic', 'Mater Dei'],
    airport: 'Bari BRI (15–25 mins)',
    ferryRoutes: 'Greece, Albania, Croatia',
    trains: 'Fastest connections in Puglia',
    coastAccess: 'Polignano/Monopoli 30–40 mins'
  },
  {
    name: 'Brindisi',
    coords: [40.6320, 17.9419],
    hospitals: ['Brindisi Perrino'],
    airport: 'Brindisi BDS',
    ferryRoutes: 'Greece',
    trains: 'Southbound to Lecce',
    coastAccess: 'Torre Guaceto 20 mins'
  },
  {
    name: 'Lecce',
    coords: [40.3515, 18.1750],
    hospitals: ['Lecce Vito Fazzi'],
    airport: '35–40 mins to BDS',
    trains: 'Local lines into Salento',
    coastAccess: 'Otranto 30 mins; Gallipoli 35 mins'
  },
  {
    name: 'Taranto',
    coords: [40.4764, 17.2294],
    hospitals: ['Santissima Annunziata'],
    airport: 'Bari or Brindisi (1h10+)',
    trains: 'Good regional connections',
    coastAccess: 'Marina di Pulsano 20–25 mins'
  }
];

export const PugliaCityReachMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    if (!apiKey) {
      console.error('MapTiler API key not found');
      return;
    }

    // Initialize map centered on Puglia
    const map = L.map(mapRef.current, {
      center: [40.8, 17.0],
      zoom: 8,
      scrollWheelZoom: false,
      zoomControl: true
    });

    // Add MapTiler tile layer
    L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution: '© MapTiler © OpenStreetMap contributors',
      crossOrigin: true
    }).addTo(map);

    // Add city markers
    cities.forEach(city => {
      const iconHtml = renderToString(<MapPin className="w-6 h-6 text-primary" strokeWidth={2.5} />);
      const customIcon = L.divIcon({
        html: `
          <div class="city-marker-pulse group cursor-pointer">
            <div class="marker-icon transition-all duration-200 group-hover:scale-125">
              ${iconHtml}
            </div>
          </div>
        `,
        className: 'custom-city-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      const marker = L.marker(city.coords, { icon: customIcon })
        .addTo(map)
        .on('click', () => setSelectedCity(city));

      markersRef.current[city.name] = marker;
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update marker styles when selection changes
  useEffect(() => {
    if (!selectedCity) return;

    Object.entries(markersRef.current).forEach(([cityName, marker]) => {
      const isSelected = cityName === selectedCity.name;
      const city = cities.find(c => c.name === cityName);
      if (!city) return;

      const iconHtml = renderToString(<MapPin className="w-6 h-6 text-primary" strokeWidth={2.5} />);
      const customIcon = L.divIcon({
        html: `
          <div class="city-marker-pulse group cursor-pointer ${isSelected ? 'selected-marker' : ''}">
            <div class="marker-icon transition-all duration-200 group-hover:scale-125 ${isSelected ? 'scale-125' : ''}">
              ${iconHtml}
            </div>
          </div>
        `,
        className: 'custom-city-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      marker.setIcon(customIcon);
    });
  }, [selectedCity]);

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
          <div className="relative bg-muted/30 rounded-lg overflow-hidden h-[600px]">
            <div ref={mapRef} className="w-full h-full" />
          </div>

          {/* Info Panel */}
          <div className={`transition-all duration-300 ${selectedCity ? 'opacity-100' : 'opacity-50'}`}>
            {selectedCity ? (
              <div className="bg-card border border-border rounded-lg p-6 space-y-6 animate-fade-in">
                <div className="border-b border-border pb-4">
                  <h4 className="text-2xl font-bold text-foreground mb-2">{selectedCity.name}</h4>
                  <p className="text-sm text-muted-foreground">Your access hub in Puglia</p>
                </div>

                {/* Hospitals */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Building2 className="w-5 h-5" />
                    <span>Hospitals</span>
                  </div>
                  <ul className="space-y-1 pl-7">
                    {selectedCity.hospitals.map((hospital, idx) => (
                      <li key={idx} className="text-sm text-foreground">{hospital}</li>
                    ))}
                  </ul>
                </div>

                {/* Airport */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Plane className="w-5 h-5" />
                    <span>Airport</span>
                  </div>
                  <p className="text-sm text-foreground pl-7">{selectedCity.airport}</p>
                </div>

                {/* Ferry Routes */}
                {selectedCity.ferryRoutes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Ship className="w-5 h-5" />
                      <span>Ferry Routes</span>
                    </div>
                    <p className="text-sm text-foreground pl-7">{selectedCity.ferryRoutes}</p>
                  </div>
                )}

                {/* Trains */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Train className="w-5 h-5" />
                    <span>Trains</span>
                  </div>
                  <p className="text-sm text-foreground pl-7">{selectedCity.trains}</p>
                </div>

                {/* Coast Access */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <MapPin className="w-5 h-5" />
                    <span>Coast Access</span>
                  </div>
                  <p className="text-sm text-foreground pl-7">{selectedCity.coastAccess}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCity(null)}
                  className="w-full mt-4"
                >
                  Clear Selection
                </Button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Click a city on the map to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .city-marker-pulse.selected-marker .marker-icon {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .custom-city-marker {
          background: transparent !important;
          border: none !important;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
