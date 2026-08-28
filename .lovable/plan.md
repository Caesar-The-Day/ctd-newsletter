# Improve the Friuli-Venezia Giulia OG description

## Context

The active region is `friuli-venezia-giulia`. Its current OG description in `region_og_metadata` is a single thin line:

> Where the Alps meet the Adriatic in a sophisticated blend of Latin, Slavic, and Germanic cultures.

Given the depth of the Friuli page — four languages, the moving border, Trieste living, the Julian Alps, the sailing culture, and the 1976 quake story — the description undersells the region and reads flat in a social share.

## Proposed OG description

Craft a description (under 160 characters so it never gets truncated on most platforms) that sells the "intersection of empires" identity plus the practical retiree angle. Draft:

> Four tongues, a border that kept moving, and the Adriatic's finest coffee city. Trieste, wine hills, and the Julian Alps — a retiree's intersection of empires, honestly told.

Length: 150 characters (safe).

Alternative shorter option (if this feels too stacked):

> Where the Alps meet the Adriatic — four languages, a moving border, and Italy's most underrated retirement corner, honestly told.

## What to do

1. Update `region_og_metadata.description` for `region_slug = 'friuli-venezia-giulia'` to the chosen line (single `UPDATE`, no code change).
2. Leave `title` and `image_url` untouched (they are already good).
3. Verify the share preview resolves in the OG crawler (`/api/og?path=/friuli-venezia-giulia` returns the new description). Preview stays cached until re-scraped in the Facebook debugger.

This is a one-field data change only — no migration, no component edits.