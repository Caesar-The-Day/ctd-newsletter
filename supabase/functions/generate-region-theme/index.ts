import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "npm:zod@3.23.8";
import { corsHeaders, jsonResponse, requireAdmin, sanitizeText } from "../_shared/auth.ts";

const BodySchema = z.object({
  regionName: z.string().min(1).max(120),
  vibeDescription: z.string().min(1).max(2000),
  characteristics: z.array(z.string().max(200)).max(30).optional(),
});

interface ThemeRequest {
  regionName: string;
  vibeDescription: string;
  characteristics?: string[];
}

interface GeneratedTheme {
  primary: { h: number; s: number; l: number };
  secondary: { h: number; s: number; l: number };
  accent: { h: number; s: number; l: number };
  muted: { h: number; s: number; l: number };
  background: { h: number; s: number; l: number };
  foreground: { h: number; s: number; l: number };
  gradients: {
    hero: string;
    warm: string;
  };
  seasonalBackgrounds: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
  suggestedSections: string[];
  themeReasoning: string;
}

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
    const regionName = sanitizeText(parsed.data.regionName, 120);
    const vibeDescription = sanitizeText(parsed.data.vibeDescription, 2000);
    const characteristics = (parsed.data.characteristics ?? []).map((c) => sanitizeText(c, 200));

    console.log('[generate-region-theme] Generating theme for:', { regionName });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert color designer for an Italian regional newsletter platform called "Caesar the Day". 
Your job is to generate HSL color palettes that evoke the specific character and vibe of Italian regions.

You must respond with ONLY valid JSON matching this exact structure:
{
  "primary": { "h": number, "s": number, "l": number },
  "secondary": { "h": number, "s": number, "l": number },
  "accent": { "h": number, "s": number, "l": number },
  "muted": { "h": number, "s": number, "l": number },
  "background": { "h": number, "s": number, "l": number },
  "foreground": { "h": number, "s": number, "l": number },
  "gradients": {
    "hero": "CSS linear-gradient string using hsl values",
    "warm": "CSS linear-gradient string using hsl values"
  },
  "seasonalBackgrounds": {
    "spring": "description of ideal spring background imagery",
    "summer": "description of ideal summer background imagery",
    "autumn": "description of ideal autumn background imagery",
    "winter": "description of ideal winter background imagery"
  },
  "suggestedSections": ["array of section slugs from: hero, editorialIntro, map, climate, townsFeatured, bookCTA, townsGrid, highlights, collaborator, quiz, recipes, retirementBlueprintCTA, healthcare, costCalculator, sevenPercentCTA, prosCons, closing"],
  "themeReasoning": "Brief explanation of color choices and why they fit the region"
}

Color guidelines:
- Primary: Main brand color that represents the region's essence (used for CTAs, links)
- Secondary: Complementary color for UI surfaces
- Accent: Pop of color for highlights and special elements
- Muted: Subdued color for backgrounds and less prominent elements
- Background: Page background (typically very light or very dark)
- Foreground: Main text color (high contrast with background)

For gradients, use the primary and secondary colors to create smooth transitions.
For h (hue): 0-360, s (saturation): 0-100, l (lightness): 0-100

Consider:
- Coastal regions: Blues, teals, sandy beiges
- Mountain regions: Forest greens, cool grays, alpine whites
- Wine regions: Deep burgundies, warm purples, earth tones
- Tuscan-style: Terracotta, olive greens, warm golds
- Southern sunny regions: Bright oranges, turquoise, warm yellows
- Urban/sophisticated: Slate grays, deep navy, gold accents`;

    const userPrompt = `Generate a color theme for the Italian region "${regionName}".

Vibe description: ${vibeDescription}
${characteristics.length > 0 ? `Key characteristics: ${characteristics.join(', ')}` : ''}

Create a cohesive color palette that captures this region's unique character.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-region-theme] AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('[generate-region-theme] Raw AI response:', aiResponse);

    // Parse the JSON from the AI response
    let generatedTheme: GeneratedTheme;
    try {
      // Strip markdown code fences if present (e.g. ```json ... ```)
      let cleaned = aiResponse.trim();
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      generatedTheme = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[generate-region-theme] Failed to parse AI response:', parseError);
      console.error('[generate-region-theme] Raw response (first 500):', aiResponse.substring(0, 500));
      console.error('[generate-region-theme] Raw response (last 200):', aiResponse.substring(aiResponse.length - 200));
      throw new Error('Failed to parse theme from AI response');
    }

    console.log('[generate-region-theme] Generated theme:', generatedTheme);

    return new Response(
      JSON.stringify({
        success: true,
        theme: generatedTheme,
        regionName,
        vibeDescription
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[generate-region-theme] Error:', error);
    return jsonResponse({ success: false, error: 'Unexpected server error' }, 500);
  }
});
