import { Stethoscope, Plane, Wifi, Activity, Droplet, MessageSquare, ShieldAlert } from 'lucide-react';

interface RealityItem {
  icon: typeof Stethoscope;
  title: string;
  body: string;
  takeaway: string;
}

const items: RealityItem[] = [
  {
    icon: Stethoscope,
    title: 'Healthcare reach',
    body:
      'Public hospitals (ASP) cover routine care across most coastal towns. For specialists and complex procedures, expect to drive to Catanzaro (Mater Domini, Pugliese-Ciaccio), Cosenza (Annunziata), or Reggio Calabria (Grande Ospedale). Most coastal homes are 30–75 minutes from one of these.',
    takeaway: 'Pick a base within 60 min of a provincial capital. Private clinics fill the gap for diagnostics.',
  },
  {
    icon: Plane,
    title: 'Flight connectivity',
    body:
      'Lamezia Terme (SUF) is the workhorse — year-round links to Milan, Rome, Bergamo, Turin, plus seasonal routes to London, Brussels, Paris, Frankfurt and Warsaw. Reggio Calabria (REG) handles mostly domestic. Winter schedules thin out noticeably from November to March.',
    takeaway: 'For frequent international travel, base yourself within 90 min of Lamezia.',
  },
  {
    icon: Wifi,
    title: 'Internet & fiber',
    body:
      'Fiber (FTTH, 1 Gbps) is solid in Catanzaro, Cosenza, Reggio, Lamezia, and most coastal towns above 5,000 residents. Smaller hilltop villages often have FWA (fixed wireless) at 100–300 Mbps — fine for video calls, sometimes bumpy in storms. Always verify the specific address before signing a lease.',
    takeaway: 'Check coverage at the actual address on Open Fiber and TIM maps before committing.',
  },
  {
    icon: ShieldAlert,
    title: 'Seismic awareness',
    body:
      'Calabria sits in Italy\'s highest seismic classification zone (Zona 1). The 1908 Messina-Reggio earthquake reshaped the region. Modern construction (post-2009 NTC code) is engineered for it; older buildings vary widely. This is not a reason to avoid Calabria — it is a reason to read a structural survey before buying.',
    takeaway: 'Hire a geometra for any pre-1980 property. Insurance with seismic coverage is affordable.',
  },
  {
    icon: Droplet,
    title: 'Summer water supply',
    body:
      'Some coastal municipalities ration water in late July and August (overnight cutoffs are common in parts of Crotone, Vibo Valentia, and the Reggio metro coast). Larger towns and most of the Tyrrhenian coast above Tropea are unaffected. Most homes have rooftop cisterns as a buffer.',
    takeaway: 'Ask the municipality directly: \"C\'è razionamento d\'acqua in estate?\" Cisterns are normal here.',
  },
  {
    icon: MessageSquare,
    title: 'English & expat density',
    body:
      'Lower than Tuscany, Puglia, or Lake Como. You\'ll find English at hotels, in Tropea, Scilla and Pizzo, and among younger Italians. Daily life — the comune, the doctor, the plumber — runs in Italian and often in dialect. The expat community is small but growing, concentrated around Tropea and the Riviera dei Cedri.',
    takeaway: 'Plan to learn functional Italian. Locals are warm and patient with anyone who tries.',
  },
];

export function CalabriaRealityCheck() {
  return (
    <section className="py-12 md:py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <Activity className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Reality Check: Living in Calabria</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The honest answers to the questions every serious retiree asks before moving south.
            No postcards — just what daily life actually looks like.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {item.body}
                </p>
                <div className="border-t border-border pt-3">
                  <p className="text-xs uppercase tracking-wide font-semibold text-primary mb-1">
                    What this means for you
                  </p>
                  <p className="text-sm text-foreground/90 leading-snug">{item.takeaway}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}