/**
 * Transforms raw AI research data into the exact shapes expected by
 * the newsletter's React components.
 *
 * This module is the single source of truth for mapping the flat AI
 * response into the nested RegionData type.
 */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function googleMapsUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(name + ' Italy')}/@${lat},${lng},13z`;
}

interface WizardData {
  slug: string;
  regionName: string;
  issueNumber: number;
  research: any;
  generatedTheme?: any;
  generatedImages?: { hero?: string; seasonal?: Record<string, string> };
  enabledSections?: string[];
  publicationDate?: string;
  vibeDescription?: string;
}

/**
 * Merges AI research data with the scaffold template to produce
 * a complete region_data JSONB object ready for the database.
 */
export function mergeResearchIntoRegionData(
  scaffoldedData: Record<string, any>,
  wizardData: WizardData
): Record<string, any> {
  const r = wizardData.research;
  if (!r) return scaffoldedData;

  const slug = wizardData.slug;
  const region = scaffoldedData.region || {};
  const where = scaffoldedData.where || {};

  return {
    ...scaffoldedData,
    region: buildRegionSection(region, r, wizardData),
    where: buildWhereSection(where, r, slug),
    towns: buildTownsSection(r, slug),
    highlights: buildHighlightsSection(r),
    wine: buildWineSection(r),
    recipes: buildRecipesSection(r, slug),
    healthcare: buildHealthcareSection(r, scaffoldedData.healthcare),
    costOfLiving: buildCostOfLivingSection(r),
    prosCons: buildProsConsSection(r),
    closing: buildClosingSection(r, slug, wizardData.regionName),
    generatedTheme: wizardData.generatedTheme,
  };
}

// ─── Region & Hero ──────────────────────────────────────────────

function buildRegionSection(existing: any, r: any, wizardData: WizardData) {
  return {
    ...existing,
    title: r.region?.title || existing.title,
    tagline: r.region?.tagline || existing.tagline,
    intro: {
      ...(existing.intro || {}),
      headline: r.editorialIntro?.headline || existing.intro?.headline,
      paragraphs: r.editorialIntro?.paragraphs || existing.intro?.paragraphs,
    },
    hero: {
      ...(existing.hero || {}),
      bannerImage: wizardData.generatedImages?.hero || existing.hero?.bannerImage,
    },
  };
}

// ─── Where / Map ────────────────────────────────────────────────

function buildWhereSection(existing: any, r: any, slug: string) {
  const allTowns = [
    ...(r.towns?.featured || []).map((t: any) => ({ ...t, type: 'anchor' })),
    ...(r.towns?.grid || []).map((t: any) => ({ ...t, type: 'secondary' })),
  ];

  const markers = allTowns
    .filter((t: any) => t.coordinates?.lat && t.coordinates?.lng)
    .map((t: any) => ({
      id: slugify(t.name),
      name: t.name,
      coords: [t.coordinates.lat, t.coordinates.lng] as [number, number],
      photo: `/images/${slug}/${slugify(t.name)}.jpg`,
      blurb: t.summary || t.blurb || '',
      type: t.type,
    }));

  return {
    ...existing,
    map: {
      ...(existing.map || {}),
      center: r.region?.coordinates
        ? [r.region.coordinates.lat, r.region.coordinates.lng]
        : existing.map?.center,
      markers,
    },
    tabs: r.geographyTabs || existing.tabs,
  };
}

// ─── Towns ──────────────────────────────────────────────────────

function buildTownsSection(r: any, slug: string) {
  const featured = (r.towns?.featured || []).map((t: any) => ({
    id: slugify(t.name),
    name: t.name,
    bestFor: t.bestFor || '',
    photo: `/images/${slug}/${slugify(t.name)}-featured.jpg`,
    summary: t.summary || '',
    fullDescription: t.fullDescription || '',
    mapUrl: t.coordinates
      ? googleMapsUrl(t.coordinates.lat, t.coordinates.lng, t.name)
      : `https://www.google.com/maps/search/${encodeURIComponent(t.name + ' Italy')}`,
    gallery: [],
    highlights: t.highlights || [],
    eligible7Percent: t.eligible7Percent || false,
  }));

  const grid = (r.towns?.grid || []).map((t: any) => ({
    id: slugify(t.name),
    name: t.name,
    bestFor: t.bestFor || '',
    photo: `/images/${slug}/${slugify(t.name)}.jpg`,
    mapUrl: t.coordinates
      ? googleMapsUrl(t.coordinates.lat, t.coordinates.lng, t.name)
      : `https://www.google.com/maps/search/${encodeURIComponent(t.name + ' Italy')}`,
    blurb: t.blurb || '',
    fullDescription: t.fullDescription || '',
    eligible7Percent: t.eligible7Percent || false,
  }));

  return { featured, grid };
}

// ─── Highlights ─────────────────────────────────────────────────

function buildHighlightsSection(r: any) {
  const mapCards = (cards: any[] = []) =>
    cards.map((c: any) => ({
      id: slugify(c.title),
      title: c.title,
      subtitle: c.subtitle || c.grapeVariety || c.type || '',
      image: '',  // placeholder — images sourced separately
      description: c.description || '',
      links: [],
    }));

  const wine = r.highlights?.wine || {};
  const food = r.highlights?.food || {};
  const culture = r.highlights?.culture || {};

  return {
    wine: {
      title: wine.title || 'WINE — Regional Wines',
      intro: wine.intro || '',
      backgroundImage: '',
      cards: mapCards(wine.cards),
    },
    food: {
      title: food.title || 'FOOD — Regional Cuisine',
      intro: food.intro || '',
      backgroundImage: '',
      cards: mapCards(food.cards),
    },
    culture: {
      title: culture.title || 'CULTURE — Regional Heritage',
      intro: culture.intro || '',
      backgroundImage: '',
      cards: mapCards(culture.cards),
    },
  };
}

// ─── Wine Quiz ──────────────────────────────────────────────────

function buildWineSection(r: any) {
  const profiles = (r.wineQuiz?.profiles || []).map((p: any) => ({
    id: p.id || slugify(p.label || 'unknown'),
    label: p.label || '',
    result: {
      name: p.result?.name || p.label || '',
      note: p.result?.note || '',
      image: '',  // placeholder
    },
  }));

  if (profiles.length === 0) return undefined;

  return { quiz: { profiles } };
}

// ─── Recipes ────────────────────────────────────────────────────

function buildRecipesSection(r: any, slug: string) {
  const recipes = r.recipes || [];
  if (recipes.length === 0) return { cards: [], modes: ['Rustic', 'Refined'] };

  const modes = [...new Set(recipes.map((rec: any) => rec.mode || 'Rustic'))] as string[];

  const cards = recipes.map((rec: any) => ({
    id: slugify(rec.title),
    title: rec.title,
    mode: rec.mode || 'Rustic',
    image: `/images/${slug}/${slugify(rec.title)}.jpg`,
    story: rec.story || '',
    whyRefined: rec.whyRefined || undefined,
    ingredients: rec.ingredients || [],
    steps: rec.steps || [],
    servingSuggestion: rec.servingSuggestion || undefined,
    pairWithWineProfile: rec.winePairing || '',
    winePairing: rec.winePairing || '',
  }));

  return {
    header: {
      title: 'Regional Recipes',
      subtitle: `Authentic flavours from ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
    },
    cards,
    modes: modes.length > 0 ? modes : ['Rustic', 'Refined'],
  };
}

// ─── Healthcare & Infrastructure ────────────────────────────────

function buildHealthcareSection(r: any, existing: any) {
  const hc = r.healthcare || {};
  
  const hospitals = (hc.hospitals || hc.mainHospitals || []).map((h: any) => ({
    name: h.name,
    location: h.city || h.location || '',
    type: h.type || 'city',
    description: h.description || '',
    link: '',
    mapLink: '',
    coords: h.coordinates ? [h.coordinates.lat, h.coordinates.lng] : undefined,
  }));

  const airports = (hc.airports || hc.nearestAirports || []).map((a: any) => ({
    name: a.name,
    code: a.code || '',
    description: a.description || `${a.distanceFromCapital || ''} from the regional capital`,
    link: '',
    mapUrl: a.coordinates
      ? googleMapsUrl(a.coordinates.lat, a.coordinates.lng, a.name)
      : '',
    coords: a.coordinates ? [a.coordinates.lat, a.coordinates.lng] : undefined,
  }));

  const railways = (hc.railways || []).map((rail: any) => ({
    name: rail.name,
    description: rail.description || '',
    link: '',
  }));

  const highways = (hc.highways || []).map((hw: any) => ({
    name: hw.name,
    description: hw.description || '',
    link: '',
  }));

  const parks = (hc.parks || []).map((p: any) => ({
    name: p.name,
    description: p.description || '',
    link: '',
    mapUrl: p.coordinates
      ? googleMapsUrl(p.coordinates.lat, p.coordinates.lng, p.name)
      : '',
    coords: p.coordinates ? [p.coordinates.lat, p.coordinates.lng] : undefined,
  }));

  const travelTimes = (hc.travelTimes || []).map((tt: any) => ({
    from: tt.from,
    to: (tt.destinations || []).map((d: any) => ({
      destination: d.to || d.destination || '',
      time: d.time || '',
    })),
    nearestAirport: tt.nearestAirport || '',
  }));

  return {
    ...(existing || {}),
    intro: {
      headline: 'Healthcare & Infrastructure',
      lead: hc.overview || '',
    },
    hospitals,
    airports,
    railways,
    highways,
    parks,
    travelTimes,
    quickInfo: existing?.quickInfo || {
      emergencyNumbers: ['118 – Medical Emergency', '112 – Police', '115 – Fire'],
      healthcare: { title: 'Register for Healthcare', description: 'Enroll in the SSN (Servizio Sanitario Nazionale) at your local ASL office.', link: '#' },
      transport: { title: 'Transport Info', description: 'Regional transport information.', link: '#' },
    },
    closing: existing?.closing || '',
  };
}

// ─── Cost of Living ─────────────────────────────────────────────

function buildCostOfLivingSection(r: any) {
  const col = r.costOfLiving || {};

  const townPresets = (col.towns || []).map((t: any) => ({
    id: slugify(t.name),
    label: t.name,
    modest: {
      rent: t.modest?.rent || 500,
      utilities: t.modest?.utilities || 150,
      groceries: t.modest?.groceries || 300,
      dining: t.modest?.dining || 150,
      transport: t.modest?.transport || 80,
    },
    normal: {
      rent: t.normal?.rent || 700,
      utilities: t.normal?.utilities || 180,
      groceries: t.normal?.groceries || 400,
      dining: t.normal?.dining || 250,
      transport: t.normal?.transport || 100,
    },
    highEnd: {
      rent: t.highEnd?.rent || 1100,
      utilities: t.highEnd?.utilities || 220,
      groceries: t.highEnd?.groceries || 500,
      dining: t.highEnd?.dining || 400,
      transport: t.highEnd?.transport || 150,
    },
  }));

  // Fallback: if AI returned flat budget numbers (old format), transform them
  if (townPresets.length === 0 && col.capitalCity) {
    const transformFlat = (name: string, budget: any) => {
      if (!budget) return null;
      const splitBudget = (total: number) => ({
        rent: Math.round(total * 0.38),
        utilities: Math.round(total * 0.10),
        groceries: Math.round(total * 0.22),
        dining: Math.round(total * 0.18),
        transport: Math.round(total * 0.12),
      });
      return {
        id: slugify(name),
        label: name,
        modest: splitBudget(budget.modest || 1500),
        normal: splitBudget(budget.comfortable || 2200),
        highEnd: splitBudget(budget.premium || 3500),
      };
    };

    const cap = transformFlat(col.capitalCity.name, col.capitalCity.monthlyBudget);
    const small = transformFlat(col.smallTown?.name, col.smallTown?.monthlyBudget);
    if (cap) townPresets.push(cap);
    if (small) townPresets.push(small);
  }

  return {
    intro: {
      headline: 'Cost of Living',
      lead: col.overview || '',
      realityCheck: col.realityCheck || '',
      whyItWorks: col.whyItWorks || '',
    },
    townPresets,
    lifestyles: ['Modest', 'Average', 'High-End'],
    notes: {
      reference: 'Estimates based on 2025 data for a retired couple.',
      sources: ['Numbeo', 'ISTAT', 'Local expat communities'],
      links: {},
    },
  };
}

// ─── Pros & Cons ────────────────────────────────────────────────

function buildProsConsSection(r: any) {
  const pc = r.prosCons || {};

  const mapItems = (items: any[] = []) =>
    items.map((item: any) => ({
      title: item.title || '',
      points: item.points || (item.description ? [item.description] : []),
    }));

  return {
    intro: pc.intro || {
      headline: 'The Honest Assessment',
      lead: '',
      tradeoff: '',
    },
    pros: mapItems(pc.pros),
    cons: mapItems(pc.cons),
    finalTake: pc.finalTake || {
      headline: 'The Bottom Line',
      text: '',
      conclusion: '',
    },
  };
}

// ─── Closing & Social ───────────────────────────────────────────

function buildClosingSection(r: any, slug: string, regionName: string) {
  const closing = r.closing || {};
  const social = closing.socialMessages || {};

  return {
    header: `Until Next Time from ${regionName}`,
    subtitle: 'Share this newsletter with fellow Italy dreamers',
    message: closing.message || `That's a wrap on ${regionName}. Until next time — Cesare`,
    shareUrl: `https://news.caesartheday.com/${slug}`,
    socialMessages: {
      facebook: social.facebook || `Discover ${regionName} with Caesar the Day!`,
      threads: social.threads || `Exploring ${regionName} for retirement — great insights here.`,
      bluesky: social.bluesky || `Check out this deep dive into ${regionName}, Italy 🇮🇹`,
      whatsapp: social.whatsapp || `I thought you'd enjoy this guide to ${regionName}, Italy.`,
      pinterest: {
        title: social.pinterest?.title || `${regionName} Retirement Guide`,
        description: social.pinterest?.description || `Everything you need to know about retiring in ${regionName}, Italy.`,
      },
    },
  };
}
