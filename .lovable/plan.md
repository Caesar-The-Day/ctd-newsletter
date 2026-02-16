

## Fix the Publish Feature to Actually Update the Landing Page and Map

### The Problem

When you click "Publish" in the admin panel, the edge function only updates the **database** (sets status to "live", locked to true). But the landing page (`/`) reads its data from a **static JSON file** (`newsletter-index.json`) which never gets updated. So after publishing Veneto:

- The database says Veneto is "live" (correct)
- The landing page still shows Veneto as "Coming Soon" and Umbria as the featured issue (wrong)
- The map still treats Veneto as a "coming-soon" region with no link (wrong)

### The Solution

Make the landing page dynamically build its newsletter list from the **database** (which the admin already manages), instead of relying on the static `newsletter-index.json` file. This way, when you publish a region, the landing page immediately reflects the change.

### Changes

**1. Update `src/utils/getRegionData.ts` -- New function `getNewsletterIndexData`**

Replace the current implementation (which just fetches `newsletter-index.json`) with one that:

- Queries the `regions` table for all regions with status "live" or "draft"
- Builds the newsletters array from database rows (slug, display_name, status, issue_number, published_date)
- Sets the newest published region as the "featured" issue
- Falls back to the static JSON if the database query fails (safety net)
- Still loads the archive section from the static JSON (PDF downloads are not in the database)

**2. Map thumbnails and descriptions**

The database `regions` table doesn't store thumbnails or descriptions for the newsletter index cards. Two options:

- Use convention-based paths: thumbnail = `/images/{slug}/{slug}-hero.jpg` or similar known images
- Add a small lookup map in `getNewsletterIndexData` that maps slugs to their hero images and short descriptions (derived from the existing static JSON data that's already proven)

The plan uses a **hybrid approach**: read the static `newsletter-index.json` once for its archive data and metadata (thumbnails, descriptions), then override the newsletters list and featured section with live database state. This means:

- Any region that's "live" in the database gets a card with a link
- The newest published region becomes the featured hero card
- "Draft" regions show as "Coming Soon"
- Archive PDFs continue working from the static file
- The map receives the correct status for each region

**3. Update `ItalyMapInteractive` component**

The map component already handles "live" vs "coming-soon" status correctly from the data it receives. No map code changes needed -- it just needs to receive the correct status for Veneto (which will happen once the data source is fixed).

### Technical Details

```text
Current flow:
  Landing Page -> fetch newsletter-index.json (static) -> render cards + map
  
New flow:
  Landing Page -> fetch newsletter-index.json (for archive + metadata)
                -> query regions table (for live status)
                -> merge: DB status overrides static status
                -> newest published = featured
                -> render cards + map
```

The key merge logic:
- For each region in the database with status "live", find or create its newsletter entry with `ctaLink: /{slug}` and `ctaText: "Read Newsletter"`
- For regions in "draft" status, set `status: "coming-soon"` and `ctaText: "Coming Soon"`
- Sort newsletters by issue_number descending
- The region with the highest issue_number and status "live" becomes the featured card

**4. Update `ai-instructions.json` via the publish edge function (optional but recommended)**

Currently `ai-instructions.json` is also stale (doesn't include Umbria or Veneto in lockedRegions). This is a secondary concern since it's an internal tool, but the edge function could also update this. However, since edge functions can't write to static files in the repo, this would need a separate approach (like also reading locked regions from the DB). For now, the priority is fixing the user-facing landing page.

### Files Modified

1. `src/utils/getRegionData.ts` -- Rewrite `getNewsletterIndexData()` to merge DB state with static JSON
2. No edge function changes needed
3. No component changes needed (the components already handle the data correctly)

### What This Fixes

- Publishing a region immediately updates the landing page cards
- The map immediately shows the region as "Live" with a working link
- The featured hero section automatically switches to the newest published issue
- No manual JSON editing required after publishing

