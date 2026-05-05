import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScaffoldRequest {
  slug: string;
  displayName: string;
  issueNumber: number;
  colorScheme: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug, displayName, issueNumber, colorScheme } = await req.json() as ScaffoldRequest;

    console.log('[scaffold-region] Scaffolding new region:', { slug, displayName, issueNumber, colorScheme });

    if (!slug || !displayName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: slug and displayName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Slug must be lowercase alphanumeric with hyphens only' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const newRegistryEntry = {
      status: 'draft',
      locked: false,
      createdDate: today,
      version: '0.1',
      colorScheme: colorScheme || 'default',
      slug,
      displayName
    };

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

    const regionData = buildRegionTemplate(slug, displayName, issueNumber, currentMonth);
    const climateData = buildClimateTemplate(displayName);

    const aiInstructions = {
      activeRegion: slug,
      lockedRegions: ['piemonte', 'puglia'],
      instruction: `CRITICAL: The following regions are LOCKED and cannot be modified: piemonte, puglia. The ACTIVE region for work is: ${slug}.`,
      lastUpdated: today
    };

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

/**
 * Build a region template with correctly-shaped empty arrays and
 * sensible defaults that won't crash any React component.
 */
function buildRegionTemplate(slug: string, displayName: string, issueNumber: number, currentMonth: string) {
  return {
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
        ambientAudio: '',
        credit: `Photo: ${displayName} © CaesarTheDay`
      },
      intro: {
        headline: 'Bentornati',
        byline: '— Cesare',
        paragraphs: [],
        portrait: '/images/shared/cesare-boat.jpg',
        signature: '/images/shared/cesare-signature.png'
      }
    },
    where: {
      map: {
        center: [42.0, 12.5] as [number, number],
        zoom: 7,
        markers: [],
        externalMapUrl: `https://maps.google.com/?q=${encodeURIComponent(displayName)}+Italy`
      },
      tabs: [
        { id: 'geography', title: 'Geography', content: '' },
        { id: 'access', title: 'Getting There', content: '' },
        { id: 'transport', title: 'Local Transport', content: '' }
      ]
    },
    towns: {
      featured: [],
      grid: []
    },
    highlights: {
      wine: { title: 'WINE — Regional Wines', intro: '', backgroundImage: '', cards: [] },
      food: { title: 'FOOD — Regional Cuisine', intro: '', backgroundImage: '', cards: [] },
      culture: { title: 'CULTURE — Regional Heritage', intro: '', backgroundImage: '', cards: [] }
    },
    wine: {
      quiz: {
        profiles: []
      }
    },
    recipes: {
      header: {
        title: 'Regional Recipes',
        subtitle: `Authentic flavours from ${displayName}`
      },
      cards: [],
      modes: ['Rustic', 'Refined']
    },
    healthcare: {
      intro: { headline: 'Healthcare & Infrastructure', lead: '' },
      hospitals: [],
      airports: [],
      railways: [],
      highways: [],
      parks: [],
      travelTimes: [],
      quickInfo: {
        emergencyNumbers: ['118 – Medical Emergency', '112 – Police', '115 – Fire'],
        healthcare: { title: 'Register for Healthcare', description: 'Enroll in the SSN at your local ASL office.', link: '#' },
        transport: { title: 'Transport Info', description: 'Regional transport information.', link: '#' }
      },
      closing: ''
    },
    costOfLiving: {
      intro: { headline: 'Cost of Living', lead: '', realityCheck: '', whyItWorks: '' },
      townPresets: [],
      lifestyles: ['Modest', 'Average', 'High-End'],
      notes: {
        reference: 'Estimates based on 2025 data for a retired couple.',
        sources: ['Numbeo', 'ISTAT', 'Local expat communities'],
        links: {}
      }
    },
    prosCons: {
      intro: { headline: '', lead: '', tradeoff: '' },
      pros: [],
      cons: [],
      finalTake: { headline: '', text: '', conclusion: '' }
    },
    closing: {
      header: `Until Next Time from ${displayName}`,
      subtitle: 'Share this newsletter with fellow Italy dreamers',
      message: `That's a wrap on ${displayName}. Until next time — Cesare`,
      shareUrl: `https://italy.caesartheday.com/${slug}`,
      socialMessages: {
        facebook: `Discover ${displayName} with Caesar the Day!`,
        threads: `Exploring ${displayName} for retirement.`,
        bluesky: `Check out this deep dive into ${displayName}, Italy 🇮🇹`,
        whatsapp: `I thought you'd enjoy this guide to ${displayName}, Italy.`,
        pinterest: {
          title: `${displayName} Retirement Guide`,
          description: `Everything you need to know about retiring in ${displayName}, Italy.`
        }
      }
    }
  };
}

function buildClimateTemplate(displayName: string) {
  // Stub matches the shape ClimateSnapshot.tsx expects so the row stays
  // valid even before AI research populates city-level data. The wizard
  // overwrites this with `research.climateSnapshot` when available.
  const monthMeta = [
    { month: "January", index: 0, season: "winter" },
    { month: "February", index: 1, season: "winter" },
    { month: "March", index: 2, season: "spring" },
    { month: "April", index: 3, season: "spring" },
    { month: "May", index: 4, season: "spring" },
    { month: "June", index: 5, season: "summer" },
    { month: "July", index: 6, season: "summer" },
    { month: "August", index: 7, season: "summer" },
    { month: "September", index: 8, season: "autumn" },
    { month: "October", index: 9, season: "autumn" },
    { month: "November", index: 10, season: "autumn" },
    { month: "December", index: 11, season: "winter" },
  ] as const;

  return {
    intro: {
      headline: `Climate Snapshot: A Year in ${displayName}`,
      tagline: `A year in ${displayName}, season by season.`,
      paragraphs: [
        `Understanding ${displayName}'s climate is essential for planning your life there.`,
      ],
      hoverQuote: "",
      ctaText: "Slide through the seasons →",
    },
    regions: {},
    months: monthMeta.map((m) => ({
      ...m,
      tooltip: "",
      culturalEvent: "",
      culturalEventUrl: "",
      visualCue: "",
    })),
  };
}
