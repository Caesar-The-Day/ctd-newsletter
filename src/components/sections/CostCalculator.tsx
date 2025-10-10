import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Euro } from 'lucide-react';

interface TownPreset {
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
}

interface CostCalculatorProps {
  townPresets: TownPreset[];
  lifestyles: string[];
  intro?: {
    headline: string;
    lead: string;
    realityCheck: string;
    whyItWorks: string;
  };
  notes?: {
    reference: string;
    sources: string[];
    links: Record<string, string>;
  };
}

export function CostCalculator({ townPresets, lifestyles, intro, notes }: CostCalculatorProps) {
  const [selectedTown, setSelectedTown] = useState<string>(townPresets[0]?.id || '');
  const [lifestyleIndex, setLifestyleIndex] = useState(1); // 0=Modest, 1=Normal, 2=High-End

  const town = townPresets.find((t) => t.id === selectedTown) || townPresets[0];

  const costs = useMemo(() => {
    if (!town) return null;

    // Get costs based on lifestyle tier
    let tierCosts;
    if (lifestyleIndex === 0) {
      tierCosts = town.modest;
    } else if (lifestyleIndex === 1) {
      tierCosts = town.normal;
    } else {
      tierCosts = town.highEnd;
    }

    const total = 
      tierCosts.rent + 
      tierCosts.utilities + 
      tierCosts.groceries + 
      tierCosts.dining + 
      tierCosts.transport;

    return { ...tierCosts, total };
  }, [town, lifestyleIndex]);

  if (!costs) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header with Intro */}
          <div className="text-center mb-12">
            <Euro className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {intro?.headline || "Cost of Living Calculator"}
            </h2>
            {intro?.lead && (
              <p className="text-lg text-foreground/90 leading-relaxed mb-6 max-w-4xl mx-auto">
                {intro.lead}
              </p>
            )}
          </div>

          {/* Context Cards */}
          {intro && (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Retiree Reality Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {intro.realityCheck}
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Why It Works in Piemonte</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {intro.whyItWorks}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Calculator */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Monthly Cost Estimator (2 People)</CardTitle>
              {notes && (
                <p className="text-sm text-muted-foreground mt-2">
                  {notes.reference}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Town Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Town</label>
                <Select value={selectedTown} onValueChange={setSelectedTown}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {townPresets.map((town) => (
                      <SelectItem key={town.id} value={town.id}>
                        {town.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lifestyle Slider */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lifestyle: <span className="text-primary font-semibold">{lifestyles[lifestyleIndex]}</span>
                </label>
                <Slider
                  value={[lifestyleIndex]}
                  onValueChange={(value) => setLifestyleIndex(value[0])}
                  min={0}
                  max={2}
                  step={1}
                  className="mt-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  {lifestyles.map((style) => (
                    <span key={style}>{style}</span>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4 pt-4 border-t">
                <CostRow label="Rent" amount={costs.rent} />
                <CostRow label="Utilities" amount={costs.utilities} />
                <CostRow label="Groceries" amount={costs.groceries} />
                <CostRow label="Dining Out" amount={costs.dining} />
                <CostRow label="Transport" amount={costs.transport} />
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Monthly Total</span>
                    <span className="text-2xl font-bold text-primary">
                      €{costs.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          {notes && (
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Data sources: {notes.sources.join(', ')}
              </p>
              <div className="flex justify-center gap-4 text-xs">
                {Object.entries(notes.links).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    See latest {key} data →
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CostRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-foreground/80">{label}</span>
      <span className="font-semibold">€{amount.toLocaleString()}</span>
    </div>
  );
}
