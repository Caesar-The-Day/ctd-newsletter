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
  tagline: string;
  hospitals: string[];
  airport: string;
  ferryRoutes: string[];
  trains: string[];
  coastAccess: string[];
  notes: string[];
}

const cities: CityData[] = [
  {
    name: 'Bari',
    coords: [41.1171, 16.8719],
    tagline: "Your access hub in Puglia — the region's best-connected city",
    hospitals: [
      'Policlinico di Bari (largest teaching hospital in Southern Italy)',
      'Mater Dei Hospital (private, high-quality)'
    ],
    airport: 'Bari–Palese BRI — 15–25 minutes from most neighborhoods',
    ferryRoutes: [
      'Croatia (Dubrovnik)',
      'Albania (Durres)',
      'Greece (Patras, Igoumenitsa)'
    ],
    trains: [
      'Fastest connections in Puglia',
      'High-speed Frecce + Intercity to Rome, Bologna, Milano',
      'Airport Metro line (Ferrotramviaria)'
    ],
    coastAccess: [
      'Polignano a Mare / Monopoli — 30–40 minutes',
      'Torre a Mare — 15 minutes'
    ],
    notes: [
      'Best infrastructure in the region',
      'Excellent medical coverage',
      'Easy for visitors to fly in/out',
      'Urban lifestyle; most walkable districts are Murat, Libertà, Madonnella'
    ]
  },
  {
    name: 'Brindisi',
    coords: [40.6320, 17.9419],
    tagline: 'Compact, efficient, and perfectly placed for Salento',
    hospitals: [
      'Ospedale Antonio Perrino (main public hospital)'
    ],
    airport: 'Brindisi–Salento BDS — extremely easy and uncrowded',
    ferryRoutes: [
      'Greece (Igoumenitsa)',
      'Seasonal lines to Albania'
    ],
    trains: [
      'Northbound to Bari',
      'Southbound to Lecce',
      'Good regional coverage along the Adriatic mid-coast'
    ],
    coastAccess: [
      'Torre Guaceto Nature Reserve — 20 minutes',
      'Brindisi beaches — 10–15 minutes'
    ],
    notes: [
      'Surprisingly good for frequent flyers',
      'Easy access to countryside and beaches',
      'Compact city center with moderate walkability'
    ]
  },
  {
    name: 'Lecce',
    coords: [40.3515, 18.1750],
    tagline: "Salento's cultural capital — refined, walkable, beautifully connected",
    hospitals: [
      'Ospedale Vito Fazzi (main provincial hospital)',
      'Several private clinics in city center'
    ],
    airport: 'Brindisi BDS — 35–40 minutes (shuttle or train → bus combo)',
    ferryRoutes: [
      'Via Brindisi (35–40 minutes away)'
    ],
    trains: [
      'Regional lines across Salento',
      'Direct trains to Bari and north',
      'FSE lines to Otranto, Gallipoli, Nardò, Gagliano'
    ],
    coastAccess: [
      'Otranto — 30 minutes',
      'Gallipoli — 35–40 minutes',
      'Torre dell\'Orso — 25–30 minutes'
    ],
    notes: [
      'One of Italy\'s most walkable small cities',
      'Excellent cafes, culture, and winter livability',
      'The perfect base for exploring both Salento coasts'
    ]
  },
  {
    name: 'Taranto',
    coords: [40.4764, 17.2294],
    tagline: 'A major city with strong services and underrated coastal access',
    hospitals: [
      'Ospedale SS. Annunziata (largest public hospital)',
      'Moscati Hospital (specialty care)'
    ],
    airport: 'Bari BRI or Brindisi BDS — approx. 1h10–1h20. Military airport (Grottaglie) may become civilian in the future',
    ferryRoutes: [
      'Occasional seasonal routes; Bari/Brindisi are your real ferry hubs'
    ],
    trains: [
      'Good regional links toward Bari, Brindisi, Metaponto',
      'Direct trains to Naples (Intercity)',
      'Many daily commuter lines to the Ionian towns'
    ],
    coastAccess: [
      'Marina di Pulsano — 20–25 minutes',
      'San Pietro in Bevagna — 40 minutes',
      'Ionian Sea beaches are warmer + calmer than Adriatic side'
    ],
    notes: [
      'Big-city services at lower cost',
      'Beautiful Ionian beaches nearby',
      'Car is helpful for daily life compared to Bari/Lecce'
    ]
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
                  <p className="text-sm text-muted-foreground italic">{selectedCity.tagline}</p>
                </div>

                {/* Hospitals */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Building2 className="w-5 h-5" />
                    <span>Hospitals</span>
                  </div>
                  <ul className="space-y-1 pl-7 list-disc list-inside">
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
                {selectedCity.ferryRoutes.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Ship className="w-5 h-5" />
                      <span>Ferry Routes</span>
                    </div>
                    <ul className="space-y-1 pl-7 list-disc list-inside">
                      {selectedCity.ferryRoutes.map((route, idx) => (
                        <li key={idx} className="text-sm text-foreground">{route}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Trains */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Train className="w-5 h-5" />
                    <span>Trains</span>
                  </div>
                  <ul className="space-y-1 pl-7 list-disc list-inside">
                    {selectedCity.trains.map((train, idx) => (
                      <li key={idx} className="text-sm text-foreground">{train}</li>
                    ))}
                  </ul>
                </div>

                {/* Coast Access */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <MapPin className="w-5 h-5" />
                    <span>Coast Access</span>
                  </div>
                  <ul className="space-y-1 pl-7 list-disc list-inside">
                    {selectedCity.coastAccess.map((access, idx) => (
                      <li key={idx} className="text-sm text-foreground">{access}</li>
                    ))}
                  </ul>
                </div>

                {/* Notes for Retirees */}
                <div className="space-y-2 border-t border-border pt-4">
                  <h5 className="font-medium text-foreground">Notes for Retirees</h5>
                  <ul className="space-y-1 pl-4 list-disc list-inside">
                    {selectedCity.notes.map((note, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{note}</li>
                    ))}
                  </ul>
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
