import React, { useState } from 'react';
import { Train, TrainFront, Mountain, BusFront, MapPin, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface StationData {
  name: string;
  x: number;
  y: number;
  networks: string[];
  type: 'major-hub' | 'regional-hub' | 'local-stop';
  population: string;
  dailyTrains: number;
  connections: Array<{
    to: string;
    time: string;
    frequency: string;
    network: string;
  }>;
  highlights: string[];
  accessibility: {
    staffed: boolean;
    ticketOffice: boolean;
    elevator: boolean;
  };
}

interface PugliaRailNetworkMapProps {
  networks: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
  }>;
}

export function PugliaRailNetworkMap({ networks }: PugliaRailNetworkMapProps) {
  const [visibleNetworks, setVisibleNetworks] = useState<Set<string>>(
    new Set(networks.map(n => n.id))
  );
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const isMobile = useIsMobile();

  const toggleNetwork = (id: string) => {
    setVisibleNetworks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isVisible = (networkId: string) => visibleNetworks.has(networkId);

  // Enhanced stations with rich metadata
  const stations: StationData[] = [
    {
      name: 'Bari', x: 320, y: 180, 
      networks: ['trenitalia', 'fse', 'ferrotramviaria', 'fal'],
      type: 'major-hub', population: '320,000', dailyTrains: 150,
      connections: [
        { to: 'Lecce', time: '1h 30min', frequency: 'Every hour', network: 'trenitalia' },
        { to: 'Roma', time: '4h', frequency: 'Hourly Frecce', network: 'trenitalia' },
        { to: 'Airport', time: '15min', frequency: 'Every 20min', network: 'ferrotramviaria' },
        { to: 'Matera', time: '1h 15min', frequency: '8 trains/day', network: 'fal' },
      ],
      highlights: ['Main regional hub', 'Airport connection', 'High-speed rail'],
      accessibility: { staffed: true, ticketOffice: true, elevator: true }
    },
    {
      name: 'Lecce', x: 420, y: 460,
      networks: ['trenitalia', 'fse', 'buses'],
      type: 'major-hub', population: '95,000', dailyTrains: 85,
      connections: [
        { to: 'Bari', time: '1h 30min', frequency: 'Every hour', network: 'trenitalia' },
        { to: 'Roma', time: '5h 30min', frequency: '6 trains/day', network: 'trenitalia' },
        { to: 'Gallipoli', time: '35min', frequency: 'Every 90min', network: 'fse' },
        { to: 'Otranto', time: '50min', frequency: '8 buses/day', network: 'buses' },
      ],
      highlights: ['Baroque capital', 'Salento gateway', 'Cultural hub'],
      accessibility: { staffed: true, ticketOffice: true, elevator: true }
    },
    {
      name: 'Foggia', x: 200, y: 80,
      networks: ['trenitalia', 'fal', 'buses'],
      type: 'major-hub', population: '150,000', dailyTrains: 95,
      connections: [
        { to: 'Bari', time: '1h 45min', frequency: 'Every 90min', network: 'trenitalia' },
        { to: 'Napoli', time: '2h 30min', frequency: 'Every 2hrs', network: 'trenitalia' },
        { to: 'Roma', time: '3h 45min', frequency: '10 trains/day', network: 'trenitalia' },
      ],
      highlights: ['Northern hub', 'Gateway to Gargano', 'Agricultural center'],
      accessibility: { staffed: true, ticketOffice: true, elevator: true }
    },
    {
      name: 'Brindisi', x: 400, y: 340,
      networks: ['trenitalia', 'fse'],
      type: 'regional-hub', population: '87,000', dailyTrains: 65,
      connections: [
        { to: 'Bari', time: '1h 15min', frequency: 'Every 90min', network: 'trenitalia' },
        { to: 'Lecce', time: '35min', frequency: 'Every hour', network: 'trenitalia' },
        { to: 'Ostuni', time: '20min', frequency: 'Every hour', network: 'trenitalia' },
      ],
      highlights: ['Airport hub', 'Ferry port to Greece', 'Ancient Roman port'],
      accessibility: { staffed: true, ticketOffice: true, elevator: true }
    },
    {
      name: 'Taranto', x: 240, y: 360,
      networks: ['trenitalia', 'fse'],
      type: 'regional-hub', population: '195,000', dailyTrains: 55,
      connections: [
        { to: 'Bari', time: '1h 30min', frequency: 'Every 2hrs', network: 'trenitalia' },
        { to: 'Martina Franca', time: '45min', frequency: '8 trains/day', network: 'fse' },
        { to: 'Brindisi', time: '1h 20min', frequency: '6 trains/day', network: 'trenitalia' },
      ],
      highlights: ['Ionian coast city', 'Naval base', 'Seafood capital'],
      accessibility: { staffed: true, ticketOffice: true, elevator: false }
    },
    {
      name: 'Ostuni', x: 380, y: 280,
      networks: ['trenitalia', 'fse'],
      type: 'regional-hub', population: '32,000', dailyTrains: 42,
      connections: [
        { to: 'Bari', time: '50min', frequency: 'Every hour', network: 'trenitalia' },
        { to: 'Brindisi', time: '20min', frequency: 'Every hour', network: 'trenitalia' },
        { to: 'Martina Franca', time: '30min', frequency: 'Every 90min', network: 'fse' },
      ],
      highlights: ['The White City', 'Valle d\'Itria gateway', 'Expat favorite'],
      accessibility: { staffed: true, ticketOffice: true, elevator: false }
    },
    {
      name: 'Monopoli', x: 360, y: 220,
      networks: ['trenitalia', 'fse'],
      type: 'regional-hub', population: '49,000', dailyTrains: 38,
      connections: [
        { to: 'Bari', time: '30min', frequency: 'Every 30min', network: 'trenitalia' },
        { to: 'Polignano', time: '10min', frequency: 'Every 30min', network: 'trenitalia' },
        { to: 'Ostuni', time: '25min', frequency: 'Every hour', network: 'trenitalia' },
      ],
      highlights: ['Coastal gem', 'Old port town', 'Active fishing harbor'],
      accessibility: { staffed: true, ticketOffice: true, elevator: false }
    },
    {
      name: 'Martina Franca', x: 340, y: 320,
      networks: ['fse'],
      type: 'regional-hub', population: '48,000', dailyTrains: 24,
      connections: [
        { to: 'Lecce', time: '1h 40min', frequency: '6 trains/day', network: 'fse' },
        { to: 'Taranto', time: '45min', frequency: '8 trains/day', network: 'fse' },
        { to: 'Ostuni', time: '30min', frequency: 'Every 90min', network: 'fse' },
      ],
      highlights: ['Valle d\'Itria heart', 'Baroque architecture', 'Hill town charm'],
      accessibility: { staffed: true, ticketOffice: true, elevator: false }
    },
    {
      name: 'Trani', x: 260, y: 150,
      networks: ['ferrotramviaria', 'trenitalia'],
      type: 'local-stop', population: '55,000', dailyTrains: 32,
      connections: [
        { to: 'Bari', time: '40min', frequency: 'Every 30min', network: 'ferrotramviaria' },
        { to: 'Barletta', time: '10min', frequency: 'Every 20min', network: 'ferrotramviaria' },
      ],
      highlights: ['Cathedral by the sea', 'Adriatic beauty', 'Medieval port'],
      accessibility: { staffed: true, ticketOffice: false, elevator: false }
    },
    {
      name: 'Barletta', x: 240, y: 140,
      networks: ['ferrotramviaria', 'trenitalia'],
      type: 'local-stop', population: '94,000', dailyTrains: 35,
      connections: [
        { to: 'Bari', time: '50min', frequency: 'Every 30min', network: 'ferrotramviaria' },
        { to: 'Trani', time: '10min', frequency: 'Every 20min', network: 'ferrotramviaria' },
      ],
      highlights: ['Historic center', 'Colossus statue', 'Coastal city'],
      accessibility: { staffed: true, ticketOffice: true, elevator: false }
    },
    {
      name: 'Polignano', x: 350, y: 210,
      networks: ['trenitalia'],
      type: 'local-stop', population: '18,000', dailyTrains: 28,
      connections: [
        { to: 'Bari', time: '35min', frequency: 'Every 30min', network: 'trenitalia' },
        { to: 'Monopoli', time: '10min', frequency: 'Every 30min', network: 'trenitalia' },
      ],
      highlights: ['Clifftop town', 'Beach caves', 'Instagram famous'],
      accessibility: { staffed: false, ticketOffice: false, elevator: false }
    },
    {
      name: 'Alberobello', x: 320, y: 290,
      networks: ['fse'],
      type: 'local-stop', population: '11,000', dailyTrains: 18,
      connections: [
        { to: 'Martina Franca', time: '20min', frequency: '6 trains/day', network: 'fse' },
        { to: 'Bari', time: '1h 50min', frequency: '6 trains/day', network: 'fse' },
      ],
      highlights: ['UNESCO trulli houses', 'Fairytale town', 'Tourist magnet'],
      accessibility: { staffed: false, ticketOffice: false, elevator: false }
    },
    {
      name: 'Locorotondo', x: 330, y: 300,
      networks: ['fse'],
      type: 'local-stop', population: '14,000', dailyTrains: 16,
      connections: [
        { to: 'Martina Franca', time: '15min', frequency: '6 trains/day', network: 'fse' },
        { to: 'Alberobello', time: '10min', frequency: '6 trains/day', network: 'fse' },
      ],
      highlights: ['Circular old town', 'White wine region', 'Quiet charm'],
      accessibility: { staffed: false, ticketOffice: false, elevator: false }
    },
    {
      name: 'Gallipoli', x: 340, y: 520,
      networks: ['buses', 'fse'],
      type: 'local-stop', population: '20,000', dailyTrains: 14,
      connections: [
        { to: 'Lecce', time: '35min', frequency: 'Every 90min', network: 'fse' },
        { to: 'Otranto', time: '1h 15min', frequency: '5 buses/day', network: 'buses' },
      ],
      highlights: ['Ionian beach town', 'Walled old town', 'Summer destination'],
      accessibility: { staffed: false, ticketOffice: false, elevator: false }
    },
    {
      name: 'Otranto', x: 460, y: 540,
      networks: ['buses', 'fse'],
      type: 'local-stop', population: '5,800', dailyTrains: 12,
      connections: [
        { to: 'Lecce', time: '50min', frequency: '8 buses/day', network: 'buses' },
        { to: 'Gallipoli', time: '1h 15min', frequency: '5 buses/day', network: 'buses' },
      ],
      highlights: ['Adriatic easternmost point', 'Medieval castle', 'Beach paradise'],
      accessibility: { staffed: false, ticketOffice: false, elevator: false }
    },
  ];

  // Network color map
  const networkColors: Record<string, string> = {
    trenitalia: 'hsl(142 71% 45%)',
    fse: 'hsl(142 76% 36%)',
    ferrotramviaria: 'hsl(217 91% 60%)',
    fal: 'hsl(24 95% 53%)',
    buses: 'hsl(280 65% 60%)',
  };

  const getStationSize = (type: string) => {
    switch (type) {
      case 'major-hub': return 10;
      case 'regional-hub': return 7;
      default: return 5;
    }
  };

  const getLabelSize = (type: string) => {
    switch (type) {
      case 'major-hub': return 'text-[14px] md:text-[16px]';
      case 'regional-hub': return 'text-[11px] md:text-[13px]';
      default: return 'text-[9px] md:text-[11px]';
    }
  };

  const StationDialog = () => (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <Train className="w-8 h-8 text-primary" />
          <DialogTitle className="text-2xl">{selectedStation?.name}</DialogTitle>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="capitalize">{selectedStation?.type.replace('-', ' ')}</Badge>
          <Badge variant="secondary">{selectedStation?.population} residents</Badge>
          <Badge>{selectedStation?.dailyTrains} trains/day</Badge>
        </div>
      </DialogHeader>

      {/* Network Badges */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-muted-foreground">Available Networks</h4>
        <div className="flex gap-2 flex-wrap">
          {selectedStation?.networks.map(net => (
            <Badge
              key={net}
              style={{ backgroundColor: networkColors[net] }}
              className="text-white"
            >
              {networks.find(n => n.id === net)?.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Connections */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Direct Connections
        </h4>
        {selectedStation?.connections.map((conn, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">{conn.to}</p>
              <p className="text-sm text-muted-foreground">{conn.frequency}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">{conn.time}</p>
              <Badge variant="outline" className="text-xs">{conn.network}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <div className="space-y-2">
        <h4 className="font-semibold">Station Highlights</h4>
        <ul className="space-y-1">
          {selectedStation?.highlights.map((highlight, idx) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Accessibility */}
      <div className="space-y-2 pt-4 border-t">
        <h4 className="font-semibold text-sm">Accessibility & Services</h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className={selectedStation?.accessibility.staffed ? 'text-green-600' : 'text-muted-foreground'}>
            {selectedStation?.accessibility.staffed ? '✓' : '✗'} Staffed
          </div>
          <div className={selectedStation?.accessibility.ticketOffice ? 'text-green-600' : 'text-muted-foreground'}>
            {selectedStation?.accessibility.ticketOffice ? '✓' : '✗'} Ticket Office
          </div>
          <div className={selectedStation?.accessibility.elevator ? 'text-green-600' : 'text-muted-foreground'}>
            {selectedStation?.accessibility.elevator ? '✓' : '✗'} Elevator
          </div>
        </div>
      </div>

      {/* Footer tip */}
      <div className="bg-primary/5 rounded-lg p-3 text-sm italic text-muted-foreground">
        💡 Tip: Check Trenitalia.com or FSEonline.it for live schedules
      </div>
    </DialogContent>
  );

  return (
    <div className="py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Train className="w-10 h-10 text-primary animate-pulse" />
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              The Visual Rail Network
            </h3>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click any station to see detailed connections, schedules, and accessibility info. 
            Toggle networks to explore specific routes.
          </p>
        </div>

        {/* Network Toggle Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {networks.map(network => (
            <button
              key={network.id}
              onClick={() => toggleNetwork(network.id)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                isVisible(network.id)
                  ? 'shadow-lg scale-105'
                  : 'opacity-40 grayscale'
              }`}
              style={{
                borderColor: networkColors[network.id] || 'hsl(var(--border))',
                backgroundColor: isVisible(network.id) 
                  ? `${networkColors[network.id]}20` 
                  : 'transparent',
              }}
            >
              <span className="font-semibold text-sm">{network.name}</span>
            </button>
          ))}
        </div>

        {/* SVG Map */}
        <div className="relative bg-gradient-to-br from-muted/30 to-background rounded-2xl shadow-xl p-8 overflow-hidden">
          <svg
            viewBox="0 0 600 600"
            className="w-full h-auto max-w-4xl mx-auto"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
          >
            {/* Puglia region outline (simplified) */}
            <path
              d="M 180 60 L 240 140 L 260 150 L 320 180 L 380 200 L 420 260 L 440 340 L 460 420 L 470 500 L 450 540 L 400 560 L 340 570 L 300 550 L 260 520 L 240 480 L 220 440 L 200 400 L 180 360 L 160 300 L 150 240 L 160 180 L 180 120 Z"
              fill="hsl(var(--muted))"
              opacity="0.15"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="5,5"
            />

            {/* Rail Lines */}
            
            {/* Trenitalia - Main north-south corridor */}
            {isVisible('trenitalia') && (
              <g className="transition-opacity duration-500">
                <path
                  d="M 200 80 L 240 140 L 260 150 L 320 180 L 360 220 L 380 280 L 400 340 L 420 460"
                  stroke={networkColors.trenitalia}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.9"
                  style={{ filter: `drop-shadow(0 0 8px ${networkColors.trenitalia})` }}
                />
                {/* Animated train */}
                <circle r="8" fill={networkColors.trenitalia} className="shadow-lg">
                  <animateMotion dur="25s" repeatCount="indefinite">
                    <mpath href="#trenitalia-path" />
                  </animateMotion>
                </circle>
                <path id="trenitalia-path" d="M 200 80 L 240 140 L 260 150 L 320 180 L 360 220 L 380 280 L 400 340 L 420 460" fill="none" opacity="0" />
              </g>
            )}

            {/* FSE - Valle d'Itria loop */}
            {isVisible('fse') && (
              <g className="transition-opacity duration-500">
                <path
                  d="M 320 180 L 320 290 L 330 300 L 340 320 L 380 280 L 400 340 L 420 460 L 420 520 L 460 540"
                  stroke={networkColors.fse}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.85"
                  style={{ filter: `drop-shadow(0 0 6px ${networkColors.fse})` }}
                />
                {/* Animated train */}
                <circle r="7" fill={networkColors.fse}>
                  <animateMotion dur="35s" repeatCount="indefinite">
                    <mpath href="#fse-path" />
                  </animateMotion>
                </circle>
                <path id="fse-path" d="M 320 180 L 320 290 L 330 300 L 340 320 L 380 280 L 400 340 L 420 460 L 420 520 L 460 540" fill="none" opacity="0" />
              </g>
            )}

            {/* Ferrotramviaria - Northern corridor + Bari Airport */}
            {isVisible('ferrotramviaria') && (
              <g className="transition-opacity duration-500">
                <path
                  d="M 240 140 L 260 150 L 320 180"
                  stroke={networkColors.ferrotramviaria}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.85"
                  style={{ filter: `drop-shadow(0 0 6px ${networkColors.ferrotramviaria})` }}
                />
                {/* Animated train */}
                <circle r="7" fill={networkColors.ferrotramviaria}>
                  <animateMotion dur="15s" repeatCount="indefinite">
                    <mpath href="#ferro-path" />
                  </animateMotion>
                </circle>
                <path id="ferro-path" d="M 240 140 L 260 150 L 320 180" fill="none" opacity="0" />
              </g>
            )}

            {/* FAL - Inland routes toward Matera */}
            {isVisible('fal') && (
              <g className="transition-opacity duration-500">
                <path
                  d="M 320 180 L 280 220 L 240 260 L 200 300"
                  stroke={networkColors.fal}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.8"
                  strokeDasharray="8,4"
                  style={{ filter: `drop-shadow(0 0 5px ${networkColors.fal})` }}
                />
                {/* Animated train */}
                <circle r="6" fill={networkColors.fal}>
                  <animateMotion dur="20s" repeatCount="indefinite">
                    <mpath href="#fal-path" />
                  </animateMotion>
                </circle>
                <path id="fal-path" d="M 320 180 L 280 220 L 240 260 L 200 300" fill="none" opacity="0" />
              </g>
            )}

            {/* Regional Buses - Dotted lines filling gaps */}
            {isVisible('buses') && (
              <g className="transition-opacity duration-500">
                <path
                  d="M 420 460 L 340 520 M 420 460 L 460 540 M 200 80 L 160 120"
                  stroke={networkColors.buses}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="6,6"
                  opacity="0.7"
                />
              </g>
            )}

            {/* Station markers with permanent labels */}
            {stations.map((station, idx) => {
              const hasVisibleNetwork = station.networks.some(n => isVisible(n));
              if (!hasVisibleNetwork) return null;
              
              const isSelected = selectedStation?.name === station.name;
              const radius = getStationSize(station.type);

              return (
                <g key={idx} className="station-marker">
                  {/* Pulse ring for selected station */}
                  {isSelected && (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r="15"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}
                  
                  {/* Station marker */}
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r={radius}
                    fill="hsl(var(--background))"
                    stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
                    strokeWidth={isSelected ? '3' : '2'}
                    onClick={() => setSelectedStation(station)}
                    className={`cursor-pointer transition-all duration-300 hover:scale-150 ${isSelected ? 'scale-150' : ''}`}
                    style={{
                      filter: isSelected 
                        ? 'drop-shadow(0 0 8px hsl(var(--primary)))' 
                        : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    }}
                  />
                  
                  {/* Permanent station label */}
                  <text
                    x={station.x}
                    y={station.y - (radius + 8)}
                    textAnchor="middle"
                    className={`${getLabelSize(station.type)} font-semibold fill-foreground pointer-events-none`}
                    style={{
                      textShadow: '0 0 3px hsl(var(--background)), 0 0 5px hsl(var(--background))',
                      paintOrder: 'stroke fill'
                    }}
                  >
                    {station.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground italic">
            Click station markers to see detailed connections and schedules. Lines show approximate routes—not exact paths.
          </p>
        </div>
      </div>

      {/* Station Detail Modal */}
      {isMobile ? (
        <Sheet open={!!selectedStation} onOpenChange={() => setSelectedStation(null)}>
          <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
            <StationDialog />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={!!selectedStation} onOpenChange={() => setSelectedStation(null)}>
          <StationDialog />
        </Dialog>
      )}
    </div>
  );
}
