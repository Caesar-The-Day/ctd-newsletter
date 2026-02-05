

# Fix: Veneto Hero Image Cache Busting

## Problem

The hero image file was initially created empty, then overwritten with actual image data. Cloudflare's CDN cached the empty file with a 4-hour TTL (`max-age=14400`). The user's preview iframe keeps serving the cached empty response. A fresh browser session (verified with the browser tool) loads the image perfectly.

## Solution

Rename the image file to bypass the stale CDN cache entirely, and update the database reference to match.

## Steps

### Step 1: Copy the image to a new filename
- Copy `public/images/veneto/hero.jpg` to `public/images/veneto/veneto-hero.jpg`
- Delete the old `hero.jpg` (optional, but cleaner)

### Step 2: Update the database reference
```sql
UPDATE regions 
SET region_data = jsonb_set(region_data, '{region,hero,bannerImage}', '"/images/veneto/veneto-hero.jpg"')
WHERE slug = 'veneto';
```

This ensures the `HeroParallax` component requests `/images/veneto/veneto-hero.jpg` — a URL the CDN has never seen, so it fetches fresh from origin.

## Why This Works

- The CDN has never cached `/images/veneto/veneto-hero.jpg`, so it must fetch from origin
- The origin has the correct binary image data (verified: 423KB, valid JPEG)
- No code changes needed — just a file rename and database update
- This also matches the naming convention used by other regions (e.g., `puglia-hero.jpg`, `umbria-hero.jpg`, `lake-como-hero.jpg`)

## Files Changed
- `public/images/veneto/veneto-hero.jpg` (new file, copy of hero.jpg)
- Database: `regions.region_data` for slug `veneto` updated

