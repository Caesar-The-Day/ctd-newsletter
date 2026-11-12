import { Landmark, ExternalLink } from 'lucide-react';
import { autonomy } from './aostaData';
import { AostaSection } from './AostaSection';

export default function AostaAutonomy() {
  if (!autonomy.length) return null;
  return (
    <AostaSection muted eyebrow="Special statute" title="What Autonomy Means for Your Wallet" intro="Valle d'Aosta keeps most of the taxes it collects. That doesn't mean lower taxes for you, but it does mean better-funded services and local schemes. Here is what it can mean, and who qualifies.">
      <div className="grid md:grid-cols-2 gap-5">
        {autonomy.map((a) => (
          <div key={a.title} className="rounded-3xl border border-border bg-background p-6 shadow-soft">
            <Landmark className="h-5 w-5 text-primary mb-3" />
            <h3 className="text-xl font-bold mb-1">{a.title}</h3>
            <p className="text-xs uppercase tracking-[0.14em] text-primary mb-3">Who: {a.who}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.detail}</p>
            <a href={a.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Official source <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-5 text-center">Regional schemes change every year. Check before you count on any of them.</p>
    </AostaSection>
  );
}
