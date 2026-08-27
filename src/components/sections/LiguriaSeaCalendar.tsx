import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, MapPin, Waves, Flame, Music, Church } from 'lucide-react';
import { cn } from '@/lib/utils';

type Feast = {
  id: string;
  month: number;
  when: string;
  name: string;
  place: string;
  kind: 'sea' | 'fire' | 'sacred' | 'stage';
  blurb: string;
  practical: string;
};

const FEASTS: Feast[] = [
  {
    id: 'sanremo',
    month: 2,
    when: 'Late February',
    name: 'Festival di Sanremo',
    place: 'Sanremo, Teatro Ariston',
    kind: 'stage',
    blurb: 'Italy\u2019s song contest, five nights that stop the country. The town is unrecognisable — police cordons, TV trucks, sold-out everything.',
    practical: 'If you live in Ponente, book restaurants weeks ahead or stay home. Hotel prices in Sanremo triple.',
  },
  {
    id: 'corpus',
    month: 6,
    when: 'Corpus Domini (June)',
    name: 'Infiorata flower carpets',
    place: 'Diano Marina, Sassello, Imperia',
    kind: 'sacred',
    blurb: 'Streets carpeted overnight in petals, worked by families in relay from midnight to dawn, then walked over by the procession.',
    practical: 'Arrive at 7am to see them intact — by noon they are gone.',
  },
  {
    id: 'sangiovanni',
    month: 6,
    when: '24 June',
    name: 'San Giovanni Battista',
    place: 'Genoa',
    kind: 'fire',
    blurb: 'Genoa\u2019s patron. The ashes of the Baptist are carried to the port and the sea is blessed, then bonfires on the beaches.',
    practical: 'City centre closes to traffic. Best watched from the Porto Antico side.',
  },
  {
    id: 'stellamaris',
    month: 8,
    when: 'First Sunday of August',
    name: 'Stella Maris',
    place: 'Camogli',
    kind: 'sea',
    blurb: 'Thousands of small wax lamps set adrift from the boats after a procession by sea; the whole bay flickers.',
    practical: 'Take the train — parking in Camogli is impossible on that night.',
  },
  {
    id: 'sagrapesce',
    month: 5,
    when: 'Second Sunday of May',
    name: 'Sagra del Pesce',
    place: 'Camogli',
    kind: 'sea',
    blurb: 'A four-metre frying pan on the quay, tonnes of fried anchovies handed out free. Absurd, generous, and entirely serious.',
    practical: 'Queues from mid-morning; the bonfire happens the night before.',
  },
  {
    id: 'torta',
    month: 8,
    when: '14 August',
    name: 'Torta dei Fieschi',
    place: 'Lavagna',
    kind: 'sacred',
    blurb: 'A medieval wedding re-enacted since 1230, ending with a cake several metres tall shared by matching secret passwords with a stranger.',
    practical: 'Buy the token early; the piazza fills by 21:00.',
  },
  {
    id: 'palio',
    month: 8,
    when: 'August',
    name: 'Palio Marinaro del Tigullio',
    place: 'Rapallo, Santa Margherita, Sestri',
    kind: 'sea',
    blurb: 'Rowing crews from each borgo race traditional gozzi. Village rivalry that predates tourism by centuries.',
    practical: 'Free to watch from the seafront; heats run over several weekends.',
  },
  {
    id: 'natalino',
    month: 12,
    when: '24 December',
    name: 'Confuoco',
    place: 'Genoa, Palazzo Ducale',
    kind: 'fire',
    blurb: 'The Doge\u2019s Christmas fire: a laurel log burnt in the Ducale courtyard, the mayor and an Abbot exchanging a toast in Genoese dialect.',
    practical: 'Free, mid-morning, and one of the few times you hear zeneise spoken publicly.',
  },
  {
    id: 'olio',
    month: 11,
    when: 'November',
    name: 'Olive harvest & new oil',
    place: 'Imperia valleys, Taggia, Dolcedo',
    kind: 'sacred',
    blurb: 'Nets under the trees, frantoi running late, and the first bitter-green Taggiasca oil on toasted bread.',
    practical: 'Frantoi sell direct — bring your own tin and buy the year\u2019s supply at producer price.',
  },
];

const KINDS: { id: Feast['kind']; label: string; icon: any }[] = [
  { id: 'sea', label: 'By sea', icon: Waves },
  { id: 'fire', label: 'Fire & rite', icon: Flame },
  { id: 'sacred', label: 'Sacred & seasonal', icon: Church },
  { id: 'stage', label: 'On stage', icon: Music },
];

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export function LiguriaSeaCalendar() {
  const [kind, setKind] = useState<Feast['kind'] | 'all'>('all');
  const [openId, setOpenId] = useState<string>('stellamaris');

  const visible = FEASTS.filter((f) => kind === 'all' || f.kind === kind);
  const open = FEASTS.find((f) => f.id === openId) ?? visible[0];

  return (
    <div className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-5 md:p-8">
      <div className="mb-5">
        <h4 className="text-xl md:text-2xl font-bold text-foreground">The year on the water</h4>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Liguria\u2019s calendar is set by the sea and the harvest, not by the tourist board. These are the dates
          residents actually plan around.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={kind === 'all'} onClick={() => setKind('all')}>All</Chip>
        {KINDS.map(({ id, label, icon: Icon }) => (
          <Chip key={id} active={kind === id} onClick={() => setKind(id)}>
            <Icon className="mr-1 inline h-3.5 w-3.5" />
            {label}
          </Chip>
        ))}
      </div>

      {/* month rail */}
      <div className="relative mb-6 rounded-xl border border-border/60 bg-background/60 p-4">
        <div className="grid grid-cols-12 gap-1">
          {MONTHS.map((m, i) => (
            <div key={i} className="text-center text-[11px] font-medium text-muted-foreground">
              {m}
            </div>
          ))}
        </div>
        <div className="relative mt-2 h-14">
          {visible.map((f) => {
            const left = ((f.month - 0.5) / 12) * 100;
            const isOpen = open?.id === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setOpenId(f.id)}
                style={{ left: `${left}%` }}
                className="absolute top-0 -translate-x-1/2"
                aria-label={f.name}
              >
                <motion.span
                  animate={{ scale: isOpen ? 1.25 : 1 }}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
                    isOpen ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-primary hover:border-primary',
                  )}
                >
                  {(() => {
                    const Icon = KINDS.find((k) => k.id === f.kind)!.icon;
                    return <Icon className="h-4 w-4" />;
                  })()}
                </motion.span>
              </button>
            );
          })}
          <div className="absolute left-0 right-0 top-4 -z-10 h-px bg-border" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key={open.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="rounded-xl border border-border/60 bg-background p-5"
          >
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h5 className="text-lg font-bold text-foreground">{open.name}</h5>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                <CalendarDays className="h-3 w-3" /> {open.when}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" /> {open.place}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{open.blurb}</p>
            <p className="mt-3 border-l-2 border-primary/60 pl-3 text-sm text-foreground/90">
              <span className="font-semibold">Living here: </span>
              {open.practical}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

export default LiguriaSeaCalendar;
