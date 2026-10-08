# SEO fixes: unique titles, clean canonicals, real 404s, recipe schema

## What I found
- Region pages already set their own head tags, but the titles are inconsistent and some descriptions run long. Examples: "Veni. Vidi.Vici. | Umbria | CaesarTheDay Newsletter" and "Autumn in Piemonte…". Descriptions range from 89 to 371 characters.
- `index.html` has no canonical tag, so that part is already done.
- The missing-page screen sets no title and no noindex.
- Unknown addresses (for example /toscana) already return a real 404 to Bing, social and AI crawlers. Google and regular visitors get the app, which answers with a 200.

## 1. Titles, descriptions and social tags
- Write the following into each live region's own content (`seoTitle` and `seoDescription`), and copy the same values to its social preview record so both versions agree:
  - **Title:** "Retiring in {Region}: {tagline from the page heading} | Veni. Vidi. Vici.". If that runs over 60 characters, it drops to "Retiring in {Region} | Veni. Vidi. Vici.".
  - **Description:** one unique 140–160 character line drawn from that region's intro. It names the region plus towns, cost of living and healthcare. All 11 will be checked for length and uniqueness.
- The region page reads `seoTitle`/`seoDescription` first. A new region with neither gets the title pattern and a description built from its intro.
- Every region page carries a self-referencing canonical, `robots index, follow`, `og:type=article`, `og:site_name="Veni. Vidi. Vici."`, the hero image as an absolute address, and matching Twitter tags.
- Homepage: keep its title and description. Canonical stays `https://italy.caesartheday.com/`, with the same social tags and site name.
- The page shown to search engines will use the same title and description, so both versions match.
- Check one title, one description and one canonical per page in the rendered head.

## 2. Missing pages
- The 404 screen gets the title "Page not found | Veni. Vidi. Vici.", `noindex, follow`, no canonical, and a "Back to all regions" link. The look stays the same.
- **Real 404 status:** Google sees the app, which can't send a 404 status, so it relies on noindex. Every other crawler already gets a true 404.
- Link audit: the homepage map, list, nav and footer must only link to live regions. Unpublished regions show as text or "Coming soon". PDF regions keep their `/regions/newsletters/` links.

## 3. Sitemap
- It already lists only the homepage and live regions, using their canonical addresses. `lastmod` is the region's last saved date. No PDFs or admin pages. I'll confirm this and change nothing unless something's wrong.

## 4. Recipe structured data
- Keep the schema. Add image, description, author (Caesar Sedek), prep/cook/total time in ISO 8601 where the recipe has times, yield, cuisine "Italian", category and keywords. Fields with no data are left out.
- Confirm the ingredients and steps in the schema are in the page itself, not only loaded on click. If they're hidden behind "Show Recipe", render them hidden in the page rather than not at all, with no visual change.

## Not changing
Visible design, copy, URLs, robots.txt, and the PDF redirect.

## Technical details
- Data: update `regions.region_data.region.seoTitle/seoDescription` and `region_og_metadata.title/description` for the 11 live slugs. Mirror these into the static fallback JSON for Piemonte, Puglia, Lombardia and Veneto. These are locked regions, edited because this request explicitly asks for it.
- `src/pages/RegionPage.tsx`: priority is seoTitle, then og override, then the generated pattern. Add the og:site_name prop.
- `src/components/common/SEO.tsx`: add `siteName`, plus a `noCanonical`/`robots` override.
- `src/pages/NotFound.tsx`: add the head tags and the link.
- `api/render.ts`: prefer seoTitle/seoDescription.
- Recipe JSON-LD in `RegionPage.tsx`, plus `RecipesInteractive.tsx` and `UmbriaRecipes.tsx` if the content needs to be in the page.
- Closing reply: a route table with titles, descriptions and character counts, the 404 status answer, changed links, and the changed files.
