import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, Sparkles, Check, ArrowRight, ArrowLeft, Palette, Calendar, MapPin, 
  Wand2, Image, FileText, Wine, UtensilsCrossed, Church, Building2, 
  ThumbsUp, ThumbsDown, Lightbulb, RefreshCw
} from 'lucide-react';
import { ThemePreview } from './ThemePreview';
import { SectionSelector } from './SectionSelector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: WizardData) => void;
  nextIssueNumber: number;
}

interface GeneratedTheme {
  primary: { h: number; s: number; l: number };
  secondary: { h: number; s: number; l: number };
  accent: { h: number; s: number; l: number };
  muted: { h: number; s: number; l: number };
  background: { h: number; s: number; l: number };
  foreground: { h: number; s: number; l: number };
  gradients: { hero: string; warm: string };
  seasonalBackgrounds: { spring: string; summer: string; autumn: string; winter: string };
  suggestedSections: string[];
  themeReasoning: string;
}

interface RegionResearch {
  region: {
    title: string;
    tagline: string;
    coordinates: { lat: number; lng: number };
    provinces: string[];
    population: string;
  };
  character: {
    primary: string;
    secondary: string[];
    comparisons: string[];
    uniqueSelling: string;
  };
  editorialIntro: {
    headline: string;
    paragraphs: string[];
  };
  towns: {
    featured: Array<{
      name: string;
      coordinates: { lat: number; lng: number };
      bestFor: string;
      summary: string;
      fullDescription: string;
      highlights: string[];
    }>;
    grid: Array<{
      name: string;
      coordinates: { lat: number; lng: number };
      bestFor: string;
      blurb: string;
    }>;
  };
  highlights: {
    wine: { intro: string; cards: Array<{ title: string; description: string; grapeVariety?: string }> };
    food: { intro: string; cards: Array<{ title: string; description: string; signature?: boolean }> };
    culture: { intro: string; cards: Array<{ title: string; description: string; type?: string }> };
  };
  healthcare: {
    overview: string;
    mainHospitals: Array<{ name: string; city: string; type: string }>;
    nearestAirports: Array<{ name: string; code: string; city: string; distanceFromCapital: string }>;
  };
  costOfLiving: {
    overview: string;
    capitalCity: { name: string; monthlyBudget: { modest: number; comfortable: number; premium: number } };
    smallTown: { name: string; monthlyBudget: { modest: number; comfortable: number; premium: number } };
  };
  prosCons: {
    pros: Array<{ title: string; description: string }>;
    cons: Array<{ title: string; description: string }>;
  };
  mapOverlays: {
    suggested: string[];
    reasoning: string;
  };
  specialComponents: {
    suggested: string[];
    descriptions: Record<string, string>;
  };
  heroImagePrompt: string;
  seasonalImagePrompts: { spring: string; summer: string; autumn: string; winter: string };
}

interface GeneratedImages {
  hero?: string;
  spring?: string;
  summer?: string;
  autumn?: string;
  winter?: string;
  towns?: Record<string, string>;
}

export interface WizardData {
  regionName: string;
  slug: string;
  issueNumber: number;
  publicationDate: string;
  vibeDescription: string;
  generatedTheme: GeneratedTheme | null;
  research: RegionResearch | null;
  generatedImages: GeneratedImages | null;
  enabledSections: string[];
}

const VIBE_CHIPS = [
  { label: 'Coastal beaches', value: 'coastal beaches, turquoise waters, sun-drenched', icon: '🏖️' },
  { label: 'Mountain villages', value: 'alpine mountains, stone villages, dramatic peaks', icon: '🏔️' },
  { label: 'Rolling hills', value: 'green rolling hills, cypress trees, pastoral landscapes', icon: '🌄' },
  { label: 'Urban sophistication', value: 'cosmopolitan, elegant, fashion and design', icon: '🏛️' },
  { label: 'Island paradise', value: 'island life, crystal waters, relaxed Mediterranean', icon: '🏝️' },
  { label: 'Wine country', value: 'vineyards, wine cellars, harvest traditions', icon: '🍷' },
  { label: 'Medieval charm', value: 'medieval hilltop towns, ancient history, spiritual', icon: '🏰' },
  { label: 'Volcanic drama', value: 'volcanic landscapes, rugged terrain, ancient ruins', icon: '🌋' },
  { label: 'Food capital', value: 'gastronomy, local markets, food traditions, DOP products', icon: '🧀' },
  { label: 'Outdoor adventure', value: 'hiking, skiing, lakes, nature reserves', icon: '🥾' },
];

const FOCUS_AREAS = [
  { id: 'wine', label: 'Wine', icon: Wine },
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
  { id: 'culture', label: 'Culture', icon: Church },
  { id: 'outdoor', label: 'Outdoor', icon: Building2 },
  { id: 'coastal', label: 'Coastal', icon: Building2 },
  { id: 'urban', label: 'Urban', icon: Building2 },
];

const ALL_SECTIONS = [
  { id: 'hero', label: 'Hero', description: 'Main hero with parallax effect', default: true },
  { id: 'editorialIntro', label: 'Editorial Intro', description: 'Personal welcome from Cesare', default: true },
  { id: 'map', label: 'Interactive Map', description: 'Geographic visualization', default: true },
  { id: 'climate', label: 'Climate Snapshot', description: 'Weather data charts', default: true },
  { id: 'townsFeatured', label: 'Featured Towns', description: 'Top town highlights', default: true },
  { id: 'bookCTA', label: 'Book CTA', description: 'Escape Plan book promo', default: true },
  { id: 'townsGrid', label: 'Towns Grid', description: 'All towns overview', default: true },
  { id: 'highlights', label: 'Highlights', description: 'Wine, food, culture cards', default: true },
  { id: 'collaborator', label: 'Collaborator', description: 'Partner feature section', default: false },
  { id: 'quiz', label: 'Wine Quiz', description: 'Interactive wine matching', default: true },
  { id: 'recipes', label: 'Recipes', description: 'Regional cooking', default: true },
  { id: 'retirementBlueprintCTA', label: 'Retirement CTA', description: 'Consultation promo', default: true },
  { id: 'healthcare', label: 'Healthcare', description: 'Medical infrastructure', default: true },
  { id: 'costCalculator', label: 'Cost Calculator', description: 'Interactive cost tool', default: true },
  { id: 'sevenPercentCTA', label: '7% Tax CTA', description: 'Tax advantage promo', default: false },
  { id: 'prosCons', label: 'Pros & Cons', description: 'Balanced analysis', default: true },
  { id: 'closing', label: 'Closing', description: 'Share and sign-off', default: true },
];

const TOTAL_STEPS = 5;

export function RegionCreationWizard({ open, onOpenChange, onComplete, nextIssueNumber }: WizardProps) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  // Loading states
  const [isResearching, setIsResearching] = useState(false);
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [researchProgress, setResearchProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);

  // Step 1: Identity
  const [regionName, setRegionName] = useState('');
  const [slug, setSlug] = useState('');
  const [issueNumber, setIssueNumber] = useState(nextIssueNumber);
  const [publicationDate, setPublicationDate] = useState('');

  // Step 2: Character & Research
  const [vibeDescription, setVibeDescription] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [research, setResearch] = useState<RegionResearch | null>(null);

  // Step 3: Theme
  const [generatedTheme, setGeneratedTheme] = useState<GeneratedTheme | null>(null);

  // Step 4: Images
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages | null>(null);

  // Step 5: Sections
  const [enabledSections, setEnabledSections] = useState<string[]>(
    ALL_SECTIONS.filter(s => s.default).map(s => s.id)
  );

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(1);
      setRegionName('');
      setSlug('');
      setIssueNumber(nextIssueNumber);
      setPublicationDate('');
      setVibeDescription('');
      setFocusAreas([]);
      setResearch(null);
      setGeneratedTheme(null);
      setGeneratedImages(null);
      setEnabledSections(ALL_SECTIONS.filter(s => s.default).map(s => s.id));
      setResearchProgress(0);
      setImageProgress(0);
    }
  }, [open, nextIssueNumber]);

  // Auto-generate slug from region name
  useEffect(() => {
    if (regionName) {
      const generated = regionName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  }, [regionName]);

  const handleAddChip = (chipValue: string) => {
    setVibeDescription(prev => prev ? `${prev}, ${chipValue}` : chipValue);
  };

  const toggleFocusArea = (areaId: string) => {
    setFocusAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(a => a !== areaId)
        : [...prev, areaId]
    );
  };

  // Step 2: Research the region
  const handleResearch = async () => {
    if (!regionName.trim()) {
      toast({ title: 'Missing region name', variant: 'destructive' });
      return;
    }

    setIsResearching(true);
    setResearchProgress(10);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setResearchProgress(prev => Math.min(prev + 10, 90));
      }, 2000);

      const { data, error } = await supabase.functions.invoke('research-region', {
        body: { regionName, vibeDescription, focusAreas }
      });

      clearInterval(progressInterval);
      setResearchProgress(100);

      if (error) throw error;

      if (data?.success && data?.research) {
        setResearch(data.research);
        
        // Auto-populate vibe description from character analysis if empty
        if (!vibeDescription && data.research.character) {
          const autoVibe = [
            data.research.character.primary,
            ...data.research.character.secondary.slice(0, 2)
          ].join(', ');
          setVibeDescription(autoVibe);
        }

        toast({
          title: 'Research complete!',
          description: `AI has analyzed ${regionName} and generated comprehensive content.`,
        });
      } else {
        throw new Error(data?.error || 'Research failed');
      }
    } catch (error) {
      console.error('Research error:', error);
      toast({
        title: 'Research failed',
        description: error instanceof Error ? error.message : 'Could not research region',
        variant: 'destructive',
      });
    } finally {
      setIsResearching(false);
      setResearchProgress(0);
    }
  };

  // Step 3: Generate theme
  const handleGenerateTheme = async () => {
    if (!vibeDescription.trim()) {
      toast({ title: 'Missing vibe description', variant: 'destructive' });
      return;
    }

    setIsGeneratingTheme(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-region-theme', {
        body: { regionName, vibeDescription, characteristics: focusAreas }
      });

      if (error) throw error;

      if (data?.success && data?.theme) {
        setGeneratedTheme(data.theme);
        
        // Auto-apply AI section suggestions
        if (data.theme.suggestedSections?.length > 0) {
          setEnabledSections(data.theme.suggestedSections);
        }

        toast({ title: 'Theme generated!', description: 'Custom color palette created.' });
      } else {
        throw new Error(data?.error || 'Theme generation failed');
      }
    } catch (error) {
      toast({
        title: 'Theme generation failed',
        description: error instanceof Error ? error.message : 'Could not generate theme',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  // Step 4: Generate images
  const handleGenerateImages = async () => {
    if (!research?.heroImagePrompt) {
      toast({ title: 'Research first', description: 'Please complete the research step first.', variant: 'destructive' });
      return;
    }

    setIsGeneratingImages(true);
    setImageProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setImageProgress(prev => Math.min(prev + 5, 90));
      }, 3000);

      const { data, error } = await supabase.functions.invoke('generate-region-images', {
        body: {
          regionSlug: slug,
          regionName,
          heroPrompt: research.heroImagePrompt,
          seasonalPrompts: research.seasonalImagePrompts,
          generateTownThumbnails: true,
          towns: research.towns.featured.map(t => ({ name: t.name }))
        }
      });

      clearInterval(progressInterval);
      setImageProgress(100);

      if (error) throw error;

      if (data?.success && data?.images) {
        const images: GeneratedImages = {};
        for (const img of data.images) {
          if (img.type === 'hero') images.hero = img.storagePath;
          else if (img.type === 'town' && img.name) {
            if (!images.towns) images.towns = {};
            images.towns[img.name] = img.storagePath;
          }
          else images[img.type as keyof GeneratedImages] = img.storagePath;
        }
        setGeneratedImages(images);

        toast({
          title: 'Images generated!',
          description: `Created ${data.images.length} images for ${regionName}.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Image generation failed',
        description: error instanceof Error ? error.message : 'Could not generate images',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingImages(false);
      setImageProgress(0);
    }
  };

  const handleComplete = () => {
    const wizardData: WizardData = {
      regionName,
      slug,
      issueNumber,
      publicationDate,
      vibeDescription,
      generatedTheme,
      research,
      generatedImages,
      enabledSections,
    };
    onComplete(wizardData);
  };

  const canProceedStep1 = regionName.trim() && slug.trim();
  const canProceedStep2 = research !== null;
  const canProceedStep3 = generatedTheme !== null;
  const canProceedStep4 = true; // Images are optional
  const canProceedStep5 = enabledSections.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Region — Step {step} of {TOTAL_STEPS}
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s < step ? 'bg-green-500' : s === step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <ScrollArea className="flex-1 pr-4">
          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Region Identity</h3>
                  <p className="text-sm text-muted-foreground">Basic information about the new region</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regionName">Region Name *</Label>
                  <Input
                    id="regionName"
                    placeholder="e.g., Umbria, Liguria, Toscana, Emilia-Romagna"
                    value={regionName}
                    onChange={(e) => setRegionName(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">/</span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueNumber">Issue Number</Label>
                    <Input
                      id="issueNumber"
                      type="number"
                      value={issueNumber}
                      onChange={(e) => setIssueNumber(parseInt(e.target.value) || nextIssueNumber)}
                    />
                    <p className="text-xs text-muted-foreground">Auto-calculated: #{nextIssueNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publicationDate">Target Publication</Label>
                    <Input
                      id="publicationDate"
                      type="month"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Character & Research */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Wand2 className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Character & AI Research</h3>
                  <p className="text-sm text-muted-foreground">
                    Let AI research {regionName || 'the region'} and generate authentic content
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quick vibe chips</Label>
                  <div className="flex flex-wrap gap-2">
                    {VIBE_CHIPS.map((chip) => (
                      <Badge
                        key={chip.label}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleAddChip(chip.value)}
                      >
                        {chip.icon} {chip.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vibeDescription">Describe the vibe (optional)</Label>
                  <Textarea
                    id="vibeDescription"
                    placeholder="Leave blank to let AI auto-detect, or add specifics like 'Focus on food heritage' or 'Emphasize coastal lifestyle'..."
                    value={vibeDescription}
                    onChange={(e) => setVibeDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Focus areas (AI will emphasize these)</Label>
                  <div className="flex flex-wrap gap-2">
                    {FOCUS_AREAS.map(({ id, label, icon: Icon }) => (
                      <Badge
                        key={id}
                        variant={focusAreas.includes(id) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleFocusArea(id)}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {isResearching && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is researching {regionName}...</span>
                    </div>
                    <Progress value={researchProgress} />
                    <p className="text-xs text-muted-foreground">
                      Gathering real data about towns, wines, cuisine, healthcare, costs...
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleResearch}
                  disabled={isResearching || !regionName.trim()}
                  className="w-full"
                  variant={research ? 'outline' : 'default'}
                  size="lg"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Researching...
                    </>
                  ) : research ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Re-Research Region
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Research {regionName || 'Region'} with AI
                    </>
                  )}
                </Button>

                {research && (
                  <Card className="border-green-500/30 bg-green-500/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        Research Complete
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold">{research.region.title}</h4>
                        <p className="text-sm text-muted-foreground">{research.region.tagline}</p>
                      </div>

                      <Tabs defaultValue="towns" className="w-full">
                        <TabsList className="w-full grid grid-cols-5">
                          <TabsTrigger value="towns">Towns</TabsTrigger>
                          <TabsTrigger value="highlights">Highlights</TabsTrigger>
                          <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                          <TabsTrigger value="costs">Costs</TabsTrigger>
                          <TabsTrigger value="proscons">Pros/Cons</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="towns" className="mt-3 max-h-48 overflow-y-auto">
                          <div className="space-y-2">
                            {research.towns.featured.map(town => (
                              <div key={town.name} className="p-2 bg-muted/50 rounded">
                                <span className="font-medium">{town.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">— {town.bestFor}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="highlights" className="mt-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Wine:</span>
                              <ul className="mt-1 space-y-1">
                                {research.highlights.wine.cards.map(w => (
                                  <li key={w.title} className="text-muted-foreground">{w.title}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium">Food:</span>
                              <ul className="mt-1 space-y-1">
                                {research.highlights.food.cards.map(f => (
                                  <li key={f.title} className="text-muted-foreground">{f.title}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium">Culture:</span>
                              <ul className="mt-1 space-y-1">
                                {research.highlights.culture.cards.map(c => (
                                  <li key={c.title} className="text-muted-foreground">{c.title}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="healthcare" className="mt-3 max-h-48 overflow-y-auto">
                          <p className="text-sm text-muted-foreground mb-2">{research.healthcare.overview}</p>
                          <div className="space-y-1">
                            {research.healthcare.mainHospitals.map(h => (
                              <div key={h.name} className="text-sm">{h.name} ({h.city})</div>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="costs" className="mt-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">{research.costOfLiving.capitalCity.name}</span>
                              <div className="text-muted-foreground">
                                €{research.costOfLiving.capitalCity.monthlyBudget.modest} - €{research.costOfLiving.capitalCity.monthlyBudget.premium}/mo
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">{research.costOfLiving.smallTown.name}</span>
                              <div className="text-muted-foreground">
                                €{research.costOfLiving.smallTown.monthlyBudget.modest} - €{research.costOfLiving.smallTown.monthlyBudget.premium}/mo
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="proscons" className="mt-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex items-center gap-1 font-medium text-green-600 mb-1">
                                <ThumbsUp className="h-3 w-3" /> Pros
                              </div>
                              {research.prosCons.pros.map(p => (
                                <div key={p.title} className="text-muted-foreground">• {p.title}</div>
                              ))}
                            </div>
                            <div>
                              <div className="flex items-center gap-1 font-medium text-red-600 mb-1">
                                <ThumbsDown className="h-3 w-3" /> Cons
                              </div>
                              {research.prosCons.cons.map(c => (
                                <div key={c.title} className="text-muted-foreground">• {c.title}</div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      {research.specialComponents.suggested.length > 0 && (
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription>
                            <strong>AI Suggestions for {regionName}:</strong>{' '}
                            {research.specialComponents.suggested.join(', ')}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Theme */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Color Theme</h3>
                  <p className="text-sm text-muted-foreground">Generate a custom color palette for {regionName}</p>
                </div>
              </div>

              <div className="space-y-4">
                {research?.character && (
                  <Alert>
                    <AlertDescription>
                      <strong>Detected character:</strong> {research.character.primary}
                      {research.character.secondary.length > 0 && (
                        <span className="text-muted-foreground"> + {research.character.secondary.join(', ')}</span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleGenerateTheme}
                  disabled={isGeneratingTheme}
                  className="w-full"
                  variant={generatedTheme ? 'outline' : 'default'}
                  size="lg"
                >
                  {isGeneratingTheme ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating theme...
                    </>
                  ) : generatedTheme ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate Theme
                    </>
                  ) : (
                    <>
                      <Palette className="mr-2 h-4 w-4" />
                      Generate Color Theme
                    </>
                  )}
                </Button>

                {generatedTheme && (
                  <ThemePreview theme={generatedTheme} regionName={regionName} />
                )}
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Image className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Visual Assets</h3>
                  <p className="text-sm text-muted-foreground">Auto-generate hero and seasonal images</p>
                </div>
              </div>

              <div className="space-y-4">
                {research?.heroImagePrompt && (
                  <Alert>
                    <AlertDescription>
                      <strong>Hero prompt:</strong> {research.heroImagePrompt.substring(0, 150)}...
                    </AlertDescription>
                  </Alert>
                )}

                {isGeneratingImages && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Generating images for {regionName}...</span>
                    </div>
                    <Progress value={imageProgress} />
                    <p className="text-xs text-muted-foreground">
                      Creating hero, seasonal backgrounds, and town thumbnails...
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleGenerateImages}
                  disabled={isGeneratingImages || !research}
                  className="w-full"
                  variant={generatedImages ? 'outline' : 'default'}
                  size="lg"
                >
                  {isGeneratingImages ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating images...
                    </>
                  ) : generatedImages ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate Images
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
                      Generate Images with AI
                    </>
                  )}
                </Button>

                {generatedImages && (
                  <Card className="border-green-500/30 bg-green-500/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        Images Generated
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {generatedImages.hero && (
                          <div className="aspect-video bg-muted rounded overflow-hidden">
                            <img src={generatedImages.hero} alt="Hero" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {generatedImages.spring && (
                          <div className="aspect-video bg-muted rounded overflow-hidden">
                            <img src={generatedImages.spring} alt="Spring" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {generatedImages.summer && (
                          <div className="aspect-video bg-muted rounded overflow-hidden">
                            <img src={generatedImages.summer} alt="Summer" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Images are optional. You can skip this step and add images later.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Sections */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Content Sections</h3>
                  <p className="text-sm text-muted-foreground">Choose which sections to include</p>
                </div>
              </div>

              {research?.mapOverlays?.reasoning && (
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <strong>AI Suggestion:</strong> {research.mapOverlays.reasoning}
                  </AlertDescription>
                </Alert>
              )}

              <SectionSelector
                sections={ALL_SECTIONS}
                enabledSections={enabledSections}
                onChange={setEnabledSections}
                aiSuggestions={generatedTheme?.suggestedSections}
              />

              {/* Summary Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ready to Create</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Region:</span>{' '}
                      <span className="font-medium">{regionName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Issue:</span>{' '}
                      <span className="font-medium">#{issueNumber}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Research:</span>{' '}
                      <span className={research ? 'text-green-600' : 'text-muted-foreground'}>
                        {research ? '✓ Complete' : '○ Pending'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Theme:</span>{' '}
                      <span className={generatedTheme ? 'text-green-600' : 'text-muted-foreground'}>
                        {generatedTheme ? '✓ Generated' : '○ Pending'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Images:</span>{' '}
                      <span className={generatedImages ? 'text-green-600' : 'text-muted-foreground'}>
                        {generatedImages ? '✓ Generated' : '○ Skipped'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sections:</span>{' '}
                      <span className="font-medium">{enabledSections.length} enabled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={!canProceedStep5}>
              <Check className="mr-2 h-4 w-4" />
              Create {regionName || 'Region'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
