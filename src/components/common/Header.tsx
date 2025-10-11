import { useState, useEffect } from 'react';
import { Share2, Facebook, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalsData } from '@/utils/getRegionData';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
interface HeaderProps {
  globals: GlobalsData;
}
export function Header({
  globals
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const SocialLinks = () => (
    <>
      <Button variant="ghost" size="sm" asChild className="hover-lift">
        <a href={globals.brand.share.facebook} target="_blank" rel="noopener noreferrer" aria-label="Visit Facebook">
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="ghost" size="sm" asChild className="hover-lift">
        <a href="https://www.threads.net/@caesartheday" target="_blank" rel="noopener noreferrer" aria-label="Visit Threads">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.762 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142l-.126 1.974a11.904 11.904 0 0 0-2.61-.123c-1.182.062-2.117.391-2.775.977-.63.562-.944 1.28-.883 2.017.043.625.372 1.153.926 1.486.569.344 1.329.494 2.13.424 1.233-.106 2.175-.537 2.8-1.283.467-.558.735-1.285.8-2.161.033-.438.017-.912-.05-1.408a6.63 6.63 0 0 0-.55-2.13c-.562-1.205-1.515-2.074-2.833-2.585-.917-.357-1.948-.53-3.065-.516-2.912.037-5.205 1.218-6.82 3.511-1.323 1.878-1.995 4.337-1.995 7.308 0 2.97.672 5.43 1.995 7.308 1.615 2.292 3.908 3.473 6.82 3.511 1.116.013 2.147-.16 3.065-.516 1.318-.511 2.271-1.38 2.833-2.585a6.628 6.628 0 0 0 .55-2.13c.067-.496.083-.97.05-1.408-.065-.876-.333-1.603-.8-2.161-.625-.746-1.567-1.177-2.8-1.283-.801-.07-1.561.08-2.13.424-.554.333-.883.86-.926 1.486-.061.737.253 1.455.883 2.017.658.586 1.593.915 2.775.977a11.904 11.904 0 0 0 2.61-.123l.126 1.974a13.853 13.853 0 0 1-3.02.142c-1.464-.084-2.703-.529-3.583-1.29-.922-.798-1.395-1.893-1.33-3.083.067-1.223.689-2.275 1.752-2.964.898-.583 2.057-.866 3.259-.801 1.59.086 2.844.688 3.73 1.79.662.826 1.092 1.92 1.284 3.272.761-.45 1.324-1.04 1.634-1.75.528-1.205.557-3.185-1.09-4.798-1.442-1.414-3.177-2.025-5.8-2.045z"/>
          </svg>
        </a>
      </Button>
      <Button variant="ghost" size="sm" asChild className="hover-lift">
        <a href="https://bsky.app/profile/caesartheday.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Visit BlueSky">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.015.275-.03.415-.046-2.03.201-2.784 1.13-2.784 2.5 0 1.5 1.5 2.935 3.362 2.935 2.5 0 4-2.5 4-5.5 0 3 1.5 5.5 4 5.5 1.862 0 3.362-1.435 3.362-2.935 0-1.37-.754-2.299-2.784-2.5.14.015.279.031.415.046 2.67.296 5.568-.628 6.383-3.364.246-.829.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z"/>
          </svg>
        </a>
      </Button>
      <Button variant="ghost" size="sm" asChild className="hover-lift">
        <a href="https://wa.me/?text=Check%20out%20CaesarTheDay" target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      </Button>
      <Button variant="ghost" size="sm" asChild className="hover-lift">
        <a href="https://pinterest.com/caesartheday" target="_blank" rel="noopener noreferrer" aria-label="Visit Pinterest">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
          </svg>
        </a>
      </Button>
      <Button variant="ghost" size="sm" asChild className="hover-lift">
        <a href={globals.brand.share.substack} target="_blank" rel="noopener noreferrer" aria-label="Subscribe on Substack">
          <Share2 className="h-4 w-4" />
        </a>
      </Button>
    </>
  );

  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              
              
            </div>
          </div>

          {/* Desktop Social Icons */}
          <div className="hidden md:flex items-center gap-2">
            <SocialLinks />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hover-lift">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px]">
                <div className="flex flex-col gap-4 mt-8">
                  <h3 className="text-sm font-semibold mb-2">Follow CaesarTheDay</h3>
                  <div className="flex flex-col gap-2">
                    <SocialLinks />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>;
}