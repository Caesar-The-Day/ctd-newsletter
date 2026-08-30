/**
 * Validate every image/media path referenced by the project.
 *
 * Sources scanned:
 *   - src/**            (tsx/ts/css)
 *   - public/data/**    (static region + index JSON)
 *   - index.html
 *   - Supabase: regions.region_data / climate_data, region_og_metadata.image_url
 *
 * Failure classes:
 *   1. MISSING     - /images/... path with no matching file under public/
 *   2. CDN         - /__l5e/... Lovable CDN path (404s on the custom domain)
 *   3. EXTERNAL    - absolute http(s) image URL on a non-approved host (CORS/hotlink risk)
 *
 * Dynamic fragments (template-literal stubs like `/images/${slug}/`) are reported
 * separately and never fail the run.
 *
 * Usage: bun scripts/validate-images.ts [--no-db]
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

const MEDIA_EXT =
  /\.(jpg|jpeg|png|webp|avif|gif|svg|ico|bmp|mp3|ogg|wav|m4a|mp4|webm)$/i;

/** Hosts we intentionally allow as absolute media URLs. */
const ALLOWED_HOSTS = [
  'caesartheday.com',
  'www.caesartheday.com',
  'italy.caesartheday.com',
  'vistofacile.caesartheday.com',
  'api.maptiler.com',
  'tile.openstreetmap.org',
  'a.tile.openstreetmap.org',
  'b.tile.openstreetmap.org',
  'c.tile.openstreetmap.org',
  'server.arcgisonline.com',
  'unpkg.com',
  'cdnjs.cloudflare.com',
];

/** Supabase storage of this project is fine (public buckets, same infra). */
const ALLOWED_HOST_SUFFIX = ['.supabase.co'];

type Finding = {
  kind: 'MISSING' | 'CDN' | 'EXTERNAL';
  value: string;
  sources: Set<string>;
};

const findings = new Map<string, Finding>();
const dynamic = new Map<string, Set<string>>();
let checked = 0;

function add(kind: Finding['kind'], value: string, source: string) {
  const key = `${kind}:${value}`;
  const existing = findings.get(key);
  if (existing) existing.sources.add(source);
  else findings.set(key, { kind, value, sources: new Set([source]) });
}

function addDynamic(value: string, source: string) {
  const existing = dynamic.get(value);
  if (existing) existing.add(source);
  else dynamic.set(value, new Set([source]));
}

function decode(p: string) {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
}

function checkLocalPath(raw: string, source: string) {
  const clean = decode(raw.split('?')[0].split('#')[0]);
  if (!MEDIA_EXT.test(clean)) {
    addDynamic(raw, source);
    return;
  }
  checked++;
  if (!existsSync(path.join(PUBLIC_DIR, clean))) add('MISSING', clean, source);
}

/** Sources that legitimately hold external URLs that are never rendered as <img>. */
const ATTRIBUTION_SOURCE = /-photo-credits\.json$/;

function checkAbsolute(url: string, source: string) {
  // Attribution manifests record the Commons source page, not a rendered image.
  if (ATTRIBUTION_SOURCE.test(source)) return;
  // Tile-server URL templates are map layers, not images.
  if (url.includes('{')) return;
  // Links to a Commons/Wikipedia description page are references, not images.
  if (/(commons\.wikimedia\.org|\.wikipedia\.org)\/wiki\//.test(url)) return;

  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return;
  }
  if (ALLOWED_HOSTS.includes(host)) return;
  if (ALLOWED_HOST_SUFFIX.some((s) => host.endsWith(s))) return;
  add('EXTERNAL', url, source);
}

const LOCAL_RE = /\/images\/[A-Za-z0-9._/%()'-]*/g;
const CDN_RE = /\/__l5e\/[A-Za-z0-9._/%-]*/g;
const ABS_RE = /https?:\/\/[^\s"'`)\\]+\.(?:jpg|jpeg|png|webp|avif|gif|svg|mp3|mp4|webm)(?:\?[^\s"'`)\\]*)?/gi;

function scanText(text: string, source: string) {
  for (const m of text.matchAll(LOCAL_RE)) checkLocalPath(m[0], source);
  for (const m of text.matchAll(CDN_RE)) add('CDN', m[0], source);
  for (const m of text.matchAll(ABS_RE)) checkAbsolute(m[0], source);
}

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.lovable', 'coverage']);
const SCAN_EXT = /\.(tsx?|jsx?|css|json|html|md)$/i;

async function walk(dir: string, out: string[] = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.env') continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (SCAN_EXT.test(entry.name)) out.push(full);
  }
  return out;
}

async function scanFiles() {
  const files = [
    ...(await walk(path.join(ROOT, 'src'))),
    ...(await walk(path.join(ROOT, 'public', 'data'))),
    ...(existsSync(path.join(ROOT, 'supabase', 'functions'))
      ? await walk(path.join(ROOT, 'supabase', 'functions'))
      : []),
    path.join(ROOT, 'index.html'),
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const text = await readFile(file, 'utf8');
    scanText(text, path.relative(ROOT, file));
  }
}

async function scanDatabase() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY;

  let resolvedUrl = url;
  let resolvedKey = key;
  if (!resolvedUrl || !resolvedKey) {
    // fall back to the committed .env used by vite
    try {
      const env = await readFile(path.join(ROOT, '.env'), 'utf8');
      const get = (name: string) =>
        env.match(new RegExp(`^${name}=(.*)$`, 'm'))?.[1]?.trim();
      resolvedUrl ??= get('VITE_SUPABASE_URL');
      resolvedKey ??= get('VITE_SUPABASE_PUBLISHABLE_KEY');
    } catch {
      /* ignore */
    }
  }
  if (!resolvedUrl || !resolvedKey) {
    console.warn('! Skipping database scan (no Supabase URL/key available)');
    return;
  }

  const fetchTable = async (query: string) => {
    const res = await fetch(`${resolvedUrl}/rest/v1/${query}`, {
      headers: { apikey: resolvedKey!, Authorization: `Bearer ${resolvedKey}` },
    });
    if (!res.ok) throw new Error(`${query} -> ${res.status} ${await res.text()}`);
    return res.json();
  };

  const regions = (await fetchTable(
    'regions?select=slug,region_data,climate_data',
  )) as Array<{ slug: string; region_data: unknown; climate_data: unknown }>;
  for (const r of regions) {
    scanText(JSON.stringify(r.region_data ?? null), `db:regions/${r.slug}`);
    scanText(JSON.stringify(r.climate_data ?? null), `db:regions/${r.slug}(climate)`);
  }

  const og = (await fetchTable(
    'region_og_metadata?select=region_slug,image_url',
  )) as Array<{ region_slug: string; image_url: string | null }>;
  for (const row of og) {
    if (row.image_url) scanText(row.image_url, `db:og/${row.region_slug}`);
  }
}

function report() {
  const byKind = (kind: Finding['kind']) =>
    [...findings.values()]
      .filter((f) => f.kind === kind)
      .sort((a, b) => a.value.localeCompare(b.value));

  const missing = byKind('MISSING');
  const cdn = byKind('CDN');
  const external = byKind('EXTERNAL');

  const section = (title: string, items: Finding[]) => {
    if (!items.length) return;
    console.log(`\n${title} (${items.length})`);
    for (const f of items) {
      console.log(`  ${f.value}`);
      console.log(`      ← ${[...f.sources].sort().join(', ')}`);
    }
  };

  section('MISSING FILES', missing);
  section('LOVABLE CDN PATHS (404 on the custom domain)', cdn);
  section('EXTERNAL IMAGE HOSTS (CORS / hotlink risk)', external);

  if (dynamic.size) {
    console.log(`\nDynamic fragments — not verifiable, review manually (${dynamic.size})`);
    for (const [value, sources] of [...dynamic.entries()].sort()) {
      console.log(`  ${value}  ← ${[...sources].sort().join(', ')}`);
    }
  }

  const failures = missing.length + cdn.length + external.length;
  console.log(
    `\n${checked} concrete media paths checked. ${failures} problem${failures === 1 ? '' : 's'}.`,
  );
  return failures;
}

const noDb = process.argv.includes('--no-db');
await scanFiles();
if (!noDb) {
  try {
    await scanDatabase();
  } catch (err) {
    console.warn(`! Database scan failed, continuing with files only: ${String(err)}`);
  }
}
const failures = report();
process.exit(failures > 0 ? 1 : 0);
