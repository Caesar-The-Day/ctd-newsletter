import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.23.8';

// Forwards Veni. Vidi. Vici. sign-ups to the CaesarTheDay subscriber list,
// authenticated with a shared partner key that never reaches the browser.
const UPSTREAM = 'https://rgxggzqtexujaoxvzwok.supabase.co/functions/v1/newsletter-subscribe';

const Body = z.object({
  firstName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  campaign: z.string().regex(/^[a-z0-9-]{1,60}$/),
  website: z.string().max(200).optional(),
});

const hits = new Map<string, { n: number; reset: number }>();
const limited = (ip: string) => {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || now > e.reset) { hits.set(ip, { n: 1, reset: now + 60_000 }); return false; }
  return ++e.n > 5;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ success: false, error: 'Method not allowed' }, 405);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return json({ success: false, error: 'Too many attempts. Try again in a minute.' }, 429);

  let raw: unknown;
  try { raw = await req.json(); } catch { return json({ success: false, error: 'Invalid request' }, 400); }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json({ success: false, error: 'Please enter your first name and a valid email.' }, 400);
  const { firstName, email, campaign, website } = parsed.data;

  // Honeypot filled → pretend success, store nothing.
  if (website) return json({ success: true });

  const key = Deno.env.get('VVV_PARTNER_KEY');
  if (!key) { console.error('VVV_PARTNER_KEY missing'); return json({ success: false, error: 'Sign-up unavailable' }, 503); }

  try {
    const res = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-vvv-partner-key': key },
      body: JSON.stringify({
        email: email.toLowerCase(),
        name: firstName,
        source: 'veni-vidi-vici',
        tags: ['VVV Signup', `VVV ${campaign}`],
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) {
      console.error('upstream rejected', res.status, data?.error);
      return json({ success: false, error: 'Sign-up failed' }, 502);
    }
    return json({ success: true, alreadySubscribed: !!data.alreadySubscribed });
  } catch (err) {
    console.error('upstream error', (err as Error).message);
    return json({ success: false, error: 'Sign-up failed' }, 502);
  }
});
