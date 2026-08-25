# Lazio on the home page — write-up, hero photo, and automatic promotion

Right now the home page already detects Lazio as the newest live issue (#14, August 2026), but it shows a placeholder: the description reads "Explore Lazio — your guide to retiring in this Italian region." and the photo is a broken image, because the site guesses a file path (`/images/lazio/lazio-hero.jpg`) that doesn't exist. The real Lazio hero lives in the backend region record.

Two parts: fix Lazio now, and make the promotion automatic for every future region.

## 1. Proper Lazio entry

Add Lazio to the home-page index with:
- Title: Lazio, subtitle "Rome, the Hills, and the Lakes"
- Issue #14 • August 2026
- Hero photo: the same image used at the top of `/lazio`
- Editorial introduction (roughly 55-70 words) in the site's honest, retiree-oriented voice, covering: Lazio as far more than Rome, hill towns and volcanic lakes and the Tyrrhenian coast, real cost of living inside vs outside the GRA, central-Italy connectivity (Rome hubs, rail to Naples and Florence), thermal springs, and the narrow 7% eligibility limited to a handful of Rieti-province towns.

This single entry feeds all three places at once: the featured hero card, the card that appears when you click Lazio on the Italy map, and the Regional Newsletters grid.

## 2. Make it automatic on publish

Change the home-page data loader so a newly published region is presented correctly without hand-editing anything:
- Pull the hero image, tagline, and intro text straight from the region record in the backend when the static index has no entry for that slug, instead of guessing an image path.
- Keep the static index as an override when it has richer copy.
- Fall back to a neutral placeholder only when the region record has no hero image at all.

Result: hitting Publish after marking a region live promotes it to the home hero, the map card, and the grid with its real photo and its own write-up.

## Technical notes

- `src/utils/getRegionData.ts` → `getNewsletterIndexData()`: extend the `regions` select to include `region_data`, and derive `thumbnail` from `region_data.region.hero.bannerImage` and `description` from `region_data.region.tagline` / intro paragraph before falling back to the current defaults.
- `public/data/newsletter-index.json`: add the `lazio` newsletter object (issue 14) with the storage hero URL and the new description; leave `featured` as-is since it is computed from the newest live region.
- No schema changes, no component changes required — `NewsletterIndex.tsx` and `ItalyMapInteractive.tsx` already consume the merged list.
