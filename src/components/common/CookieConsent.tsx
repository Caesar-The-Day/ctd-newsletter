import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      loadGoogleAnalytics();
    }
  }, []);

  const loadGoogleAnalytics = () => {
    // Load gtag.js script
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-6NPM83DF0C';
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', 'G-6NPM83DF0C', {
      'linker': {
        'domains': ['caesartheday.com', 'news.caesartheday.com', 'italy7percent.com']
      }
    });

    // Helper function to fire events safely
    window.trackEvent = function(eventName: string, params?: Record<string, any>) {
      try {
        gtag('event', eventName, params || {});
      } catch (e) {
        // fail silently if gtag not ready
      }
    };

    // Auto tracking logic
    document.addEventListener('DOMContentLoaded', function () {
      const path = window.location.pathname || '';

      // 1. REGION VIEW EVENT
      const regionMatch = path.match(/^\/(puglia|piemonte|liguria|tuscany|abruzzo|umbria|sicily)/i);
      if (regionMatch) {
        const regionName = regionMatch[1].toLowerCase();
        window.trackEvent?.('region_view', { region: regionName });
      }

      // 2. MAP REGION CLICK
      document.querySelectorAll('[data-analytics-event="map_region_click"]').forEach(function (el) {
        el.addEventListener('click', function () {
          const region = el.getAttribute('data-region') || 'unknown';
          window.trackEvent?.('map_region_click', { region });
        });
      });

      // 3. ESCAPE MAP CLICK
      document.querySelectorAll('[data-analytics-event="escape_map_click"]').forEach(function (el) {
        el.addEventListener('click', function () {
          window.trackEvent?.('escape_map_click', { location: path });
        });
      });

      // 4. RETIREMENT BLUEPRINT CTA
      document.querySelectorAll('[data-analytics-event="blueprint_cta_click"]').forEach(function (el) {
        el.addEventListener('click', function () {
          window.trackEvent?.('blueprint_cta_click', { location: path });
        });
      });

      // 5. GENERIC INTERACTIVE TOOL EVENTS
      const wiredEvents = ['map_region_click', 'escape_map_click', 'blueprint_cta_click'];
      document.querySelectorAll('[data-analytics-event]').forEach(function (el) {
        const eventName = el.getAttribute('data-analytics-event');
        if (!eventName || wiredEvents.indexOf(eventName) !== -1) return;

        el.addEventListener('click', function () {
          window.trackEvent?.(eventName, { location: path });
        });
      });

      // 6. SCROLL DEPTH TRACKING
      const scrollTracked = { 25: false, 50: false, 75: false, 100: false };

      function handleScrollDepth() {
        const doc = document.documentElement;
        const scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        if (scrollHeight <= 0) return;

        const percent = Math.round((scrollTop / scrollHeight) * 100);

        [25, 50, 75, 100].forEach(function (mark) {
          if (!scrollTracked[mark] && percent >= mark) {
            scrollTracked[mark] = true;
            window.trackEvent?.('scroll_depth', { percent: mark, location: path });
          }
        });
      }

      window.addEventListener('scroll', handleScrollDepth);
    });
  };

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    loadGoogleAnalytics();
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-foreground">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies for analytics.{' '}
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Learn more
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="whitespace-nowrap"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="whitespace-nowrap"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    trackEvent?: (eventName: string, params?: Record<string, any>) => void;
  }
}
