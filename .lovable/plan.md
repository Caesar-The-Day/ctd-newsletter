# Molise Highlights Upgrade + Agnone Bell Foundry Interactive

## 1. Card imagery (12 total)

Generate one editorial JPEG per card (food, wine, culture × 4) into `public/images/molise/highlights/` and update each card's `image` field in the `regions.region_data->'highlights'` JSON via a Supabase update.

- **Food**: cavatelli with pork ragù, paprika-rubbed pampanella, Termoli brodetto in terra-cotta, pallotte cacio e ova in tomato sauce.
- **Wine**: Tintilia glass against vineyard, Biferno Rosso bottle/oak, crisp Falanghina with seafood, rustic Pentro tavern pour.
- **Culture**: Saepinum Roman ruins, 'Ndocciata fire torches at night, Samnite warrior artifact (museum-style), tombolo lace bobbins on cushion.

Style: warm editorial photography, natural light, consistent palette with existing Molise hero.

## 2. Expanded copy + reference links

Rewrite each card's `description` to 2–3 sentences (origin, what makes it distinct, when/where to encounter it), keeping the retiree-honest editorial tone. Populate `links[]` (label + url) per card with reputable references — e.g.:

- Pampanella → Slow Food / Gambero Rosso
- Brodetto Termolese → Comune di Termoli tourism / Italia.it
- Tintilia → Tintilia del Molise DOC consortium, Wine Enthusiast feature
- Biferno / Falanghina → Federdoc, Quattrocalici
- Saepinum → Parchi Archeologici (MIC), Italia.it
- 'Ndocciata → UNESCO candidacy page, Comune di Agnone
- Tombolo → Regione Molise artigianato page

Links render via the existing `ExternalLink` affordance already supported by `HighlightsShowcase`.

## 3. New interactive: "Sounds of Molise — The Agnone Bell Foundry"

A new section component telling the story of **Pontificia Fonderia di Campane Marinelli** (founded c. 1000 AD, Vatican supplier, one of the oldest family businesses on earth).

### UX
- Editorial intro paragraph + small portrait/photo of the foundry.
- A row of 5–6 **clickable bell cards**, each representing a real commissioned bell:
  - St Peter's Basilica (Jubilee 2000)
  - Montecassino Abbey
  - UN Headquarters (peace bell)
  - Expo 2015 Milano
  - Local Agnone cathedral
  - Mexico City Basilica of Guadalupe
- Clicking a bell:
  - Plays a short tone (different pitch per bell, generated client-side via WebAudio — no audio assets needed; sine + decay envelope, frequencies derived from realistic bell strike notes).
  - Reveals an info panel: year cast, weight, commissioner, short anecdote, link to source (Marinelli site / news article).
- "Ring all" button plays them in sequence (chord-like cascade).
- Respects `prefers-reduced-motion` and starts muted until user interacts (browser autoplay policy).

### Files
- **Create** `src/components/sections/AgnoneBellFoundry.tsx` — fully self-contained, region-agnostic (accepts a `bells` prop, falls back to internal Molise data).
- **Generate** 1 hero image `public/images/molise/agnone-foundry.jpg` (foundry interior, molten bronze, atmospheric).
- **Edit** `src/pages/RegionPage.tsx` — render `<AgnoneBellFoundry />` for `slug === 'molise'`, placed between `HighlightsShowcase` and `CollaboratorFeature` so it follows the culture context.
- **Edit** `feature-flags.json` for molise — add `agnoneBellFoundry: true` flag for visibility control.

### Technical notes
- WebAudio tones: `new AudioContext()` lazily on first click; per bell define `frequency` (e.g. 220, 261, 329, 392, 440 Hz with slight detune for bell shimmer using 2 oscillators) and a 3–4s exponential gain decay.
- All data hard-coded inside the component (small, editorial, not worth a JSON round-trip).
- Region-gated (Molise only) — no behaviour for other regions.

## 4. Out of scope
- No changes to other regions, schema, or shared utilities.
- No new dependencies (uses WebAudio + existing shadcn/Tailwind).
