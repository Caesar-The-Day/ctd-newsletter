// Data access layer - swap JSON for Supabase later by changing these functions
export async function getGlobals() {
  const response = await fetch('/data/globals.json');
  if (!response.ok) throw new Error('Failed to load globals');
  return response.json();
}

export async function getRegionData(slug: string) {
  const response = await fetch(`/data/${slug}.json`);
  if (!response.ok) throw new Error(`Failed to load region: ${slug}`);
  return response.json();
}

export interface GlobalsData {
  brand: {
    siteTitle: string;
    motto: string;
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
    };
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
      image: string;
      ingredients: string[];
      steps: string[];
      pairWithWineProfile: string;
      links?: Array<{
        label: string;
        href: string;
      }>;
    }>;
    modes: string[];
  };
  healthcare: {
    anchors: Array<{
      name: string;
      type: string;
      mapUrl: string;
    }>;
    transport: string[];
    connectivity: string[];
  };
  costOfLiving: {
    townPresets: Array<{
      id: string;
      label: string;
      rent: [number, number];
      utilities: [number, number];
      groceries: [number, number];
      dining: [number, number];
      transport: [number, number];
    }>;
    lifestyles: string[];
  };
  highlights: Highlights;
  prosCons: {
    pros: string[];
    cons: string[];
  };
  ctas: string[];
  closing: {
    message: string;
    shareText: string;
    shareUrl: string;
  };
}
