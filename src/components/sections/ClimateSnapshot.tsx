import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Sun, Thermometer, CloudSun, ExternalLink, MapPin, Calendar } from "lucide-react";
import { SeasonalParticles } from "@/components/effects/SeasonalParticles";

interface ClimateData {
  intro: {
    headline: string;
    tagline: string;
    paragraphs: string[];
    hoverQuote: string;
    ctaText: string;
  };
  regions: {
    [key: string]: {
      name: string;
      type: string;
      palette: string;
    };
  };
  months: MonthData[];
}

interface MonthData {
  month: string;
  index: number;
  season: "winter" | "spring" | "summer" | "autumn";
  [key: string]: WeatherData | string | number; // Dynamic region keys
  tooltip: string;
  narrative?: string; // Detailed monthly narrative
  culturalEvent: string;
  culturalEventUrl?: string;
  visualCue: string;
}

interface WeatherData {
  tempLow: number;
  tempHigh: number;
  rainfall: number;
  sunHours: number;
  lightQuality?: string;
}

type RegionKey = string;

// Hook for animated count-up effect
function useCountUp(target: number, duration: number = 400) {
  const [current, setCurrent] = useState(target);
  const prevTarget = useRef(target);
  
  useEffect(() => {
    if (prevTarget.current === target) return;
    
    const startValue = prevTarget.current;
    const startTime = Date.now();
    const difference = target - startValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      setCurrent(Math.round(startValue + difference * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevTarget.current = target;
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);
  
  return current;
}

// Typewriter effect hook
function useTypewriter(text: string, speed: number = 20) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    
    if (!text) return;
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);
  
  return { displayedText, isComplete };
}

const seasonalBackgroundsPuglia = {
  winter: "from-cyan-100/30 via-sky-50/20 to-blue-100/30 dark:from-cyan-950/30 dark:via-sky-900/20 dark:to-blue-950/30",
  spring: "from-lime-100/30 via-yellow-50/20 to-amber-100/30 dark:from-lime-950/30 dark:via-yellow-900/20 dark:to-amber-950/30",
  summer: "from-amber-100/30 via-orange-50/20 to-yellow-100/30 dark:from-amber-950/30 dark:via-orange-900/20 dark:to-yellow-950/30",
  autumn: "from-orange-100/30 via-amber-50/20 to-red-100/30 dark:from-orange-950/30 dark:via-amber-900/20 dark:to-red-950/30",
};

const seasonalBackgroundsPiemonte = {
  winter: "from-slate-200/30 via-blue-100/20 to-slate-100/30 dark:from-slate-900/30 dark:via-blue-950/20 dark:to-slate-800/30",
  spring: "from-green-100/30 via-emerald-50/20 to-lime-100/30 dark:from-green-950/30 dark:via-emerald-900/20 dark:to-lime-950/30",
  summer: "from-yellow-100/30 via-amber-50/20 to-orange-100/30 dark:from-yellow-950/30 dark:via-amber-900/20 dark:to-orange-950/30",
  autumn: "from-orange-100/30 via-red-50/20 to-amber-100/30 dark:from-orange-950/30 dark:via-red-900/20 dark:to-amber-950/30",
};

const seasonalBackgroundsUmbria = {
  winter: "from-slate-200/40 via-blue-100/30 to-gray-100/40 dark:from-slate-900/40 dark:via-blue-950/30 dark:to-gray-800/40",
  spring: "from-green-100/40 via-emerald-50/30 to-yellow-100/40 dark:from-green-950/40 dark:via-emerald-900/30 dark:to-yellow-950/40",
  summer: "from-amber-100/40 via-yellow-50/30 to-orange-100/40 dark:from-amber-950/40 dark:via-yellow-900/30 dark:to-orange-950/40",
  autumn: "from-orange-100/40 via-amber-50/30 to-green-100/40 dark:from-orange-950/40 dark:via-amber-900/30 dark:to-green-950/40",
};

const seasonalImagesPuglia = {
  winter: "/images/puglia/seasonal-backgrounds/winter-landscape.jpg",
  spring: "/images/puglia/seasonal-backgrounds/spring-landscape.jpg",
  summer: "/images/puglia/seasonal-backgrounds/summer-landscape.jpg",
  autumn: "/images/puglia/seasonal-backgrounds/autumn-landscape.jpg",
};

const seasonalImagesPiemonte = {
  winter: "/images/piemonte/seasonal-backgrounds/winter-landscape.jpg",
  spring: "/images/piemonte/seasonal-backgrounds/spring-landscape.jpg",
  summer: "/images/piemonte/seasonal-backgrounds/summer-landscape.jpg",
  autumn: "/images/piemonte/seasonal-backgrounds/autumn-landscape.jpg",
};

const seasonalImagesUmbria = {
  winter: "/images/umbria/seasonal-backgrounds/winter-landscape.jpg",
  spring: "/images/umbria/seasonal-backgrounds/spring-landscape.jpg",
  summer: "/images/umbria/seasonal-backgrounds/summer-landscape.jpg",
  autumn: "/images/umbria/seasonal-backgrounds/autumn-landscape.jpg",
};

type BestMonthsView = "off" | "scouting" | "moving";

interface BestMonthsData {
  months: number[];
  label: string;
  description: string;
}

export function ClimateSnapshot() {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("alba");
  const [animationKey, setAnimationKey] = useState(0);
  const [bestMonthsView, setBestMonthsView] = useState<BestMonthsView>("off");

  // Get region from URL
  const region = window.location.pathname.slice(1) || "piemonte";

  useEffect(() => {
    fetch(`/data/regions/italy/${region}-climate.json`)
      .then((res) => res.json())
      .then((data) => {
        setClimateData(data);
        // Set default region based on location
        const firstRegionKey = Object.keys(data.regions)[0] as RegionKey;
        setSelectedRegion(firstRegionKey);
      })
      .catch(() => {
        // Fallback to piemonte if region climate data not found
        fetch("/data/piemonte-climate.json")
          .then((res) => res.json())
          .then((data) => {
            setClimateData(data);
            setSelectedRegion("alba");
          });
      });
  }, [region]);

  // Trigger animation reset on month change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentMonth, selectedRegion]);

  // Derived values - compute safely regardless of data state
  const currentMonthData = climateData?.months[currentMonth];
  const currentWeather = currentMonthData?.[selectedRegion] as WeatherData | undefined;
  const currentSeason = currentMonthData?.season ?? "spring";
  
  // Select region-specific backgrounds
  const getSeasonalBackgrounds = () => {
    if (region === "puglia") return seasonalBackgroundsPuglia;
    if (region === "umbria") return seasonalBackgroundsUmbria;
    return seasonalBackgroundsPiemonte;
  };
  
  const getSeasonalImages = () => {
    if (region === "puglia") return seasonalImagesPuglia;
    if (region === "umbria") return seasonalImagesUmbria;
    return seasonalImagesPiemonte;
  };
  
  const seasonalBackgrounds = getSeasonalBackgrounds();
  const seasonalImages = getSeasonalImages();

  // Animated weather values - MUST be called unconditionally (before any return)
  const animatedTempLow = useCountUp(currentWeather?.tempLow ?? 0);
  const animatedTempHigh = useCountUp(currentWeather?.tempHigh ?? 0);
  const animatedRainfall = useCountUp(currentWeather?.rainfall ?? 0);
  const animatedSunHours = useCountUp(currentWeather?.sunHours ?? 0);

  // Narrative with typewriter effect - MUST be called unconditionally
  const narrativeText = (currentMonthData as any)?.narrative || currentMonthData?.tooltip || "";
  const { displayedText, isComplete } = useTypewriter(narrativeText, 15);

  // Early return AFTER all hooks have been called
  if (!climateData || !currentMonthData) return null;

  return (
    <section 
      className="py-8 md:py-12 bg-background relative overflow-hidden"
      data-analytics-event="climate_module_view"
    >
      {/* Seasonal background image */}
      <div 
        key={`bg-${currentSeason}`}
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${seasonalImages[currentSeason]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px) brightness(0.6)',
          transform: 'scale(1.1)',
          opacity: 0.35,
        }}
      />
      
      {/* Gradient overlay for text readability */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${seasonalBackgrounds[currentSeason]} transition-all duration-1000 ease-in-out`}
      />
      
      {/* Seasonal particles overlay */}
      <SeasonalParticles monthIndex={currentMonth} region={region} />
      
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Intro */}
        <div className="text-center mb-12">
          <CloudSun className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {climateData.intro.headline}
          </h2>
          <p className="text-xl italic text-muted-foreground mb-6">
            {climateData.intro.tagline}
          </p>
          
          <div className="max-w-3xl mx-auto space-y-4 text-foreground/90">
            {climateData.intro.paragraphs.map((para, idx) => (
              <p key={idx} className="text-lg leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-8 italic">
            "{climateData.intro.hoverQuote}"
          </p>
        </div>

        {/* Regional Toggle with enhanced styling */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {(Object.keys(climateData.regions) as RegionKey[]).map((regionKey) => (
            <button
              key={regionKey}
              onClick={() => setSelectedRegion(regionKey)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedRegion === regionKey
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:scale-102"
              }`}
            >
              <MapPin className="w-3 h-3" />
              {climateData.regions[regionKey].name}
              <span className="text-xs opacity-70">
                ({climateData.regions[regionKey].type})
              </span>
            </button>
          ))}
        </div>

        {/* Main Interactive Card */}
        <Card className="p-6 md:p-8 backdrop-blur-sm bg-card/95 shadow-xl border-0">
          {/* Month Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  {currentMonthData.month}
                </h3>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
                currentSeason === 'winter' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                currentSeason === 'spring' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                currentSeason === 'summer' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
              }`}>
                {currentSeason}
              </span>
            </div>
            
            <Slider
              value={[currentMonth]}
              onValueChange={(value) => setCurrentMonth(value[0])}
              max={11}
              step={1}
              className="mb-2"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => {
                const bestMonths = (climateData as any)?.bestMonths?.[bestMonthsView] as BestMonthsData | undefined;
                const isBestMonth = bestMonthsView !== "off" && bestMonths?.months?.includes(i);
                
                return (
                  <span 
                    key={m} 
                    className={`transition-all duration-200 relative ${currentMonth === i ? 'text-primary font-bold scale-110' : ''}`}
                  >
                    {m}
                    {isBestMonth && (
                      <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        bestMonthsView === "scouting" ? "bg-emerald-500" : "bg-blue-500"
                      }`} />
                    )}
                  </span>
                );
              })}
            </div>
            
            {/* Best Months Toggle */}
            {(climateData as any)?.bestMonths && (
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                <span className="text-xs text-muted-foreground mr-1 self-center">Best for:</span>
                <button
                  onClick={() => setBestMonthsView(bestMonthsView === "scouting" ? "off" : "scouting")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    bestMonthsView === "scouting" 
                      ? "bg-emerald-500 text-white shadow-md" 
                      : "bg-secondary text-secondary-foreground hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                  }`}
                >
                  🔍 Scouting Trips
                </button>
                <button
                  onClick={() => setBestMonthsView(bestMonthsView === "moving" ? "off" : "moving")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    bestMonthsView === "moving" 
                      ? "bg-blue-500 text-white shadow-md" 
                      : "bg-secondary text-secondary-foreground hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  }`}
                >
                  📦 Moving Logistics
                </button>
              </div>
            )}
            
            {/* Best Month Banner */}
            {bestMonthsView !== "off" && (climateData as any)?.bestMonths?.[bestMonthsView]?.months?.includes(currentMonth) && (
              <div className={`mt-4 p-3 rounded-lg text-sm animate-fade-in ${
                bestMonthsView === "scouting" 
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800" 
                  : "bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800"
              }`}>
                <span className="font-semibold">
                  {bestMonthsView === "scouting" ? "🔍 Great for Scouting:" : "📦 Ideal for Moving:"}
                </span>{" "}
                {(climateData as any).bestMonths[bestMonthsView].description}
              </div>
            )}
          </div>

          {/* Weather Data Grid with animated values */}
          <div 
            key={animationKey}
            className={`grid ${currentWeather?.lightQuality ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'} gap-3 md:gap-4 mb-6`}
          >
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl animate-card-reveal animate-card-reveal-1 hover:bg-background/70 transition-colors">
              <Thermometer className="w-8 h-8 text-primary mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                {animatedTempLow}–{animatedTempHigh}°C
              </div>
              <div className="text-xs text-muted-foreground mt-1">Temperature</div>
            </div>

            <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl animate-card-reveal animate-card-reveal-2 hover:bg-background/70 transition-colors">
              <Droplets className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                {animatedRainfall}<span className="text-lg">mm</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Rainfall</div>
            </div>

            <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl animate-card-reveal animate-card-reveal-3 hover:bg-background/70 transition-colors">
              <Sun className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                {animatedSunHours}<span className="text-lg">h</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Sun Hours</div>
            </div>

            {currentWeather?.lightQuality && (
              <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl animate-card-reveal animate-card-reveal-4 hover:bg-background/70 transition-colors">
                <Sun className="w-8 h-8 text-amber-400 mb-2" />
                <div className="text-sm font-semibold text-foreground text-center">
                  {currentWeather.lightQuality}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Light Quality</div>
              </div>
            )}

            <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl animate-card-reveal animate-card-reveal-5 hover:bg-background/70 transition-colors col-span-2 md:col-span-1">
              <Cloud className="w-8 h-8 text-slate-400 mb-2" />
              <div className="text-sm font-semibold text-foreground text-center leading-tight">
                {currentMonthData.tooltip}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Mood</div>
            </div>
          </div>

          {/* Life on the Ground - Narrative Panel */}
          {(currentMonthData as any).narrative && (
            <div className="mb-6 p-5 bg-secondary/30 rounded-xl border border-border/50">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Life on the Ground
              </h4>
              <p className="text-foreground leading-relaxed italic">
                {displayedText}
                {!isComplete && <span className="animate-cursor-blink ml-0.5">|</span>}
              </p>
              {currentMonthData.visualCue && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                  <span className="opacity-60">Visual:</span> 
                  <span className="italic">{currentMonthData.visualCue}</span>
                </p>
              )}
            </div>
          )}

          {/* Cultural Event - Enhanced card */}
          <div className="p-5 bg-primary/5 rounded-xl border border-primary/20 hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">What's Happening</p>
                {currentMonthData.culturalEventUrl ? (
                  <a 
                    href={currentMonthData.culturalEventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary underline decoration-2 decoration-primary/30 hover:decoration-primary transition-all group"
                  >
                    {currentMonthData.culturalEvent}
                    <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                ) : (
                  <p className="text-lg font-semibold text-foreground">{currentMonthData.culturalEvent}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
            {climateData.intro.ctaText}
          </p>
        </div>

        {/* Microclimates Note with elevation hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground italic">
            Microclimates matter here — each town tells its own weather story.
          </p>
        </div>
      </div>
    </section>
  );
}