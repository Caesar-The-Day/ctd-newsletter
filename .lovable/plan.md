

# Fix: Generate Color Theme Edge Function

## Root Cause

Two issues are causing the failure:

1. **Function not deployed** -- The `generate-region-theme` function exists in code but was never deployed. Calls return a 404, which the Supabase client surfaces as "Failed to fetch."

2. **Same JSON parsing bug as research-region** -- The function does not request structured JSON output from the AI, so the model wraps its response in markdown code fences (` ```json ... ``` `). The naive regex `aiResponse.match(/\{[\s\S]*\}/)` can fail on these responses.

## Fix (2 changes in 1 file + deploy)

### File: `supabase/functions/generate-region-theme/index.ts`

**Change A -- Add `response_format` to force pure JSON output:**

In the API request body (around line 115-121), add:
```typescript
response_format: { type: 'json_object' },
```

**Change B -- Strip markdown fences before parsing (defense in depth):**

Replace the parsing block (lines 154-165) with robust extraction that:
- Trims whitespace
- Strips ` ```json ` / ` ``` ` wrappers
- Adds diagnostic logging on failure (first 500 + last 200 chars)

### Deploy

Deploy the updated `generate-region-theme` function so it's live and callable (currently returns 404).

## Technical Details

```text
Current flow (broken):
  Wizard --> POST /generate-region-theme --> 404 (not deployed)

Fixed flow:
  Wizard --> POST /generate-region-theme
         --> AI API (with response_format: json_object)
         --> Strip markdown fences (safety net)
         --> JSON.parse
         --> Return theme palette
```

No client-side changes are needed -- `RegionCreationWizard.tsx` already handles the response correctly.
