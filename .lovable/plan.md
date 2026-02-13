

## Venice Tribute: "La Serenissima -- Lost & Found"

A bespoke interactive section celebrating Venice's paradox: the most beautiful city in the world that is simultaneously sinking, overcrowding, and dying -- yet remains the most magical and mysterious place on earth.

### Concept: "Sestieri Explorer"

The section opens with a powerful editorial essay about Venice's duality, then transitions into an interactive **Sestieri Explorer** -- Venice is divided into 6 historic districts (sestieri), each with a completely different personality. Users click through each sestiere to discover the "real Venice" beyond San Marco: hidden piazzas, local bacari (wine bars), quiet canals, and the neighborhoods where actual Venetians still live.

This fits the project's pattern of solving a real problem for the audience: **how do you experience Venice authentically when 30 million tourists a year have turned it into a theme park?**

### Structure

**1. Editorial Opening** -- "La Serenissima"
- Rich, poetic 3-4 paragraph essay covering:
  - The Republic's 1,100-year history (697-1797) as the world's greatest maritime power
  - The modern tragedy: population dropped from 175,000 (1950s) to under 50,000 today
  - The 5 EUR entry fee, cruise ship battles, MOSE flood barriers
  - Yet: getting lost in a calle at dusk, stumbling into a campo where an old man plays accordion, the light on the lagoon at golden hour

**2. "Venice by the Numbers"** -- Animated counter strip
- Population: 49,000 (from 175,000)
- Annual tourists: 30,000,000
- Islands: 118
- Bridges: 435
- Years as a Republic: 1,100
- Uses the existing `use-count-up` hook for scroll-triggered animation

**3. Interactive Sestieri Explorer** -- The main interactive piece
Six clickable districts, each revealed with:
- A representative photo
- 2-3 paragraph description of the sestiere's character
- "Caesar's Pick" -- one hidden gem (a bacaro, a church, a view) that tourists miss
- A "vibe" tag (e.g., "Artisan & Authentic", "Grand & Theatrical", "Quiet & Residential")

The six sestieri:
| Sestiere | Character | Hidden Gem Example |
|---|---|---|
| **San Marco** | The Grand Stage -- yes it's touristy, but Piazza San Marco at dawn is still divine | Caffe Florian at 7am, before the crowds |
| **Dorsoduro** | The Art District -- Peggy Guggenheim, Accademia, university life | Campo Santa Margherita at aperitivo hour |
| **San Polo** | The Market Heart -- Rialto fish market, oldest bacari | All'Arco bacaro, standing-room cicchetti |
| **Cannaregio** | The Local Quarter -- Jewish Ghetto, residential canals | Fondamenta della Misericordia at night |
| **Castello** | The Quiet East -- Biennale gardens, naval history, real neighborhoods | Via Garibaldi market street |
| **Santa Croce** | The Gateway -- where locals actually park and live | Giardino Papadopoli, the hidden park |

**4. Closing pull-quote** -- A memorable one-liner about Venice's immortality

### Placement
After `VenetoCultureAlive` and before `CollaboratorFeature` -- it serves as the emotional climax of the cultural narrative before transitioning to practical sections (healthcare, costs, pros/cons).

### Technical Details

**New file:** `src/components/sections/VeniceSerenissima.tsx`
- Self-contained component following existing bespoke section patterns (like `VenetoCultureAlive`)
- Uses `IntersectionObserver` for scroll-triggered reveals (existing pattern)
- Uses `use-count-up` hook for animated statistics
- Sestieri selector: click-to-expand cards with photo, description, and hidden gem
- Decorative SVG: a simplified Lion of St. Mark watermark
- Responsive: stacked on mobile, grid on desktop
- Will need 1 hero image (generated) + 6 sestiere photos (generated)

**Modified file:** `src/pages/RegionPage.tsx`
- Import and render `VeniceSerenissima` in the Veneto conditional block, after `VenetoCultureAlive`

No data file changes needed -- all content is hardcoded in the component (following the pattern of `VenetoWinePourSelector`, `VenetoFoodPillars`, and `VenetoCultureAlive`).

