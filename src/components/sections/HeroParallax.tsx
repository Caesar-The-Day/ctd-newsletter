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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-end pb-16 md:pb-24 px-4">
        <div className="text-center max-w-4xl animate-fade-in-up">
          <div className="text-sm md:text-base text-accent font-medium mb-4 opacity-0 animate-fade-in-up animate-stagger-1">
            Issue #{issueNumber} • {date}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground opacity-0 animate-fade-in-up animate-stagger-2">
            {title}
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up animate-stagger-3">
            {tagline}
          </p>
          <div className="text-xs text-muted-foreground opacity-0 animate-fade-in-up animate-stagger-4">
            {credit}
          </div>
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
