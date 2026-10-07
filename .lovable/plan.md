# Friuli accuracy, hero, SEO, and reveal fixes

## Content corrections

- Update Friuli’s live stored content to remove both remaining 7% claims:
  - Replace the cost-of-living tax sentence with one direct note that Friuli-Venezia Giulia does not qualify, followed by the regions/qualifying areas where the regime applies.
  - Remove the inaccurate “7% tax options” wording from the Friuli social-share copy.
  - Do not add or alter any town-level 7% eligibility flags.
- Add a clear healthcare enrollment note in Friuli’s “Getting into the system” area: most Elective Residency Visa holders using voluntary national-health enrollment pay at least about €2,000 per year.
- Reconcile Trieste housing figures around a defensible 2026 normal central two-bedroom rent:
  - Set the estimator’s normal Trieste city-centre rent to €900/month.
  - Tighten the Borgo Teresiano district range to €750–1,050/month so the district card and estimator describe the same market.
  - Change the estimator source note from 2025 to 2026.

## Hero heading hierarchy

- Update the shared region hero so the regional title is the single `<h1>` and the “Veni. Vidi. Vici.” masthead remains prominent styled text without heading semantics.
- Preserve each region’s existing image, theme, tagline, issue/date information, and overall composition while rebalancing spacing and type sizes for the longer Friuli title on desktop and mobile.
- Confirm Friuli renders exactly as: “Friuli-Venezia Giulia: Italy’s Intersection of Empires” in the H1.

## Canonical domain and social previews

- Make `https://italy.caesartheday.com` the canonical site origin everywhere, with region pages at `https://italy.caesartheday.com/<region-slug>` and the catalog at the domain root.
- Update the client metadata, crawler-rendered HTML, JSON-LD, sitemap, robots sitemap reference, AI-readable links, homepage fallback metadata, and the admin Facebook-debugger link so they all agree on that domain.
- Keep Friuli’s stored regional OG title, description, and 1200×630 image, but ensure `og:url`, canonical, and structured-data URLs all self-reference `https://italy.caesartheday.com/friuli-venezia-giulia`.
- Ensure Friuli’s in-page share controls use the same canonical URL rather than the generic catalog card.
- Leave the main CaesarTheDay site as an external brand destination; do not treat `www.caesartheday.com/regions/...` as canonical.

## More Towns visibility

- Replace the observer-dependent hidden state on “More Towns” cards with a mount animation that always settles visible, including when visitors jump directly down the page or use reduced motion.
- Keep the existing staggered feel, card interactions, dialogs, and 12-town layout.

## Validation

- Check Friuli on desktop and mobile for one correct H1, balanced hero text, consistent rent figures, the healthcare fee, and no Friuli 7% claims.
- Verify direct/jump navigation leaves all “More Towns” cards visible and interactive.
- Inspect the generated client and crawler metadata for Friuli plus another region and the homepage; confirm canonical, OG, JSON-LD, sitemap, robots, and share links all use `italy.caesartheday.com`.
- Run the project’s image audit and check the preview build output. The crawler/social-debugger result on the public Italy domain will require the updated deployment before Facebook can fetch the new tags.

## Technical details

- Friuli’s cost figures and source label are stored in the live `regions.region_data` row; its specialized Trieste and healthcare displays are in the Friuli section data/components.
- Canonical URLs currently diverge between the React page and crawler helpers, so one shared Italy-domain convention will be applied across both paths.
- The main-site `/regions/...` response currently returns generic homepage tags, while the Italy-domain crawler endpoint returns Friuli content with the wrong canonical URL; this plan fixes the metadata at the actual canonical host rather than depending on the main-site proxy.
