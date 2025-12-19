export const config = { runtime: 'edge' };

// Supabase connection for fetching OG metadata
const SUPABASE_URL = 'https://jolbywwrnehhwodlgytt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbGJ5d3dybmVoaHdvZGxneXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDczNTIsImV4cCI6MjA4MTU4MzM1Mn0.3UUV5PbolRzbZmo1_oCe9TgctYF1esT2xvA_izLR4SQ';

interface RegionOG {
  title: string;
  description: string;
  image_url: string | null;
}

const DEFAULT_OG: RegionOG = {
  title: 'Veni. Vidi. Vici. | Caesar the Day',
  description: 'Your editorial guide to retiring in Italy — region by region, town by town.',
  image_url: 'https://news.caesartheday.com/og-veni-vidi-vici-2.jpg',
};

async function fetchOGMetadata(regionSlug: string): Promise<RegionOG> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/region_og_metadata?region_slug=eq.${encodeURIComponent(regionSlug)}&select=title,description,image_url`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch OG metadata:', response.status);
      return DEFAULT_OG;
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        title: data[0].title,
        description: data[0].description,
        image_url: data[0].image_url,
      };
    }
  } catch (error) {
    console.error('Error fetching OG metadata:', error);
  }

  return DEFAULT_OG;
}

function generateHTML(og: RegionOG, canonicalUrl: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const imageUrl = og.image_url || DEFAULT_OG.image_url;

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
  <meta property="og:image" content="${esc(imageUrl || '')}" />
  <meta property="og:site_name" content="Caesar the Day" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(og.title)}" />
  <meta name="twitter:description" content="${esc(og.description)}" />
  <meta name="twitter:image" content="${esc(imageUrl || '')}" />
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

  // Fetch from database (or use default for homepage)
  const og = region ? await fetchOGMetadata(region) : DEFAULT_OG;

  const canonical = `https://news.caesartheday.com${path}`;
  const html = generateHTML(og, canonical);

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}
