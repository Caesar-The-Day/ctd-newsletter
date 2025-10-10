import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Wine, Mountain } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { Button } from '@/components/ui/button';
const cities = [{
  name: 'Turin (Torino)',
  coords: [45.0703, 7.6869] as [number, number],
  description: 'Elegant capital of the north — arcades, chocolate, and quiet grandeur.',
  image: '/images/piemonte/torino.jpg'
}, {
  name: 'Alba',
  coords: [44.7006, 8.0340] as [number, number],
  description: 'White truffle capital of Italy — Barolo in the glass, magic underground.',
  image: '/images/piemonte/alba.jpg'
}, {
  name: 'Asti',
  coords: [44.9000, 8.2050] as [number, number],
  description: 'Birthplace of spumante; think bubbles, palio horses, and perfect pace.',
  image: '/images/piemonte/asti.jpg'
}, {
  name: 'Cuneo',
  coords: [44.3833, 7.5500] as [number, number],
  description: 'Gateway to the Alps — crisp air, Barolo nearby, and real mountain calm.',
  image: '/images/piemonte/cuneo.jpg'
}, {
  name: 'Alessandria',
  coords: [44.9130, 8.6170] as [number, number],
  description: 'Junction city between Milan, Genoa, and Turin — practical and connected.',
  image: '/images/piemonte/alessandria.jpg'
}, {
  name: 'Novara',
  coords: [45.4455, 8.6179] as [number, number],
  description: 'Rice fields, risotto, and Renaissance towers — the quiet northern edge.',
  image: '/images/piemonte/novara.jpg'
}, {
  name: 'Verbania',
  coords: [45.9216, 8.5560] as [number, number],
  description: 'Overlooking Lake Maggiore — Alpine views meet Riviera charm.',
  image: '/images/piemonte/verbania.jpg'
}, {
  name: 'Orta San Giulio',
  coords: [45.8003, 8.4108] as [number, number],
  description: 'Romantic island village on Lake Orta — serenity in postcard form.',
  image: '/images/piemonte/market.jpg'
}, {
  name: 'Barolo',
  coords: [44.6103, 7.9467] as [number, number],
  description: 'Wine royalty — a village that smells like oak barrels and ambition.',
  image: '/images/piemonte/barolo.jpg'
}];
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

    // Fit to Piemonte bounds
    const bounds: L.LatLngBoundsExpression = [[44.0625, 6.6267],
    // Southwest
    [46.5520, 9.0981] // Northeast
    ];
    map.fitBounds(bounds);

    // Add city markers
    cities.forEach(city => {
      const iconHtml = renderToString(<MapPin className="w-6 h-6 text-primary" strokeWidth={2.5} />);
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
        iconAnchor: [16, 32]
      });
      const marker = L.marker(city.coords, {
        icon: customIcon
      }).addTo(map);

      // Add popup with city description
      const popupContent = `
        <div class="city-popup">
          <img src="${city.image}" alt="${city.name}" class="popup-image" />
          <div class="popup-content">
            <h3 class="font-bold text-base mb-2 text-foreground">${city.name}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">${city.description}</p>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 280,
        closeButton: true
      });
    });

    // Wine Zones GeoJSON
    const wineZonesGeoJSON = {
      type: 'FeatureCollection' as const,
      features: [{
        type: 'Feature' as const,
        properties: {
          name: 'Langhe & Roero'
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[7.8, 44.5], [8.3, 44.5], [8.3, 44.8], [7.8, 44.8], [7.8, 44.5]]]
        }
      }, {
        type: 'Feature' as const,
        properties: {
          name: 'Monferrato'
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[8.1, 44.8], [8.5, 44.8], [8.5, 45.0], [8.1, 45.0], [8.1, 44.8]]]
        }
      }]
    };

    // Natural Parks GeoJSON (approximated areas)
    const naturalParksGeoJSON = {
      type: 'FeatureCollection' as const,
      features: [{
        type: 'Feature' as const,
        properties: {
          name: 'Gran Paradiso Area'
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[7.0, 45.3], [7.4, 45.3], [7.4, 45.7], [7.0, 45.7], [7.0, 45.3]]]
        }
      }, {
        type: 'Feature' as const,
        properties: {
          name: 'Alpi Marittime Area'
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[[7.2, 44.0], [7.6, 44.0], [7.6, 44.3], [7.2, 44.3], [7.2, 44.0]]]
        }
      }]
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

          // Add hover effects
          layer.on('mouseover', function () {
            this.setStyle({
              fillOpacity: 0.5,
              weight: 3
            });
          });
          layer.on('mouseout', function () {
            this.setStyle({
              fillOpacity: 0.3,
              weight: 2
            });
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

          // Add hover effects
          layer.on('mouseover', function () {
            this.setStyle({
              fillOpacity: 0.4,
              weight: 3
            });
          });
          layer.on('mouseout', function () {
            this.setStyle({
              fillOpacity: 0.25,
              weight: 2
            });
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
    return <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">
              Where is Piemonte?
            </h2>
            <div className="prose prose-lg max-w-3xl w-full text-gray-800 leading-relaxed mb-12 mx-auto">
              <p>
                Piemonte sits quietly in Italy's northwest corner, hemmed in by France and Switzerland and
                shadowed by the Alps like a bodyguard that never sleeps. This is where the Po River begins — a
                trickle under glaciers that becomes Italy's lifeline. Turin, the capital, is both industrial heart and
                cultural brain: elegant boulevards, arcades that go on forever, and a café culture that could
                out-French the French.
              </p>

              <p>
                To the north lie Lago Maggiore and Lago d'Orta, glittering retreats with Alpine backdrops. South and
                east, the Langhe and Monferrato roll out their vineyards in cinematic slow motion — truffles beneath
                the soil, Barolo and Barbaresco in the glass. To the west, the Alps rise in jagged waves, separating
                Piemonte from France but linking it spiritually to Savoy and the Riviera beyond.
              </p>

              <h3 className="mt-8 font-semibold text-xl">Borders &amp; Access</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>West:</strong> France — cross via the Fréjus or Col de Montgenèvre tunnels, or even scenic
                  mountain passes in summer.
                </li>
                <li>
                  <strong>North:</strong> Switzerland — day-trip distance from Lake Maggiore to Locarno or Lugano.
                </li>
                <li>
                  <strong>East:</strong> Lombardy — Milan is less than 90 minutes from Turin by train.
                </li>
                <li>
                  <strong>South:</strong> Liguria — the sea's only two hours away; locals ski in the morning and eat
                  focaccia in the afternoon.
                </li>
              </ul>

              <h3 className="mt-8 font-semibold text-xl">How to Get There</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>By Car:</strong> The A4 and A21 motorways connect Turin to Milan, Genoa, and the French
                  border.
                </li>
                <li>
                  <strong>By Rail:</strong> High-speed trains link Turin directly with Milan, Florence, Rome, and Paris.
                </li>
                <li>
                  <strong>By Air:</strong> Turin Caselle Airport handles both budget and legacy carriers; Milan Malpensa
                  is the backup plan for transatlantic flights.
                </li>
                <li>
                  <strong>By Mindset:</strong> You're officially in the Italy that works — a rare, comforting sentence.
                </li>
              </ul>

              <h3 className="mt-8 font-semibold text-xl">Bottom Line</h3>
              <p>
                Piemonte is Italy's hinge between north and south — French finesse meets Italian heart. For retirees,
                it means easy access to Alps, Riviera, and Milan's airports, all without the chaos of the big cities.
              </p>

              <div className="mt-6">
                <a href="https://news.caesartheday.com/piemonte-map" target="_blank" rel="noopener noreferrer" className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 px-4 rounded-md transition">
                  Open the Interactive Map of Piemonte
                </a>
              </div>
            </div>
            
            <div className="w-full h-[500px] md:h-[600px] rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Map unavailable - API key missing</p>
            </div>
          </div>
        </div>
      </section>;
  }
  return <section className="pt-4 pb-16 md:pb-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">
            Where is Piemonte?
          </h2>
          <div className="prose prose-lg max-w-3xl w-full text-gray-800 leading-relaxed mb-12 mx-auto">
            <p>
              Piemonte sits quietly in Italy's northwest corner, hemmed in by France and Switzerland and
              shadowed by the Alps like a bodyguard that never sleeps. This is where the Po River begins — a
              trickle under glaciers that becomes Italy's lifeline. Turin, the capital, is both industrial heart and
              cultural brain: elegant boulevards, arcades that go on forever, and a café culture that could
              out-French the French.
            </p>

            <p>
              To the north lie Lago Maggiore and Lago d'Orta, glittering retreats with Alpine backdrops. South and
              east, the Langhe and Monferrato roll out their vineyards in cinematic slow motion — truffles beneath
              the soil, Barolo and Barbaresco in the glass. To the west, the Alps rise in jagged waves, separating
              Piemonte from France but linking it spiritually to Savoy and the Riviera beyond.
            </p>

            <h3 className="mt-8 font-semibold text-xl">Borders &amp; Access</h3>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>
                <strong>West:</strong> France — cross via the Fréjus or Col de Montgenèvre tunnels, or even scenic
                mountain passes in summer.
              </li>
              <li>
                <strong>North:</strong> Switzerland — day-trip distance from Lake Maggiore to Locarno or Lugano.
              </li>
              <li>
                <strong>East:</strong> Lombardy — Milan is less than 90 minutes from Turin by train.
              </li>
              <li>
                <strong>South:</strong> Liguria — the sea's only two hours away; locals ski in the morning and eat
                focaccia in the afternoon.
              </li>
            </ul>

            <h3 className="mt-8 font-semibold text-xl">How to Get There</h3>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>
                <strong>By Car:</strong> The A4 and A21 motorways connect Turin to Milan, Genoa, and the French
                border.
              </li>
              <li>
                <strong>By Rail:</strong> High-speed trains link Turin directly with Milan, Florence, Rome, and Paris.
              </li>
              <li>
                <strong>By Air:</strong> Turin Caselle Airport handles both budget and legacy carriers; Milan Malpensa
                is the backup plan for transatlantic flights.
              </li>
              <li>
                <strong>By Mindset:</strong> You're officially in the Italy that works — a rare, comforting sentence.
              </li>
            </ul>

            <h3 className="mt-8 font-semibold text-xl">Bottom Line</h3>
            <p>
              Piemonte is Italy's hinge between north and south — French finesse meets Italian heart. For retirees,
              it means easy access to Alps, Riviera, and Milan's airports, all without the chaos of the big cities.
            </p>

            <div className="mt-6">
              
            </div>
          </div>

          {/* Layer Toggle Controls */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button variant={showWineZones ? "default" : "outline"} size="sm" onClick={() => setShowWineZones(!showWineZones)} className="gap-2">
              <Wine className="w-4 h-4" />
              Wine Zones
            </Button>
            <Button variant={showNaturalParks ? "default" : "outline"} size="sm" onClick={() => setShowNaturalParks(!showNaturalParks)} className="gap-2">
              <Mountain className="w-4 h-4" />
              Natural Parks
            </Button>
          </div>
          
          <div ref={mapRef} className="w-full h-[500px] md:h-[600px] rounded-lg shadow-soft overflow-hidden" />
          
          <style>{`
            .city-marker {
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;
            }
            .marker-icon {
              filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            }
            .marker-label {
              position: absolute;
              top: 100%;
              z-index: 1000;
              pointer-events: none;
            }
            .custom-marker {
              background: transparent !important;
              border: none !important;
            }
            .leaflet-popup-content-wrapper {
              border-radius: 8px;
              overflow: hidden;
            }
            .city-popup {
              width: 260px;
            }
            .popup-image {
              width: 100%;
              height: 140px;
              object-fit: cover;
              margin: -16px -20px 12px -20px;
            }
            .popup-content {
              padding: 0 4px;
            }
            .zone-popup {
              padding: 8px;
            }
            .leaflet-popup-close-button {
              top: 8px !important;
              right: 8px !important;
              font-size: 24px !important;
              padding: 0 !important;
              width: 24px !important;
              height: 24px !important;
              line-height: 24px !important;
              text-align: center !important;
            }
          `}</style>
        </div>
      </div>
    </section>;
}