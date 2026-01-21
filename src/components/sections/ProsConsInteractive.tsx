import { Card, CardContent } from '@/components/ui/card';
import { Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStaggeredReveal } from '@/hooks/use-staggered-reveal';

interface ProConItem {
  title: string;
  points: string[];
}

interface ProsConsInteractiveProps {
  prosCons: {
    intro: {
      headline: string;
      lead: string;
      tradeoff: string;
    };
    pros: ProConItem[];
    cons: ProConItem[];
    finalTake: {
      headline: string;
      text: string;
      conclusion: string;
    };
  };
}

export function ProsConsInteractive({ prosCons }: ProsConsInteractiveProps) {
  // Defensive defaults for incomplete scaffolded data
  const intro = prosCons?.intro ?? { headline: '', lead: '', tradeoff: '' };
  const pros = prosCons?.pros ?? [];
  const cons = prosCons?.cons ?? [];
  const finalTake = prosCons?.finalTake ?? { headline: '', text: '', conclusion: '' };
  
  // Don't render if there's no meaningful content
  if (!intro.headline && pros.length === 0 && cons.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Scale className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {intro.headline}
            </h2>
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6 max-w-4xl mx-auto">
              {intro.lead}
            </p>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-4xl mx-auto">
              {intro.tradeoff}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Pros Section */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
                <h3 className="text-2xl md:text-3xl font-bold text-primary">
                  The Pros
                </h3>
              </div>

              <div className="space-y-4">
                {pros.map((pro, idx) => (
                  <ProConCard key={idx} index={idx} type="pro">
                    <h4 className="font-bold text-lg mb-3 text-foreground">
                      {idx + 1}. {pro.title}
                    </h4>
                    <ul className="space-y-2">
                      {pro.points.map((point, pidx) => (
                        <li key={pidx} className="text-sm text-foreground/80 flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </ProConCard>
                ))}
              </div>
            </div>

            {/* Cons Section */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-2xl md:text-3xl font-bold text-muted-foreground">
                  The Cons
                </h3>
              </div>

              <div className="space-y-4">
                {cons.map((con, idx) => (
                  <ProConCard key={idx} index={idx} type="con">
                    <h4 className="font-bold text-lg mb-3 text-foreground">
                      {idx + 1}. {con.title}
                    </h4>
                    <ul className="space-y-2">
                      {con.points.map((point, pidx) => (
                        <li key={pidx} className="text-sm text-foreground/80 flex items-start gap-2">
                          <span className="text-muted-foreground mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </ProConCard>
                ))}
              </div>
            </div>
          </div>

          {/* Final Take */}
          <Card className="shadow-medium bg-primary/5 border-primary/20">
            <CardContent className="p-8 md:p-10">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">
                {finalTake.headline}
              </h3>
              <p className="text-base text-foreground/90 leading-relaxed mb-4 text-center max-w-3xl mx-auto">
                {finalTake.text}
              </p>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto italic">
                {finalTake.conclusion}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ProConCard({ 
  children, 
  index, 
  type 
}: { 
  children: React.ReactNode; 
  index: number;
  type: 'pro' | 'con';
}) {
  const { isVisible, elementRef } = useStaggeredReveal();
  const borderClass = type === 'pro' ? 'border-l-primary' : 'border-l-muted-foreground/50';

  return (
    <Card 
      ref={elementRef as any}
      className={`shadow-soft hover:shadow-lg border-l-4 ${borderClass} transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      <CardContent className="p-5">
        {children}
      </CardContent>
    </Card>
  );
}
