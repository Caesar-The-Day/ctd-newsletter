import { supabase } from "@/integrations/supabase/client";

// Data access layer - swap JSON for Supabase later by changing these functions
export async function getGlobals() {
  const response = await fetch('/data/globals.json');
  if (!response.ok) throw new Error('Failed to load globals');
  return response.json();
}

export async function getRegionData(slug: string): Promise<RegionData> {
  console.log('[getRegionData] Loading region:', slug);
  
  // First, try to fetch from Supabase database
  try {
    const { data: dbRegion, error } = await supabase
      .from('regions')
      .select('region_data')
      .eq('slug', slug)
      .maybeSingle();
    
    if (!error && dbRegion?.region_data) {
      console.log('[getRegionData] Loaded from database:', slug);
      // Cast JSONB to RegionData type
      return dbRegion.region_data as unknown as RegionData;
    }
    
    if (error) {
      console.warn('[getRegionData] Database fetch failed:', error.message);
    }
  } catch (err) {
    console.warn('[getRegionData] Database fetch error:', err);
  }
  
  // Fall back to static JSON files
  console.log('[getRegionData] Trying static JSON files for:', slug);
  let response = await fetch(`/data/regions/italy/${slug}.json`);
  if (!response.ok) {
    console.log('[getRegionData] Nested path failed, trying flat structure');
    response = await fetch(`/data/${slug}.json`);
  }
  if (!response.ok) {
    console.error('[getRegionData] Failed to load region:', slug);
    throw new Error(`Failed to load region: ${slug}`);
  }
  // Guard against SPA fallback returning HTML instead of JSON
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    console.error('[getRegionData] Received non-JSON response for:', slug);
    throw new Error(`Failed to load region: ${slug} (received HTML instead of JSON)`);
  }
  console.log('[getRegionData] Loaded from static JSON:', slug);
  return response.json() as Promise<RegionData>;
}

export async function getNewsletterIndexData() {
  const response = await fetch('/data/newsletter-index.json');
  if (!response.ok) throw new Error('Failed to load newsletter index');
  return response.json();
}

export interface FeatureFlags {
  showWineQuiz: boolean;
  showBeerFeature: boolean;
  show7PercentCTA: boolean;
  showCollaborator: boolean;
  showBookCTA: boolean;
  showRetirementBlueprintCTA: boolean;
  enableAmbientAudio: boolean;
  enableSeasonalParticles: boolean;
}

export async function getRegionConfig(slug: string): Promise<FeatureFlags> {
  const response = await fetch('/data/config/feature-flags.json');
  if (!response.ok) throw new Error('Failed to load feature flags');
  const allConfigs = await response.json();
  const config = allConfigs[slug] === "default" 
    ? allConfigs.default 
    : { ...allConfigs.default, ...(allConfigs[slug] || {}) };
  return config;
}

export async function getSectionOrder(slug: string): Promise<string[]> {
  const response = await fetch('/data/config/section-order.json');
  if (!response.ok) throw new Error('Failed to load section order');
  const allOrders = await response.json();
  return allOrders[slug] === "default" 
    ? allOrders.default 
    : allOrders[slug] || allOrders.default;
}

export interface RegionRegistryEntry {
  status: 'live' | 'draft' | 'archived';
  locked: boolean;
  createdDate: string;
  publishedDate?: string;
  version: string;
  colorScheme: string;
  slug: string;
  displayName: string;
}

export interface RegionRegistry {
  regions: Record<string, RegionRegistryEntry>;
  metadata: {
    lastUpdated: string;
    version: string;
  };
}

export async function getRegionRegistry(): Promise<RegionRegistry | null> {
  try {
    // Fetch regions from Supabase database
    const { data: dbRegions, error } = await supabase
      .from('regions')
      .select('slug, display_name, status, locked, created_date, published_date, version, color_scheme')
      .order('created_date', { ascending: true });

    if (error) {
      console.error('Failed to load regions from database:', error);
      // Fall back to static JSON
      const response = await fetch('/data/region-registry.json');
      if (!response.ok) return null;
      return await response.json();
    }

    // Transform database rows to registry format
    const regions: Record<string, RegionRegistryEntry> = {};
    for (const row of dbRegions || []) {
      regions[row.slug] = {
        status: row.status as 'live' | 'draft' | 'archived',
        locked: row.locked,
        createdDate: row.created_date,
        publishedDate: row.published_date || undefined,
        version: row.version,
        colorScheme: row.color_scheme,
        slug: row.slug,
        displayName: row.display_name,
      };
    }

    return {
      regions,
      metadata: {
        lastUpdated: new Date().toISOString().split('T')[0],
        version: '2.0-db',
      },
    };
  } catch (error) {
    console.error('Failed to load region registry:', error);
    return null;
  }
}

export interface GlobalsData {
  brand: {
    siteTitle: string;
    motto: string;
    heroTitle: string;
    heroSubtitle: string;
    heroByline: string;
    logoPath: string;
    palette: {
      primary: string;
      accent: string;
      neutral: string;
    };
    share: {
      facebook: string;
      group: string;
      substack: string;
    };
    ctas: Array<{
      id: string;
      headline: string;
      body: string;
      label: string;
      href: string;
    }>;
  };
}

export interface HighlightCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export interface HighlightCategory {
  title: string;
  intro: string;
  backgroundImage: string;
  cards: HighlightCard[];
}

export interface Highlights {
  sectionIntro?: string;
  wine: HighlightCategory;
  food: HighlightCategory;
  culture: HighlightCategory;
}

interface SocialMessages {
  facebook: string;
  threads: string;
  bluesky: string;
  whatsapp: string;
  pinterest: {
    title: string;
    description: string;
  };
}

export interface RegionData {
  region: {
    slug: string;
    issueNumber: number;
    date: string;
    title: string;
    tagline: string;
    hero: {
      bannerImage: string;
      ambientAudio?: string;
      credit: string;
    };
  intro: {
    headline: string;
    byline: string;
    paragraphs: string[];
    portrait: string;
    signature?: string;
  };
  };
  collaborator: {
    heading: string;
    paragraphs: string[];
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
  };
  where: {
    map: {
      center: [number, number];
      zoom: number;
      markers: Array<{
        id: string;
        name: string;
        coords: [number, number];
        photo: string;
        blurb: string;
      }>;
      externalMapUrl: string;
    };
    tabs: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  };
  character: {
    slides: Array<{
      image: string;
      caption: string;
      copy: string;
    }>;
  };
  climate: {
    modes: Array<{
      id: string;
      label: string;
      avgWinterTempC: number;
      avgSummerTempC: number;
      notes: string;
    }>;
  };
  towns: {
    featured: Array<{
      id: string;
      name: string;
      bestFor: string;
      photo: string;
      summary: string;
      mapUrl: string;
      gallery: string[];
      links?: Array<{
        label: string;
        href: string;
      }>;
    }>;
    grid: Array<{
      id: string;
      name: string;
      bestFor: string;
      photo: string;
      mapUrl: string;
      blurb: string;
    }>;
  };
  wine: {
    quiz: {
      profiles: Array<{
        id: string;
        label: string;
        result: {
          name: string;
          note: string;
          image: string;
        };
      }>;
    };
  };
  recipes: {
    header?: {
      title: string;
      subtitle: string;
    };
    originStory?: {
      title: string;
      subtitle: string;
      story: string[];
      image: string;
      winePairing: string[];
      recipes: Array<{
        version: string;
        description: string;
        ingredients: string[];
        steps: string[];
      }>;
    };
    cards: Array<{
      id: string;
      title: string;
      mode: string;
      image: string;
      story?: string;
      whyRefined?: string;
      ingredients: string[];
      steps: string[];
      servingSuggestion?: string;
      pairWithWineProfile: string;
      winePairing?: string;
      links?: Array<{
        label: string;
        href: string;
      }>;
    }>;
    modes: string[];
  };
  healthcare: {
    intro?: {
      headline: string;
      lead: string;
    };
    sectionTitle?: string;
    sectionSubtitle?: string;
    hospitalsIntro?: string;
    hospitals?: Array<{
      name: string;
      location: string;
      coords: [number, number];
      description: string;
      link: string;
      mapUrl: string;
    }>;
    hospitalGroups?: Array<{
      title: string;
      hospitals: Array<{
        name: string;
        location: string;
        description: string;
        link: string;
        mapLink: string;
      }>;
    }>;
    howCareWorks?: {
      title: string;
      paragraphs: string[];
      anchor: string;
    };
    whyItMatters?: {
      title: string;
      paragraphs: string[];
    };
    infrastructure?: {
      intro: string;
      sections: Array<{
        title: string;
        paragraphs?: string[];
        features?: string[];
        subsections?: Array<{
          title: string;
          paragraphs?: string[];
          intro?: string;
          airports?: Array<{
            name: string;
            description: string;
            link?: string;
            mapUrl?: string;
          }>;
          closing?: string;
        }>;
      }>;
      oneHourReach?: {
        title: string;
        description: string;
        legend: Array<{ icon: string; label: string }>;
        anchor: string;
      };
    };
    airports: Array<{
      name: string;
      coords: [number, number];
      description: string;
      link: string;
      mapUrl: string;
    }>;
    railways: Array<{
      name: string;
      description: string;
      link: string;
    }>;
    highways: Array<{
      name: string;
      description: string;
      link: string;
    }>;
    parks: Array<{
      name: string;
      coords: [number, number];
      description: string;
      link: string;
      mapUrl: string;
    }>;
    travelTimes: Array<{
      from: string;
      to: Array<{
        destination: string;
        time: string;
      }>;
      nearestAirport: string | {
        name: string;
        code: string;
        time: string;
        distance: string;
        connectivity: string;
        link: string;
      };
    }>;
    quickInfo: {
      emergencyNumbers: string[];
      healthcare: {
        title: string;
        description: string;
        link: string;
      };
      transport: {
        title: string;
        description: string;
        link: string;
      };
    };
    closing: string;
    trains?: {
      header: string;
      subcopy: string;
      networks: Array<{
        id: string;
        name: string;
        icon: string;
        color: string;
        description: string;
      }>;
      closing: string;
      travelMatrix: {
        withinPuglia: Record<string, Record<string, string>>;
        toMajorCities: Record<string, Record<string, string>>;
      };
    };
  };
  costOfLiving: {
    intro?: {
      headline: string;
      lead: string;
      realityCheck: string;
      whyItWorks: string;
    };
    townPresets: Array<{
      id: string;
      label: string;
      modest: {
        rent: number;
        utilities: number;
        groceries: number;
        dining: number;
        transport: number;
      };
      normal: {
        rent: number;
        utilities: number;
        groceries: number;
        dining: number;
        transport: number;
      };
      highEnd: {
        rent: number;
        utilities: number;
        groceries: number;
        dining: number;
        transport: number;
      };
    }>;
    lifestyles: string[];
    notes?: {
      reference: string;
      sources: string[];
      links: Record<string, string>;
    };
  };
  highlights: Highlights;
  prosCons: {
    intro: {
      headline: string;
      lead: string;
      tradeoff: string;
    };
    pros: Array<{
      title: string;
      points: string[];
    }>;
    cons: Array<{
      title: string;
      points: string[];
    }>;
    finalTake: {
      headline: string;
      text: string;
      conclusion: string;
    };
  };
  ctas: string[];
  closing: {
    message: string;
    header: string;
    subtitle: string;
    shareUrl: string;
    socialMessages: SocialMessages;
  };
  // AI-generated theme from the wizard (optional for legacy regions)
  generatedTheme?: {
    primary: { h: number; s: number; l: number };
    secondary: { h: number; s: number; l: number };
    accent: { h: number; s: number; l: number };
    muted: { h: number; s: number; l: number };
    background: { h: number; s: number; l: number };
    foreground: { h: number; s: number; l: number };
    gradients?: {
      hero: string;
      warm: string;
    };
  };
}
