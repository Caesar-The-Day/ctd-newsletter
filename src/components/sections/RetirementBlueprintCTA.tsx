import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

export function RetirementBlueprintCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section 
      ref={sectionRef}
      className="py-6 md:py-8 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className={`relative bg-[#F5EFE7] rounded-xl shadow-soft p-8 md:p-12 text-center overflow-hidden transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isHovered ? 'shadow-2xl -translate-y-1' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Decorative Compass Background */}
            <div 
              className="absolute top-4 right-4 opacity-5 transition-transform duration-700"
              style={{
                transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)'
              }}
            >
              <Compass className="w-32 h-32 md:w-48 md:h-48" strokeWidth={1} />
            </div>

            {/* Architectural Line Art Motif */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="blueprint-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Turn Your Daydream into a Plan
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                If Piemonte already feels like home in your mind, let's make it real. My Retirement Blueprint is a one-on-one consulting session that turns your Italian dream into a structured plan—covering costs, visas, tax strategy, housing, and timelines.
              </p>
              <p className="text-xl font-semibold mb-6 text-foreground italic">
                You bring the dream. I'll bring the map.
              </p>
              <Button size="lg" asChild className="hover-lift">
                <a href="https://www.caesartheday.com/services" target="_blank" rel="noopener noreferrer">
                  Book a Consultation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
