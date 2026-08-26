import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee } from 'lucide-react';

interface Order {
  id: string;
  local: string;
  rest: string;
  what: string;
  glass: 'small' | 'medium' | 'tall';
  milk: number; // 0-1 share of drink
  foam: boolean;
}

const orders: Order[] = [
  { id: 'nero', local: 'Nero', rest: 'Espresso', what: 'A plain espresso. Ask for "un caffè" in Trieste and you may still get one, but locals say nero.', glass: 'small', milk: 0, foam: false },
  { id: 'capo', local: 'Capo', rest: 'Macchiato', what: 'An espresso capped with a little hot milk. The everyday Trieste order.', glass: 'small', milk: 0.25, foam: true },
  { id: 'capo-b', local: 'Capo in B', rest: 'Macchiato in a glass', what: 'The same capo, served in a small glass ("in bicchiere"). The most Triestino thing you can say at a counter.', glass: 'small', milk: 0.3, foam: true },
  { id: 'goccia', local: 'Goccia', rest: 'Espresso with a drop of foam', what: 'A nero with just a drop of milk foam on top. Less milk than a capo.', glass: 'small', milk: 0.1, foam: true },
  { id: 'deca', local: 'Deca', rest: 'Decaffeinated', what: 'Decaf. Combines with the rest: "deca in B" is entirely normal.', glass: 'small', milk: 0, foam: false },
  { id: 'caffelatte', local: 'Caffelatte', rest: 'Caffè Latte', what: 'Coffee with plenty of hot milk, in a tall glass. "Latte" on its own means milk everywhere in Italy; ask for "caffè latte" if you want coffee with milk.', glass: 'tall', milk: 0.7, foam: true }
];

export default function TriesteCoffeeDecoder() {
  const [id, setId] = useState(orders[2].id);
  const o = orders.find((x) => x.id === id)!;
  const h = o.glass === 'tall' ? 150 : o.glass === 'medium' ? 110 : 80;
  const w = o.glass === 'tall' ? 64 : 74;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Coffee className="h-10 w-10 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How to Order Coffee in Trieste</h2>
          <p className="text-lg text-muted-foreground">
            Italy's coffee port kept its own vocabulary. Order in standard Italian here and you will get something you didn't expect.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Glass illustration */}
          <div className="flex justify-center">
            <div className="relative flex flex-col items-center">
              <div
                className="relative rounded-b-xl rounded-t-md border-2 border-border bg-background overflow-hidden transition-all duration-500"
                style={{ height: h, width: w }}
              >
                {/* coffee */}
                <div
                  className="absolute inset-x-0 bottom-0 bg-[hsl(25_45%_22%)] transition-all duration-500"
                  style={{ height: `${(1 - o.milk) * 82}%` }}
                />
                {/* milk */}
                <div
                  className="absolute inset-x-0 bg-[hsl(35_45%_78%)] transition-all duration-500"
                  style={{ bottom: `${(1 - o.milk) * 82}%`, height: `${o.milk * 82}%` }}
                />
                {/* foam */}
                {o.foam && (
                  <div
                    className="absolute inset-x-0 bg-[hsl(40_50%_92%)] transition-all duration-500"
                    style={{ bottom: `${82}%`, height: '10%' }}
                  />
                )}
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted" style={{ width: w + 24 }} />
              <p className="mt-4 text-sm text-muted-foreground">
                {o.glass === 'tall' ? 'Tall glass' : 'Small glass or cup'}
              </p>
            </div>
          </div>

          {/* Orders */}
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {orders.map((x) => (
                <button
                  key={x.id}
                  onClick={() => setId(x.id)}
                  className={cn(
                    'px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:border-primary/50',
                    x.id === id ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background text-muted-foreground'
                  )}
                >
                  {x.local}
                </button>
              ))}
            </div>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-1">{o.local}</h3>
                <p className="text-sm text-primary font-medium mb-3">Elsewhere in Italy: {o.rest}</p>
                <p className="text-foreground/80 leading-relaxed">{o.what}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="max-w-2xl mx-auto text-center text-sm text-muted-foreground mt-10 italic">
          Trieste has roasted and traded the coffee arriving through its port for three centuries. Learning four words here buys you more
          goodwill than any amount of careful grammar.
        </p>
      </div>
    </section>
  );
}
