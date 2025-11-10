import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Download, FileText } from 'lucide-react';
import { getNewsletterIndexData, getGlobals, type GlobalsData } from '@/utils/getRegionData';
import { Footer } from '@/components/common/Footer';

interface NewsletterIndexData {
  hero: {
    headline: string;
    tagline: string;
    backgroundImage: string;
  };
  featured: {
    slug: string;
    title: string;
    subtitle: string;
    issueNumber: number;
    date: string;
    description: string;
    heroImage: string;
    ctaText: string;
    ctaLink: string;
  };
  newsletters: Array<{
    slug: string;
    title: string;
    issueNumber: number;
    date: string;
    status: 'live' | 'coming-soon';
    thumbnail: string;
    description: string;
    ctaText: string;
    ctaLink?: string;
    expectedDate?: string;
  }>;
  archive: Array<{
    title: string;
    issueNumber: number;
    date: string;
    format: string;
    thumbnail: string;
    downloadUrl: string;
    fileSize: string;
    description: string;
  }>;
}

const NewsletterIndex = () => {
  const [data, setData] = useState<NewsletterIndexData | null>(null);
  const [globals, setGlobals] = useState<GlobalsData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    Promise.all([getNewsletterIndexData(), getGlobals()])
      .then(([indexData, globalsData]) => {
        setData(indexData);
        setGlobals(globalsData);
        setTimeout(() => setIsVisible(true), 100);
      })
      .catch(error => console.error('Failed to load data:', error));
  }, []);

  if (!data || !globals) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading newsletters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.hero.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Logo - Top Right */}
        <div className="absolute top-8 right-8 z-10">
          <img 
            src="/images/shared/caesartheday-badge.png" 
            alt="CaesarTheDay - Retire Smart, Live Better"
            className="h-44 md:h-56 lg:h-64 w-auto drop-shadow-2xl opacity-0 animate-fade-in"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 mt-20 md:mt-0">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {data.hero.headline}
            </h1>
            <p className={`text-xl md:text-2xl text-white/90 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {data.hero.tagline}
            </p>
          </div>

          {/* Featured Newsletter Card */}
          <div className={`max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Card className="overflow-hidden hover-lift" style={{ boxShadow: 'var(--shadow-strong)' }}>
              <div className="grid md:grid-cols-2 gap-0">
                <div 
                  className="h-64 md:h-auto bg-cover bg-center"
                  style={{ backgroundImage: `url(${data.featured.heroImage})` }}
                />
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-primary text-primary-foreground">
                    Current Issue
                  </Badge>
                  <CardTitle className="text-3xl md:text-4xl mb-2">
                    {data.featured.title}
                  </CardTitle>
                  <p className="text-muted-foreground mb-2">
                    Issue #{data.featured.issueNumber} • {data.featured.date}
                  </p>
                  <p className="text-lg text-foreground/90 mb-6 leading-relaxed">
                    {data.featured.description}
                  </p>
                  <Link to={data.featured.ctaLink}>
                    <Button size="lg" className="w-full md:w-auto group">
                      {data.featured.ctaText}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* All Regional Newsletters Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Regional Newsletters</h2>
              <p className="text-xl text-muted-foreground">
                Deep dives into Italy's most compelling places to retire
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.newsletters.map((newsletter, index) => (
                <Card 
                  key={newsletter.slug} 
                  className={`overflow-hidden hover-lift animate-fade-in-up animate-stagger-${Math.min(index + 1, 4)}`}
                >
                  <div 
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${newsletter.thumbnail})` }}
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={newsletter.status === 'live' ? 'default' : 'secondary'}
                        className={newsletter.status === 'live' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}
                      >
                        {newsletter.status === 'live' ? 'Live' : 'Coming Soon'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Issue #{newsletter.issueNumber}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{newsletter.title}</CardTitle>
                    <CardDescription>{newsletter.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">{newsletter.description}</p>
                  </CardContent>
                  <CardFooter>
                    {newsletter.status === 'live' ? (
                      <Link to={newsletter.ctaLink!} className="w-full">
                        <Button className="w-full group">
                          {newsletter.ctaText}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full">
                        {newsletter.ctaText}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Archive Section */}
      {data.archive.length > 0 && (
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Veni Vidi Vici Newsletter Archive</h2>
                <p className="text-xl text-muted-foreground">
                  Past editions available as PDFs
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.archive.map((item, index) => (
                  <Card 
                    key={item.issueNumber} 
                    className={`overflow-hidden hover-lift animate-fade-in-up animate-stagger-${Math.min(index + 1, 4)}`}
                  >
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.thumbnail})` }}
                    />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          {item.format}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.fileSize}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                      <CardDescription className="text-sm">
                        Issue #{item.issueNumber} • {item.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-foreground/70">{item.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full group" asChild>
                        <a href={item.downloadUrl} download>
                          <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                          Download PDF
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer globals={globals} />
    </div>
  );
};

export default NewsletterIndex;
