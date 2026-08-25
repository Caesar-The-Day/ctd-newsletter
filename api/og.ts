export const config = { runtime: 'edge' };

// Public (browser-safe) backend config. VITE_* vars are build-time client vars and
// are not guaranteed to exist in the edge runtime, so fall back to the publishable
// values that already ship in the client bundle.
const FALLBACK_SUPABASE_URL = 'https://jolbywwrnehhwodlgytt.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbGJ5d3dybmVoaHdvZGxneXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDczNTIsImV4cCI6MjA4MTU4MzM1Mn0.3UUV5PbolRzbZmo1_oCe9TgctYF1esT2xvA_izLR4SQ';

const env = (typeof process !== 'undefined' && process.env) || ({} as Record<string, string | undefined>);

const SUPABASE_URL =
  env.VITE_SUPABASE_URL || env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_ANON_KEY ||
  FALLBACK_SUPABASE_ANON_KEY;

interface RegionOG {
  title: string;
  description: string;
  image_url: string | null;
}

const DEFAULT_OG: RegionOG = {
  title: 'Veni. Vidi. Vici. | Caesar the Day',
  description: 'Your editorial guide to retiring in Italy — region by region, town by town.',
  image_url: 'https://italy.caesartheday.com/og-veni-vidi-vici-2.jpg',
};

interface FetchResult {
  og: RegionOG;
  found: boolean;
  error: string | null;
  status: number | null;
}

async function fetchOGMetadata(regionSlug: string): Promise<FetchResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { og: DEFAULT_OG, found: false, error: 'missing backend configuration', status: null };
  }
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/region_og_metadata?region_slug=eq.${encodeURIComponent(regionSlug)}&select=title,description,image_url`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return { og: DEFAULT_OG, found: false, error: 'request failed', status: response.status };
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return {
        og: {
          title: data[0].title || DEFAULT_OG.title,
          description: data[0].description || DEFAULT_OG.description,
          image_url: data[0].image_url || DEFAULT_OG.image_url,
        },
        found: true,
        error: null,
        status: response.status,
      };
    }
    return { og: DEFAULT_OG, found: false, error: 'no row for slug', status: response.status };
  } catch (error) {
    return {
      og: DEFAULT_OG,
      found: false,
      error: error instanceof Error ? error.message : 'unknown error',
      status: null,
    };
  }
}

function generateHTML(og: RegionOG, canonicalUrl: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const imageUrl = og.image_url || DEFAULT_OG.image_url || '';
  const imageType = imageUrl.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

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
  <meta property="og:image" content="${esc(imageUrl)}" />
  <meta property="og:image:secure_url" content="${esc(imageUrl)}" />
  <meta property="og:image:type" content="${imageType}" />
  <meta property="og:image:alt" content="${esc(og.title)}" />
  <meta property="og:site_name" content="Caesar the Day" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(og.title)}" />
  <meta name="twitter:description" content="${esc(og.description)}" />
  <meta name="twitter:image" content="${esc(imageUrl)}" />
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
  const debug = url.searchParams.get('debug') === '1';

  const regionMatch = path.match(/^\/([a-z-]+)$/i);
  const region = regionMatch ? regionMatch[1].toLowerCase() : null;

  const result: FetchResult = region
    ? await fetchOGMetadata(region)
    : { og: DEFAULT_OG, found: false, error: null, status: null };

  if (debug) {
    return new Response(
      JSON.stringify(
        {
          path,
          region,
          configResolved: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
          usingFallbackConfig: !env.VITE_SUPABASE_URL && !env.SUPABASE_URL,
          rowFound: result.found,
          upstreamStatus: result.status,
          error: result.error,
          og: result.og,
        },
        null,
        2
      ),
      { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } }
    );
  }

  const canonical = `https://italy.caesartheday.com${path}`;
  const html = generateHTML(result.og, canonical);

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}
