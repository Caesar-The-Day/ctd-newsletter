import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScaffoldRequest {
  slug: string;
  displayName: string;
  issueNumber: number;
  colorScheme: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug, displayName, issueNumber, colorScheme } = await req.json() as ScaffoldRequest;

    console.log('[scaffold-region] Scaffolding new region:', { slug, displayName, issueNumber, colorScheme });

    // Validate required fields
    if (!slug || !displayName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: slug and displayName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Slug must be lowercase alphanumeric with hyphens only' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Generate the new region entry for registry
    const newRegistryEntry = {
      status: 'draft',
      locked: false,
      createdDate: today,
      version: '0.1',
      colorScheme: colorScheme || 'default',
      slug,
      displayName
    };

    // Generate the new newsletter entry
    const newNewsletterEntry = {
      slug,
      title: displayName,
      issueNumber: issueNumber || 1,
      date: currentMonth,
      status: 'coming-soon',
      thumbnail: `/images/${slug}/thumbnail.jpg`,
      description: `Discover the charm of ${displayName} - coming soon.`,
      ctaText: 'Coming Soon',
      ctaLink: `/${slug}`
    };

    // Generate template region data
    const regionData = {
      _comment: `CAESAR THE DAY - ${displayName} Newsletter`,
      _version: '1.0',
      _status: 'draft',
      region: {
        slug,
        issueNumber: issueNumber || 1,
        date: currentMonth,
        title: `${displayName}: Your Subtitle Here`,
        tagline: 'Add your region tagline here',
        hero: {
          bannerImage: `/images/${slug}/hero.jpg`,
          ambientAudio: `/images/${slug}/ambient.mp3`,
          credit: `Photo: ${displayName} © CaesarTheDay`
        },
        intro: {
          headline: 'Bentornati',
          byline: '— Cesare',
          paragraphs: [
            `Welcome to ${displayName}! This is your introduction paragraph. Edit this to describe what makes this region special.`,
            'Add sensory descriptions of the region - sights, sounds, and seasonal context.',
            'Describe the character and culture - what makes this region distinct.',
            'Explain why retirees should care - practical benefits and lifestyle fit.',
            'Close with an invitation to explore the content that follows.'
          ],
          portrait: '/images/shared/cesare-boat.jpg',
          signature: '/images/shared/cesare-signature.png'
        }
      },
      where: {
        map: {
          center: [12.5, 42.0],
          zoom: 7,
          markers: [],
          externalMapUrl: `https://maps.google.com/?q=${encodeURIComponent(displayName)}+Italy`
        },
        tabs: [
          { id: 'geography', title: 'Geography', content: 'Add geography description...' },
          { id: 'access', title: 'Getting There', content: 'Add access information...' },
          { id: 'transport', title: 'Local Transport', content: 'Add transport details...' }
        ]
      },
      towns: {
        featured: [],
        grid: []
      },
      highlights: {
        wine: { title: 'WINE — Regional Wines', intro: 'Add wine introduction...', cards: [] },
        food: { title: 'FOOD — Regional Cuisine', intro: 'Add food introduction...', cards: [] },
        culture: { title: 'CULTURE — Regional Culture', intro: 'Add culture introduction...', cards: [] }
      },
      healthcare: {
        intro: { headline: 'Healthcare & Infrastructure', lead: 'Add healthcare overview...' },
        hospitals: [],
        airports: [],
        railways: [],
        highways: [],
        parks: [],
        travelTimes: [],
        quickInfo: {
          emergencyNumbers: ['118 – Medical Emergency', '112 – Police', '115 – Fire'],
          healthcare: { title: 'Register for Healthcare', description: 'Add info...', link: '#' },
          transport: { title: 'Transport Info', description: 'Add info...', link: '#' }
        },
        closing: 'Add closing paragraph...'
      },
      costOfLiving: {
        intro: { headline: 'Cost of Living', copy: 'Add cost overview...' },
        townPresets: [],
        lifestyles: [],
        notes: []
      },
      prosCons: { pros: [], cons: [] },
      closing: {
        header: `Until Next Time from ${displayName}`,
        subtitle: 'Share this newsletter with fellow Italy dreamers',
        message: 'Add closing message...',
        shareUrl: `https://caesartheday.com/${slug}`,
        socialMessages: {
          x: `Discover ${displayName} with Caesar the Day!`,
          facebook: `Planning retirement in Italy? Check out ${displayName}!`,
          linkedin: `Exploring ${displayName} for retirement - great insights here.`,
          email: `I thought you might enjoy this guide to ${displayName}, Italy.`
        }
      }
    };

    // Generate climate template
    const climateData = {
      intro: {
        headline: `Climate Snapshot: A Year in ${displayName}`,
        lead: `Understanding ${displayName}'s climate is essential for planning your life there.`
      },
      regions: {},
      months: [
        { name: 'January', avgHigh: 10, avgLow: 2, precipitation: 60, sunnyDays: 4 },
        { name: 'February', avgHigh: 12, avgLow: 3, precipitation: 55, sunnyDays: 5 },
        { name: 'March', avgHigh: 15, avgLow: 6, precipitation: 50, sunnyDays: 7 },
        { name: 'April', avgHigh: 18, avgLow: 9, precipitation: 60, sunnyDays: 8 },
        { name: 'May', avgHigh: 23, avgLow: 13, precipitation: 55, sunnyDays: 10 },
        { name: 'June', avgHigh: 27, avgLow: 17, precipitation: 40, sunnyDays: 12 },
        { name: 'July', avgHigh: 30, avgLow: 20, precipitation: 25, sunnyDays: 14 },
        { name: 'August', avgHigh: 30, avgLow: 20, precipitation: 30, sunnyDays: 13 },
        { name: 'September', avgHigh: 26, avgLow: 16, precipitation: 50, sunnyDays: 10 },
        { name: 'October', avgHigh: 20, avgLow: 12, precipitation: 80, sunnyDays: 7 },
        { name: 'November', avgHigh: 14, avgLow: 7, precipitation: 90, sunnyDays: 5 },
        { name: 'December', avgHigh: 10, avgLow: 3, precipitation: 70, sunnyDays: 4 }
      ]
    };

    // Updated AI instructions
    const aiInstructions = {
      activeRegion: slug,
      lockedRegions: ['piemonte', 'puglia'],
      instruction: `CRITICAL: The following regions are LOCKED and cannot be modified: piemonte, puglia. These regions are live and published. Do NOT make any changes to their data files, components, or configurations unless explicitly unlocked. The ACTIVE region for work is: ${slug}. Focus all content work on this region only.`,
      lastUpdated: today
    };

    console.log('[scaffold-region] Generated data structures:', {
      registryEntry: newRegistryEntry,
      newsletterEntry: newNewsletterEntry,
      regionDataKeys: Object.keys(regionData),
      climateDataKeys: Object.keys(climateData)
    });

    // Return the generated data for the frontend to handle
    return new Response(
      JSON.stringify({
        success: true,
        message: `Region "${displayName}" scaffolded successfully`,
        data: {
          registryEntry: newRegistryEntry,
          newsletterEntry: newNewsletterEntry,
          regionData,
          climateData,
          aiInstructions,
          filesToCreate: [
            `/data/regions/italy/${slug}.json`,
            `/data/regions/italy/${slug}-climate.json`
          ],
          filesToUpdate: [
            '/data/region-registry.json',
            '/data/newsletter-index.json',
            '/data/ai-instructions.json'
          ]
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[scaffold-region] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
