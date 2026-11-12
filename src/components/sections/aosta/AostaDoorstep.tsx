import { ArrowRight } from 'lucide-react';
import { doorstep } from './aostaData';
import { AostaSection } from './AostaSection';

export default function AostaDoorstep() {
  if (!doorstep.length) return null;
  return (
    <AostaSection eyebrow="Three countries, one valley" title="Switzerland and France on Your Doorstep" intro="Can you live here and fly out of Geneva, or shop in Chamonix? Yes, if you plan around the tunnels. Times are by car in good weather.">
      <div className="space-y-3">
        {doorstep.map((d) => (
          <div key={d.place} className="rounded-2xl border border-border bg-background p-5 grid md:grid-cols-[1.2fr_1fr_auto_auto] gap-3 items-center">
            <div><p className="font-bold flex items-center gap-2">Aosta Valley <ArrowRight className="h-4 w-4 text-primary" /> {d.place}</p><p className="text-sm text-muted-foreground">{d.note}</p></div>
            <p className="text-sm">via {d.via}</p>
            <p className="text-sm font-semibold text-primary">{d.time}</p>
            <p className="text-sm text-muted-foreground">{d.toll}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">Tolls are approximate car fares. Check current prices with the tunnel operators.</p>
    </AostaSection>
  );
}
