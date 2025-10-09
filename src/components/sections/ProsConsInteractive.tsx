import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProsConsInteractiveProps {
  pros: string[];
  cons: string[];
}

export function ProsConsInteractive({ pros, cons }: ProsConsInteractiveProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            The Reality Check
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pros */}
            <Card className="shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <ThumbsUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Pros</h3>
                </div>

                <Accordion type="multiple" className="space-y-2">
                  {pros.map((pro, idx) => (
                    <AccordionItem key={idx} value={`pro-${idx}`} className="border-none">
                      <AccordionTrigger className="text-left hover:no-underline py-3 px-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30">
                        <span className="text-sm font-medium">{pro}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 pb-4">
                        <p className="text-sm text-muted-foreground">
                          This is a genuine advantage of living in Piemonte.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Cons */}
            <Card className="shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                    <ThumbsDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Cons</h3>
                </div>

                <Accordion type="multiple" className="space-y-2">
                  {cons.map((con, idx) => (
                    <AccordionItem key={idx} value={`con-${idx}`} className="border-none">
                      <AccordionTrigger className="text-left hover:no-underline py-3 px-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30">
                        <span className="text-sm font-medium">{con}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-2 pb-4">
                        <p className="text-sm text-muted-foreground">
                          Worth considering before making the move.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
