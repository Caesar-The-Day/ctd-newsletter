import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Sun, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  torino: WeatherData;
  alba: WeatherData;
  verbania: WeatherData;
  cuneo: WeatherData;
  tooltip: string;
  culturalEvent: string;
  visualCue: string;
}

interface WeatherData {
  tempLow: number;
  tempHigh: number;
  rainfall: number;
  sunHours: number;
}

type RegionKey = "torino" | "alba" | "verbania" | "cuneo";

// Seasonal background images mapped by region and season
const seasonalImages: Record<RegionKey, Record<string, string>> = {
  torino: {
    winter: "/images/piemonte/alps.jpg",
    spring: "/images/piemonte/torino-hero.jpg",
    summer: "/images/piemonte/torino1.jpg",
    autumn: "/images/piemonte/torino2.jpg",
  },
  alba: {
    winter: "/images/piemonte/alps.jpg",
    spring: "/images/piemonte/hero-vineyards.jpg",
    summer: "/images/piemonte/alba-hero.jpg",
    autumn: "/images/piemonte/vineyard-fall.jpg",
  },
  verbania: {
    winter: "/images/piemonte/alps.jpg",
    spring: "/images/piemonte/orta.jpg",
    summer: "/images/piemonte/verbania.jpg",
    autumn: "/images/piemonte/orta-san-giulio.jpg",
  },
  cuneo: {
    winter: "/images/piemonte/alps.jpg",
    spring: "/images/piemonte/hero-vineyards.jpg",
    summer: "/images/piemonte/cuneo.jpg",
    autumn: "/images/piemonte/vineyard-fall.jpg",
  },
};

export function ClimateSnapshot() {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("alba");
  const [currentImageKey, setCurrentImageKey] = useState("");
  const [previousImageKey, setPreviousImageKey] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/data/piemonte-climate.json")
      .then((res) => res.json())
      .then((data) => setClimateData(data));
  }, []);

  // Preload images and handle transitions
  useEffect(() => {
    if (!climateData) return;
    
    const currentSeason = climateData.months[currentMonth].season;
    const newImageKey = seasonalImages[selectedRegion][currentSeason];
    
    if (newImageKey !== currentImageKey) {
      // Preload the new image
      const img = new Image();
      img.src = newImageKey;
      img.onload = () => {
        setPreviousImageKey(currentImageKey);
        setCurrentImageKey(newImageKey);
      };
      
      // If it's the first load
      if (!currentImageKey) {
        setCurrentImageKey(newImageKey);
      }
    }
  }, [currentMonth, selectedRegion, climateData, currentImageKey]);

  // Handle parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!climateData) return null;

  const currentMonthData = climateData.months[currentMonth];
  const currentWeather = currentMonthData[selectedRegion];
  const currentSeason = currentMonthData.season;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background Image Layer 1 (Previous/Outgoing) */}
      {previousImageKey && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1200 ease-in-out"
          style={{ 
            backgroundImage: `url(${previousImageKey})`,
            opacity: previousImageKey === currentImageKey ? 1 : 0,
            transform: `translateY(${scrollY * 0.015}px)`,
            willChange: 'opacity, transform'
          }}
        />
      )}
      
      {/* Background Image Layer 2 (Current/Incoming) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1200 ease-in-out"
        style={{ 
          backgroundImage: `url(${currentImageKey})`,
          opacity: 1,
          transform: `translateY(${scrollY * 0.015}px)`,
          willChange: 'opacity, transform'
        }}
      />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      
      {/* Season Label Badge */}
      <div className="absolute top-8 right-8 z-20">
        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-black/30 backdrop-blur-md border-white/20 text-white">
          {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} in {climateData.regions[selectedRegion].name}
        </Badge>
      </div>
      
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
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

        {/* Regional Toggle */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {(Object.keys(climateData.regions) as RegionKey[]).map((regionKey) => (
            <button
              key={regionKey}
              onClick={() => setSelectedRegion(regionKey)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedRegion === regionKey
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {climateData.regions[regionKey].name}
            </button>
          ))}
        </div>

        {/* Main Interactive Card */}
        <Card className="p-8 backdrop-blur-sm bg-card/95 shadow-xl">
          {/* Month Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-foreground">
                {currentMonthData.month}
              </h3>
              <span className="text-sm text-muted-foreground capitalize">
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
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Weather Data Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <Thermometer className="w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {currentWeather.tempLow}–{currentWeather.tempHigh}°C
              </div>
              <div className="text-xs text-muted-foreground">Temperature</div>
            </div>

            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <Droplets className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {currentWeather.rainfall}mm
              </div>
              <div className="text-xs text-muted-foreground">Rainfall</div>
            </div>

            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <Sun className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {currentWeather.sunHours}h
              </div>
              <div className="text-xs text-muted-foreground">Sun Hours</div>
            </div>

            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <Cloud className="w-8 h-8 text-slate-400 mb-2" />
              <div className="text-sm font-semibold text-foreground text-center">
                {currentMonthData.tooltip}
              </div>
            </div>
          </div>

          {/* Visual Cue & Cultural Event */}
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Visual Scene:</p>
              <p className="text-foreground italic">{currentMonthData.visualCue}</p>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">What's Happening:</p>
              <p className="text-foreground font-medium">{currentMonthData.culturalEvent}</p>
            </div>
          </div>
        </Card>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground italic">
            {climateData.intro.ctaText}
          </p>
        </div>

        {/* Microclimates Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground italic">
            Microclimates matter here — each town tells its own weather story.
          </p>
        </div>
      </div>
    </section>
  );
}
