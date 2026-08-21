import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "npm:zod@3.23.8";
import { corsHeaders, jsonResponse, requireAdmin } from "../_shared/auth.ts";

const BodySchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
    .nullable(),
});

serve(async (req) => {
  // Handle CORS preflight requests
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

    console.log('[set-active-region] Setting active region:', slug);

    const today = new Date().toISOString().split('T')[0];

    return jsonResponse({
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
          lastUpdated: today,
        },
      },
    });
  } catch (error) {
    console.error('[set-active-region] Error:', error);
    return jsonResponse({ success: false, error: 'Unexpected server error' }, 500);
  }
});
