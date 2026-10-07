import { HeartPulse } from 'lucide-react';

export function HealthEnrollmentNote() {
  return (
    <aside className="border-y border-border bg-primary/5 py-6" aria-label="National health service enrollment cost">
      <div className="container mx-auto flex max-w-4xl items-start gap-3 px-4">
        <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-foreground">
          <strong className="font-semibold">Budget for enrollment:</strong>{' '}
          most Elective Residency Visa holders who join Italy’s national health service voluntarily pay at least about €2,000 per year.
        </p>
      </div>
    </aside>
  );
}