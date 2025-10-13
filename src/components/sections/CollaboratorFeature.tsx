import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface CollaboratorFeatureProps {
  heading: string;
  paragraphs: string[];
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export function CollaboratorFeature({
  heading,
  paragraphs,
  ctaText,
  ctaLink,
  backgroundImage,
}: CollaboratorFeatureProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-background/90" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground italic opacity-0 animate-fade-in-up">
          {heading}
        </h2>

        <div className="space-y-6 mb-8">
          {paragraphs.map((para, idx) => (
            <p
              key={idx}
              className="text-lg leading-relaxed text-foreground/90 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${(idx + 1) * 0.15}s`, animationFillMode: 'forwards' }}
            >
              {para}
            </p>
          ))}
        </div>

        <div 
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${(paragraphs.length + 1) * 0.15}s`, animationFillMode: 'forwards' }}
        >
          <Button 
            asChild
            size="lg"
            className="group"
          >
            <a 
              href={ctaLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              {ctaText}
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
