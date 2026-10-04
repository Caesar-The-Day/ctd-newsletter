import { SITE, getLiveRegions, isoDate } from './_lib/site';

export const config = { runtime: 'edge' };

export default async function handler(): Promise<Response> {
  try {
    const live = await getLiveRegions();
    const newest = live.reduce((m, r) => (r.updated_at > m ? r.updated_at : m), '');
    const urls = [
      `  <url><loc>${SITE}/</loc>${newest ? `<lastmod>${isoDate(newest)}</lastmod>` : ''}<changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      ...live.map(
        r => `  <url><loc>${SITE}/${r.slug}</loc><lastmod>${isoDate(r.updated_at)}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>`
      ),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
    return new Response(xml, {
      headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, s-maxage=600, stale-while-revalidate=3600' },
    });
  } catch {
    return new Response('Temporarily unavailable', { status: 503, headers: { 'retry-after': '60' } });
  }
}
