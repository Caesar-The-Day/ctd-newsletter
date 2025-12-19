import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getGlobals, getRegionData, getRegionConfig, getRegionRegistry, GlobalsData, RegionData, FeatureFlags, RegionRegistryEntry } from '@/utils/getRegionData';
import { Header, SocialLinks } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SEO } from '@/components/common/SEO';
import { ScrollProgress } from '@/components/common/ScrollProgress';

import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { HeroParallax } from '@/components/sections/HeroParallax';
import { EditorialIntro } from '@/components/sections/EditorialIntro';
import { InteractiveMap } from '@/components/sections/InteractiveMap';
import { WineQuiz } from '@/components/sections/WineQuiz';
import { CostCalculator } from '@/components/sections/CostCalculator';
import { TownsFeatured } from '@/components/sections/TownsFeatured';
import { TownsGrid } from '@/components/sections/TownsGrid';
import { RecipesInteractive } from '@/components/sections/RecipesInteractive';
import { ProsConsInteractive } from '@/components/sections/ProsConsInteractive';
import { InlineCTA } from '@/components/sections/InlineCTA';
import { ClosingShare } from '@/components/sections/ClosingShare';
import { HighlightsShowcase } from '@/components/sections/HighlightsShowcase';
import { HealthcareInfrastructure } from '@/components/sections/HealthcareInfrastructure';
import { ClimateSnapshot } from '@/components/sections/ClimateSnapshot';
import { MosquitoWarning } from '@/components/sections/MosquitoWarning';
import { CollaboratorFeature } from '@/components/sections/CollaboratorFeature';
import { BookCTA } from '@/components/sections/BookCTA';
import { RetirementBlueprintCTA } from '@/components/sections/RetirementBlueprintCTA';
import { SevenPercentCTA } from '@/components/sections/SevenPercentCTA';
import { PugliaCoastSelector } from '@/components/sections/PugliaCoastSelector';
import { MilanProximityTool } from '@/components/sections/MilanProximityTool';
import LombardiaDishExplorer from '@/components/sections/LombardiaDishExplorer';
import PanettoneQuiz from '@/components/sections/PanettoneQuiz';
import cafeLanguageImage from '@/assets/cafe-language-learning.jpg';

export default function RegionPage() {
  const { region } = useParams<{ region: string }>();
  const [globals, setGlobals] = useState<GlobalsData | null>(null);
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [config, setConfig] = useState<FeatureFlags | null>(null);
  const [registryEntry, setRegistryEntry] = useState<RegionRegistryEntry | null>(null);
  const [error, setError] = useState(false);

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

  // Apply region-specific theme
  useEffect(() => {
    if (!region) return;
    
    // Remove all theme classes first
    document.body.classList.remove('piemonte-theme', 'puglia-theme');
    
    // Apply region-specific theme
    if (region === 'piemonte') {
      document.body.classList.add('piemonte-theme');
    }
    // Puglia uses default theme (no class needed)
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('piemonte-theme', 'puglia-theme');
    };
  }, [region]);

  if (error) return <Navigate to="/404" />;
  if (!globals || !regionData || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const seoConfig = {
    piemonte: {
      title: 'Retiring in Piemonte | Veni. Vidi. Vici. Region Guide',
      description: 'Discover Piemonte through an immersive, data-rich regional guide for smart retirees: best towns to live in, cost of living, healthcare access, wine culture, infrastructure, and interactive tools to plan your Italian chapter with confidence.',
      keywords: ['retire in Piemonte', 'best towns in Piemonte', 'Northern Italy retirement', 'Piemonte cost of living', 'Piemonte wine regions', 'retiring in Italy', 'Italian regions guide'],
      ogImage: 'https://news.caesartheday.com/images/piemonte-og.jpg',
      ogDescription: 'Explore Piemonte like a local — from walkable towns and cost-of-living insights to healthcare, wine culture, and interactive planning tools. A smart retiree\'s guide to Northern Italy.',
    },
    puglia: {
      title: 'Retiring in Puglia | Veni. Vidi. Vici. Region Guide',
      description: 'Discover Puglia like a local — towns worth living in, cost of living, food, wine, healthcare, and everything that makes this region one of Italy\'s best choices for retirement. An interactive guide that goes far beyond travel blogs.',
      keywords: ['retire in Puglia', 'coastal towns in Puglia', 'Puglia cost of living', 'healthcare in Puglia', 'Southern Italy retirement', 'retiring in Italy', 'Italian regions guide'],
      ogImage: 'https://news.caesartheday.com/puglia-og-2.jpg',
      ogDescription: 'Discover Puglia like a local — towns worth living in, cost of living, food, wine, healthcare, and everything that makes this region one of Italy\'s best choices for retirement. An interactive guide that goes far beyond travel blogs.',
    }
  };

  type SEOConfig = {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    ogDescription?: string;
  };

  const defaultSEO: SEOConfig = {
    title: 'Veni. Vidi. Vici. | Your Guide to Conquering Retirement in Italy',
    description: 'Region-by-region guides to retiring in Italy.',
    keywords: ['retirement in Italy', 'Italian regions guide'],
    ogImage: 'https://news.caesartheday.com/og-veni-vidi-vici.jpg',
  };

  const currentSEO: SEOConfig = (region && seoConfig[region as keyof typeof seoConfig]) || defaultSEO;

  return (
    <>
      <ScrollProgress />
      <SEO
        title={currentSEO.title}
        description={currentSEO.description}
        canonical={`https://news.caesartheday.com/${region}`}
        ogTitle={currentSEO.title}
        ogDescription={currentSEO.ogDescription || currentSEO.description}
        ogUrl={`https://news.caesartheday.com/${region}`}
        ogType="article"
        ogImage={currentSEO.ogImage}
        keywords={currentSEO.keywords}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `Veni. Vidi. Vici. ${regionData.region.title} – Retiring in ${regionData.region.title}, Italy`,
          "description": currentSEO.description,
          "author": {
            "@type": "Person",
            "name": "Caesar Sedek"
          },
          "publisher": {
            "@type": "Organization",
            "name": "CaesarTheDay™",
            "url": "https://www.caesartheday.com"
          },
          "url": `https://news.caesartheday.com/${region}`,
          "mainEntityOfPage": `https://news.caesartheday.com/${region}`
        }}
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
                      <Home className="h-4 w-4" />
                      <span>Home</span>
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
      />

      <EditorialIntro
        headline={regionData.region.intro.headline}
        byline={regionData.region.intro.byline}
        paragraphs={regionData.region.intro.paragraphs}
        portrait={regionData.region.intro.portrait}
        signature={regionData.region.intro.signature}
      />

      <InteractiveMap 
        regionTitle={regionData.region.title.split(':')[0]} 
        whereData={regionData.where}
      />

      <ClimateSnapshot />

      {region === 'lombardia' && <MosquitoWarning />}

      <TownsFeatured towns={regionData.towns.featured} />
      
      {config.showBookCTA && <BookCTA />}

      <TownsGrid towns={regionData.towns.grid} />

      {region === 'puglia' && <PugliaCoastSelector />}

      {region === 'lombardia' && <MilanProximityTool />}

      {config.show7PercentCTA && <SevenPercentCTA />}

      <HighlightsShowcase highlights={regionData.highlights} />

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

      {config.showWineQuiz && regionData.wine && <WineQuiz quizData={regionData.wine.quiz} />}

      {regionData.recipes && (
        <RecipesInteractive 
          header={regionData.recipes.header}
          originStory={regionData.recipes.originStory}
          recipes={regionData.recipes.cards} 
          modes={regionData.recipes.modes} 
        />
      )}

      {config.showRetirementBlueprintCTA && <RetirementBlueprintCTA region={region} />}

      {region === 'lombardia' && <PanettoneQuiz />}

          <HealthcareInfrastructure
            region={region}
            healthcare={{
              intro: typeof regionData.healthcare.intro === 'string' 
                ? regionData.healthcare.intro 
                : regionData.healthcare.intro.lead,
              hospitals: regionData.healthcare.hospitals,
              airports: regionData.healthcare.airports,
              trains: regionData.healthcare.trains,
              travelTimes: regionData.healthcare.travelTimes
            }} 
          />

      <CostCalculator 
        townPresets={regionData.costOfLiving.townPresets} 
        lifestyles={regionData.costOfLiving.lifestyles}
        intro={regionData.costOfLiving.intro}
        notes={regionData.costOfLiving.notes}
      />

      <ProsConsInteractive prosCons={regionData.prosCons} />

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
