

## Create Veneto Climate Snapshot

### What We're Building
A full `veneto-climate.json` file following the proven Puglia/Piemonte pattern, with 4 climatically diverse cities and all 12 months of rich narrative content from your copy.

### The 4 Cities (Climate Diversity)

| City | Type | Why |
|------|------|-----|
| **Cortina d'Ampezzo** | Alpine/Dolomites | Mountain premium lifestyle, ski culture, dramatic temperature swings |
| **Jesolo** | Adriatic coast | Beach town, maritime influence, milder winters |
| **Padua** | Po Valley inland | Fog, humidity, represents the "real" Veneto climate most retirees experience |
| **Verona** | Western foothills | Lake Garda influence, opera city, slightly warmer than Padua |

### Data Structure
Each month includes:
- Per-city weather: `tempLow`, `tempHigh`, `rainfall`, `sunHours`, `lightQuality`
- `tooltip` -- the mood line (e.g., "Cozy. Alpine. Fireplace energy.")
- `narrative` -- the "Life on the Ground" typewriter text from your copy
- `culturalEvent` -- the headline event with URL
- `visualCue` -- atmospheric image prompt
- `season` -- drives background colors and particle effects

### Intro Copy
- **Headline**: "Four Climates, One Region"
- **Tagline**: "Sea, Valley, Foothills, Alps -- All Within an Hour"
- **Paragraphs**: Editorial copy about Veneto's climate diversity -- how Cortina and Jesolo exist in the same region but feel like different countries
- **hoverQuote**: "In Veneto, you don't check the weather. You choose your altitude."
- **ctaText**: "Slide through the seasons and feel what life is actually like, month by month."

### Implementation
1. **Create file**: `public/data/regions/italy/veneto-climate.json` with all 12 months, 4 cities, intro, and best months data
2. **No code changes needed** -- the `ClimateSnapshot` component already:
   - Loads from `/data/regions/italy/{region}-climate.json`
   - Renders dynamic city toggle buttons from `regions` object
   - Shows narrative typewriter panel
   - Displays cultural events with links
   - Handles seasonal backgrounds (falls back to Piemonte palette for unknown regions)

### Monthly Data Highlights

Each month maps your copy into the structured format:

- **January**: Cortina -8/2C (alpine cold), Jesolo 2/9C (mild coast), narrative about ski season and post-holiday Venice
- **February**: Carnevale di Venezia as headline event, "Dramatic. Theatrical. Photogenic chaos."
- **March**: Transitional, vineyard pruning in Valpolicella
- **April**: Vinitaly in Verona headline, hiking season begins
- **May**: "Balanced. This is prime livability." -- Festa della Sensa
- **June**: Verona Opera Festival opens, beach season
- **July**: Peak opera, "Long dinners. Late sunsets. Aperol at 9:30pm."
- **August**: Ferragosto, "Holiday mode. Slower commerce."
- **September**: "The Veneto sweet spot." -- grape harvest
- **October**: Truffle and chestnut festivals, "Intellectual. Earthy. Refined."
- **November**: Foggy Po Valley, Festa della Salute
- **December**: Christmas markets, La Fenice opera, "Elegant. Old-world festive."

### Best Months Data
Will include scouting and moving recommendations:
- **Scouting**: April, May, September, October (best weather, events to experience, not overrun)
- **Moving**: March, April, September (mild weather, bureaucracy offices open, rental market active)

### Files Changed
- **Created**: `public/data/regions/italy/veneto-climate.json` (new file, ~250 lines)
- **Code**: No changes -- purely data-driven

### Verification
Navigate to `/veneto`, scroll to Climate Snapshot section:
- 4 city toggle buttons appear (Cortina, Jesolo, Padua, Verona)
- Monthly slider works with animated temperature counts
- "Life on the Ground" narrative panel shows typewriter text for each month
- Cultural events display with clickable links
- Seasonal background colors shift as you slide through months
- Best Months toggle highlights recommended months
