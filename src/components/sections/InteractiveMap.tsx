import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

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

    mapInstance.current = map;

    return () => {
      map.remove();
    };
  }, []);

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
          
          <div 
            ref={mapRef}
            className="w-full h-[500px] md:h-[600px] rounded-lg shadow-soft overflow-hidden"
          />
        </div>
      </div>
    </section>
  );
}
