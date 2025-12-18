import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SetActiveRequest {
  slug: string | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json() as SetActiveRequest;

    console.log('[set-active-region] Setting active region:', slug);

    const today = new Date().toISOString().split('T')[0];

    // Return instructions for updating AI instructions
    return new Response(
      JSON.stringify({
        success: true,
        message: slug 
          ? `AI will now work exclusively on "${slug}"`
          : 'No active region set',
        data: {
          activeRegion: slug,
          aiInstructionsUpdate: {
            activeRegion: slug,
            instruction: slug 
              ? `CRITICAL: The ACTIVE region for work is: ${slug}. Focus all content work on this region only. Do NOT modify any other region's data files.`
              : 'No active region set. Ask user which region they want to work on.',
            lastUpdated: today
          }
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[set-active-region] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
