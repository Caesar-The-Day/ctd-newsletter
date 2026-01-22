import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export function SevenPercentCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      setParallaxY(scrollPercent * 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Parallax Map Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/80"
        style={{
          transform: `translateY(${parallaxY}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Map Texture Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="map-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.3"/>
                <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>
        </div>

        {/* Animated Map Pins */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute transition-all duration-1000 ${
                isVisible ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                transitionDelay: `${i * 150}ms`
              }}
            >
              <MapPin 
                className="w-6 h-6 text-primary/55 hover:text-primary hover:scale-125 transition-all duration-300 cursor-pointer drop-shadow-lg" 
                fill="currentColor"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="mb-6">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Find 7%-Eligible Towns in Umbria
              </h2>
            </div>
            <div className="space-y-4 mb-8">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Umbria isn't classified as a Southern Italy region for the 7% flat-tax program.
              </p>
              
              <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
                But several Umbrian towns do qualify.
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                The challenge is figuring out which ones, and whether they actually make sense for how you want to live.
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                The <strong className="text-foreground">7% Escape Map</strong> shows every qualifying town in Umbria and nearby regions on an interactive map, so you can filter by what matters: walkability, countryside vs. lake, population size, housing costs, healthcare access, climate, airport distance, and overall vibe.
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                See which Umbrian towns qualify, which border towns offer clearer eligibility, and decide if the tax benefit fits your lifestyle before you commit.
              </p>
              
              <p className="text-lg md:text-xl text-foreground leading-relaxed font-semibold italic">
                Clear options. No guesswork.
              </p>
            </div>
            <Button size="lg" asChild className="hover-lift shadow-xl">
              <a 
                href="https://italy7percent.caesartheday.com" 
                target="_blank" 
                rel="noopener noreferrer"
                data-analytics-event="escape_map_click"
              >
                Launch the Escape Map
              </a>
            </Button>
          </div>

          {/* Right Column - Interactive Map */}
          <div className={`transition-all duration-1000 delay-300 flex items-center justify-center ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <img
              src="/images/shared/7percent-escape-map-logo.png"
              alt="7% Escape Map by CaesarTheDay - Interactive tool for finding Italy's 7% flat-tax eligible towns"
              className="w-full max-w-md md:max-w-lg drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
