// Server-rendered HTML for search engines, AI tools and social preview bots.
// Normal visitors and Googlebot never reach this (see vercel.json); they get the React app.
import newsletterIndex from '../public/data/newsletter-index.json';
import {
  SITE, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_IMAGE, LOGO, SEVEN_PERCENT_REGIONS,
  getLiveRegions, getRegion, getOgRows, esc, absUrl, isoDate, regionName,
  type RegionRow, type OgRow,
} from './_lib/site';

export const config = { runtime: 'edge' };

type AnyRecord = Record<string, any>;

interface Head {
  title: string;
  description: string;
  canonical: string;
  image: string;
  type: 'website' | 'article';
  robots: string;
  jsonLd?: object[];
}

function headHtml(h: Head) {
  const img = h.image || DEFAULT_IMAGE;
  const imgType = img.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  return `<meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(h.title)}</title>
  <meta name="description" content="${esc(h.description)}" />
  <meta name="robots" content="${esc(h.robots)}" />
  <link rel="canonical" href="${esc(h.canonical)}" />
  <meta property="og:type" content="${h.type}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${esc(h.title)}" />
  <meta property="og:description" content="${esc(h.description)}" />
  <meta property="og:url" content="${esc(h.canonical)}" />
  <meta property="og:image" content="${esc(img)}" />
  <meta property="og:image:secure_url" content="${esc(img)}" />
  <meta property="og:image:type" content="${imgType}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(h.title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@caesartheday" />
  <meta name="twitter:title" content="${esc(h.title)}" />
  <meta name="twitter:description" content="${esc(h.description)}" />
  <meta name="twitter:image" content="${esc(img)}" />
  ${(h.jsonLd || []).map(j => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n  ')}`;
}

function page(h: Head, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${headHtml(h)}
</head>
<body>
${body}
</body>
</html>`;
}

const publisher = {
  '@type': 'Organization',
  name: 'CaesarTheDay®',
  url: 'https://www.caesartheday.com',
  logo: { '@type': 'ImageObject', url: LOGO },
};
const author = { '@type': 'Person', name: 'Caesar Sedek', url: 'https://www.caesartheday.com' };

const text = (v: unknown) => (typeof v === 'string' ? v : '');
const list = (v: unknown): any[] => (Array.isArray(v) ? v : []);
const sevenBadge = (t: AnyRecord) =>
  t?.eligible7Percent === true ? ' <strong>(eligible for the 7% flat tax)</strong>' : '';
const money = (n: number) => `€${Math.round(n).toLocaleString('en-US')}`;
const total = (o: AnyRecord | undefined) =>
  o ? Object.values(o).reduce((s: number, v) => s + (typeof v === 'number' ? v : 0), 0) : 0;

function otherRegionsNav(all: RegionRow[], current?: string) {
  const items = all
    .filter(r => r.slug !== current)
    .map(r => `<li><a href="${SITE}/${r.slug}">${esc(regionName(r))}</a></li>`)
    .join('');
  return `<nav aria-label="Other regional guides"><h2>More regional guides</h2><ul>${items}</ul></nav>`;
}

function ctaLinks(slug: string) {
  const links = [
    ['Visto Facile — Elective Residency Visa navigator', 'https://vistofacile.caesartheday.com'],
    ['Book a consultation', 'https://www.caesartheday.com/services'],
    ['Escape Plan to Italy — the book', 'https://www.caesartheday.com/books'],
  ];
  if (SEVEN_PERCENT_REGIONS.includes(slug)) links.push(['7% flat-tax towns explorer', 'https://italy7percent.caesartheday.com']);
  return `<section><h2>Plan your move</h2><ul>${links
    .map(([l, u]) => `<li><a href="${u}">${esc(l)}</a></li>`)
    .join('')}</ul></section>`;
}

function regionBody(r: RegionRow, d: AnyRecord, all: RegionRow[]) {
  const reg = d.region || {};
  const parts: string[] = [];
  parts.push(`<header><p><a href="${SITE}/">Veni. Vidi. Vici.</a> › ${esc(regionName(r))}</p>
<h1>${esc(reg.title || regionName(r))}</h1>
${reg.tagline ? `<p>${esc(reg.tagline)}</p>` : ''}
<p>Issue ${esc(r.issue_number ?? reg.issueNumber ?? '')} · Published <time datetime="${isoDate(r.published_date)}">${esc(isoDate(r.published_date))}</time> · Last updated <time datetime="${isoDate(r.updated_at)}">${esc(isoDate(r.updated_at))}</time> · By Caesar Sedek</p></header>`);

  const intro = reg.intro || d.editorialIntro || {};
  if (list(intro.paragraphs).length) {
    parts.push(`<section><h2>${esc(intro.headline || 'Introduction')}</h2>${list(intro.paragraphs)
      .map(p => `<p>${esc(p)}</p>`).join('')}</section>`);
  }

  const tabs = list(d.where?.tabs);
  if (tabs.length) {
    parts.push(`<section><h2>Where is ${esc(regionName(r))}?</h2>${tabs
      .map(t => `<h3>${esc(t.title)}</h3><p>${esc(t.content)}</p>`).join('')}</section>`);
  }

  const featured = list(d.towns?.featured);
  if (featured.length) {
    parts.push(`<section><h2>Featured towns</h2>${featured
      .map(t => `<article><h3>${esc(t.name)}${sevenBadge(t)}</h3>${t.bestFor ? `<p>Best for: ${esc(t.bestFor)}</p>` : ''}<p>${esc(t.summary || t.description || '')}</p>${t.fullDescription ? `<p>${esc(t.fullDescription)}</p>` : ''}</article>`)
      .join('')}</section>`);
  }

  const grid = list(d.towns?.grid);
  if (grid.length) {
    parts.push(`<section><h2>More towns to consider</h2><ul>${grid
      .map(t => `<li><strong>${esc(t.name)}</strong>${sevenBadge(t)}${t.bestFor ? ` — Best for: ${esc(t.bestFor)}` : ''}. ${esc(t.blurb || t.description || '')}</li>`)
      .join('')}</ul></section>`);
  }

  const col = d.costOfLiving || {};
  const presets = list(col.townPresets);
  if (presets.length) {
    const rows = presets
      .map(p => `<tr><th scope="row">${esc(p.label || p.name)}</th><td>${money(total(p.modest))}</td><td>${money(total(p.normal || p.average))}</td><td>${money(total(p.highEnd))}</td></tr>`)
      .join('');
    const notes = col.notes || {};
    const sources = list(notes.sources)
      .map(s => typeof s === 'string' ? `<li>${esc(s)}</li>` : `<li>${s.url ? `<a href="${esc(s.url)}">${esc(s.name || s.title || s.url)}</a>` : esc(s.name || s.title || '')}</li>`)
      .join('');
    parts.push(`<section><h2>Cost of living</h2>${col.intro?.lead ? `<p>${esc(col.intro.lead)}</p>` : ''}
<table><caption>Estimated monthly budget for a retired couple (EUR)</caption><thead><tr><th scope="col">Town</th><th scope="col">Modest</th><th scope="col">Average</th><th scope="col">High-End</th></tr></thead><tbody>${rows}</tbody></table>
${text(notes.reference) ? `<p>${esc(notes.reference)}</p>` : ''}${list(col.notes?.items).map(n => `<p>${esc(n)}</p>`).join('')}
${sources ? `<h3>Sources</h3><ul>${sources}</ul>` : ''}</section>`);
  }

  const hospitals = list(d.healthcare?.hospitals);
  if (hospitals.length) {
    parts.push(`<section><h2>Hospitals</h2>${d.healthcare?.intro?.lead ? `<p>${esc(d.healthcare.intro.lead)}</p>` : ''}<ul>${hospitals
      .map(h => `<li><strong>${esc(h.name)}</strong>${h.location ? ` (${esc(h.location)})` : ''}${h.description ? ` — ${esc(h.description)}` : ''}</li>`)
      .join('')}</ul></section>`);
  }

  const pc = d.prosCons || {};
  const pcList = (items: any[]) => items
    .map(i => typeof i === 'string' ? `<li>${esc(i)}</li>` : `<li><strong>${esc(i.title)}</strong>${list(i.points).length ? `<ul>${list(i.points).map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : i.description ? ` — ${esc(i.description)}` : ''}</li>`)
    .join('');
  if (list(pc.pros).length || list(pc.cons).length) {
    parts.push(`<section><h2>${esc(pc.intro?.headline || 'Pros and cons')}</h2>
<h3>Pros</h3><ul>${pcList(list(pc.pros))}</ul>
<h3>Cons</h3><ul>${pcList(list(pc.cons))}</ul>
${pc.finalTake ? `<h3>${esc(pc.finalTake.headline || 'Verdict')}</h3><p>${esc(pc.finalTake.text || '')}</p>${pc.finalTake.conclusion ? `<p>${esc(pc.finalTake.conclusion)}</p>` : ''}` : ''}</section>`);
  }

  parts.push(ctaLinks(r.slug));
  parts.push(otherRegionsNav(all, r.slug));
  return `<main><article>${parts.join('\n')}</article></main>`;
}

async function renderRegion(slug: string): Promise<Response> {
  const [region, live, ogRows] = await Promise.all([getRegion(slug), getLiveRegions(), getOgRows().catch(() => [] as OgRow[])]);
  if (!region || region.status !== 'live') return notFound(`/${slug}`);

  const d = (region.region_data || {}) as AnyRecord;
  const reg = d.region || {};
  const og = ogRows.find(o => o.region_slug === slug);
  const name = regionName(region);
  const canonical = `${SITE}/${slug}`;
  const title = og?.title || `${reg.title || name} | Veni. Vidi. Vici.`;
  const description = og?.description || reg.tagline || DEFAULT_DESCRIPTION;
  const image = absUrl(og?.image_url) || absUrl(reg.hero?.bannerImage) || DEFAULT_IMAGE;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: reg.title || name,
      description,
      image,
      datePublished: isoDate(region.published_date) || undefined,
      dateModified: region.updated_at,
      author,
      publisher,
      inLanguage: 'en',
      url: canonical,
      mainEntityOfPage: canonical,
      about: {
        '@type': 'AdministrativeArea',
        name,
        containedInPlace: { '@type': 'Country', name: 'Italy' },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name, item: canonical },
      ],
    },
  ];

  const html = page(
    { title, description, canonical, image, type: 'article', robots: 'index,follow', jsonLd },
    regionBody(region, d, live)
  );
  return htmlResponse(html, 200);
}

async function renderHome(): Promise<Response> {
  const [live, ogRows] = await Promise.all([getLiveRegions(true), getOgRows().catch(() => [] as OgRow[])]);
  const idx = newsletterIndex as AnyRecord;
  const staticBySlug = new Map<string, AnyRecord>(list(idx.newsletters).map((n: AnyRecord) => [n.slug, n]));

  const items = live.map(r => {
    const s = staticBySlug.get(r.slug) || {};
    const og = ogRows.find(o => o.region_slug === r.slug);
    const reg = (r.region_data as AnyRecord)?.region || {};
    return {
      slug: r.slug,
      title: s.subtitle ? `${regionName(r)}: ${s.subtitle}` : reg.title || regionName(r),
      issue: r.issue_number ?? s.issueNumber ?? reg.issueNumber ?? '',
      date: s.date || reg.date || isoDate(r.published_date),
      description: s.description || og?.description || reg.tagline || '',
    };
  });

  const hero = idx.hero || {};
  const archive = list(idx.archive);
  const body = `<main>
<header><h1>${esc(hero.headline || 'Veni. Vidi. Vici.')}</h1><p>${esc(hero.tagline || '')}</p>
<p>Region-by-region guides to retiring in Italy by Caesar Sedek: towns, costs, healthcare and honest tradeoffs.</p></header>
<section><h2>Regional guides</h2>${items
    .map(i => `<article><h3><a href="${SITE}/${i.slug}">${esc(i.title)}</a></h3><p>Issue ${esc(i.issue)} · ${esc(i.date)}</p><p>${esc(i.description)}</p></article>`)
    .join('\n')}</section>
${archive.length ? `<section><h2>PDF archive</h2><ul>${archive
    .map((a: AnyRecord) => `<li><a href="${esc(absUrl(a.downloadUrl))}">${esc(a.title)}</a> — Issue ${esc(a.issueNumber)}, ${esc(a.date)}${a.fileSize ? ` (${esc(a.format || 'PDF')}, ${esc(a.fileSize)})` : ''}. ${esc(a.description || '')}</li>`)
    .join('')}</ul></section>` : ''}
${ctaLinks('')}
</main>`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: `${SITE}/`,
      inLanguage: 'en',
      publisher,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: items.map((i, n) => ({
          '@type': 'ListItem',
          position: n + 1,
          name: i.title,
          url: `${SITE}/${i.slug}`,
        })),
      },
    },
  ];

  return htmlResponse(
    page({ title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, canonical: `${SITE}/`, image: DEFAULT_IMAGE, type: 'website', robots: 'index,follow', jsonLd }, body),
    200
  );
}

function notFound(path: string) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>Page not found | Veni. Vidi. Vici.</title><meta name="robots" content="noindex" /></head><body><h1>Page not found</h1><p>${esc(path)} is not a published guide. <a href="${SITE}/">See all regional guides</a>.</p></body></html>`;
  return htmlResponse(html, 404);
}

function htmlResponse(html: string, status: number) {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': status === 200 ? 'public, s-maxage=300, stale-while-revalidate=3600' : 'no-store',
      ...(status === 404 ? { 'x-robots-tag': 'noindex' } : {}),
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.searchParams.get('path') || url.pathname || '/';
  try {
    if (path === '/' || path === '') return await renderHome();
    const m = path.match(/^\/([a-z][a-z0-9-]*)\/?$/i);
    if (!m) return notFound(path);
    return await renderRegion(m[1].toLowerCase());
  } catch (e) {
    return new Response('Temporarily unavailable', { status: 503, headers: { 'retry-after': '60' } });
  }
}
