/**
 * Source real, freely-licensed town photographs from Wikimedia Commons /
 * Wikipedia, download them locally and record attribution.
 *
 * Usage:
 *   bun scripts/source-town-photos.ts <region-slug> <towns.json>
 *
 * towns.json: [{ "name": "Bolzano (Bozen)", "slug": "bolzano-bozen", "queries": ["Bolzano", "Bozen"] }]
 *
 * Output:
 *   public/images/<region>/<slug>.jpg
 *   public/data/regions/italy/<region>-photo-credits.json
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const UA = 'CaesarTheDayRegionalGuides/1.0 (https://caesartheday.com; editorial newsletter) bun-fetch';

const ALLOWED_LICENCE = /(^cc0)|(public domain)|(^cc[- ]by)|(^cc[- ]by[- ]sa)|(^pd)/i;
const BAD_NAME = /(stemma|coat[_ ]of[_ ]arms|wappen|map|karte|mappa|locator|flag|bandiera|logo|icon|svg|\.ogg|\.webm|\.pdf|panorama[_ ]?sphere|gonfalone|scudo)/i;

type Town = { name: string; slug: string; queries?: string[] };
type Candidate = {
  bonus?: number;
  queries?: string[];
  title: string;
  url: string;
  thumb: string;
  width: number;
  height: number;
  artist: string;
  licence: string;
  licenceUrl: string;
  descriptionUrl: string;
};

async function api(params: Record<string, string>, host = 'it.wikipedia.org') {
  const qs = new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const res = await fetch(`https://${host}/w/api.php?${qs}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${host} API ${res.status}`);
  return res.json() as any;
}

function stripHtml(s: string) {
  return (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function imageInfo(titles: string[], host: string): Promise<Candidate[]> {
  const out: Candidate[] = [];
  for (let i = 0; i < titles.length; i += 25) {
    const batch = titles.slice(i, i + 25);
    const data = await api(
      {
        action: 'query',
        titles: batch.join('|'),
        prop: 'imageinfo',
        iiprop: 'url|size|extmetadata',
        iiurlwidth: '1600',
      },
      host
    );
    for (const page of data?.query?.pages ?? []) {
      const ii = page.imageinfo?.[0];
      if (!ii) continue;
      const meta = ii.extmetadata ?? {};
      out.push({
        title: page.title,
        url: ii.url,
        thumb: ii.thumburl ?? ii.url,
        width: ii.width,
        height: ii.height,
        artist: stripHtml(meta.Artist?.value ?? '') || 'Unknown',
        licence: stripHtml(meta.LicenseShortName?.value ?? meta.License?.value ?? ''),
        licenceUrl: stripHtml(meta.LicenseUrl?.value ?? ''),
        descriptionUrl: ii.descriptionurl,
      });
    }
  }
  return out;
}

async function candidatesFor(town: Town): Promise<Candidate[]> {
  const queries = town.queries?.length ? town.queries : [town.name.replace(/\s*\(.*\)\s*/, '').trim()];
  const seen = new Set<string>();
  const all: Candidate[] = [];

  const push = (cands: Candidate[], bonus: number) => {
    for (const c of cands) {
      if (seen.has(c.title)) continue;
      seen.add(c.title);
      all.push({ ...c, bonus });
    }
  };

  // 1. Lead image of the town's article (most reliable "this is the town" shot)
  for (const host of ['it.wikipedia.org', 'de.wikipedia.org', 'en.wikipedia.org']) {
    for (const q of queries) {
      let title: string | undefined;
      try {
        const search = await api({ action: 'query', list: 'search', srsearch: q, srlimit: '1' }, host);
        title = search?.query?.search?.[0]?.title;
      } catch { /* ignore */ }
      if (!title) continue;
      try {
        const lead = await api({ action: 'query', titles: title, prop: 'pageimages', piprop: 'name' }, host);
        const name = lead?.query?.pages?.[0]?.pageimage;
        if (name && !BAD_NAME.test(name)) {
          push(await imageInfo([`File:${name}`], 'commons.wikimedia.org'), 60);
        }
      } catch { /* ignore */ }
    }
    if (all.length) break;
  }

  // 2. Commons category members for the town — always on-subject
  for (const q of queries) {
    for (const cat of [`Category:${q}`, `Category:Views of ${q}`]) {
      try {
        const data = await api(
          {
            action: 'query',
            list: 'categorymembers',
            cmtitle: cat,
            cmtype: 'file',
            cmlimit: '40',
          },
          'commons.wikimedia.org'
        );
        const files = (data?.query?.categorymembers ?? [])
          .map((m: any) => m.title as string)
          .filter((t: string) => /\.(jpe?g|png|webp)$/i.test(t) && !BAD_NAME.test(t));
        if (files.length) push(await imageInfo(files.slice(0, 30), 'commons.wikimedia.org'), 10);
      } catch { /* ignore */ }
    }
  }

  return all.map((c) => ({ ...c, queries }));
}

const GOOD_NAME = /(panorama|veduta|view|ansicht|aerial|luftbild|skyline|blick|dall|from|centro|altstadt|piazza|cityscape)/i;

function score(c: Candidate & { bonus?: number; queries?: string[] }) {
  const ratio = c.width / c.height;
  if (ratio < 1.25) return -1;
  if (c.width < 1000) return -1;
  if (BAD_NAME.test(c.title)) return -1;
  if (!ALLOWED_LICENCE.test(c.licence) && !/public domain/i.test(c.licence)) return -1;

  // must plausibly be about the town: either the article lead image, or the
  // filename mentions the town.
  const mentionsTown = (c.queries ?? []).some((q) =>
    c.title.toLowerCase().includes(q.split(/[ ,(]/)[0].toLowerCase())
  );
  const bonus = c.bonus ?? 0;
  if (!mentionsTown && bonus < 50) return -1;

  return (
    bonus +
    (mentionsTown ? 8 : 0) +
    (GOOD_NAME.test(c.title) ? 6 : 0) +
    Math.min(c.width, 4000) / 1000 +
    (ratio > 1.4 && ratio < 2.2 ? 2 : 0)
  );
}


async function main() {
  const [regionSlug, townsFile] = process.argv.slice(2);
  if (!regionSlug || !townsFile) {
    console.error('usage: bun scripts/source-town-photos.ts <region-slug> <towns.json>');
    process.exit(1);
  }
  const towns: Town[] = JSON.parse(await readFile(townsFile, 'utf8'));
  const outDir = path.join('public/images', regionSlug);
  await mkdir(outDir, { recursive: true });

  const creditsPath = path.join('public/data/regions/italy', `${regionSlug}-photo-credits.json`);
  let credits: Record<string, any> = {};
  try {
    credits = JSON.parse(await readFile(creditsPath, 'utf8'));
  } catch { /* new file */ }

  const failures: string[] = [];

  for (const town of towns) {
    process.stdout.write(`\n== ${town.name} `);
    let cands: Candidate[] = [];
    try {
      cands = await candidatesFor(town);
    } catch (e) {
      console.log('lookup error', e);
    }
    const best = cands
      .map((c) => ({ c, s: score(c) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)[0]?.c;

    if (!best) {
      console.log('-> NO USABLE IMAGE');
      failures.push(town.name);
      continue;
    }

    const res = await fetch(best.thumb, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log('-> download failed', res.status);
      failures.push(town.name);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const file = path.join(outDir, `${town.slug}.jpg`);
    await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(file);

    credits[town.slug] = {
      town: town.name,
      file: `/images/${regionSlug}/${town.slug}.jpg`,
      author: best.artist,
      licence: best.licence,
      licenceUrl: best.licenceUrl,
      source: best.descriptionUrl,
      sourceFile: best.title,
    };
    console.log(`-> ${best.title} [${best.licence}] by ${best.artist.slice(0, 60)}`);
  }

  await writeFile(creditsPath, JSON.stringify(credits, null, 2) + '\n');
  console.log(`\nCredits written to ${creditsPath}`);
  if (failures.length) console.log('NEEDS MANUAL UPLOAD:', failures.join(', '));
}

main();
