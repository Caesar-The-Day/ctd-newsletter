# Caesar the Day — Regional Newsletter Content Guide

## Overview

This guide walks you through creating a new regional newsletter from the template. Each newsletter follows the same structure (80% consistency) while allowing customization (20% flexibility) to capture each region's unique character.

---

## Quick Start Checklist

Before you begin:
- [ ] Review the existing Piemonte newsletter as a reference example
- [ ] Read this entire guide
- [ ] Gather research materials (tourism sites, cost-of-living data, maps)
- [ ] Collect or commission high-quality images
- [ ] Copy `_template.json` to `regions/{country}/{region-slug}.json`
- [ ] Create image directory: `/public/images/{country}-{region}/`

---

## Content Requirements by Section

### ✅ REQUIRED CONTENT (80% - Core Template)

These sections MUST be included in every regional newsletter:

#### 1. **Region Metadata** (`region.slug`, `title`, `tagline`, etc.)
- **Purpose**: Establishes newsletter identity and SEO foundation
- **Research needed**: Region name, positioning, publication date
- **Image requirements**: 
  - Hero banner (1920x1080px, landscape, striking composition)
  - Author portrait (usually `/images/shared/cesare-boat.jpg`)
- **Writing guidelines**: 
  - Title should be 40-60 characters
  - Tagline should capture essence in 40-80 characters
  - Use consistent voice: sophisticated, honest, slightly irreverent

#### 2. **Editorial Intro** (`region.intro`)
- **Purpose**: Personal welcome, sets tone, establishes authority
- **Structure**: 4-6 paragraphs, 80-150 words each
  1. Opening hook (connection to previous region or seasonal context)
  2. Sensory description (what does it smell/look/feel like?)
  3. Character analysis (what makes this region tick?)
  4. Retiree appeal (why should they care?)
  5. Invitation to explore (transition to content)
- **Voice**: First-person, blend poetry with practicality, honest but inviting
- **Common pitfalls**: 
  - ❌ Too promotional
  - ❌ Generic descriptions that could apply anywhere
  - ✅ Specific, sensory, opinionated

#### 3. **Where: Map & Geography** (`where`)
- **Purpose**: Orients readers geographically
- **Map markers**: 3-6 key towns with coordinates and brief descriptions
- **Tabs**: 
  - Geography (150-250 words on terrain, borders, natural features)
  - Getting There (airports, trains, highways, travel times)
  - Local Transport (buses, metro, car necessity, bike infrastructure)
- **Research sources**: Google Maps, official tourism sites, transport authorities
- **Accuracy critical**: Double-check all coordinates and travel times

#### 4. **Featured Towns** (`towns.featured`)
- **Purpose**: Deep-dive into 3-5 key towns
- **Number**: 3-5 towns (more than 5 dilutes focus)
- **Structure per town**:
  - `bestFor`: 3-6 word summary (e.g., "Services, culture, healthcare access")
  - `summary`: 150-200 words (preview before full description)
  - `fullDescription`: 400-600 words (rich narrative, blend history/culture/practical details)
  - `gallery`: 2-5 additional images
  - `links`: 1-3 external resources (city website, tourism office, hospital)
- **Town selection criteria**:
  - Diverse types (major city, wine town, coastal, mountain, etc.)
  - Represent different cost tiers
  - Appeal to different retiree profiles (urban, rural, cultural, nature)
- **Writing guidelines**:
  - Use storytelling voice
  - Balance romance with practicality
  - Include specific details (street names, neighborhoods, market days)
  - Address infrastructure honestly (hospitals, broadband, car necessity)

#### 5. **Towns Grid** (`towns.grid`)
- **Purpose**: Quick reference for 8-15 additional towns
- **Structure**: Single paragraph per town (120-180 words)
- **Selection**: Cover geographic diversity, different sizes, varied appeals
- **Tone**: More concise than featured towns, but still characterful

#### 6. **Highlights** (`highlights`)
- **Purpose**: Thematic deep-dives into region's best features
- **Standard categories**: Wine, Food, Culture
- **Structure per category**:
  - Title: "CATEGORY — Descriptive Headline"
  - Intro: 200-300 words establishing importance
  - Background image (optional): 1920x1080px parallax image
  - Cards: 3-6 cards per category
- **Card structure**:
  - Title + Subtitle (concrete + evocative)
  - Image (800x800px, square)
  - Description (100-150 words)
  - Links (1-2 external resources)
- **Customization allowed**: Add custom categories (e.g., "Beaches", "Beer", "Hiking") if regionally relevant

#### 7. **Healthcare & Infrastructure** (`healthcare`)
- **Purpose**: Practical overview of medical services, transport, parks
- **Required sub-sections**:
  - 3-6 major hospitals (name, location, specialties, link)
  - 1-3 airports (size, connectivity, distance)
  - 1-3 railway networks
  - 1-3 major highways
  - 2-5 parks or natural areas
  - 3-5 travel time matrices from key towns
  - Emergency numbers and quick reference info
- **Research sources**: Hospital websites, airport authorities, Google Maps, regional transport sites
- **Accuracy critical**: Medical information must be current and correct

#### 8. **Cost of Living Calculator** (`costOfLiving`)
- **Purpose**: Interactive tool showing real monthly costs
- **Town presets**: 3-5 towns at different cost tiers
- **Lifestyle levels**: Modest, Average, High-End
- **Cost categories**: Rent, Utilities, Groceries, Dining, Transport (all monthly, in EUR, for two people)
- **Research sources**: 
  - Numbeo.com (most reliable)
  - Expatistan.com
  - Livingcost.org
  - Local expat forums and Facebook groups
  - Real estate sites for rent data
- **Pro tip**: Cross-reference multiple sources, err on side of caution (slightly higher estimates)
- **Include notes**: Document sources, add context about seasonal variations

#### 9. **Pros & Cons** (`prosCons`)
- **Purpose**: Honest, balanced assessment
- **Structure**:
  - Intro (headline, lead, tradeoff statement)
  - 4-6 pro categories with 2-4 points each
  - 4-6 con categories with 2-3 points each
  - Final Take (conclusion paragraph)
- **Tone**: Honest but not harsh, balanced, helpful
- **Common pitfalls**:
  - ❌ All pros, no real cons (not credible)
  - ❌ Overly negative cons (discouraging)
  - ✅ Specific, honest, contextualized

#### 10. **Closing & Social Sharing** (`closing`)
- **Purpose**: Wrap up, encourage sharing
- **Required fields**:
  - Farewell message
  - Subscribe CTA
  - Share URL (canonical link)
  - Pre-written social messages (Facebook, Threads, Bluesky, WhatsApp, Pinterest)
- **Writing guidelines**: Customize social messages for each region to maximize shareability

---

### 🎨 OPTIONAL CONTENT (20% - Customization)

These sections can be included or omitted based on regional relevance:

#### 1. **Character Slides** (`character`)
- **When to use**: When region has strong visual/atmospheric story to tell
- **Structure**: 2-4 slides with image + caption + atmospheric paragraph
- **Omit if**: Region is straightforward or lacks distinct seasonal/cultural character

#### 2. **Climate Modes** (`climate`)
- **When to use**: When region has significant microclimates (mountains vs coast, etc.)
- **Structure**: 2-4 climate zones with temp ranges and brief notes
- **Omit if**: Region has uniform climate

#### 3. **Collaborator Feature** (`collaborator`)
- **When to use**: When there's a relevant partner/service to feature (language teacher, tour guide, etc.)
- **Control**: Managed by `showCollaborator` feature flag in config
- **Omit if**: No relevant partner available or feature disabled

#### 4. **Wine Quiz** (`wine.quiz`)
- **When to use**: For wine regions with 4+ distinct wine types
- **Structure**: 4-6 personality profiles matching wines
- **Control**: Managed by `showWineQuiz` feature flag
- **Omit if**: Region not known for wine or feature disabled

#### 5. **Recipes** (`recipes`)
- **When to use**: For regions with strong culinary identity
- **Structure**: 4-6 recipes across "Rustic" and "Refined" modes
- **Omit if**: Food culture already covered in Highlights section

#### 6. **Ambient Audio** (`region.hero.ambientAudio`)
- **When to use**: When you have appropriate 30-90 second ambient loop
- **Control**: Managed by `enableAmbientAudio` feature flag
- **Omit if**: No suitable audio or feature disabled

---

## Image Specifications

### Directory Structure
```
/public/images/
  ├── shared/                          (Global assets used across newsletters)
  │   ├── caesartheday-logo.png
  │   ├── cesare-portrait.jpg
  │   ├── cesare-signature.png
  │   ├── cesare-boat.jpg
  │   ├── escape-plan-cover.jpg
  │   ├── 7-percent-icon.png
  │   └── cafe-table-sepia.jpg
  └── {country}-{region}/              (Region-specific images)
      ├── hero-main.jpg
      ├── town-name-hero.jpg
      ├── town-name-thumb.jpg
      ├── wine-topic.jpg
      └── ...
```

### Image Requirements by Type

| Image Type | Dimensions | Format | Notes |
|------------|------------|--------|-------|
| Hero Banner | 1920x1080px | JPG | Landscape, striking composition, optimized <300KB |
| Town Hero | 1200x800px | JPG | Landscape, hero angle, <200KB |
| Town Thumbnail | 600x400px | JPG | Square or landscape, <150KB |
| Map Marker | 400x400px | JPG | Square, recognizable landmark, <100KB |
| Highlight Card | 800x800px | JPG | Square, centered subject, <150KB |
| Background Parallax | 1920x1080px | JPG | Landscape, subtle, <300KB |
| Recipe/Wine | 1200x800px | JPG | Appetizing/attractive, <200KB |
| Gallery Images | 1200x800px | JPG | Varied angles, <200KB each |

### Image Best Practices
- **Optimize all images**: Use TinyPNG or similar before upload
- **Alt text**: Every image must have descriptive alt text (SEO + accessibility)
- **Credits**: Always credit photographers in hero image credit line
- **Consistency**: Maintain similar color grading/style within each newsletter
- **Avoid**: Stock photo clichés, over-processed HDR, generic tourism shots

---

## Writing Guidelines

### Voice & Tone
- **First-person**: Write as Cesare, personal but authoritative
- **Sophisticated**: Educated reader, not condescending
- **Honest**: Don't oversell, acknowledge tradeoffs
- **Specific**: Use concrete details, not generic adjectives
- **Atmospheric**: Engage senses, paint pictures with words
- **Practical**: Balance romance with real information

### Common Mistakes to Avoid
❌ **Too promotional**: "This is the BEST region in ALL of Italy!"
✅ **Balanced**: "Alba is expensive, but if wine is your religion, it's church."

❌ **Generic**: "Beautiful landscapes and friendly people"
✅ **Specific**: "The Langhe hills roll in dusty gold, each slope angled to catch October light"

❌ **Tourist brochure**: "Visit our charming medieval town!"
✅ **Resident perspective**: "The Wednesday market is ritual, not errand"

❌ **All sunshine**: No cons, no challenges
✅ **Honest assessment**: "Making friends takes time — especially without Italian"

### Length Guidelines
- Intro paragraphs: 80-150 words each
- Featured town descriptions: 400-600 words
- Grid town blurbs: 120-180 words
- Highlight intros: 200-300 words
- Highlight card descriptions: 100-150 words

---

## Data Accuracy Requirements

### Critical Data (Must Be Accurate)
- ✅ Map coordinates (verify in Google Maps)
- ✅ Hospital names and links (check official websites)
- ✅ Emergency numbers (verify with government sources)
- ✅ Transport times (cross-reference multiple sources)
- ✅ Cost of living data (use Numbeo + local verification)

### Less Critical (Can Be Estimates)
- Wine descriptions (subjective)
- Cultural characterizations (opinion-based)
- Town descriptions (narrative, not factual)

### Required Citations
- Cost of living notes must list sources
- Hospital/healthcare links must be official
- Transport links must be current

---

## SEO Considerations

### Meta Information
- Each newsletter needs unique meta title and description (defined in HTML)
- Use region name + key appeal in title
- Keep meta description under 160 characters

### Alt Text
- Every image needs descriptive alt text
- Format: "Description of image showing [location/subject]"
- Example: "Vineyard landscape in Alba with autumn fog rolling through Barolo hills"
- Avoid: "Image1.jpg", "DSC_0123"

### Internal Linking
- Link to other newsletters when mentioning nearby regions
- Link to Escape Plan book CTA
- Link to 7% retirement tax info

### URL Structure
- Newsletter URLs: `https://news.caesartheday.com/{region-slug}`
- Keep slugs lowercase, hyphenated, no special characters
- Examples: `piemonte`, `calabria`, `provence-lavender`

---

## Step-by-Step Content Creation Workflow

### Phase 1: Research (1-2 days)
1. Read travel guides, blogs, expat forums about the region
2. Watch YouTube videos about living there
3. Research cost of living on Numbeo, Expatistan
4. Identify 15-20 potential towns
5. Map out geographic diversity
6. Compile list of must-see cultural attractions
7. Research regional wine/food specialties
8. Note any unique challenges or benefits

### Phase 2: Structure (Half day)
1. Copy `_template.json` to new file
2. Select 3-5 featured towns
3. Select 8-15 grid towns
4. Outline highlight categories (Wine/Food/Culture or custom)
5. Identify 3-6 cards per highlight category
6. Determine optional sections to include/exclude

### Phase 3: Writing (3-4 days)
1. Write editorial intro (set tone first)
2. Write featured town descriptions (longest task)
3. Write grid town blurbs
4. Write highlight intros and card descriptions
5. Write pros/cons sections
6. Write healthcare closing and cost intro
7. Write closing messages and social shares
8. Proofread everything

### Phase 4: Data Entry (1 day)
1. Input all coordinates (verify in Google Maps)
2. Input cost of living data (cross-reference sources)
3. Input hospital info (check official links)
4. Input transport times (verify against schedules)
5. Input emergency numbers
6. Add all external links (verify they work)

### Phase 5: Images (1-2 days)
1. Source or commission images
2. Optimize all images (TinyPNG)
3. Organize into correct directory structure
4. Write alt text for every image
5. Upload to `/public/images/{country}-{region}/`
6. Update all image paths in JSON

### Phase 6: QA (Half day)
1. Check all links work
2. Verify all coordinates display correctly on map
3. Test cost calculator with all three lifestyles
4. Proofread all text again
5. Check image loading
6. Validate JSON syntax (use JSONLint)

### Phase 7: Review (1 day)
1. Read entire newsletter start to finish
2. Check tone consistency
3. Verify no factual errors
4. Check SEO (alt text, meta info)
5. Get second pair of eyes if possible

---

## Feature Flags & Section Ordering

### Feature Flags (`/public/data/config/feature-flags.json`)
Control which optional sections appear:
- `showWineQuiz`: Enable/disable wine personality quiz
- `showBeerFeature`: Enable/disable beer section (future use)
- `show7PercentCTA`: Enable/disable 7% tax advantage promotion
- `showCollaborator`: Enable/disable collaborator feature section
- `showBookCTA`: Enable/disable Escape Plan book promotion
- `showRetirementBlueprintCTA`: Enable/disable consultation service CTA
- `enableAmbientAudio`: Enable/disable hero audio
- `enableSeasonalParticles`: Enable/disable particle effects

### Section Ordering (`/public/data/config/section-order.json`)
Customize order of sections if needed (default order usually works well).

---

## Quality Checklist Before Publishing

### Content
- [ ] All required sections included
- [ ] Editorial intro sets strong tone
- [ ] Featured towns have 400-600 word descriptions
- [ ] Grid towns have 120-180 word blurbs
- [ ] Highlight intros provide context
- [ ] All card descriptions are 100-150 words
- [ ] Pros/cons are balanced and honest
- [ ] Cost data is researched and cited
- [ ] Healthcare info is accurate and current
- [ ] Social share messages are customized

### Images
- [ ] All images optimized (<300KB for largest)
- [ ] All images have descriptive alt text
- [ ] Hero image is 1920x1080px
- [ ] All town images are correctly sized
- [ ] Image paths match actual files
- [ ] Credits provided where needed

### Data
- [ ] All coordinates verified in Google Maps
- [ ] All external links tested and working
- [ ] Emergency numbers verified
- [ ] Hospital links are official
- [ ] Cost data sources documented
- [ ] Travel times cross-referenced

### Technical
- [ ] JSON validates (no syntax errors)
- [ ] File named correctly: `{region-slug}.json`
- [ ] Images in correct directory: `/images/{country}-{region}/`
- [ ] Feature flags set appropriately
- [ ] Section order configured (if custom)

### SEO
- [ ] All images have alt text
- [ ] Meta title and description set
- [ ] Internal links to other content
- [ ] ShareUrl is correct
- [ ] Social messages are compelling

---

## Common Pitfalls & Solutions

### Problem: Content Too Generic
**Solution**: Add specific details. Name streets, describe smells, mention specific cafés or markets. Use the journalist's trick: Who, What, When, Where, Why.

### Problem: Cost Data Conflicting
**Solution**: When sources disagree, average them and note the variance in the notes section. Better to acknowledge uncertainty than fake precision.

### Problem: Running Out of Towns
**Solution**: Quality over quantity. 3 great featured towns + 8 solid grid towns beats 5 mediocre + 15 rushed. Focus on diverse, representative examples.

### Problem: Images Don't Match Tone
**Solution**: Avoid stock photos. Commission original photography or source from Unsplash/Pexels with careful curation. Maintain consistent color grading.

### Problem: Too Long or Too Short
**Solution**: Use word counts in this guide. If over, cut redundancy. If under, add specificity (not fluff).

### Problem: Tone Shifts
**Solution**: Write all sections in one sitting if possible. If not, reread previous sections before starting new ones to recalibrate voice.

---

## Support & Resources

- **Template file**: `/public/data/_template.json`
- **Reference example**: `/public/data/regions/italy/piemonte.json`
- **Image directory**: `/public/images/`
- **Questions**: Contact project lead or consult project documentation

---

## Final Note

Creating a regional newsletter is equal parts research, storytelling, and data accuracy. Take your time. The best newsletters balance romance with reality, atmosphere with practicality, and enthusiasm with honesty.

When in doubt, ask: "Would this help someone decide if they could actually live here?"

If the answer is yes, you're on the right track.

Buon lavoro! 🍷
