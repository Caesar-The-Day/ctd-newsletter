import { Facebook, Share2 } from 'lucide-react';
import { GlobalsData } from '@/utils/getRegionData';

interface FooterProps {
  globals: GlobalsData;
}

export function Footer({ globals }: FooterProps) {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-2">CaesarTheDay™</h3>
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
          <p>&copy; {new Date().getFullYear()} CaesarTheDay™. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
