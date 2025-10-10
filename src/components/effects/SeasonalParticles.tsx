import { useEffect, useState } from "react";

interface SeasonalParticlesProps {
  monthIndex: number; // 0-11
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  symbol: string;
  color?: string;
}

type SeasonType = "winter" | "spring" | "summer" | "autumn";

export function SeasonalParticles({ monthIndex }: SeasonalParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Determine season type based on month
  const getSeasonType = (month: number): SeasonType => {
    if (month === 11 || month <= 1) return "winter"; // Dec, Jan, Feb
    if (month >= 2 && month <= 4) return "spring";   // Mar, Apr, May
    if (month >= 5 && month <= 7) return "summer";   // Jun, Jul, Aug
    return "autumn";                                   // Sep, Oct, Nov
  };

  const seasonType = getSeasonType(monthIndex);

  useEffect(() => {
    const currentSeasonType = getSeasonType(monthIndex);
    
    // Generate particles based on season (no particles for summer heat distortion)
    if (currentSeasonType === "summer") {
      setParticles([]);
      return;
    }

    const getSymbolForSeason = (type: SeasonType): string => {
      switch (type) {
        case "winter":
          return "❄";
        case "spring":
          return ["🌸", "🌼", "✿", "❀"][Math.floor(Math.random() * 4)];
        case "autumn":
          return ["🍂", "🍁", "🍃"][Math.floor(Math.random() * 3)];
        default:
          return "•";
      }
    };

    const getAutumnColor = (): string => {
      const autumnColors = [
        "text-orange-400/70",
        "text-amber-500/70",
        "text-red-400/70",
        "text-yellow-600/70",
        "text-orange-600/80"
      ];
      return autumnColors[Math.floor(Math.random() * autumnColors.length)];
    };

    const particleCount = currentSeasonType === "winter" ? 45 : 35;
    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      let size: number;
      let duration: number;
      
      if (currentSeasonType === "winter") {
        size = 12 + Math.random() * 12;
        duration = 8 + Math.random() * 6;
      } else if (currentSeasonType === "spring") {
        size = 6 + Math.random() * 6;
        duration = 12 + Math.random() * 8;
      } else {
        size = 8 + Math.random() * 14;
        duration = 10 + Math.random() * 10;
      }

      return {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration,
        size,
        symbol: getSymbolForSeason(currentSeasonType),
        color: currentSeasonType === "autumn" ? getAutumnColor() : undefined,
      };
    });
    console.log(`[SeasonalParticles] Generated ${particleCount} ${currentSeasonType} particles for month ${monthIndex}`);
    setParticles(newParticles);
  }, [monthIndex]);

  const getParticleStyle = (type: SeasonType) => {
    switch (type) {
      case "winter":
        return "text-blue-100/90";
      case "spring":
        return "text-pink-100/60";
      case "autumn":
        return "text-orange-300"; // Fallback if no individual color
      default:
        return "text-white/50";
    }
  };

  const getTextShadow = (type: SeasonType) => {
    switch (type) {
      case "winter":
        return "0 0 10px rgba(147, 197, 253, 0.9), 0 0 20px rgba(191, 219, 254, 0.7), 0 0 30px rgba(219, 234, 254, 0.4)";
      case "spring":
        return "0 0 4px rgba(251, 207, 232, 0.5), 0 0 8px rgba(244, 114, 182, 0.3)";
      case "autumn":
        return "0 0 8px rgba(253, 186, 116, 0.8), 0 0 12px rgba(251, 146, 60, 0.6)";
      default:
        return "0 0 4px rgba(255, 255, 255, 0.5)";
    }
  };


  const getAnimationClass = (type: SeasonType) => {
    switch (type) {
      case "winter":
        return "animate-snowflake-fall";
      case "spring":
        return "animate-pollen-float";
      case "autumn":
        return "animate-leaf-drift";
      default:
        return "animate-particle-fall";
    }
  };

  // Summer heat distortion effect
  if (seasonType === "summer") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Heat distortion waves */}
        <div className="absolute inset-0 animate-heat-wave opacity-20" 
          style={{
            background: "repeating-linear-gradient(90deg, transparent, rgba(255, 200, 100, 0.1) 2px, transparent 4px)",
          }}
        />
        
        {/* Lens flare */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 animate-lens-flare">
          <div className="absolute inset-0 rounded-full bg-yellow-200/20 blur-2xl" />
          <div className="absolute inset-4 rounded-full bg-yellow-100/30 blur-xl" />
          <div className="absolute inset-8 rounded-full bg-white/20 blur-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${particle.color || getParticleStyle(seasonType)} ${getAnimationClass(seasonType)}`}
          style={{
            left: `${particle.left}%`,
            top: "-20px",
            fontSize: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            textShadow: getTextShadow(seasonType),
          }}
        >
          {particle.symbol}
        </div>
      ))}
    </div>
  );
}
