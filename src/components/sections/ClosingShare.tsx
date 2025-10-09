import { Button } from '@/components/ui/button';
import { Share2, Facebook, Mail } from 'lucide-react';

interface ClosingShareProps {
  message: string;
  shareText: string;
  shareUrl: string;
}

export function ClosingShare({ message, shareText, shareUrl }: ClosingShareProps) {
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{message}</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              size="lg"
              variant="default"
              asChild
              className="hover-lift"
            >
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Share on Facebook
              </a>
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="hover-lift"
            >
              <a
                href={`mailto:?subject=${encodedText}&body=${encodedUrl}`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Share via Email
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: shareText,
                    url: shareUrl,
                  });
                } else {
                  navigator.clipboard.writeText(shareUrl);
                }
              }}
              className="hover-lift"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
