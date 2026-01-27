import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Train, Car, Building2, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';

// Anchor cities
const ROME_COORDS: [number, number] = [41.9028, 12.4964];
const FLORENCE_COORDS: [number, number] = [43.7696, 11.2558];
const UMBRIA_CENTER: [number, number] = [42.85, 12.55];

interface CorridorTown {
  id: string;
  name: string;
  coords: [number, number];
  toRome: { time: string; method: 'train' | 'car'; station?: string; note?: string };
  toFlorence: { time: string; method: 'train' | 'car'; station?: string; note?: string };
  nearestHospital: { name: string; distance: string };
  lifestyle: string;
}

const corridorTowns: CorridorTown[] = [
  {
    id: 'orvieto',
    name: 'Orvieto',
    coords: [42.7186, 12.1107],
    toRome: { time: '~1h', method: 'train', station: 'Orvieto', note: 'Direct high-speed' },
    toFlorence: { time: '~1h30', method: 'train', station: 'Orvieto', note: '1 change at Roma Termini or direct regional' },
    nearestHospital: { name: 'Ospedale Santa Maria della Stella', distance: 'In town' },
    lifestyle: 'The gateway—fast rail to Rome, dramatic hilltop living, UNESCO-worthy duomo.'
  },
  {
    id: 'perugia',
    name: 'Perugia',
    coords: [43.1107, 12.3908],
    toRome: { time: '~2h', method: 'train', station: 'Perugia', note: 'Regional or bus connection' },
    toFlorence: { time: '~2h', method: 'train', station: 'Perugia', note: 'Regional via Terontola' },
    nearestHospital: { name: 'Azienda Ospedaliera di Perugia', distance: 'In city' },
    lifestyle: 'The brain—university town, regional healthcare hub, international airport.'
  },
  {
    id: 'spoleto',
    name: 'Spoleto',
    coords: [42.7312, 12.7365],
    toRome: { time: '~1h15', method: 'train', station: 'Spoleto', note: 'Direct Intercity' },
    toFlorence: { time: '~2h', method: 'train', station: 'Spoleto', note: '1 change' },
    nearestHospital: { name: 'Ospedale San Matteo degli Infermi', distance: 'In town' },
    lifestyle: 'Cultural elegance—festival town, Roman bridges, manageable scale.'
  },
  {
    id: 'terni',
    name: 'Terni',
    coords: [42.5636, 12.6475],
    toRome: { time: '~1h', method: 'train', station: 'Terni', note: 'Direct regional' },
    toFlorence: { time: '~2h30', method: 'train', station: 'Terni', note: 'Via Roma or Orte' },
    nearestHospital: { name: 'Azienda Ospedaliera Santa Maria', distance: 'In city' },
    lifestyle: 'Industrial practicality—major hospital, Rome commuter belt, affordable.'
  },
  {
    id: 'foligno',
    name: 'Foligno',
    coords: [42.9498, 12.7134],
    toRome: { time: '~1h45', method: 'train', station: 'Foligno', note: 'Rail junction' },
    toFlorence: { time: '~1h45', method: 'train', station: 'Foligno', note: 'Rail junction' },
    nearestHospital: { name: 'Ospedale San Giovanni Battista', distance: 'In town' },
    lifestyle: 'The crossroads—rail junction, equally positioned between capitals.'
  },
  {
    id: 'assisi',
    name: 'Assisi',
    coords: [43.0707, 12.6195],
    toRome: { time: '~2h', method: 'train', station: 'Assisi', note: 'Regional service' },
    toFlorence: { time: '~2h', method: 'train', station: 'Assisi', note: 'Via Terontola' },
    nearestHospital: { name: 'Perugia hospital', distance: '25 min drive' },
    lifestyle: 'Spiritual magnet—UNESCO site, pilgrim infrastructure, tourist economy.'
  },
  {
    id: 'todi',
    name: 'Todi',
    coords: [42.7819, 12.4064],
    toRome: { time: '~1h30', method: 'car', note: 'No direct rail' },
    toFlorence: { time: '~1h30', method: 'car', note: 'No direct rail' },
    nearestHospital: { name: 'Orvieto hospital', distance: '30 min drive' },
    lifestyle: 'Hilltop serenity—car-dependent but perfectly centered, expat favorite.'
  },
  {
    id: 'citta-di-castello',
    name: 'Città di Castello',
    coords: [43.4571, 12.2387],
    toRome: { time: '~2h30', method: 'car', note: 'Limited rail' },
    toFlorence: { time: '~1h', method: 'car', note: 'Quick A1 access' },
    nearestHospital: { name: 'Ospedale Città di Castello', distance: 'In town' },
    lifestyle: 'Northern gateway—Tuscan proximity, artisan traditions, own hospital.'
  }
];

// High-speed rail spine coordinates (simplified path through Umbria)
const railSpine: [number, number][] = [
  ROME_COORDS,
  [42.2500, 12.3500], // Orte junction
  [42.7186, 12.1107], // Orvieto
  [43.0500, 11.8000], // Chiusi area
  FLORENCE_COORDS
];

export default function UmbriaRomeFlorenceCorridor() {
  const [selectedTown, setSelectedTown] = useState<CorridorTown>(corridorTowns[0]);

  const getMarkerColor = (town: CorridorTown) => {
    // Color by closest capital
    const toRomeMinutes = parseInt(town.toRome.time.replace(/\D/g, '')) || 999;
    const toFlorenceMinutes = parseInt(town.toFlorence.time.replace(/\D/g, '')) || 999;
    
    if (toRomeMinutes < toFlorenceMinutes) return '#dc2626'; // Red for Rome-closer
    if (toFlorenceMinutes < toRomeMinutes) return '#7c3aed'; // Purple for Florence-closer
    return '#059669'; // Green for equidistant
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            The Rome-Florence Corridor
          </h2>
          <p className="text-lg text-muted-foreground">
            Umbria sits between Italy's two capitals—use them both
          </p>
        </div>

        {/* Intro text */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-muted-foreground italic">
            "Umbria isn't isolated—it's positioned. From Orvieto, reach Rome in one hour or Florence in ninety minutes. This dual access is Umbria's infrastructure story."
          </p>
        </div>

        {/* Interactive Map */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="relative rounded-xl overflow-hidden shadow-lg border border-border bg-background">
            <MapContainer
              center={UMBRIA_CENTER}
              zoom={8}
              scrollWheelZoom={false}
              className="h-[400px] md:h-[500px] w-full"
              style={{ background: '#f8fafc' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              
              {/* High-speed rail spine */}
              <Polyline
                positions={railSpine}
                pathOptions={{
                  color: '#dc2626',
                  weight: 4,
                  opacity: 0.7,
                  dashArray: '10, 5'
                }}
              />
              
              {/* Rome anchor */}
              <CircleMarker
                center={ROME_COORDS}
                radius={16}
                pathOptions={{
                  color: '#1e293b',
                  fillColor: '#dc2626',
                  fillOpacity: 1,
                  weight: 3
                }}
              >
                <Popup>
                  <div className="text-center font-semibold">Roma</div>
                  <div className="text-xs text-gray-500">Capital anchor</div>
                </Popup>
              </CircleMarker>
              
              {/* Florence anchor */}
              <CircleMarker
                center={FLORENCE_COORDS}
                radius={16}
                pathOptions={{
                  color: '#1e293b',
                  fillColor: '#7c3aed',
                  fillOpacity: 1,
                  weight: 3
                }}
              >
                <Popup>
                  <div className="text-center font-semibold">Firenze</div>
                  <div className="text-xs text-gray-500">Capital anchor</div>
                </Popup>
              </CircleMarker>
              
              {/* Town markers */}
              {corridorTowns.map((town) => (
                <CircleMarker
                  key={town.id}
                  center={town.coords}
                  radius={selectedTown.id === town.id ? 10 : 7}
                  pathOptions={{
                    color: '#fff',
                    fillColor: getMarkerColor(town),
                    fillOpacity: selectedTown.id === town.id ? 1 : 0.8,
                    weight: selectedTown.id === town.id ? 3 : 2
                  }}
                  eventHandlers={{
                    click: () => setSelectedTown(town)
                  }}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <div className="font-semibold text-base mb-1">{town.name}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500" /> Roma: {town.toRome.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-purple-500" /> Firenze: {town.toFlorence.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{town.lifestyle}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
            
            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-md border border-border text-xs z-[1000]">
              <div className="font-medium mb-2">Closest capital</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600" />
                  <span>Closer to Rome</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>Closer to Florence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>Equidistant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Town Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Select a town to see your dual-city access:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {corridorTowns.map((town) => (
              <button
                key={town.id}
                onClick={() => setSelectedTown(town)}
                className={cn(
                  "px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium",
                  "hover:border-primary/50",
                  selectedTown.id === town.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {town.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Town Details */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Town info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{selectedTown.name}</h3>
                  <p className="text-muted-foreground mb-4">{selectedTown.lifestyle}</p>
                  
                  {/* Travel times */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold text-sm">ROME</span>
                      </div>
                      <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                        {selectedTown.toRome.method === 'train' ? <Train className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                        {selectedTown.toRome.time}
                      </div>
                      {selectedTown.toRome.note && (
                        <p className="text-xs text-muted-foreground mt-1">{selectedTown.toRome.note}</p>
                      )}
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold text-sm">FLORENCE</span>
                      </div>
                      <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                        {selectedTown.toFlorence.method === 'train' ? <Train className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                        {selectedTown.toFlorence.time}
                      </div>
                      {selectedTown.toFlorence.note && (
                        <p className="text-xs text-muted-foreground mt-1">{selectedTown.toFlorence.note}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Hospital info */}
                  <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                    <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Nearest Hospital</p>
                      <p className="text-muted-foreground text-sm">{selectedTown.nearestHospital.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedTown.nearestHospital.distance}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Closing text */}
        <div className="max-w-2xl mx-auto text-center mt-12 space-y-4">
          <p className="text-muted-foreground italic">
            "The question isn't whether Umbria is connected—it's which capital you'll use this weekend."
          </p>
          <p className="text-xs text-muted-foreground/70">
            Travel times are approximate and based on standard schedules. High-speed options via Orvieto offer the fastest Rome access.
          </p>
        </div>
      </div>
    </section>
  );
}
