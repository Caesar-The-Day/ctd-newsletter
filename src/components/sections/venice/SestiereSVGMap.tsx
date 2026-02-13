import { cn } from '@/lib/utils';

interface SestiereSVGMapProps {
  activeSestiere: number;
  onSelect: (index: number) => void;
}

/* Simplified polygon shapes for Venice's fish-shaped silhouette, divided by the Grand Canal */
const sestierePaths = [
  {
    // San Marco — south-central, below Grand Canal
    d: 'M 230,195 L 270,180 L 310,185 L 330,200 L 340,225 L 320,245 L 280,250 L 240,240 L 220,220 Z',
    label: { x: 280, y: 218 },
    hoverColor: 'fill-amber-500/40',
    activeColor: 'fill-amber-500/60',
  },
  {
    // Dorsoduro — southwest, below Grand Canal
    d: 'M 100,210 L 140,195 L 185,190 L 225,195 L 220,220 L 240,240 L 220,260 L 180,275 L 130,270 L 95,250 L 85,230 Z',
    label: { x: 165, y: 235 },
    hoverColor: 'fill-rose-500/40',
    activeColor: 'fill-rose-500/60',
  },
  {
    // San Polo — northwest center, above Grand Canal bend
    d: 'M 140,140 L 180,130 L 220,140 L 230,160 L 225,180 L 230,195 L 185,190 L 140,195 L 120,175 L 125,155 Z',
    label: { x: 178, y: 165 },
    hoverColor: 'fill-orange-500/40',
    activeColor: 'fill-orange-500/60',
  },
  {
    // Cannaregio — north, upper fish body
    d: 'M 130,80 L 180,65 L 240,70 L 290,85 L 300,110 L 280,130 L 240,140 L 220,140 L 180,130 L 140,140 L 120,120 L 115,95 Z',
    label: { x: 210, y: 108 },
    hoverColor: 'fill-teal-500/40',
    activeColor: 'fill-teal-500/60',
  },
  {
    // Castello — east, the fish tail
    d: 'M 290,85 L 340,80 L 390,95 L 420,120 L 430,150 L 410,180 L 370,195 L 340,200 L 330,200 L 310,185 L 270,180 L 230,195 L 225,180 L 230,160 L 240,140 L 280,130 L 300,110 Z',
    label: { x: 345, y: 145 },
    hoverColor: 'fill-emerald-500/40',
    activeColor: 'fill-emerald-500/60',
  },
  {
    // Santa Croce — far west, the fish head
    d: 'M 50,120 L 80,100 L 115,95 L 130,80 L 120,120 L 140,140 L 125,155 L 120,175 L 140,195 L 100,210 L 85,230 L 65,210 L 50,180 L 40,150 Z',
    label: { x: 90, y: 155 },
    hoverColor: 'fill-indigo-500/40',
    activeColor: 'fill-indigo-500/60',
  },
];

const sestiereNames = ['San Marco', 'Dorsoduro', 'San Polo', 'Cannaregio', 'Castello', 'Santa Croce'];

export default function SestiereSVGMap({ activeSestiere, onSelect }: SestiereSVGMapProps) {
  return (
    <div className="mb-8">
      <svg
        viewBox="20 50 430 250"
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label="Interactive map of Venice's six sestieri districts"
      >
        {/* Water background */}
        <rect x="20" y="50" width="430" height="250" rx="12" className="fill-sky-100/30 dark:fill-sky-900/20" />

        {/* Grand Canal suggestion line */}
        <path
          d="M 50,160 Q 120,200 185,190 Q 225,185 230,195 Q 240,210 270,180"
          fill="none"
          className="stroke-sky-400/40 dark:stroke-sky-500/30"
          strokeWidth="3"
          strokeDasharray="6 4"
        />

        {/* Sestiere polygons */}
        {sestierePaths.map((s, i) => (
          <g key={i} className="cursor-pointer" onClick={() => onSelect(i)}>
            <path
              d={s.d}
              className={cn(
                'stroke-foreground/30 transition-all duration-300',
                i === activeSestiere
                  ? s.activeColor
                  : 'fill-muted/60 hover:' + s.hoverColor.replace('fill-', 'fill-')
              )}
              strokeWidth="1.5"
              style={i !== activeSestiere ? undefined : undefined}
            />
            {/* Hover/active highlight handled via class */}
            <path
              d={s.d}
              className={cn(
                'fill-transparent transition-colors duration-300',
                i !== activeSestiere && 'hover:fill-foreground/10'
              )}
              strokeWidth="0"
            />
            <text
              x={s.label.x}
              y={s.label.y}
              textAnchor="middle"
              className={cn(
                'text-[9px] font-semibold pointer-events-none select-none transition-colors duration-300',
                i === activeSestiere ? 'fill-foreground' : 'fill-foreground/60'
              )}
            >
              {sestiereNames[i]}
            </text>
          </g>
        ))}

        {/* Compass rose */}
        <g transform="translate(415, 70)">
          <text textAnchor="middle" className="fill-muted-foreground/50 text-[8px] font-bold">N</text>
          <line x1="0" y1="4" x2="0" y2="14" className="stroke-muted-foreground/30" strokeWidth="1" />
        </g>
      </svg>
      <p className="text-center text-xs text-muted-foreground mt-2 italic">Click a district to explore</p>
    </div>
  );
}
