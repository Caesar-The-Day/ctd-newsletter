import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const MosquitoSVG = ({ className = '' }: { className?: string }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={className}
    fill="currentColor"
  >
    <ellipse cx="32" cy="28" rx="8" ry="12" opacity="0.9" />
    <ellipse cx="32" cy="42" rx="5" ry="8" opacity="0.9" />
    <circle cx="32" cy="14" r="5" />
    <line x1="32" y1="9" x2="32" y2="2" stroke="currentColor" strokeWidth="1.5" />
    <line x1="28" y1="10" x2="24" y2="4" stroke="currentColor" strokeWidth="1.5" />
    <line x1="36" y1="10" x2="40" y2="4" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="22" cy="24" rx="10" ry="4" transform="rotate(-30 22 24)" opacity="0.3" />
    <ellipse cx="42" cy="24" rx="10" ry="4" transform="rotate(30 42 24)" opacity="0.3" />
    <line x1="28" y1="38" x2="18" y2="52" stroke="currentColor" strokeWidth="1.5" />
    <line x1="30" y1="40" x2="22" y2="58" stroke="currentColor" strokeWidth="1.5" />
    <line x1="32" y1="42" x2="32" y2="62" stroke="currentColor" strokeWidth="1.5" />
    <line x1="34" y1="40" x2="42" y2="58" stroke="currentColor" strokeWidth="1.5" />
    <line x1="36" y1="38" x2="46" y2="52" stroke="currentColor" strokeWidth="1.5" />
    <line x1="26" y1="34" x2="14" y2="42" stroke="currentColor" strokeWidth="1.5" />
    <line x1="38" y1="34" x2="50" y2="42" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const FlyingMosquito = ({ delay, duration, startX, endX }: { 
  delay: number; 
  duration: number; 
  startX: number;
  endX: number;
}) => (
  <div 
    className="absolute pointer-events-none opacity-40 hover:opacity-70 transition-opacity"
    style={{
      animation: `mosquito-fly ${duration}s ease-in-out ${delay}s infinite`,
      left: `${startX}%`,
      top: '-20px',
      '--end-x': `${endX}%`,
    } as React.CSSProperties}
  >
    <MosquitoSVG className="w-4 h-4 text-foreground/60 animate-mosquito-wings" />
  </div>
);

export function MosquitoWarning() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [splatted, setSplatted] = useState<number[]>([]);

  if (isDismissed) return null;

  const handleSplat = (index: number) => {
    if (!splatted.includes(index)) {
      setSplatted([...splatted, index]);
    }
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Flying mosquitoes - reduced motion respects prefers-reduced-motion */}
      <div className="absolute inset-0 pointer-events-none motion-reduce:hidden">
        {[0, 1, 2].map((i) => (
          !splatted.includes(i) && (
            <div
              key={i}
              className="absolute cursor-pointer pointer-events-auto"
              onClick={() => handleSplat(i)}
              style={{
                animation: `mosquito-fly ${8 + i * 2}s ease-in-out ${i * 3}s infinite`,
                left: `${10 + i * 30}%`,
              }}
            >
              <MosquitoSVG className="w-5 h-5 text-foreground/50 hover:text-foreground/80 transition-colors animate-mosquito-wings" />
            </div>
          )
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-6 md:p-8 shadow-lg backdrop-blur-sm">
            {/* Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-amber-600/60 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              aria-label="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <div className="relative">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <MosquitoSVG className="absolute -top-1 -right-2 w-4 h-4 text-amber-700 dark:text-amber-300 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-amber-900 dark:text-amber-100">
                  The Buzzkill
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Fair Warning: Mosquito Season
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3 text-amber-900/90 dark:text-amber-100/90">
              <p className="text-sm md:text-base leading-relaxed">
                In 2025, <strong>Lombardy remains the most mosquito-infested region in Italy.</strong> The humid climate and stagnant waters of the Po Valley create an ideal breeding ground, making cities like Milan and Pavia notorious for "vicious" mosquito activity.
              </p>
              
              <div className="bg-amber-100/50 dark:bg-amber-900/30 rounded-lg p-4 mt-4">
                <p className="text-xs md:text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Why Lombardy ranks highest:
                </p>
                <ul className="text-xs md:text-sm space-y-1.5 text-amber-800/90 dark:text-amber-200/90">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Marshy history and persistent humidity from the Po Valley</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>High density of invasive species: Asian Tiger mosquito and <em>Aedes koreicus</em></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>Peak season runs May through September, with July–August being most intense</span>
                  </li>
                </ul>
              </div>

              {/* Pro tip */}
              <div className="flex items-start gap-2 pt-2 text-xs md:text-sm text-amber-700 dark:text-amber-300 italic">
                <span className="font-semibold not-italic">Pro tip:</span>
                <span>Stock up on repellent, install window screens, and consider evening plans indoors during peak summer months.</span>
              </div>
            </div>

            {/* Splat counter easter egg */}
            {splatted.length > 0 && (
              <div className="mt-4 pt-3 border-t border-amber-200/40 dark:border-amber-800/40">
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                  🎯 Mosquitoes swatted: {splatted.length}/3
                  {splatted.length === 3 && " — Nice aim! But there's always more..."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS for flying animation */}
      <style>{`
        @keyframes mosquito-fly {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 0.5;
          }
          25% {
            transform: translateY(25vh) translateX(40px) rotate(15deg);
          }
          50% {
            transform: translateY(50vh) translateX(-30px) rotate(-10deg);
          }
          75% {
            transform: translateY(75vh) translateX(50px) rotate(20deg);
          }
          95% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(100vh) translateX(20px) rotate(0deg);
            opacity: 0;
          }
        }
        
        @keyframes mosquito-wings {
          0%, 100% {
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(0.85);
          }
        }
        
        .animate-mosquito-wings {
          animation: mosquito-wings 0.08s ease-in-out infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-mosquito-wings {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
