## Fix Calabria Hero Image + Repair Image Generation Workflow

### Root Cause

The Region Creation Wizard's image step **silently fails** for every region. Edge function logs for the Calabria run show 8 consecutive uploads rejected:

```
ERROR Storage upload error: {"statusCode":"403","error":"Unauthorized","message":"Invalid Compact JWS"}
```

In `supabase/functions/generate-region-images/index.ts` the upload uses:

```ts
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
```

`SUPABASE_ANON_KEY` in this project is the new **publishable key** (`sb_publishable_...`), which the Storage REST API rejects because it is not a JWT. The service-role JWT is required for server-side uploads anyway (RLS on `storage.objects` would block anon writes even if the key parsed).

Worse, the function still returned `{ success: true, images: [] }` with an `errors` array nobody surfaced, so the wizard happily showed "Images generated!" — and `mergeResearchData.ts` fell back to the scaffold default `/images/calabria/hero.jpg`, a path that does not exist on disk or in storage. That is exactly what the database now contains:

```
hero.bannerImage = "/images/calabria/hero.jpg"     ← file missing
storage.objects (region-images, calabria/*) = empty
```

So Calabria's hero is broken, and the same will happen to every future region until the edge function is fixed.

### Fix

**1. `supabase/functions/generate-region-images/index.ts`**
- Switch storage auth to `SUPABASE_SERVICE_ROLE_KEY` (a real JWT, bypasses RLS — correct for a server-side admin task).
- Treat zero successful uploads as a failure: return `success: false` with the collected errors and an HTTP 500, so the wizard surfaces the real problem instead of a green toast.
- Keep current per-image error collection so partial successes still return their URLs.

**2. `src/components/admin/RegionCreationWizard.tsx`**
- After invoking `generate-region-images`, check `data.success` and `data.images.length`. On failure, show an error toast with `data.errors` and do not advance the step. This prevents future "wizard said it worked but nothing exists" incidents.

**3. Regenerate Calabria's hero (and seasonal + town thumbnails) now that uploads work.**
   - Re-invoke the fixed edge function for `regionSlug: "calabria"` using the original prompts. The function will upload to `region-images/calabria/hero.png` and return the public URL `https://jolbywwrnehhwodlgytt.supabase.co/storage/v1/object/public/region-images/calabria/hero.png`.

**4. Patch the existing Calabria row in the `regions` table** so `region_data.region.hero.bannerImage` points at the real storage URL returned in step 3 (currently the broken `/images/calabria/hero.jpg`). Done via a SQL migration scoped to `WHERE slug = 'calabria'`.

### Files Modified

- `supabase/functions/generate-region-images/index.ts` — service-role auth + correct success/failure semantics
- `src/components/admin/RegionCreationWizard.tsx` — surface real errors from the image step
- New migration — update `regions.region_data` for Calabria with the new hero URL

### Verification

- Re-run the function for Calabria and confirm rows appear under `storage.objects` for `region-images/calabria/*`.
- Reload `/calabria` — `HeroParallax` should render the new banner.
- Future region creations: if anything fails in the image step, the wizard will now show a red toast instead of silently storing a broken local path.
