import { motion } from 'framer-motion';
import { alpageSteps } from './aostaData';
import { AostaSection } from './AostaSection';

export default function AostaAlpage() {
  if (!alpageSteps.length) return null;
  return (
    <AostaSection eyebrow="Fontina DOP" title="The Alpage Summer" intro="Here the year follows the cows. Fontina is only real if it's made from raw milk of Valdostana cows, and the best wheels come from the summer pastures.">
      <ol className="relative border-l-2 border-primary/30 ml-3 space-y-8">
        {alpageSteps.map((s, k) => (
          <motion.li key={s.title} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.08 }} className="pl-8 relative">
            <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary" />
            <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold">{s.month}</p>
            <h3 className="text-xl font-bold mt-1">{s.title}</h3>
            <p className="text-muted-foreground mt-1 max-w-2xl">{s.text}</p>
          </motion.li>
        ))}
      </ol>
    </AostaSection>
  );
}
