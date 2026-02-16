

## Update Veneto in newsletter-index.json and Generate a New Thumbnail

### 1. Update `newsletter-index.json` -- Veneto Entry (lines 63-73)

Update the Veneto newsletter object with:

- **status**: `"live"` (so even the static fallback is correct)
- **thumbnail**: `/images/veneto/veneto-hero.jpg` (matches the actual hero image, replacing the wrong Umbria thumbnail)
- **subtitle**: `"The European Crossroads"` (new field, used by the featured hero card)
- **description**: A full editorial description matching the tone of the other newsletters. Something like:

> *"Italy's economic engine hiding in plain sight: Venice draws sixty million tourists a year, but the smart ones look past the lagoon to Padova's world-class hospitals, Vicenza's Palladian elegance, and Treviso's quiet residential charm. Prosecco hills, Dolomite ski runs, Adriatic beaches, and a high-speed rail network that puts Munich closer than Rome. This is the region that works."*

- **ctaText**: `"Read Newsletter"`
- **ctaLink**: `"/veneto"`
- Remove `expectedDate`

### 2. Generate a New Veneto Thumbnail Image

Use the `generate-region-images` edge function (already deployed) to create a cinematic wide shot -- Venice lagoon in the foreground with Dolomite peaks visible on the horizon. Upload it to storage and update the thumbnail path in the JSON.

Alternatively, since we already have `/images/veneto/veneto-hero.jpg` and `/images/veneto/hero.jpg` available, we can simply point to one of those existing images. If you want a brand new Venice+Dolomites composite shot, that will be generated via the AI image generation endpoint and saved as a new file.

**Recommended approach**: Generate a new hero-quality image with the prompt "Cinematic wide panoramic shot of Venice's Grand Canal and Santa Maria della Salute basilica in warm golden light, with snow-capped Dolomite mountain peaks visible on the distant horizon, Italian landscape photography, 16:9 aspect ratio" and save it as the Veneto thumbnail. Then update both the `thumbnail` in the newsletters array and use it as the `heroImage` for the featured card.

### Files Modified

1. `public/data/newsletter-index.json` -- Update Veneto entry with live status, proper description, subtitle, correct thumbnail path
2. Potentially a new image file if generating a Venice+Dolomites shot (uploaded to `/public/images/veneto/`)
