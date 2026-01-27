
# Umbria SEO and Social Media Sharing Setup

## Current State Analysis

The project has a well-established SEO and OG (Open Graph) infrastructure:

1. **Frontend SEO Component** (`SEO.tsx`): Uses react-helmet-async to inject meta tags
2. **RegionPage.tsx**: Contains hardcoded SEO configs for piemonte, lombardia, and puglia (lines 197-219) — **Umbria is missing**
3. **Database Override**: `region_og_metadata` table allows dynamic OG data per region
4. **Vercel Edge Function** (`api/og.ts`): Serves minimal HTML to social media crawlers
5. **Vercel Routes** (`vercel.json`): Routes social bots to the Edge Function — **Umbria route is missing**
6. **OG Images**: Stored in Supabase `og-images` bucket — only piemonte and puglia present

## What Needs to be Done

### 1. Create Umbria OG Image

Generate or source a compelling OG image for Umbria (1200×630 pixels recommended for social sharing). Options:
- Use the existing `umbria-hero.jpg` from `/public/images/umbria/`
- Generate a new OG-optimized image featuring Umbria's green hills

The image should be:
- Uploaded to the `og-images` Supabase storage bucket as `umbria-og.jpg`
- OR placed in `/public/images/` as `umbria-og.jpg` with full URL reference

### 2. Add Umbria to Frontend SEO Config

Update `RegionPage.tsx` to include Umbria in the `seoConfig` object:

```typescript
umbria: {
  title: 'Retiring in Umbria | Veni. Vidi. Vici. Region Guide',
  description: 'Discover Umbria — Italy\'s green heart between Rome and Florence. From medieval hill towns and black truffles to Sagrantino wine and affordable living, explore everything you need to retire in central Italy\'s best-kept secret.',
  keywords: [
    'retire in Umbria', 
    'Umbria cost of living', 
    'central Italy retirement', 
    'Perugia living', 
    'Assisi retirement',
    'Rome Florence corridor',
    'Italian regions guide',
    'retiring in Italy',
    'Umbria wine regions'
  ],
  ogImage: 'https://news.caesartheday.com/images/umbria-og.jpg',
  ogDescription: 'Italy\'s green heart — positioned between Rome and Florence. Your guide to retiring in Umbria: medieval towns, truffles, wine, and affordable central Italian living.',
}
```

### 3. Insert Umbria into Database OG Metadata

Add a row to `region_og_metadata` table:

| Field | Value |
|-------|-------|
| region_slug | `umbria` |
| title | `Retiring in Umbria \| Veni. Vidi. Vici. Region Guide` |
| description | `Italy's green heart — positioned between Rome and Florence. Your guide to retiring in Umbria: medieval towns, truffles, wine, and affordable central Italian living.` |
| image_url | `https://news.caesartheday.com/images/umbria-og.jpg` |

### 4. Update Vercel Routes for Social Bot Detection

Add `umbria` to the Vercel route pattern in `vercel.json`:

```json
{
  "src": "^/(piemonte|lombardia|puglia|umbria)(?:/)?$",
  "has": [...],
  "dest": "/api/og?path=/$1"
}
```

### 5. Create the OG Image File

Copy or create the OG image:
- Use the existing `umbria-hero.jpg` as a base
- Place it as `/public/images/umbria-og.jpg`
- Ensure it's accessible at `https://news.caesartheday.com/images/umbria-og.jpg`

---

## File Changes Summary

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/pages/RegionPage.tsx` | Add Umbria SEO config to `seoConfig` object |
| Modify | `vercel.json` | Add `umbria` to social bot route pattern |
| Create | `public/images/umbria-og.jpg` | OG image for social sharing (1200×630) |
| Database | `region_og_metadata` | Insert Umbria OG metadata row |

---

## OG Image Recommendation

For the OG image, I recommend using one of these approaches:

**Option A: Use existing hero image**
Copy `/public/images/umbria/umbria-hero.jpg` to `/public/images/umbria-og.jpg` — quick and maintains visual consistency.

**Option B: Create text overlay image**
Generate a custom OG image with "Umbria: Italy's Green Heart" text overlay on a landscape background for better social impact.

The implementation will copy the existing hero image as a starting point, which can be replaced later with a custom design if desired.

---

## SEO Keyword Strategy

The keywords target three search intent categories:

1. **Direct retirement queries**: "retire in Umbria", "Umbria cost of living", "central Italy retirement"
2. **Location-specific**: "Perugia living", "Assisi retirement", "Rome Florence corridor"
3. **General Italian retirement**: "retiring in Italy", "Italian regions guide", "Umbria wine regions"

This matches the established pattern from Piemonte and Puglia while emphasizing Umbria's unique positioning as the Rome-Florence corridor.
