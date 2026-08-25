# Plan: Write OG Title and Description for Lazio

## Goal
Create and insert an accurate, editorially aligned OG title and description for the Lazio region into the `region_og_metadata` table so social previews for `https://caesartheday-guides.lovable.app/lazio` are no longer using the generic fallback.

## Current state
- `region_og_metadata` has **no row** for `region_slug = 'lazio'`.
- Social crawlers hitting `/lazio` currently receive the generic fallback: "Veni. Vidi. Vici. | Caesar the Day" / "Your editorial guide to retiring in Italy — region by region, town by town."
- The region's editorial voice is pragmatic, systems-oriented, and retiree-focused; it avoids postcard escapism and does not hide the realities of Rome.

## Proposed copy

### OG Title
```
Lazio, Italy: Retire in Rome, the Hills, or the Lakes — A Practical Guide
```

### OG Description
```
Lazio is more than a Rome weekend. From hill towns in the Apennines to volcanic lakes and the Tyrrhenian coast, see what living here actually costs, how central-Italy connectivity works, and where the 7% tax incentive applies.
```

## Rationale
- **Audience**: directly addresses prospective retirees / ERV seekers.
- **Scope**: signals "Rome + beyond" without being touristy.
- **Specific proof points**: mentions Apennines, volcanic lakes, Tyrrhenian coast, cost, connectivity, and the 7% tax rule — all major content pillars on the Lazio page.
- **Honest framing**: "more than a Rome weekend" matches the editorial tone that Lazio is not just the capital.
- **Length**: title is 64 chars; description is 238 chars — both within safe social-preview limits.

## Implementation
1. Insert the new row into `region_og_metadata` for `region_slug = 'lazio'`.
2. If an OG image is already available, reference it; otherwise leave `image_url` as `NULL` so the fallback default image is used.
3. Verify by requesting the `/api/og?path=/lazio` endpoint with a social-user-agent header and checking the returned HTML.

## Open question
The user has not asked to generate or assign a specific OG image for this region. Should we also produce a 1200×630 OG image for Lazio, or is the existing default image acceptable?
