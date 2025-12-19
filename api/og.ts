export const config = { runtime: 'edge' };

const BOT_PATTERNS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Pinterest',
  'Discordbot',
];

const REGION_OG_DATA: Record<string, { title: string; description: string; image: string }> = {
  piemonte: {
    title: 'Retiring in Piemonte | Veni. Vidi. Vici. Region Guide',
    description:
      "Explore Piemonte like a local — from walkable towns and cost-of-living insights to healthcare, wine culture, and interactive planning tools. A smart retiree's guide to Northern Italy.",
    image: 'https://news.caesartheday.com/images/piemonte-og.jpg',
  },
  lombardia: {
    title: 'Retiring in Lombardia | Veni. Vidi. Vici. Region Guide',
    description:
      'Northern sophistication with mountain soul. Your guide to retiring in Lombardia — lakes, culture, cost of living, and the best towns to call home.',
    image: 'https://news.caesartheday.com/images/lombardia-og.jpg',
  },
  puglia: {
    title: 'Retiring in Puglia | Veni. Vidi. Vici. Region Guide',
    description:
      'Sun-drenched coasts, ancient towns, and la dolce vita. Your complete guide to retiring in Puglia — from trulli to trattorias.',
    image: 'https://news.caesartheday.com/images/puglia-og.jpg',
  },
};

const DEFAULT_OG = {
  title: 'Veni. Vidi. Vici. | Caesar the Day',
  description: 'Your editorial guide to retiring in Italy — region by region, town by town.',
  image: 'https://news.caesartheday.com/og-veni-vidi-vici-2.jpg',
};

function generateHTML(og: { title: string; description: string; image: string }, canonicalUrl: string): string {
  // Basic escaping for attributes
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(og.title)}</title>
  <meta name="description" content="${esc(og.description)}" />
  <link rel="canonical" href="${esc(canonicalUrl)}" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(og.title)}" />
  <meta property="og:description" content="${esc(og.description)}" />
  <meta property="og:url" content="${esc(canonicalUrl)}" />
  <meta property="og:image" content="${esc(og.image)}" />
  <meta property="og:site_name" content="Caesar the Day" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(og.title)}" />
  <meta name="twitter:description" content="${esc(og.description)}" />
  <meta name="twitter:image" content="${esc(og.image)}" />
</head>
<body>
  <h1>${esc(og.title)}</h1>
  <p>${esc(og.description)}</p>
</body>
</html>`;
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.searchParams.get('path') || '/';

  const regionMatch = path.match(/^\/([a-z-]+)$/i);
  const region = regionMatch ? regionMatch[1].toLowerCase() : null;

  const og = (region && REGION_OG_DATA[region]) ? REGION_OG_DATA[region] : DEFAULT_OG;

  // Canonical uses the current host (important for previews / custom domains)
  const canonical = `${url.origin}${path}`;

  const html = generateHTML(og, canonical);

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Cache for bots; allow quick refresh from debuggers by re-scraping
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(p => ua.includes(p.toLowerCase()));
}
