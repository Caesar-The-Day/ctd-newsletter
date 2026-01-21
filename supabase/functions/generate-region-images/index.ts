import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  base64: string;
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

    // Initialize Supabase client for storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const generatedImages: GeneratedImage[] = [];
    const errors: string[] = [];

    // Helper function to generate a single image
    async function generateImage(prompt: string, dimensions: { width: number; height: number }): Promise<string | null> {
      try {
        const enhancedPrompt = `${prompt}. Ultra high resolution, professional photography quality, cinematic lighting, 16:9 aspect ratio.`;
        
        console.log('[generate-region-images] Generating image with prompt:', enhancedPrompt.substring(0, 100));
        
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
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

        // Extract base64 from data URL
        const base64Match = imageUrl.match(/base64,(.+)/);
        return base64Match ? base64Match[1] : null;
      } catch (error) {
        console.error('[generate-region-images] Image generation error:', error);
        return null;
      }
    }

    // Helper to upload image to storage
    async function uploadToStorage(base64: string, path: string): Promise<string | null> {
      try {
        // Decode base64 to binary
        const binaryStr = atob(base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        // Check if bucket exists, create if not
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === 'region-images');
        
        if (!bucketExists) {
          await supabase.storage.createBucket('region-images', { public: true });
        }

        // Upload to storage
        const { data, error } = await supabase.storage
          .from('region-images')
          .upload(path, bytes, {
            contentType: 'image/png',
            upsert: true
          });

        if (error) {
          console.error('[generate-region-images] Storage upload error:', error);
          return null;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('region-images')
          .getPublicUrl(path);

        return urlData.publicUrl;
      } catch (error) {
        console.error('[generate-region-images] Upload error:', error);
        return null;
      }
    }

    // Generate hero image (priority)
    console.log('[generate-region-images] Generating hero image...');
    const heroBase64 = await generateImage(heroPrompt, { width: 1920, height: 1080 });
    
    if (heroBase64) {
      const heroPath = `${regionSlug}/hero.png`;
      const heroUrl = await uploadToStorage(heroBase64, heroPath);
      
      if (heroUrl) {
        generatedImages.push({
          type: 'hero',
          base64: heroBase64.substring(0, 50) + '...', // Truncate for response
          storagePath: heroUrl
        });
        console.log('[generate-region-images] Hero image uploaded:', heroUrl);
      }
    } else {
      errors.push('Failed to generate hero image');
    }

    // Generate seasonal backgrounds if prompts provided
    const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
    for (const season of seasons) {
      const prompt = seasonalPrompts[season];
      if (prompt) {
        console.log(`[generate-region-images] Generating ${season} background...`);
        const base64 = await generateImage(prompt, { width: 1920, height: 1080 });
        
        if (base64) {
          const path = `${regionSlug}/seasonal-backgrounds/${season}-landscape.png`;
          const url = await uploadToStorage(base64, path);
          
          if (url) {
            generatedImages.push({
              type: season,
              base64: base64.substring(0, 50) + '...',
              storagePath: url
            });
            console.log(`[generate-region-images] ${season} image uploaded:`, url);
          }
        } else {
          errors.push(`Failed to generate ${season} background`);
        }
      }
    }

    // Generate town thumbnails if requested
    if (generateTownThumbnails && towns.length > 0) {
      for (const town of towns.slice(0, 3)) { // Limit to 3 for speed
        const townPrompt = town.prompt || `Beautiful aerial view of ${town.name}, Italy, showing historic center, Italian architecture, warm Mediterranean light`;
        console.log(`[generate-region-images] Generating thumbnail for ${town.name}...`);
        
        const base64 = await generateImage(townPrompt, { width: 800, height: 600 });
        
        if (base64) {
          const slug = town.name.toLowerCase().replace(/\s+/g, '-');
          const path = `${regionSlug}/towns/${slug}.png`;
          const url = await uploadToStorage(base64, path);
          
          if (url) {
            generatedImages.push({
              type: 'town',
              name: town.name,
              base64: base64.substring(0, 50) + '...',
              storagePath: url
            });
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
