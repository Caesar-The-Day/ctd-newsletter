import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Wine, Mountain, Globe, Anchor, Landmark, Train, Waves, Plane } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { Button } from '@/components/ui/button';

interface MapMarker {
  id: string;
  name: string;
  coords: [number, number];
  photo: string;
  blurb: string;
  railTime?: string | null;
  isHub?: boolean;
  isOlympic?: boolean;
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
  Train,
  Waves,
  Globe,
  Plane,
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

    // Add city/town markers with special styling for hubs and Olympic cities
    mapData.markers.forEach(marker => {
      const isPortCity = ['Bari', 'Brindisi', 'Otranto'].includes(marker.name);
      const isHub = (marker as any).isHub;
      const isOlympic = (marker as any).isOlympic;
      const railTime = (marker as any).railTime;
      
      let markerHtml = '';
      
      if (isOlympic) {
        // Olympic rings marker for Cortina - name always visible
        markerHtml = `
          <div class="city-marker group cursor-pointer olympic-city">
            <div class="marker-icon transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-lg">
              <div class="olympic-rings">
                <svg width="32" height="20" viewBox="0 0 100 60">
                  <circle cx="20" cy="20" r="12" fill="none" stroke="#0085C7" stroke-width="3"/>
                  <circle cx="50" cy="20" r="12" fill="none" stroke="#000000" stroke-width="3"/>
                  <circle cx="80" cy="20" r="12" fill="none" stroke="#DF0024" stroke-width="3"/>
                  <circle cx="35" cy="35" r="12" fill="none" stroke="#F4C300" stroke-width="3"/>
                  <circle cx="65" cy="35" r="12" fill="none" stroke="#009F3D" stroke-width="3"/>
                </svg>
              </div>
            </div>
            <div class="marker-label text-xs font-semibold text-foreground bg-background/95 px-2 py-1 rounded shadow-md whitespace-nowrap mt-1">
              ${marker.name}
            </div>
          </div>
        `;
      } else if (isHub) {
        // Hub marker (Milan) with larger styling
        const iconHtml = renderToString(<MapPin className="w-8 h-8 text-primary" strokeWidth={2.5} />);
        markerHtml = `
          <div class="city-marker group cursor-pointer hub-city">
            <div class="marker-icon transition-all duration-200 group-hover:scale-125 group-hover:drop-shadow-lg hub-glow">
              ${iconHtml}
            </div>
            <div class="marker-label text-sm font-bold text-foreground bg-background/95 px-3 py-1.5 rounded shadow-md whitespace-nowrap mt-1">
              ${marker.name}
            </div>
          </div>
        `;
      } else {
        const iconHtml = renderToString(<MapPin className="w-6 h-6 text-primary" strokeWidth={2.5} />);
        markerHtml = `
          <div class="city-marker group cursor-pointer ${isPortCity ? 'port-city' : ''}">
            <div class="marker-icon transition-all duration-200 group-hover:scale-125 group-hover:drop-shadow-lg">
              ${iconHtml}
            </div>
            <div class="marker-label text-xs font-semibold text-foreground bg-background/90 px-2 py-1 rounded shadow-sm whitespace-nowrap mt-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              ${marker.name}
            </div>
          </div>
        `;
      }
      
      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker',
        iconSize: isHub ? [40, 40] : [32, 32],
        iconAnchor: isHub ? [20, 40] : [16, 32]
      });
      
      const markerInstance = L.marker(marker.coords, { icon: customIcon }).addTo(map);

      const popupContent = `
        <div class="city-popup">
          <img src="${marker.photo}" alt="${marker.name}" class="popup-image" />
          <div class="popup-content">
            <h3 class="font-bold text-base mb-2 text-foreground">${marker.name}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">${marker.blurb}</p>
            ${railTime ? `<p class="text-xs font-medium text-primary mt-2">🚄 ${railTime}</p>` : ''}
            ${isOlympic ? `<p class="text-xs font-medium text-blue-600 mt-2">🏅 Milano-Cortina 2026 Olympic Venue</p>` : ''}
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
            const polygon = L.polygon(feature.coords, {
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
            const polyline = L.polyline(feature.coords, {
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
            // Ferry routes (animated dashed lines with enhanced visibility)
            const ferryLine = L.polyline(feature.coords, {
              color: '#3b82f6',
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 10',
              className: 'ferry-route-animated'
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
            const historicLine = L.polyline(feature.coords, {
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

            const specialMarker = L.marker(feature.coords, {
              icon: specialIcon
            }).addTo(layerGroup);

            const popupContent = `
              <div class="zone-popup special-site-popup">
                ${feature.photo ? `<img src="${feature.photo}" alt="${feature.name}" class="popup-image" />` : ''}
                <div class="popup-content">
                  <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                  <p class="text-sm italic text-muted-foreground leading-relaxed">${feature.timeCapsule}</p>
                  ${feature.website ? `
                    <a 
                      href="${feature.website}" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="inline-block mt-3 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
                    >
                      Visit Website →
                    </a>
                  ` : ''}
                </div>
              </div>
            `;
            
            specialMarker.bindPopup(popupContent, {
              className: 'custom-popup',
              maxWidth: 300,
              closeButton: true
            });
          } else if (feature.type === 'gravity-center') {
            // Economic gravity center (Milan)
            const gravityIcon = L.divIcon({
              html: `
                <div class="gravity-center">
                  <div class="gravity-pulse"></div>
                  <div class="gravity-core"></div>
                </div>
              `,
              className: 'custom-gravity-marker',
              iconSize: [60, 60],
              iconAnchor: [30, 30]
            });

            const gravityMarker = L.marker(feature.coords, { icon: gravityIcon }).addTo(layerGroup);
            gravityMarker.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'gravity-node') {
            // Secondary economic node
            const nodeIcon = L.divIcon({
              html: `<div class="gravity-node"></div>`,
              className: 'custom-gravity-node',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            const nodeMarker = L.marker(feature.coords, { icon: nodeIcon }).addTo(layerGroup);
            nodeMarker.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'gravity-line') {
            // Economic corridor lines
            const gravityLine = L.polyline(feature.coords, {
              color: feature.color || '#8b5cf6',
              weight: 4,
              opacity: 0.6,
              dashArray: '8, 4'
            }).addTo(layerGroup);

            gravityLine.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'rail-hs') {
            // High-speed rail lines
            const railLine = L.polyline(feature.coords, {
              color: feature.color || '#ef4444',
              weight: 5,
              opacity: 0.8,
              className: 'rail-animated'
            }).addTo(layerGroup);

            railLine.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">🚄 ${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'highway') {
            // Highway routes
            const highwayLine = L.polyline(feature.coords, {
              color: feature.color || '#f97316',
              weight: 4,
              opacity: 0.7
            }).addTo(layerGroup);

            highwayLine.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">🛣️ ${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'airport') {
            // Airport markers
            const planeIconHtml = renderToString(<Plane className="w-5 h-5 text-blue-600" />);
            const airportIcon = L.divIcon({
              html: `
                <div class="airport-marker">
                  <div class="airport-icon">${planeIconHtml}</div>
                  <div class="airport-code">${feature.code}</div>
                </div>
              `,
              className: 'custom-airport-marker',
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            });

            const airportMarker = L.marker(feature.coords, { icon: airportIcon }).addTo(layerGroup);
            airportMarker.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">✈️ ${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'lake') {
            // Lake areas with shape polygons
            if (feature.shape) {
              const lakePolygon = L.polygon(feature.shape, {
                fillColor: feature.color || '#3b82f6',
                fillOpacity: 0.3,
                color: feature.color || '#3b82f6',
                weight: 2,
                opacity: 0.7
              }).addTo(layerGroup);

              const popInfo = feature.winterPop && feature.summerPop 
                ? `<p class="text-xs mt-2"><span class="font-medium">Winter:</span> ${feature.winterPop} | <span class="font-medium">Summer:</span> ${feature.summerPop}</p>`
                : '';
              const townsInfo = feature.nearbyTowns?.length 
                ? `<p class="text-xs mt-2 text-primary">${feature.nearbyTowns.join(' • ')}</p>`
                : '';

              lakePolygon.bindPopup(`
                <div class="zone-popup">
                  <h3 class="font-bold text-base mb-2 text-foreground">🏞️ ${feature.name}</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
                  ${popInfo}
                  ${townsInfo}
                </div>
              `, { className: 'custom-popup', maxWidth: 320 });

              lakePolygon.on('mouseover', function() { this.setStyle({ fillOpacity: 0.5 }); });
              lakePolygon.on('mouseout', function() { this.setStyle({ fillOpacity: 0.3 }); });
            }
          } else if (feature.type === 'border-crossing') {
            // Border crossing markers
            const borderIcon = L.divIcon({
              html: `
                <div class="border-crossing-marker">
                  <div class="border-icon">🇨🇭</div>
                </div>
              `,
              className: 'custom-border-marker',
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });

            const borderMarker = L.marker(feature.coords, { icon: borderIcon }).addTo(layerGroup);
            borderMarker.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-xs text-primary font-medium mb-2">→ ${feature.destination}</p>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'cross-border-route') {
            // Cross-border rail/road routes
            const borderRoute = L.polyline(feature.coords, {
              color: feature.color || '#dc2626',
              weight: 3,
              opacity: 0.7,
              dashArray: '12, 6'
            }).addTo(layerGroup);

            borderRoute.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'point') {
            // Point of interest marker (parks, natural features)
            const pointIcon = L.divIcon({
              html: `
                <div class="point-marker">
                  <div class="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>
              `,
              className: 'custom-point-marker',
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            });

            const pointMarker = L.marker(feature.coords, { icon: pointIcon }).addTo(layerGroup);
            pointMarker.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">🌲 ${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'heritage') {
            // UNESCO Heritage site marker with gold styling
            const heritageIcon = L.divIcon({
              html: `
                <div class="heritage-marker">
                  <div class="heritage-ring"></div>
                  <div class="heritage-core"></div>
                </div>
              `,
              className: 'custom-heritage-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            const heritageMarker = L.marker(feature.coords, { icon: heritageIcon }).addTo(layerGroup);
            heritageMarker.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">🏛️ ${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'hospital') {
            // Hospital/medical facility marker
            const hospitalIcon = L.divIcon({
              html: `
                <div class="hospital-marker">
                  <div class="hospital-icon">🏥</div>
                </div>
              `,
              className: 'custom-hospital-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            const hospitalMarker = L.marker(feature.coords, { icon: hospitalIcon }).addTo(layerGroup);
            hospitalMarker.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">🏥 ${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
          } else if (feature.type === 'rail') {
            // Regional rail corridor
            const railLine = L.polyline(feature.coords, {
              color: feature.color || '#3b82f6',
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 5'
            }).addTo(layerGroup);

            railLine.bindPopup(`
              <div class="zone-popup">
                <h3 class="font-bold text-base mb-2 text-foreground">🚆 ${feature.name}</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">${feature.description}</p>
              </div>
            `, { className: 'custom-popup', maxWidth: 300 });
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

        .special-site-popup {
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .special-site-popup .popup-content {
          padding: 12px;
        }

        .special-site-popup .popup-content a {
          color: #ffffff !important;
          text-decoration: none;
        }

        .special-site-popup .popup-content a:hover {
          color: #ffffff !important;
          opacity: 0.9;
        }

        @keyframes dash-flow {
          to {
            stroke-dashoffset: -20;
          }
        }

        @keyframes port-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px hsl(var(--primary) / 0);
          }
        }

        .ferry-route-animated {
          animation: dash-flow 1s linear infinite;
        }

        .port-city .marker-icon {
          position: relative;
        }

        .port-city .marker-icon::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          animation: port-pulse 2s ease-out infinite;
        }

        .popup-image {
          width: 100%;
          height: 140px;
          object-fit: cover;
          background: hsl(var(--muted));
        }

        /* Hub city glow effect */
        .hub-city .hub-glow {
          filter: drop-shadow(0 0 8px hsl(var(--primary) / 0.5));
        }

        /* Olympic rings marker */
        .olympic-city .olympic-rings {
          background: white;
          border-radius: 4px;
          padding: 2px 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        /* Economic gravity markers */
        .gravity-center {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gravity-pulse {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: hsl(var(--primary) / 0.15);
          animation: gravity-pulse 2s ease-out infinite;
        }

        .gravity-core {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: hsl(var(--primary));
          box-shadow: 0 0 12px hsl(var(--primary) / 0.6);
          z-index: 1;
        }

        @keyframes gravity-pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .gravity-node {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: hsl(var(--primary) / 0.7);
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        /* Airport markers */
        .airport-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: white;
          border-radius: 6px;
          padding: 4px 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .airport-code {
          font-size: 9px;
          font-weight: bold;
          color: #1e40af;
        }

        /* Border crossing markers */
        .border-crossing-marker {
          background: white;
          border-radius: 50%;
          padding: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          font-size: 16px;
        }

        /* Rail line animation */
        .rail-animated {
          stroke-linecap: round;
        }

        /* Heritage/UNESCO markers */
        .heritage-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .heritage-ring {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #f59e0b;
          animation: heritage-pulse 2s ease-out infinite;
        }

        .heritage-core {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
          z-index: 1;
        }

        @keyframes heritage-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        /* Hospital markers */
        .hospital-marker {
          background: white;
          border-radius: 6px;
          padding: 2px 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          font-size: 14px;
        }

        .hospital-marker:hover {
          transform: scale(1.1);
        }

        /* Point of interest markers */
        .point-marker {
          cursor: pointer;
          transition: transform 0.2s;
        }

        .point-marker:hover {
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
}
