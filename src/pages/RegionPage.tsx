import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getGlobals, getRegionData, getRegionConfig, getRegionRegistry, GlobalsData, RegionData, FeatureFlags, RegionRegistryEntry } from '@/utils/getRegionData';
import { Header, SocialLinks } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEO } from '@/components/common/SEO';
import { ScrollProgress } from '@/components/common/ScrollProgress';
import { supabase } from '@/integrations/supabase/client';
import NotFound from './NotFound';
import { NewsletterSignup } from '@/components/sections/NewsletterSignup';

import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Map } from 'lucide-react';
import { HeroParallax } from '@/components/sections/HeroParallax';
import { EditorialIntro } from '@/components/sections/EditorialIntro';
import { InteractiveMap } from '@/components/sections/InteractiveMap';
import { WineQuiz } from '@/components/sections/WineQuiz';
import { CostCalculator } from '@/components/sections/CostCalculator';
import { TownsFeatured } from '@/components/sections/TownsFeatured';
import { TownsGrid } from '@/components/sections/TownsGrid';
import { RecipesInteractive } from '@/components/sections/RecipesInteractive';
import { ProsConsInteractive } from '@/components/sections/ProsConsInteractive';
import { ClosingShare } from '@/components/sections/ClosingShare';
import { HighlightsShowcase } from '@/components/sections/HighlightsShowcase';
import { HealthcareInfrastructure } from '@/components/sections/HealthcareInfrastructure';
import { LazioHealthcareInfrastructure } from '@/components/sections/LazioHealthcareInfrastructure';
import { FriuliHealthcareInfrastructure } from '@/components/sections/FriuliHealthcareInfrastructure';


import { ClimateSnapshot } from '@/components/sections/ClimateSnapshot';
import { MosquitoWarning } from '@/components/sections/MosquitoWarning';
import { CollaboratorFeature } from '@/components/sections/CollaboratorFeature';
import { BookCTA } from '@/components/sections/BookCTA';
import { RetirementBlueprintCTA } from '@/components/sections/RetirementBlueprintCTA';
import { SevenPercentCTA } from '@/components/sections/SevenPercentCTA';
import { SevenPercentExplainer } from '@/components/sections/SevenPercentExplainer';
import { PugliaCoastSelector } from '@/components/sections/PugliaCoastSelector';
import { CalabriaTwoCoastsSelector } from '@/components/sections/CalabriaTwoCoastsSelector';
import { CalabriaMountainEscape } from '@/components/sections/CalabriaMountainEscape';
import { CalabriaRealityCheck } from '@/components/sections/CalabriaRealityCheck';
import { MilanProximityTool } from '@/components/sections/MilanProximityTool';
import LombardiaDishExplorer from '@/components/sections/LombardiaDishExplorer';
import PanettoneQuiz from '@/components/sections/PanettoneQuiz';
import UmbriaChocolateCity from '@/components/sections/UmbriaChocolateCity';
import UmbriaFestivalCalendar from '@/components/sections/UmbriaFestivalCalendar';
import UmbriaNorciaTable from '@/components/sections/UmbriaNorciaTable';
import UmbriaWineExplorer from '@/components/sections/UmbriaWineExplorer';
import UmbriaRecipes from '@/components/sections/UmbriaRecipes';
import UmbriaLakeTrasimeno from '@/components/sections/UmbriaLakeTrasimeno';
import UmbriaRomeFlorenceCorridor from '@/components/sections/UmbriaRomeFlorenceCorridor';
import VenetoWinePourSelector from '@/components/sections/VenetoWinePourSelector';
import VenetoFoodPillars from '@/components/sections/VenetoFoodPillars';
import VenetoCultureAlive from '@/components/sections/VenetoCultureAlive';
import VeniceSerenissima from '@/components/sections/VeniceSerenissima';
import { AgnoneBellFoundry } from '@/components/sections/AgnoneBellFoundry';
import MoliseCentralItalyReach from '@/components/sections/MoliseCentralItalyReach';
import LazioThermalSprings from '@/components/sections/LazioThermalSprings';
import LazioBeyondRome from '@/components/sections/LazioBeyondRome';
import FriuliThreeSouls from '@/components/sections/FriuliThreeSouls';
import FriuliSoulQuiz from '@/components/sections/FriuliSoulQuiz';
import FriuliBoraMeter from '@/components/sections/FriuliBoraMeter';
import FriuliCrossBorder from '@/components/sections/FriuliCrossBorder';
import FriuliAfloat from '@/components/sections/FriuliAfloat';
import TriesteCoffeeDecoder from '@/components/sections/TriesteCoffeeDecoder';
import FriuliFourTongues from '@/components/sections/FriuliFourTongues';
import FriuliBorderTimeline from '@/components/sections/FriuliBorderTimeline';
import TriestePractically from '@/components/sections/TriestePractically';
import FriuliAlpsUnbooked from '@/components/sections/FriuliAlpsUnbooked';
import FriuliRebuilt from '@/components/sections/FriuliRebuilt';
import FriuliYear from '@/components/sections/FriuliYear';
import TrentinoTwoTongues from '@/components/sections/TrentinoTwoTongues';
import TrentinoHousingRules from '@/components/sections/TrentinoHousingRules';
import TrentinoAltitudeLife from '@/components/sections/TrentinoAltitudeLife';
import TrentinoAutonomyDividend from '@/components/sections/TrentinoAutonomyDividend';
import TrentinoAppleMasi from '@/components/sections/TrentinoAppleMasi';
import TrentinoDolomitesOutdoors from '@/components/sections/TrentinoDolomitesOutdoors';
import TrentinoMountainMobility from '@/components/sections/TrentinoMountainMobility';
import TrentinoSeasonClock from '@/components/sections/TrentinoSeasonClock';
import TrentinoHealthcareInfrastructure from '@/components/sections/TrentinoHealthcareInfrastructure';
import LiguriaHealthcareInfrastructure from '@/components/sections/LiguriaHealthcareInfrastructure';
import LiguriaAfloat from '@/components/sections/LiguriaAfloat';
import LiguriaVerticalCoast from '@/components/sections/LiguriaVerticalCoast';
import LiguriaOnTwoWheels from '@/components/sections/LiguriaOnTwoWheels';
import CinqueTerre from '@/components/sections/CinqueTerre';
import LiguriaTwoRivieras from '@/components/sections/LiguriaTwoRivieras';
import GenoaPractically from '@/components/sections/GenoaPractically';
import LiguriaPantry from '@/components/sections/LiguriaPantry';
import RomeResidentReality from '@/components/sections/RomeResidentReality';
import RomeMobilityExplorer from '@/components/sections/RomeMobilityExplorer';
import cafeLanguageImage from '@/assets/cafe-language-learning.jpg';

type RegionOgOverride = {
  title: string;
  description: string;
  image_url: string | null;
} | null;

export default function RegionPage() {
  const { region } = useParams<{ region: string }>();
  const [globals, setGlobals] = useState<GlobalsData | null>(null);
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [config, setConfig] = useState<FeatureFlags | null>(null);
  const [registryEntry, setRegistryEntry] = useState<RegionRegistryEntry | null>(null);
  const [ogOverride, setOgOverride] = useState<RegionOgOverride>(null);
  const [error, setError] = useState(false);
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const [regionMeta, setRegionMeta] = useState<{
    status: string;
    published_date: string | null;
    updated_at: string;
    display_name: string;
  } | null>(null);

  useEffect(() => {
    console.log('[RegionPage] Loading region:', region);
    Promise.all([
      getGlobals(), 
      getRegionData(region || 'piemonte'),
      getRegionConfig(region || 'piemonte'),
      getRegionRegistry()
    ])
      .then(([g, r, c, registry]) => {
        console.log('[RegionPage] Data loaded successfully');
        setGlobals(g);
        setRegionData(r);
        setConfig(c);
        
        // Get registry entry for current region
        if (registry && registry.regions[region || 'piemonte']) {
          setRegistryEntry(registry.regions[region || 'piemonte']);
        }
      })
      .catch((err) => {
        console.error('[RegionPage] Failed to load data:', err);
        setError(true);
      });
  }, [region]);

  useEffect(() => {
    if (!region) return;

    supabase
      .from('region_og_metadata')
      .select('title,description,image_url')
      .eq('region_slug', region)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setOgOverride(null);
          return;
        }
        setOgOverride(data);
      });
  }, [region]);

  // Drafts are only visible to admins; everyone else gets the 404 page.
  useEffect(() => {
    if (!region) return;
    let active = true;
    setAccess('checking');
    (async () => {
      const { data: row } = await supabase
        .from('regions')
        .select('status,published_date,updated_at,display_name')
        .eq('slug', region)
        .maybeSingle();
      if (!active) return;
      setRegionMeta(row ?? null);
      if (!row || row.status === 'live') {
        setAccess('allowed');
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user.id;
      if (!uid) {
        if (active) setAccess('denied');
        return;
      }
      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', uid)
        .eq('role', 'admin')
        .maybeSingle();
      if (active) setAccess(role ? 'allowed' : 'denied');
    })();
    return () => {
      active = false;
    };
  }, [region]);

  // Apply region-specific theme (AI-generated or legacy CSS classes)
  useEffect(() => {
    if (!region) return;
    
    const root = document.documentElement;
    
    // Remove all legacy theme classes first
    document.body.classList.remove('piemonte-theme', 'puglia-theme');
    
    // Check if we have an AI-generated theme in the region data
    const theme = (regionData as any)?.generatedTheme;
    
    if (theme) {
      // Apply AI-generated theme as CSS custom properties
      const hslString = (c: { h: number; s: number; l: number }) =>
        `${c.h} ${c.s}% ${c.l}%`;
      
      if (theme.primary) root.style.setProperty('--primary', hslString(theme.primary));
      if (theme.secondary) root.style.setProperty('--secondary', hslString(theme.secondary));
      if (theme.accent) root.style.setProperty('--accent', hslString(theme.accent));
      if (theme.muted) root.style.setProperty('--muted', hslString(theme.muted));
      if (theme.background) root.style.setProperty('--background', hslString(theme.background));
      if (theme.foreground) root.style.setProperty('--foreground', hslString(theme.foreground));
      
      // Derived colors for better contrast
      if (theme.primary) {
        root.style.setProperty('--primary-foreground', `${theme.primary.h} ${Math.max(5, theme.primary.s - 30)}% ${theme.primary.l > 50 ? 10 : 98}%`);
      }
      if (theme.secondary) {
        root.style.setProperty('--secondary-foreground', `${theme.secondary.h} ${Math.max(5, theme.secondary.s - 20)}% ${theme.secondary.l > 50 ? 15 : 95}%`);
      }
      if (theme.accent) {
        root.style.setProperty('--accent-foreground', `${theme.accent.h} ${Math.max(5, theme.accent.s - 20)}% ${theme.accent.l > 50 ? 10 : 98}%`);
      }
      if (theme.muted) {
        root.style.setProperty('--muted-foreground', `${theme.muted.h} ${theme.muted.s}% ${theme.muted.l > 50 ? 35 : 70}%`);
      }
      
      // Apply gradients if provided
      if (theme.gradients?.hero) {
        root.style.setProperty('--gradient-hero', theme.gradients.hero);
      }
      if (theme.gradients?.warm) {
        root.style.setProperty('--gradient-warm', theme.gradients.warm);
      }
      
      console.log('[RegionPage] Applied AI-generated theme for:', region, theme);
    } else {
      // Fall back to legacy CSS theme classes for older regions
      if (region === 'piemonte') {
        document.body.classList.add('piemonte-theme');
      }
      // Puglia/Lombardia use default theme (no class needed)
    }
    
    // Cleanup on unmount - reset to defaults
    return () => {
      document.body.classList.remove('piemonte-theme', 'puglia-theme');
      
      // Only remove custom properties if we applied them
      if (theme) {
        root.style.removeProperty('--primary');
        root.style.removeProperty('--primary-foreground');
        root.style.removeProperty('--secondary');
        root.style.removeProperty('--secondary-foreground');
        root.style.removeProperty('--accent');
        root.style.removeProperty('--accent-foreground');
        root.style.removeProperty('--muted');
        root.style.removeProperty('--muted-foreground');
        root.style.removeProperty('--background');
        root.style.removeProperty('--foreground');
        root.style.removeProperty('--gradient-hero');
        root.style.removeProperty('--gradient-warm');
      }
    };
  }, [region, regionData]);

  if (error) return <Navigate to="/404" />;
  if (access === 'denied') return <NotFound />;
  if (!globals || !regionData || !config || access === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://www.caesartheday.com/regions/${region}`;
  const regionTitle: string = regionData.region?.title || regionMeta?.display_name || region || '';
  const regionName: string = regionMeta?.display_name || registryEntry?.displayName || regionTitle.split(':')[0].trim();
  const effectiveSeoTitle = ogOverride?.title || `${regionTitle} | Veni. Vidi. Vici.`;
  const effectiveSeoDescription =
    ogOverride?.description || (regionData.region as any)?.tagline || 'Region-by-region guides to retiring in Italy.';
  const heroImage: string | undefined = (regionData.region as any)?.hero?.bannerImage;
  const effectiveOgImage =
    ogOverride?.image_url ||
    (heroImage ? (heroImage.startsWith('http') ? heroImage : `https://www.caesartheday.com/regions${heroImage}`) : undefined) ||
    'https://www.caesartheday.com/regions/og-veni-vidi-vici-sep2026.jpg';
  const isLive = regionMeta ? regionMeta.status === 'live' : true;

  return (
    <>
      <ScrollProgress />
      <SEO
        title={effectiveSeoTitle}
        description={effectiveSeoDescription}
        canonical={canonicalUrl}
        ogTitle={effectiveSeoTitle}
        ogDescription={effectiveSeoDescription}
        ogUrl={canonicalUrl}
        ogType="article"
        ogImage={effectiveOgImage}
        noindex={!isLive}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": regionTitle,
            "description": effectiveSeoDescription,
            "image": effectiveOgImage,
            ...(regionMeta?.published_date ? { "datePublished": regionMeta.published_date } : {}),
            ...(regionMeta?.updated_at ? { "dateModified": regionMeta.updated_at } : {}),
            "author": { "@type": "Person", "name": "Caesar Sedek", "url": "https://www.caesartheday.com" },
            "publisher": {
              "@type": "Organization",
              "name": "CaesarTheDay®",
              "url": "https://www.caesartheday.com",
              "logo": { "@type": "ImageObject", "url": "https://www.caesartheday.com/regions/images/shared/caesartheday-logo.png" }
            },
            "inLanguage": "en",
            "url": canonicalUrl,
            "mainEntityOfPage": canonicalUrl,
            "about": {
              "@type": "AdministrativeArea",
              "name": regionName,
              "containedInPlace": { "@type": "Country", "name": "Italy" }
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Regions", "item": "https://www.caesartheday.com/regions/" },
              { "@type": "ListItem", "position": 2, "name": regionName, "item": canonicalUrl }
            ]
          }
        ]}
      />
      <div className="min-h-screen bg-background">
        <Header globals={globals} />
      
      {/* Breadcrumb Navigation with Social Icons */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Map className="h-4 w-4" />
                      <span>Regions</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium flex items-center gap-2">
                    {regionData.region.title}
                    {registryEntry && registryEntry.status === 'draft' && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-full border border-yellow-500/30">
                        DRAFT
                      </span>
                    )}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            {/* Social Icons aligned right */}
            <div className="hidden md:flex items-center gap-2">
              <SocialLinks globals={globals} />
            </div>
          </div>
        </div>
      </div>
      
      <HeroParallax
        bannerImage={regionData.region.hero.bannerImage}
        title={regionData.region.title}
        tagline={regionData.region.tagline}
        issueNumber={regionData.region.issueNumber}
        date={regionData.region.date}
        credit={regionData.region.hero.credit}
        ambientAudio={regionData.region.hero.ambientAudio}
        brandTitle={globals.brand.heroTitle}
        brandSubtitle={globals.brand.heroSubtitle}
        brandByline={globals.brand.heroByline}
        cinematic={region === 'calabria'}
      />

      <EditorialIntro
        headline={regionData.region.intro.headline}
        byline={regionData.region.intro.byline}
        paragraphs={regionData.region.intro.paragraphs}
        portrait={regionData.region.intro.portrait}
        signature={regionData.region.intro.signature}
      />

      <NewsletterSignup campaign={region || 'home'} />

      <InteractiveMap 
        regionTitle={regionData.region.title.split(':')[0]} 
        whereData={regionData.where}
      />

      <ClimateSnapshot />

      {region === 'lazio' && <LazioBeyondRome />}



      {region === 'friuli-venezia-giulia' && (
        <>
          <FriuliThreeSouls />
          <FriuliSoulQuiz />
          <FriuliFourTongues />
        </>
      )}

      {region === 'trentino-alto-adige' && (
        <>
          <TrentinoTwoTongues />
          <TrentinoAltitudeLife />
        </>
      )}

      {region === 'liguria' && (
        <>
          <LiguriaTwoRivieras />
          <LiguriaVerticalCoast />
          <CinqueTerre />
          <LiguriaOnTwoWheels />
        </>
      )}

      {region === 'lombardia' && <MosquitoWarning />}

      <TownsFeatured towns={regionData.towns.featured} region={regionData.region.title} featuredNote={(regionData.towns as { featuredNote?: string }).featuredNote} />
      
      {config.showBookCTA && <BookCTA region={region} />}

      <TownsGrid towns={regionData.towns.grid} note={(regionData.towns as any).moreTownsNote} />

      {region === 'lazio' && (
        <>
          <RomeResidentReality />
          <RomeMobilityExplorer />
          <LazioThermalSprings />
        </>
      )}



      {region === 'friuli-venezia-giulia' && (
        <>
          <FriuliBoraMeter />
          <FriuliCrossBorder />
          <FriuliBorderTimeline />
          <TriestePractically />
          <TriesteCoffeeDecoder />
          <FriuliAlpsUnbooked />
          <FriuliRebuilt />
          <FriuliAfloat />
          <FriuliYear />
        </>
      )}


      {region === 'trentino-alto-adige' && (
        <>
          <TrentinoHousingRules />
          <TrentinoDolomitesOutdoors />
          <TrentinoAutonomyDividend />
          <TrentinoAppleMasi />
          <TrentinoSeasonClock />
        </>
      )}

      {region === 'liguria' && (
        <>
          <GenoaPractically />
          <LiguriaAfloat />
        </>
      )}

      {region === 'puglia' && <PugliaCoastSelector />}

      {region === 'calabria' && (
        <>
          <CalabriaTwoCoastsSelector />
          <CalabriaMountainEscape />
        </>
      )}

      {region === 'lombardia' && <MilanProximityTool />}

      {region === 'veneto' && <VeniceSerenissima />}

      {region === 'calabria' && <SevenPercentExplainer region={region} />}

      {config.show7PercentCTA && <SevenPercentCTA region={region} displayName={regionName} />}

      {region !== 'umbria' && region !== 'veneto' && <HighlightsShowcase highlights={regionData.highlights} />}

      {region === 'liguria' && <LiguriaPantry />}

      {region === 'molise' && <AgnoneBellFoundry />}

      {region === 'veneto' && (
        <>
          <VenetoWinePourSelector />
          <VenetoFoodPillars />
          <VenetoCultureAlive />
        </>
      )}

      {region === 'umbria' && (
        <>
          <UmbriaChocolateCity />
          <UmbriaFestivalCalendar />
          <UmbriaLakeTrasimeno />
          <UmbriaNorciaTable />
          <UmbriaWineExplorer />
          <UmbriaRecipes />
        </>
      )}

      {region === 'lombardia' && <LombardiaDishExplorer />}

      {config.showCollaborator && regionData.collaborator && (
        <CollaboratorFeature
          heading={regionData.collaborator.heading}
          paragraphs={regionData.collaborator.paragraphs}
          ctaText={regionData.collaborator.ctaText}
          ctaLink={regionData.collaborator.ctaLink}
          backgroundImage={cafeLanguageImage}
        />
      )}

      {config.showWineQuiz && regionData.wine?.quiz && <WineQuiz quizData={regionData.wine.quiz} />}

      {regionData.recipes?.cards && regionData.recipes.cards.length > 0 && (
        <RecipesInteractive 
          header={regionData.recipes.header}
          originStory={regionData.recipes.originStory}
          recipes={regionData.recipes.cards} 
          modes={regionData.recipes.modes} 
          regionName={regionData.region.title.split(':')[0].trim()}

        />
      )}

      {config.showRetirementBlueprintCTA && (
        <RetirementBlueprintCTA region={region} displayName={regionName} variant="visto-facile" />
      )}

      {region === 'lombardia' && <PanettoneQuiz />}

      {region === 'trentino-alto-adige' && <TrentinoMountainMobility />}

      {region === 'lazio' ? (
        <LazioHealthcareInfrastructure />
      ) : region === 'friuli-venezia-giulia' ? (
        <FriuliHealthcareInfrastructure />
      ) : region === 'trentino-alto-adige' ? (
        <TrentinoHealthcareInfrastructure />
      ) : region === 'liguria' ? (
        <LiguriaHealthcareInfrastructure />
      ) : (

          <HealthcareInfrastructure
            region={region}
            healthcare={{
              intro: typeof regionData.healthcare.intro === 'string' 
                ? regionData.healthcare.intro 
                : regionData.healthcare.intro?.lead,
              sectionTitle: regionData.healthcare.sectionTitle,
              sectionSubtitle: regionData.healthcare.sectionSubtitle,
              hospitalsIntro: regionData.healthcare.hospitalsIntro,
              hospitals: regionData.healthcare.hospitals,
              hospitalGroups: regionData.healthcare.hospitalGroups,
              howCareWorks: regionData.healthcare.howCareWorks,
              whyItMatters: regionData.healthcare.whyItMatters,
              infrastructure: regionData.healthcare.infrastructure,
              airports: regionData.healthcare.airports,
              trains: regionData.healthcare.trains,
              travelTimes: regionData.healthcare.travelTimes
            }} 
          />
      )}


      {region === 'umbria' && <UmbriaRomeFlorenceCorridor />}

      {region === 'molise' && <MoliseCentralItalyReach />}

      {config.showRetirementBlueprintCTA && (
        <RetirementBlueprintCTA region={region} displayName={regionName} variant="consultation" />
      )}

      <CostCalculator 
        townPresets={regionData.costOfLiving.townPresets} 
        lifestyles={regionData.costOfLiving.lifestyles}
        intro={regionData.costOfLiving.intro}
        notes={regionData.costOfLiving.notes}
      />

      <ProsConsInteractive prosCons={regionData.prosCons} />

      {region === 'calabria' && <CalabriaRealityCheck />}

      <NewsletterSignup campaign={region || 'home'} />
      <ClosingShare
        message={regionData.closing.message}
        header={regionData.closing.header}
        subtitle={regionData.closing.subtitle}
        shareUrl={regionData.closing.shareUrl}
        socialMessages={regionData.closing.socialMessages}
      />

      <Footer globals={globals} />
      </div>
    </>
  );
}
