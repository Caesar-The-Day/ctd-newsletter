import { SITE, getLiveRegions, getOgRows, regionName, type OgRow } from './_lib/site';

export const config = { runtime: 'edge' };

export default async function handler(): Promise<Response> {
  try {
    const [live, og] = await Promise.all([getLiveRegions(true), getOgRows().catch(() => [] as OgRow[])]);
    const lines = live.map(r => {
      const reg = (r.region_data as Record<string, any>)?.region || {};
      const desc = (og.find(o => o.region_slug === r.slug)?.description || reg.tagline || '').replace(/\s+/g, ' ').trim();
      return `- [${regionName(r)}](${SITE}/${r.slug}): ${desc}`;
    });
    const body = `# Veni. Vidi. Vici.

> Veni. Vidi. Vici. by CaesarTheDay®: region-by-region guides to retiring in Italy: towns, costs, healthcare, tradeoffs.
> Written by Caesar Sedek for pragmatic retirees planning a move to Italy.

## Regional guides

${lines.join('\n')}

## Related

- [CaesarTheDay](https://www.caesartheday.com): main site, books and consultations
- [Guides](https://www.caesartheday.com/guides): more guides from CaesarTheDay
- [Italy 7% flat tax towns](https://italy7percent.caesartheday.com): explorer for towns eligible for Italy's 7% pensioner tax regime
- [Visto Facile](https://vistofacile.caesartheday.com): Elective Residency Visa (ERV) navigator
`;
    return new Response(body, {
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, s-maxage=600, stale-while-revalidate=3600' },
    });
  } catch {
    return new Response('Temporarily unavailable', { status: 503, headers: { 'retry-after': '60' } });
  }
}
