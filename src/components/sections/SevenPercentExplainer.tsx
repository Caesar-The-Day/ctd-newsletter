 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { BookOpen, ExternalLink, CheckCircle2 } from 'lucide-react';
 
 export function SevenPercentExplainer() {
   return (
     <section className="py-12 md:py-16 bg-background">
       <div className="container mx-auto px-4 max-w-4xl">
         <Card className="shadow-medium border-primary/20">
           <CardContent className="p-8 md:p-12">
             <div className="flex items-center gap-3 mb-4 text-primary">
               <BookOpen className="h-6 w-6" />
               <span className="text-sm font-semibold uppercase tracking-wide">From the Blog</span>
             </div>
 
             <h2 className="text-2xl md:text-4xl font-bold mb-4">
               What Is the 7% Flat Tax, Really?
             </h2>
             <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
               Italy's 7% flat-tax regime lets foreign retirees pay a flat 7% on all foreign-source
               income—pensions, dividends, rental income, capital gains—for up to 10 years. But
               eligibility hinges on details most summaries skip.
             </p>
 
             <ul className="space-y-3 mb-8">
               {[
                'You must move your tax residency to a qualifying town in Southern Italy with fewer than 30,000 residents (threshold raised from 20,000 in April 2026), or to specific earthquake-affected areas.',
                 'You cannot have been an Italian tax resident in the previous 5 years.',
                 'Your pension must come from a foreign source—public, private, or both.',
                 'The 7% replaces IRPEF, regional and municipal surcharges, plus IVIE/IVAFE on foreign assets.',
               ].map((point) => (
                 <li key={point} className="flex gap-3">
                   <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                   <span className="text-foreground/90">{point}</span>
                 </li>
               ))}
             </ul>
 
             <Button asChild size="lg" className="w-full sm:w-auto">
               <a
                 href="https://www.caesartheday.com/blog/italy-7-percent-flat-tax-for-retirees"
                 target="_blank"
                 rel="noopener noreferrer"
               >
                 Read the Full Guide on the Blog
                 <ExternalLink className="h-4 w-4 ml-2" />
               </a>
             </Button>
           </CardContent>
         </Card>
       </div>
     </section>
   );
 }