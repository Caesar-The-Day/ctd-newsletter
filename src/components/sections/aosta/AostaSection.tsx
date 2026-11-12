import { ReactNode } from 'react';
export function AostaSection({ eyebrow, title, intro, children, muted }: { eyebrow: string; title: string; intro: string; children: ReactNode; muted?: boolean }) {
  return (
    <section className={muted ? 'py-16 md:py-24 bg-muted/30' : 'py-16 md:py-24'}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">{eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{intro}</p>
        </div>
        <div className="max-w-5xl mx-auto">{children}</div>
      </div>
    </section>
  );
}
