import { useState } from 'react';

interface LombardyMapSVGProps {
  highlightedProvinces: string[];
  highlightColor?: string;
  onProvinceClick?: (province: string) => void;
  showLabels?: boolean;
}

// Province path data derived from the Wikimedia Lombardy map
// Each path represents a province boundary
const provinces: Record<string, { path: string; center: { x: number; y: number }; label: string }> = {
  varese: {
    path: "M145,158 L160,140 L185,135 L200,145 L210,165 L205,190 L185,210 L160,215 L140,200 L135,175 Z",
    center: { x: 172, y: 175 },
    label: "Varese"
  },
  como: {
    path: "M210,165 L225,145 L250,130 L280,135 L295,155 L290,180 L270,200 L245,210 L220,205 L205,190 Z",
    center: { x: 250, y: 170 },
    label: "Como"
  },
  sondrio: {
    path: "M295,155 L320,120 L360,90 L410,75 L460,80 L500,100 L510,140 L495,175 L455,195 L400,200 L350,190 L310,180 L290,180 Z",
    center: { x: 400, y: 140 },
    label: "Sondrio"
  },
  lecco: {
    path: "M290,180 L310,180 L350,190 L365,215 L355,245 L325,260 L295,255 L270,240 L270,200 Z",
    center: { x: 315, y: 220 },
    label: "Lecco"
  },
  bergamo: {
    path: "M350,190 L400,200 L455,195 L480,220 L485,260 L470,300 L430,320 L380,315 L345,290 L325,260 L355,245 L365,215 Z",
    center: { x: 405, y: 255 },
    label: "Bergamo"
  },
  brescia: {
    path: "M455,195 L495,175 L540,180 L580,200 L600,240 L595,290 L575,340 L540,370 L490,375 L450,355 L430,320 L470,300 L485,260 L480,220 Z",
    center: { x: 520, y: 280 },
    label: "Brescia"
  },
  monza: {
    path: "M245,210 L270,200 L270,240 L295,255 L290,280 L265,295 L240,290 L225,270 L220,245 L220,205 Z",
    center: { x: 255, y: 252 },
    label: "Monza"
  },
  milano: {
    path: "M185,210 L220,205 L220,245 L225,270 L240,290 L265,295 L260,330 L235,360 L200,370 L165,355 L145,320 L150,280 L160,250 L160,215 Z",
    center: { x: 200, y: 290 },
    label: "Milano"
  },
  lodi: {
    path: "M260,330 L290,280 L325,260 L345,290 L355,330 L345,365 L315,390 L275,395 L245,380 L235,360 Z",
    center: { x: 295, y: 345 },
    label: "Lodi"
  },
  pavia: {
    path: "M145,320 L165,355 L200,370 L235,360 L245,380 L275,395 L270,440 L240,475 L190,490 L140,480 L105,450 L95,400 L110,360 Z",
    center: { x: 180, y: 420 },
    label: "Pavia"
  },
  cremona: {
    path: "M345,365 L380,315 L430,320 L450,355 L465,400 L455,445 L420,475 L370,485 L320,470 L295,440 L275,395 L315,390 Z",
    center: { x: 375, y: 420 },
    label: "Cremona"
  },
  mantova: {
    path: "M450,355 L490,375 L540,370 L575,390 L595,430 L585,480 L545,520 L490,535 L430,520 L390,490 L370,485 L420,475 L455,445 L465,400 Z",
    center: { x: 490, y: 455 },
    label: "Mantova"
  }
};

// Winter destinations (mountain resorts) positioned on the map
const winterDestinations: Record<string, { x: number; y: number; label: string }> = {
  bormio: { x: 485, y: 95, label: 'Bormio' },
  livigno: { x: 510, y: 75, label: 'Livigno' },
  aprica: { x: 435, y: 175, label: 'Aprica' },
  pontedilegno: { x: 545, y: 155, label: 'Ponte di Legno' },
  valmalenco: { x: 400, y: 125, label: 'Valmalenco' },
};

export default function LombardyMapSVG({
  highlightedProvinces,
  highlightColor = '#38bdf8',
  onProvinceClick,
  showLabels = false
}: LombardyMapSVGProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  return (
    <svg
      viewBox="80 50 560 510"
      className="w-full h-full"
      style={{ maxHeight: '100%' }}
    >
      {/* Background */}
      <rect x="80" y="50" width="560" height="510" fill="transparent" />
      
      {/* Province paths */}
      {Object.entries(provinces).map(([key, province]) => {
        const isHighlighted = highlightedProvinces.includes(key);
        const isHovered = hoveredProvince === key;
        
        return (
          <g key={key}>
            <path
              d={province.path}
              fill={isHighlighted ? highlightColor : isHovered ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.3)'}
              stroke="rgba(148, 163, 184, 0.6)"
              strokeWidth={isHighlighted || isHovered ? 2 : 1}
              className="transition-all duration-300 cursor-pointer"
              onClick={() => onProvinceClick?.(key)}
              onMouseEnter={() => setHoveredProvince(key)}
              onMouseLeave={() => setHoveredProvince(null)}
              style={{
                filter: isHighlighted ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.5))' : 'none'
              }}
            />
            {/* Province label */}
            {(showLabels || isHighlighted || isHovered) && (
              <text
                x={province.center.x}
                y={province.center.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-medium pointer-events-none select-none"
                fill={isHighlighted ? '#ffffff' : '#cbd5e1'}
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                {province.label}
              </text>
            )}
          </g>
        );
      })}
      
      {/* Outer border for region */}
      <path
        d="M145,158 L160,140 L185,135 L200,145 L210,165 L225,145 L250,130 L280,135 L295,155 L320,120 L360,90 L410,75 L460,80 L500,100 L510,140 L540,180 L580,200 L600,240 L595,290 L575,340 L575,390 L595,430 L585,480 L545,520 L490,535 L430,520 L390,490 L370,485 L320,470 L295,440 L270,440 L240,475 L190,490 L140,480 L105,450 L95,400 L110,360 L145,320 L150,280 L160,250 L160,215 L140,200 L135,175 Z"
        fill="none"
        stroke="rgba(148, 163, 184, 0.8)"
        strokeWidth="2"
        className="pointer-events-none"
      />
    </svg>
  );
}

export { provinces, winterDestinations };
