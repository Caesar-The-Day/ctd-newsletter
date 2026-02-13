import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Mountain, Trees, Snowflake, Waves } from 'lucide-react';
import { renderToString } from 'react-dom/server';

interface NatureFeature {
  type: 'lake' | 'park' | 'ski' | 'hub' | 'beach';
  name: string;
  coords: [number, number];
  description: string;
  shape?: [number, number][];
  color?: string;
}

interface LombardiaNatureMapProps {
  features?: NatureFeature[];
  center?: [number, number];
  zoom?: number;
}

// Default features if not provided via props
const defaultFeatures: NatureFeature[] = [
  // Milan hub
  {
    type: 'hub',
    name: 'Milano',
    coords: [45.46, 9.19],
    description: 'Reference point: All recreational areas are within easy reach of Milan.'
  },
  // Lakes
  {
    type: 'lake',
    name: 'Lake Como',
    coords: [46.02, 9.26],
    shape: [[46.17, 9.40], [46.05, 9.45], [45.85, 9.27], [45.82, 9.08], [45.95, 9.05], [46.05, 9.10], [46.10, 9.25]],
    color: '#3b82f6',
    description: 'Y-shaped Alpine lake. Most prestigious, stunning villas and views.'
  },
  {
    type: 'lake',
    name: 'Lake Iseo',
    coords: [45.73, 10.07],
    shape: [[45.82, 10.05], [45.78, 10.12], [45.68, 10.10], [45.65, 10.00], [45.72, 9.98]],
    color: '#3b82f6',
    description: 'Hidden gem. Less touristy, Franciacorta wine country nearby.'
  },
  {
    type: 'lake',
    name: 'Lake Garda',
    coords: [45.58, 10.55],
    shape: [[45.88, 10.72], [45.75, 10.82], [45.45, 10.70], [45.42, 10.62], [45.60, 10.50], [45.75, 10.55]],
    color: '#3b82f6',
    description: 'Italy\'s largest lake. Mild microclimate, olive groves.'
  },
  {
    type: 'lake',
    name: 'Lake Maggiore',
    coords: [45.95, 8.60],
    shape: [[46.15, 8.75], [46.08, 8.82], [45.80, 8.65], [45.78, 8.52], [45.90, 8.48], [46.10, 8.60]],
    color: '#3b82f6',
    description: 'Shared with Piedmont and Switzerland. Borromean Islands.'
  },
  {
    type: 'lake',
    name: 'Lake Lugano',
    coords: [45.98, 8.97],
    shape: [[46.02, 9.08], [45.97, 9.12], [45.90, 9.00], [45.92, 8.88], [46.00, 8.90]],
    color: '#3b82f6',
    description: 'Shared with Switzerland. Cross-border lake living.'
  },
  // Regional & National Parks
  {
    type: 'park',
    name: 'Stelvio National Park',
    coords: [46.45, 10.55],
    description: 'Italy\'s largest national park. Alpine wilderness, glaciers, wildlife.'
  },
  {
    type: 'park',
    name: 'Parco Regionale dell\'Adamello',
    coords: [46.15, 10.48],
    description: 'High mountain park with glaciers and alpine meadows.'
  },
  {
    type: 'park',
    name: 'Parco delle Orobie Bergamasche',
    coords: [46.02, 9.85],
    description: 'Pre-Alpine park above Bergamo. Hiking and nature reserves.'
  },
  {
    type: 'park',
    name: 'Parco del Ticino',
    coords: [45.45, 8.85],
    description: 'River park between Lombardy and Piedmont. Wetlands and forests.'
  },
  {
    type: 'park',
    name: 'Parco Regionale Alto Garda Bresciano',
    coords: [45.78, 10.62],
    description: 'Mountain park above Lake Garda\'s western shore.'
  },
  {
    type: 'park',
    name: 'Parco Naturale Svizzero (Swiss National Park)',
    coords: [46.66, 10.22],
    description: 'Switzerland\'s only national park. Just across the border.'
  },
  // Ski Areas
  {
    type: 'ski',
    name: 'Bormio',
    coords: [46.47, 10.37],
    description: 'World Cup ski resort in Valtellina. 50km of slopes, thermal baths.'
  },
  {
    type: 'ski',
    name: 'Livigno',
    coords: [46.54, 10.13],
    description: 'Duty-free ski resort near Swiss border. Modern lifts, snow-sure.'
  },
  {
    type: 'ski',
    name: 'Madesimo',
    coords: [46.43, 9.35],
    description: 'Family-friendly ski area. Good snow record, less crowded.'
  },
  {
    type: 'ski',
    name: 'Ponte di Legno / Tonale',
    coords: [46.26, 10.51],
    description: 'Glacier skiing into early summer. Linked ski area.'
  },
  {
    type: 'ski',
    name: 'Aprica',
    coords: [46.15, 10.15],
    description: 'Accessible ski resort between Sondrio and Brescia valleys.'
  },
  {
    type: 'ski',
    name: 'Chiesa Valmalenco',
    coords: [46.27, 9.85],
    description: 'Alpine skiing with views of Monte Disgrazia.'
  },
  // Swiss ski areas near border
  {
    type: 'ski',
    name: 'St. Moritz',
    coords: [46.50, 9.84],
    description: 'Legendary Swiss resort. Accessible via Bernina Express.'
  },
  {
    type: 'ski',
    name: 'Zermatt',
    coords: [46.02, 7.75],
    description: 'The Matterhorn. World-class skiing across Swiss border.'
  }
];

export function LombardiaNatureMap({ features = defaultFeatures, center = [46.0, 9.5], zoom = 8 }: LombardiaNatureMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    
    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    if (!apiKey) {
      console.error('MapTiler API key not found');
      return;
    }

    // Initialize map centered on Lombardia, extended north to show Swiss areas
    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      scrollWheelZoom: false,
      zoomControl: true
    });

    // Add MapTiler tile layer with outdoor/terrain style
    L.tileLayer(`https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${apiKey}`, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution: '© MapTiler © OpenStreetMap contributors',
      crossOrigin: true
    }).addTo(map);

    // Add Milan hub marker
    const hub = features.find(f => f.type === 'hub');
    if (hub) {
      const hubIconHtml = renderToString(<MapPin className="w-8 h-8 text-primary" strokeWidth={2.5} />);
      const hubIcon = L.divIcon({
        html: `
          <div class="hub-marker group cursor-pointer">
            <div class="marker-icon transition-all duration-200 group-hover:scale-125">${hubIconHtml}</div>
            <div class="marker-label text-sm font-bold text-foreground bg-background/95 px-3 py-1.5 rounded shadow-md whitespace-nowrap mt-1">
              ${hub.name}
            </div>
          </div>
        `,
        className: 'custom-marker hub-glow',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
      
      L.marker(hub.coords, { icon: hubIcon })
        .addTo(map)
        .bindPopup(`
          <div class="zone-popup">
            <h3 class="font-bold text-base mb-2 text-foreground">${hub.name}</h3>
            <p class="text-sm text-muted-foreground">${hub.description}</p>
          </div>
        `, { className: 'custom-popup', maxWidth: 280 });
    }

    // Add lake polygons
    const lakes = features.filter(f => f.type === 'lake');
    lakes.forEach(lake => {
      if (lake.shape) {
        const polygon = L.polygon(lake.shape, {
          fillColor: lake.color || '#3b82f6',
          fillOpacity: 0.4,
          color: lake.color || '#3b82f6',
          weight: 2,
          opacity: 0.8
        }).addTo(map);

        polygon.bindPopup(`
          <div class="zone-popup">
            <h3 class="font-bold text-base mb-2 text-foreground">🏞️ ${lake.name}</h3>
            <p class="text-sm text-muted-foreground">${lake.description}</p>
          </div>
        `, { className: 'custom-popup', maxWidth: 300 });

        polygon.on('mouseover', function () {
          this.setStyle({ fillOpacity: 0.6, weight: 3 });
        });
        polygon.on('mouseout', function () {
          this.setStyle({ fillOpacity: 0.4, weight: 2 });
        });
      }
    });

    // Add park markers
    const parks = features.filter(f => f.type === 'park');
    parks.forEach(park => {
      const parkIconHtml = renderToString(<Trees className="w-5 h-5 text-green-600" />);
      const parkIcon = L.divIcon({
        html: `
          <div class="park-marker group cursor-pointer">
            <div class="marker-icon bg-green-100 dark:bg-green-900/50 p-1.5 rounded-full border-2 border-green-500 transition-all duration-200 group-hover:scale-110">
              ${parkIconHtml}
            </div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker(park.coords, { icon: parkIcon })
        .addTo(map)
        .bindPopup(`
          <div class="zone-popup">
            <h3 class="font-bold text-base mb-2 text-foreground">🌲 ${park.name}</h3>
            <p class="text-sm text-muted-foreground">${park.description}</p>
          </div>
        `, { className: 'custom-popup', maxWidth: 280 });
    });

    // Add ski area markers
    const skiAreas = features.filter(f => f.type === 'ski');
    skiAreas.forEach(ski => {
      const skiIconHtml = renderToString(<Snowflake className="w-4 h-4 text-sky-600" />);
      const skiIcon = L.divIcon({
        html: `
          <div class="ski-marker group cursor-pointer">
            <div class="marker-icon bg-sky-100 dark:bg-sky-900/50 p-1.5 rounded-full border-2 border-sky-500 transition-all duration-200 group-hover:scale-110">
              ${skiIconHtml}
            </div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker(ski.coords, { icon: skiIcon })
        .addTo(map)
        .bindPopup(`
          <div class="zone-popup">
            <h3 class="font-bold text-base mb-2 text-foreground">⛷️ ${ski.name}</h3>
            <p class="text-sm text-muted-foreground">${ski.description}</p>
          </div>
        `, { className: 'custom-popup', maxWidth: 280 });
    });

    // Add beach markers
    const beaches = features.filter(f => f.type === 'beach');
    beaches.forEach(beach => {
      const beachIconHtml = renderToString(<Waves className="w-4 h-4 text-amber-600" />);
      const beachIcon = L.divIcon({
        html: `
          <div class="beach-marker group cursor-pointer">
            <div class="marker-icon bg-amber-100 dark:bg-amber-900/50 p-1.5 rounded-full border-2 border-amber-500 transition-all duration-200 group-hover:scale-110">
              ${beachIconHtml}
            </div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker(beach.coords, { icon: beachIcon })
        .addTo(map)
        .bindPopup(`
          <div class="zone-popup">
            <h3 class="font-bold text-base mb-2 text-foreground">🏖️ ${beach.name}</h3>
            <p class="text-sm text-muted-foreground">${beach.description}</p>
          </div>
        `, { className: 'custom-popup', maxWidth: 280 });
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [features]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-[500px] rounded-xl border border-border shadow-lg"
      />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
        <h4 className="font-semibold text-sm text-foreground mb-3">Legend</h4>
        <div className="space-y-2 text-sm">
          {features.some(f => f.type === 'hub') && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{features.find(f => f.type === 'hub')?.name} (Reference)</span>
            </div>
          )}
          {features.some(f => f.type === 'lake') && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Waves className="w-4 h-4 text-blue-500" />
              <span>Lakes</span>
            </div>
          )}
          {features.some(f => f.type === 'park') && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trees className="w-4 h-4 text-green-600" />
              <span>Parks & Reserves</span>
            </div>
          )}
          {features.some(f => f.type === 'ski') && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Snowflake className="w-4 h-4 text-sky-600" />
              <span>Ski Areas</span>
            </div>
          )}
          {features.some(f => f.type === 'beach') && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Waves className="w-4 h-4 text-amber-500" />
              <span>Beaches</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
