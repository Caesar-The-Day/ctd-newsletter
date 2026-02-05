import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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
