import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResearchRequest {
  regionName: string;
  vibeDescription?: string;
  focusAreas?: string[]; // 'wine', 'food', 'outdoor', 'culture', 'coastal', 'urban'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { regionName, vibeDescription = '', focusAreas = [] } = await req.json() as ResearchRequest;

    console.log('[research-region] Researching:', { regionName, vibeDescription, focusAreas });

    if (!regionName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required field: regionName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert researcher for "Caesar the Day", an interactive editorial newsletter helping retirees explore Italian regions for relocation.

Your task is to research an Italian region and provide ACCURATE, FACTUAL information. You must verify all data is real:
- Real town names with correct coordinates (latitude, longitude to 4 decimal places)
  CRITICAL: Return coordinates as { "lat": <latitude>, "lng": <longitude> } objects.
  Italy's coordinates are approximately: latitude 36-47°N, longitude 6-19°E.
  Example: Perugia is { "lat": 43.1107, "lng": 12.3908 } - latitude FIRST, then longitude.
- Actual wines produced in the region (not made up)
- Real regional dishes with authentic Italian names
- Actual hospitals and healthcare facilities
- Genuine cultural attractions and UNESCO sites
- Realistic cost of living estimates based on Italian standards

You write in the voice of "Cesare" - a sophisticated, worldly Italian-American who has returned to Italy. The tone is:
- First person, intimate, editorial
- Sensory and evocative (describe sights, sounds, seasons)
- Honest about pros AND cons
- Practical (acknowledges bureaucracy, costs, challenges)
- Never salesy or touristy

IMPORTANT: All coordinates must be real. Look up actual lat/lng for each town.

Respond with ONLY valid JSON matching this structure:
{
  "region": {
    "title": "string - evocative title like 'Umbria: Italy's Quiet Secret'",
    "tagline": "string - one-line hook",
    "coordinates": { "lat": number, "lng": number },
    "provinces": ["array of province names"],
    "population": "approximate string like '880,000'"
  },
  "character": {
    "primary": "string - main character type: wine|coastal|mountain|food|urban|spiritual|rustic",
    "secondary": ["array of secondary traits"],
    "comparisons": ["array like 'Similar to Tuscany but more affordable'"],
    "uniqueSelling": "string - what makes this region stand out"
  },
  "editorialIntro": {
    "headline": "Bentornati or similar greeting",
    "paragraphs": [
      "First paragraph - set the scene, arrival description",
      "Second paragraph - sensory details",
      "Third paragraph - character and culture",
      "Fourth paragraph - practical benefits for retirees",
      "Fifth paragraph - invitation to explore"
    ]
  },
  "towns": {
    "featured": [
      {
        "name": "string",
        "coordinates": { "lat": number, "lng": number },
        "bestFor": "string like 'Culture & History'",
        "summary": "2-3 sentence hook",
        "fullDescription": "4-5 sentence detailed description",
        "highlights": ["3-4 key attractions or features"]
      }
    ],
    "grid": [
      {
        "name": "string",
        "coordinates": { "lat": number, "lng": number },
        "bestFor": "string",
        "blurb": "One sentence description"
      }
    ]
  },
  "highlights": {
    "wine": {
      "intro": "2 sentences about the region's wine character",
      "cards": [
        {
          "title": "string - actual wine name like 'Sagrantino di Montefalco'",
          "description": "2-3 sentences about this wine",
          "grapeVariety": "string"
        }
      ]
    },
    "food": {
      "intro": "2 sentences about regional cuisine character",
      "cards": [
        {
          "title": "string - actual dish name in Italian",
          "description": "2-3 sentences about the dish",
          "signature": boolean
        }
      ]
    },
    "culture": {
      "intro": "2 sentences about cultural character",
      "cards": [
        {
          "title": "string - actual site or tradition",
          "description": "2-3 sentences",
          "type": "museum|church|festival|tradition|unesco"
        }
      ]
    }
  },
  "healthcare": {
    "overview": "2-3 sentences about healthcare quality in the region",
    "mainHospitals": [
      {
        "name": "string - actual hospital name",
        "city": "string",
        "type": "regional|city|specialized"
      }
    ],
    "nearestAirports": [
      {
        "name": "string - actual airport name",
        "code": "string - IATA code",
        "city": "string",
        "distanceFromCapital": "string like '12km'"
      }
    ]
  },
  "costOfLiving": {
    "overview": "2-3 sentences about affordability",
    "capitalCity": {
      "name": "string",
      "monthlyBudget": {
        "modest": number,
        "comfortable": number,
        "premium": number
      }
    },
    "smallTown": {
      "name": "string - example small town",
      "monthlyBudget": {
        "modest": number,
        "comfortable": number,
        "premium": number
      }
    }
  },
  "prosCons": {
    "pros": [
      {
        "title": "string - short title",
        "description": "2-3 sentence explanation"
      }
    ],
    "cons": [
      {
        "title": "string - short title",
        "description": "2-3 sentence explanation (be honest!)"
      }
    ]
  },
  "mapOverlays": {
    "suggested": ["array of overlay types relevant to this region: wine-regions|national-parks|unesco-sites|coastal-routes|ski-areas|thermal-spas|pilgrimage-routes|airports|rail-network"],
    "reasoning": "Why these overlays are most relevant"
  },
  "specialComponents": {
    "suggested": ["array of component ideas specific to this region"],
    "descriptions": {
      "componentName": "Brief description of what this component would do"
    }
  },
  "heroImagePrompt": "Detailed prompt for AI image generation capturing the region's essence - include landscape, lighting, mood, key elements",
  "seasonalImagePrompts": {
    "spring": "Spring-specific image prompt",
    "summer": "Summer-specific image prompt", 
    "autumn": "Autumn-specific image prompt",
    "winter": "Winter-specific image prompt"
  }
}`;

    const userPrompt = `Research the Italian region "${regionName}" for a retirement/relocation newsletter.

${vibeDescription ? `Additional context about the region's vibe: ${vibeDescription}` : ''}
${focusAreas.length > 0 ? `Focus areas to emphasize: ${focusAreas.join(', ')}` : ''}

Provide comprehensive, ACCURATE research including:
1. 3 featured towns with real coordinates and detailed descriptions
2. 8-10 grid towns with brief descriptions
3. 3 real wines produced in the region
4. 3 authentic regional dishes
5. 3 cultural highlights (museums, UNESCO sites, festivals)
6. Real hospitals and airports
7. Realistic cost of living estimates (€ per month)
8. 4 honest pros and 4 honest cons for retirees
9. Suggested map overlays and special interactive components
10. AI image generation prompts for hero and seasonal backgrounds

Remember: All data must be REAL and VERIFIABLE. No made-up towns, wines, or attractions.`;

    console.log('[research-region] Calling AI API...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro', // Use Pro for research quality
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[research-region] AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits to continue.' }),
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

    console.log('[research-region] Raw AI response length:', aiResponse.length);

    // Parse the JSON from the AI response
    let research;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      research = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[research-region] Failed to parse AI response:', parseError);
      console.error('[research-region] Raw response:', aiResponse.substring(0, 500));
      throw new Error('Failed to parse research from AI response');
    }

    console.log('[research-region] Parsed research for:', research.region?.title);

    return new Response(
      JSON.stringify({
        success: true,
        research,
        regionName,
        generatedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[research-region] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
