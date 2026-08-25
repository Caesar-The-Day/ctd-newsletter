# Baseline region rules + duplicate CTA fix

## 1. Fix the duplicated CTA

Confirmed cause: the region page renders the CTA twice — once with the default `auto` variant, once with `variant="consultation"`. The `auto` variant only resolves to Visto Facile for regions on a hardcoded allow-list (`molise, calabria, piemonte, lombardia, veneto, puglia, lazio`). Friuli-Venezia Giulia is not on that list, so both slots fall through to the same "Italy Is Calling" consultation card.

Change:
- Set the first CTA slot explicitly to `variant="visto-facile"` and the second to `variant="consultation"`, so every region always gets one of each, in that order.
- Drop the region allow-list from the component (or keep it only as the fallback for `auto`), since the variant is now explicit.
- No copy or design changes to either card.

## 2. Save the rules to project memory

Three new/updated memory entries, referenced from the memory index:

- **7% flat tax designation (constraint):** Never assign the 7% badge to a town on inference or assumption. The 7% list is supplied by the user per region; if no list has been given, no town gets the badge.
- **Region map baseline (feature):** Every region's map must ship with the standard overlay set as part of the AI baseline build — UNESCO/heritage sites, wine zones, transport hubs (airports, rail, ports), nature (national/regional parks, lakes, mountains), plus town markers. Each overlay is individually toggleable and off by default.
- **More Towns grid (feature):** "More Towns to Consider" is always exactly 12 towns, for grid symmetry.
- **CTA seeding (preference):** When a page carries two CTAs, they must be different offers — one Visto Facile (ERV Navigator), one consultation. Never two of the same.

## 3. Wire the rules into the scaffold

- Update the region scaffold template so a new region starts with the five map overlay buckets pre-created (empty, ready for research to fill) and a 12-slot towns grid expectation, so the baseline build produces them by default rather than as a later manual pass.
