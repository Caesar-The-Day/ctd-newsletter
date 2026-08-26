import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';

interface FolkMonth {
  month: string;
  short: string;
  event: string;
  german?: string;
  where: string;
  what: string;
  tone: 'winter' | 'spring' | 'summer' | 'autumn';
}

const MONTHS: FolkMonth[] = [
  {
    month: 'January',
    short: 'Jan',
    event: 'Klöckeln and the Three Kings',
    german: 'Perchtenlauf',
    where: 'Val Sarentino, Val Pusteria',
    what: 'Masked processions close out the twelve nights. In Sarentino the last of the Klöckler groups go door to door; in villages elsewhere the Sternsinger chalk 20*C+M+B*26 above front doors.',
    tone: 'winter',
  },
  {
    month: 'February',
    short: 'Feb',
    event: 'Egetmann Carnival',
    german: 'Egetmannumzug',
    where: 'Tramin — every odd-numbered year',
    what: 'A pagan wedding parade with tar-covered figures, hundreds of masks and a documented history back to 1591. Genuinely strange, and defiantly not for tourists.',
    tone: 'winter',
  },
  {
    month: 'March',
    short: 'Mar',
    event: 'Scheibenschlagen',
    german: 'Fire-disc throwing',
    where: 'Val Venosta hillsides',
    what: 'Burning wooden discs are flung off a launch ramp into the dark valley, each one dedicated to a girl by name. The oldest surviving spring-fire rite in the Alps.',
    tone: 'spring',
  },
  {
    month: 'April',
    short: 'Apr',
    event: 'Apple blossom',
    where: 'Val di Non, Val Venosta, Oltradige',
    what: 'Ten days when 18,000 hectares of orchard turn white at once. Beekeepers truck hives in from other provinces; the valley smells of it.',
    tone: 'spring',
  },
  {
    month: 'May',
    short: 'May',
    event: 'Asparagus season',
    german: 'Spargelzeit',
    where: 'Terlano and the Adige plain',
    what: 'White asparagus from Terlano, served with three sauces and boiled potatoes. Restaurants build entire menus around it for four weeks, then stop dead.',
    tone: 'spring',
  },
  {
    month: 'June',
    short: 'Jun',
    event: 'Sacred Heart fires',
    german: 'Herz-Jesu-Feuer',
    where: 'Every ridge line in South Tyrol',
    what: 'On the third Sunday after Pentecost, bonfires are lit on the mountains in shapes — crosses, hearts, the Tyrolean eagle. It commemorates the 1796 vow against Napoleon and is, quietly, an identity statement.',
    tone: 'summer',
  },
  {
    month: 'July',
    short: 'Jul',
    event: 'Malga season opens',
    german: 'Almsommer',
    where: 'High pastures above 1,700 m',
    what: 'Herds are up on the alpine pasture, the malghe are making cheese daily, and the rifugi are open. The Müller Thurgau Review pours in Cembra at the same time.',
    tone: 'summer',
  },
  {
    month: 'August',
    short: 'Aug',
    event: 'Ferragosto and the high season',
    where: 'Dolomite valleys, Lake Garda',
    what: 'The one month locals avoid the famous passes. Sella and Pordoi are bumper to bumper; the trick is to walk from a valley nobody has heard of.',
    tone: 'summer',
  },
  {
    month: 'September',
    short: 'Sep',
    event: 'Törggelen begins',
    where: 'Valle Isarco, Renon, Val Venosta',
    what: 'Walk uphill to a farm, eat speck, Schlutzkrapfen, roast chestnuts and doughnuts, drink the year\'s new wine, walk back down. The most South Tyrolean thing there is.',
    tone: 'autumn',
  },
  {
    month: 'October',
    short: 'Oct',
    event: 'Almabtrieb and apple harvest',
    german: 'Cattle descent',
    where: 'Val Pusteria, Val Senales, Val di Non',
    what: 'Cows come down decorated with flowers and mirrors if the summer passed without loss. Meanwhile the apple harvest runs flat out — the valley floor is a conveyor belt of crates.',
    tone: 'autumn',
  },
  {
    month: 'November',
    short: 'Nov',
    event: 'Törggelen peaks, then the quiet',
    where: 'Everywhere, then nowhere',
    what: 'The last chestnut evenings, then the shoulder season: cable cars closed for maintenance, hotels shut, villages returned to residents. The best month to see what living here is actually like.',
    tone: 'autumn',
  },
  {
    month: 'December',
    short: 'Dec',
    event: 'Krampus, then the markets',
    german: 'Krampuslauf · Christkindlmarkt',
    where: 'Bolzano, Merano, Bressanone, Brunico, Vipiteno, Trento',
    what: 'On 5 December the masks run. From late November the six Christmas markets take over the historic centres — a civic institution here, and the reason the region is fully booked until Epiphany.',
    tone: 'winter',
  },
];

const TONE_RING: Record<FolkMonth['tone'], string> = {
  winter: 'from-primary/30 to-primary/5',
  spring: 'from-primary/25 to-primary/5',
  summer: 'from-primary/40 to-primary/10',
  autumn: 'from-primary/35 to-primary/10',
};

export function TrentinoFolkCalendar() {
  const [index, setIndex] = useState(8); // September — Törggelen
  const active = MONTHS[index];

  return (
    <div className="mt-12 md:mt-16 rounded-2xl border border-border/60 bg-card/60 overflow-hidden">
      <div className="p-6 md:p-10 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
          <CalendarDays className="h-4 w-4" />
          Interactive — the folk year
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">A calendar that answers to the mountain</h3>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Fire discs in March, bonfires on the ridge lines in June, cows in flower crowns in October. The year here is
          organised by Alpine custom rather than by the Italian holiday calendar — turn the wheel and see what your
          neighbours will be doing.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-0">
        {/* Wheel */}
        <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-border/60 flex items-center justify-center bg-muted/20">
          <div className="relative aspect-square w-full max-w-[380px]">
            <div
              className={`absolute inset-[14%] rounded-full bg-gradient-to-br ${TONE_RING[active.tone]} transition-all duration-500`}
            />
            <div className="absolute inset-[26%] rounded-full border border-border/60 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
              <Sparkles className="h-4 w-4 text-primary mb-2" />
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{active.month}</div>
              <div className="text-base md:text-lg font-bold text-foreground leading-tight mt-1">{active.event}</div>
            </div>

            {MONTHS.map((m, i) => {
              const angle = (i / MONTHS.length) * Math.PI * 2 - Math.PI / 2;
              const r = 44;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              const isActive = i === index;
              return (
                <button
                  key={m.month}
                  type="button"
                  onClick={() => setIndex(i)}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  aria-pressed={isActive}
                  aria-label={`${m.month} — ${m.event}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-[11px] font-semibold transition-all ${
                    isActive
                      ? 'h-11 w-11 border-primary bg-primary text-primary-foreground shadow-lg'
                      : 'h-9 w-9 border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground'
                  }`}
                >
                  {m.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.month}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{active.month}</div>
              <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{active.event}</h4>
              {active.german && <p className="text-sm italic text-muted-foreground mb-4">{active.german}</p>}

              <div className="flex items-start gap-2 text-sm text-muted-foreground mb-5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{active.where}</span>
              </div>

              <p className="text-base md:text-lg text-foreground/90 leading-relaxed">{active.what}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + MONTHS.length) % MONTHS.length)}
              className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
            >
              Previous month
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % MONTHS.length)}
              className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
            >
              Next month
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
