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
  rent: [number, number];
  utilities: [number, number];
  groceries: [number, number];
  dining: [number, number];
  transport: [number, number];
}

interface CostCalculatorProps {
  townPresets: TownPreset[];
  lifestyles: string[];
}

export function CostCalculator({ townPresets, lifestyles }: CostCalculatorProps) {
  const [selectedTown, setSelectedTown] = useState<string>(townPresets[0]?.id || '');
  const [lifestyleIndex, setLifestyleIndex] = useState(1); // 0=Modest, 1=Comfortable, 2=Indulgent

  const town = townPresets.find((t) => t.id === selectedTown) || townPresets[0];

  const costs = useMemo(() => {
    if (!town) return null;

    // Interpolate based on lifestyle (0 = min, 2 = max)
    const factor = lifestyleIndex / 2;
    
    const calculate = (range: [number, number]) => {
      return Math.round(range[0] + (range[1] - range[0]) * factor);
    };

    const rent = calculate(town.rent);
    const utilities = calculate(town.utilities);
    const groceries = calculate(town.groceries);
    const dining = calculate(town.dining);
    const transport = calculate(town.transport);
    const total = rent + utilities + groceries + dining + transport;

    return { rent, utilities, groceries, dining, transport, total };
  }, [town, lifestyleIndex]);

  if (!costs) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Euro className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cost of Living Calculator
            </h2>
            <p className="text-lg text-muted-foreground">
              Estimate your monthly expenses in Piemonte
            </p>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Customize Your Budget</CardTitle>
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
