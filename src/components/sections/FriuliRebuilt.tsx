import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Building, Hammer, ShieldCheck } from 'lucide-react';
import { quakeTowns, quakeFacts, quakeChecklist } from './friuliIdentityData';

export default function FriuliRebuilt() {
  const [id, setId] = useState(quakeTowns[0]?.name ?? '');
  const town = quakeTowns.find((t) => t.name === id);
  if (!town) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Hammer className="h-10 w-10 mx-auto mb-4 text-primary" />
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">6 May 1976</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Rebuilt From Rubble</h2>
          <p className="text-lg text-muted-foreground">
            The Orcolat — the ogre, as Friulians call the earthquake — took fifty-five seconds and a thousand lives. What
            the region did next is taught internationally, and it is the reason Friulians are the way they are.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {quakeFacts.map((f) => (
            <div key={f.label} className="rounded-2xl bg-background ring-1 ring-border p-4 text-center shadow-soft">
              <p className="text-2xl md:text-3xl font-bold text-primary">{f.value}</p>
              <p className="text-xs font-semibold mt-1">{f.label}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{f.note}</p>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex justify-center gap-2 mb-5">
            {quakeTowns.map((t) => (
              <button
                key={t.name}
                onClick={() => setId(t.name)}
                aria-pressed={t.name === id}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all ring-1',
                  t.name === id
                    ? 'bg-primary text-primary-foreground ring-primary shadow-soft'
                    : 'bg-background text-muted-foreground ring-border hover:text-foreground'
                )}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="grid gap-0 md:grid-cols-5 rounded-3xl overflow-hidden bg-background ring-1 ring-border shadow-soft">
            <figure className="relative m-0 md:col-span-2">
              <img src={town.image} alt={town.imageAlt} loading="lazy" className="h-56 md:h-full w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/90 to-transparent p-5">
                <h3 className="text-xl font-bold text-background">{town.name}</h3>
              </figcaption>
            </figure>
            <div className="md:col-span-3 p-6 md:p-8 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">1976</p>
                <p className="text-sm leading-relaxed">{town.then}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1">Today</p>
                <p className="text-sm leading-relaxed">{town.now}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold text-center">What this means if you are buying here</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {quakeChecklist.map((c) => (
              <div key={c.title} className="rounded-2xl bg-background ring-1 ring-border p-5 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">{c.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="max-w-3xl mx-auto text-center text-sm text-muted-foreground mt-8">
            Friuli rebuilt itself with its own hands and its own money, in place, in ten years — and then quietly went
            back to work. Spend an evening in a bar in Gemona and you will understand the regional character better than
            any guidebook can explain it.
          </p>
        </div>
      </div>
    </section>
  );
}
