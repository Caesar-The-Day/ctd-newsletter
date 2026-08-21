import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplets, Thermometer, Euro, Clock, Car, LayoutGrid, Table2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Spring {
  id: string;
  name: string;
  place: string;
  temp: string;
  minerals: string;
  access: 'free' | 'paid';
  price: string;
  hours: string;
  fromRome: string;
  season: 'year-round' | 'seasonal';
  verdict: string;
  resident: 'weekly' | 'occasional';
  link?: string;
}

const SPRINGS: Spring[] = [
  {
    id: 'bullicame',
    name: 'Bullicame',
    place: 'Viterbo (Tuscia)',
    temp: '58°C at source, ~40°C in the pools',
    minerals: 'Sulphurous, calcium-sulphate, high sulphur smell',
    access: 'free',
    price: 'Free, public',
    hours: 'Open air, effectively 24/7 (parking gates close overnight)',
    fromRome: '~1h20 by car (SS Cassia / A1 Orte)',
    season: 'year-round',
    resident: 'weekly',
    verdict:
      'The one locals actually use. Bring flip-flops and a towel, expect a mixed crowd at dawn and after dinner. Cited by Dante in the Inferno, still free eight centuries later.',
    link: 'https://www.italia.it/en/lazio/viterbo/things-to-do/bullicame-thermal-springs',
  },
  {
    id: 'papi',
    name: 'Terme dei Papi',
    place: 'Viterbo',
    temp: '58°C source, ~40°C pool',
    minerals: 'Sulphurous-bicarbonate, same aquifer as Bullicame',
    access: 'paid',
    price: '€12–25 day ticket; night openings cost more',
    hours: 'Wed–Mon, closed Tue for cleaning',
    fromRome: '~1h20 by car; train to Viterbo + bus ~2h',
    season: 'year-round',
    resident: 'occasional',
    verdict:
      'A 2,000 m² monumental pool with a spa attached. Worth the ticket in winter when the steam sits over the water; too pricey to be a habit.',
    link: 'https://www.termedeipapi.it/en/',
  },
  {
    id: 'fiuggi',
    name: 'Fonte Bonifacio VIII / Terme di Fiuggi',
    place: 'Fiuggi (Ciociaria)',
    temp: '~13°C — this is a drinking cure, not a soak',
    minerals: 'Low-mineral diuretic water, famous for kidney stones',
    access: 'paid',
    price: '€10–15 entry to the fonti park; treatment packages higher',
    hours: 'Seasonal, roughly April–November',
    fromRome: '~1h10 by car (A1 Anagni)',
    season: 'seasonal',
    resident: 'occasional',
    verdict:
      'Not a hot spring. Fiuggi is Italy\'s classic termalismo town — shaded parks, bandstands, prescribed glasses of water. Charming, medical, and closed half the year.',
    link: 'https://www.termedifiuggi.it/',
  },
  {
    id: 'acque-albule',
    name: 'Acque Albule / Terme di Roma',
    place: 'Tivoli (Bagni di Tivoli)',
    temp: '23–24°C, sulphurous cold-warm',
    minerals: 'Sulphurous-calcic, strongly carbonated',
    access: 'paid',
    price: '€15–20 day ticket',
    hours: 'Daily, extended summer hours',
    fromRome: '~35 min by car (A24) or regional train to Bagni di Tivoli',
    season: 'year-round',
    resident: 'weekly',
    verdict:
      'The closest real spa to Rome, and reachable without a car. The water is cooler than you expect, so it reads as a summer swim more than a winter soak.',
    link: 'https://www.termediroma.org/',
  },
  {
    id: 'cretone',
    name: 'Terme di Cretone',
    place: 'Palombara Sabina (Sabina)',
    temp: '~29°C',
    minerals: 'Sulphurous, mildly mineralised',
    access: 'paid',
    price: '€10–14 day ticket',
    hours: 'Broadly April–October, weekends off-season',
    fromRome: '~45 min by car (via Salaria/Nomentana)',
    season: 'seasonal',
    resident: 'occasional',
    verdict:
      'Unpretentious pools in the Sabine hills, popular with Roman families in summer. Basic facilities, low prices, very local.',
  },
  {
    id: 'stigliano',
    name: 'Terme di Stigliano',
    place: 'Canale Monterano (Bracciano hinterland)',
    temp: '35–58°C across the various springs',
    minerals: 'Sulphurous and ferruginous, Etruscan-era use',
    access: 'paid',
    price: '€20–30, spa-hotel pricing',
    hours: 'Daily, booking recommended',
    fromRome: '~1h by car (Braccianese)',
    season: 'year-round',
    resident: 'occasional',
    verdict:
      'The prettiest setting of the lot — woodland, a small hotel, Etruscan and Roman ruins in the grounds. Priced as a treat, not as a routine.',
    link: 'https://www.termedistigliano.it/',
  },
];

type Filter = 'all' | 'free' | 'paid' | 'year-round' | 'near-rome';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All springs' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
  { id: 'year-round', label: 'Year-round' },
  { id: 'near-rome', label: 'Under an hour from Rome' },
];

const NEAR_ROME = new Set(['acque-albule', 'cretone', 'stigliano']);

export default function LazioThermalSprings() {
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [selected, setSelected] = useState<string>('bullicame');

  const springs = useMemo(() => {
    switch (filter) {
      case 'free':
        return SPRINGS.filter((s) => s.access === 'free');
      case 'paid':
        return SPRINGS.filter((s) => s.access === 'paid');
      case 'year-round':
        return SPRINGS.filter((s) => s.season === 'year-round');
      case 'near-rome':
        return SPRINGS.filter((s) => NEAR_ROME.has(s.id));
      default:
        return SPRINGS;
    }
  }, [filter]);

  const active = SPRINGS.find((s) => s.id === selected) ?? SPRINGS[0];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <Droplets className="w-4 h-4" />
            Volcanic water
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lazio's thermal springs, compared
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The same dead volcanoes that gave Lazio its lakes also gave it hot water. Some of it is
            free and open to the sky at six in the morning; some of it comes with a €25 ticket and a
            robe. Here's which is which — and which ones a resident actually returns to.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {FILTERS.map((f) => (
            <Button
              key={f.id}
              size="sm"
              variant={filter === f.id ? 'default' : 'outline'}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
          <div className="ml-2 flex gap-1">
            <Button
              size="sm"
              variant={view === 'cards' ? 'secondary' : 'ghost'}
              onClick={() => setView('cards')}
              aria-label="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={view === 'table' ? 'secondary' : 'ghost'}
              onClick={() => setView('table')}
              aria-label="Comparison table"
            >
              <Table2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {view === 'cards' ? (
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
            <div className="grid sm:grid-cols-2 gap-4 content-start">
              {springs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={cn(
                    'text-left rounded-lg border bg-card p-4 transition-all hover:shadow-md',
                    s.id === selected ? 'border-primary shadow-md' : 'border-border',
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-semibold text-foreground leading-tight">{s.name}</h3>
                    <Badge variant={s.access === 'free' ? 'default' : 'secondary'} className="text-xs shrink-0">
                      {s.access === 'free' ? 'Free' : 'Paid'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{s.place}</p>
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    <Thermometer className="w-3.5 h-3.5 text-primary" />
                    {s.temp.split(',')[0]}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Car className="w-3.5 h-3.5" />
                    {s.fromRome}
                  </div>
                </button>
              ))}
              {springs.length === 0 && (
                <p className="text-sm text-muted-foreground italic">Nothing matches that filter.</p>
              )}
            </div>

            <Card className="lg:sticky lg:top-24 h-fit">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="text-xl font-bold text-foreground">{active.name}</h3>
                  <Badge variant={active.resident === 'weekly' ? 'default' : 'outline'} className="text-xs">
                    {active.resident === 'weekly' ? 'Habit-forming' : 'Day trip'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-5">{active.place}</p>

                <dl className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <Thermometer className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <dt className="font-medium text-foreground">Water</dt>
                      <dd className="text-muted-foreground">{active.temp} — {active.minerals}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Euro className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <dt className="font-medium text-foreground">Cost</dt>
                      <dd className="text-muted-foreground">{active.price}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <dt className="font-medium text-foreground">When it's open</dt>
                      <dd className="text-muted-foreground">{active.hours}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Car className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <dt className="font-medium text-foreground">From Rome</dt>
                      <dd className="text-muted-foreground">{active.fromRome}</dd>
                    </div>
                  </div>
                </dl>

                <p className="mt-5 pt-5 border-t border-border text-sm text-muted-foreground leading-relaxed italic">
                  {active.verdict}
                </p>

                {active.link && (
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    More information →
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="p-3 font-semibold text-foreground">Spring</th>
                  <th className="p-3 font-semibold text-foreground">Temperature</th>
                  <th className="p-3 font-semibold text-foreground">Cost</th>
                  <th className="p-3 font-semibold text-foreground">Season</th>
                  <th className="p-3 font-semibold text-foreground">From Rome</th>
                </tr>
              </thead>
              <tbody>
                {springs.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <div className="font-medium text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.place}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">{s.temp}</td>
                    <td className="p-3 text-muted-foreground">{s.price}</td>
                    <td className="p-3 text-muted-foreground capitalize">{s.season}</td>
                    <td className="p-3 text-muted-foreground">{s.fromRome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6 max-w-3xl mx-auto">
          Prices and opening patterns move year to year — treat these as planning ranges, not quotes.
          Free springs have no lifeguards, no changing rooms, and sulphur will tarnish silver jewellery.
        </p>
      </div>
    </section>
  );
}
