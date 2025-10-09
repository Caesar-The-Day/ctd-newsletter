import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Component to fit bounds on mount
function FitBounds() {
  const map = useMap();
  
  useEffect(() => {
    // Piemonte bounding box - SW and NE corners
    map.fitBounds([
      [44.0625, 6.6267],
      [46.5520, 9.0981]
    ]);
  }, [map]);
  
  return null;
}

export function InteractiveMap() {
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

  const tileUrl = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`;

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
          
          <div className="w-full h-[500px] md:h-[600px] rounded-lg shadow-soft overflow-hidden">
            <MapContainer
              center={[45.07, 7.88]}
              zoom={7.2}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer url={tileUrl} />
              <FitBounds />
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
