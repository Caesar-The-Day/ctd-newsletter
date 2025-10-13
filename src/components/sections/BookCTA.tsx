import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function BookCTA() {
  const [isVisible, setIsVisible] = useState(false);
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
      className="py-16 md:py-24 bg-[#F5EFE7]"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={`bg-[#FDFBF7] rounded-2xl shadow-xl overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
              {/* Left Column - Book Cover */}
              <div className={`flex justify-center md:justify-start transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}>
                <div 
                  className="relative w-full max-w-[280px] transform hover:scale-105 transition-transform duration-300"
                  style={{
                    transform: isVisible ? 'rotate(-2deg)' : 'rotate(-5deg)',
                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))'
                  }}
                >
                  <img 
                    src="/images/escape-plan-cover.jpg" 
                    alt="Escape Plan: How to Move from the US to Italy (Without Losing Your Money or Mind)" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>

              {/* Right Column - Text Content */}
              <div className={`transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Escape Plan: Your Field Guide to Italy
                </h2>
                <div className="space-y-4 mb-6 text-muted-foreground leading-relaxed">
                  <p>
                    Italy isn't just a dream. It's a strategy waiting to be executed. Escape Plan shows you how to go from "someday" to "see you there"—step by step.
                  </p>
                  <p className="font-semibold text-foreground">
                    Real costs. Real pitfalls. Real plan.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="hover-lift">
                    <a href="https://www.caesartheday.com/the-book" target="_blank" rel="noopener noreferrer">
                      Get the Book
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="hover-lift">
                    <a href="https://a.co/d/ebHUEtP" target="_blank" rel="noopener noreferrer">
                      Get it on Amazon
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
