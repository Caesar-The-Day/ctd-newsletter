import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, Check, ArrowRight, ArrowLeft, Palette, Calendar, MapPin } from 'lucide-react';
import { ThemePreview } from './ThemePreview';
import { SectionSelector } from './SectionSelector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: any) => void;
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

const VIBE_CHIPS = [
  { label: 'Coastal beaches', value: 'coastal beaches, turquoise waters, sun-drenched' },
  { label: 'Mountain villages', value: 'alpine mountains, stone villages, dramatic peaks' },
  { label: 'Rolling hills', value: 'green rolling hills, cypress trees, pastoral landscapes' },
  { label: 'Urban sophistication', value: 'cosmopolitan, elegant, fashion and design' },
  { label: 'Island paradise', value: 'island life, crystal waters, relaxed Mediterranean' },
  { label: 'Wine country', value: 'vineyards, wine cellars, harvest traditions' },
  { label: 'Medieval charm', value: 'medieval hilltop towns, ancient history, spiritual' },
  { label: 'Volcanic drama', value: 'volcanic landscapes, rugged terrain, ancient ruins' },
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

export function RegionCreationWizard({ open, onOpenChange, onComplete, nextIssueNumber }: WizardProps) {
  const [step, setStep] = useState(1);
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const { toast } = useToast();

  // Step 1: Identity
  const [regionName, setRegionName] = useState('');
  const [slug, setSlug] = useState('');
  const [issueNumber, setIssueNumber] = useState(nextIssueNumber);
  const [publicationDate, setPublicationDate] = useState('');

  // Step 2: Vibe & Theme
  const [vibeDescription, setVibeDescription] = useState('');
  const [characteristics, setCharacteristics] = useState<string[]>([]);
  const [generatedTheme, setGeneratedTheme] = useState<GeneratedTheme | null>(null);

  // Step 3: Sections
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
      setCharacteristics([]);
      setGeneratedTheme(null);
      setEnabledSections(ALL_SECTIONS.filter(s => s.default).map(s => s.id));
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
    setVibeDescription(prev => {
      if (prev) return `${prev}, ${chipValue}`;
      return chipValue;
    });
  };

  const handleGenerateTheme = async () => {
    if (!vibeDescription.trim()) {
      toast({
        title: 'Missing description',
        description: 'Please describe the vibe of this region first.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingTheme(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-region-theme', {
        body: {
          regionName,
          vibeDescription,
          characteristics
        }
      });

      if (error) throw error;

      if (data?.success && data?.theme) {
        setGeneratedTheme(data.theme);
        
        // Auto-apply AI section suggestions
        if (data.theme.suggestedSections?.length > 0) {
          setEnabledSections(data.theme.suggestedSections);
        }

        toast({
          title: 'Theme generated!',
          description: 'AI has created a custom color palette for this region.',
        });
      } else {
        throw new Error(data?.error || 'Failed to generate theme');
      }
    } catch (error) {
      console.error('Theme generation error:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Could not generate theme',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  const handleComplete = () => {
    const wizardData = {
      regionName,
      slug,
      issueNumber,
      publicationDate,
      vibeDescription,
      characteristics,
      generatedTheme,
      enabledSections,
    };

    onComplete(wizardData);
  };

  const canProceedStep1 = regionName.trim() && slug.trim();
  const canProceedStep2 = vibeDescription.trim();
  const canProceedStep3 = enabledSections.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Region — Step {step} of 3
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

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
                  placeholder="e.g., Umbria, Liguria, Toscana"
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

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                Next: Vibe & Theme
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Vibe & Theme */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Vibe & Theme</h3>
                <p className="text-sm text-muted-foreground">Describe the character of {regionName || 'this region'}</p>
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
                      {chip.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vibeDescription">Describe the vibe *</Label>
                <Textarea
                  id="vibeDescription"
                  placeholder="e.g., Green rolling hills, medieval hilltop towns, spiritual retreats, Franciscan heritage, Italy's quiet alternative to Tuscany..."
                  value={vibeDescription}
                  onChange={(e) => setVibeDescription(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Be descriptive! This helps AI generate the perfect color palette.
                </p>
              </div>

              <Button
                onClick={handleGenerateTheme}
                disabled={isGeneratingTheme || !vibeDescription.trim()}
                className="w-full"
                variant={generatedTheme ? 'outline' : 'default'}
              >
                {isGeneratingTheme ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI is generating theme...
                  </>
                ) : generatedTheme ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Regenerate Theme
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Theme with AI
                  </>
                )}
              </Button>

              {generatedTheme && (
                <ThemePreview theme={generatedTheme} regionName={regionName} />
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
                Next: Sections
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Sections */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Content Sections</h3>
                <p className="text-sm text-muted-foreground">Choose which sections to include</p>
              </div>
            </div>

            {generatedTheme?.themeReasoning && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Suggestion:</strong> {generatedTheme.themeReasoning}
                </AlertDescription>
              </Alert>
            )}

            <SectionSelector
              sections={ALL_SECTIONS}
              enabledSections={enabledSections}
              onChange={setEnabledSections}
              aiSuggestions={generatedTheme?.suggestedSections}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleComplete} disabled={!canProceedStep3}>
                <Check className="mr-2 h-4 w-4" />
                Create {regionName || 'Region'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
