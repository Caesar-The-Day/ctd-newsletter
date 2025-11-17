import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Download, Palette, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ColorScheme {
  name: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
}

const presetSchemes: ColorScheme[] = [
  {
    name: 'Piemonte (Warm Fall)',
    primary: '25 85% 45%',
    primaryForeground: '0 0% 100%',
    secondary: '30 65% 55%',
    secondaryForeground: '0 0% 100%',
    accent: '20 75% 50%',
    accentForeground: '0 0% 100%',
    muted: '25 40% 85%',
    mutedForeground: '25 20% 35%',
  },
  {
    name: 'Coastal Blue (Liguria)',
    primary: '200 85% 45%',
    primaryForeground: '0 0% 100%',
    secondary: '195 70% 55%',
    secondaryForeground: '0 0% 100%',
    accent: '45 90% 60%',
    accentForeground: '0 0% 0%',
    muted: '200 40% 90%',
    mutedForeground: '200 20% 35%',
  },
  {
    name: 'Tuscan Gold',
    primary: '40 80% 50%',
    primaryForeground: '0 0% 100%',
    secondary: '30 70% 45%',
    secondaryForeground: '0 0% 100%',
    accent: '50 85% 55%',
    accentForeground: '0 0% 0%',
    muted: '40 40% 85%',
    mutedForeground: '40 20% 35%',
  },
  {
    name: 'Alpine Green',
    primary: '140 70% 40%',
    primaryForeground: '0 0% 100%',
    secondary: '145 60% 50%',
    secondaryForeground: '0 0% 100%',
    accent: '50 80% 55%',
    accentForeground: '0 0% 0%',
    muted: '140 30% 85%',
    mutedForeground: '140 20% 35%',
  },
];

export default function AdminColorGenerator() {
  const [schemeName, setSchemeName] = useState('custom-theme');
  const [colors, setColors] = useState<ColorScheme>(presetSchemes[0]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
    const sNorm = s / 100;
    const lNorm = l / 100;
    
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    
    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const updateColor = (key: keyof ColorScheme, hexValue: string) => {
    if (key === 'name') {
      setColors({ ...colors, name: hexValue });
      return;
    }
    const hslValue = hexToHsl(hexValue);
    setColors({ ...colors, [key]: hslValue });
  };

  const loadPreset = (preset: ColorScheme) => {
    setColors(preset);
    setSchemeName(preset.name.toLowerCase().replace(/\s+/g, '-'));
  };

  const generateCSS = () => {
    const className = `.${schemeName}`;
    return `${className} {
  --primary: ${colors.primary};
  --primary-foreground: ${colors.primaryForeground};
  --secondary: ${colors.secondary};
  --secondary-foreground: ${colors.secondaryForeground};
  --accent: ${colors.accent};
  --accent-foreground: ${colors.accentForeground};
  --muted: ${colors.muted};
  --muted-foreground: ${colors.mutedForeground};
}

${className} .dark {
  /* Optionally define dark mode variants */
}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    toast({
      title: 'Copied to Clipboard',
      description: 'CSS has been copied. Paste it into src/index.css',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSS = () => {
    const blob = new Blob([generateCSS()], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schemeName}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded',
      description: `${schemeName}.css has been downloaded`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link to="/admin/regions">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Admin
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Palette className="h-8 w-8" />
              Color Scheme Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Create custom color schemes for regional themes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Picker Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Configuration</CardTitle>
                <CardDescription>
                  Choose a preset or customize your own color scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scheme Name */}
                <div className="space-y-2">
                  <Label htmlFor="schemeName">Scheme Name (CSS Class)</Label>
                  <Input
                    id="schemeName"
                    value={schemeName}
                    onChange={(e) => setSchemeName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="e.g., liguria-theme"
                  />
                  <p className="text-xs text-muted-foreground">
                    Will be used as: .{schemeName}
                  </p>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <Label>Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {presetSchemes.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        onClick={() => loadPreset(preset)}
                        className="justify-start"
                      >
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: hslToHex(preset.primary) }}
                        />
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Tabs defaultValue="colors" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="colors" className="space-y-4 mt-4">
                    <ColorInput
                      label="Primary"
                      value={colors.primary}
                      onChange={(hex) => updateColor('primary', hex)}
                    />
                    <ColorInput
                      label="Secondary"
                      value={colors.secondary}
                      onChange={(hex) => updateColor('secondary', hex)}
                    />
                    <ColorInput
                      label="Accent"
                      value={colors.accent}
                      onChange={(hex) => updateColor('accent', hex)}
                    />
                    <ColorInput
                      label="Muted"
                      value={colors.muted}
                      onChange={(hex) => updateColor('muted', hex)}
                    />
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <ColorInput
                      label="Primary Foreground"
                      value={colors.primaryForeground}
                      onChange={(hex) => updateColor('primaryForeground', hex)}
                    />
                    <ColorInput
                      label="Secondary Foreground"
                      value={colors.secondaryForeground}
                      onChange={(hex) => updateColor('secondaryForeground', hex)}
                    />
                    <ColorInput
                      label="Accent Foreground"
                      value={colors.accentForeground}
                      onChange={(hex) => updateColor('accentForeground', hex)}
                    />
                    <ColorInput
                      label="Muted Foreground"
                      value={colors.mutedForeground}
                      onChange={(hex) => updateColor('mutedForeground', hex)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Export Section */}
            <Card>
              <CardHeader>
                <CardTitle>Export CSS</CardTitle>
                <CardDescription>
                  Copy or download your color scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{generateCSS()}</pre>
                </div>

                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} className="flex-1">
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy CSS
                      </>
                    )}
                  </Button>
                  <Button onClick={downloadCSS} variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See your colors in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={cn("space-y-6 p-6 rounded-lg border")}
                  style={{
                    '--primary': colors.primary,
                    '--primary-foreground': colors.primaryForeground,
                    '--secondary': colors.secondary,
                    '--secondary-foreground': colors.secondaryForeground,
                    '--accent': colors.accent,
                    '--accent-foreground': colors.accentForeground,
                    '--muted': colors.muted,
                    '--muted-foreground': colors.mutedForeground,
                  } as React.CSSProperties}
                >
                  {/* Buttons */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Buttons</h3>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                        Primary
                      </button>
                      <button className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
                        Secondary
                      </button>
                      <button className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
                        Accent
                      </button>
                      <button className="px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                        Outline
                      </button>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Cards</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg bg-muted">
                        <h4 className="font-medium mb-2">Muted Card</h4>
                        <p className="text-sm text-muted-foreground">
                          Sample text content
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                        <h4 className="font-medium mb-2">Primary Card</h4>
                        <p className="text-sm opacity-90">
                          Sample text content
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        Primary
                      </span>
                      <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        Secondary
                      </span>
                      <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                        Accent
                      </span>
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        Muted
                      </span>
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Typography</h3>
                    <div className="space-y-2">
                      <h1 className="text-2xl font-bold" style={{ color: `hsl(${colors.primary})` }}>
                        Heading with Primary
                      </h1>
                      <p className="text-muted-foreground">
                        This is muted foreground text that's perfect for secondary information.
                      </p>
                      <p style={{ color: `hsl(${colors.accent})` }}>
                        Accent color can highlight important information.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
    const sNorm = s / 100;
    const lNorm = l / 100;
    
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    
    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexValue = hslToHex(value);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Label htmlFor={label} className="mb-2 block">{label}</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={hexValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 h-10 p-1 cursor-pointer"
          />
          <Input
            value={hexValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>
      <div className="text-xs text-muted-foreground pt-6 font-mono">
        {value}
      </div>
    </div>
  );
}
