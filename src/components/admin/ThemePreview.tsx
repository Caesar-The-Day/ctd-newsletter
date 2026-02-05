import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

interface GeneratedTheme {
  primary: HSLColor;
  secondary: HSLColor;
  accent: HSLColor;
  muted: HSLColor;
  background: HSLColor;
  foreground: HSLColor;
  gradients: { hero: string; warm: string };
  seasonalBackgrounds: { spring: string; summer: string; autumn: string; winter: string };
  suggestedSections: string[];
  themeReasoning: string;
}

interface ThemePreviewProps {
  theme: GeneratedTheme;
  regionName: string;
  onThemeChange?: (theme: GeneratedTheme) => void;
  originalTheme?: GeneratedTheme | null;
}

const hslToString = (color: HSLColor) => `hsl(${color.h}, ${color.s}%, ${color.l}%)`;

type ColorKey = 'primary' | 'secondary' | 'accent' | 'muted' | 'background' | 'foreground';

const COLOR_LABELS: { key: ColorKey; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'muted', label: 'Muted' },
  { key: 'background', label: 'Bg' },
  { key: 'foreground', label: 'Fg' },
];

function HSLEditor({
  color,
  onChange,
}: {
  color: HSLColor;
  onChange: (color: HSLColor) => void;
}) {
  const handleChange = (channel: keyof HSLColor, raw: string) => {
    const val = parseInt(raw) || 0;
    const max = channel === 'h' ? 360 : 100;
    onChange({ ...color, [channel]: Math.max(0, Math.min(max, val)) });
  };

  return (
    <div className="flex items-center gap-3 mt-2">
      {(['h', 's', 'l'] as const).map((ch) => (
        <div key={ch} className="flex items-center gap-1">
          <Label className="text-xs uppercase text-muted-foreground w-3">{ch}</Label>
          <Input
            type="number"
            min={0}
            max={ch === 'h' ? 360 : 100}
            value={color[ch]}
            onChange={(e) => handleChange(ch, e.target.value)}
            className="h-7 w-16 text-xs px-1.5"
          />
        </div>
      ))}
      <div
        className="h-7 w-7 rounded border shrink-0"
        style={{ backgroundColor: hslToString(color) }}
      />
    </div>
  );
}

export function ThemePreview({ theme, regionName, onThemeChange, originalTheme }: ThemePreviewProps) {
  const [selectedColor, setSelectedColor] = useState<ColorKey | null>(null);
  const isEditable = !!onThemeChange;

  const handleColorChange = (key: ColorKey, color: HSLColor) => {
    if (!onThemeChange) return;
    onThemeChange({ ...theme, [key]: color });
  };

  const handleGradientChange = (field: 'hero' | 'warm', value: string) => {
    if (!onThemeChange) return;
    onThemeChange({ ...theme, gradients: { ...theme.gradients, [field]: value } });
  };

  const handleReset = () => {
    if (!onThemeChange || !originalTheme) return;
    onThemeChange({ ...originalTheme });
    setSelectedColor(null);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">
          {isEditable ? 'Edit' : 'Generated'} Theme for {regionName}
        </h4>
        {isEditable && originalTheme && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1">
            <RotateCcw className="h-3 w-3" />
            Reset to AI
          </Button>
        )}
      </div>

      {/* Color swatches */}
      <div className="flex flex-wrap gap-3">
        {COLOR_LABELS.map(({ key, label }) => (
          <div
            key={key}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-opacity ${
              isEditable && selectedColor && selectedColor !== key ? 'opacity-50' : ''
            }`}
            onClick={() => isEditable && setSelectedColor(selectedColor === key ? null : key)}
          >
            <div
              className={`w-12 h-12 rounded-lg shadow-sm border-2 transition-all ${
                selectedColor === key ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: hslToString(theme[key]) }}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* HSL editor for selected color */}
      {isEditable && selectedColor && (
        <div className="bg-muted/30 rounded-lg p-3">
          <Label className="text-xs font-medium">
            {COLOR_LABELS.find((c) => c.key === selectedColor)?.label} — HSL
          </Label>
          <HSLEditor
            color={theme[selectedColor]}
            onChange={(c) => handleColorChange(selectedColor, c)}
          />
        </div>
      )}

      {/* Gradient inputs */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Hero Gradient</Label>
          {isEditable ? (
            <>
              <Input
                value={theme.gradients.hero}
                onChange={(e) => handleGradientChange('hero', e.target.value)}
                className="text-xs h-8 font-mono"
                placeholder="linear-gradient(...)"
              />
              <div className="h-6 rounded" style={{ background: theme.gradients.hero }} />
            </>
          ) : (
            <div className="h-8 rounded-lg" style={{ background: theme.gradients.hero }} />
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Warm Gradient</Label>
          {isEditable ? (
            <>
              <Input
                value={theme.gradients.warm}
                onChange={(e) => handleGradientChange('warm', e.target.value)}
                className="text-xs h-8 font-mono"
                placeholder="linear-gradient(...)"
              />
              <div className="h-6 rounded" style={{ background: theme.gradients.warm }} />
            </>
          ) : (
            <div className="h-8 rounded-lg" style={{ background: theme.gradients.warm }} />
          )}
        </div>
      </div>

      {/* Theme reasoning */}
      {theme.themeReasoning && (
        <div className="text-sm text-muted-foreground bg-muted/50 rounded p-3">
          <strong>AI Reasoning:</strong> {theme.themeReasoning}
        </div>
      )}

      {/* Seasonal suggestions */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-medium">Seasonal Background Suggestions</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(theme.seasonalBackgrounds).map(([season, desc]) => (
            <div key={season} className="bg-muted/30 rounded p-2">
              <span className="font-medium capitalize">{season}:</span>{' '}
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
