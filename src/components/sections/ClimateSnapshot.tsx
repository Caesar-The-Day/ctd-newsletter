import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Sun, Thermometer, CloudSun, ExternalLink } from "lucide-react";

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
  culturalEventUrl?: string;
  visualCue: string;
}

interface WeatherData {
  tempLow: number;
  tempHigh: number;
  rainfall: number;
  sunHours: number;
  lightQuality?: string; // Puglia-specific
}

type RegionKey = "torino" | "alba" | "verbania" | "cuneo" | "bari" | "lecce" | "ostuni" | "alberobello";

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

export function ClimateSnapshot() {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>("alba");

  useEffect(() => {
    const region = window.location.pathname.slice(1) || "piemonte";
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
  }, []);

  if (!climateData) return null;

  const region = window.location.pathname.slice(1) || "piemonte";
  const currentMonthData = climateData.months[currentMonth];
  const currentWeather = currentMonthData[selectedRegion];
  const currentSeason = currentMonthData.season;
  
  const seasonalBackgrounds = region === "puglia" ? seasonalBackgroundsPuglia : seasonalBackgroundsPiemonte;
  const seasonalImages = region === "puglia" ? seasonalImagesPuglia : seasonalImagesPiemonte;

  return (
    <section 
      className="py-8 md:py-12 bg-background relative overflow-hidden"
      data-analytics-event="climate_module_view"
    >
      {/* Seasonal background image */}
      <div 
        key={currentSeason}
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
          <div className={`grid ${currentWeather.lightQuality ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'} gap-4 mb-6`}>
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

            {currentWeather.lightQuality && (
              <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
                <Sun className="w-8 h-8 text-amber-400 mb-2" />
                <div className="text-sm font-semibold text-foreground text-center">
                  {currentWeather.lightQuality}
                </div>
                <div className="text-xs text-muted-foreground">Light Quality</div>
              </div>
            )}

            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
              <Cloud className="w-8 h-8 text-slate-400 mb-2" />
              <div className="text-sm font-semibold text-foreground text-center">
                {currentMonthData.tooltip}
              </div>
            </div>
          </div>

          {/* Cultural Event */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">What's Happening:</p>
            {currentMonthData.culturalEventUrl ? (
              <a 
                href={currentMonthData.culturalEventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary underline decoration-2 decoration-primary/50 hover:decoration-primary transition-colors group"
              >
                {currentMonthData.culturalEvent}
                <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ) : (
              <p className="text-foreground font-medium">{currentMonthData.culturalEvent}</p>
            )}
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
