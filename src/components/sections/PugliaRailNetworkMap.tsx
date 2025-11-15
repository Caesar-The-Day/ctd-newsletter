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
            Click any station to view connections, schedules, and details. 
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
            {/* Real Puglia Map Outline */}
            <defs>
              <linearGradient id="water" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(200 60% 85%)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(200 60% 75%)" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Puglia Region SVG Outline */}
            <defs>
              <linearGradient id="adriaticGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="ionianGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.09" />
              </linearGradient>
            </defs>

            {/* Puglia land mass - distinctive boot heel shape */}
            <path
              d="M 180 30 
                 L 240 20 L 280 30 L 300 50 
                 L 280 70 L 260 80 L 240 90 
                 L 220 100 L 200 110
                 L 190 140 L 200 170 L 230 180
                 L 280 190 L 320 200 L 360 220
                 L 390 250 L 410 290 L 420 340
                 L 425 390 L 430 440 L 435 490
                 L 440 520 L 450 540 L 465 555
                 L 475 540 L 470 510 L 455 480
                 L 445 450 L 440 420 L 430 380
                 L 420 350 L 400 310 L 370 270
                 L 340 240 L 310 220 L 280 210
                 L 240 200 L 200 200 L 170 210
                 L 140 230 L 120 260 L 110 300
                 L 115 340 L 130 370 L 160 390
                 L 190 400 L 220 405 L 250 400
                 L 270 390 L 280 370 L 275 350
                 L 260 330 L 240 320 L 220 330
                 L 200 350 L 190 380 L 195 410
                 L 210 430 L 230 440 L 250 445
                 L 270 450 L 290 460 L 310 480
                 L 330 510 L 340 540 L 345 565
                 L 335 575 L 310 570 L 280 555
                 L 250 530 L 220 500 L 200 470
                 L 185 440 L 175 410 L 170 380
                 L 165 350 L 155 320 L 140 290
                 L 125 260 L 115 230 L 110 200
                 L 110 170 L 115 140 L 125 110
                 L 140 80 L 160 55 L 180 30 Z"
              fill="hsl(var(--muted))"
              fillOpacity="0.15"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              strokeOpacity="0.3"
              className="pointer-events-none"
            />

            {/* Adriatic Sea indication (east) */}
            <rect
              x="430" y="200" width="170" height="400"
              fill="url(#adriaticGradient)"
              className="pointer-events-none"
            />

            {/* Ionian Sea indication (south/west) */}
            <path
              d="M 100 400 L 350 580 L 0 580 L 0 400 Z"
              fill="url(#ionianGradient)"
              className="pointer-events-none"
            />

            {/* Sea labels */}
            <text x="500" y="350" className="text-xs fill-muted-foreground italic opacity-40" style={{ textShadow: '0 0 3px hsl(var(--background))' }}>
              Adriatic
            </text>
            <text x="500" y="365" className="text-xs fill-muted-foreground italic opacity-40" style={{ textShadow: '0 0 3px hsl(var(--background))' }}>
              Sea
            </text>
            <text x="150" y="560" className="text-xs fill-muted-foreground italic opacity-40" style={{ textShadow: '0 0 3px hsl(var(--background))' }}>
              Ionian Sea
            </text>

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

            {/* Trenitalia - Bari to Taranto via Martina Franca */}
            {isVisible('trenitalia') && (
              <g className="transition-opacity duration-500">
                <path
                  d="M 320 180 L 300 240 L 280 290 L 260 320 L 240 360"
                  stroke={networkColors.trenitalia}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.9"
                  style={{ filter: `drop-shadow(0 0 8px ${networkColors.trenitalia})` }}
                />
                {/* Animated train on Bari-Taranto route */}
                <circle r="8" fill={networkColors.trenitalia} className="shadow-lg">
                  <animateMotion dur="22s" repeatCount="indefinite">
                    <mpath href="#trenitalia-taranto-path" />
                  </animateMotion>
                </circle>
                <path id="trenitalia-taranto-path" d="M 320 180 L 300 240 L 280 290 L 260 320 L 240 360" fill="none" opacity="0" />
              </g>
            )}

            {/* FSE - Valle d'Itria loop connecting Taranto to Lecce */}
            {isVisible('fse') && (
              <g className="transition-opacity duration-500">
                <path
                  d="M 240 360 L 280 340 L 300 320 L 330 300 L 340 320 L 380 280 L 400 340 L 420 460 L 420 520 L 460 540"
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
                <path id="fse-path" d="M 240 360 L 280 340 L 300 320 L 330 300 L 340 320 L 380 280 L 400 340 L 420 460 L 420 520 L 460 540" fill="none" opacity="0" />
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
                  d="M 320 180 L 260 160 L 200 150 L 140 140"
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
                <path id="fal-path" d="M 320 180 L 260 160 L 200 150 L 140 140" fill="none" opacity="0" />
                
                {/* FAL line exit to Basilicata - destination markers */}
                <g>
                  {/* Exit marker circle */}
                  <circle 
                    cx="140" 
                    cy="140" 
                    r="12" 
                    fill={networkColors.fal}
                    fillOpacity="0.3"
                    stroke={networkColors.fal} 
                    strokeWidth="2.5"
                    opacity="0.85"
                  />
                  <circle 
                    cx="140" 
                    cy="140" 
                    r="5" 
                    fill={networkColors.fal}
                    opacity="0.9"
                  />
                  
                  {/* Destination label box */}
                  <rect
                    x="50"
                    y="105"
                    width="155"
                    height="55"
                    fill="hsl(var(--background))"
                    fillOpacity="0.95"
                    stroke={networkColors.fal}
                    strokeWidth="1.5"
                    rx="4"
                    className="shadow-lg"
                  />
                  
                  {/* Main destination heading */}
                  <text 
                    x="127" 
                    y="122" 
                    className="text-xs font-bold fill-foreground"
                    textAnchor="middle"
                    style={{ textShadow: '0 0 2px hsl(var(--background))' }}
                  >
                    → BASILICATA
                  </text>
                  
                  {/* Town names */}
                  <text 
                    x="127" 
                    y="137" 
                    className="text-[10px] fill-muted-foreground"
                    textAnchor="middle"
                  >
                    Altamura • Matera
                  </text>
                  <text 
                    x="127" 
                    y="150" 
                    className="text-[10px] fill-muted-foreground"
                    textAnchor="middle"
                  >
                    Gravina • Potenza
                  </text>
                </g>
              </g>
            )}

            {/* Regional Buses - Dotted lines filling gaps */}
            {isVisible('buses') && (
              <g className="transition-opacity duration-500">
                <path
                  d="M 420 460 L 340 520 M 420 460 L 460 540 M 200 80 L 220 50 L 250 30"
                  stroke={networkColors.buses}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="6,6"
                  opacity="0.7"
                />
                
                {/* Bus destination label - Gargano Peninsula */}
                <text 
                  x="260" 
                  y="25" 
                  className="text-[10px] font-semibold fill-foreground"
                  style={{ 
                    textShadow: '0 0 4px hsl(var(--background)), 0 0 6px hsl(var(--background))',
                    paintOrder: 'stroke fill' 
                  }}
                >
                  ↑ Gargano Peninsula
                </text>
                <text 
                  x="260" 
                  y="40" 
                  className="text-[9px] fill-muted-foreground italic"
                  style={{ textShadow: '0 0 3px hsl(var(--background))' }}
                >
                  (Vieste, Peschici, Monte Sant'Angelo)
                </text>
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
                    className={`cursor-pointer transition-all duration-300 ${isSelected ? 'scale-150' : ''}`}
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
                    className={`${getLabelSize(station.type)} font-semibold fill-foreground pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-80'}`}
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
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground italic">
            Click any station for connections and details. Lines show approximate routes—not exact paths.
          </p>
          <p className="text-xs text-muted-foreground">
            Off-map lines continue to labeled destinations outside Puglia
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
