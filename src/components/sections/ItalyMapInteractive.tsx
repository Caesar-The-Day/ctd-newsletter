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
            viewBox="0 0 600 900"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Valle d'Aosta - Northwest mountain */}
            <path
              d="M 150 80 L 180 70 L 200 85 L 195 110 L 170 115 L 155 100 Z"
              className={getRegionClassName('valle-d-aosta')}
              onClick={() => handleRegionClick('valle-d-aosta')}
              aria-label="Valle d'Aosta region"
            />

            {/* Piemonte - Northwest */}
            <path
              d="M 120 100 L 150 80 L 180 70 L 200 85 L 215 100 L 230 120 L 225 145 L 210 160 L 195 175 L 170 185 L 145 180 L 125 165 L 110 145 L 105 125 Z"
              className={getRegionClassName('piemonte')}
              onClick={() => handleRegionClick('piemonte')}
              aria-label="Piemonte region"
            />
            
            {/* Liguria - Northwest coast */}
            <path
              d="M 125 165 L 145 180 L 170 185 L 195 190 L 210 195 L 220 205 L 215 220 L 200 225 L 175 220 L 150 210 L 125 200 L 105 190 L 95 180 L 100 170 Z"
              className={getRegionClassName('liguria')}
              onClick={() => handleRegionClick('liguria')}
              aria-label="Liguria region"
            />

            {/* Lombardia - North central */}
            <path
              d="M 215 100 L 245 90 L 275 95 L 300 105 L 315 120 L 320 140 L 315 160 L 300 175 L 275 185 L 250 180 L 225 170 L 210 160 L 225 145 Z"
              className={getRegionClassName('lombardia')}
              onClick={() => handleRegionClick('lombardia')}
              aria-label="Lombardia region"
            />

            {/* Trentino-Alto Adige - Northeast mountains */}
            <path
              d="M 275 95 L 300 85 L 330 85 L 355 95 L 365 110 L 360 130 L 345 140 L 320 140 L 300 135 L 300 105 Z"
              className={getRegionClassName('trentino-alto-adige')}
              onClick={() => handleRegionClick('trentino-alto-adige')}
              aria-label="Trentino-Alto Adige region"
            />

            {/* Veneto - Northeast */}
            <path
              d="M 315 120 L 345 140 L 375 145 L 395 155 L 405 170 L 400 190 L 385 200 L 360 195 L 335 185 L 315 175 L 315 160 L 320 140 Z"
              className={getRegionClassName('veneto')}
              onClick={() => handleRegionClick('veneto')}
              aria-label="Veneto region"
            />

            {/* Friuli-Venezia Giulia - Far northeast */}
            <path
              d="M 375 145 L 405 140 L 435 145 L 450 160 L 445 180 L 425 190 L 405 185 L 395 175 L 395 155 Z"
              className={getRegionClassName('friuli-venezia-giulia')}
              onClick={() => handleRegionClick('friuli-venezia-giulia')}
              aria-label="Friuli-Venezia Giulia region"
            />

            {/* Emilia-Romagna - North central plains */}
            <path
              d="M 220 205 L 250 215 L 280 220 L 310 230 L 340 240 L 365 250 L 380 265 L 370 285 L 350 295 L 320 290 L 285 280 L 255 270 L 225 255 L 210 240 L 215 220 Z"
              className={getRegionClassName('emilia-romagna')}
              onClick={() => handleRegionClick('emilia-romagna')}
              aria-label="Emilia-Romagna region"
            />

            {/* Toscana - Central west */}
            <path
              d="M 210 240 L 225 255 L 255 270 L 285 280 L 305 295 L 310 320 L 300 345 L 275 360 L 245 365 L 215 355 L 190 335 L 175 310 L 170 280 L 180 260 Z"
              className={getRegionClassName('toscana')}
              onClick={() => handleRegionClick('toscana')}
              aria-label="Toscana region"
            />

            {/* Marche - Central east */}
            <path
              d="M 320 290 L 350 295 L 370 305 L 385 325 L 390 350 L 380 375 L 360 385 L 335 380 L 310 370 L 300 345 L 305 320 L 310 305 Z"
              className={getRegionClassName('marche')}
              onClick={() => handleRegionClick('marche')}
              aria-label="Marche region"
            />

            {/* Umbria - Central inland */}
            <path
              d="M 245 365 L 275 360 L 300 370 L 310 390 L 305 410 L 285 425 L 260 425 L 240 415 L 230 395 L 235 375 Z"
              className={getRegionClassName('umbria')}
              onClick={() => handleRegionClick('umbria')}
              aria-label="Umbria region"
            />

            {/* Lazio - Central west coast */}
            <path
              d="M 215 355 L 245 365 L 260 385 L 260 425 L 250 455 L 230 480 L 205 490 L 180 485 L 165 465 L 160 440 L 165 410 L 180 380 Z"
              className={getRegionClassName('lazio')}
              onClick={() => handleRegionClick('lazio')}
              aria-label="Lazio region"
            />

            {/* Abruzzo - Central east mountains */}
            <path
              d="M 300 370 L 335 380 L 360 390 L 365 410 L 355 435 L 335 450 L 310 455 L 285 445 L 275 425 L 285 400 L 295 385 Z"
              className={getRegionClassName('abruzzo')}
              onClick={() => handleRegionClick('abruzzo')}
              aria-label="Abruzzo region"
            />

            {/* Molise - Small central east */}
            <path
              d="M 310 455 L 335 450 L 350 465 L 350 485 L 335 500 L 315 500 L 300 490 L 295 475 Z"
              className={getRegionClassName('molise')}
              onClick={() => handleRegionClick('molise')}
              aria-label="Molise region"
            />

            {/* Campania - South west coast */}
            <path
              d="M 205 490 L 230 480 L 260 490 L 285 505 L 290 530 L 280 555 L 255 565 L 230 560 L 210 545 L 195 520 L 195 505 Z"
              className={getRegionClassName('campania')}
              onClick={() => handleRegionClick('campania')}
              aria-label="Campania region"
            />

            {/* Puglia - South east "heel" */}
            <path
              d="M 315 500 L 350 485 L 385 490 L 415 505 L 435 530 L 440 560 L 430 590 L 410 615 L 385 635 L 360 640 L 335 630 L 315 610 L 305 585 L 300 555 L 305 530 L 310 515 Z"
              className={getRegionClassName('puglia')}
              onClick={() => handleRegionClick('puglia')}
              aria-label="Puglia region"
            />

            {/* Basilicata - South central "instep" */}
            <path
              d="M 285 505 L 315 500 L 335 515 L 345 540 L 345 565 L 330 585 L 305 590 L 280 580 L 270 560 L 275 535 Z"
              className={getRegionClassName('basilicata')}
              onClick={() => handleRegionClick('basilicata')}
              aria-label="Basilicata region"
            />

            {/* Calabria - South "toe" */}
            <path
              d="M 255 565 L 280 580 L 305 590 L 315 610 L 320 640 L 315 670 L 300 695 L 280 710 L 255 715 L 235 705 L 220 680 L 215 650 L 220 620 L 230 595 L 245 580 Z"
              className={getRegionClassName('calabria')}
              onClick={() => handleRegionClick('calabria')}
              aria-label="Calabria region"
            />

            {/* Sicilia - Island south */}
            <path
              d="M 185 740 L 230 730 L 280 735 L 330 745 L 375 760 L 400 780 L 395 810 L 365 830 L 320 840 L 270 835 L 220 820 L 175 800 L 145 775 L 145 755 Z"
              className={getRegionClassName('sicilia')}
              onClick={() => handleRegionClick('sicilia')}
              aria-label="Sicilia region"
            />

            {/* Sardegna - Island west */}
            <path
              d="M 50 350 L 90 340 L 130 345 L 155 365 L 165 395 L 165 435 L 155 475 L 140 515 L 115 545 L 85 560 L 55 555 L 35 530 L 25 495 L 25 455 L 30 415 L 40 380 Z"
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
