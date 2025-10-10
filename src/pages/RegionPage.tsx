import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getGlobals, getRegionData, GlobalsData, RegionData } from '@/utils/getRegionData';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
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

export default function RegionPage() {
  const { region } = useParams<{ region: string }>();
  const [globals, setGlobals] = useState<GlobalsData | null>(null);
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getGlobals(), getRegionData(region || 'piemonte')])
      .then(([g, r]) => {
        setGlobals(g);
        setRegionData(r);
      })
      .catch(() => setError(true));
  }, [region]);

  if (error) return <Navigate to="/404" />;
  if (!globals || !regionData) {
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
      
      <HeroParallax
        bannerImage={regionData.region.hero.bannerImage}
        title={regionData.region.title}
        tagline={regionData.region.tagline}
        issueNumber={regionData.region.issueNumber}
        date={regionData.region.date}
        credit={regionData.region.hero.credit}
        ambientAudio={regionData.region.hero.ambientAudio}
      />

      <EditorialIntro
        headline={regionData.region.intro.headline}
        byline={regionData.region.intro.byline}
        paragraphs={regionData.region.intro.paragraphs}
        portrait={regionData.region.intro.portrait}
      />

      <InteractiveMap />

      <TownsFeatured towns={regionData.towns.featured} />
      
      <InlineCTA globals={globals} ctaIds={['blueprint']} />

      <TownsGrid towns={regionData.towns.grid} />

      <HighlightsShowcase highlights={regionData.highlights} />

      <WineQuiz profiles={regionData.wine.quiz.profiles} />

      <RecipesInteractive recipes={regionData.recipes.cards} modes={regionData.recipes.modes} />

      <InlineCTA globals={globals} ctaIds={['vf']} />

      <HealthcareInfrastructure healthcare={regionData.healthcare} />

      <CostCalculator townPresets={regionData.costOfLiving.townPresets} lifestyles={regionData.costOfLiving.lifestyles} />

      <ProsConsInteractive pros={regionData.prosCons.pros} cons={regionData.prosCons.cons} />

      <InlineCTA globals={globals} ctaIds={['map7']} />

      <ClosingShare
        message={regionData.closing.message}
        shareText={regionData.closing.shareText}
        shareUrl={regionData.closing.shareUrl}
      />

      <Footer globals={globals} />
    </div>
  );
}
