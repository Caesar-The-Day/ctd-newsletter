import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileCheck, Calculator, MapPin, Clock, Plane, Compass, ArrowRight } from 'lucide-react';
import vistoFacileLogo from '@/assets/visto-facile-logo.png';
import italyCallingImage from '@/assets/italy-calling-cta.jpg';

interface RetirementBlueprintCTAProps {
  region?: string;
  variant?: 'auto' | 'visto-facile' | 'consultation';
}

const VISTO_FACILE_REGIONS = ['molise', 'calabria', 'piemonte', 'lombardia', 'veneto', 'puglia', 'lazio'];

interface CTAContent {
  preheadline: string;
  headline: string;
  subheadline: string;
  description: string;
  benefits: Array<{ icon: React.ReactNode; text: string }>;
  trustLine: string;
  ctaText: string;
  ctaUrl: string;
  analyticsEvent: string;
  visual: { type: 'logo' | 'image'; src: string; alt: string };
}

function getCTAContent(region?: string, variant: RetirementBlueprintCTAProps['variant'] = 'auto'): CTAContent {
  const isVistoFacile =
    variant === 'visto-facile' ||
    (variant === 'auto' && VISTO_FACILE_REGIONS.includes(region ?? ''));

  if (isVistoFacile) {
    return {
      preheadline: 'Elective Residency Visa (ERV) Navigator',
      headline: region
        ? `Make Your ${region.charAt(0).toUpperCase() + region.slice(1)} Move Official`
        : 'Make Your Italian Move Official',
      subheadline:
        'Visto Facile is the step-by-step navigator for Italy’s Elective Residency Visa — built for U.S. and Canadian applicants who want a clear, organized path to residency.',
      description:
        'Document checklists, income calculations, consulate-specific quirks, and timeline tracking — all in one place, so nothing slips through the cracks.',
      benefits: [
        { icon: <FileCheck className="w-4 h-4" />, text: 'Document checklists' },
        { icon: <Calculator className="w-4 h-4" />, text: 'Income calculations' },
        { icon: <Clock className="w-4 h-4" />, text: 'Timeline tracking' },
      ],
      trustLine: 'Built for U.S. & Canadian applicants',
      ctaText: 'Start Your Visa Journey',
      ctaUrl: 'https://vistofacile.caesartheday.com',
      analyticsEvent: 'visto_facile_cta_click',
      visual: { type: 'logo', src: vistoFacileLogo, alt: 'Visto Facile — Elective Residency Visa (ERV) Navigator' },
    };
  }

  return {
    preheadline: "Turn 'Maybe One Day' Into a Real Timeline",
    headline: 'Italy Is Calling — Build Your Plan',
    subheadline:
      'The Retirement Blueprint gives you a precise, personalized roadmap to retiring in Italy: what it costs, how to structure your income, where to live, and how to make the move without losing your mind or your savings.',
    description:
      'You get a strategy that matches your timeline, your budget, and your vision — not a generic checklist.',
    benefits: [
      { icon: <MapPin className="w-4 h-4" />, text: 'Region & town matching' },
      { icon: <Calculator className="w-4 h-4" />, text: 'Cost & tax structure' },
      { icon: <Plane className="w-4 h-4" />, text: 'Visa & relocation roadmap' },
    ],
    trustLine: 'Personalized strategy, not a generic checklist',
    ctaText: 'Book a Consultation',
    ctaUrl: 'https://www.caesartheday.com/services',
    analyticsEvent: 'blueprint_cta_click',
    visual: { type: 'image', src: italyCallingImage, alt: 'Desk with compass, Italian passport, and notebook overlooking a sunlit hill town' },
  };
}

export function RetirementBlueprintCTA({ region }: RetirementBlueprintCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const content = getCTAContent(region);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div
          className={`cta-ocean-deep cta-card-ocean max-w-5xl mx-auto rounded-2xl overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="cta-grid-overlay" />

          <div className="relative z-10 grid md:grid-cols-2 min-h-[420px]">
            {/* Visual panel */}
            <div className="cta-image-panel relative min-h-[240px] md:min-h-full flex items-center justify-center p-8 md:p-12">
              {content.visual.type === 'logo' ? (
                <div className="relative z-10 text-center">
                  <img
                    src={content.visual.src}
                    alt={content.visual.alt}
                    className="h-24 md:h-32 w-auto mx-auto drop-shadow-2xl"
                    loading="lazy"
                    width={320}
                    height={128}
                  />
                  <p className="mt-4 text-sm md:text-base font-medium tracking-wide uppercase text-white/80">
                    Italian Visa Navigator
                  </p>
                </div>
              ) : (
                <img
                  src={content.visual.src}
                  alt={content.visual.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  width={1024}
                  height={1024}
                />
              )}

              {/* Decorative compass icon for image variant */}
              {content.visual.type === 'image' && (
                <div
                  className="absolute bottom-6 right-6 z-10 text-white/20 transition-transform duration-700"
                  style={{ transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <Compass className="w-16 h-16 md:w-24 md:h-24" strokeWidth={1} />
                </div>
              )}
            </div>

            {/* Content panel */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center">
              <span className="inline-block text-xs md:text-sm font-semibold tracking-widest uppercase cta-accent-text mb-3">
                {content.preheadline}
              </span>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight cta-heading-ocean mb-4">
                {content.headline}
              </h3>

              <p className="text-lg md:text-xl leading-relaxed cta-body-ocean mb-4">
                {content.subheadline}
              </p>

              <p className="text-base md:text-lg leading-relaxed text-white/70 mb-6">
                {content.description}
              </p>

              {/* Benefit chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                {content.benefits.map((benefit, index) => (
                  <div key={index} className="cta-benefit-chip">
                    {benefit.icon}
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust line */}
              <p className="text-sm md:text-base cta-accent-text font-medium mb-6 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                {content.trustLine}
              </p>

              {/* CTA Button */}
              <div className="relative inline-flex w-fit">
                <div className="cta-pulse-ring" />
                <Button size="lg" asChild className="cta-button-ocean text-base md:text-lg px-8 py-6 h-auto">
                  <a
                    href={content.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-event={content.analyticsEvent}
                  >
                    {content.ctaText}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
