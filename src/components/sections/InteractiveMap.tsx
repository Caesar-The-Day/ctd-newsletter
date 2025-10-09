import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Button } from '@/components/ui/button';
import { Play, Pause, Layers } from 'lucide-react';
import { RegionData } from '@/utils/getRegionData';

interface InteractiveMapProps {
  mapData: RegionData['where']['map'];
}

export function InteractiveMap({ mapData }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const markers = useRef<maptilersdk.Marker[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVineyards, setShowVineyards] = useState(true);
  const [showTerrain, setShowTerrain] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    if (!apiKey) {
      console.error('MapTiler API key not found');
      return;
    }

    maptilersdk.config.apiKey = apiKey;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: mapData.center as [number, number],
      zoom: mapData.zoom,
      pitch: mapData.pitch || 0,
      bearing: mapData.bearing || 0,
      navigationControl: true,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add markers
      mapData.markers.forEach((markerData) => {
        if (!map.current) return;

        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `
          width: 32px;
          height: 32px;
          background: hsl(var(--primary));
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        `;
        
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
          el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        });
        
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        });

        const marker = new maptilersdk.Marker({ element: el })
          .setLngLat(markerData.coords as [number, number])
          .addTo(map.current);

        // Create popup
        const popupContent = `
          <div style="min-width: 250px;">
            <img src="${markerData.photo}" alt="${markerData.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
            <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: hsl(var(--foreground));">${markerData.name}</h3>
            <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 8px;">${markerData.blurb}</p>
            ${markerData.population ? `<p style="font-size: 12px; color: hsl(var(--muted-foreground));"><strong>Population:</strong> ${markerData.population}</p>` : ''}
            ${markerData.elevation ? `<p style="font-size: 12px; color: hsl(var(--muted-foreground));"><strong>Elevation:</strong> ${markerData.elevation}</p>` : ''}
          </div>
        `;

        const popup = new maptilersdk.Popup({ offset: 25, maxWidth: '300px' })
          .setHTML(popupContent);

        marker.setPopup(popup);
        markers.current.push(marker);
      });
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [mapData]);

  const startAnimation = () => {
    if (!map.current || !mapData.animationPath || isAnimating) return;
    
    setIsAnimating(true);
    let currentStep = 0;

    const animate = () => {
      if (!map.current || !mapData.animationPath) return;
      
      const step = mapData.animationPath[currentStep];
      
      map.current.flyTo({
        center: step.center as [number, number],
        zoom: step.zoom,
        duration: step.duration,
        essential: true,
      });

      currentStep++;
      if (currentStep < mapData.animationPath.length) {
        animationFrame.current = window.setTimeout(animate, step.duration);
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  };

  const stopAnimation = () => {
    if (animationFrame.current) {
      clearTimeout(animationFrame.current);
    }
    setIsAnimating(false);
  };

  const toggleVineyards = () => {
    setShowVineyards(!showVineyards);
    // In a real implementation, this would toggle a vineyard overlay layer
  };

  const toggleTerrain = () => {
    if (!map.current) return;
    setShowTerrain(!showTerrain);
    
    if (!showTerrain) {
      map.current.setStyle(maptilersdk.MapStyle.OUTDOOR);
    } else {
      map.current.setStyle(maptilersdk.MapStyle.STREETS);
    }
  };

  return (
    <div className="relative w-full">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-[500px] md:h-[600px] rounded-lg shadow-xl overflow-hidden"
      />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        {mapData.animationPath && (
          <Button
            onClick={isAnimating ? stopAnimation : startAnimation}
            variant="secondary"
            size="sm"
            disabled={!mapLoaded}
            className="shadow-lg"
          >
            {isAnimating ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Tour
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Tour
              </>
            )}
          </Button>
        )}
      </div>

      {/* Layer Toggles */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          onClick={toggleTerrain}
          variant={showTerrain ? "default" : "outline"}
          size="sm"
          className="shadow-lg"
        >
          <Layers className="w-4 h-4 mr-2" />
          Terrain
        </Button>
        <Button
          onClick={toggleVineyards}
          variant={showVineyards ? "default" : "outline"}
          size="sm"
          className="shadow-lg"
        >
          <Layers className="w-4 h-4 mr-2" />
          Vineyards
        </Button>
      </div>

      {/* Static Fallback for No API Key */}
      {!import.meta.env.VITE_MAPTILER_KEY && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center rounded-lg">
          <div className="text-center p-8">
            <p className="text-muted-foreground mb-4">
              Interactive map requires MapTiler API key
            </p>
            <Button
              onClick={() => window.open(mapData.externalMapUrl, '_blank')}
              variant="default"
            >
              View on Google Maps
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
