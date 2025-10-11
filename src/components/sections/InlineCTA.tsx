import { Button } from '@/components/ui/button';
import { GlobalsData } from '@/utils/getRegionData';
interface InlineCTAProps {
  globals: GlobalsData;
  ctaIds: string[];
}
export function InlineCTA({
  globals,
  ctaIds
}: InlineCTAProps) {
  const cta = globals.brand.ctas.find(c => ctaIds.includes(c.id));
  if (!cta) return null;
  
  return <section className="py-6 md:py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl shadow-soft p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{cta.headline}</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {cta.body}
            </p>
            <Button size="lg" asChild className="hover-lift">
              <a href={cta.href} target="_blank" rel="noopener noreferrer">
                {cta.label}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>;
}