

## Elevate the Wine, Food & Culture Section for Veneto

### Vision
Transform the current placeholder-level HighlightsShowcase into a rich, editorial experience that teaches geography through wine, food, and culture — without breaking any other region's page.

### Current State
- The HighlightsShowcase component renders 3 tabs (Wine, Food, Culture) with collapsible cards
- Each card has: image, title, subtitle, description, and optional links
- Veneto currently has 3 wine cards, 3 food cards, 3 culture cards — all using placeholder `/images/veneto/hero.jpg`
- The data structure is fixed: `{ title, intro, backgroundImage, cards[] }`
- Each card: `{ id, title, subtitle, image, description, links[] }`

### Strategy
We can deliver ~80% of the user's vision through **data changes alone** (richer descriptions, more cards, better structure) and a **small component enhancement** to support multi-paragraph descriptions. The remaining 20% (Carnevale interactive toggle, ambient soundscape) would require new Veneto-specific components — we'll save those for a follow-up.

---

### Changes

#### 1. Component Enhancement: Multi-paragraph descriptions in HighlightCard

**File: `src/components/sections/HighlightsShowcase.tsx`**

Currently line 100 renders `card.description` as a single `<p>` tag. Change it to split on `\n\n` and render multiple paragraphs — same pattern used by TownsFeatured and TownsGrid. This is backward-compatible since descriptions without `\n\n` still render as one paragraph.

```tsx
// Before (line 100):
<p className="text-muted-foreground mb-4">{card.description}</p>

// After:
<div className="space-y-3 mb-4">
  {card.description.split('\n\n').map((paragraph, idx) => (
    <p key={idx} className="text-muted-foreground">{paragraph}</p>
  ))}
</div>
```

#### 2. Update Section Intro

**File: `public/data/regions/italy/veneto.json`**

Add a `sectionIntro` field to the highlights object:

> "Veneto doesn't separate wine, food, and culture into neat categories. They bleed into each other — a glass of Amarone is architecture, a plate of baccala is history, and Carnevale is philosophy wearing a mask. Here's what that actually looks like."

#### 3. Wine Tab: "What's Your Veneto Pour?"

Replace generic wine cards with **4 personality-driven wine cards** that frame each wine as an identity choice:

| Card | Title | Subtitle | Description Approach |
|------|-------|----------|---------------------|
| Amarone della Valpolicella | "Big, Structured, Contemplative" | Valpolicella's crown jewel | Flavor profile, where it's produced, the kind of town vibe it pairs with (Verona — deep, patient, layered) |
| Prosecco Superiore DOCG | "Bright, Social, Celebratory" | Conegliano-Valdobbiadene hills | UNESCO hillside terroir, the real thing vs supermarket, pairs with Treviso lifestyle |
| Soave Classico | "Crisp, Restrained, Elegant" | Volcanic whites east of Verona | Mineral Garganega from ancient volcanic soils, pairs with Vicenza's understated refinement |
| Bardolino | "Light, Easygoing, Lakeside" | Lake Garda's casual pour | Fresh cherry reds for aperitivo, pairs with the relaxed Garda lifestyle |

Update the tab title to: **"WINE — What's Your Veneto Pour?"**
Update the intro to frame wine as identity, not just tasting notes.

#### 4. Food Tab: "Polenta, Risotto, or Bigoli?"

Replace generic food cards with **3 culinary pillar cards**, each representing a geographic/cultural food tradition:

| Card | Title | Subtitle | Description Approach |
|------|-------|----------|---------------------|
| Polenta & Mountain Cuisine | "Alpine Roots" | Game meats, Asiago, alpine traditions | Cultural story about mountain cooperatives, summer pasture migrations, "Where You'll Feel This Most: Belluno, Feltre, Bassano" |
| Risotto & Lagoon Influence | "Seafaring Traditions" | Cuttlefish ink, Venetian trade routes | Story of Venice's maritime kitchen, sarde in saor as sailor's preservation, "Where You'll Feel This Most: Venice, Chioggia, the Lagoon" |
| Bigoli & Mainland Comfort | "The Veneto Heartland" | Thick pasta, duck ragu, radicchio, pumpkin | Treviso's radicchio religion, bigoli with duck as Sunday tradition, "Where You'll Feel This Most: Padua, Treviso, Vicenza" |

Update the tab title to: **"FOOD — Polenta, Risotto, or Bigoli?"**
Update the intro to frame food as geography.

#### 5. Culture Tab: "Not Just Pretty. Alive."

Replace generic culture cards with **6 cards** organized around the user's three tiers:

**Grand Stage (2 cards):**
- Arena di Verona & Opera — open-air opera in a 2,000-year-old amphitheater
- Scrovegni Chapel & Giotto — the frescoes that changed Western art

**Living Traditions (2 cards):**
- Carnevale in Veneto — "Choose Your Carnevale" comparing Venice (masked republic, ritualistic), Verona Bacanal del Gnoco (playful, parades), and small-town versions (community floats, family energy). Includes the "Mask or No Mask?" cultural subtext about anonymity as political power.
- Marostica Living Chess Game — the human chess match in the piazza, plus Palladian villa trail context

**Everyday Culture (2 cards):**
- Venetian Music Heritage — Vivaldi, the Ospedali orphanages that trained female musicians, La Fenice
- Aperitivo & Passeggiata — the daily rituals that define Veneto life, spritz culture born in Padua/Venice, market days

Update the tab title to: **"CULTURE — Not Just Pretty. Alive."**
Update the intro to frame culture as lived experience, not museum visits.

---

### What This Achieves
- Wine becomes identity (personality-driven, ties to town vibes)
- Food teaches geography (three culinary pillars map to regions)
- Culture has depth (Carnevale subtext, Vivaldi's orphanages, living chess)
- Multi-paragraph descriptions give editorial breathing room
- All changes are backward-compatible (other regions unaffected)
- No new components needed — pure data + 1 small rendering tweak

### What This Does NOT Do (Future Follow-ups)
- No ambient audio soundscape (would need a new component)
- No map highlight toggle from wine cards (would need InteractiveMap integration)
- No Palladian Architecture Trail map overlay (separate map feature)
- No Serenissima naval history explainer (could be a standalone section)

### Files Changed
- **`src/components/sections/HighlightsShowcase.tsx`** — Split description on `\n\n` for multi-paragraph rendering (3 lines changed)
- **`public/data/regions/italy/veneto.json`** — Complete rewrite of the `highlights` object with richer editorial content (wine: 4 cards, food: 3 cards, culture: 6 cards)

### Testing
- Navigate to `/veneto` and scroll to the Food, Wine & Culture section
- Click through all 3 tabs and expand every card
- Verify multi-paragraph descriptions render correctly
- Check that `/piemonte`, `/puglia`, `/lombardia` highlights still render correctly (backward compatibility)
