import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Train, Building2, Plane, Theater, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Town {
  id: string;
  name: string;
  trainTime: number;
  trainTimeLabel: string;
  station: string;
  lifestyle: string;
  whyItWorks: string;
  relevance: ('healthcare' | 'travel' | 'culture')[];
  lat: number;
  lng: number;
}

const MILAN_COORDS: [number, number] = [45.4642, 9.1900];

const towns: Town[] = [
  // Within 30 minutes
  {
    id: 'monza',
    name: 'Monza',
    trainTime: 12,
    trainTimeLabel: '10–15 min',
    station: 'Monza',
    lifestyle: 'Affluent, residential, highly organized, with major green space and zero tourist theater.',
    whyItWorks: "You're effectively inside Milan's ecosystem without paying Milan's lifestyle tax.",
    relevance: ['healthcare', 'travel', 'culture'],
    lat: 45.5845,
    lng: 9.2744
  },
  {
    id: 'sesto',
    name: 'Sesto San Giovanni',
    trainTime: 17,
    trainTimeLabel: '15–20 min',
    station: 'Sesto San Giovanni',
    lifestyle: 'Dense, practical, and well connected; historically industrial, now residential.',
    whyItWorks: 'Direct access to hospitals, transit, and services with no pretense.',
    relevance: ['healthcare', 'travel'],
    lat: 45.5364,
    lng: 9.2380
  },
  {
    id: 'lodi',
    name: 'Lodi',
    trainTime: 27,
    trainTimeLabel: '25–30 min',
    station: 'Lodi',
    lifestyle: 'Smaller city with a real local rhythm and reliable rail access.',
    whyItWorks: 'Calm daily life with Milan available on demand.',
    relevance: ['healthcare', 'travel', 'culture'],
    lat: 45.3138,
    lng: 9.5034
  },
  {
    id: 'pavia',
    name: 'Pavia',
    trainTime: 30,
    trainTimeLabel: '~30 min',
    station: 'Pavia',
    lifestyle: 'University town, walkable center, quieter intellectual atmosphere.',
    whyItWorks: "Access to Milan's gravity without losing identity.",
    relevance: ['healthcare', 'culture'],
    lat: 45.1847,
    lng: 9.1582
  },
  // Within 45 minutes
  {
    id: 'como',
    name: 'Como',
    trainTime: 37,
    trainTimeLabel: '35–40 min',
    station: 'Como San Giovanni',
    lifestyle: 'Functional lake city with year-round services and rail access.',
    whyItWorks: 'Lake access with urban reliability, if you accept tourism.',
    relevance: ['healthcare', 'travel', 'culture'],
    lat: 45.8081,
    lng: 9.0852
  },
  {
    id: 'busto',
    name: 'Busto Arsizio',
    trainTime: 37,
    trainTimeLabel: '35–40 min',
    station: 'Busto Arsizio',
    lifestyle: 'Unglamorous but extremely well connected; strong services.',
    whyItWorks: 'You trade charm for access and affordability.',
    relevance: ['healthcare', 'travel'],
    lat: 45.6120,
    lng: 8.8518
  },
  {
    id: 'varese',
    name: 'Varese',
    trainTime: 42,
    trainTimeLabel: '40–45 min',
    station: 'Varese',
    lifestyle: 'Green, residential, quietly affluent, near the Swiss border.',
    whyItWorks: 'Order, healthcare access, and breathing room.',
    relevance: ['healthcare', 'travel'],
    lat: 45.8206,
    lng: 8.8257
  },
  {
    id: 'bergamo',
    name: 'Bergamo',
    trainTime: 49,
    trainTimeLabel: '48–50 min',
    station: 'Bergamo',
    lifestyle: 'Historic upper city plus modern lower city; strong healthcare and airport access.',
    whyItWorks: "You get Milan's benefits without living under its pressure.",
    relevance: ['healthcare', 'travel', 'culture'],
    lat: 45.6983,
    lng: 9.6773
  },
  // Within 60 minutes
  {
    id: 'brescia',
    name: 'Brescia',
    trainTime: 53,
    trainTimeLabel: '52–55 min',
    station: 'Brescia',
    lifestyle: 'Industrial, understated, highly functional city with strong hospitals.',
    whyItWorks: "Full-service city life without Milan's density.",
    relevance: ['healthcare', 'travel'],
    lat: 45.5416,
    lng: 10.2118
  },
  {
    id: 'lecco',
    name: 'Lecco',
    trainTime: 57,
    trainTimeLabel: '55–60 min',
    station: 'Lecco',
    lifestyle: 'Mountain-lake city with strong rail links and active local life.',
    whyItWorks: 'Nature and function coexist without resort behavior.',
    relevance: ['healthcare', 'culture'],
    lat: 45.8566,
    lng: 9.3977
  },
  {
    id: 'cremona',
    name: 'Cremona',
    trainTime: 60,
    trainTimeLabel: '~60 min',
    station: 'Cremona',
    lifestyle: 'Elegant, unhurried, culturally rich, with stable daily rhythms.',
    whyItWorks: 'Traditional city life with predictable access when needed.',
    relevance: ['culture'],
    lat: 45.1333,
    lng: 10.0244
  },
  {
    id: 'mantova',
    name: 'Mantova',
    trainTime: 63,
    trainTimeLabel: '60–65 min',
    station: 'Mantova',
    lifestyle: 'Compact, Renaissance city with a calm, livable center.',
    whyItWorks: 'You accept distance in exchange for beauty and peace.',
    relevance: ['culture'],
    lat: 45.1564,
    lng: 10.7914
  }
];

const timeBands = [
  { value: 30, label: '30 minutes', description: 'Milan access without Milan intensity', radius: 25000 },
  { value: 45, label: '45 minutes', description: 'The sweet spot for most retirees', radius: 45000 },
  { value: 60, label: '60 minutes', description: 'Separation, not distance', radius: 70000 }
];

const reasons = [
  { value: 'healthcare', label: 'Healthcare', icon: Building2 },
  { value: 'travel', label: 'Travel', icon: Plane },
  { value: 'culture', label: 'Culture', icon: Theater },
  { value: 'all', label: 'All of the above', icon: MapPin }
];

function MapController({ selectedTime }: { selectedTime: number }) {
  const map = useMap();
  
  useEffect(() => {
    // Adjust zoom based on selected time
    const zoom = selectedTime === 30 ? 10 : selectedTime === 45 ? 9.5 : 9;
    map.setView(MILAN_COORDS, zoom, { animate: true });
  }, [selectedTime, map]);
  
  return null;
}

export function MilanProximityTool() {
  const [selectedTime, setSelectedTime] = useState<number>(45);
  const [selectedReason, setSelectedReason] = useState<string>('all');
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);

  const filteredTowns = useMemo(() => {
    return towns.filter(town => {
      const withinTime = town.trainTime <= selectedTime;
      const matchesReason = selectedReason === 'all' || 
        town.relevance.includes(selectedReason as 'healthcare' | 'travel' | 'culture');
      return withinTime && matchesReason;
    });
  }, [selectedTime, selectedReason]);

  const getBandLabel = (time: number) => {
    if (time <= 30) return '30 min';
    if (time <= 45) return '45 min';
    return '60 min';
  };

  const getMarkerColor = (town: Town) => {
    if (town.trainTime <= 30) return '#22c55e'; // green
    if (town.trainTime <= 45) return '#eab308'; // yellow
    return '#f97316'; // orange
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Live Near Milan, Not In It
          </h2>
          <p className="text-lg text-muted-foreground">
            How far you can live from Milan and still use it when it matters
          </p>
        </div>

        {/* Intro text */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-muted-foreground italic">
            "Most people don't need to live in Milan. They need to be able to use Milan."
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-8">
          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Maximum train time to Milan
            </label>
            <div className="flex flex-wrap gap-3">
              {timeBands.map((band) => (
                <button
                  key={band.value}
                  onClick={() => setSelectedTime(band.value)}
                  className={cn(
                    "px-5 py-3 rounded-lg border-2 transition-all duration-200",
                    "hover:border-primary/50",
                    selectedTime === band.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground"
                  )}
                >
                  <span className="font-semibold">{band.label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {timeBands.find(b => b.value === selectedTime)?.description}
            </p>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Primary reason you care about Milan
            </label>
            <div className="flex flex-wrap gap-3">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <button
                    key={reason.value}
                    onClick={() => setSelectedReason(reason.value)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200",
                      "hover:border-primary/50",
                      selectedReason === reason.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{reason.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="relative rounded-xl overflow-hidden shadow-lg border border-border bg-background">
            <MapContainer
              center={MILAN_COORDS}
              zoom={9.5}
              scrollWheelZoom={false}
              className="h-[450px] md:h-[550px] w-full"
              style={{ background: '#f8fafc' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              
              <MapController selectedTime={selectedTime} />
              
              {/* Distance circles from Milan */}
              {timeBands.map((band) => (
                <Circle
                  key={band.value}
                  center={MILAN_COORDS}
                  radius={band.radius}
                  pathOptions={{
                    color: selectedTime >= band.value ? 'hsl(var(--primary))' : '#94a3b8',
                    weight: selectedTime === band.value ? 3 : 1,
                    fillColor: selectedTime >= band.value ? 'hsl(var(--primary))' : 'transparent',
                    fillOpacity: selectedTime === band.value ? 0.08 : 0,
                    dashArray: selectedTime >= band.value ? undefined : '5, 5'
                  }}
                />
              ))}
              
              {/* Milan center marker */}
              <CircleMarker
                center={MILAN_COORDS}
                radius={12}
                pathOptions={{
                  color: '#1e293b',
                  fillColor: '#1e293b',
                  fillOpacity: 1,
                  weight: 3
                }}
              >
                <Popup>
                  <div className="text-center font-semibold">Milano</div>
                  <div className="text-xs text-gray-500">Reference point</div>
                </Popup>
              </CircleMarker>
              
              {/* Town markers */}
              {filteredTowns.map((town) => (
                <CircleMarker
                  key={town.id}
                  center={[town.lat, town.lng]}
                  radius={8}
                  pathOptions={{
                    color: '#fff',
                    fillColor: getMarkerColor(town),
                    fillOpacity: 0.9,
                    weight: 2
                  }}
                  eventHandlers={{
                    click: () => setSelectedTown(town)
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <div className="font-semibold text-base mb-1">{town.name}</div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                        <Train className="w-3.5 h-3.5" />
                        <span>{town.trainTimeLabel} to Milano Centrale</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{town.lifestyle}</p>
                      <p className="text-xs">
                        <span className="font-medium">Why it works:</span> {town.whyItWorks}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
            
            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-md border border-border text-xs z-[1000]">
              <div className="font-medium mb-2">Train time to Milan</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Under 30 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>30–45 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span>45–60 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {filteredTowns.length} town{filteredTowns.length !== 1 ? 's' : ''} within {selectedTime} minutes
            </h3>
          </div>

          {filteredTowns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No towns match your current filters. Try expanding your time range.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTowns.map((town) => (
                <div
                  key={town.id}
                  className={cn(
                    "bg-background rounded-lg border p-5 transition-colors cursor-pointer",
                    selectedTown?.id === town.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  )}
                  onClick={() => setSelectedTown(town)}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: getMarkerColor(town) }}
                        />
                        <h4 className="text-lg font-semibold text-foreground">{town.name}</h4>
                        <span className="text-sm px-2 py-0.5 bg-muted rounded text-muted-foreground">
                          {getBandLabel(town.trainTime)}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {town.lifestyle}
                      </p>
                      <p className="text-foreground text-sm">
                        <span className="font-medium">Why it works:</span> {town.whyItWorks}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0 md:text-right">
                      <Train className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-foreground">{town.trainTimeLabel}</div>
                        <div className="text-xs">to Milano Centrale</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer text */}
        <div className="max-w-2xl mx-auto text-center mt-12 space-y-4">
          <p className="text-muted-foreground italic">
            "Lombardia works best when you treat Milan as a resource, not a residence."
          </p>
          <p className="text-xs text-muted-foreground/70">
            Train times are approximate and reflect normal daytime schedules, not peak disruptions.
          </p>
        </div>
      </div>
    </section>
  );
}
