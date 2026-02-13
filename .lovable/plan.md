

## Enhance Veneto Healthcare & Infrastructure Section

### Problem

The current Veneto section uses a 3-tab layout (Hospitals / Airports / Connectivity) where the Connectivity tab has a hardcoded "Piemonte's strategic location" paragraph. The airports and connectivity are split into separate, thin tabs. Meanwhile, Veneto has rich infrastructure data already defined (rail, airports, nature) plus an untapped opportunity: Adriatic ferry services.

### Solution

Switch Veneto to use the Lombardia-style **2-tab layout** (Hospitals / Infrastructure) since it already has the `infrastructure` data structure. This consolidates airports, rail, ferries, and nature into a single rich Infrastructure tab. Then add a **new "Adriatic & Ferry Connections" subsection** with Venice's maritime routes to Croatia and beyond.

---

### Changes

**1. Component: `src/components/sections/HealthcareInfrastructure.tsx`**

- Update the tab logic so Veneto also uses 2 tabs (Hospitals / Infrastructure) instead of 3, since it has `healthcare.infrastructure` data just like Lombardia
- Change the `useTwoTabs` condition from `isLombardia || isUmbria` to check `hasInfrastructure || isUmbria`
- Update the Infrastructure tab rendering to not be Lombardia-exclusive (remove the `isLombardia &&` guard on the `TabsContent value="infrastructure"`)
- Fix the hardcoded "Piemonte's strategic location" text on line 799 to use a generic region-aware string (this is a fallback path, but it should not mention any specific region)
- Update the closing statement to not reference specific regions — make it data-driven or generic

**2. Data: `public/data/regions/italy/veneto.json`**

Add a new subsection inside `healthcare.infrastructure.sections[0].subsections` for ferry services:

```text
Title: "Adriatic Ferries"

Content:
- Venice is the historic gateway to the Adriatic — and ferry services still run
- Routes to Croatia: Pula (3.5 hrs), Rovinj (3 hrs), Poreč (2.5 hrs) via high-speed catamaran (seasonal, Kompas/Venezia Lines)
- Routes to Greece: Igoumenitsa (22 hrs), Patras (30 hrs) via Anek/Minoan Lines — overnight car ferries
- Slovenia: Piran accessible via Trieste connection (1 hr from Venice by train, then local ferry)
- Year-round vs seasonal distinction (Croatia routes run May-Oct; Greece routes year-round)
- Pro tip: "A weekend in Rovinj from your base in Veneto costs less than a train to Naples."
```

Also add a new infrastructure section for **"The Crossroads Advantage"** — a quick editorial on Veneto's unique position:
- Brenner Pass to Austria/Germany (road + rail)
- A4 corridor across Northern Italy
- Adriatic maritime access
- Three airports serving different price points and geographies

### Section Flow (Infrastructure tab)

```text
Infrastructure Tab:
  |
  Intro paragraph (already exists)
  |
  Transportation & Access
    -> Rail (already exists)
    -> Airports (already exists - 3 airports with closing line)
    -> NEW: Adriatic Ferries (Venice to Croatia, Greece, etc.)
  |
  Access to Nature & Recreation (already exists)
  |
  NEW: The Crossroads Advantage (editorial closing block)
```

### Technical Details

- The Lombardia Infrastructure tab renderer (lines 500-613) already handles `subsections` with `paragraphs`, `airports`, `intro`, and `closing` — the ferry data slots into this exact structure
- A new subsection type for ferries will reuse the existing subsection card layout with a `Ship` icon (already imported)
- The "Crossroads Advantage" section will be a new entry in `infrastructure.sections` with paragraphs and features (same pattern as "Access to Nature")
- No new components or dependencies needed — everything fits the existing data-driven structure

### Bug Fixes

- Line 799: Remove hardcoded "Piemonte's strategic location" — replace with a generic fallback
- Lines 869-872: The closing statement checks for `puglia` specifically — update to use region-aware text from data or a generic message that works for all regions
