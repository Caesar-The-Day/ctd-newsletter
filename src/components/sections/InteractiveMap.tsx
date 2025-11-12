import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Wine, Mountain, Globe, Anchor, Landmark } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { Button } from '@/components/ui/button';

interface MapMarker {
  id: string;
  name: string;
  coords: [number, number];
  photo: string;
  blurb: string;
}

interface MapOverlay {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: any[];
}

interface MapData {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  overlays?: MapOverlay[];
  externalMapUrl?: string;
}

interface InteractiveMapProps {
  regionTitle?: string;
  whereData?: {
    map: MapData;
    tabs: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  };
}

const iconMap: Record<string, any> = {
  Wine,
  Mountain,
  Anchor,
  Landmark,
};

export function InteractiveMap({ regionTitle = "Piemonte", whereData }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const overlayLayersRef = useRef<Record<string, L.LayerGroup>>({}); 
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set());

  const mapData = whereData?.map;

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !mapData) return;
    
    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    if (!apiKey) {
      console.error('MapTiler API key not found');
      return;
    }

    // Initialize map with region configuration
    const map = L.map(mapRef.current, {
      center: mapData.center,
      zoom: mapData.zoom,
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

    // Add city/town markers
    mapData.markers.forEach(marker => {
      const iconHtml = renderToString(<MapPin className="w-6 h-6 text-primary" strokeWidth={2.5} />);
      const customIcon = L.divIcon({
        html: `
          <div class="city-marker group cursor-pointer">
            <div class="marker-icon transition-all duration-200 group-hover:scale-125 group-hover:drop-shadow-lg">
              ${iconHtml}
            </div>
            <div class="marker-label text-xs font-semibold text-foreground bg-background/90 px-2 py-1 rounded shadow-sm whitespace-nowrap mt-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              ${marker.name}
            </div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      
      const markerInstance = L.marker(marker.coords, { icon: customIcon }).addTo(map);

      const popupContent = `
        <div class="city-popup">
          <img src="${marker.photo}" alt="${marker.name}" class="popup-image" />
          <div class="popup-content">
            <h3 class="font-bold text-base mb-2 text-foreground">${marker.name}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">${marker.blurb}</p>
          </div>
        </div>
      `;
      
      markerInstance.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 280,
        closeButton: true
      });
    });

    // Create overlay layers
    if (mapData.overlays) {
      mapData.overlays.forEach(overlay => {
        const layerGroup = L.layerGroup();
        
        overlay.features.forEach(feature => {
          if (feature.type === 'zone') {
            // Polygon zones (wine regions, olive oil areas)
            const polygon = L.polygon(feature.coords.map((c: number[]) => [c[1], c[0]]), {
              fillColor: feature.color,
              fillOpacity: 0.25,
              color: feature.color,
              weight: 2,
              opacity: 0.6
            }).addTo(layerGroup);

            const popupContent = `
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `;
            
            polygon.bindPopup(popupContent, {
              className: 'custom-popup',
              maxWidth: 300,
              closeButton: true
            });

            polygon.on('mouseover', function () {
              this.setStyle({ fillOpacity: 0.4, weight: 3 });
            });
            polygon.on('mouseout', function () {
              this.setStyle({ fillOpacity: 0.25, weight: 2 });
            });
          } else if (feature.type === 'line') {
            // Coastlines and historic routes
            const polyline = L.polyline(feature.coords.map((c: number[]) => [c[1], c[0]]), {
              color: feature.color,
              weight: 3,
              opacity: 0.7
            }).addTo(layerGroup);

            const popupContent = `
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `;
            
            polyline.bindPopup(popupContent, {
              className: 'custom-popup',
              maxWidth: 300,
              closeButton: true
            });
          } else if (feature.type === 'ferry') {
            // Ferry routes (dashed lines)
            const ferryLine = L.polyline(feature.coords.map((c: number[]) => [c[1], c[0]]), {
              color: '#3b82f6',
              weight: 2,
              opacity: 0.6,
              dashArray: '10, 10'
            }).addTo(layerGroup);

            const popupContent = `
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `;
            
            ferryLine.bindPopup(popupContent, {
              className: 'custom-popup',
              maxWidth: 300,
              closeButton: true
            });
          } else if (feature.type === 'historic') {
            // Historic routes
            const historicLine = L.polyline(feature.coords.map((c: number[]) => [c[1], c[0]]), {
              color: feature.color,
              weight: 3,
              opacity: 0.6,
              dashArray: '5, 5'
            }).addTo(layerGroup);

            const popupContent = `
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `;
            
            historicLine.bindPopup(popupContent, {
              className: 'custom-popup',
              maxWidth: 300,
              closeButton: true
            });
          } else if (feature.type === 'marker') {
            // Special markers (UNESCO sites, underground locations)
            const specialIcon = L.divIcon({
              html: `
                <div class="special-marker">
                  <div class="w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg"></div>
                </div>
              `,
              className: 'custom-special-marker',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });

            const specialMarker = L.marker([feature.coords[1], feature.coords[0]], {
              icon: specialIcon
            }).addTo(layerGroup);

            const popupContent = `
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-sm italic text-muted-foreground leading-relaxed">${feature.timeCapsule}</p>
              </div>
            `;
            
            specialMarker.bindPopup(popupContent, {
              className: 'custom-popup',
              maxWidth: 300,
              closeButton: true
            });
          }
        });

        overlayLayersRef.current[overlay.id] = layerGroup;
      });
    }

    mapInstance.current = map;

    return () => {
      map.remove();
    };
  }, [mapData]);

  // Toggle overlay visibility
  useEffect(() => {
    if (!mapInstance.current) return;

    Object.entries(overlayLayersRef.current).forEach(([overlayId, layer]) => {
      if (activeOverlays.has(overlayId)) {
        layer.addTo(mapInstance.current!);
      } else {
        layer.remove();
      }
    });
  }, [activeOverlays]);

  const toggleOverlay = (overlayId: string) => {
    setActiveOverlays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(overlayId)) {
        newSet.delete(overlayId);
      } else {
        newSet.add(overlayId);
      }
      return newSet;
    });
  };

  const apiKey = import.meta.env.VITE_MAPTILER_KEY;
  
  if (!apiKey) {
    return (
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-4">
              <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Where is {regionTitle}?
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-3xl w-full text-gray-800 leading-relaxed mb-12 mx-auto">
              {whereData?.tabs.map((tab, index) => (
                <div key={tab.id}>
                  {tab.content.split('\n\n').map((paragraph, pIndex) => {
                    const headerMatch = paragraph.match(/^([^:\n]+:)/);
                    if (headerMatch) {
                      const header = headerMatch[1];
                      const rest = paragraph.slice(header.length).trim();
                      return (
                        <p key={pIndex} className="mb-4 whitespace-pre-line">
                          <strong>{header}</strong> {rest}
                        </p>
                      );
                    }
                    return (
                      <p key={pIndex} className="mb-4 whitespace-pre-line">
                        {paragraph}
                      </p>
                    );
                  })}
                  {index < whereData.tabs.length - 1 && <div className="my-6" />}
                </div>
              ))}

              <div className="mt-6">
                <a 
                  href={mapData?.externalMapUrl || `https://maps.google.com/?q=${regionTitle}+Italy`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Open the Interactive Map of {regionTitle}
                </a>
              </div>
            </div>
            
            <div className="w-full h-[500px] md:h-[600px] rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Map unavailable - API key missing</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-16 md:pb-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Where is {regionTitle}?
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-3xl w-full text-gray-800 leading-relaxed mb-12 mx-auto">
            {whereData?.tabs.map((tab, index) => (
              <div key={tab.id}>
                {tab.content.split('\n\n').map((paragraph, pIndex) => {
                  const headerMatch = paragraph.match(/^([^:\n]+:)/);
                  if (headerMatch) {
                    const header = headerMatch[1];
                    const rest = paragraph.slice(header.length).trim();
                    return (
                      <p key={pIndex} className="mb-4 whitespace-pre-line">
                        <strong>{header}</strong> {rest}
                      </p>
                    );
                  }
                  return (
                    <p key={pIndex} className="mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })}
                {index < whereData.tabs.length - 1 && <div className="my-6" />}
              </div>
            ))}
          </div>

          {/* Overlay Toggle Controls */}
          {mapData?.overlays && mapData.overlays.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {mapData.overlays.map(overlay => {
                const IconComponent = iconMap[overlay.icon] || Wine;
                return (
                  <Button
                    key={overlay.id}
                    variant={activeOverlays.has(overlay.id) ? "default" : "secondary"}
                    size="sm"
                    onClick={() => toggleOverlay(overlay.id)}
                    className="gap-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    {overlay.name}
                  </Button>
                );
              })}
            </div>
          )}
          
          <div ref={mapRef} className="w-full h-[500px] md:h-[600px] rounded-lg shadow-soft overflow-hidden" />
        </div>
      </div>

      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }

        .city-popup {
          display: flex;
          flex-direction: column;
        }

        .popup-image {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }

        .popup-content {
          padding: 12px;
        }

        .zone-popup {
          padding: 12px;
        }

        .city-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .special-marker {
          cursor: pointer;
          transition: all 0.2s;
        }

        .special-marker:hover {
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
}
