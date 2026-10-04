# Small fixes on italy.caesartheday.com

## 1. 7% CTA copy
- Add the Puglia entry with the exact title, lead and emphasis you gave. Detail and button stay the same template.
- Drop the Calabria fallback. Any region without its own entry gets generic copy built from its display name, e.g. "Find 7%-Eligible Towns in {Region}". No other region's text can appear.
- Pass the display name from the region page.

## 2. Visto Facile CTA headline
Build it from the display name ("Make Your Trentino-Alto Adige Move Official"), not the capitalised slug.

## 3. Puglia guide text (in the static Puglia file, which the page reads from)
- Intro paragraph 4: "...nobody's in a hurry, and you won't be either."
- Intro paragraph 5: replace the "la dolce vita..." sentence with "This month we're heading south: two coasts, a lot of olive oil, and the questions that matter before you sign a lease."
- Cost reality check: swap the first sentence for your new one. "Algargo" becomes "Algarve" in the same paragraph.
- Hero credit: "Photo: Puglia © CaesarTheDay" (currently it reads "Langhe Vineyards").
- Facebook share message: "sun-soaked secret" becomes "two-coast region".
- 7% flags untouched. Puglia is a locked region; these edits are only the ones you listed.

## 4. Homepage PDF archive
- Remove the Liguria 2025 PDF; add the line "Liguria now has a full web guide." under the archive heading.
- New Sardegna and Abruzzo descriptions, as given.
- Every PDF card shows the label "2025 edition. Some figures are out of date; web edition coming."

## 5. Newsletter sign-up block
A new block with the heading, body and button text you gave. The button links to the newsletter page with tracking tags.
- Region pages: after the editorial welcome, and again just before the closing share section (campaign = region slug).
- Homepage: one block under the featured issue (campaign = home).
- Styled with the site's existing colours and fonts.

## 6. Tracking tags on every outbound link
Add `utm_source=veni-vidi-vici&utm_medium=referral&utm_campaign={slug or home}` to every link to caesartheday.com, vistofacile.caesartheday.com and italy7percent.caesartheday.com. That covers the book, consultation, Visto Facile, both 7% sections, the homepage and the cookie banner. Links that already carry a query string get the tags appended.

## 7. Clean-up
Remove the unused "ctas" list from the global settings file.

## Technical notes
- New `src/lib/utm.ts` with `withUtm(url, campaign)`. It only tags the three caesartheday hosts and leaves internal links, Amazon links, etc. alone.
- New `src/components/sections/NewsletterSignup.tsx` (prop `campaign`).
- `SevenPercentCTA`, `SevenPercentExplainer`, `RetirementBlueprintCTA` and `BookCTA` gain `region`/`displayName` props where missing. Display names come from the region row (`regionMeta.display_name`), with the registry as fallback.
- Edit `public/data/regions/italy/puglia.json`, `public/data/newsletter-index.json` (plus a small archive-card change in `NewsletterIndex.tsx`) and `public/data/globals.json`, after confirming nothing reads `globals.ctas`.
- Check the Puglia, Trentino and home pages in the browser afterwards.
