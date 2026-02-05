import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ResearchRequest {
  regionName: string;
  vibeDescription?: string;
  focusAreas?: string[];
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

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(regionName, vibeDescription, focusAreas);

    console.log('[research-region] Calling AI API...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
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

    let research;
    try {
      let cleaned = aiResponse.trim();
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
      
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      research = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[research-region] Failed to parse AI response:', parseError);
      console.error('[research-region] Raw response (first 500):', aiResponse.substring(0, 500));
      console.error('[research-region] Raw response (last 200):', aiResponse.substring(aiResponse.length - 200));
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

function buildSystemPrompt(): string {
  return `You are an expert researcher for "Caesar the Day", an interactive editorial newsletter helping retirees explore Italian regions for relocation.

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

Respond with ONLY valid JSON matching this EXACT structure:
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
      "First paragraph - set the scene, arrival description (3-4 sentences)",
      "Second paragraph - sensory details, sounds, smells, textures (3-4 sentences)",
      "Third paragraph - character and culture, what makes people here different (3-4 sentences)",
      "Fourth paragraph - practical benefits for retirees, cost, healthcare, pace of life (3-4 sentences)",
      "Fifth paragraph - invitation to explore, what follows in the guide (2-3 sentences)"
    ]
  },
  "geographyTabs": [
    {
      "id": "geography",
      "title": "Geography",
      "content": "2-3 paragraphs describing the region's terrain, borders, notable geographic features, elevation changes, rivers, lakes, coastline if any. Be specific with place names."
    },
    {
      "id": "access",
      "title": "Getting There",
      "content": "2-3 paragraphs about how to reach the region from major international airports, train connections from Rome/Milan, driving routes from major Italian cities, ferry access if coastal."
    },
    {
      "id": "transport",
      "title": "Local Transport",
      "content": "2-3 paragraphs about getting around within the region: regional train lines, bus networks, whether a car is necessary, cycling infrastructure, parking in hill towns."
    }
  ],
  "climate": {
    "cities": [
      {
        "name": "string - capital or major city",
        "months": [
          { "name": "January", "avgHigh": 10, "avgLow": 2, "precipitation": 60, "sunnyDays": 4 },
          { "name": "February", "avgHigh": 12, "avgLow": 3, "precipitation": 55, "sunnyDays": 5 },
          { "name": "March", "avgHigh": 15, "avgLow": 6, "precipitation": 50, "sunnyDays": 7 },
          { "name": "April", "avgHigh": 18, "avgLow": 9, "precipitation": 60, "sunnyDays": 8 },
          { "name": "May", "avgHigh": 23, "avgLow": 13, "precipitation": 55, "sunnyDays": 10 },
          { "name": "June", "avgHigh": 27, "avgLow": 17, "precipitation": 40, "sunnyDays": 12 },
          { "name": "July", "avgHigh": 30, "avgLow": 20, "precipitation": 25, "sunnyDays": 14 },
          { "name": "August", "avgHigh": 30, "avgLow": 20, "precipitation": 30, "sunnyDays": 13 },
          { "name": "September", "avgHigh": 26, "avgLow": 16, "precipitation": 50, "sunnyDays": 10 },
          { "name": "October", "avgHigh": 20, "avgLow": 12, "precipitation": 80, "sunnyDays": 7 },
          { "name": "November", "avgHigh": 14, "avgLow": 7, "precipitation": 90, "sunnyDays": 5 },
          { "name": "December", "avgHigh": 10, "avgLow": 3, "precipitation": 70, "sunnyDays": 4 }
        ]
      }
    ]
  },
  "towns": {
    "featured": [
      {
        "name": "string",
        "coordinates": { "lat": number, "lng": number },
        "bestFor": "string like 'Culture & History'",
        "summary": "2-3 sentence hook for card display",
        "fullDescription": "4-5 sentence detailed description for the Read More dialog",
        "highlights": ["3-4 key attractions or features"],
        "eligible7Percent": false
      }
    ],
    "grid": [
      {
        "name": "string",
        "coordinates": { "lat": number, "lng": number },
        "bestFor": "string",
        "blurb": "2-3 sentence description explaining appeal and who it suits",
        "fullDescription": "4-5 sentence expanded description for dialog",
        "eligible7Percent": false
      }
    ]
  },
  "highlights": {
    "wine": {
      "intro": "2-3 sentences about the region's wine character and what makes it distinctive",
      "cards": [
        {
          "title": "string - actual wine name like 'Sagrantino di Montefalco'",
          "subtitle": "string - grape variety or classification like 'DOCG Red'",
          "description": "3-4 sentences about this wine, its character, food pairings, and where to find it"
        }
      ]
    },
    "food": {
      "intro": "2-3 sentences about regional cuisine character",
      "cards": [
        {
          "title": "string - actual dish name in Italian",
          "subtitle": "string - type like 'Primo Piatto' or 'Street Food'",
          "description": "3-4 sentences about the dish, its origin, and where to eat it"
        }
      ]
    },
    "culture": {
      "intro": "2-3 sentences about cultural character",
      "cards": [
        {
          "title": "string - actual site or tradition",
          "subtitle": "string - type like 'UNESCO Site' or 'Annual Festival'",
          "description": "3-4 sentences about this cultural highlight"
        }
      ]
    }
  },
  "healthcare": {
    "overview": "3-4 sentences about healthcare quality, the SSN system in this region, and what retirees should know",
    "hospitals": [
      {
        "name": "string - actual hospital name",
        "city": "string",
        "type": "regional|city|specialized",
        "description": "1-2 sentences about this hospital's strengths"
      }
    ],
    "airports": [
      {
        "name": "string - actual airport name",
        "code": "string - IATA code",
        "city": "string",
        "coordinates": { "lat": number, "lng": number },
        "distanceFromCapital": "string like '12km'",
        "description": "1-2 sentences about connectivity"
      }
    ],
    "railways": [
      {
        "name": "string - line name or station",
        "description": "1-2 sentences about this rail connection"
      }
    ],
    "highways": [
      {
        "name": "string - autostrada name like 'A1 Autostrada del Sole'",
        "description": "1-2 sentences about this road connection"
      }
    ],
    "parks": [
      {
        "name": "string - actual park or nature reserve",
        "coordinates": { "lat": number, "lng": number },
        "description": "1-2 sentences about this natural area"
      }
    ],
    "travelTimes": [
      {
        "from": "string - town name",
        "destinations": [
          { "to": "string - destination", "time": "string like '45 min by car'" }
        ],
        "nearestAirport": "string - airport name and distance"
      }
    ]
  },
  "costOfLiving": {
    "overview": "3-4 sentences about affordability compared to other Italian regions and northern Europe",
    "realityCheck": "2-3 sentences being honest about hidden costs, bureaucracy fees, initial setup expenses",
    "whyItWorks": "2-3 sentences about why the value proposition is strong despite the challenges",
    "towns": [
      {
        "name": "string - town name",
        "modest": { "rent": 500, "utilities": 150, "groceries": 300, "dining": 150, "transport": 80 },
        "normal": { "rent": 700, "utilities": 180, "groceries": 400, "dining": 250, "transport": 100 },
        "highEnd": { "rent": 1100, "utilities": 220, "groceries": 500, "dining": 400, "transport": 150 }
      }
    ]
  },
  "recipes": [
    {
      "title": "string - actual dish name in Italian",
      "mode": "Rustic",
      "story": "2-3 sentences about this dish's place in the regional kitchen - personal, evocative",
      "ingredients": ["400g flour", "4 eggs", "200g guanciale", "...complete real ingredient list"],
      "steps": ["Step 1 description", "Step 2 description", "...complete real cooking steps"],
      "winePairing": "string - specific local wine to pair with, e.g. 'Sagrantino di Montefalco DOCG'"
    },
    {
      "title": "string - another dish",
      "mode": "Refined",
      "story": "2-3 sentences",
      "whyRefined": "1-2 sentences about what makes this version elevated",
      "ingredients": ["...complete list"],
      "steps": ["...complete steps"],
      "winePairing": "string - wine pairing"
    }
  ],
  "wineQuiz": {
    "profiles": [
      {
        "id": "string-slug",
        "label": "string - personality descriptor like 'The Bold Explorer'",
        "result": {
          "name": "string - actual wine name",
          "note": "3-4 sentences describing why this wine matches this personality, tasting notes, food pairings"
        }
      }
    ]
  },
  "prosCons": {
    "intro": {
      "headline": "string - section title like 'The Honest Assessment'",
      "lead": "2-3 sentences setting up the balanced view",
      "tradeoff": "1-2 sentences about the fundamental tradeoff of living here"
    },
    "pros": [
      {
        "title": "string - short title like 'Exceptional Value'",
        "points": [
          "Specific supporting point with real data or examples (1-2 sentences)",
          "Another supporting point (1-2 sentences)",
          "Third point (1-2 sentences)"
        ]
      }
    ],
    "cons": [
      {
        "title": "string - honest title like 'Limited International Community'",
        "points": [
          "Specific point about this drawback with real context (1-2 sentences)",
          "Another point (1-2 sentences)",
          "Third point (1-2 sentences)"
        ]
      }
    ],
    "finalTake": {
      "headline": "string - like 'The Bottom Line'",
      "text": "2-3 sentences summarizing who this region is best for",
      "conclusion": "1-2 sentences - the final honest take in Cesare's voice"
    }
  },
  "closing": {
    "message": "string - warm closing message from Cesare, 2-3 sentences, personal and forward-looking",
    "socialMessages": {
      "facebook": "string - shareable Facebook post text",
      "threads": "string - Threads post text",
      "bluesky": "string - BlueSky post text",
      "whatsapp": "string - WhatsApp share text",
      "pinterest": {
        "title": "string - Pinterest pin title",
        "description": "string - Pinterest pin description"
      }
    }
  },
  "mapOverlays": {
    "suggested": ["array of overlay types: wine-regions|national-parks|unesco-sites|coastal-routes|ski-areas|thermal-spas|pilgrimage-routes|airports|rail-network"],
    "reasoning": "Why these overlays are most relevant"
  },
  "specialComponents": {
    "suggested": ["array of component ideas specific to this region"],
    "descriptions": {
      "componentName": "Brief description of what this component would do"
    }
  },
  "heroImagePrompt": "Detailed prompt for AI image generation capturing the region's essence - include landscape, lighting, mood, key elements. Mention 16:9 aspect ratio.",
  "seasonalImagePrompts": {
    "spring": "Spring-specific image prompt",
    "summer": "Summer-specific image prompt",
    "autumn": "Autumn-specific image prompt",
    "winter": "Winter-specific image prompt"
  }
}`;
}

function buildUserPrompt(regionName: string, vibeDescription: string, focusAreas: string[]): string {
  return `Research the Italian region "${regionName}" for a retirement/relocation newsletter.

${vibeDescription ? `Additional context about the region's vibe: ${vibeDescription}` : ''}
${focusAreas.length > 0 ? `Focus areas to emphasize: ${focusAreas.join(', ')}` : ''}

Provide comprehensive, ACCURATE research including:

## Towns (CRITICAL - be thorough)
1. 3 featured towns with REAL coordinates, detailed descriptions (4-5 sentences each), highlights, and whether they qualify for Italy's 7% flat tax
2. 10-12 grid towns with brief but useful descriptions (2-3 sentences each explaining who the town suits)

## Geography & Access
3. 3 geography tabs: terrain description, how to get there, local transport - each with 2-3 real paragraphs

## Climate
4. Monthly climate data for the regional capital (all 12 months with real avgHigh, avgLow, precipitation mm, sunnyDays)

## Food, Wine & Culture
5. 4-5 real wines produced in the region with grape varieties and tasting descriptions
6. 4-5 authentic regional dishes with Italian names and culinary context
7. 4-5 cultural highlights (UNESCO sites, museums, festivals, traditions)

## Recipes
8. 3-4 REAL regional recipes with COMPLETE ingredient lists (with quantities) and step-by-step cooking instructions. Mix "Rustic" and "Refined" modes.

## Wine Quiz
9. 4 wine personality profiles mapping to actual regional wines

## Healthcare & Infrastructure
10. 3-5 real hospitals with cities and descriptions
11. Nearest airports with IATA codes, coordinates, and distance from capital
12. Major rail lines and stations
13. Major autostrada/highway connections
14. National parks and nature reserves with coordinates
15. Travel time matrix between 3-4 major towns (driving times)

## Cost of Living
16. Itemized monthly costs for 3-4 towns across 3 lifestyle tiers:
    - Modest: budget-conscious retiree couple
    - Normal: comfortable middle-class
    - High-End: premium lifestyle
    Break down into: rent, utilities, groceries, dining out, transport
    Use realistic 2025 Italian prices.

## Pros & Cons
17. 4 honest pros and 4 honest cons, each with 3 supporting points with specific examples

## Closing & Social
18. A warm closing message from Cesare and social media share text for Facebook, Threads, BlueSky, WhatsApp, Pinterest

Remember: ALL data must be REAL and VERIFIABLE. No made-up towns, wines, hospitals, or attractions.
Coordinates must be real GPS coordinates for Italy (lat 36-47°N, lng 6-19°E).
Cost estimates must reflect actual 2025 Italian prices, not generic numbers.`;
}
