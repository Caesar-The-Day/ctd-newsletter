import { useEffect, useState } from "react";

interface SeasonalParticlesProps {
  season: "winter" | "spring" | "summer" | "autumn";
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export function SeasonalParticles({ season }: SeasonalParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles based on season
    const particleCount = season === "winter" ? 30 : 25;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 4 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, [season]);

  const getParticleStyle = (season: string) => {
    switch (season) {
      case "winter":
        return "text-white/60";
      case "spring":
        return "text-pink-300/50";
      case "summer":
        return "text-yellow-300/40";
      case "autumn":
        return "text-orange-400/50";
      default:
        return "text-white/50";
    }
  };

  const getParticleSymbol = (season: string) => {
    switch (season) {
      case "winter":
        return "❄";
      case "spring":
        return "🌸";
      case "summer":
        return "✨";
      case "autumn":
        return "🍂";
      default:
        return "•";
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${getParticleStyle(season)} animate-particle-fall`}
          style={{
            left: `${particle.left}%`,
            top: "-20px",
            fontSize: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: 0.6,
          }}
        >
          {getParticleSymbol(season)}
        </div>
      ))}
    </div>
  );
}
