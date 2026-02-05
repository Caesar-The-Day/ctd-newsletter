

# Fix Image Generation and Create Veneto Hero Image

## Root Cause

The image generation AI works fine -- the storage upload is what fails. The `generate-region-images` function uses `SUPABASE_SERVICE_ROLE_KEY` to upload to the `region-images` bucket, but that key is invalid ("Invalid Compact JWS" error in logs). Meanwhile, the `region-images` bucket has **zero storage policies**, so even the anon key can't upload.

The `og-images` bucket works because it has 4 permissive policies (SELECT, INSERT, UPDATE, DELETE for public). The `region-images` bucket has none.

## Fix Plan

### Step 1: Add Storage Policies for `region-images` Bucket

Create the same 4 policies that `og-images` has:
- Public read access (SELECT)
- Allow upload (INSERT)  
- Allow update (UPDATE)
- Allow delete (DELETE)

This is a database migration with 4 policy statements.

### Step 2: Fix `generate-region-images` to Use Anon Key

Change the upload function to use `SUPABASE_ANON_KEY` (which is always valid in Lovable Cloud) instead of `SUPABASE_SERVICE_ROLE_KEY` (which is broken). With the new storage policies from Step 1, the anon key will have permission to upload.

### Step 3: Redeploy and Call the Function

Deploy the fixed function and call it with a Veneto hero prompt to generate the image.

### Step 4: Update Veneto's Database Record

Change `bannerImage` from `/images/veneto/hero.jpg` (doesn't exist) to the public storage URL of the generated image.

## What This Fixes

- Veneto gets a real AI-generated hero image immediately
- All future region image generation will work (the storage auth issue is permanently resolved)
- The wizard's Step 4 (Image Generation) will no longer fail silently

## Technical Details

### Storage Policy Migration

```text
4 RLS policies on storage.objects for bucket_id = 'region-images':
  - SELECT: Allow public read
  - INSERT: Allow public upload  
  - UPDATE: Allow public update
  - DELETE: Allow public delete
```

### Edge Function Change

```text
File: supabase/functions/generate-region-images/index.ts

Before: const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
After:  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
```

### Hero Image Prompt

The function will be called with a prompt like: "A breathtaking golden-hour photograph of the Veneto countryside with rolling hills, vineyards, and distant Dolomite peaks, warm Mediterranean light"

### Database Update

```text
UPDATE regions 
SET region_data = jsonb_set(region_data, '{region,hero,bannerImage}', '"<storage-url>"')
WHERE slug = 'veneto'
```

