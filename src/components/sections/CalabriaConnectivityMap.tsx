import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plane, Train, Ship, Car, MapPin, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Fix Leaflet's default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type Mode = 'plane' | 'train' | 'ferry' | 'car';
type LayerKey = 'rings' | 'airports' | 'ferries' | 'rail' | 'highways';

interface Hub {
  id: string;
  name: string;
  coords: [number, number];
  tagline: string;
  ringKm: [number, number, number]; // 30/60/120 min approx in km
  toMajor: Array<{ city: string; mode: Mode; duration: string; note: string }>;
  sicily?: Array<{ destination: string; mode: Mode; duration: string; note: string }>;
}

const HUBS: Hub[] = [
  {
    id: 'lamezia',
    name: 'Lamezia Terme',
    coords: [38.9637, 16.3094],
    tagline: 'The geographic pivot — airport, A2, and both coasts within reach.',
    ringKm: [30, 60, 110],
    toMajor: [
      { city: 'Rome', mode: 'plane', duration: '1h 10m', note: 'Lamezia (SUF) → FCO, multiple daily' },
      { city: 'Rome', mode: 'train', duration: '4h 40m', note: 'Frecciargento, direct from Lamezia Centrale' },
      { city: 'Rome', mode: 'car', duration: '5h 30m', note: 'A2 Salerno–Reggio, ~530 km' },
      { city: 'Naples', mode: 'train', duration: '3h 00m', note: 'Frecciargento / Intercity, direct' },
      { city: 'Naples', mode: 'car', duration: '3h 30m', note: 'A2 autostrada, ~340 km' },
      { city: 'Florence', mode: 'plane', duration: '2h 30m', note: 'SUF → FLR/PSA via 1 stop, or drive+train' },
      { city: 'Florence', mode: 'train', duration: '6h 30m', note: 'Frecciargento direct, daily' },
      { city: 'Milan', mode: 'plane', duration: '1h 35m', note: 'SUF → MXP/LIN/BGY, multiple daily, year-round' },
      { city: 'Milan', mode: 'train', duration: '8h 30m', note: 'Frecciarossa direct, ~1 daily' },
    ],
    sicily: [
      { destination: 'Messina', mode: 'car', duration: '1h 50m', note: 'Drive to Villa S.G. + 20-min ferry' },
      { destination: 'Catania', mode: 'car', duration: '3h 20m', note: 'Includes Strait crossing' },
    ],
  },
  {
    id: 'cosenza',
    name: 'Cosenza',
    coords: [39.2983, 16.2536],
    tagline: 'University city in the north — Sila gateway, closest to Naples.',
    ringKm: [25, 55, 100],
    toMajor: [
      { city: 'Rome', mode: 'train', duration: '4h 00m', note: 'Frecciargento via Paola, direct' },
      { city: 'Rome', mode: 'car', duration: '4h 40m', note: 'A2 northbound, ~470 km' },
      { city: 'Naples', mode: 'train', duration: '2h 30m', note: 'Frecciargento, fastest Calabrian connection' },
      { city: 'Naples', mode: 'car', duration: '2h 50m', note: 'A2 autostrada, ~280 km' },
      { city: 'Florence', mode: 'train', duration: '5h 50m', note: 'Frecciargento via Paola/Salerno' },
      { city: 'Milan', mode: 'plane', duration: '1h 30m', note: 'Drive 1h to Lamezia (SUF), then fly' },
      { city: 'Milan', mode: 'train', duration: '7h 50m', note: 'Frecciarossa direct, daily' },
    ],
  },
  {
    id: 'catanzaro',
    name: 'Catanzaro',
    coords: [38.9098, 16.5877],
    tagline: 'Regional capital on the Ionian side — short hop to Lamezia.',
    ringKm: [25, 55, 100],
    toMajor: [
      { city: 'Rome', mode: 'plane', duration: '1h 30m', note: 'Drive 40m to SUF, then 1h flight' },
      { city: 'Rome', mode: 'train', duration: '5h 30m', note: 'Via Lamezia, change required' },
      { city: 'Naples', mode: 'train', duration: '3h 30m', note: 'Via Lamezia transfer' },
      { city: 'Milan', mode: 'plane', duration: '2h 00m', note: 'Drive 40m to SUF + 1h 35m flight' },
    ],
  },
  {
    id: 'reggio',
    name: 'Reggio Calabria',
    coords: [38.1113, 15.6510],
    tagline: 'Strait of Messina — Sicily is 20 minutes away by ferry.',
    ringKm: [25, 55, 100],
    toMajor: [
      { city: 'Rome', mode: 'plane', duration: '1h 15m', note: 'REG → FCO, limited frequencies' },
      { city: 'Rome', mode: 'train', duration: '6h 10m', note: 'Frecciargento direct, daily' },
      { city: 'Naples', mode: 'train', duration: '4h 30m', note: 'Frecciargento via Tyrrhenian line' },
      { city: 'Naples', mode: 'car', duration: '5h 00m', note: 'A2 autostrada, ~470 km' },
      { city: 'Milan', mode: 'plane', duration: '1h 50m', note: 'REG → LIN/MXP, several daily' },
    ],
    sicily: [
      { destination: 'Messina', mode: 'ferry', duration: '20m', note: 'Villa S.G. → Messina, every 20–40 min, 24/7' },
      { destination: 'Aeolian Islands', mode: 'ferry', duration: '1h 30m+', note: 'Seasonal hydrofoil from Reggio Marittima' },
      { destination: 'Catania', mode: 'car', duration: '2h 00m', note: 'Includes ferry crossing' },
    ],
  },
  {
    id: 'tropea',
    name: 'Tropea',
    coords: [38.6772, 15.8987],
    tagline: 'Costa degli Dei base — postcard town, Aeolian gateway in summer.',
    ringKm: [20, 50, 95],
    toMajor: [
      { city: 'Rome', mode: 'train', duration: '5h 30m', note: 'Intercity via Lamezia transfer' },
      { city: 'Rome', mode: 'car', duration: '6h 00m', note: 'SS18 + A2, ~580 km' },
      { city: 'Naples', mode: 'train', duration: '3h 40m', note: 'Via Lamezia connection' },
      { city: 'Milan', mode: 'plane', duration: '2h 30m', note: 'Drive 50m to SUF, then 1h 35m flight' },
    ],
    sicily: [
      { destination: 'Aeolian Islands', mode: 'ferry', duration: '1h 30m', note: 'Tropea hydrofoil, seasonal (May–Sept)' },
      { destination: 'Messina', mode: 'car', duration: '2h 30m', note: 'Drive south + ferry from Villa S.G.' },
    ],
  },
];

const FERRY_PORTS = [
  { name: 'Villa San Giovanni', coords: [38.2210, 15.6383] as [number, number], note: '24/7 shuttle to Messina · every 20–40 min', frequency: 'hourly' },
  { name: 'Reggio Marittima', coords: [38.1153, 15.6477] as [number, number], note: 'Messina + seasonal Aeolian hydrofoil', frequency: 'daily' },
  { name: 'Vibo Marina', coords: [38.7220, 16.1276] as [number, number], note: 'Cargo + seasonal passenger lines', frequency: 'seasonal' },
  { name: 'Tropea', coords: [38.6786, 15.8978] as [number, number], note: 'Aeolian hydrofoil, May–September', frequency: 'seasonal' },
];

const AIRPORTS = [
  { name: 'Lamezia Terme (SUF)', coords: [38.9054, 16.2422] as [number, number], note: 'Main hub. Year-round to Rome, Milan, Bologna, Turin, Venice. Seasonal European routes (Ryanair, easyJet).', frequency: 'hourly' },
  { name: 'Reggio Calabria (REG)', coords: [38.0712, 15.6516] as [number, number], note: 'Limited but useful. Direct Rome FCO and Milan LIN. Recently revived after years of decline.', frequency: 'daily' },
];

// Tyrrhenian rail line key stations (Salerno -> Reggio along west coast)
const TYRRHENIAN_RAIL: [number, number][] = [
  [39.7437, 15.8430], // Praia a Mare (entry from Campania)
  [39.5000, 16.0000], // Paola (Cosenza branch)
  [38.9540, 16.2310], // Lamezia Terme Centrale
  [38.6770, 16.1010], // Pizzo
  [38.6100, 16.0760], // Rosarno
  [38.4310, 15.8420], // Gioia Tauro
  [38.1113, 15.6510], // Reggio Calabria
];

// Ionian rail line (Taranto/Sibari -> Reggio along east coast, slower)
const IONIAN_RAIL: [number, number][] = [
  [39.7220, 16.4700], // Sibari (entry from Basilicata)
  [39.3070, 17.1268], // Crotone
  [38.9098, 16.5877], // Catanzaro Lido area
  [38.6420, 16.5660], // Soverato
  [38.2660, 16.2310], // Locri
  [38.1113, 15.6510], // Reggio Calabria (loop closure)
];

// Strait of Messina ferry line
const STRAIT_LINE: [number, number][] = [
  [38.2210, 15.6383], // Villa San Giovanni
  [38.1937, 15.5540], // Messina
];

const MODE_ICON: Record<Mode, React.ComponentType<any>> = {
  plane: Plane,
  train: Train,
  ferry: Ship,
  car: Car,
};

const FREQ_COLOR: Record<string, string> = {
  hourly: 'hsl(var(--primary))',
  daily: 'hsl(var(--accent))',
  seasonal: 'hsl(var(--muted-foreground))',
};

export const CalabriaConnectivityMap: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<Hub>(HUBS[0]);
  const [activeModes, setActiveModes] = useState<Set<Mode>>(new Set(['plane', 'train', 'ferry', 'car']));
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    rings: true,
    airports: true,
    ferries: true,
    rail: true,
    highways: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerGroups = useRef<Record<LayerKey, L.LayerGroup>>({
    rings: L.layerGroup(),
    airports: L.layerGroup(),
    ferries: L.layerGroup(),
    rail: L.layerGroup(),
    highways: L.layerGroup(),
  });
  const hubLayer = useRef<L.LayerGroup>(L.layerGroup());

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    if (!apiKey) {
      setError('Map configuration error');
      setIsLoading(false);
      return;
    }

    try {
      const map = L.map(mapRef.current, {
        center: [39.0, 16.4],
        zoom: 8,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`, {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '© MapTiler © OpenStreetMap contributors',
        crossOrigin: true,
      }).addTo(map);

      // Add layer groups (initially)
      Object.values(layerGroups.current).forEach((g) => g.addTo(map));
      hubLayer.current.addTo(map);

      mapInstance.current = map;

      setTimeout(() => {
        map.invalidateSize();
        setIsLoading(false);
      }, 100);
    } catch (e) {
      console.error(e);
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

  // Render hubs (always)
  useEffect(() => {
    if (!mapInstance.current) return;
    hubLayer.current.clearLayers();

    HUBS.forEach((h) => {
      const isSelected = h.id === selectedHub.id;
      const icon = L.divIcon({
        html: `
          <div class="cal-hub ${isSelected ? 'cal-hub-selected' : ''}">
            <span class="cal-hub-dot"></span>
            <span class="cal-hub-label">${h.name}</span>
          </div>
        `,
        className: 'cal-hub-wrap',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
      const marker = L.marker(h.coords, { icon, zIndexOffset: isSelected ? 1000 : 500 })
        .on('click', () => setSelectedHub(h));
      hubLayer.current.addLayer(marker);
    });
  }, [selectedHub]);

  // Render concentric drive-time rings (around selected hub)
  useEffect(() => {
    if (!mapInstance.current) return;
    const g = layerGroups.current.rings;
    g.clearLayers();
    if (!layers.rings) return;

    // Sort largest -> smallest so smaller rings stay clickable
    const radii = [...selectedHub.ringKm].sort((a, b) => b - a);
    const opacities = [0.06, 0.10, 0.16];
    radii.forEach((km, i) => {
      const circle = L.circle(selectedHub.coords, {
        radius: km * 1000,
        color: 'hsl(var(--primary))',
        weight: 1,
        fillColor: 'hsl(var(--primary))',
        fillOpacity: opacities[i],
        interactive: false,
      });
      g.addLayer(circle);
    });

    // Center pulse
    g.addLayer(
      L.circleMarker(selectedHub.coords, {
        radius: 5,
        color: 'hsl(var(--primary))',
        fillColor: 'hsl(var(--primary))',
        fillOpacity: 1,
        weight: 2,
      })
    );
  }, [selectedHub, layers.rings]);

  // Render airports
  useEffect(() => {
    if (!mapInstance.current) return;
    const g = layerGroups.current.airports;
    g.clearLayers();
    if (!layers.airports || !activeModes.has('plane')) return;

    AIRPORTS.forEach((a) => {
      const icon = L.divIcon({
        html: `<div class="cal-poi cal-poi-airport" title="${a.name}">✈</div>`,
        className: 'cal-poi-wrap',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const m = L.marker(a.coords, { icon }).bindPopup(
        `<strong>${a.name}</strong><br/><span style="font-size:12px">${a.note}</span>`
      );
      g.addLayer(m);
    });
  }, [layers.airports, activeModes]);

  // Render ferries
  useEffect(() => {
    if (!mapInstance.current) return;
    const g = layerGroups.current.ferries;
    g.clearLayers();
    if (!layers.ferries || !activeModes.has('ferry')) return;

    FERRY_PORTS.forEach((f) => {
      const icon = L.divIcon({
        html: `<div class="cal-poi cal-poi-ferry" title="${f.name}">⚓</div>`,
        className: 'cal-poi-wrap',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
      const m = L.marker(f.coords, { icon }).bindPopup(
        `<strong>${f.name}</strong><br/><span style="font-size:12px">${f.note}</span>`
      );
      g.addLayer(m);
    });

    // Strait of Messina dashed line
    g.addLayer(
      L.polyline(STRAIT_LINE, {
        color: 'hsl(var(--accent))',
        weight: 3,
        dashArray: '6,8',
        opacity: 0.85,
      }).bindTooltip('Strait of Messina ferry · 20 min · every 20–40 min, 24/7', { sticky: true })
    );
  }, [layers.ferries, activeModes]);

  // Render rail
  useEffect(() => {
    if (!mapInstance.current) return;
    const g = layerGroups.current.rail;
    g.clearLayers();
    if (!layers.rail || !activeModes.has('train')) return;

    g.addLayer(
      L.polyline(TYRRHENIAN_RAIL, {
        color: 'hsl(var(--primary))',
        weight: 4,
        opacity: 0.85,
      }).bindTooltip('Tyrrhenian line — Frecce / Intercity (Salerno ↔ Reggio)', { sticky: true })
    );
    g.addLayer(
      L.polyline(IONIAN_RAIL, {
        color: 'hsl(var(--muted-foreground))',
        weight: 3,
        dashArray: '4,6',
        opacity: 0.85,
      }).bindTooltip('Ionian line — regional only, slower (Sibari ↔ Reggio)', { sticky: true })
    );
  }, [layers.rail, activeModes]);

  // Render highways (simplified A2 + SS106 corridors as polylines following key towns)
  useEffect(() => {
    if (!mapInstance.current) return;
    const g = layerGroups.current.highways;
    g.clearLayers();
    if (!layers.highways || !activeModes.has('car')) return;

    const A2: [number, number][] = [
      [39.9, 15.95], [39.50, 16.00], [38.96, 16.31], [38.43, 15.84], [38.11, 15.65],
    ];
    const SS106: [number, number][] = [
      [39.72, 16.47], [39.31, 17.13], [38.91, 16.59], [38.64, 16.57], [38.27, 16.23], [38.11, 15.65],
    ];

    g.addLayer(
      L.polyline(A2, { color: 'hsl(var(--accent))', weight: 3, opacity: 0.7 })
        .bindTooltip('A2 Autostrada del Mediterraneo — fast, free, the spine of the region', { sticky: true })
    );
    g.addLayer(
      L.polyline(SS106, { color: 'hsl(var(--destructive))', weight: 2, opacity: 0.55, dashArray: '2,5' })
        .bindTooltip('SS106 Ionian — scenic but largely single-carriageway. Plan extra time.', { sticky: true })
    );
  }, [layers.highways, activeModes]);

  // Filtered destination rows for the selected hub
  const visibleRows = useMemo(
    () => selectedHub.toMajor.filter((r) => activeModes.has(r.mode)),
    [selectedHub, activeModes]
  );
  const visibleSicily = useMemo(
    () => (selectedHub.sicily || []).filter((r) => activeModes.has(r.mode)),
    [selectedHub, activeModes]
  );

  const toggleMode = (m: Mode) => {
    setActiveModes((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m); else next.add(m);
      return next;
    });
  };

  const toggleLayer = (k: LayerKey) => {
    setLayers((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  if (error) {
    return (
      <div className="my-8 px-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-12">
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Calabria Connectivity Map
        </h3>
        <p className="text-muted-foreground">
          Pick a base. The rings show ~30 / 60 / 120 minutes by car. Toggle modes to see how planes, trains, ferries
          and the autostrada actually connect this region — including the honest bits.
        </p>
      </div>

      {/* Hub + mode chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">From</span>
        {HUBS.map((h) => (
          <Button
            key={h.id}
            size="sm"
            variant={selectedHub.id === h.id ? 'default' : 'outline'}
            onClick={() => setSelectedHub(h)}
          >
            {h.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">Modes</span>
        {(['plane', 'train', 'ferry', 'car'] as Mode[]).map((m) => {
          const Icon = MODE_ICON[m];
          const active = activeModes.has(m);
          return (
            <Button
              key={m}
              size="sm"
              variant={active ? 'secondary' : 'ghost'}
              onClick={() => toggleMode(m)}
              className="gap-1.5"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="capitalize">{m}</span>
            </Button>
          );
        })}
        <span className="mx-2 h-5 w-px bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">Layers</span>
        {(['rings', 'airports', 'ferries', 'rail', 'highways'] as LayerKey[]).map((k) => (
          <Button
            key={k}
            size="sm"
            variant={layers[k] ? 'secondary' : 'ghost'}
            onClick={() => toggleLayer(k)}
            className="capitalize"
          >
            {k}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-6 items-start">
        {/* Map */}
        <div className="relative bg-muted/30 rounded-lg overflow-hidden border border-border" style={{ height: '600px' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent mb-2" />
                <p className="text-sm text-muted-foreground">Loading map…</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full relative z-0" />

          {/* Legend overlay */}
          <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm border border-border rounded-md p-3 text-xs space-y-1.5 shadow-md z-[400]">
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-primary/30 border border-primary" /> 30 / 60 / 120-min drive</div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-0.5 bg-primary" /> Tyrrhenian rail (fast)</div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-0.5 border-t border-dashed border-muted-foreground" /> Ionian rail (slower)</div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-0.5 bg-accent" /> A2 autostrada · ferry</div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-0.5 border-t border-dashed border-destructive" /> SS106 single-carriageway</div>
          </div>
        </div>

        {/* Side panel */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-primary" />
              <h4 className="font-bold text-lg">{selectedHub.name}</h4>
            </div>
            <p className="text-sm text-muted-foreground italic">{selectedHub.tagline}</p>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">To major cities</h5>
            <ul className="space-y-2">
              {visibleRows.length === 0 && (
                <li className="text-xs text-muted-foreground">No modes selected.</li>
              )}
              {visibleRows.map((r, i) => {
                const Icon = MODE_ICON[r.mode];
                return (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{r.city}</span>
                        <Badge variant="secondary" className="font-mono text-xs">{r.duration}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{r.note}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {visibleSicily.length > 0 && (
            <div>
              <h5 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Sicily access</h5>
              <ul className="space-y-2">
                {visibleSicily.map((r, i) => {
                  const Icon = MODE_ICON[r.mode];
                  return (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Icon className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{r.destination}</span>
                          <Badge variant="outline" className="font-mono text-xs">{r.duration}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{r.note}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <p>Times are typical off-peak. Add 20–40% in August or on bank holidays.</p>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <p>Reality check: the Ionian rail line is regional-only, and long stretches of the SS106 remain single-carriageway. Plan around it.</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6 max-w-2xl mx-auto">
        Lamezia airport (SUF) sits within roughly a one-hour drive of most Tyrrhenian-coast towns — the single
        biggest reason it anchors any Calabria relocation plan.
      </p>

      <style>{`
        .cal-hub-wrap { background: transparent !important; border: none !important; }
        .cal-hub {
          position: relative; display: flex; flex-direction: column; align-items: center;
          cursor: pointer; transition: transform .2s ease;
        }
        .cal-hub:hover { transform: scale(1.1); }
        .cal-hub-dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: hsl(var(--background));
          border: 3px solid hsl(var(--primary));
          box-shadow: 0 2px 6px rgba(0,0,0,.3);
        }
        .cal-hub-selected .cal-hub-dot {
          background: hsl(var(--primary));
          box-shadow: 0 0 0 6px hsl(var(--primary) / .15), 0 2px 8px rgba(0,0,0,.35);
        }
        .cal-hub-label {
          margin-top: 4px; padding: 2px 7px; font-size: 11px; font-weight: 600;
          background: hsl(var(--background)); color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border)); border-radius: 4px; white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,.15);
        }
        .cal-poi-wrap { background: transparent !important; border: none !important; }
        .cal-poi {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700;
          background: hsl(var(--background)); border: 2px solid hsl(var(--border));
          box-shadow: 0 2px 5px rgba(0,0,0,.25);
          cursor: pointer; transition: transform .15s ease;
        }
        .cal-poi:hover { transform: scale(1.15); }
        .cal-poi-airport { color: hsl(var(--primary)); border-color: hsl(var(--primary)); }
        .cal-poi-ferry { color: hsl(var(--accent-foreground)); border-color: hsl(var(--accent)); background: hsl(var(--accent) / .15); }
        .leaflet-container { background: hsl(var(--muted)); z-index: 0; }
      `}</style>
    </div>
  );
};

export default CalabriaConnectivityMap;