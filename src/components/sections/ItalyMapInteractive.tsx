import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Download, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RegionData {
  slug: string;
  title: string;
  issueNumber?: number;
  date: string;
  status?: 'live' | 'coming-soon';
  format?: string;
  thumbnail: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
  downloadUrl?: string;
  fileSize?: string;
  expectedDate?: string;
}

interface ItalyMapInteractiveProps {
  newsletters: RegionData[];
  archive: Array<{
    title: string;
    issueNumber: number;
    date: string;
    format: string;
    thumbnail: string;
    downloadUrl: string;
    fileSize: string;
    description: string;
  }>;
}

const ItalyMapInteractive = ({ newsletters, archive }: ItalyMapInteractiveProps) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Combine newsletters and archive into a single lookup
  const regionMap = new Map<string, RegionData>();
  
  newsletters.forEach(nl => {
    regionMap.set(nl.slug.toLowerCase(), nl);
  });

  archive.forEach(arc => {
    const slug = arc.title.toLowerCase().replace(/\s+/g, '-');
    regionMap.set(slug, {
      slug,
      title: arc.title,
      issueNumber: arc.issueNumber,
      date: arc.date,
      format: arc.format,
      thumbnail: arc.thumbnail,
      description: arc.description,
      ctaText: 'Download PDF',
      downloadUrl: arc.downloadUrl,
      fileSize: arc.fileSize,
    });
  });

  // Map TopoJSON region names to slugs
  const normalizeRegionName = (name: string): string => {
    const nameMap: Record<string, string> = {
      'Piemonte': 'piemonte',
      'Valle d\'Aosta': 'valle-d-aosta',
      'Lombardia': 'lombardia',
      'Trentino-Alto Adige': 'trentino-alto-adige',
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

  const handleRegionClick = (regionSlug: string) => {
    const region = regionMap.get(regionSlug);
    if (region) {
      setSelectedRegion(region);
      setModalOpen(true);
    }
  };

  const getRegionStyle = (regionSlug: string) => {
    const region = regionMap.get(regionSlug);
    
    if (!region) {
      return {
        default: { 
          fill: 'hsl(var(--muted))', 
          stroke: 'hsl(var(--border))',
          strokeWidth: 0.5,
          opacity: 0.6,
        },
        hover: { 
          fill: 'hsl(var(--muted))', 
          opacity: 0.7,
          cursor: 'not-allowed',
        },
      };
    }

    if (region.status === 'coming-soon') {
      return {
        default: { 
          fill: 'hsl(var(--secondary))', 
          stroke: 'hsl(var(--border))',
          strokeWidth: 0.5,
          opacity: 0.8,
        },
        hover: { 
          fill: 'hsl(var(--secondary))', 
          opacity: 1,
          cursor: 'pointer',
        },
      };
    }

    if (region.format === 'PDF') {
      return {
        default: { 
          fill: 'hsl(var(--accent))', 
          stroke: 'hsl(var(--border))',
          strokeWidth: 0.5,
          opacity: 0.7,
        },
        hover: { 
          fill: 'hsl(var(--accent))', 
          opacity: 0.9,
          cursor: 'pointer',
        },
      };
    }

    return {
      default: { 
        fill: 'hsl(var(--primary))', 
        stroke: 'hsl(var(--border))',
        strokeWidth: 0.5,
        opacity: 0.8,
      },
      hover: { 
        fill: 'hsl(var(--primary))', 
        opacity: 1,
        cursor: 'pointer',
      },
    };
  };

  const geoUrl = "/data/italy-regions.topojson";

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Italy by Region
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click any region to discover retirement guides, cost breakdowns, and town recommendations
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 2800,
              center: [12.5, 42.5],
            }}
            className="w-full h-auto"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const regionName = geo.properties.reg_name;
                  const regionSlug = normalizeRegionName(regionName);
                  const region = regionMap.get(regionSlug);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => region && handleRegionClick(regionSlug)}
                      style={getRegionStyle(regionSlug)}
                      className="transition-all duration-200 outline-none"
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
            <span className="text-sm text-muted-foreground">Live Newsletter</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--accent))' }}></div>
            <span className="text-sm text-muted-foreground">PDF Archive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--secondary))' }}></div>
            <span className="text-sm text-muted-foreground">Coming Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded opacity-60" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
            <span className="text-sm text-muted-foreground">Not Yet Available</span>
          </div>
        </div>
      </div>

      {/* Region Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedRegion && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <DialogTitle className="text-3xl font-bold mb-2">
                      {selectedRegion.title}
                    </DialogTitle>
                    {selectedRegion.issueNumber && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>Issue #{selectedRegion.issueNumber}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {selectedRegion.date}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    {selectedRegion.status === 'live' && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        Live
                      </Badge>
                    )}
                    {selectedRegion.status === 'coming-soon' && (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                    {selectedRegion.format === 'PDF' && (
                      <Badge variant="outline" className="gap-1">
                        <Download className="w-3 h-3" />
                        PDF
                      </Badge>
                    )}
                  </div>
                </div>
                <DialogDescription className="text-base">
                  {selectedRegion.description}
                </DialogDescription>
              </DialogHeader>

              {/* Thumbnail Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden mt-4">
                <img
                  src={selectedRegion.thumbnail}
                  alt={selectedRegion.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between mt-6">
                {selectedRegion.fileSize && (
                  <span className="text-sm text-muted-foreground">
                    File size: {selectedRegion.fileSize}
                  </span>
                )}
                {selectedRegion.expectedDate && (
                  <span className="text-sm text-muted-foreground">
                    Expected: {selectedRegion.expectedDate}
                  </span>
                )}
                <div className="ml-auto">
                  {selectedRegion.downloadUrl ? (
                    <Button asChild>
                      <a
                        href={selectedRegion.downloadUrl}
                        download
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {selectedRegion.ctaText}
                      </a>
                    </Button>
                  ) : selectedRegion.ctaLink ? (
                    <Button asChild>
                      <Link to={selectedRegion.ctaLink} className="gap-2">
                        {selectedRegion.ctaText}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled>
                      {selectedRegion.ctaText}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </section>
  );
};

export default ItalyMapInteractive;
