// Shared helpers for crawler-facing endpoints (render, sitemap, llms.txt).
// Files under api/_lib are not exposed as routes by Vercel.

const FALLBACK_SUPABASE_URL = 'https://jolbywwrnehhwodlgytt.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbGJ5d3dybmVoaHdvZGxneXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDczNTIsImV4cCI6MjA4MTU4MzM1Mn0.3UUV5PbolRzbZmo1_oCe9TgctYF1esT2xvA_izLR4SQ';

const env = (typeof process !== 'undefined' && process.env) || ({} as Record<string, string | undefined>);
const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL || FALLBACK_SUPABASE_URL;
const SUPABASE_KEY =
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

export const SITE = 'https://www.caesartheday.com/regions';
export const SITE_NAME = 'CaesarTheDay';
export const DEFAULT_TITLE = 'Veni. Vidi. Vici. | Your Guide to Conquering Retirement in Italy';
export const DEFAULT_DESCRIPTION =
  'Region-by-region guides to retiring in Italy: towns worth living in, real monthly costs, healthcare access and honest tradeoffs.';
export const DEFAULT_IMAGE = `${SITE}/og-veni-vidi-vici-sep2026.jpg`;
export const LOGO = `${SITE}/images/shared/caesartheday-logo.png`;
export const SEVEN_PERCENT_REGIONS = ['puglia', 'calabria', 'molise'];

type AnyRecord = Record<string, any>;

export interface RegionRow {
  slug: string;
  display_name: string;
  status: string;
  issue_number: number | null;
  published_date: string | null;
  updated_at: string;
  region_data?: AnyRecord | null;
}

export interface OgRow {
  region_slug: string;
  title: string;
  description: string;
  image_url: string | null;
}

async function rest<T>(query: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`backend ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getLiveRegions(withData = false): Promise<RegionRow[]> {
  const cols = 'slug,display_name,status,issue_number,published_date,updated_at' + (withData ? ',region_data' : '');
  return rest<RegionRow[]>(`regions?status=eq.live&select=${cols}&order=issue_number.desc.nullslast`);
}

export async function getRegion(slug: string): Promise<RegionRow | null> {
  const rows = await rest<RegionRow[]>(
    `regions?slug=eq.${encodeURIComponent(slug)}&select=slug,display_name,status,issue_number,published_date,updated_at,region_data`
  );
  return rows[0] ?? null;
}

export async function getOgRows(): Promise<OgRow[]> {
  return rest<OgRow[]>('region_og_metadata?select=region_slug,title,description,image_url');
}

export const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const absUrl = (u: string | null | undefined) => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  return `${SITE}${u.startsWith('/') ? '' : '/'}${u}`;
};

export const isoDate = (d: string | null | undefined) => (d ? new Date(d).toISOString().slice(0, 10) : '');

/** Strip the editorial "Region: subtitle" pattern down to a clean name. */
export const regionName = (r: RegionRow) => r.display_name || r.slug;

const isEmptyData = (d: AnyRecord | null | undefined) => !d || (!d.region && !d.towns);

/** Older regions keep their content in static files instead of the database. */
export async function loadStaticRegion(slug: string): Promise<AnyRecord | null> {
  for (const path of [`/data/regions/italy/${slug}.json`, `/data/${slug}.json`]) {
    try {
      const res = await fetch(`${SITE}${path}`);
      if (!res.ok) continue;
      if (!(res.headers.get('content-type') || '').includes('json')) continue;
      const data = await res.json();
      if (data && typeof data === 'object' && !isEmptyData(data)) return data;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function withRegionData<T extends { slug: string; region_data?: AnyRecord | null }>(row: T): Promise<T> {
  if (!isEmptyData(row.region_data)) return row;
  const data = await loadStaticRegion(row.slug);
  return data ? { ...row, region_data: data } : row;
}
