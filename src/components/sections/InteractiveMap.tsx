import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Wine, Mountain } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { Button } from '@/components/ui/button';

const cities = [
  { name: 'Turin (Torino)', coords: [45.0703, 7.6869] as [number, number], description: 'Elegant capital of the north — arcades, chocolate, and quiet grandeur.' },
  { name: 'Alba', coords: [44.7006, 8.0340] as [number, number], description: 'White truffle capital of Italy — Barolo in the glass, magic underground.' },
  { name: 'Asti', coords: [44.9000, 8.2050] as [number, number], description: 'Birthplace of spumante; think bubbles, palio horses, and perfect pace.' },
  { name: 'Cuneo', coords: [44.3833, 7.5500] as [number, number], description: 'Gateway to the Alps — crisp air, Barolo nearby, and real mountain calm.' },
  { name: 'Alessandria', coords: [44.9130, 8.6170] as [number, number], description: 'Junction city between Milan, Genoa, and Turin — practical and connected.' },
  { name: 'Novara', coords: [45.4455, 8.6179] as [number, number], description: 'Rice fields, risotto, and Renaissance towers — the quiet northern edge.' },
  { name: 'Verbania', coords: [45.9216, 8.5560] as [number, number], description: 'Overlooking Lake Maggiore — Alpine views meet Riviera charm.' },
  { name: 'Orta San Giulio', coords: [45.8003, 8.4108] as [number, number], description: 'Romantic island village on Lake Orta — serenity in postcard form.' },
  { name: 'Barolo', coords: [44.6103, 7.9467] as [number, number], description: 'Wine royalty — a village that smells like oak barrels and ambition.' },
];

export function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const wineLayerRef = useRef<L.GeoJSON | null>(null);
  const parksLayerRef = useRef<L.GeoJSON | null>(null);
  const [showWineZones, setShowWineZones] = useState(false);
  const [showNaturalParks, setShowNaturalParks] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    
    if (!apiKey) {
      console.error('MapTiler API key not found');
      return;
    }

    // Initialize map with Piemonte configuration
    const map = L.map(mapRef.current, {
      center: [45.07, 7.88],
      zoom: 7.2,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    // Add MapTiler tile layer
    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '© MapTiler © OpenStreetMap contributors',
        crossOrigin: true,
      }
    ).addTo(map);

    // Fit to Piemonte bounds
    const bounds: L.LatLngBoundsExpression = [
      [44.0625, 6.6267], // Southwest
      [46.5520, 9.0981]  // Northeast
    ];
    map.fitBounds(bounds);

    // Add city markers
    cities.forEach((city) => {
      const iconHtml = renderToString(
        <MapPin className="w-6 h-6 text-primary" strokeWidth={2.5} />
      );

      const customIcon = L.divIcon({
        html: `
          <div class="city-marker group cursor-pointer">
            <div class="marker-icon transition-all duration-200 group-hover:scale-125 group-hover:drop-shadow-lg">
              ${iconHtml}
            </div>
            <div class="marker-label text-xs font-semibold text-foreground bg-background/90 px-2 py-1 rounded shadow-sm whitespace-nowrap mt-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              ${city.name}
            </div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker(city.coords, { icon: customIcon }).addTo(map);
      
      // Add popup with city description
      const popupContent = `
        <div class="city-popup">
          <h3 class="font-bold text-base mb-2 text-foreground">${city.name}</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">${city.description}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 280,
        closeButton: true,
      });
    });

    // Wine Zones GeoJSON
    const wineZonesGeoJSON = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: { name: 'Langhe & Roero' },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[[7.8,44.5],[8.3,44.5],[8.3,44.8],[7.8,44.8],[7.8,44.5]]]
          }
        },
        {
          type: 'Feature' as const,
          properties: { name: 'Monferrato' },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[[8.1,44.8],[8.5,44.8],[8.5,45.0],[8.1,45.0],[8.1,44.8]]]
          }
        }
      ]
    };

    // Natural Parks GeoJSON (approximated areas)
    const naturalParksGeoJSON = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: { name: 'Gran Paradiso Area' },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[[7.0,45.3],[7.4,45.3],[7.4,45.7],[7.0,45.7],[7.0,45.3]]]
          }
        },
        {
          type: 'Feature' as const,
          properties: { name: 'Alpi Marittime Area' },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [[[7.2,44.0],[7.6,44.0],[7.6,44.3],[7.2,44.3],[7.2,44.0]]]
          }
        }
      ]
    };

    // Wine zone descriptions
    const wineDescriptions: Record<string, string> = {
      'Langhe & Roero': 'Home to Barolo and Barbaresco, the "King and Queen" of Italian wines. Rolling hills covered in Nebbiolo vines produce some of the world\'s most prestigious and age-worthy wines.',
      'Monferrato': 'Famous for Barbera and Moscato d\'Asti. This UNESCO World Heritage site is a patchwork of vineyards, medieval castles, and hilltop villages stretching across gentle hills.'
    };

    // Create wine zones layer
    wineLayerRef.current = L.geoJSON(wineZonesGeoJSON, {
      style: {
        fillColor: '#a63d40',
        fillOpacity: 0.3,
        color: '#a63d40',
        weight: 2,
        opacity: 0.6
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.name) {
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            direction: 'center',
            className: 'wine-zone-label'
          });
          
          // Add popup with description
          const description = wineDescriptions[feature.properties.name] || '';
          const popupContent = `
            <div class="zone-popup">
              <h3 class="font-bold text-base mb-2 text-foreground">${feature.properties.name}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">${description}</p>
            </div>
          `;
          layer.bindPopup(popupContent, {
            className: 'custom-popup',
            maxWidth: 300,
            closeButton: true
          });
        }
      }
    });

    // Natural park descriptions
    const parkDescriptions: Record<string, string> = {
      'Gran Paradiso Area': 'Italy\'s oldest national park, established in 1922. Alpine ibex, golden eagles, and chamois roam through dramatic peaks, glaciers, and pristine valleys at the French border.',
      'Alpi Marittime Area': 'Where the Alps meet the Mediterranean. Ancient salt routes, wolves, and rare alpine flowers thrive in this protected wilderness connecting Piemonte to the French Riviera.'
    };

    // Create natural parks layer
    parksLayerRef.current = L.geoJSON(naturalParksGeoJSON, {
      style: {
        fillColor: '#2e8b57',
        fillOpacity: 0.25,
        color: '#2e8b57',
        weight: 2,
        opacity: 0.5
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.name) {
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            direction: 'center',
            className: 'natural-park-label'
          });
          
          // Add popup with description
          const description = parkDescriptions[feature.properties.name] || '';
          const popupContent = `
            <div class="zone-popup">
              <h3 class="font-bold text-base mb-2 text-foreground">${feature.properties.name}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">${description}</p>
            </div>
          `;
          layer.bindPopup(popupContent, {
            className: 'custom-popup',
            maxWidth: 300,
            closeButton: true
          });
        }
      }
    });

    mapInstance.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Toggle wine zones layer
  useEffect(() => {
    if (!mapInstance.current || !wineLayerRef.current) return;
    
    if (showWineZones) {
      wineLayerRef.current.addTo(mapInstance.current);
    } else {
      wineLayerRef.current.remove();
    }
  }, [showWineZones]);

  // Toggle natural parks layer
  useEffect(() => {
    if (!mapInstance.current || !parksLayerRef.current) return;
    
    if (showNaturalParks) {
      parksLayerRef.current.addTo(mapInstance.current);
    } else {
      parksLayerRef.current.remove();
    }
  }, [showNaturalParks]);

  const apiKey = import.meta.env.VITE_MAPTILER_KEY;

  if (!apiKey) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">
              Where is Piemonte?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              Tucked against the Alps in northwestern Italy, Piemonte is where mountain peaks meet rolling vineyards.
            </p>
            <div className="w-full h-[500px] md:h-[600px] rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Map unavailable - API key missing</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">
            Where is Piemonte?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Tucked against the Alps in northwestern Italy, Piemonte is where mountain peaks meet rolling vineyards.
          </p>

          {/* Layer Toggle Controls */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button
              variant={showWineZones ? "default" : "outline"}
              size="sm"
              onClick={() => setShowWineZones(!showWineZones)}
              className="gap-2"
            >
              <Wine className="w-4 h-4" />
              Wine Zones
            </Button>
            <Button
              variant={showNaturalParks ? "default" : "outline"}
              size="sm"
              onClick={() => setShowNaturalParks(!showNaturalParks)}
              className="gap-2"
            >
              <Mountain className="w-4 h-4" />
              Natural Parks
            </Button>
          </div>
          
          <div 
            ref={mapRef}
            className="w-full h-[500px] md:h-[600px] rounded-lg shadow-soft overflow-hidden"
          />
          
          <style>{`
            .city-marker {
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;
            }
            .marker-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              border-radius: 50%;
              padding: 4px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
            .custom-marker {
              background: transparent !important;
              border: none !important;
            }
            
            /* Custom popup styling */
            .custom-popup .leaflet-popup-content-wrapper {
              background: hsl(var(--background));
              border: 1px solid hsl(var(--border));
              border-radius: 0.5rem;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
              padding: 0;
            }
            .custom-popup .leaflet-popup-content {
              margin: 1rem;
              font-family: inherit;
            }
            .custom-popup .leaflet-popup-tip {
              background: hsl(var(--background));
              border: 1px solid hsl(var(--border));
              border-top: none;
              border-right: none;
            }
            .custom-popup .leaflet-popup-close-button {
              color: hsl(var(--muted-foreground)) !important;
              font-size: 18px !important;
              padding: 4px 8px !important;
              width: 24px !important;
              height: 24px !important;
              top: 8px !important;
              right: 8px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .custom-popup .leaflet-popup-close-button:hover {
              color: hsl(var(--foreground)) !important;
              background: hsl(var(--accent)) !important;
              border-radius: 4px !important;
            }
            .city-popup {
              min-width: 200px;
            }
            
            /* Popup animation */
            .leaflet-popup {
              animation: popupFadeIn 0.3s ease-out;
            }
            @keyframes popupFadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            /* Wine Zone Labels */
            .wine-zone-label {
              background: rgba(255, 255, 255, 0.95) !important;
              border: 2px solid #a63d40 !important;
              color: #7a2d2f !important;
              font-weight: 600 !important;
              font-size: 13px !important;
              padding: 6px 12px !important;
              border-radius: 6px !important;
              box-shadow: 0 2px 8px rgba(166, 61, 64, 0.3) !important;
              white-space: nowrap !important;
            }
            .wine-zone-label::before {
              display: none !important;
            }
            
            /* Natural Park Labels */
            .natural-park-label {
              background: rgba(255, 255, 255, 0.95) !important;
              border: 2px solid #2e8b57 !important;
              color: #1e5a3a !important;
              font-weight: 600 !important;
              font-size: 13px !important;
              padding: 6px 12px !important;
              border-radius: 6px !important;
              box-shadow: 0 2px 8px rgba(46, 139, 87, 0.3) !important;
              white-space: nowrap !important;
            }
            .natural-park-label::before {
              display: none !important;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
