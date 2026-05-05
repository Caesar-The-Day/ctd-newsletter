## Calabria Pizzaz — Three New Components

Building the three highest-impact picks for the Calabria guide. Each is a self-contained section component, slotted into `RegionPage.tsx` behind a `region === 'calabria'` check, following the Puglia/Veneto/Umbria pattern.

### 1. Two Coasts Selector (`CalabriaTwoCoastsSelector.tsx`)

Side-by-side comparison of the Tyrrhenian (west) and Ionian (east) coasts — Calabria's defining geographic split.

- **Layout**: Desktop split-view (two large image cards side-by-side); mobile tab toggle.
- **Each coast card shows**: signature image, vibe sentence, water character (clarity, temp, sand vs pebble), sunset/sunrise orientation, signature towns (Tropea, Scilla, Pizzo for Tyrrhenian; Soverato, Roccella, Capo Rizzuto for Ionian), summer crowd level, best-for persona ("lively & dramatic" vs "quiet & swimmable").
- **Bottom comparison strip**: water temp, beach type, accessibility, August vibe — at-a-glance row.
- Generates 2 hero images (one per coast).

### 2. Sila & Aspromonte — The Mountain Escape (`CalabriaMountainEscape.tsx`)

Counters the "just beaches" stereotype. Shows Calabria's two mountain ranges as a retirement asset (cool summers, pine forests, lakes, lower property prices).

- **Layout**: Two-park comparison cards (Sila National Park, Aspromonte National Park) plus a temperature-comparison visual.
- **Each park card**: elevation range, summer high temp vs nearest coast town (e.g. Camigliatello 22°C vs Crotone 35°C in August), signature features (Sila's lakes, wolves, beech forests; Aspromonte's wild canyons, Greek-speaking villages), nearest hilltop towns, drive time to coast.
- **Visual element**: Simple horizontal "elevation slider" graphic showing sea level → 1,900m with town pins.
- Generates 2 hero images (Sila lake + forest, Aspromonte ridge).

### 3. Reality Check — Southern Italy Logistics (`CalabriaRealityCheck.tsx`)

The pragmatic-honesty panel. Six honest cards addressing real retiree concerns — no postcard escapism.

- **Card layout**: 3×2 grid on desktop, single column on mobile. Each card has icon, headline, plain-English answer, and a "what this means for you" line.
- **Topics**:
  1. **Healthcare reach** — drive times from major coastal towns to specialist hospitals (Catanzaro, Cosenza, Reggio).
  2. **Flight connectivity** — Lamezia Terme (LMC) and Reggio (REG) direct routes; honest note on winter schedule cuts.
  3. **Internet & fiber** — coverage reality by zone (coast vs interior).
  4. **Seismic awareness** — Calabria is a seismic zone; what modern construction standards mean.
  5. **Summer water** — which coastal towns ration, which don't.
  6. **English & expat density** — honest assessment (lower than Puglia/Tuscany).

- Tone matches the existing "retiree honesty" mandate from project memory.

### Placement in `RegionPage.tsx`

Slot all three behind `{region === 'calabria' && ...}` blocks, in this order:

```text
TownsGrid
  └─ CalabriaTwoCoastsSelector       (geographic context)
  └─ CalabriaMountainEscape          (counter-stereotype)
HighlightsShowcase
RecipesInteractive
  └─ CalabriaRealityCheck            (pragmatic close, before ProsCons)
ProsCons
```

### Technical Notes

- All three components are self-contained with hardcoded Calabria-specific data inside the component (matching the Puglia/Veneto pattern — not pulled from `region_data` JSON).
- Generate 4 new images via Nano Banana Pro: `coast-tyrrhenian.jpg`, `coast-ionian.jpg`, `sila-lake.jpg`, `aspromonte-ridge.jpg` — all saved to `public/images/calabria/`.
- Use existing semantic tokens (`text-primary`, `bg-muted`, etc.); no new color classes.
- Use `lucide-react` icons (Waves, Mountain, Stethoscope, Plane, Wifi, Activity, Droplet, MessageSquare).
- No DB migration needed — content lives in the components.
- No new dependencies.

### Out of scope (deferred for later rounds)

Bergamot Coast story, Heritage Mosaic, 'Nduja Heat Lab, Festival Calendar, Borgo dei Briganti map, Riviera dei Cedri citron trail, Mare-Monti day plan builder. Happy to build these in follow-up passes once the first three land.
