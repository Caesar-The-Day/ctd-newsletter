import { phrases, frenchWhere } from './aostaData';
import { AostaSection } from './AostaSection';

export default function AostaBilingual() {
  if (!phrases.length) return null;
  return (
    <AostaSection eyebrow="Italian, French, Patois" title="The Bilingual Valley" intro="French has been official here longer than Italian has. In practice you will live in Italian, see French on every sign, and hear Patois at the village bar.">
      <div className="overflow-x-auto rounded-3xl border border-border bg-background shadow-soft mb-8">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr>{['English', 'Italian', 'French', 'Patois'].map((h) => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>{phrases.map((p) => (
            <tr key={p.en} className="border-t border-border"><td className="px-5 py-3 text-muted-foreground">{p.en}</td><td className="px-5 py-3">{p.it}</td><td className="px-5 py-3">{p.fr}</td><td className="px-5 py-3 font-medium text-primary">{p.pa}</td></tr>
          ))}</tbody>
        </table>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {frenchWhere.map((w) => <div key={w.place} className="rounded-2xl border border-border p-5"><h3 className="font-semibold mb-1">{w.place}</h3><p className="text-sm text-muted-foreground">{w.detail}</p></div>)}
      </div>
      <p className="text-xs text-muted-foreground mt-4">Patois spelling differs from valley to valley. These are common forms.</p>
    </AostaSection>
  );
}
