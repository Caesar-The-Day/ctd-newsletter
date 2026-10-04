const TRACKED_HOSTS = ['caesartheday.com', 'www.caesartheday.com', 'vistofacile.caesartheday.com', 'italy7percent.caesartheday.com'];

/** Adds Veni. Vidi. Vici. referral tags to links pointing at CaesarTheDay properties. Other links pass through untouched. */
export function withUtm(url: string, campaign?: string | null): string {
  try {
    const u = new URL(url);
    if (!TRACKED_HOSTS.includes(u.hostname)) return url;
    u.searchParams.set('utm_source', 'veni-vidi-vici');
    u.searchParams.set('utm_medium', 'referral');
    u.searchParams.set('utm_campaign', campaign || 'home');
    return u.toString();
  } catch {
    return url;
  }
}
