## Replace "Italy Is Calling" CTA with Visto Facile CTA (Molise)

Currently `RetirementBlueprintCTA` shows the "Italy Is Calling… Retirement Blueprint" pitch on every region except Piemonte/Puglia (which have their own variants). The Molise page falls into the generic bucket.

### Plan

1. **Bring in the Visto Facile logo as a project asset**
   - Copy `src/assets/visto-facile-logo.png` from the *Visto Facile ERV Navigator* project into this project at `src/assets/visto-facile-logo.png`.

2. **Add a Molise variant inside `RetirementBlueprintCTA.tsx`**
   - When `region === 'molise'`, render a different card: logo on top, new headline, ERV-focused copy, and a button linking to `https://visto-facile.lovable.app`.
   - All other regions keep the existing "… Is Calling" variant unchanged.

### Proposed copy (Molise variant)

- **Headline:** "Ready to Take the Italian Plunge?"
- **Sub:** "If Molise (or anywhere in Italy) is on your shortlist, the Elective Residency Visa is the door you'll walk through. Visto Facile turns that intimidating application into a guided, step-by-step process — built specifically for U.S. and Canadian applicants."
- **Bullet line:** "Document checklists, income calculations, consulate-specific quirks, and timeline tracking — all in one place."
- **Italic tagline:** "The dream is yours. The paperwork doesn't have to be."
- **Button:** "Try Visto Facile" → `https://visto-facile.lovable.app` (target=_blank, `data-analytics-event="visto_facile_cta_click"`)

### Scope confirmation
This swaps the CTA **only on the Molise page** based on the current context (you're viewing /molise and the prior turns were all Molise-scoped). If you'd like it to also replace the generic fallback on every region that isn't Piemonte/Puglia, say the word and I'll widen the condition.