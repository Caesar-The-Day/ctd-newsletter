
## Add Veneto-Specific Seasonal Background Images

### Current State
The `ClimateSnapshot.tsx` component loads seasonal background images from region-specific paths:
- Piemonte: `/images/piemonte/seasonal-backgrounds/{season}-landscape.jpg`
- Puglia: `/images/puglia/seasonal-backgrounds/{season}-landscape.jpg`
- Umbria: `/images/umbria/seasonal-backgrounds/{season}-landscape.jpg`

When the component loads the Veneto region, it falls back to Piemonte backgrounds because there's no `getSeasonalBackgrounds()` or `getSeasonalImages()` handling for "veneto". The `public/images/veneto/` directory currently only contains hero images, not seasonal backgrounds.

### What Needs to Happen
1. **Create Veneto seasonal background directory**: `public/images/veneto/seasonal-backgrounds/`
2. **Generate 4 seasonal images** matching Veneto's climate diversity:
   - **Winter**: Snow-capped Dolomites with fog in valleys (matches Cortina alpine + Po Valley fog narrative)
   - **Spring**: Budding Prosecco vineyards with fresh green (matches vineyard pruning and Valpolicella themes)
   - **Summer**: Warm Adriatic coast or lake with mountains in distance (matches beach season + alpine backdrop)
   - **Autumn**: Grape harvest vineyards in golden light with possible larch tree colors (matches "grape harvest in Valpolicella and Prosecco DOCG hills")

3. **Update `ClimateSnapshot.tsx`** to handle Veneto:
   - Add a `seasonalBackgroundsVeneto` constant with Veneto's palette (cooler alpine tones + warm valley tones)
   - Add a `seasonalImagesVeneto` constant pointing to the new image paths
   - Update `getSeasonalBackgrounds()` to return Veneto palette when region === "veneto"
   - Update `getSeasonalImages()` to return Veneto images when region === "veneto"

### Image Generation Strategy
Using the Lovable AI image generation API (google/gemini-3-pro-image-preview for higher quality), we'll generate 4 images that visually represent the Veneto climate data and narrative:

**Winter** (Cortina -8/2°C, Padua -1/7°C):
Prompt: "Snow-covered Dolomite peaks with sharp alpine light, fog sitting thick in the Po Valley below, creating a stark altitude contrast. Cold, crisp mountain air. Professional landscape photography, 16:9, ultra high resolution."

**Spring** (March/April, vineyard season):
Prompt: "Fresh green Prosecco vineyards in early spring with budding vines, limestone hills of Valdobbiadene in the background, warm afternoon light breaking through occasional clouds, professional landscape photography, 16:9, ultra high resolution."

**Summer** (Warm, sociable):
Prompt: "Warm Adriatic beach at Jesolo or similar, with sunlit sand and turquoise water, Dolomite peaks visible in distant haze, late golden hour light, beach umbrellas and Mediterranean warmth, professional landscape photography, 16:9, ultra high resolution."

**Autumn** (Harvest season):
Prompt: "Golden-hour vineyard landscape during grape harvest in Valpolicella, vines heavy with purple grapes, warm amber light on terracotta soil, Lessinia foothills in background with hints of larch tree colors, professional landscape photography, 16:9, ultra high resolution."

### Files to Change
- **Create**: `public/images/veneto/seasonal-backgrounds/winter-landscape.jpg`
- **Create**: `public/images/veneto/seasonal-backgrounds/spring-landscape.jpg`
- **Create**: `public/images/veneto/seasonal-backgrounds/summer-landscape.jpg`
- **Create**: `public/images/veneto/seasonal-backgrounds/autumn-landscape.jpg`
- **Modify**: `src/components/sections/ClimateSnapshot.tsx` (add ~30 lines for Veneto handling)

### Technical Details

**New constants in ClimateSnapshot.tsx:**
```typescript
const seasonalBackgroundsVeneto = {
  winter: "from-slate-100/40 via-blue-50/30 to-cyan-100/40 dark:from-slate-900/40 dark:via-blue-950/30 dark:to-cyan-900/40",
  spring: "from-green-50/40 via-emerald-50/30 to-lime-100/40 dark:from-green-950/40 dark:via-emerald-950/30 dark:to-lime-950/40",
  summer: "from-amber-50/40 via-yellow-50/30 to-orange-100/40 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-orange-950/40",
  autumn: "from-orange-50/40 via-amber-50/30 to-yellow-100/40 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-yellow-950/40",
};

const seasonalImagesVeneto = {
  winter: "/images/veneto/seasonal-backgrounds/winter-landscape.jpg",
  spring: "/images/veneto/seasonal-backgrounds/spring-landscape.jpg",
  summer: "/images/veneto/seasonal-backgrounds/summer-landscape.jpg",
  autumn: "/images/veneto/seasonal-backgrounds/autumn-landscape.jpg",
};
```

**Updated `getSeasonalBackgrounds()` function:**
```typescript
const getSeasonalBackgrounds = () => {
  if (region === "puglia") return seasonalBackgroundsPuglia;
  if (region === "umbria") return seasonalBackgroundsUmbria;
  if (region === "veneto") return seasonalBackgroundsVeneto;
  return seasonalBackgroundsPiemonte;
};

const getSeasonalImages = () => {
  if (region === "puglia") return seasonalImagesPuglia;
  if (region === "umbria") return seasonalImagesUmbria;
  if (region === "veneto") return seasonalImagesVeneto;
  return seasonalImagesPiemonte;
};
```

### Verification
Navigate to `/veneto` and scroll to the Climate Snapshot section:
- As you slide through the months (January → February → ... → December), the background image should shift through winter snow, spring vineyards, summer warmth, and autumn golden light
- The seasonal gradient overlay should match the image mood (cooler in winter, warmer in summer)
- Seasonal particles (snow in winter, floating leaves in autumn) should align with the visual
- The "Life on the Ground" narrative should feel reinforced by the background imagery

