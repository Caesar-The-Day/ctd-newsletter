
## Plan: Remove SevenPercentCTA and Living the Language Sections from Veneto

### Current State
The Veneto page currently displays both sections:
1. **SevenPercentCTA** — "Find 7% Towns in Umbria" section (line 359 of RegionPage.tsx, controlled by `show7PercentCTA` flag)
2. **CollaboratorFeature** (Living the Language) — Language learning section with café image (lines 376-384 of RegionPage.tsx, controlled by `showCollaborator` flag)

Both are controlled via feature flags in `public/data/config/feature-flags.json`.

### Solution
Update `public/data/config/feature-flags.json` to disable both features for Veneto:
- Set `show7PercentCTA` to `false`
- Set `showCollaborator` to `false`

This approach:
- Keeps the component code intact (useful if you want to re-enable later)
- Requires only a simple data change
- Uses the existing feature flag infrastructure
- No component modifications needed

### Changes Required
**File:** `public/data/config/feature-flags.json`
- **Lines 33-42**: Update the `veneto` configuration object
  - Change `"show7PercentCTA": true` → `"show7PercentCTA": false`
  - Change `"showCollaborator": true` → `"showCollaborator": false`

### Visual Impact
When complete:
- SevenPercentCTA section will be hidden from the Veneto page
- CollaboratorFeature (Living the Language with café image) will be hidden from the Veneto page
- All other sections (Wine Quiz, Recipes, Healthcare, Cost Calculator, Pros/Cons, Closing) remain unchanged
- The page flow will move directly from Towns Grid → Highlights Showcase → Wine Quiz (or next enabled section)

### Files to Update
- **`public/data/config/feature-flags.json`** — Disable two flags for Veneto region (2-line changes)
