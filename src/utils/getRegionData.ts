// Data access layer - swap JSON for Supabase later by changing these functions
export async function getGlobals() {
  const response = await fetch('/data/globals.json');
  if (!response.ok) throw new Error('Failed to load globals');
  return response.json();
}

export async function getRegionData(slug: string) {
  // Try nested path first (regions/italy/piemonte), fall back to flat structure
  console.log('[getRegionData] Loading region:', slug);
  let response = await fetch(`/data/regions/italy/${slug}.json`);
  if (!response.ok) {
    console.log('[getRegionData] Nested path failed, trying flat structure');
    response = await fetch(`/data/${slug}.json`);
  }
  if (!response.ok) {
    console.error('[getRegionData] Failed to load region:', slug);
    throw new Error(`Failed to load region: ${slug}`);
  }
  console.log('[getRegionData] Successfully loaded region:', slug);
  return response.json();
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
    intro: {
      headline: string;
      lead: string;
    };
    hospitals: Array<{
      name: string;
      location: string;
      coords: [number, number];
      description: string;
      link: string;
      mapUrl: string;
    }>;
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
}
