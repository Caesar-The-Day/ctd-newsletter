import { Hospital, Plane, Globe2 } from 'lucide-react';
import { hospitalTimes } from './aostaData';
import { AostaSection } from './AostaSection';

export default function AostaHealthcare() {
  const max = Math.max(...hospitalTimes.map((h) => h.mins), 1);
  return (
    <AostaSection muted eyebrow="Healthcare & infrastructure" title="One Hospital, Many Valleys" intro="The whole region relies on one main hospital in Aosta, the Umberto Parini. That is simple if you live near Aosta and a real factor if you live at the end of a side valley.">
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="rounded-3xl border border-border bg-background p-6 shadow-soft">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Hospital className="h-5 w-5 text-primary" /> Drive to Aosta hospital</h3>
          <div className="space-y-3">{hospitalTimes.map((h) => (
            <div key={h.from}><div className="flex justify-between text-sm mb-1"><span>{h.from}</span><span className="font-semibold">{h.mins} min</span></div>
              <div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(h.mins / max) * 100}%` }} /></div></div>
          ))}</div>
          <p className="text-xs text-muted-foreground mt-4">Estimates in good weather. Add time in snow.</p>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-background p-6"><Plane className="h-5 w-5 text-primary mb-2" /><h3 className="font-bold mb-1">Helicopter rescue</h3><p className="text-sm text-muted-foreground">The 118 emergency helicopter is based in Aosta and reaches most side valleys in minutes, day and night.</p></div>
          <div className="rounded-3xl border border-border bg-background p-6"><Globe2 className="h-5 w-5 text-primary mb-2" /><h3 className="font-bold mb-1">Specialist care</h3><p className="text-sm text-muted-foreground">For complex care, patients are usually sent to Turin (about 1h15). Lower-valley residents also use Ivrea. Treatment in Switzerland is private unless pre-authorised.</p></div>
        </div>
      </div>
    </AostaSection>
  );
}
