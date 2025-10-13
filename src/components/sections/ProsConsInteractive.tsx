import { Card, CardContent } from '@/components/ui/card';
import { Scale } from 'lucide-react';

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
  const { intro, pros, cons, finalTake } = prosCons;

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
                <img 
                  src="/images/caesar-thumbs-up.png" 
                  alt="Caesar Thumbs Up" 
                  className="h-20 w-20 object-contain"
                />
                <h3 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  The Pros
                </h3>
              </div>

              <div className="space-y-4">
                {pros.map((pro, idx) => (
                  <Card key={idx} className="shadow-soft hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <h4 className="font-bold text-lg mb-3 text-green-700 dark:text-green-300">
                        {idx + 1}. {pro.title}
                      </h4>
                      <ul className="space-y-2">
                        {pro.points.map((point, pidx) => (
                          <li key={pidx} className="text-sm text-foreground/80 flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cons Section */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="/images/caesar-thumbs-down.png" 
                  alt="Caesar Thumbs Down" 
                  className="h-20 w-20 object-contain"
                />
                <h3 className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
                  The Cons
                </h3>
              </div>

              <div className="space-y-4">
                {cons.map((con, idx) => (
                  <Card key={idx} className="shadow-soft hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <h4 className="font-bold text-lg mb-3 text-orange-700 dark:text-orange-300">
                        {idx + 1}. {con.title}
                      </h4>
                      <ul className="space-y-2">
                        {con.points.map((point, pidx) => (
                          <li key={pidx} className="text-sm text-foreground/80 flex items-start gap-2">
                            <span className="text-orange-600 dark:text-orange-400 mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Final Take */}
          <Card className="shadow-medium bg-primary/5 border-primary/20">
            <CardContent className="p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                {finalTake.headline}
              </h3>
              <p className="text-lg text-foreground/90 leading-relaxed mb-4 text-center max-w-3xl mx-auto">
                {finalTake.text}
              </p>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto italic">
                {finalTake.conclusion}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
