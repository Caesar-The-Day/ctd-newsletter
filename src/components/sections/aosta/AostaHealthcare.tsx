import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hospital, Plane, Globe2, Stethoscope, Snowflake, Phone, Pill, Building2, Train, Wifi } from 'lucide-react';
import { hospitalTimes } from './aostaData';
import { careFacilities, careSteps, careTowns } from './aostaLiving';
import { AostaSection } from './AostaSection';

export default function AostaHealthcare() {
  const [townId, setTownId] = useState(careTowns[0].id);
  const town = careTowns.find(t => t.id === townId) ?? careTowns[0];
  const max = Math.max(...hospitalTimes.map(h => h.mins), 1);
  const ring = 2 * Math.PI * 52;
  const pct = Math.min(town.hospital / 70, 1);

  return (
    <AostaSection muted eyebrow="Healthcare & infrastructure" title="One Hospital, Many Valleys" intro="The whole region relies on one main hospital in Aosta, the Umberto Parini. That is simple if you live near Aosta and a real factor if you live at the end of a side valley.">
      {/* Town picker */}
      <div className="rounded-3xl border border-border bg-background p-6 md:p-8 shadow-soft mb-6">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" /> Where would you live?</h3>
        <p className="text-sm text-muted-foreground mb-5">Pick a town to see your realistic distance to care.</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {careTowns.map(t => (
            <button key={t.id} onClick={() => setTownId(t.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${t.id === townId ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>{t.name}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={town.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-[auto_1fr_1fr] gap-6 items-center">
            <div className="relative w-36 h-36 mx-auto">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" className="stroke-muted" strokeWidth="10" fill="none" />
                <motion.circle cx="60" cy="60" r="52" className="stroke-primary" strokeWidth="10" fill="none" strokeLinecap="round"
                  strokeDasharray={ring} initial={{ strokeDashoffset: ring }} animate={{ strokeDashoffset: ring * (1 - pct) }} transition={{ duration: 1, ease: 'easeOut' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold">{town.hospital}</span><span className="text-xs text-muted-foreground leading-tight">min to<br />hospital</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-muted/50 p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Nearest clinic</p><p className="font-semibold">{town.clinic} · {town.clinicMin} min</p></div>
              <div className="rounded-2xl bg-muted/50 p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Emergency</p><p className="font-semibold">Call 112 · helicopter from Aosta</p></div>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1 flex items-center gap-1"><Snowflake className="h-3.5 w-3.5" /> Winter reality</p>
              <p className="text-sm">{town.winter}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 mb-6">
        <div className="rounded-3xl border border-border bg-background p-6 shadow-soft">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Hospital className="h-5 w-5 text-primary" /> Drive to Aosta hospital</h3>
          <div className="space-y-3">{hospitalTimes.map((h, i) => (
            <div key={h.from}><div className="flex justify-between text-sm mb-1"><span>{h.from}</span><span className="font-semibold">{h.mins} min</span></div>
              <div className="h-2 rounded-full bg-muted overflow-hidden"><motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} whileInView={{ width: `${(h.mins / max) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.8 }} /></div></div>
          ))}</div>
          <p className="text-xs text-muted-foreground mt-4">Estimates in good weather. Add time in snow.</p>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-background p-6"><Plane className="h-5 w-5 text-primary mb-2" /><h3 className="text-lg font-bold mb-1">Helicopter rescue</h3><p className="text-sm text-muted-foreground">The emergency helicopter is based in Aosta and reaches most side valleys in minutes, day and night, weather permitting.</p></div>
          <div className="rounded-3xl border border-border bg-background p-6"><Globe2 className="h-5 w-5 text-primary mb-2" /><h3 className="text-lg font-bold mb-1">Specialist care</h3><p className="text-sm text-muted-foreground">For complex care, patients are usually sent to Turin (about 1h15). Lower-valley residents also use Ivrea. Treatment in Switzerland is private unless pre-authorised.</p></div>
        </div>
      </div>

      {/* How to get in the system */}
      <div className="rounded-3xl border border-border bg-background p-6 md:p-8 mb-6">
        <h3 className="font-bold text-lg mb-5">Getting into the system, step by step</h3>
        <ol className="grid md:grid-cols-4 gap-4">
          {careSteps.map((s, i) => (
            <motion.li key={s.t} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="relative rounded-2xl bg-muted/50 p-4">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-3">{i + 1}</span>
              <p className="font-semibold mb-1">{s.t}</p><p className="text-sm text-muted-foreground">{s.d}</p>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Facilities */}
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Where care actually happens</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {careFacilities.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-border bg-background p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">{f.kind} · {f.place}</p>
            <p className="font-bold mt-1 mb-2">{f.name}</p><p className="text-sm text-muted-foreground">{f.note}</p>
          </motion.div>
        ))}
      </div>

      {/* Infrastructure quick facts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Pill, t: 'Pharmacies', d: 'Every sizeable village has one. A rota keeps one open at night in each area.' },
          { icon: Phone, t: 'Out-of-hours doctor', d: 'Guardia medica covers nights and weekends. Call 116117.' },
          { icon: Train, t: 'Rail', d: 'The Aosta–Ivrea–Turin line is slow, and it often has long closures for electrification works. Plan on driving.' },
          { icon: Wifi, t: 'Internet', d: 'Fibre in Aosta and the main valley. In side valleys check coverage street by street, and some homes rely on 4G or 5G.' },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl bg-background border border-border p-5"><Icon className="h-5 w-5 text-primary mb-2" /><p className="font-semibold mb-1">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
        ))}
      </div>
    </AostaSection>
  );
}
