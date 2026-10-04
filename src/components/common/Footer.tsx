import { Facebook, Share2 } from 'lucide-react';
import { withUtm } from '@/lib/utm';
import { GlobalsData } from '@/utils/getRegionData';

interface FooterProps {
  globals: GlobalsData;
  variant?: 'dark' | 'light';
}

export function Footer({ globals, variant = 'dark' }: FooterProps) {
  if (variant === 'light') {
    const linkClass =
      'text-sm text-muted-foreground transition-colors hover:text-foreground';
    return (
      <footer className="border-t border-border bg-[hsl(var(--stone-light))]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-display text-xl font-semibold">CaesarTheDay®</h3>
              <p className="font-display mt-1 text-lg italic text-terracotta-deep">
                Veni · Vidi · Vici
              </p>
            </div>

            {/* Guides */}
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                Guides
              </h4>
              <div className="flex flex-col gap-2">
                <a href="#regions" className={linkClass}>
                  All regions
                </a>
                <a href="#map" className={linkClass}>
                  Map
                </a>
                <a href="#signup" className={linkClass}>
                  Get new regions
                </a>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                Connect
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  href={globals.brand.share.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Facebook Page
                </a>
                <a
                  href={globals.brand.share.group}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Facebook Community
                </a>
                <a
                  href={globals.brand.share.substack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Substack
                </a>
              </div>
            </div>

            {/* More */}
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                More
              </h4>
              <div className="flex flex-col gap-2">
                <a href="#about" className={linkClass}>
                  About Caesar
                </a>
                <a
                  href={withUtm('https://www.caesartheday.com', 'home')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  CaesarTheDay.com
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CaesarTheDay®. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-primary py-12 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-2">CaesarTheDay®</h3>
            <p className="text-sm opacity-90">{globals.brand.motto}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex flex-col gap-2">
              <a
                href={globals.brand.share.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity"
              >
                Facebook Page
              </a>
              <a
                href={globals.brand.share.group}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity"
              >
                Facebook Community
              </a>
              <a
                href={globals.brand.share.substack}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity"
              >
                Substack Newsletter
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} CaesarTheDay®. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
