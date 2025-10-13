import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface CollaboratorFeatureProps {
  heading: string;
  paragraphs: string[];
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export function CollaboratorFeature({
  paragraphs,
  ctaText,
  ctaLink,
}: CollaboratorFeatureProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      setParallaxY(clampedProgress * 15 - 7.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[url('/images/cafe-table-sepia.jpg')] bg-cover bg-center"
      style={{
        transform: prefersReducedMotion ? 'none' : `translateY(${parallaxY}px)`,
        transition: prefersReducedMotion ? 'none' : 'transform 0.1s linear'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80 mix-blend-normal" />

      {/* Content Container */}
      <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          {/* Left Column - Text */}
          <div className="md:col-span-3">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
              Living the Language: Join the Conversation
            </h2>
            
            {/* Handwritten Underline */}
            <svg 
              className="mt-2 h-4 w-full max-w-md" 
              viewBox="0 0 400 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M2 8C50 6 100 4 150 6C200 8 250 10 300 8C350 6 380 7 398 8"
                stroke="#8c6239"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${!prefersReducedMotion && isVisible ? 'animate-draw-underline' : ''}`}
                style={{
                  strokeDasharray: prefersReducedMotion ? 'none' : '450',
                  strokeDashoffset: prefersReducedMotion ? '0' : (isVisible ? '0' : '450'),
                  transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 0.7s ease-out'
                }}
              />
            </svg>

            <div className="mt-4 space-y-4">
              {paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-base leading-7 text-neutral-800"
                >
                  {para}
                </p>
              ))}
            </div>

            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold bg-amber-700 text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition"
            >
              {ctaText}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Right Column - Portrait */}
          <div className="md:col-span-2 flex justify-center md:justify-end">
            <div
              className={`relative aspect-[4/5] w-4/5 rounded-2xl overflow-hidden shadow-xl bg-neutral-200 transition-all duration-500 ${
                !prefersReducedMotion && isVisible ? 'animate-fade-in-portrait' : ''
              } ${!prefersReducedMotion ? 'hover:scale-110 hover:rotate-2 hover:shadow-2xl' : ''}`}
              style={{
                opacity: prefersReducedMotion ? 1 : (isVisible ? 1 : 0),
                transform: prefersReducedMotion ? 'none' : (isVisible ? 'scale(1)' : 'scale(0.97)')
              }}
            >
              <img
                src="/images/lucca-portrait.jpg"
                alt="Luca, Italian teacher and founder of Italian Conversation Club"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
