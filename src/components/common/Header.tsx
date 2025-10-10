import { useState, useEffect } from 'react';
import { Share2, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalsData } from '@/utils/getRegionData';
interface HeaderProps {
  globals: GlobalsData;
}
export function Header({
  globals
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              
              
            </div>
          </div>

          {/* Share Icons */}
          <div className="flex items-center gap-2 mr-40 md:mr-52 lg:mr-60">
            <Button variant="ghost" size="sm" asChild className="hover-lift">
              <a href={globals.brand.share.facebook} target="_blank" rel="noopener noreferrer" aria-label="Visit Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover-lift">
              <a href={globals.brand.share.substack} target="_blank" rel="noopener noreferrer" aria-label="Subscribe on Substack">
                <Share2 className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>;
}