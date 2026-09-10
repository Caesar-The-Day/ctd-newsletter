# Liguria homepage card — new region-summary write-up

Liguria (issue 17, September 2026) is live but has no entry in the static
`newsletter-index.json`. As a result the homepage card falls back to an
auto-generated excerpt of the editorial welcome — a first-person greeting,
not a region summary. The fix mirrors what we did for Trentino-Alto Adige and
Lazio: add a static Liguria object whose `description` takes precedence over
the DB-derived excerpt.

## What changes

**File:** `public/data/newsletter-index.json`

Add a new object to the `newsletters` array (sorted by issue descending, so it
sits at the top, above Trentino-Alto Adige issue 16):

```json
{
  "slug": "liguria",
  "title": "Liguria",
  "subtitle": "The Vertical Riviera",
  "issueNumber": 17,
  "date": "September 2026",
  "status": "live",
  "thumbnail": "/images/liguria/hero-riviera-ponente.jpg",
  "description": "<summary below>",
  "ctaText": "Read Newsletter",
  "ctaLink": "/liguria"
}
```

- `thumbnail` uses the local hero (`/images/liguria/hero-riviera-ponente.jpg`)
  that already exists on disk — the same image used at the top of `/liguria`.
  This keeps the image local per the project rule and bypasses the DB path.
- Because Liguria is the highest live issue number, `getNewsletterIndexData()`
  will also promote it to the homepage `featured` hero card automatically,
  replacing the currently-hardcoded Calabria `featured` block. No change to
  the hardcoded `featured` object is needed (it is overridden when DB state
  produces a newer live region).

## Write-up

New `description` (emphasis on the Levante vs Ponente contrast, in the
honest retiree voice, ~3 sentences — not an excerpt of the welcome):

> Italy's narrowest region is a 350-kilometre crescent pressed between the
> Maritime Alps and the sea — and its two coasts could hardly be more
> different. East of Genoa, the Levante trades in postcards: Portofino, the
> Cinque Terre, and prices to match. West, the Ponente unfurls toward France
> through Sanremo, Imperia, and Alassio — the same mild winters, the same
> Vermentino and pesto, at roughly half the cost. This issue maps both
> coasts town by town, weighs the Levante premium against the Ponente value,
> and explains why the inland stone villages hold Liguria's best retirement
> affordability — and why no town here qualifies for the 7% flat tax.

## Out of scope

- No changes to `getRegionData.ts`, no component changes, no schema changes.
- The existing Liguria *archive* entry (issue 1 PDF) is unrelated and stays as-is.
- The editorial welcome text on the `/liguria` page itself is untouched.

## Verification

- Re-read `newsletter-index.json` to confirm valid JSON and correct sort order.
- Load `/` in the preview and confirm the Liguria card shows the new summary
  with the Riviera hero photo, not the welcome excerpt.
