import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ImageRequest {
  regionSlug: string;
  regionName: string;
  heroPrompt: string;
  seasonalPrompts?: {
    spring?: string;
    summer?: string;
    autumn?: string;
    winter?: string;
  };
  generateTownThumbnails?: boolean;
  towns?: Array<{ name: string; prompt?: string }>;
}

interface GeneratedImage {
  type: 'hero' | 'spring' | 'summer' | 'autumn' | 'winter' | 'town';
  name?: string;
  storagePath: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      regionSlug, 
      regionName, 
      heroPrompt, 
      seasonalPrompts = {},
      generateTownThumbnails = false,
      towns = []
    } = await req.json() as ImageRequest;

    console.log('[generate-region-images] Starting for:', { regionSlug, regionName });

    if (!regionSlug || !regionName || !heroPrompt) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: regionSlug, regionName, heroPrompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Use Supabase REST API directly for storage (avoids heavy SDK import)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const generatedImages: GeneratedImage[] = [];
    const errors: string[] = [];

    // Helper: generate a single image via AI
    async function generateImage(prompt: string): Promise<string | null> {
      try {
        const enhancedPrompt = `${prompt}. Ultra high resolution, professional photography quality, cinematic lighting, 16:9 aspect ratio.`;
        console.log('[generate-region-images] Generating image:', enhancedPrompt.substring(0, 100));
        
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image',
            messages: [{ role: 'user', content: enhancedPrompt }],
            modalities: ['image', 'text'],
          }),
        });

        if (!response.ok) {
          console.error('[generate-region-images] Image API error:', response.status);
          return null;
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (!imageUrl) {
          console.error('[generate-region-images] No image in response');
          return null;
        }

        const base64Match = imageUrl.match(/base64,(.+)/);
        return base64Match ? base64Match[1] : null;
      } catch (error) {
        console.error('[generate-region-images] Image generation error:', error);
        return null;
      }
    }

    // Helper: upload image to Supabase storage via REST API
    async function uploadToStorage(base64: string, path: string): Promise<string | null> {
      try {
        const binaryStr = atob(base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        // Upload via REST API
        const uploadUrl = `${supabaseUrl}/storage/v1/object/region-images/${path}`;
        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'image/png',
            'x-upsert': 'true',
          },
          body: bytes,
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error('[generate-region-images] Storage upload error:', errText);
          return null;
        }

        return `${supabaseUrl}/storage/v1/object/public/region-images/${path}`;
      } catch (error) {
        console.error('[generate-region-images] Upload error:', error);
        return null;
      }
    }

    // Generate hero image
    console.log('[generate-region-images] Generating hero image...');
    const heroBase64 = await generateImage(heroPrompt);
    
    if (heroBase64) {
      const heroPath = `${regionSlug}/hero.png`;
      const heroUrl = await uploadToStorage(heroBase64, heroPath);
      if (heroUrl) {
        generatedImages.push({ type: 'hero', storagePath: heroUrl });
        console.log('[generate-region-images] Hero image uploaded:', heroUrl);
      }
    } else {
      errors.push('Failed to generate hero image');
    }

    // Generate seasonal backgrounds
    const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
    for (const season of seasons) {
      const prompt = seasonalPrompts[season];
      if (prompt) {
        console.log(`[generate-region-images] Generating ${season} background...`);
        const base64 = await generateImage(prompt);
        if (base64) {
          const path = `${regionSlug}/seasonal-backgrounds/${season}-landscape.png`;
          const url = await uploadToStorage(base64, path);
          if (url) {
            generatedImages.push({ type: season, storagePath: url });
            console.log(`[generate-region-images] ${season} image uploaded:`, url);
          }
        } else {
          errors.push(`Failed to generate ${season} background`);
        }
      }
    }

    // Generate town thumbnails
    if (generateTownThumbnails && towns.length > 0) {
      for (const town of towns.slice(0, 3)) {
        const townPrompt = town.prompt || `Beautiful aerial view of ${town.name}, Italy, showing historic center, Italian architecture, warm Mediterranean light`;
        console.log(`[generate-region-images] Generating thumbnail for ${town.name}...`);
        const base64 = await generateImage(townPrompt);
        if (base64) {
          const slug = town.name.toLowerCase().replace(/\s+/g, '-');
          const path = `${regionSlug}/towns/${slug}.png`;
          const url = await uploadToStorage(base64, path);
          if (url) {
            generatedImages.push({ type: 'town', name: town.name, storagePath: url });
            console.log(`[generate-region-images] Town image for ${town.name} uploaded:`, url);
          }
        } else {
          errors.push(`Failed to generate thumbnail for ${town.name}`);
        }
      }
    }

    console.log('[generate-region-images] Complete. Generated:', generatedImages.length, 'images');

    return new Response(
      JSON.stringify({
        success: true,
        images: generatedImages,
        errors: errors.length > 0 ? errors : undefined,
        regionSlug,
        generatedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[generate-region-images] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
