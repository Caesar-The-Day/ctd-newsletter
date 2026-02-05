import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface LockRequest {
  slug: string;
  locked: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug, locked } = await req.json() as LockRequest;

    console.log('[region-lock] Updating lock status:', { slug, locked });

    // Validate required fields
    if (!slug || typeof locked !== 'boolean') {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: slug and locked (boolean)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const action = locked ? 'locked' : 'unlocked';

    // Return instructions for updating the registry
    return new Response(
      JSON.stringify({
        success: true,
        message: `Region "${slug}" ${action} successfully`,
        data: {
          slug,
          locked,
          updatedAt: today,
          registryUpdate: {
            [slug]: {
              locked
            }
          },
          aiInstructionsUpdate: {
            lockedRegions: locked ? 'add' : 'remove',
            lastUpdated: today
          }
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[region-lock] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
