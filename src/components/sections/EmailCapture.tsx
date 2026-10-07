import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EmailCaptureProps {
  /** Region slug or "home" — becomes the "VVV <campaign>" tag. */
  campaign: string;
  id?: string;
}

type Status = 'idle' | 'sending' | 'done' | 'already' | 'error';

const inputClass =
  'w-full rounded-lg border border-input bg-card px-4 py-3 text-[17px] text-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring';

/** The one Veni. Vidi. Vici. sign-up. Captures in place and forwards to the CaesarTheDay subscriber list. */
export function EmailCapture({ campaign, id }: EmailCaptureProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const fid = `signup-${campaign}-${id ?? 'a'}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('vvv-subscribe', {
        body: { firstName: firstName.trim(), email: email.trim(), campaign, website },
      });
      if (fnError || !data?.success) throw new Error(data?.error || 'failed');
      setStatus(data.alreadySubscribed ? 'already' : 'done');
      (window as any).trackEvent?.('newsletter_signup', { campaign });
    } catch {
      setStatus('error');
      setError("Sorry, that didn't go through. Please try again in a moment.");
    }
  };

  const finished = status === 'done' || status === 'already';

  // The homepage's brand theme (Playfair headings, cream + blush palette) is
  // scoped to the homepage. On region pages the sign-up must inherit that
  // region's own theme so it blends into the page instead of standing out.
  const isHome = campaign === 'home';
  const displayFont = isHome ? 'font-display' : '';

  return (
    <section
      id={id}
      className={`${isHome ? 'brand-ctd' : ''} scroll-mt-24 border-y border-border text-foreground`}
      style={isHome ? { backgroundColor: 'hsl(20 55% 92%)' } : undefined}
    >
      <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
        <div>
          <h2 className={`${displayFont} text-4xl font-semibold md:text-5xl`}>One new region a month.</h2>
          <p className="mt-4 max-w-xl text-[17px] text-muted-foreground">
            Towns, real costs, healthcare and the honest downsides — straight to your inbox. Plus the free{' '}
            <strong className="font-semibold text-foreground">Ultimate Italy Moving Checklist</strong>.
          </p>
        </div>
        <div className="w-full max-w-md md:ml-auto" aria-live="polite">
          {finished ? (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="h-5 w-5" />
              </div>
              <p className={`${displayFont} text-2xl font-semibold`}>
                {status === 'already' ? "You're already on the list." : "You're in."}
              </p>
              <p className="mt-2 text-muted-foreground">
                {status === 'already'
                  ? 'The next region will land in your inbox.'
                  : 'The next region lands in your inbox.'}
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label htmlFor={`${fid}-name`} className="mb-2 block text-sm font-medium">First name</label>
              <input id={`${fid}-name`} required maxLength={80} autoComplete="given-name" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
              <label htmlFor={`${fid}-email`} className="mb-2 mt-4 block text-sm font-medium">Your email</label>
              <input id={`${fid}-email`} type="email" required maxLength={255} autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website}
                onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />
              <button type="submit" disabled={status === 'sending'}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-[17px] font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90 disabled:opacity-70"
                data-analytics-event="newsletter_signup_click">
                {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Send me the next region
                {status !== 'sending' && <ArrowRight className="h-4 w-4" />}
              </button>
              {status === 'error' && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
              <p className="mt-3 text-sm text-muted-foreground">Free. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
