import { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroParallaxProps {
  bannerImage: string;
  title: string;
  tagline: string;
  issueNumber: number;
  date: string;
  credit: string;
  ambientAudio?: string;
}

export function HeroParallax({
  bannerImage,
  title,
  tagline,
  issueNumber,
  date,
  credit,
  ambientAudio,
}: HeroParallaxProps) {
  const brandTitle = "Veni | Vidi | Vici";
  const brandSubtitle = "Your guide to conquering retirement in Italy";
  const brandByline = "by CaesarTheDay";
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset;
      setParallaxOffset(offset * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Logo - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <img 
          src="/images/caesartheday-logo.png" 
          alt="CaesarTheDay" 
          className="h-36 md:h-48 lg:h-54 w-auto opacity-0 animate-fade-in-up drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Parallax Image */}
      <div
        className="absolute inset-0 w-full h-[120%]"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        <img
          src={bannerImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-end pb-16 md:pb-24 px-4">
        <div className="text-center max-w-4xl animate-fade-in-up">
          {/* Brand Title */}
          <div className="mb-8 opacity-0 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {brandTitle}
            </h1>
            <p className="text-xl md:text-2xl text-white/95 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {brandSubtitle}
            </p>
            <p className="text-base md:text-lg text-white/90 mt-2 italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {brandByline}
            </p>
          </div>

          {/* Issue Info */}
          <div className="text-sm md:text-base text-white font-semibold mb-4 opacity-0 animate-fade-in-up animate-stagger-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Issue #{issueNumber} • {date}
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white opacity-0 animate-fade-in-up animate-stagger-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-6 opacity-0 animate-fade-in-up animate-stagger-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {tagline}
          </p>
        </div>
      </div>

      {/* Audio Toggle (if provided) */}
      {ambientAudio && (
        <>
          <audio ref={audioRef} loop>
            <source src={ambientAudio} type="audio/mpeg" />
          </audio>
          <Button
            variant="secondary"
            size="sm"
            className="fixed bottom-4 right-4 z-10"
            onClick={toggleAudio}
          >
            {audioPlaying ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </>
      )}
    </section>
  );
}
