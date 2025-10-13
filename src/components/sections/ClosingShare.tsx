import { Button } from '@/components/ui/button';
import { Share2, Facebook, Mail } from 'lucide-react';
interface SocialMessages {
  facebook: string;
  threads: string;
  bluesky: string;
  whatsapp: string;
  pinterest: {
    title: string;
    description: string;
  };
}
interface ClosingShareProps {
  message: string;
  header: string;
  subtitle: string;
  shareUrl: string;
  socialMessages: SocialMessages;
}
export function ClosingShare({
  message,
  header,
  subtitle,
  shareUrl,
  socialMessages
}: ClosingShareProps) {
  const encodedUrl = encodeURIComponent(shareUrl);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  // Social share URLs with custom messages
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(socialMessages.facebook + ' ' + shareUrl)}`;
  const threadsShare = `https://threads.net/intent/post?text=${encodeURIComponent(socialMessages.threads + '\n' + shareUrl)}`;
  const blueskyShare = `https://bsky.app/intent/compose?text=${encodeURIComponent(socialMessages.bluesky + '\n' + shareUrl)}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(socialMessages.whatsapp + ' ' + shareUrl)}`;
  const pinterestShare = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodeURIComponent(socialMessages.pinterest.description)}&media=${encodedUrl}`;
  const emailShare = `mailto:?subject=${encodeURIComponent(socialMessages.pinterest.title)}&body=${encodeURIComponent(socialMessages.whatsapp + ' ' + shareUrl)}`;
  return <section className="py-8 md:py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl mb-6">{message}</p>
          <h2 className="text-lg md:text-xl font-semibold text-muted-foreground mb-4">{header}</h2>
          
          
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button size="lg" variant="default" asChild className="hover-lift">
              <a href={facebookShare} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </a>
            </Button>

            <Button size="lg" variant="secondary" asChild className="hover-lift">
              <a href={blueskyShare} target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.015.275-.03.415-.046-2.03.201-2.784 1.13-2.784 2.5 0 1.5 1.5 2.935 3.362 2.935 2.5 0 4-2.5 4-5.5 0 3 1.5 5.5 4 5.5 1.862 0 3.362-1.435 3.362-2.935 0-1.37-.754-2.299-2.784-2.5.14.015.279.031.415.046 2.67.296 5.568-.628 6.383-3.364.246-.829.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z" />
                </svg>
                BlueSky
              </a>
            </Button>

            <Button size="lg" variant="secondary" asChild className="hover-lift">
              <a href={whatsappShare} target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </Button>

            <Button size="lg" variant="secondary" asChild className="hover-lift">
              <a href={pinterestShare} target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
                Pinterest
              </a>
            </Button>
            
            <Button size="lg" variant="secondary" asChild className="hover-lift">
              <a href={emailShare}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
            </Button>

            <Button size="lg" variant="outline" onClick={handleCopyLink} className="hover-lift">
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </section>;
}