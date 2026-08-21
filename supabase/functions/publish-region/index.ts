import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { z } from "npm:zod@3.23.8";
import { corsHeaders, jsonResponse, requireAdmin } from "../_shared/auth.ts";

const BodySchema = z.object({
  slug: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const auth = await requireAdmin(req);
    if (auth instanceof Response) return auth;

    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return jsonResponse({ success: false, error: 'Invalid request body' }, 400);
    }
    const { slug } = parsed.data;

    console.log('[publish-region] Publishing region:', slug);

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
      return jsonResponse({ success: false, error: 'Failed to publish region' }, 500);
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
