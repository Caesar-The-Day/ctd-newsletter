
## Plan: Replace Featured Towns on Veneto Page with Padua, Vicenza, and Treviso

### Current State
The `/veneto` page currently has a "Featured Towns" section (`public/data/regions/italy/veneto.json` lines 410-450) with featured town entries. The TownsFeatured component displays these three towns in a 3-column grid with:
- Town photo and image gallery
- Summary text
- Full description (read more modal)
- Map links
- Optional external links
- 7% tax incentive badge support

### User's Request
Replace the featured towns with three specific cities and their comprehensive editorial descriptions:
1. **Padua** — "The grown-up choice" (intellectual depth, healthcare, infrastructure)
2. **Vicenza** — Palladio country (refined, wealthy, structured, proportional)
3. **Treviso** — Prosecco capital and "Little Venice" (stylish but grounded, residential)

Each town has a rich, multi-paragraph narrative highlighting:
- Opening positioning statement
- Character and atmosphere
- Practical advantages (healthcare, transport, economy, walkability)
- Local vibe descriptor
- Realities to consider
- Who it works for

### Implementation Approach

**File to Update:** `public/data/regions/italy/veneto.json` (lines 410-450, the "featured" array)

**Data Structure** (following TownsFeatured component interface):
```
{
  "id": string,           // unique identifier
  "name": string,         // town name
  "bestFor": string,      // one-line positioning (badge on card)
  "photo": string,        // hero/fallback image path
  "summary": string,      // short teaser (2-3 sentences)
  "fullDescription": string,  // multi-paragraph narrative (split by \n\n for modal)
  "mapUrl": string,       // Google Maps link
  "gallery": string[],    // optional image array for carousel
  "links": [ { "label": string, "href": string } ], // optional external links
  "eligible7Percent": boolean // optional 7% tax badge
}
```

**Three New Featured Town Entries:**

1. **Padua** (replace current or add)
   - `id`: "padua"
   - `name`: "Padua"
   - `bestFor`: "The Grown-Up Choice"
   - `summary`: "One of Italy's oldest university cities — intellectual depth, hospitals that function, and steady young energy. The historic center is walkable, arcades protect you from weather, real neighborhoods outside the core."
   - `fullDescription`: User's 4-paragraph narrative structured as:
     - Opening: "Padua is the grown-up choice..."
     - Infrastructure: "What works:" section (healthcare, rail, flat terrain, airport access)
     - Vibe: "Practical elegance. Educated. Efficient. Not flashy."
     - Realities: Po Valley humidity, fog, higher prices than expected
     - Conclusion: "Padua makes sense if..."
   - `mapUrl`: "https://maps.google.com/?q=Padua+Italy"
   - `photo`: "/images/veneto/hero.jpg" (placeholder, as Veneto directory lacks specific town images)
   - `gallery`: [] (empty until specific images added)

2. **Vicenza** (replace or add)
   - `id`: "vicenza"
   - `name`: "Vicenza"
   - `bestFor`: "Palladio & Proportion"
   - `summary`: "Curated but not artificial. Palladio's architecture defines a prosperous, wealthy city with maintained streets, strong services, and refined understatement. Walkable, direct rail connections, strong local economy."
   - `fullDescription`: User's 4-paragraph narrative:
     - Opening: "Vicenza feels curated, but not artificial..."
     - Wealth matters: infrastructure, commerce, services emphasis
     - What works: compactness, rail access, economy, healthcare, manageable size
     - Vibe: "Refined. Understated. Confident."
     - Realities: housing costs, low nightlife, reserved residents
     - Conclusion: "Vicenza works if..."
   - `mapUrl`: "https://maps.google.com/?q=Vicenza+Italy"
   - `photo`: "/images/veneto/hero.jpg"
   - `gallery`: []

3. **Treviso** (replace or add)
   - `id`: "treviso"
   - `name`: "Treviso"
   - `bestFor`: "Prosecco & Authenticity"
   - `summary`: "Venice's authentic sister. Medieval canals, brick arcades at dusk, aperitivo culture without crowds. 30 minutes to Venice by train, close to airport, flat and walkable with strong middle-class economy."
   - `fullDescription`: User's 4-paragraph narrative:
     - Opening: "Treviso is what people imagine Venice might be..."
     - What works: proximity to Venice, airport access, walkability, economic base, Prosecco hills
     - Vibe: "Stylish but grounded. Social. Clean. Slightly polished."
     - Realities: more expensive than smaller towns, suburban sprawl, humid summers
     - Conclusion: "Treviso makes sense if..."
   - `mapUrl`: "https://maps.google.com/?q=Treviso+Italy"
   - `photo`: "/images/veneto/hero.jpg"
   - `gallery`: []

### Technical Details

**Formatting for fullDescription:**
- Join multi-paragraph narratives with `\n\n` to create paragraph breaks
- The TownsFeatured component splits on `\n\n` and maps each segment to a `<p>` tag in the modal
- Preserve the "What works:" and "The vibe:" sections with bold/emphasis using markdown where needed (though the component doesn't process markdown, plain text will work)

**Image Handling:**
- Currently `/public/images/veneto/` directory only has `hero.jpg` and `veneto-hero.jpg`
- Use `/images/veneto/hero.jpg` as placeholder for all three towns' `photo` fields
- Leave `gallery` arrays empty for now (can be populated when specific town images are sourced)
- Consider adding town-specific images later (e.g., `/public/images/veneto/padua.jpg`, etc.)

**No Component Changes Needed:**
- TownsFeatured component already supports the data structure
- No modifications to src/components needed

### Files to Update
- **`public/data/regions/italy/veneto.json`** — Replace lines 410-450 (the featured towns array) with three new featured town objects

### Testing Checklist
- Navigate to `/veneto`
- Verify Featured Towns section renders 3 cards in a 3-column grid
- Click each town card to verify:
  - Hero image displays
  - "bestFor" badge shows correct positioning text
  - Summary text appears
  - "Read More" button opens modal with full description
  - Full description paragraphs display correctly
  - Map links work
- Test on mobile to verify responsive grid layout
