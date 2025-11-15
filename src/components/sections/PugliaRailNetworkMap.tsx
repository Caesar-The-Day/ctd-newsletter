import React, { useState } from 'react';
import { Train, TrainFront, Mountain, BusFront } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  // Major cities with coordinates (relative to viewBox)
  const cities = [
    { name: 'Foggia', x: 200, y: 80, networks: ['trenitalia', 'fal', 'buses'] },
    { name: 'Barletta', x: 240, y: 140, networks: ['ferrotramviaria', 'trenitalia'] },
    { name: 'Trani', x: 260, y: 150, networks: ['ferrotramviaria', 'trenitalia'] },
    { name: 'Bari', x: 320, y: 180, networks: ['trenitalia', 'fse', 'ferrotramviaria', 'fal'] },
    { name: 'Monopoli', x: 360, y: 220, networks: ['trenitalia', 'fse'] },
    { name: 'Polignano', x: 350, y: 210, networks: ['trenitalia'] },
    { name: 'Ostuni', x: 380, y: 280, networks: ['trenitalia', 'fse'] },
    { name: 'Brindisi', x: 400, y: 340, networks: ['trenitalia', 'fse'] },
    { name: 'Martina Franca', x: 340, y: 320, networks: ['fse'] },
    { name: 'Locorotondo', x: 330, y: 300, networks: ['fse'] },
    { name: 'Alberobello', x: 320, y: 290, networks: ['fse'] },
    { name: 'Taranto', x: 240, y: 360, networks: ['trenitalia', 'fse'] },
    { name: 'Lecce', x: 420, y: 460, networks: ['trenitalia', 'fse', 'buses'] },
    { name: 'Gallipoli', x: 340, y: 520, networks: ['buses', 'fse'] },
    { name: 'Otranto', x: 460, y: 540, networks: ['buses', 'fse'] },
  ];

  // Network color map
  const networkColors: Record<string, string> = {
    trenitalia: 'hsl(142 71% 45%)',
    fse: 'hsl(142 76% 36%)',
    ferrotramviaria: 'hsl(217 91% 60%)',
    fal: 'hsl(24 95% 53%)',
    buses: 'hsl(280 65% 60%)',
  };

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
            Color-coded lines show how Puglia's four rail operators and regional buses weave through the region. 
            Toggle networks to see specific routes.
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

            {/* Station markers */}
            {cities.map((city, idx) => {
              const hasVisibleNetwork = city.networks.some(n => isVisible(n));
              if (!hasVisibleNetwork) return null;

              return (
                <g key={idx} className="station-marker group cursor-pointer">
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="6"
                    fill="hsl(var(--background))"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2"
                    className="transition-all duration-300 hover:scale-150 hover:fill-primary"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    }}
                  />
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="8"
                    fill="hsl(var(--primary))"
                    opacity="0"
                    className="animate-ping"
                    style={{
                      animationDuration: `${2 + idx * 0.3}s`,
                    }}
                  />
                  {/* City label */}
                  <text
                    x={city.x}
                    y={city.y - 15}
                    textAnchor="middle"
                    className="text-[10px] font-semibold fill-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ pointerEvents: 'none' }}
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground italic">
            Hover over station markers to see city names. Lines show approximate routes—not exact paths.
          </p>
        </div>
      </div>
    </div>
  );
}
