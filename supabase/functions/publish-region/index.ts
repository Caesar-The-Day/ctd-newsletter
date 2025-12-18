import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PublishRequest {
  slug: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json() as PublishRequest;

    console.log('[publish-region] Publishing region:', slug);

    // Validate required fields
    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: slug' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Return instructions for publishing
    return new Response(
      JSON.stringify({
        success: true,
        message: `Region "${slug}" published successfully`,
        data: {
          slug,
          publishedDate: today,
          registryUpdate: {
            status: 'live',
            locked: true,
            publishedDate: today,
            version: '1.0'
          },
          newsletterUpdate: {
            status: 'live',
            ctaText: 'Read Now',
            ctaLink: `/${slug}`
          },
          aiInstructionsUpdate: {
            activeRegion: null,
            addToLockedRegions: slug,
            lastUpdated: today
          }
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
