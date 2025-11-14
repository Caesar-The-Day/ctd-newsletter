import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Plane, Train, Ship, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix Leaflet's default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    console.log('Initializing PugliaCityReachMap...');

    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    console.log('MapTiler API key available:', !!apiKey);
    
    if (!apiKey) {
      console.error('MapTiler API key not found');
      setError('Map configuration error');
      setIsLoading(false);
      return;
    }

    try {
      // Initialize map centered on Puglia
      const map = L.map(mapRef.current, {
        center: [40.8, 17.0],
        zoom: 8,
        scrollWheelZoom: false,
        zoomControl: true
      });

      console.log('Map instance created');

      // Add MapTiler tile layer
      L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`, {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '© MapTiler © OpenStreetMap contributors',
        crossOrigin: true
      }).addTo(map);

      console.log('Tile layer added');

      // Add city markers with simple HTML icons
      cities.forEach(city => {
        const customIcon = L.divIcon({
          html: `
            <div class="city-marker-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div class="city-marker-label">${city.name}</div>
            </div>
          `,
          className: 'custom-city-marker',
          iconSize: [32, 42],
          iconAnchor: [16, 42]
        });

        const marker = L.marker(city.coords, { icon: customIcon })
          .addTo(map)
          .on('click', () => {
            console.log('City clicked:', city.name);
            setSelectedCity(city);
          });

        markersRef.current[city.name] = marker;
      });

      console.log('Markers added:', Object.keys(markersRef.current));

      mapInstance.current = map;

      // Force map to recalculate size after render
      setTimeout(() => {
        map.invalidateSize();
        console.log('Map size invalidated');
        setIsLoading(false);
      }, 100);

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update marker styles when selection changes
  useEffect(() => {
    if (!selectedCity) return;

    Object.entries(markersRef.current).forEach(([cityName, marker]) => {
      const isSelected = cityName === selectedCity.name;
      const city = cities.find(c => c.name === cityName);
      if (!city) return;

      const customIcon = L.divIcon({
        html: `
          <div class="city-marker-wrapper ${isSelected ? 'selected' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <div class="city-marker-label">${city.name}</div>
          </div>
        `,
        className: 'custom-city-marker',
        iconSize: [32, 42],
        iconAnchor: [16, 42]
      });

      marker.setIcon(customIcon);
    });
  }, [selectedCity]);

  if (error) {
    return (
      <div className="my-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="relative bg-muted/30 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
            <div ref={mapRef} className="w-full h-full relative z-0" />
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
        .custom-city-marker {
          background: transparent !important;
          border: none !important;
        }

        .city-marker-wrapper {
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .city-marker-wrapper:hover {
          transform: scale(1.15);
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        }

        .city-marker-wrapper.selected {
          animation: markerPulse 2s ease-in-out infinite;
        }

        .city-marker-label {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 1px solid hsl(var(--border));
        }

        @keyframes markerPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
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

        /* Ensure Leaflet map renders properly */
        .leaflet-container {
          background: hsl(var(--muted));
          z-index: 0;
        }

        .leaflet-tile-pane {
          z-index: 1;
        }

        .leaflet-marker-pane {
          z-index: 600;
        }
      `}</style>
    </div>
  );
};
