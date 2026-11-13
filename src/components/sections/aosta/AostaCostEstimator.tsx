import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Car, Flame, HeartPulse, ShoppingBasket, UtensilsCrossed, Plug, Ticket, Mountain } from 'lucide-react';
import { costTowns, tierSpend, carMonthly, healthMonthly, type Tier } from './aostaLiving';
import { AostaSection } from './AostaSection';

const tiers: { id: Tier; label: string }[] = [
  { id: 'modest', label: 'Modest' }, { id: 'comfortable', label: 'Comfortable' }, { id: 'premium', label: 'Premium' },
];
const eur = (n: number) => `€${Math.round(n).toLocaleString('en-US')}`;

export default function AostaCostEstimator() {
  const [townId, setTownId] = useState('aosta');
  const [tier, setTier] = useState<Tier>('comfortable');
  const [people, setPeople] = useState<1 | 2>(2);
  const [car, setCar] = useState(true);
  const [season, setSeason] = useState<'winter' | 'year'>('year');
  const [erv, setErv] = useState(true);
  const town = costTowns.find(t => t.id === townId) ?? costTowns[0];
  const isAosta = town.id === 'aosta';
  const carOn = car || !isAosta;

  const rows = useMemo(() => {
    const s = tierSpend[tier]; const m = people === 1 ? 0.65 : 1;
    const heat = season === 'winter' ? town.heatingWinter : (town.heatingWinter * 6) / 12;
    return [
      { k: 'Rent', icon: Home, v: town.rent[tier] },
      { k: 'Heating', icon: Flame, v: heat },
      { k: 'Other utilities', icon: Plug, v: s.utilities },
      { k: 'Groceries', icon: ShoppingBasket, v: s.groceries * m },
      { k: 'Eating out', icon: UtensilsCrossed, v: s.dining * m },
      { k: 'Leisure & ski', icon: Ticket, v: s.leisure * m },
      ...(carOn ? [{ k: 'Car', icon: Car, v: carMonthly }] : []),
      ...(erv ? [{ k: 'Health (ERV)', icon: HeartPulse, v: healthMonthly * people }] : []),
    ];
  }, [town, tier, people, carOn, season, erv]);
  const total = rows.reduce((a, r) => a + r.v, 0);
  const maxRow = Math.max(...rows.map(r => r.v));
  const buy80 = town.buyPerSqm * 80;

  const Toggle = ({ on, set, label }: { on: boolean; set: (b: boolean) => void; label: string }) => (
    <button onClick={() => set(!on)} className="flex items-center gap-2 text-sm">
      <span className={`w-10 h-6 rounded-full p-0.5 transition-colors ${on ? 'bg-primary' : 'bg-muted'}`}><motion.span layout className={`block w-5 h-5 rounded-full bg-background shadow ${on ? 'ml-4' : ''}`} /></span>{label}
    </button>
  );

  return (
    <AostaSection eyebrow="Cost of living · 2026 estimates" title="What a Month Really Costs" intro="Valle d'Aosta isn't one price. Pont-Saint-Martin costs like Piemonte, and Courmayeur costs like Milan. Choose a town and a lifestyle, then add the mountain extras most calculators leave out.">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Town</p>
            <div className="grid grid-cols-2 gap-2">
              {costTowns.map(t => (
                <button key={t.id} onClick={() => setTownId(t.id)} className={`text-left rounded-xl px-3 py-2 border transition-all ${t.id === townId ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}>
                  <span className="block font-semibold text-sm">{t.name}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Mountain className="h-3 w-3" />{t.altitude.toLocaleString()} m</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Lifestyle</p>
            <div className="flex gap-2">{tiers.map(t => (
              <button key={t.id} onClick={() => setTier(t.id)} className={`relative flex-1 py-2 rounded-full text-sm font-semibold ${tier === t.id ? 'text-primary-foreground' : 'bg-muted'}`}>
                {tier === t.id && <motion.span layoutId="aosta-tier" className="absolute inset-0 rounded-full bg-primary" />}<span className="relative">{t.label}</span>
              </button>))}</div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Household</p>
            <div className="flex gap-2">{[1, 2].map(n => (
              <button key={n} onClick={() => setPeople(n as 1 | 2)} className={`flex-1 py-2 rounded-full text-sm font-semibold ${people === n ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{n === 1 ? 'Single' : 'Couple'}</button>))}</div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Show</p>
            <div className="flex gap-2">{(['year', 'winter'] as const).map(s => (
              <button key={s} onClick={() => setSeason(s)} className={`flex-1 py-2 rounded-full text-sm font-semibold ${season === s ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{s === 'year' ? 'Year-round average' : 'A January month'}</button>))}</div>
          </div>
          <div className="space-y-3">
            {isAosta ? <Toggle on={car} set={setCar} label="I'll keep a car" /> : <p className="text-sm text-muted-foreground flex items-center gap-2"><Car className="h-4 w-4" /> Outside Aosta, a car is included. You'll need one.</p>}
            <Toggle on={erv} set={setErv} label="Health cover via voluntary SSN (ERV)" />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft">
          <div className="flex items-end justify-between mb-1">
            <p className="text-sm text-muted-foreground">Monthly total · {town.name}</p>
            <p className="text-sm text-muted-foreground">{eur(total * 12)} / year</p>
          </div>
          <motion.p key={Math.round(total)} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold text-primary mb-6">{eur(total)}</motion.p>
          <div className="space-y-3">
            {rows.map(r => { const Icon = r.icon; return (
              <div key={r.k} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <span className="w-32 text-sm shrink-0">{r.k}</span>
                <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden"><motion.div className="h-full rounded-full bg-primary" animate={{ width: `${(r.v / maxRow) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></div>
                <span className="w-16 text-right text-sm font-semibold tabular-nums">{eur(r.v)}</span>
              </div>); })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={town.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-muted/50 p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Buying instead?</p><p className="font-semibold">~{eur(town.buyPerSqm)}/m² · 80 m² ≈ {eur(buy80)}</p></div>
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4"><p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Local read</p><p className="text-sm">{town.note}</p></div>
            </motion.div>
          </AnimatePresence>
          <p className="text-xs text-muted-foreground mt-5">Editorial estimates for 2026, not quotes. Heating assumes about six months of heating in an older stone or concrete home. The health line uses the €2,000 a year minimum per person for voluntary SSN enrolment. Car costs include insurance, fuel, winter tyres and some A5 tolls.</p>
        </div>
      </div>
    </AostaSection>
  );
}
