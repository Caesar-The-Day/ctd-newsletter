import { useState } from 'react';
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

  const handleRegionClick = (regionSlug: string) => {
    const region = regionMap.get(regionSlug);
    if (region) {
      setSelectedRegion(region);
      setModalOpen(true);
    }
  };

  const getRegionClassName = (regionSlug: string) => {
    const region = regionMap.get(regionSlug);
    if (!region) return 'region-path region-unavailable';
    if (region.status === 'coming-soon') return 'region-path region-coming-soon';
    if (region.format === 'PDF') return 'region-path region-archive';
    return 'region-path region-live';
  };

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

        <div className="max-w-4xl mx-auto">
          <svg
            viewBox="0 0 500 700"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Piemonte - Northwest */}
            <path
              d="M 80 120 L 120 100 L 160 110 L 170 140 L 150 170 L 110 160 L 80 140 Z"
              className={getRegionClassName('piemonte')}
              onClick={() => handleRegionClick('piemonte')}
              aria-label="Piemonte region"
            />
            
            {/* Lombardia - North */}
            <path
              d="M 170 140 L 220 120 L 260 130 L 270 160 L 240 180 L 190 170 L 170 140 Z"
              className={getRegionClassName('lombardia')}
              onClick={() => handleRegionClick('lombardia')}
              aria-label="Lombardia region"
            />
            
            {/* Liguria - Northwest coast */}
            <path
              d="M 80 180 L 120 170 L 150 190 L 140 220 L 100 210 L 80 180 Z"
              className={getRegionClassName('liguria')}
              onClick={() => handleRegionClick('liguria')}
              aria-label="Liguria region"
            />
            
            {/* Abruzzo - Central east */}
            <path
              d="M 240 280 L 290 270 L 310 300 L 300 330 L 260 320 L 240 280 Z"
              className={getRegionClassName('abruzzo')}
              onClick={() => handleRegionClick('abruzzo')}
              aria-label="Abruzzo region"
            />
            
            {/* Le Marche - East coast */}
            <path
              d="M 240 240 L 280 230 L 300 260 L 290 290 L 250 280 L 240 240 Z"
              className={getRegionClassName('le-marche')}
              onClick={() => handleRegionClick('le-marche')}
              aria-label="Le Marche region"
            />
            
            {/* Puglia - Southeast heel */}
            <path
              d="M 320 420 L 380 410 L 400 450 L 410 490 L 390 520 L 350 500 L 320 460 L 320 420 Z"
              className={getRegionClassName('puglia')}
              onClick={() => handleRegionClick('puglia')}
              aria-label="Puglia region"
            />
            
            {/* Basilicata - South */}
            <path
              d="M 260 440 L 310 430 L 330 460 L 320 490 L 280 480 L 260 440 Z"
              className={getRegionClassName('basilicata')}
              onClick={() => handleRegionClick('basilicata')}
              aria-label="Basilicata region"
            />
            
            {/* Sicilia - Island south */}
            <path
              d="M 180 580 L 250 570 L 310 580 L 320 620 L 280 640 L 220 630 L 180 610 L 180 580 Z"
              className={getRegionClassName('sicilia')}
              onClick={() => handleRegionClick('sicilia')}
              aria-label="Sicilia region"
            />
            
            {/* Sardegna - Island west */}
            <path
              d="M 30 380 L 80 370 L 100 410 L 90 460 L 60 480 L 30 450 L 30 380 Z"
              className={getRegionClassName('sardegna')}
              onClick={() => handleRegionClick('sardegna')}
              aria-label="Sardegna region"
            />
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-primary" />
              <span className="text-muted-foreground">Live Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-secondary" />
              <span className="text-muted-foreground">PDF Archive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-muted" />
              <span className="text-muted-foreground">Coming Soon</span>
            </div>
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

      <style>{`
        .region-path {
          cursor: pointer;
          transition: all 0.3s ease;
          stroke: hsl(var(--border));
          stroke-width: 2;
        }

        .region-live {
          fill: hsl(var(--primary) / 0.7);
        }

        .region-live:hover {
          fill: hsl(var(--primary));
          transform: scale(1.05);
          filter: drop-shadow(0 4px 12px hsl(var(--primary) / 0.4));
        }

        .region-archive {
          fill: hsl(var(--secondary) / 0.6);
        }

        .region-archive:hover {
          fill: hsl(var(--secondary));
          transform: scale(1.05);
          filter: drop-shadow(0 4px 12px hsl(var(--secondary) / 0.4));
        }

        .region-coming-soon {
          fill: hsl(var(--muted) / 0.5);
        }

        .region-coming-soon:hover {
          fill: hsl(var(--muted));
          transform: scale(1.02);
        }

        .region-unavailable {
          fill: hsl(var(--muted-foreground) / 0.1);
          cursor: not-allowed;
          opacity: 0.5;
        }

        @media (prefers-reduced-motion: reduce) {
          .region-path {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
};

export default ItalyMapInteractive;
