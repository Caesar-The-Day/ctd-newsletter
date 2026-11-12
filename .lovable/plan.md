# Book covers and a new "Italian for Real Life" book section

## 1. New Escape Plan cover everywhere
- Swap the current Escape Plan cover in the book section on every region page for the uploaded boarding-pass cover (Updated 2026 Edition).
- Save it under a fresh file name so old cached copies don't linger, and remove the old cover file.
- Search the rest of the site (homepage, crawler pages, data files) for any other place the old cover appears and update those too.

## 2. New book section: Italian for Real Life in Italy
A second book section for region pages, using the uploaded speech-bubble cover and the wording from the Books page on caesartheday.com:
- Tagline: "Not Italian for tourists. Italian for real life."
- Description: "A practical language and survival guide for English speakers building a life in Italy—not a grammar textbook, not a tourist phrasebook."
- Four bullet points: bureaucracy (Comune, Anagrafe, Questura, SPID, PEC); renting, buying, renovating; markets, doctors, pharmacies, mechanics, ZTLs; spoken Italian (boh, magari, mica, vabbè).
- Closing line about the YOU SAY → THEY SAY → YOU RESPOND format.
- Labelled "eBook".
- Buttons: "Get the eBook" (caesartheday.com/books, tagged with the region like other outbound links) and "Buy on Amazon" (amazon.com/dp/B0HJB6VNNT).
- Heading names the region, e.g. "Living in Liguria means talking to the Comune, the plumber and the pharmacist."
- Matches each region's own colors and fonts, the same way the Escape Plan section does.

## Placement
- Shows on region pages just before the Pros & Cons section, so it sits next to the language-barrier downsides and stays away from the Escape Plan section.
- Each region can switch it on or off on its own. It starts switched on for every live region.

## Technical details
- New `src/components/sections/ItalianBookCTA.tsx`, built like `BookCTA.tsx` (`region` prop, `withUtm` links, renders nothing if data is missing).
- Covers saved as local files in `public/images/` (the CDN pointers 404 on the live domain, per project rule). Old cover deleted. `bun run validate:images` must pass.
- New `showItalianBookCTA` flag in `feature-flags.json`; rendered in `RegionPage.tsx` before `ProsConsInteractive`.
- Locked regions aren't touched: this is a shared section toggled by a flag, with no edits to region content.
