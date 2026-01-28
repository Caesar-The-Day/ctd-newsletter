
# SEO, Analytics & Crawler Configuration Audit

## Domain: news.caesartheday.com

---

## Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| robots.txt | Present | Basic, needs sitemap reference |
| SEO Component | Present | React Helmet-based, per-page |
| Google Analytics (GA4) | Present | G-6NPM83DF0C via cookie consent |
| Open Graph Tags | Present | Dynamic via Vercel Edge Function |
| Twitter Cards | Present | summary_large_image |
| Structured Data | Present | JSON-LD for Article/CollectionPage |
| Sitemap | Missing | No sitemap.xml exists |
| Canonical URLs | Present | Per-page via SEO component |
| Facebook Domain Verification | Present | In index.html |
| Cross-Domain Linking | Present | GA4 linker configured |

---

## Issues Found & Fixes

### 1. Missing Sitemap.xml

**Problem**: No sitemap.xml exists, limiting search engine crawl efficiency.

**Fix**: Create `public/sitemap.xml` with all live pages:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://news.caesartheday.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://news.caesartheday.com/piemonte</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://news.caesartheday.com/lombardia</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://news.caesartheday.com/puglia</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://news.caesartheday.com/umbria</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

---

### 2. robots.txt Needs Sitemap Reference

**Problem**: robots.txt doesn't reference the sitemap for crawlers.

**Fix**: Update `public/robots.txt` to include:

```text
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: https://news.caesartheday.com/sitemap.xml
```

---

### 3. Vercel Routing Needs Sitemap Passthrough

**Problem**: Current Vercel config catches all routes and sends to SPA, which would block sitemap.xml access.

**Fix**: Update `vercel.json` to explicitly pass through sitemap.xml:

```json
{
  "routes": [
    {
      "src": "^/(piemonte|lombardia|puglia|umbria)(?:/)?$",
      "has": [{ "type": "header", "key": "user-agent", "value": "..." }],
      "dest": "/api/og?path=/$1"
    },
    {
      "src": "^/$",
      "has": [{ "type": "header", "key": "user-agent", "value": "..." }],
      "dest": "/api/og?path=/"
    },
    {
      "src": "^/sitemap\\.xml$",
      "dest": "/sitemap.xml"
    },
    {
      "src": "/((?!newsletters/|data/|images/|assets/|sitemap\\.xml|.*\\.).*)",
      "dest": "/index.html"
    }
  ]
}
```

---

### 4. Missing og:site_name in Client-Side SEO

**Problem**: The `SEO.tsx` component doesn't include `og:site_name`.

**Fix**: Add to `src/components/common/SEO.tsx`:

```tsx
<meta property="og:site_name" content="Caesar the Day" />
```

---

### 5. Missing Twitter Site Handle

**Problem**: No Twitter @username configured for attribution.

**Fix**: Add to SEO component and index.html:

```html
<meta name="twitter:site" content="@caesartheday" />
```

(Replace with actual Twitter handle if different)

---

### 6. Homepage SEO Component Enhancement

**Problem**: Homepage (`NewsletterIndex.tsx`) uses the SEO component correctly, but could benefit from additional meta tags.

**Already Good**:
- Title, description, canonical, OG tags, Twitter cards, structured data, keywords

---

### 7. Lombardia Region Tracking Update

**Problem**: The CookieConsent tracking regex for `region_view` events doesn't include `lombardia`.

**Current**:
```js
const regionMatch = path.match(/^\/(puglia|piemonte|liguria|tuscany|abruzzo|umbria|sicily)/i);
```

**Fix**: Add lombardia:
```js
const regionMatch = path.match(/^\/(puglia|piemonte|lombardia|liguria|tuscany|abruzzo|umbria|sicily)/i);
```

---

## Implementation Summary

| File | Change |
|------|--------|
| `public/sitemap.xml` | Create new file with all live region URLs |
| `public/robots.txt` | Add Sitemap directive |
| `vercel.json` | Add sitemap passthrough route |
| `src/components/common/SEO.tsx` | Add og:site_name and twitter:site |
| `index.html` | Add twitter:site meta tag |
| `src/components/common/CookieConsent.tsx` | Add lombardia to tracking regex |

---

## What's Already Working Well

1. **Google Analytics (GA4)**: Properly implemented with cookie consent, cross-domain tracking, scroll depth, and custom events
2. **Dynamic OG for Social Bots**: Vercel Edge Function correctly serves bot-specific HTML
3. **Per-Region SEO**: Each region has tailored title, description, keywords, and OG images
4. **Structured Data**: JSON-LD Article schema on region pages, CollectionPage on homepage
5. **Canonical URLs**: Properly set for each page
6. **Facebook Domain Verification**: Present in index.html

---

## Technical Details

### Google Analytics Configuration
- **Measurement ID**: G-6NPM83DF0C
- **Cross-Domain Linking**: caesartheday.com, news.caesartheday.com, italy7percent.com
- **Events Tracked**:
  - `region_view` - When visiting a region page
  - `map_region_click` - Clicking regions on interactive map
  - `escape_map_click` - 7% escape map interactions
  - `blueprint_cta_click` - Retirement blueprint CTA clicks
  - `scroll_depth` - 25%, 50%, 75%, 100% scroll milestones
  - Custom events via `data-analytics-event` attribute

### Vercel Edge Function (api/og.ts)
- Detects social media bots (Facebook, Twitter, LinkedIn, WhatsApp, etc.)
- Fetches region-specific OG metadata from Supabase `region_og_metadata` table
- Returns minimal HTML with correct meta tags for accurate social previews
- Caches responses for 5 minutes (s-maxage=300)
