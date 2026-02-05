

# Fix: Complete Wizard Audit and Deployment

## Issues Found

### Issue 1: `generate-region-theme` is NOT deployed (CRITICAL - the current failure)
The function code exists but returns 404. No logs exist for it. This is the direct cause of the "Failed to fetch" error on Step 3 (Theme Generation). It needs to be deployed.

### Issue 2: `generate-region-images` is NOT deployed
Also returns 404 and has no logs. Step 4 (Image Generation) will fail the same way. Additionally, the image model name `google/gemini-2.5-flash-image-preview` is not in the list of supported models. The correct model is `google/gemini-2.5-flash-image` or `google/gemini-3-pro-image-preview`. The function needs to be fixed and deployed.

### Issue 3: `scaffold-region` is NOT deployed
Returns 404. Step 5's "Create Region" button calls this and will fail. Despite being "deployed" in a prior conversation, it clearly didn't stick. Needs redeployment.

### Issue 4: CORS headers are incomplete
All edge functions use a shortened CORS header list:
```
'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
```
The Supabase JS SDK sends additional headers that need to be allowed:
```
'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version'
```
Missing these headers can cause preflight (OPTIONS) failures in the browser, which manifest as "Failed to fetch" errors. This needs to be fixed in ALL edge functions.

### Issue 5: Image model name is wrong
In `generate-region-images/index.ts`, the model is set to `google/gemini-2.5-flash-image-preview` which doesn't exist. The correct name is `google/gemini-2.5-flash-image`.

## Fix Plan

### Step 1: Fix CORS headers in all 5 edge functions
Update the `corsHeaders` constant in each function to include the full set of allowed headers:
- `generate-region-theme/index.ts`
- `generate-region-images/index.ts`
- `research-region/index.ts`
- `scaffold-region/index.ts`
- `region-lock/index.ts`

(Plus `publish-region`, `set-active-region` for consistency)

### Step 2: Fix image model name
Change `google/gemini-2.5-flash-image-preview` to `google/gemini-2.5-flash-image` in `generate-region-images/index.ts`.

### Step 3: Deploy all edge functions
Deploy every function that currently returns 404:
- `generate-region-theme`
- `generate-region-images`
- `scaffold-region`
- `publish-region`
- `region-lock`
- `set-active-region`

### Step 4: Verify deployment with a test call
Call `generate-region-theme` directly to confirm it responds with a 200 instead of 404.

## What This Fixes

After this, the entire wizard flow will work end-to-end:
1. Step 1 (Identity) -- no backend calls, already works
2. Step 2 (Research) -- `research-region` is already deployed and working
3. Step 3 (Theme) -- `generate-region-theme` will be deployed and CORS-fixed
4. Step 4 (Images) -- `generate-region-images` will be deployed with correct model name
5. Step 5 (Create) -- `scaffold-region` will be deployed and CORS-fixed

## Technical Details

### CORS Header Fix (applied to all functions)
```text
Before:
'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'

After:
'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version'
```

### Image Model Fix
```text
Before: model: 'google/gemini-2.5-flash-image-preview'
After:  model: 'google/gemini-2.5-flash-image'
```

### Files Modified
- `supabase/functions/generate-region-theme/index.ts` (CORS)
- `supabase/functions/generate-region-images/index.ts` (CORS + model name)
- `supabase/functions/research-region/index.ts` (CORS)
- `supabase/functions/scaffold-region/index.ts` (CORS)
- `supabase/functions/region-lock/index.ts` (CORS)
- `supabase/functions/publish-region/index.ts` (CORS)
- `supabase/functions/set-active-region/index.ts` (CORS)

### Deployment
All 7 functions redeployed after code fixes.
