
## Update Veneto Editorial Introduction Section

### Current State
The Veneto region data is stored in the Supabase `regions` table with a `region_data` JSONB column. The introduction section currently has:
- **Headline**: "Bentornati, my friends. Let's talk about Veneto."
- **Paragraphs**: 4 long, flowery paragraphs describing arrival, sensory details, character/culture, and practical benefits
- **Byline**: "— Cesare"
- **Portrait & Signature**: Already configured

### Requested Changes
Replace the introduction text with a new, more direct approach:
- **New Headline**: "Bentornati. Let's talk about Veneto." (shorter, punchier)
- **New Paragraphs**: 7 paragraphs with a different tone:
  1. Opening hook about practicality vs nostalgia
  2. Historical context (Venetian Republic, Palladio, Verona)
  3. Geographic diversity (sea, mountains, wine, rail)
  4. Economic engine/infrastructure theme
  5. Blending beauty with competence
  6. Elegance and efficiency
  7. Final appeal

### Technical Approach
1. **Database Update**: Use SQL to update the JSONB path `region_data->'region'->'intro'->paragraphs` in the `regions` table for the Veneto slug
2. **No Code Changes**: The `EditorialIntro` component already renders whatever paragraphs are in the data—it's purely data-driven
3. **Verification**: Navigate to `/veneto` page and verify the introduction section displays the new text with proper animations

### Implementation Details
```sql
UPDATE regions 
SET region_data = jsonb_set(
  region_data, 
  '{region,intro,paragraphs}',
  '[
    "Bentornati. Let''s talk about Veneto.",
    "This isn''t crumbling-villa nostalgia. Veneto runs. It has for centuries.",
    "The Venetian Republic once dominated global trade. Palladio reshaped architecture. Verona still stages opera in a Roman arena like it''s no big deal. Culture here isn''t curated for tourists; it''s embedded in daily life.",
    "Venice gets the postcards. The mainland gets the infrastructure. Padua, Vicenza, Treviso — prosperous, polished, and deeply livable. Vineyards roll through Valpolicella. Prosecco hills hum north of Treviso. The Adriatic stretches east. The Dolomites rise north. In a single region you get sea, mountains, wine country, and high-speed rail.",
    "And yes, let''s be practical. Veneto is one of Italy''s economic engines. Healthcare is strong. Roads work. Trains run. Airports connect you to the rest of Europe without drama. This is Italy with systems intact.",
    "If you''re looking for a retirement that blends beauty with competence — culture without chaos — Veneto deserves a hard look.",
    "It''s elegant. It''s efficient. And it knows exactly what it is."
  ]'::jsonb
)
WHERE slug = 'veneto';
```

The UPDATE statement modifies only the `paragraphs` array while preserving the existing headline, byline, portrait, and signature values.

