import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { regionName, vibeDescription, characteristics = [] } = await req.json() as ThemeRequest;

    console.log('[generate-region-theme] Generating theme for:', { regionName, vibeDescription, characteristics });

    if (!regionName || !vibeDescription) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: regionName and vibeDescription' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
      // Try to extract JSON from the response (might be wrapped in markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      generatedTheme = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[generate-region-theme] Failed to parse AI response:', parseError);
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
