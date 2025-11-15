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

  return null; // Social links now rendered in breadcrumb area
}

export const SocialLinks = ({ globals }: { globals: GlobalsData }) => (
  <>
    <Button variant="ghost" size="sm" asChild className="hover-lift">
      <a href={globals.brand.share.facebook} target="_blank" rel="noopener noreferrer" aria-label="Visit Facebook">
        <Facebook className="h-6 w-6" />
      </a>
    </Button>
    <Button variant="ghost" size="sm" asChild className="hover-lift">
      <a href="https://bsky.app/profile/caesartheday.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Visit BlueSky">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.015.275-.03.415-.046-2.03.201-2.784 1.13-2.784 2.5 0 1.5 1.5 2.935 3.362 2.935 2.5 0 4-2.5 4-5.5 0 3 1.5 5.5 4 5.5 1.862 0 3.362-1.435 3.362-2.935 0-1.37-.754-2.299-2.784-2.5.14.015.279.031.415.046 2.67.296 5.568-.628 6.383-3.364.246-.829.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z"/>
        </svg>
      </a>
    </Button>
    <Button variant="ghost" size="sm" asChild className="hover-lift">
      <a href={globals.brand.share.substack} target="_blank" rel="noopener noreferrer" aria-label="Subscribe on Substack">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
        </svg>
      </a>
    </Button>
  </>
);