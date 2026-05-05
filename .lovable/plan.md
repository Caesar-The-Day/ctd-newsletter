## Calabria Visual Upgrade Plan

Four focused upgrades to elevate the Calabria region page. All work touches **only Calabria** (active, unlocked region) — no shared component changes that would affect other regions.

---

### 1. Hero looping video (Tropea cliffs at sunset)

`HeroParallax.tsx` currently only renders an `<img>`. We'll extend it to optionally render a looping muted `<video>` when the region data provides `region.hero.heroVideo`.

- Generate a hero still (`tropea-cliffs-sunset.jpg`) via Nano Banana Pro and use a subtle Ken-Burns CSS transform (slow zoom + pan) to simulate the cinematic feel of a video clip without needing real footage. Real MP4 generation isn't supported by our image gateway, and the existing Piemonte `vineyard-winter.mp4` isn't actually wired up in the codebase — so we'll match that *intent* with a high-quality cinematic still + Ken Burns.
- Add prop `heroVideo?: string` to `HeroParallax` plumbing; if falsy (other regions), behavior is unchanged. Calabria gets the new still + Ken Burns layer.
- Update Calabria's `region.hero.bannerImage` in the DB to the new sunset image.

### 2. Tab background imagery for `HighlightsShowcase`

Each tab (Wine / Food / Culture) renders `data.backgroundImage` at 10% opacity behind the intro. Calabria's three values are currently empty strings.

- Generate three atmospheric tile/texture backgrounds (1600×900, faded edges):
  - `bg-wine.jpg` — Cirò terracotta amphorae & vine shadows
  - `bg-food.jpg` — Tropea fishing boats at dawn with chili strings
  - `bg-culture.jpg` — Caltagirone-style majolica ceramic pattern in terracotta + sea-blue
- Update the Calabria `region_data.highlights.{wine,food,culture}.backgroundImage` fields via SQL migration (jsonb_set).

### 3. "Voices from Calabria" pull-quote section

A new lightweight component placed between `HighlightsShowcase` and `CollaboratorFeature` (Calabria-only, conditional like the other Calabria sections).

- `CalabriaVoices.tsx`: editorial pull-quote treatment with a portrait, quote in serif italic, attribution (name, town, role), warm background using the new palette. Three rotating quotes (static, no carousel state for SSR-safety) shown as a 3-up grid on desktop, stacked on mobile. Example voices: a returning emigrant in Tropea, a Sila farmer, a Reggio fishmonger.
- Generate three editorial portrait stills (`voice-tropea.jpg`, `voice-sila.jpg`, `voice-reggio.jpg`) — character-driven, warm light, candid framing.

### 4. Color palette pass — terracotta / sea-blue / peperoncino / bergamot

The current AI-generated theme is blue-dominant (primary h:204) with a green accent (h:105) — wrong for Calabria. Replace with a hand-tuned palette:

| Token | HSL | Role |
|---|---|---|
| primary | `14 65% 48%` | Terracotta (CTAs, links) |
| secondary | `198 55% 45%` | Sea-blue (Tyrrhenian) |
| accent | `8 78% 52%` | Peperoncino red |
| muted | `42 55% 88%` | Bergamot cream |
| background | `38 45% 97%` | Warm off-white |
| foreground | `15 30% 18%` | Deep umber |

- Update `region_data.generatedTheme` for Calabria via SQL migration. The existing injection logic in `RegionPage.tsx` (lines 116-191) will pick it up automatically — no code changes needed there.
- Also set `gradients.hero` to a terracotta→sea-blue diagonal and `gradients.warm` to peperoncino→bergamot.

---

### Files / DB changes

**New files**
- `src/components/sections/CalabriaVoices.tsx`
- `public/images/calabria/tropea-cliffs-sunset.jpg`
- `public/images/calabria/bg-wine.jpg`
- `public/images/calabria/bg-food.jpg`
- `public/images/calabria/bg-culture.jpg`
- `public/images/calabria/voice-tropea.jpg`
- `public/images/calabria/voice-sila.jpg`
- `public/images/calabria/voice-reggio.jpg`

**Edited files**
- `src/components/sections/HeroParallax.tsx` — add optional Ken-Burns layer
- `src/pages/RegionPage.tsx` — render `<CalabriaVoices />` conditionally for `region === 'calabria'`

**DB migration (Calabria row only)**
- Replace `region_data.generatedTheme` with the new palette
- Set `region_data.region.hero.bannerImage` to the new sunset image
- Set `region_data.highlights.{wine,food,culture}.backgroundImage` to the new tab backgrounds

No changes to locked regions, shared schemas, or other components.