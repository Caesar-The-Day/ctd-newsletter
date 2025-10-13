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
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Find Your 7% Town
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Some corners of Italy reward newcomers with a 7% flat tax—and views worth far more. The Escape Map helps you find those towns that match your lifestyle, cost, and climate preferences.
            </p>
            <Button size="lg" asChild className="hover-lift shadow-xl">
              <a href="https://italy7percent.caesartheday.com" target="_blank" rel="noopener noreferrer">
                Launch the Escape Map
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
