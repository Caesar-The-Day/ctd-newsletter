import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getGlobals, getRegionData, getRegionConfig, GlobalsData, RegionData, FeatureFlags } from '@/utils/getRegionData';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Separator } from '@/components/ui/separator';
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
import { CollaboratorFeature } from '@/components/sections/CollaboratorFeature';
import { BookCTA } from '@/components/sections/BookCTA';
import { RetirementBlueprintCTA } from '@/components/sections/RetirementBlueprintCTA';
import { SevenPercentCTA } from '@/components/sections/SevenPercentCTA';
import cafeLanguageImage from '@/assets/cafe-language-learning.jpg';

export default function RegionPage() {
  const { region } = useParams<{ region: string }>();
  const [globals, setGlobals] = useState<GlobalsData | null>(null);
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [config, setConfig] = useState<FeatureFlags | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('[RegionPage] Loading region:', region);
    Promise.all([
      getGlobals(), 
      getRegionData(region || 'piemonte'),
      getRegionConfig(region || 'piemonte')
    ])
      .then(([g, r, c]) => {
        console.log('[RegionPage] Data loaded successfully');
        setGlobals(g);
        setRegionData(r);
        setConfig(c);
      })
      .catch((err) => {
        console.error('[RegionPage] Failed to load data:', err);
        setError(true);
      });
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

  return (
    <div className="min-h-screen">
      <Header globals={globals} />
      
      {/* Breadcrumb Navigation */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 py-3">
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
                <BreadcrumbPage className="text-foreground font-medium">
                  {regionData.region.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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

      <Separator className="my-16" />

      <InteractiveMap 
        regionTitle={regionData.region.title.split(':')[0]} 
        whereData={regionData.where}
      />

      <ClimateSnapshot />

      <Separator className="my-16" />

      <TownsFeatured towns={regionData.towns.featured} />
      
      {config.showBookCTA && <BookCTA />}

      <TownsGrid towns={regionData.towns.grid} />

      <Separator className="my-16" />

      <HighlightsShowcase highlights={regionData.highlights} />

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

      {regionData.recipes && <RecipesInteractive recipes={regionData.recipes.cards} modes={regionData.recipes.modes} />}

      {config.showRetirementBlueprintCTA && <RetirementBlueprintCTA />}

      <Separator className="my-16" />

      <HealthcareInfrastructure healthcare={regionData.healthcare} />

      <CostCalculator 
        townPresets={regionData.costOfLiving.townPresets} 
        lifestyles={regionData.costOfLiving.lifestyles}
        intro={regionData.costOfLiving.intro}
        notes={regionData.costOfLiving.notes}
      />

      {config.show7PercentCTA && <SevenPercentCTA />}

      <ProsConsInteractive prosCons={regionData.prosCons} />

      <Separator className="my-16" />

      <ClosingShare
        message={regionData.closing.message}
        header={regionData.closing.header}
        subtitle={regionData.closing.subtitle}
        shareUrl={regionData.closing.shareUrl}
        socialMessages={regionData.closing.socialMessages}
      />

      <Footer globals={globals} />
    </div>
  );
}
