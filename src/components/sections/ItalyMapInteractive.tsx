import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ArrowRight } from 'lucide-react';

interface MapEntry {
  slug: string;
  title: string;
  date?: string;
  status?: 'live' | 'coming-soon';
  format?: string;
  ctaLink?: string;
  downloadUrl?: string;
}

interface ItalyMapInteractiveProps {
  entries: MapEntry[];
  featuredSlug?: string;
  titles: Record<string, string>;
}

// CaesarTheDay brand palette (homepage scope)
const TERRACOTTA = 'hsl(14 48% 53%)';
const TERRACOTTA_DEEP = 'hsl(14 46% 43%)';
const GOLD_LIGHT = 'hsl(39 42% 71%)';
const GOLD_HOVER = 'hsl(38 35% 64%)';
const BLUSH = 'hsl(20 55% 92%)';
const STONE = 'hsl(36 25% 85%)';
const STONE_HOVER = 'hsl(36 22% 79%)';
const CREAM = 'hsl(36 50% 96%)';
const INK = 'hsl(206 57% 8%)';

type MapStatus = 'live' | 'pdf' | 'coming-soon' | 'none';

const ItalyMapInteractive = ({ entries, featuredSlug, titles }: ItalyMapInteractiveProps) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<{ slug: string; x: number; y: number } | null>(null);

  const entryMap = new Map<string, MapEntry>();
  entries.forEach((e) => entryMap.set(e.slug, e));

  const normalizeRegionName = (name: string): string => {
    const nameMap: Record<string, string> = {
      'Piemonte': 'piemonte',
      "Valle d'Aosta": 'valle-d-aosta',
      "Valle d'Aosta/Vallée d'Aoste": 'valle-d-aosta',
      'Lombardia': 'lombardia',
      'Trentino-Alto Adige': 'trentino-alto-adige',
      'Trentino-Alto Adige/Südtirol': 'trentino-alto-adige',
      'Veneto': 'veneto',
      'Friuli-Venezia Giulia': 'friuli-venezia-giulia',
      'Liguria': 'liguria',
      'Emilia-Romagna': 'emilia-romagna',
      'Toscana': 'toscana',
      'Umbria': 'umbria',
      'Marche': 'le-marche',
      'Lazio': 'lazio',
      'Abruzzo': 'abruzzo',
      'Molise': 'molise',
      'Campania': 'campania',
      'Puglia': 'puglia',
      'Basilicata': 'basilicata',
      'Calabria': 'calabria',
      'Sicilia': 'sicilia',
      'Sardegna': 'sardegna',
    };
    return nameMap[name] || name.toLowerCase().replace(/\s+/g, '-');
  };

  const statusOf = (slug: string): MapStatus => {
    const entry = entryMap.get(slug);
    if (!entry) return 'none';
    if (entry.status === 'coming-soon') return 'coming-soon';
    if (entry.format === 'PDF') return 'pdf';
    if (entry.status === 'live') return 'live';
    return 'none';
  };

  const statusLabel = (status: MapStatus): string => {
    switch (status) {
      case 'live': return 'Full web guide';
      case 'pdf': return 'PDF edition · web guide coming';
      case 'coming-soon': return 'Coming soon';
      default: return 'Not yet covered';
    }
  };

  const fillFor = (status: MapStatus, hoveredNow: boolean): string => {
    switch (status) {
      case 'live': return hoveredNow ? TERRACOTTA_DEEP : TERRACOTTA;
      case 'pdf': return hoveredNow ? GOLD_HOVER : GOLD_LIGHT;
      case 'coming-soon': return 'url(#ctdHatch)';
      default: return hoveredNow ? STONE_HOVER : STONE;
    }
  };

  const handleClick = (slug: string) => {
    const entry = entryMap.get(slug);
    if (!entry) return;
    if (entry.status === 'live' && entry.ctaLink) {
      navigate(entry.ctaLink);
    } else if (entry.downloadUrl) {
      window.location.href = entry.downloadUrl;
    } else {
      document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredTitle = featuredSlug ? (titles[featuredSlug] || featuredSlug) : '';
  const geoUrl = '/data/italy-regions.topojson';

  return (
    <div className="relative">
      {/* SVG pattern definition for "coming soon" diagonal hatch */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <pattern
            id="ctdHatch"
            width="7"
            height="7"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="7" height="7" fill={BLUSH} />
            <line x1="0" y1="0" x2="0" y2="7" stroke={TERRACOTTA} strokeWidth="1.6" opacity="0.5" />
          </pattern>
        </defs>
      </svg>

      {/* NEW THIS MONTH pill — points at the featured region */}
      {featuredSlug && featuredTitle && (
        <a
          href="#latest"
          className="absolute left-[40%] top-[28%] z-20 inline-flex flex-col rounded-lg bg-primary px-3 py-2 text-primary-foreground shadow-medium transition-transform hover:scale-105"
          aria-label={`New this month: ${featuredTitle}`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">
            New this month
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold leading-tight">
            {featuredTitle}
            <ArrowRight className="h-3 w-3" />
          </span>
        </a>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2200,
          center: [12.5, 41.5],
        }}
        className="w-full h-auto"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const regionSlug = normalizeRegionName(geo.properties.reg_name);
              const status = statusOf(regionSlug);
              const isHovered = hovered?.slug === regionSlug;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleClick(regionSlug)}
                  onMouseMove={(e: React.MouseEvent<SVGPathElement>) => {
                    const host = (e.currentTarget.ownerSVGElement?.parentElement as HTMLElement) || e.currentTarget;
                    const rect = host.getBoundingClientRect();
                    setHovered({
                      slug: regionSlug,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    default: {
                      fill: fillFor(status, false),
                      stroke: CREAM,
                      strokeWidth: 0.8,
                      transition: 'fill 200ms ease',
                    },
                    hover: {
                      fill: fillFor(status, true),
                      stroke: CREAM,
                      strokeWidth: 0.8,
                    },
                    pressed: {
                      fill: fillFor(status, true),
                      stroke: CREAM,
                      strokeWidth: 0.8,
                    },
                  }}
                  className="outline-none"
                  data-analytics-event="map_region_click"
                  data-region={regionSlug}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Hover tooltip */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-30 w-56 rounded-lg border border-border bg-card p-3 shadow-medium"
          style={{
            left: hovered.x,
            top: hovered.y,
            transform: 'translate(-50%, -115%)',
          }}
        >
          <div className="font-display text-base font-semibold leading-tight">
            {titles[hovered.slug] || hovered.slug}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{statusLabel(statusOf(hovered.slug))}</div>
          {(() => {
            const entry = entryMap.get(hovered.slug);
            if (entry?.date && entry.status === 'live') {
              return <div className="text-xs mt-1">Updated {entry.date}</div>;
            }
            if (entry?.date && entry.format === 'PDF') {
              return <div className="text-xs mt-1">PDF · {entry.date}</div>;
            }
            return null;
          })()}
          <div className="mt-1.5 text-xs font-medium text-terracotta-deep">
            {statusOf(hovered.slug) === 'live'
              ? 'Click to read the guide'
              : statusOf(hovered.slug) === 'pdf'
                ? 'Click to download the PDF'
                : statusOf(hovered.slug) === 'coming-soon'
                  ? 'Get notified →'
                  : ''}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: TERRACOTTA }} />
          <span className="text-sm text-muted-foreground">Full web guide</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: GOLD_LIGHT }} />
          <span className="text-sm text-muted-foreground">PDF edition</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded"
            style={{
              backgroundColor: BLUSH,
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 3px, ${TERRACOTTA}55 3px, ${TERRACOTTA}55 4px)`,
            }}
          />
          <span className="text-sm text-muted-foreground">Coming soon</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: STONE }} />
          <span className="text-sm text-muted-foreground">Not yet covered</span>
        </div>
      </div>
    </div>
  );
};

export default ItalyMapInteractive;
