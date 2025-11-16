import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Palette, Type, Maximize2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { getGlobals, GlobalsData } from "@/utils/getRegionData";

const DesignSystem = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [globals, setGlobals] = useState<GlobalsData | null>(null);

  useEffect(() => {
    getGlobals().then(setGlobals);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colors = [
    { name: "Background", value: "200 30% 97%", className: "bg-background text-foreground" },
    { name: "Foreground", value: "210 20% 15%", className: "bg-foreground text-background" },
    { name: "Primary", value: "210 85% 35%", className: "bg-primary text-primary-foreground" },
    { name: "Secondary", value: "200 75% 55%", className: "bg-secondary text-secondary-foreground" },
    { name: "Accent", value: "185 80% 50%", className: "bg-accent text-accent-foreground" },
    { name: "Muted", value: "200 20% 90%", className: "bg-muted text-muted-foreground" },
    { name: "Card", value: "0 0% 100%", className: "bg-card text-card-foreground border border-border" },
    { name: "Destructive", value: "0 84% 60%", className: "bg-destructive text-destructive-foreground" },
    { name: "Border", value: "200 20% 85%", className: "bg-border text-foreground" },
  ];

  const shadows = [
    { name: "Soft", className: "shadow-[0_4px_16px_hsl(210_20%_15%/0.08)]" },
    { name: "Medium", className: "shadow-[0_8px_24px_hsl(210_20%_15%/0.12)]" },
    { name: "Strong", className: "shadow-[0_16px_48px_hsl(210_20%_15%/0.16)]" },
  ];

  const spacing = [
    { name: "xs", value: "0.5rem", className: "p-2" },
    { name: "sm", value: "0.75rem", className: "p-3" },
    { name: "md", value: "1rem", className: "p-4" },
    { name: "lg", value: "1.5rem", className: "p-6" },
    { name: "xl", value: "2rem", className: "p-8" },
    { name: "2xl", value: "3rem", className: "p-12" },
  ];

  if (!globals) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header globals={globals} />
      
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient">
            Design System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive living style guide showcasing the visual language, components, 
            and patterns that power Caesar the Day's editorial newsletter experience.
          </p>
        </div>

        {/* Color Palette */}
        <section className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-8">
            <Palette className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold">Color Palette</h2>
          </div>
          
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Mediterranean coastal colors inspired by Puglia's azure waters and sun-bleached architecture. 
            All colors use HSL format for consistent theming.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colors.map((color) => (
              <Card 
                key={color.name}
                className="overflow-hidden hover-lift cursor-pointer"
                onClick={() => copyToClipboard(color.value, color.name)}
              >
                <div className={`h-32 ${color.className} flex items-center justify-center`}>
                  <span className="font-mono text-sm opacity-80">
                    {copiedColor === color.name ? "Copied!" : "Click to copy"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">{color.name}</h3>
                  <p className="font-mono text-sm text-muted-foreground">
                    hsl({color.value})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    var(--{color.name.toLowerCase().replace(" ", "-")})
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Gradient Hero</h3>
              <div className="h-24 rounded-lg mb-3" style={{ background: "var(--gradient-hero)" }} />
              <p className="font-mono text-xs text-muted-foreground">
                linear-gradient(135deg, primary → accent)
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-bold mb-4">Gradient Warm</h3>
              <div className="h-24 rounded-lg mb-3" style={{ background: "var(--gradient-warm)" }} />
              <p className="font-mono text-xs text-muted-foreground">
                linear-gradient(180deg, background → muted)
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-bold mb-4">Gradient Overlay</h3>
              <div className="h-24 rounded-lg mb-3 relative">
                <img 
                  src="/images/piemonte/hero-vineyards.jpg" 
                  alt="Example" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 rounded-lg" style={{ background: "var(--gradient-overlay)" }} />
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                linear-gradient(180deg, transparent → dark)
              </p>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Typography */}
        <section className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-8">
            <Type className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold">Typography</h2>
          </div>

          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Editorial typography using Inter with a focus on readability and hierarchy. 
            Text shadows enhance legibility over images.
          </p>

          <Card className="p-8 space-y-8">
            <div>
              <h1 className="mb-2">Heading 1 - Display</h1>
              <p className="font-mono text-sm text-muted-foreground">
                text-5xl md:text-7xl font-bold tracking-tight
              </p>
            </div>

            <div>
              <h2 className="mb-2">Heading 2 - Section</h2>
              <p className="font-mono text-sm text-muted-foreground">
                text-4xl md:text-5xl font-bold tracking-tight
              </p>
            </div>

            <div>
              <h3 className="mb-2">Heading 3 - Subsection</h3>
              <p className="font-mono text-sm text-muted-foreground">
                text-3xl md:text-4xl font-bold tracking-tight
              </p>
            </div>

            <div>
              <p className="text-xl mb-2 leading-relaxed">
                Large Body - This is the primary text size for introductions and editorial content. 
                It uses generous line-height for enhanced readability.
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                text-xl leading-relaxed
              </p>
            </div>

            <div>
              <p className="text-base mb-2 leading-relaxed">
                Body Text - Standard paragraph text used throughout the application. 
                Comfortable reading with balanced spacing and weight.
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                text-base leading-relaxed
              </p>
            </div>

            <div>
              <p className="text-sm mb-2 text-muted-foreground">
                Small Text - Used for captions, metadata, and secondary information. 
                Muted color reduces visual weight.
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                text-sm text-muted-foreground
              </p>
            </div>

            <div className="bg-primary text-primary-foreground p-6 rounded-lg">
              <p className="text-2xl font-bold mb-2" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}>
                Text with Shadow
              </p>
              <p className="font-mono text-sm opacity-80">
                Used on hero images for readability: textShadow: "2px 2px 8px rgba(0,0,0,0.5)"
              </p>
            </div>
          </Card>
        </section>

        <Separator className="my-16" />

        {/* Spacing */}
        <section className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-8">
            <Maximize2 className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold">Spacing Scale</h2>
          </div>

          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Consistent spacing creates rhythm and breathing room throughout the layout.
          </p>

          <Card className="p-8">
            <div className="space-y-6">
              {spacing.map((space) => (
                <div key={space.name} className="flex items-center gap-6">
                  <div className="w-24 text-right">
                    <span className="font-mono font-bold">{space.name}</span>
                    <p className="text-xs text-muted-foreground">{space.value}</p>
                  </div>
                  <div className="flex-1">
                    <div className={`bg-primary ${space.className} inline-block rounded`}>
                      <div className="bg-accent h-4 w-4 rounded" />
                    </div>
                  </div>
                  <div className="w-48">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{space.className}</code>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-8" />

            <div className="space-y-4">
              <h3 className="font-bold text-xl">Common Spacing Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-sm mb-2">Section Padding</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">py-8 md:py-12 px-4</code>
                </div>
                <div>
                  <p className="font-mono text-sm mb-2">Card Padding</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">p-6</code>
                </div>
                <div>
                  <p className="font-mono text-sm mb-2">Container Max Width</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">max-w-6xl mx-auto</code>
                </div>
                <div>
                  <p className="font-mono text-sm mb-2">Grid Gap</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">gap-6 md:gap-8</code>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <Separator className="my-16" />

        {/* Shadows */}
        <section className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold">Elevation & Shadows</h2>
          </div>

          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Subtle shadows create depth and hierarchy without overwhelming the coastal aesthetic.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shadows.map((shadow) => (
              <Card key={shadow.name} className={`p-8 ${shadow.className}`}>
                <h3 className="font-bold text-xl mb-4">Shadow {shadow.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {shadow.name === "Soft" && "Subtle elevation for cards and panels"}
                  {shadow.name === "Medium" && "Moderate depth for hover states"}
                  {shadow.name === "Strong" && "Prominent elevation for modals"}
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                  var(--shadow-{shadow.name.toLowerCase()})
                </code>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Component Patterns */}
        <section className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold">Component Patterns</h2>
          </div>

          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Reusable UI components built with consistent styling and behavior.
          </p>

          {/* Buttons */}
          <Card className="p-8 mb-6">
            <h3 className="font-bold text-2xl mb-6">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="link">Link Button</Button>
            </div>
            
            <Separator className="my-6" />
            
            <h4 className="font-bold mb-4">Button Sizes</h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Badges */}
          <Card className="p-8 mb-6">
            <h3 className="font-bold text-2xl mb-6">Badges</h3>
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </Card>

          {/* Alerts */}
          <Card className="p-8 mb-6">
            <h3 className="font-bold text-2xl mb-6">Alerts</h3>
            <div className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your changes have been saved successfully.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            </div>
          </Card>

          {/* Cards */}
          <Card className="p-8">
            <h3 className="font-bold text-2xl mb-6">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h4 className="font-bold mb-2">Basic Card</h4>
                <p className="text-sm text-muted-foreground">
                  Standard card with padding and border
                </p>
              </Card>

              <Card className="p-6 hover-lift">
                <h4 className="font-bold mb-2">Hover Lift Card</h4>
                <p className="text-sm text-muted-foreground">
                  Hover for smooth elevation effect
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <h4 className="font-bold mb-2">Gradient Card</h4>
                <p className="text-sm opacity-90">
                  Card with gradient background
                </p>
              </Card>
            </div>
          </Card>
        </section>

        <Separator className="my-16" />

        {/* Animations */}
        <section className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold">Animations</h2>
          </div>

          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Smooth, purposeful animations that enhance the user experience without distraction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8">
              <h3 className="font-bold text-xl mb-4">Fade In Up</h3>
              <div className="animate-fade-in-up">
                <div className="bg-primary text-primary-foreground p-4 rounded-lg">
                  <p className="font-medium">Animated Element</p>
                  <p className="text-sm opacity-90 mt-1">fadeInUp 0.6s ease-out</p>
                </div>
              </div>
              <code className="text-xs bg-muted px-2 py-1 rounded block mt-4">
                animate-fade-in-up
              </code>
            </Card>

            <Card className="p-8">
              <h3 className="font-bold text-xl mb-4">Hover Lift</h3>
              <div className="hover-lift bg-secondary text-secondary-foreground p-4 rounded-lg">
                <p className="font-medium">Hover Me</p>
                <p className="text-sm opacity-90 mt-1">translateY(-4px) + shadow</p>
              </div>
              <code className="text-xs bg-muted px-2 py-1 rounded block mt-4">
                hover-lift
              </code>
            </Card>

            <Card className="p-8">
              <h3 className="font-bold text-xl mb-4">Text Gradient</h3>
              <p className="text-3xl font-bold text-gradient">
                Gradient Text
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded block mt-4">
                text-gradient
              </code>
            </Card>

            <Card className="p-8">
              <h3 className="font-bold text-xl mb-4">Staggered Reveals</h3>
              <div className="space-y-2">
                <div className="animate-fade-in-up" style={{ animationDelay: "0s" }}>
                  <div className="bg-muted p-3 rounded">Item 1</div>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
                  <div className="bg-muted p-3 rounded">Item 2</div>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  <div className="bg-muted p-3 rounded">Item 3</div>
                </div>
              </div>
              <code className="text-xs bg-muted px-2 py-1 rounded block mt-4">
                animationDelay: 0.15s increments
              </code>
            </Card>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h2 className="text-3xl font-bold mb-6">Design Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-xl mb-3">Mediterranean Aesthetic</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cool blues inspired by coastal waters, generous white space like sun-bleached architecture, 
                  and refined typography for editorial elegance.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3">Immersive Experience</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Parallax scrolling, staggered reveals, and smooth transitions create a magazine-quality 
                  reading experience that draws users deeper into the content.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3">Semantic Tokens</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All colors use HSL with CSS variables for consistent theming. Never use hard-coded colors—
                  always reference design system tokens.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3">Responsive & Accessible</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mobile-first approach with proper breakpoints, reduced motion support, and semantic HTML 
                  for screen readers and SEO optimization.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer globals={globals} />
    </div>
  );
};

export default DesignSystem;
