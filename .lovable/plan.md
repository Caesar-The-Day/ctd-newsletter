
# Fix: Publish Region Doesn't Update Database

## Problem Identified

When you click "Publish" in the admin panel, the `publish-region` edge function only **returns instructions** but doesn't actually update the database. This is why:

1. **Database still shows**: `status: draft, locked: false` for Umbria
2. **RegionPage.tsx** fetches status from the database via `getRegionRegistry()`
3. **Draft banner** appears because `registryEntry.status === 'draft'`
4. **Admin panel** shows "Draft" for the same reason

## Root Cause

The `supabase/functions/publish-region/index.ts` edge function returns a "success" response but doesn't execute any database UPDATE:

```typescript
// Current code just returns instructions
return new Response(
  JSON.stringify({
    success: true,
    message: `Region "${slug}" published successfully`,
    data: { ... }  // Instructions only, no actual DB update
  })
);
```

## Solution

Update the `publish-region` edge function to:

1. Connect to Supabase with a service role client
2. Execute an UPDATE on the `regions` table
3. Set `status = 'live'`, `locked = true`, `published_date = today`

---

## Implementation

### File to Modify

| File | Change |
|------|--------|
| `supabase/functions/publish-region/index.ts` | Add Supabase client and UPDATE query |

### Updated Edge Function Code

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PublishRequest {
  slug: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json() as PublishRequest;

    console.log('[publish-region] Publishing region:', slug);

    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: slug' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for database access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date().toISOString().split('T')[0];

    // UPDATE the regions table to set status to 'live' and lock the region
    const { data, error } = await supabase
      .from('regions')
      .update({
        status: 'live',
        locked: true,
        published_date: today,
        version: '1.0',
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('[publish-region] Database update failed:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[publish-region] Successfully published:', data);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Region "${slug}" published successfully`,
        data: {
          slug,
          publishedDate: today,
          status: 'live',
          locked: true,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[publish-region] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## What This Fixes

1. **Database Update**: Executes `UPDATE regions SET status='live', locked=true, published_date='2026-01-27' WHERE slug='umbria'`
2. **Draft Banner Removed**: `RegionPage.tsx` will fetch `status: 'live'` and skip the draft banner
3. **Admin Panel Correct**: Shows "LIVE" badge instead of "DRAFT"
4. **Region Locked**: Prevents accidental modifications to published content

---

## Post-Fix Action

After deploying the updated edge function, you'll need to click "Publish" again in `/admin/regions` for Umbria to trigger the actual database update.

Alternatively, I can also execute a direct database UPDATE to fix Umbria immediately without re-publishing.
