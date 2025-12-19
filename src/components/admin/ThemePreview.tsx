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
}

const hslToString = (color: HSLColor) => `hsl(${color.h}, ${color.s}%, ${color.l}%)`;

export function ThemePreview({ theme, regionName }: ThemePreviewProps) {
  const colors = [
    { label: 'Primary', color: theme.primary },
    { label: 'Secondary', color: theme.secondary },
    { label: 'Accent', color: theme.accent },
    { label: 'Muted', color: theme.muted },
  ];

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Generated Theme for {regionName}</h4>
      </div>

      {/* Color swatches */}
      <div className="flex gap-3">
        {colors.map(({ label, color }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div
              className="w-12 h-12 rounded-lg shadow-sm border"
              style={{ backgroundColor: hslToString(color) }}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Gradient preview */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">Hero Gradient</span>
        <div
          className="h-8 rounded-lg"
          style={{ background: theme.gradients.hero }}
        />
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
