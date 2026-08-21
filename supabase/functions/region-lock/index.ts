import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "npm:zod@3.23.8";
import { corsHeaders, jsonResponse, requireAdmin } from "../_shared/auth.ts";

const BodySchema = z.object({
  slug: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  locked: z.boolean(),
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
    const { slug, locked } = parsed.data;

    console.log('[region-lock] Updating lock status:', { slug, locked });

    const today = new Date().toISOString().split('T')[0];
    const action = locked ? 'locked' : 'unlocked';

    return jsonResponse({
      success: true,
      message: `Region "${slug}" ${action} successfully`,
      data: {
        slug,
        locked,
        updatedAt: today,
        registryUpdate: {
          [slug]: { locked },
        },
        aiInstructionsUpdate: {
          lockedRegions: locked ? 'add' : 'remove',
          lastUpdated: today,
        },
      },
    });
  } catch (error) {
    console.error('[region-lock] Error:', error);
    return jsonResponse({ success: false, error: 'Unexpected server error' }, 500);
  }
});
