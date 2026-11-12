import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Check } from 'lucide-react';
import { withUtm } from '@/lib/utm';

const FEATURES = [
  'Bureaucracy: Comune, Anagrafe, Questura, SPID, PEC—and the people in between.',
  'Renting, buying, renovating: agente immobiliare, geometra, notaio, condominio.',
  'Markets, food labels, doctors, pharmacies, mechanics, ZTLs, pets, and neighbors.',
  'The spoken Italian people actually use: boh, magari, mica, vabbè.',
];

export function ItalianBookCTA({ region, displayName }: { region?: string; displayName?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const heading = displayName
    ? `Living in ${displayName} means talking to the Comune, the plumber and the pharmacist.`
    : 'Living in Italy means talking to the Comune, the plumber and the pharmacist.';

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-muted/40" aria-labelledby="italian-book-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={`bg-card rounded-2xl shadow-xl overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 p-6 md:p-10 items-center">
              <div className="flex justify-center md:order-2">
                <div
                  className="relative w-full max-w-[238px] transition-transform duration-300 hover:scale-105"
                  style={{ transform: isVisible ? 'rotate(2deg)' : 'rotate(5deg)', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}
                >
                  <img
                    src="/images/shared/italian-for-real-life-cover.jpg"
                    alt="Cover of Italian for Real Life in Italy by Caesar Julius Sedek"
                    width={600}
                    height={900}
                    loading="lazy"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>

              <div className="md:order-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                  Italian for Real Life in Italy · eBook
                </p>
                <h2 id="italian-book-heading" className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  {heading}
                </h2>
                <p className="font-semibold text-foreground mb-2">Not Italian for tourists. Italian for real life.</p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A practical language and survival guide for English speakers building a life in Italy—not a grammar textbook, not a tourist phrasebook.
                </p>
                <ul className="space-y-2 mb-4">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground italic mb-6">
                  Each section follows the real exchange: YOU SAY → THEY SAY → YOU RESPOND. Understanding the next thirty seconds is what actually matters.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="hover-lift">
                    <a href={withUtm('https://www.caesartheday.com/books', region)} target="_blank" rel="noopener noreferrer" data-analytics-event="italian_book_website">
                      Get the eBook
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="hover-lift">
                    <a href="https://www.amazon.com/dp/B0HJB6VNNT" target="_blank" rel="noopener noreferrer" data-analytics-event="italian_book_amazon">
                      Buy on Amazon
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
