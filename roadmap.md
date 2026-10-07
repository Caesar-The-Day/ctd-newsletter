# Roadmap

## Done
- [x] Add "VVV Signup" tag param to newsletter signup links (NewsletterSignup.tsx + homepage form)
- [x] Homepage redesign (src/pages/NewsletterIndex.tsx) — homepage only, region pages untouched
  - [x] .brand-ctd tokens + Playfair Display fonts in index.css / index.html
  - [x] newsletter-index.json: featured.summary, featured.facts, area + shortDescription on every entry
  - [x] New sticky homepage header (HomeHeader.tsx)
  - [x] Hero: text left + ItalyMapInteractive right (id="map"), stats row computed from data
  - [x] Recolour map: terracotta/gold/hatch/stone states, NEW THIS MONTH pill, legend
  - [x] Latest region band (id="latest"): photo, name, summary, 2x2 fact tiles
  - [x] The Regions grid (id="regions"): 4 geographic groups, merged cards, uncovered strip
  - [x] Signup band (id="signup") in blush with VVV Signup tag
  - [x] About Caesar (id="about") with portrait + links
  - [x] Homepage-only light footer variant (Footer.tsx variant prop)
  - [x] Wording pass + no Live badge + no issue numbers on cards
  - [x] Mobile check (no horizontal scroll) + reduced motion + contrast
  - [x] getRegionData merge keeps summary/facts/area/shortDescription through DB merge

## Pending (blocked on user action)
- [ ] Publish — logo swap, VVV Signup tag, homepage redesign reach italy.caesartheday.com on publish
- [ ] After publish: test crawler pages on a Vercel preview; add news.caesartheday.com to the Vercel project for the 301

## Current
- [x] Correct Friuli tax, healthcare, and Trieste rent copy
- [x] Make the regional title the hero H1
- [x] Standardize canonical and social URLs on italy.caesartheday.com
- [x] Keep More Towns cards visible after jump navigation
- [x] Audit every published guide for tax eligibility, health enrollment cost, rent consistency, and data year
- [x] Tighten the global email signup composition while preserving homepage and regional themes
- [x] Redirect the legacy Friuli `/regions/` URL to its italy.caesartheday.com canonical
- [x] Replace Friuli’s editorial opening with the supplied six-paragraph version
