import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Anchor } from 'lucide-react';
import { renderToString } from 'react-dom/server';

interface LakeTown {
  name: string;
  coords: [number, number];
  description: string;
  activities: string[];
}

const lakeTowns: LakeTown[] = [
  {
    name: 'Passignano sul Trasimeno',
    coords: [43.1872, 12.1352],
    description: 'Main watersports hub with ferry terminal, beaches, and bustling lakefront promenade.',
    activities: ['Windsurfing', 'Ferry to Islands', 'Swimming']
  },
  {
    name: 'Castiglione del Lago',
    coords: [43.1261, 12.0475],
    description: 'Largest lakeside town with imposing Rocca del Leone fortress and vibrant piazza.',
    activities: ['Medieval Castle', 'Wine Tasting', 'Kitesurfing']
  },
  {
    name: 'Tuoro sul Trasimeno',
    coords: [43.2091, 12.0708],
    description: "Historic site of Hannibal's famous battle. Now a quiet town with ferry access.",
    activities: ['History Tours', 'Ferry to Isola Maggiore', 'Sailing']
  },
  {
    name: 'Magione',
    coords: [43.1392, 12.2047],
    description: 'Inland town with easy access to eastern beaches and La Valle birdwatching oasis.',
    activities: ['Birdwatching', 'Olive Oil Tasting', 'Cycling']
  },
  {
    name: 'San Feliciano',
    coords: [43.11817653490088, 12.16777389466359],
    description: 'Charming fishing village with ferry to Isola Polvese and the Fishing Museum.',
    activities: ['Ferry to Polvese', 'Fresh Lake Fish', 'Kayaking']
  }
];


export default function LakeTrasimenoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    if (!apiKey) {
      console.error('MapTiler API key not found');
      return;
    }

    // Initialize map centered on Lake Trasimeno
    const map = L.map(mapRef.current, {
      center: [43.11, 12.11],
      zoom: 11,
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


    // Add town markers
    lakeTowns.forEach((town) => {
      const isPort = ['Passignano sul Trasimeno', 'San Feliciano'].includes(town.name);
      const IconComponent = isPort ? Anchor : MapPin;
      const iconHtml = renderToString(<IconComponent className="w-5 h-5 text-blue-600" strokeWidth={2.5} />);

      const markerHtml = `
        <div class="lake-town-marker group cursor-pointer">
          <div class="marker-icon transition-all duration-200 group-hover:scale-125 group-hover:drop-shadow-lg">
            ${iconHtml}
          </div>
          <div class="marker-label text-xs font-semibold text-foreground bg-white/95 px-2 py-1 rounded shadow-md whitespace-nowrap mt-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
            ${town.name.split(' ')[0]}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-lake-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      const marker = L.marker(town.coords, { icon: customIcon }).addTo(map);

      const popupContent = `
        <div class="lake-popup p-3">
          <h3 class="font-bold text-sm mb-1 text-foreground">${town.name}</h3>
          <p class="text-xs text-muted-foreground leading-relaxed mb-2">${town.description}</p>
          <div class="flex flex-wrap gap-1">
            ${town.activities.map(act => `<span class="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">${act}</span>`).join('')}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup lake-town-popup',
        maxWidth: 240,
        closeButton: true
      });
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden aspect-[21/9] border border-blue-200">
      <div ref={mapRef} className="w-full h-full" />
      <style>{`
        .custom-lake-marker {
          background: transparent !important;
          border: none !important;
        }
        .lake-town-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .lake-town-marker .marker-icon {
          background: white;
          padding: 4px;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .lake-town-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
        }
        .lake-town-popup .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
