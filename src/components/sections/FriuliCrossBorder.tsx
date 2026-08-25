import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Fuel, ShoppingBasket, Stethoscope, Mountain, Globe2, Info } from 'lucide-react';

interface Base {
  id: string;
  name: string;
  country: string;
  crossings: { label: string; time: string }[];
  airports: { code: string; name: string; time: string }[];
  errands: { icon: typeof Fuel; label: string; note: string }[];
  summary: string;
}

const bases: Base[] = [
  {
    id: 'trieste',
    name: 'Trieste',
    country: 'Slovenia in 15 minutes, Croatia in an hour',
    summary: 'A city that treats two other countries as suburbs. Slovene bakeries in the Karst villages, Croatian coast for the weekend, Ljubljana for a concert.',
    crossings: [
      { label: 'Slovenian border (Fernetti / Lipica)', time: '~15 min' },
      { label: 'Ljubljana', time: '~1h30' },
      { label: 'Croatian Istria (Buje, Umag)', time: '~1h' }
    ],
    airports: [
      { code: 'TRS', name: 'Trieste Airport (Ronchi)', time: '~35 min, direct rail link' },
      { code: 'LJU', name: 'Ljubljana', time: '~1h45' },
      { code: 'VCE', name: 'Venice Marco Polo', time: '~2h' }
    ],
    errands: [
      { icon: Fuel, label: 'Fuel', note: 'Slovenian pumps just over the border are habitually cheaper; the queue at Fernetti is the proof.' },
      { icon: ShoppingBasket, label: 'Groceries', note: 'Slovene supermarkets in Sežana and Divača are a routine run for many Trieste households.' },
      { icon: Stethoscope, label: 'Dentistry', note: 'Cross-border dental clinics in Slovenia and Croatia are a long-standing habit for Italians — privately paid, not covered by the SSN.' }
    ]
  },
  {
    id: 'gorizia',
    name: 'Gorizia',
    country: 'One city, two countries',
    summary: 'Gorizia and Nova Gorica share a square and a tram-less border you walk across. They hold the European Capital of Culture title jointly for 2025 — the only such pairing in Europe.',
    crossings: [
      { label: 'Nova Gorica (Slovenia)', time: 'On foot, ~5 min' },
      { label: 'Ljubljana', time: '~1h30' },
      { label: 'Vipava valley wine country', time: '~30 min' }
    ],
    airports: [
      { code: 'TRS', name: 'Trieste Airport (Ronchi)', time: '~30 min' },
      { code: 'VCE', name: 'Venice Marco Polo', time: '~1h45' },
      { code: 'LJU', name: 'Ljubljana', time: '~1h30' }
    ],
    errands: [
      { icon: ShoppingBasket, label: 'Groceries', note: 'Two national price structures within walking distance; residents shop the difference weekly.' },
      { icon: Fuel, label: 'Fuel', note: 'Slovenian stations are a five-minute drive, not an expedition.' },
      { icon: Globe2, label: 'Culture', note: 'Two national theatre and festival programmes for the price of one address.' }
    ]
  },
  {
    id: 'tarvisio',
    name: 'Tarvisio',
    country: 'Italy, Austria and Slovenia meet here',
    summary: 'The Val Canale is the only place in Italy where three countries and four languages meet in one valley. Austria is closer than the regional capital.',
    crossings: [
      { label: 'Austrian border (Coccau)', time: '~10 min' },
      { label: 'Villach, Austria', time: '~30 min' },
      { label: 'Kranjska Gora, Slovenia', time: '~25 min' }
    ],
    airports: [
      { code: 'KLU', name: 'Klagenfurt, Austria', time: '~1h' },
      { code: 'LJU', name: 'Ljubljana', time: '~1h15' },
      { code: 'TRS', name: 'Trieste Airport (Ronchi)', time: '~1h45' }
    ],
    errands: [
      { icon: Mountain, label: 'Skiing', note: 'The Sella Nevea and Kranjska Gora areas are local; Austrian resorts sit within a short drive.' },
      { icon: ShoppingBasket, label: 'Groceries', note: 'Villach for the big Austrian shop, Tarvisio\'s Saturday market for everything else.' },
      { icon: Stethoscope, label: 'Healthcare', note: 'Routine care is Italian and local; anything specialist means Udine, roughly an hour south.' }
    ]
  }
];

export default function FriuliCrossBorder() {
  const [id, setId] = useState(bases[0].id);
  const base = bases.find((b) => b.id === id)!;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Globe2 className="h-10 w-10 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Living on Three Borders</h2>
          <p className="text-lg text-muted-foreground">
            In Friuli, "abroad" is a short drive. Pick a base and see what having Slovenia and Austria next door actually gets you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2 mb-8">
          {bases.map((b) => (
            <button
              key={b.id}
              onClick={() => setId(b.id)}
              className={cn(
                'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:border-primary/50',
                b.id === id ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background text-muted-foreground'
              )}
            >
              {b.name}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-1">{base.name}</h3>
              <p className="text-primary text-sm font-medium mb-3">{base.country}</p>
              <p className="text-foreground/80 mb-6 leading-relaxed">{base.summary}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg bg-background border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Border reach</p>
                  <ul className="space-y-2">
                    {base.crossings.map((c) => (
                      <li key={c.label} className="flex justify-between gap-3 text-sm">
                        <span className="text-foreground/80">{c.label}</span>
                        <span className="font-semibold whitespace-nowrap">{c.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-background border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                    <Plane className="h-4 w-4 text-primary" /> Airports in range
                  </p>
                  <ul className="space-y-2">
                    {base.airports.map((a) => (
                      <li key={a.code} className="flex justify-between gap-3 text-sm">
                        <span className="text-foreground/80">
                          <span className="font-semibold">{a.code}</span> · {a.name}
                        </span>
                        <span className="font-semibold whitespace-nowrap">{a.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {base.errands.map((e) => {
                  const EIcon = e.icon;
                  return (
                    <div key={e.label} className="rounded-lg bg-muted/50 border border-border p-4">
                      <div className="flex items-center gap-2 mb-1 text-primary">
                        <EIcon className="h-4 w-4" />
                        <span className="text-sm font-semibold">{e.label}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{e.note}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6 rounded-lg border border-border bg-background p-4">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  The practical caveat: cheap fuel and cross-border dentistry are conveniences, not a plan. Your residency, tax position and
                  healthcare enrolment stay Italian — treat foreign clinics as private, out-of-pocket care unless you have arranged EU cover.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
