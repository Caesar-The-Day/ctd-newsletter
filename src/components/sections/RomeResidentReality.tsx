import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Euro, TrainFront, TriangleAlert, Building2 } from 'lucide-react';

type TabId = 'cost' | 'access' | 'friction';

interface Row {
  label: string;
  value: string;
  note: string;
}

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Euro;
  lead: string;
  rows: Row[];
  verdict: string;
}

const TABS: Tab[] = [
  {
    id: 'cost',
    label: 'Cost',
    icon: Euro,
    lead:
      'Rome is the second most expensive city in Italy to rent in, and the gap between the centre and the ring is enormous. These are the numbers residents quote, not the ones in relocation brochures.',
    rows: [
      {
        label: 'Rent — centro storico / Trastevere / Prati',
        value: '€1,400–2,200 / month (1–2 bed)',
        note: 'Short-let competition has pushed long lets up sharply since 2022; furnished stock dominates.',
      },
      {
        label: 'Rent — semi-central (Monteverde, Trieste, San Giovanni, Ostiense)',
        value: '€900–1,400 / month',
        note: 'The realistic band for most people who want to live in Rome rather than visit it.',
      },
      {
        label: 'Rent — outer (EUR periphery, Montesacro, Torrino, Casalotti)',
        value: '€650–1,000 / month',
        note: 'Space and parking, but you are now dependent on a bus feeder to the metro.',
      },
      {
        label: 'Buying',
        value: '€6,000–9,000/m² centre · €2,500–3,800/m² semi-central · €1,800–2,500/m² outer',
        note: 'Restoration on a historic building is slow and permit-heavy. Budget contingency and time.',
      },
      {
        label: 'Condo fees (spese condominiali)',
        value: '€80–250 / month',
        note: 'Lifts, porters and courtyards in old buildings cost real money. Ask before you sign.',
      },
      {
        label: 'Utilities',
        value: '€130–220 / month for a couple',
        note: 'High summer AC load; old buildings with no insulation swing both ways.',
      },
      {
        label: 'Groceries & eating out',
        value: '10–20% above the Lazio regional average',
        note: 'Markets (Testaccio, Trionfale) close the gap; anything within sight of a monument doubles it.',
      },
    ],
    verdict:
      'A couple can live comfortably but not lavishly in Rome on roughly €2,600–3,200 a month all in, if they are semi-central and do not run two cars. The same money in Viterbo or Frosinone buys a house with a garden and a much shorter to-do list.',
  },
  {
    id: 'access',
    label: 'Getting around',
    icon: TrainFront,
    lead:
      'Rome has three metro lines for 2.7 million people — a fraction of what a city this size should have, because you cannot dig anywhere without hitting archaeology. What saves it is the regional rail network and the fact that the historic core is genuinely walkable.',
    rows: [
      {
        label: 'Metro A, B/B1, C',
        value: '~60 km total, trains every 4–8 min',
        note: 'Line C is still creeping towards the centre. If your address is not near A or B, you are a bus user.',
      },
      {
        label: 'Buses and trams',
        value: 'Extensive, unpredictable',
        note: 'ATAC coverage is wide but reliability is the standing complaint of every resident.',
      },
      {
        label: 'Monthly transit pass',
        value: '€35 (Metrebus Roma) · €50–90 for regional zones',
        note: 'Over-70 Rome residents travel free on the urban network — worth checking eligibility.',
      },
      {
        label: 'Regional rail',
        value: 'Coast in 45–60 min · Castelli in 35 min · Viterbo in 1h45',
        note: 'The reason living in Rome without a car is workable: weekends out are a train ticket, not an expedition.',
      },
      {
        label: 'Fiumicino (FCO)',
        value: '32 min on the Leonardo Express (€14) from Termini',
        note: 'Italy\'s main intercontinental hub, direct to North America and Asia.',
      },
      {
        label: 'Ciampino (CIA)',
        value: '~40 min by bus/train combo',
        note: 'Low-cost carriers across Europe; small, chaotic, cheap.',
      },
      {
        label: 'High-speed rail',
        value: 'Naples 1h10 · Florence 1h30 · Milan 3h',
        note: 'Termini and Tiburtina make Rome the best-connected address in Italy, full stop.',
      },
      {
        label: 'ZTL (limited traffic zones)',
        value: 'Centro storico, Trastevere, Testaccio, San Lorenzo',
        note: 'Residents get a permit for their own zone. Non-residents get fines by post, often months later.',
      },
    ],
    verdict:
      'Inside the ring, a car is a liability: parking is a blood sport and the ZTL cameras are unforgiving. Live semi-central, use rail for the region, and rent a car for the weekends you actually need one.',
  },
  {
    id: 'friction',
    label: 'The friction',
    icon: TriangleAlert,
    lead:
      'None of this is a reason not to live in Rome. It is a reason to choose your street carefully, and to know what you are signing up for before the second summer.',
    rows: [
      {
        label: 'Mass tourism',
        value: '~35 million visitors a year, concentrated in ~4 km²',
        note: 'Centro storico, Vatican and Colosseo are effectively theme parks from March to October. Monti, Testaccio and Garbatella still feel like neighbourhoods.',
      },
      {
        label: 'Short-let pressure on rents',
        value: 'Thousands of units moved to tourist letting',
        note: 'The biggest single driver of the rent rises since 2022, and the main reason locals have moved outward.',
      },
      {
        label: 'Traffic and parking',
        value: 'Among the worst congestion in Europe',
        note: 'Peak commutes routinely run 40–60% over free-flow times. Resident parking permits do not guarantee a space.',
      },
      {
        label: 'Bureaucracy',
        value: 'Residency, codice fiscale, health card: weeks to months',
        note: 'Appointments are scarce and often only bookable online at odd hours. A commercialista or a patronato pays for itself.',
      },
      {
        label: 'Summer heat',
        value: '35–40°C stretches in July and August',
        note: 'Stone city, little shade, night-time temperatures that barely drop. Romans leave in August for a reason.',
      },
      {
        label: 'Services and upkeep',
        value: 'Waste collection and road maintenance are inconsistent',
        note: 'Varies enormously by municipio. Walk the block on a Monday morning before you commit to it.',
      },
      {
        label: 'Healthcare',
        value: 'Excellent hospitals, long public waiting lists',
        note: 'Gemelli, Umberto I and Sant\'Andrea are top-tier. Many residents hold a modest private policy for diagnostics.',
      },
    ],
    verdict:
      'Rome rewards the patient and punishes the impatient. If your daily life needs efficiency, this is the wrong city. If it needs texture, beauty and the best connections in the country, nowhere in Lazio comes close.',
  },
];

const COMPARISON = [
  { metric: 'Rent, 2-bed', rome: '€1,200–1,600', town: '€450–650' },
  { metric: 'Buy, per m²', rome: '€3,500–6,000', town: '€900–1,500' },
  { metric: 'Car needed?', rome: 'No', town: 'Yes, always' },
  { metric: 'Hospital access', rome: 'World-class, within 20 min', town: '30–60 min to a full hospital' },
  { metric: 'International airport', rome: '30–40 min', town: '1h30–2h' },
  { metric: 'Tourist pressure', rome: 'Constant in the core', town: 'A few weekends a year' },
  { metric: 'English spoken', rome: 'Widely', town: 'Rarely' },
];

export default function RomeResidentReality() {
  const [tabId, setTabId] = useState<TabId>('cost');
  const tab = TABS.find((t) => t.id === tabId)!;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <Building2 className="w-4 h-4" />
            The capital, as a resident
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Living in Rome, not visiting it
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Forget the fountains for a moment. What matters when Rome is your address is what it
            costs, how you move, and what wears you down by the third year. Here is the honest
            ledger — both sides of it.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <Button
                key={t.id}
                size="sm"
                variant={t.id === tabId ? 'default' : 'outline'}
                onClick={() => setTabId(t.id)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </Button>
            );
          })}
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            <p className="text-base text-foreground leading-relaxed mb-6">{tab.lead}</p>

            <div className="divide-y divide-border">
              {tab.rows.map((r) => (
                <div key={r.label} className="py-4 grid md:grid-cols-[1fr_auto] gap-1 md:gap-6 md:items-start">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{r.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">{r.note}</p>
                  </div>
                  <Badge variant="secondary" className="justify-self-start md:justify-self-end whitespace-normal text-left md:text-right font-medium">
                    {r.value}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border bg-primary/5 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-6 rounded-b-lg">
              <p className="text-sm font-semibold text-primary mb-1">The verdict</p>
              <p className="text-sm text-foreground leading-relaxed">{tab.verdict}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-foreground text-center mb-1">
            Rome vs. a Lazio hill town
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Same region, same healthcare system, entirely different life.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="p-3 font-semibold text-foreground">&nbsp;</th>
                  <th className="p-3 font-semibold text-foreground">Rome (semi-central)</th>
                  <th className="p-3 font-semibold text-foreground">Hill town (Tuscia / Ciociaria)</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((c) => (
                  <tr key={c.metric} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium text-foreground">{c.metric}</td>
                    <td className="p-3 text-muted-foreground">{c.rome}</td>
                    <td className="p-3 text-muted-foreground">{c.town}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
