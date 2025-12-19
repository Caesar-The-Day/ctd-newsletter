import { NextRequest, NextResponse } from 'next/server';

// Social media bot User-Agent patterns
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

// Region-specific OG metadata
const REGION_OG_DATA: Record<string, {
  title: string;
  description: string;
  image: string;
}> = {
  piemonte: {
    title: 'Retiring in Piemonte | Veni. Vidi. Vici. Region Guide',
    description: 'Explore Piemonte like a local — from walkable towns and cost-of-living insights to healthcare, wine culture, and interactive planning tools. A smart retiree\'s guide to Northern Italy.',
    image: 'https://news.caesartheday.com/images/piemonte-og.jpg',
  },
  lombardia: {
    title: 'Retiring in Lombardia | Veni. Vidi. Vici. Region Guide',
    description: 'Northern sophistication with mountain soul. Your guide to retiring in Lombardia — lakes, culture, cost of living, and the best towns to call home.',
    image: 'https://news.caesartheday.com/images/lombardia-og.jpg',
  },
  puglia: {
    title: 'Retiring in Puglia | Veni. Vidi. Vici. Region Guide',
    description: 'Sun-drenched coasts, ancient towns, and la dolce vita. Your complete guide to retiring in Puglia — from trulli to trattorias.',
    image: 'https://news.caesartheday.com/images/puglia-og.jpg',
  },
};

const DEFAULT_OG = {
  title: 'Veni. Vidi. Vici. | Caesar the Day',
  description: 'Your editorial guide to retiring in Italy — region by region, town by town.',
  image: 'https://news.caesartheday.com/og-veni-vidi-vici.jpg',
};

function isBot(userAgent: string): boolean {
  return BOT_PATTERNS.some(pattern => 
    userAgent.toLowerCase().includes(pattern.toLowerCase())
  );
}

function generateBotHTML(og: { title: string; description: string; image: string }, url: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${og.title}</title>
  <meta name="description" content="${og.description}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${og.title}">
  <meta property="og:description" content="${og.description}">
  <meta property="og:image" content="${og.image}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Caesar the Day">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${og.title}">
  <meta name="twitter:description" content="${og.description}">
  <meta name="twitter:image" content="${og.image}">
  
  <link rel="canonical" href="${url}">
</head>
<body>
  <h1>${og.title}</h1>
  <p>${og.description}</p>
</body>
</html>`;
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const pathname = request.nextUrl.pathname;
  
  // Only intercept for bots
  if (!isBot(userAgent)) {
    return NextResponse.next();
  }
  
  // Extract region from path (e.g., /lombardia -> lombardia)
  const regionMatch = pathname.match(/^\/([a-z-]+)$/i);
  const region = regionMatch ? regionMatch[1].toLowerCase() : null;
  
  // Get OG data for this region or use default
  const ogData = region && REGION_OG_DATA[region] ? REGION_OG_DATA[region] : DEFAULT_OG;
  const fullUrl = `https://news.caesartheday.com${pathname}`;
  
  // Return pre-rendered HTML for bots
  return new NextResponse(generateBotHTML(ogData, fullUrl), {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export const config = {
  matcher: ['/', '/:region(piemonte|lombardia|puglia|abruzzo|basilicata|liguria|sardegna|sicilia|umbria|le-marche)'],
};
