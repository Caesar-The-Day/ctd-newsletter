# Update landing hero with Molise + add Molise to web project map

## Current state

- `/` (NewsletterIndex) auto-picks the newest live region as the featured card via `getNewsletterIndexData`. Molise is live (issue 13, June 2026), so it's already featured — but with fallback values because there's no Molise entry in `public/data/newsletter-index.json`:
  - Title renders as lowercase `molise` (from `dbRow.display_name`)
  - Thumbnail falls back to non-existent `/images/molise/molise-hero.jpg` (the card image area shows blank)
  - Description is the generic `Explore molise — your guide to retiring in this Italian region.`
- The Molise hero used on `/molise` lives in Supabase storage: `https://jolbywwrnehhwodlgytt.supabase.co/storage/v1/object/public/region-images/molise/hero.png`
- The sister project `caesartheday-web` has `public/data/italy-region-index.json` driving the Italy map. It has no Molise entry.

## Changes — this project (`caesartheday-newsletter`)

1. **`public/data/newsletter-index.json`** — add a Molise object inside `newsletters[]` (which the loader uses for title/thumbnail/description lookup; that also flows into the featured card):
   ```json
   {
     "slug": "molise",
     "title": "Molise",
     "subtitle": "Italy's Quietest Frontier",
     "issueNumber": 13,
     "date": "June 2026",
     "status": "live",
     "thumbnail": "https://jolbywwrnehhwodlgytt.supabase.co/storage/v1/object/public/region-images/molise/hero.png",
     "description": "Italy's second-smallest region — and its quietest retirement frontier. From Termoli's Adriatic coast to Agnone's snowy hill towns, Molise pairs €40k stone houses and the 7% retiree flat tax with Cardarelli and Gemelli Molise healthcare, Tintilia wine, white truffles, and the honest trade-off of depopulation. A clear-eyed field guide for retirees who want the real Molise, not the postcard.",
     "ctaText": "Read Newsletter",
     "ctaLink": "/molise"
   }
   ```
   This fixes the capitalization ("Molise"), the hero card image, the intro paragraph, AND the "Explore Molise" button label automatically (the merger computes `'Explore ' + title`).

2. **DB `regions.display_name`** — update `slug='molise'` row from `molise` → `Molise` so any other surface using `display_name` shows capitalized text. (Data update via insert tool, not migration.)

## Changes — sister project (`caesartheday-web`)

3. **`public/data/italy-region-index.json`** — append a Molise entry inside `regions[]`, matching the existing schema for live regions (Calabria-style with cross-domain ctaLink):
   ```json
   {
     "slug": "molise",
     "title": "Molise",
     "date": "June 2026",
     "status": "live",
     "thumbnail": "https://jolbywwrnehhwodlgytt.supabase.co/storage/v1/object/public/region-images/molise/hero.png",
     "description": "Italy's second-smallest region: Apennine villages, the 7% retiree flat tax, and €40k stone homes. Termoli on the Adriatic, Agnone in the snow, and a healthcare network that punches above its weight.",
     "ctaText": "Read Newsletter",
     "ctaLink": "https://italy.caesartheday.com/molise"
   }
   ```
   Note: cross-project edits run in that project's context. After you approve, I'll need to switch projects to apply this — or you can hand it to the web project.

## Out of scope

- No component changes (NewsletterIndex.tsx already renders whatever data the loader returns).
- No new image files (using the existing Supabase hero URL — CSS `background-image`, no CORS issue).
- No changes to other regions.

Approve to apply, or tell me what to tweak in the description copy first.
