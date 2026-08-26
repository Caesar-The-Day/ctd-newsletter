# Bring the Healthcare & Infrastructure headings back in line

You're right — the new Friuli Healthcare & Infrastructure section is the only section on the page using a serif display face. Every other section (Three Friulis, Living on Three Borders, Bora, Highlights) uses bold sans headings. It's 13 occurrences in one file, nowhere else.

## What changes

In `src/components/sections/FriuliHealthcareInfrastructure.tsx` only:

- Section `h2` ("Well cared for, and never far from a border"): `font-serif text-4xl md:text-5xl` becomes `text-3xl md:text-5xl font-bold`, matching Three Friulis.
- All sub-headings (`h3`: care tier ladder, hospital roster, "Where you live changes your care", SSN steps, destination name, airports, spine, Adriatic panel): drop `font-serif`, use `text-2xl md:text-3xl font-bold` at the same sizes the other sections use for sub-headings.
- Numeric/stat displays that currently use serif (stat strip count-ups, dial minutes, step numerals, emergency-number badges): switch to bold sans at the same sizes, so the figures read like the counters in the Bora meter and Cross-Border time bars.

No layout, data, motion, or copy changes — only the type treatment.

## Technical notes

Single file edit; no other section touches `font-serif`, so nothing else on the page or in locked regions is affected.
