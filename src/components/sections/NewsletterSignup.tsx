import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { withUtm } from '@/lib/utm';

interface NewsletterSignupProps {
  campaign: string;
}

export function NewsletterSignup({ campaign }: NewsletterSignupProps) {
  const href = withUtm('https://www.caesartheday.com/newsletter', campaign);
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto rounded-2xl border border-primary/20 bg-card p-8 md:p-10 text-center shadow-medium">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Get the next region when it's published
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
            One region a month: towns, real costs, healthcare and the honest downsides. Plus the free Ultimate Italy Moving Checklist.
          </p>
          <Button size="lg" asChild className="group">
            <a href={href} target="_blank" rel="noopener noreferrer" data-analytics-event="newsletter_signup_click">
              Send me the next region
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
