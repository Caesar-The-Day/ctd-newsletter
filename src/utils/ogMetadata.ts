/**
 * OG metadata automation.
 *
 * Keeps `region_og_metadata` in sync with region content so every region gets a
 * proper social preview (title, description, 1200x630 image) without manual work.
 */

import { supabase } from '@/integrations/supabase/client';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const BRAND = 'Veni. Vidi. Vici.';

type AnyRecord = Record<string, any>;

function titleCase(slug: string) {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function trimToLength(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;

  const slice = clean.slice(0, max);
  const sentenceEnd = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  if (sentenceEnd > 80) return slice.slice(0, sentenceEnd + 1).trim();

  const wordEnd = slice.lastIndexOf(' ');
  return `${slice.slice(0, wordEnd > 0 ? wordEnd : max).trim()}…`;
}

export interface OgCopy {
  title: string;
  description: string;
}

/**
 * Build an OG title + description from a region's own content.
 */
export function buildOgCopy(slug: string, regionData?: AnyRecord | null, displayName?: string): OgCopy {
  const region = (regionData?.region ?? {}) as AnyRecord;
  const name = displayName || titleCase(slug);
  const heading: string = region.title || name;
  const tagline: string = region.tagline || '';

  const title = `${BRAND} | ${heading}`;

  const introParagraph: string =
    region.intro?.paragraphs?.[0] ||
    regionData?.editorialIntro?.paragraphs?.[0] ||
    '';

  const descriptionSource = [tagline, introParagraph].filter(Boolean).join(' ') ||
    `Your editorial guide to retiring in ${name} — towns, costs, healthcare, and what living here actually feels like.`;

  return { title: trimToLength(title, 90), description: trimToLength(descriptionSource, 155) };
}

/**
 * Find the region's hero image URL from its region_data.
 */
export function getHeroImageUrl(regionData?: AnyRecord | null): string | null {
  const hero = regionData?.region?.hero?.bannerImage || regionData?.region?.heroImage || null;
  if (!hero) return null;
  if (/^https?:\/\//i.test(hero)) return hero;
  if (hero.startsWith('/')) return `${window.location.origin}${hero}`;
  return null;
}

/**
 * Load an image source and centre-crop it to a 1200x630 JPEG blob.
 */
export async function renderOgImage(source: string | File | Blob): Promise<Blob> {
  const url = typeof source === 'string' ? source : URL.createObjectURL(source);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Could not load the source image (it may block cross-origin reads).'));
      image.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = OG_WIDTH;
    canvas.height = OG_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available in this browser.');

    // Centre-crop (cover) the source into the 1.91:1 frame.
    const targetRatio = OG_WIDTH / OG_HEIGHT;
    const sourceRatio = img.width / img.height;
    let sx = 0;
    let sy = 0;
    let sw = img.width;
    let sh = img.height;

    if (sourceRatio > targetRatio) {
      sw = img.height * targetRatio;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / targetRatio;
      sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, OG_WIDTH, OG_HEIGHT);

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    if (!blob) throw new Error('Failed to encode the preview image.');
    return blob;
  } finally {
    if (typeof source !== 'string') URL.revokeObjectURL(url);
  }
}

async function shortHash(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest).slice(0, 4))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Upload an already-rendered OG image and return its public URL.
 * The filename carries a content hash so refreshed previews bypass CDN caches.
 */
export async function uploadOgImage(slug: string, blob: Blob): Promise<string> {
  const hash = await shortHash(blob);
  const path = `${slug}-og-${hash}.jpg`;

  const upload = await supabase.storage
    .from('og-images')
    .upload(path, blob, { upsert: true, contentType: 'image/jpeg', cacheControl: '31536000' });

  if (upload.error) {
    const isConflict =
      (upload.error as any)?.statusCode === 409 || /already exists/i.test(upload.error.message);
    if (!isConflict) throw upload.error;

    const update = await supabase.storage
      .from('og-images')
      .update(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
    if (update.error) throw update.error;
  }

  return supabase.storage.from('og-images').getPublicUrl(path).data.publicUrl;
}

export interface EnsureOgOptions {
  /** Re-render the OG image from the hero even when one already exists. */
  refreshImage?: boolean;
  /** Overwrite title/description even when a row already exists. */
  overwriteCopy?: boolean;
  displayName?: string;
}

export interface EnsureOgResult {
  created: boolean;
  imageUpdated: boolean;
  copy: OgCopy;
  imageUrl: string | null;
  warning?: string;
}

/**
 * Create or refresh the OG row for a region. Never overwrites hand-edited copy
 * unless `overwriteCopy` is set. Image failures are reported, not thrown.
 */
export async function ensureRegionOg(
  slug: string,
  regionData?: AnyRecord | null,
  options: EnsureOgOptions = {}
): Promise<EnsureOgResult> {
  const { refreshImage = false, overwriteCopy = false, displayName } = options;

  const { data: existing, error: fetchError } = await supabase
    .from('region_og_metadata')
    .select('id, title, description, image_url')
    .eq('region_slug', slug)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const copy = buildOgCopy(slug, regionData, displayName);
  const finalCopy: OgCopy =
    existing && !overwriteCopy
      ? { title: existing.title || copy.title, description: existing.description || copy.description }
      : copy;

  let imageUrl = existing?.image_url ?? null;
  let imageUpdated = false;
  let warning: string | undefined;

  const needsImage = refreshImage || !imageUrl;
  if (needsImage) {
    const hero = getHeroImageUrl(regionData);
    if (hero) {
      try {
        const blob = await renderOgImage(hero);
        imageUrl = await uploadOgImage(slug, blob);
        imageUpdated = true;
      } catch (error) {
        warning = error instanceof Error ? error.message : 'Could not generate the preview image.';
      }
    } else {
      warning = 'No hero image found for this region yet — preview image not generated.';
    }
  }

  const { error: upsertError } = await supabase
    .from('region_og_metadata')
    .upsert(
      {
        region_slug: slug,
        title: finalCopy.title,
        description: finalCopy.description,
        image_url: imageUrl,
      },
      { onConflict: 'region_slug' }
    );

  if (upsertError) throw upsertError;

  return { created: !existing, imageUpdated, copy: finalCopy, imageUrl, warning };
}

/**
 * Fetch region rows plus their OG rows so the admin UI can flag gaps.
 */
export async function loadRegionsMissingOg(): Promise<
  Array<{ slug: string; displayName: string; hasRow: boolean; hasImage: boolean }>
> {
  const [{ data: regions }, { data: ogRows }] = await Promise.all([
    supabase.from('regions').select('slug, display_name'),
    supabase.from('region_og_metadata').select('region_slug, image_url'),
  ]);

  const ogBySlug = new Map((ogRows || []).map(r => [r.region_slug, r]));

  return (regions || [])
    .map(r => {
      const og = ogBySlug.get(r.slug);
      return {
        slug: r.slug,
        displayName: r.display_name,
        hasRow: Boolean(og),
        hasImage: Boolean(og?.image_url),
      };
    })
    .filter(r => !r.hasRow || !r.hasImage);
}
