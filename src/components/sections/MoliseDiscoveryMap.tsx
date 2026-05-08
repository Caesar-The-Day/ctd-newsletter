import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Landmark, Grape, Trees, Footprints, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type LayerKey = 'heritage' | 'wine' | 'parks' | 'tratturi' | 'transport';

interface POI {
  name: string;
  coords: [number, number];
  note: string;
}

const HERITAGE: POI[] = [
  { name: 'Saepinum (Altilia)', coords: [41.4275, 14.6181], note: 'Remarkably preserved Roman city — open-air, free, almost always empty.' },
  { name: 'Pietrabbondante', coords: [41.7700, 14.3700], note: 'Samnite theatre and temple complex carved into the mountainside.' },
  { name: 'Larino Roman Amphitheatre', coords: [41.8011, 14.9103], note: 'Imperial-era amphitheatre beside a hilltop medieval old town.' },
  { name: 'San Vincenzo al Volturno', coords: [41.6486, 14.0858], note: 'Early-medieval monastery with extraordinary 9th-century frescoes.' },
  { name: 'Agnone Bell Foundry', coords: [41.8105, 14.3768], note: 'Pontificia Fonderia Marinelli — making church bells since ~1000 AD.' },
  { name: 'Tratturo Magno (UNESCO Tentative)', coords: [41.5603, 14.6644], note: 'The pastoral routes are on Italy\u2019s UNESCO Tentative List.' },
];

interface WineZone {
  name: string;
  center: [number, number];
  polygon: [number, number][];
  note: string;
}

const WINE_ZONES: WineZone[] = [
  {
    name: 'Tintilia del Molise DOC',
    center: [41.62, 14.55],
    polygon: [[41.85, 14.30], [41.85, 14.85], [41.40, 14.85], [41.40, 14.30]],
    note: 'The native grape — high-altitude reds with real character. The flagship of Molise wine.',
  },
  {
    name: 'Biferno DOC',
    center: [41.90, 14.85],
    polygon: [[42.05, 14.55], [42.05, 15.05], [41.70, 15.05], [41.70, 14.55]],
    note: 'Reds, whites and ros\u00e9s along the Biferno river corridor down to Termoli.',
  },
  {
    name: 'Pentro di Isernia DOC',
    center: [41.60, 14.20],
    polygon: [[41.78, 14.00], [41.78, 14.40], [41.42, 14.40], [41.42, 14.00]],
    note: 'Small DOC around Isernia — montepulciano and trebbiano on volcanic soils.',
  },
];

const PARKS: POI[] = [
  { name: "Parco Nazionale d'Abruzzo, Lazio e Molise", coords: [41.7800, 14.0500], note: 'Apennine wilderness — bears, wolves, beech forests; the Mainarde sector lies in Molise.' },
  { name: 'Riserva MAB Collemeluccio-Montedimezzo', coords: [41.7850, 14.3300], note: 'UNESCO Man & Biosphere reserve — old-growth silver fir forest.' },
  { name: 'Oasi WWF Guardiaregia-Campochiaro', coords: [41.4500, 14.5500], note: "One of WWF Italy\u2019s largest oases — gorges, waterfalls, the Matese massif." },
  { name: 'Riserva Marina Tremiti', coords: [42.1200, 15.5000], note: 'Marine reserve in the Adriatic — ferries depart Termoli daily in season.' },
];

// Approximations of two of the great tratturi crossing Molise
const TRATTURO_PESCASSEROLI_CANDELA: [number, number][] = [
  [41.8050, 13.7900], [41.7000, 14.0500], [41.6000, 14.3500], [41.5400, 14.7000], [41.4800, 15.1000], [41.4500, 15.5500],
];
const TRATTURO_CELANO_FOGGIA: [number, number][] = [
  [42.0850, 13.5450], [41.9700, 14.0500], [41.8500, 14.4500], [41.8000, 14.8500], [41.7000, 15.3000], [41.4600, 15.5500],
];

interface TransportPOI extends POI {
  kind: 'port' | 'rail' | 'airport' | 'highway';
}

const TRANSPORT: TransportPOI[] = [
  { name: 'Termoli Port', coords: [42.0017, 14.9942], note: 'Year-round ferries to the Tremiti Islands; Adriatic cabotage in summer.', kind: 'port' },
  { name: 'Campobasso Stazione', coords: [41.5603, 14.6644], note: 'Regional rail to Termoli (Adriatic line) and Roma via Vairano.', kind: 'rail' },
  { name: 'Isernia Stazione', coords: [41.5950, 14.2330], note: 'On the Roma\u2013Napoli\u2013Pescara secondary line; useful for Rome trips.', kind: 'rail' },
  { name: 'Venafro / A1 Access', coords: [41.4820, 14.0450], note: 'Quickest gateway to the Autostrada del Sole \u2014 Rome ~2h, Naples ~1h30.', kind: 'highway' },
  { name: 'Termoli / A14 Access', coords: [42.0080, 14.9700], note: 'Adriatic autostrada \u2014 Pescara 1h, Bologna 4h.', kind: 'highway' },
  { name: 'Naples Capodichino (NAP)', coords: [40.8860, 14.2908], note: '~2h drive from Isernia \u2014 the practical international airport for Molise.', kind: 'airport' },
  { name: 'Pescara (PSR)', coords: [42.4317, 14.1810], note: '~1h30 from Termoli \u2014 limited but useful for northern Europe routes.', kind: 'airport' },
];

const LAYER_META: Record<LayerKey, { label: string; Icon: any }> = {
  heritage: { label: 'UNESCO & Heritage', Icon: Landmark },
  wine: { label: 'Wine Zones', Icon: Grape },
  parks: { label: 'Parks & Nature', Icon: Trees },
  tratturi: { label: 'Tratturi (Sheep Routes)', Icon: Footprints },
  transport: { label: 'Transport Anchors', Icon: Plane },
};

export const MoliseDiscoveryMap: React.FC = () => {
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    heritage: true,
    wine: true,
    parks: true,
    tratturi: true,
    transport: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerGroups = useRef<Record<LayerKey, L.LayerGroup>>({
    heritage: L.layerGroup(),
    wine: L.layerGroup(),
    parks: L.layerGroup(),
    tratturi: L.layerGroup(),
    transport: L.layerGroup(),
  });

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
        center: [41.69, 14.58],
        zoom: 9,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`, {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '\u00a9 MapTiler \u00a9 OpenStreetMap contributors',
        crossOrigin: true,
      }).addTo(map);
      Object.values(layerGroups.current).forEach((g) => g.addTo(map));
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

  const makePoi = (cls: string, glyph: string) =>
    L.divIcon({
      html: `<div class="mol-poi ${cls}">${glyph}</div>`,
      className: 'mol-poi-wrap',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

  // Heritage
  useEffect(() => {
    const g = layerGroups.current.heritage;
    g.clearLayers();
    if (!layers.heritage || !mapInstance.current) return;
    HERITAGE.forEach((p) => {
      g.addLayer(
        L.marker(p.coords, { icon: makePoi('mol-poi-heritage', '\u25B2') })
          .bindPopup(`<strong>${p.name}</strong><br/><span style="font-size:12px">${p.note}</span>`)
      );
    });
  }, [layers.heritage]);

  // Wine
  useEffect(() => {
    const g = layerGroups.current.wine;
    g.clearLayers();
    if (!layers.wine || !mapInstance.current) return;
    WINE_ZONES.forEach((z) => {
      g.addLayer(
        L.polygon(z.polygon, {
          color: 'hsl(var(--destructive))',
          weight: 1.5,
          fillColor: 'hsl(var(--destructive))',
          fillOpacity: 0.10,
        }).bindTooltip(z.name, { sticky: true })
      );
      g.addLayer(
        L.marker(z.center, { icon: makePoi('mol-poi-wine', '\u2767') })
          .bindPopup(`<strong>${z.name}</strong><br/><span style="font-size:12px">${z.note}</span>`)
      );
    });
  }, [layers.wine]);

  // Parks
  useEffect(() => {
    const g = layerGroups.current.parks;
    g.clearLayers();
    if (!layers.parks || !mapInstance.current) return;
    PARKS.forEach((p) => {
      g.addLayer(
        L.circle(p.coords, {
          radius: 7000,
          color: 'hsl(142 60% 35%)',
          weight: 1,
          fillColor: 'hsl(142 60% 35%)',
          fillOpacity: 0.12,
          interactive: false,
        })
      );
      g.addLayer(
        L.marker(p.coords, { icon: makePoi('mol-poi-park', '\u2660') })
          .bindPopup(`<strong>${p.name}</strong><br/><span style="font-size:12px">${p.note}</span>`)
      );
    });
  }, [layers.parks]);

  // Tratturi
  useEffect(() => {
    const g = layerGroups.current.tratturi;
    g.clearLayers();
    if (!layers.tratturi || !mapInstance.current) return;
    g.addLayer(
      L.polyline(TRATTURO_PESCASSEROLI_CANDELA, {
        color: 'hsl(35 70% 45%)',
        weight: 4,
        opacity: 0.85,
        dashArray: '8,6',
      }).bindTooltip('Tratturo Pescasseroli\u2013Candela \u2014 ancient transhumance route', { sticky: true })
    );
    g.addLayer(
      L.polyline(TRATTURO_CELANO_FOGGIA, {
        color: 'hsl(28 75% 50%)',
        weight: 4,
        opacity: 0.85,
        dashArray: '8,6',
      }).bindTooltip('Tratturo Celano\u2013Foggia \u2014 the largest of the royal sheep tracks', { sticky: true })
    );
  }, [layers.tratturi]);

  // Transport
  useEffect(() => {
    const g = layerGroups.current.transport;
    g.clearLayers();
    if (!layers.transport || !mapInstance.current) return;
    const glyphs: Record<TransportPOI['kind'], string> = {
      port: '\u2693',
      rail: '\u2630',
      airport: '\u2708',
      highway: '\u25C8',
    };
    TRANSPORT.forEach((t) => {
      g.addLayer(
        L.marker(t.coords, { icon: makePoi('mol-poi-transport', glyphs[t.kind]) })
          .bindPopup(`<strong>${t.name}</strong><br/><span style="font-size:12px">${t.note}</span>`)
      );
    });
  }, [layers.transport]);

  const toggle = (k: LayerKey) =>
    setLayers((prev) => ({ ...prev, [k]: !prev[k] }));

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
    <section className="my-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-6 max-w-3xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Discover Molise \u2014 Layered Map
        </h3>
        <p className="text-muted-foreground">
          Toggle the layers to see what shapes life here: ancient heritage, native wine zones, protected
          wilderness, the tratturi sheep routes that built the region, and how you actually get in and out.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {(Object.keys(LAYER_META) as LayerKey[]).map((k) => {
          const { label, Icon } = LAYER_META[k];
          const active = layers[k];
          return (
            <Button
              key={k}
              size="sm"
              variant={active ? 'default' : 'outline'}
              onClick={() => toggle(k)}
              className="gap-1.5"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Button>
          );
        })}
      </div>

      <div className="relative rounded-lg overflow-hidden border border-border shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/60">
            <p className="text-sm text-muted-foreground">Loading map\u2026</p>
          </div>
        )}
        <div ref={mapRef} className="w-full h-[520px] bg-muted" />
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4 max-w-2xl mx-auto">
        Molise has no inscribed UNESCO site, but the tratturi pastoral routes sit on Italy\u2019s tentative list \u2014
        and the heritage scattered across the region punches well above its size.
      </p>

      <style>{`
        .mol-poi-wrap { background: transparent !important; border: none !important; }
        .mol-poi {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--border));
          box-shadow: 0 2px 5px rgba(0,0,0,.25);
          cursor: pointer; transition: transform .15s ease;
        }
        .mol-poi:hover { transform: scale(1.18); }
        .mol-poi-heritage { color: hsl(38 80% 40%); border-color: hsl(38 80% 45%); background: hsl(38 80% 95%); }
        .mol-poi-wine { color: hsl(var(--destructive)); border-color: hsl(var(--destructive)); background: hsl(var(--destructive) / .12); }
        .mol-poi-park { color: hsl(142 55% 30%); border-color: hsl(142 55% 35%); background: hsl(142 55% 94%); }
        .mol-poi-transport { color: hsl(var(--primary)); border-color: hsl(var(--primary)); background: hsl(var(--primary) / .12); }
        .leaflet-container { background: hsl(var(--muted)); z-index: 0; }
      `}</style>
    </section>
  );
};

export default MoliseDiscoveryMap;