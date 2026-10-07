import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, MoveRight } from 'lucide-react';
import { getNewsletterIndexData, getGlobals, type GlobalsData } from '@/utils/getRegionData';
import { Footer } from '@/components/common/Footer';
import { SEO } from '@/components/common/SEO';
import { withUtm } from '@/lib/utm';
import ItalyMapInteractive from '@/components/sections/ItalyMapInteractive';
import HomeHeader from '@/components/home/HomeHeader';
import { EmailCapture } from '@/components/sections/EmailCapture';

interface FeaturedData {
  slug: string;
  title: string;
  subtitle?: string;
  issueNumber?: number;
  date?: string;
  description?: string;
  summary?: string;
  facts?: Array<{ label: string; value: string }>;
  heroImage: string;
  ctaText: string;
  ctaLink: string;
}

interface RegionEntry {
  slug: string;
  title: string;
  displayName?: string;
  issueNumber?: number;
  date?: string;
  status?: 'live' | 'coming-soon';
  format?: string;
  area?: string;
  shortDescription?: string;
  thumbnail: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  downloadUrl?: string;
  expectedDate?: string;
}

interface ArchiveEntry {
  title: string;
  issueNumber: number;
  date: string;
  format: string;
  area?: string;
  shortDescription?: string;
  thumbnail: string;
  downloadUrl: string;
  fileSize: string;
  description: string;
}

interface NewsletterIndexData {
  hero: {
    headline: string;
    tagline: string;
    backgroundImage: string;
  };
  featured: FeaturedData;
  newsletters: RegionEntry[];
  archive: ArchiveEntry[];
}

// The twenty Italian regions, with canonical slugs and display names.
const ALL_REGIONS: Array<{ slug: string; title: string; area: string }> = [
  { slug: 'liguria', title: 'Liguria', area: 'north' },
  { slug: 'piemonte', title: 'Piemonte', area: 'north' },
  { slug: 'lombardia', title: 'Lombardia', area: 'north' },
  { slug: 'trentino-alto-adige', title: 'Trentino-Alto Adige', area: 'north' },
  { slug: 'veneto', title: 'Veneto', area: 'north' },
  { slug: 'friuli-venezia-giulia', title: 'Friuli-Venezia Giulia', area: 'north' },
  { slug: 'lazio', title: 'Lazio', area: 'centre' },
  { slug: 'umbria', title: 'Umbria', area: 'centre' },
  { slug: 'le-marche', title: 'Le Marche', area: 'centre' },
  { slug: 'abruzzo', title: 'Abruzzo', area: 'centre' },
  { slug: 'molise', title: 'Molise', area: 'south' },
  { slug: 'puglia', title: 'Puglia', area: 'south' },
  { slug: 'calabria', title: 'Calabria', area: 'south' },
  { slug: 'basilicata', title: 'Basilicata', area: 'south' },
  { slug: 'sicilia', title: 'Sicilia', area: 'islands' },
  { slug: 'sardegna', title: 'Sardegna', area: 'islands' },
  { slug: 'toscana', title: 'Toscana', area: 'centre' },
  { slug: 'emilia-romagna', title: 'Emilia-Romagna', area: 'north' },
  { slug: 'campania', title: 'Campania', area: 'south' },
  { slug: 'valle-d-aosta', title: "Valle d'Aosta", area: 'north' },
];

const GROUPS = [
  { id: 'north', heading: 'The North', order: ['liguria', 'piemonte', 'lombardia', 'trentino-alto-adige', 'veneto', 'friuli-venezia-giulia'] },
  { id: 'centre', heading: 'The Centre', order: ['lazio', 'umbria', 'le-marche', 'abruzzo'] },
  { id: 'south', heading: 'The South', order: ['molise', 'puglia', 'calabria', 'basilicata'] },
  { id: 'islands', heading: 'The Islands', order: ['sicilia', 'sardegna'] },
] as const;

const cardLinkClass =
  'group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-medium';

const primaryBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-terracotta-deep';

const secondaryBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-foreground/30 bg-transparent px-6 py-3 font-semibold transition-colors hover:bg-foreground/5';

const textLinkClass =
  'inline-flex items-center gap-1 font-semibold text-terracotta-deep transition-colors group-hover:text-accent';

const NewsletterIndex = () => {
  const [data, setData] = useState<NewsletterIndexData | null>(null);
  const [globals, setGlobals] = useState<GlobalsData | null>(null);

  useEffect(() => {
    Promise.all([getNewsletterIndexData(), getGlobals()])
      .then(([indexData, globalsData]) => {
        setData(indexData);
        setGlobals(globalsData);
      })
      .catch((error) => console.error('Failed to load data:', error));
  }, []);

  if (!data || !globals) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4 h-8 w-8 rounded-full border-4 border-accent border-t-transparent" />
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  // ---- Data shaping -------------------------------------------------------
  const titles: Record<string, string> = {};
  ALL_REGIONS.forEach((r) => {
    titles[r.slug] = r.title;
  });
  // Any region from the data that is not in the canonical list (a newly
  // published region) still gets a title so the map and cards render.
  data.newsletters.forEach((n) => {
    if (!titles[n.slug]) titles[n.slug] = n.title;
  });

  const liveEntries = data.newsletters.filter((n) => n.status === 'live');
  const comingSoonEntries = data.newsletters.filter((n) => n.status === 'coming-soon');
  const pdfEntries: RegionEntry[] = (data.archive || []).map((a) => ({
    slug: a.title.toLowerCase().replace(/\s+/g, '-'),
    title: a.title,
    issueNumber: a.issueNumber,
    date: a.date,
    format: a.format,
    area: a.area,
    shortDescription: a.shortDescription,
    thumbnail: a.thumbnail,
    description: a.description,
    downloadUrl: a.downloadUrl,
  }));

  const entries: RegionEntry[] = [...liveEntries, ...comingSoonEntries, ...pdfEntries];

  const coveredSlugs = new Set<string>([
    ...liveEntries.map((n) => n.slug),
    ...pdfEntries.map((p) => p.slug),
  ]);
  const liveCount = liveEntries.length;
  const coveredCount = coveredSlugs.size;

  const areaOf = (entry: RegionEntry): string | undefined =>
    entry.area || ALL_REGIONS.find((r) => r.slug === entry.slug)?.area;

  const uncovered = ALL_REGIONS.filter(
    (r) =>
      !coveredSlugs.has(r.slug) &&
      !comingSoonEntries.some((c) => c.slug === r.slug)
  );

  const mapEntries = entries.map((e) => ({
    slug: e.slug,
    title: e.title,
    date: e.date,
    status: e.status,
    format: e.format,
    ctaLink: e.ctaLink,
    downloadUrl: e.downloadUrl,
  }));

  const featured = data.featured;

  const renderCard = (entry: RegionEntry) => {
    const isPdf = Boolean(entry.downloadUrl);
    const isComingSoon = entry.status === 'coming-soon';
    const dateLabel = isPdf
      ? `PDF · ${entry.date}`
      : entry.status === 'live'
        ? `Updated ${entry.date}`
        : 'Web guide coming';
    const description = entry.shortDescription || entry.description;
    const footerLink = isPdf ? 'Download →' : isComingSoon ? 'Notify me →' : 'Read guide →';

    const inner = (
      <>
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={entry.thumbnail}
            alt={entry.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-5">
          <div className="mb-2 flex min-h-[22px] items-center">
            {isPdf && (
              <span className="rounded px-2 py-0.5 text-xs font-semibold text-foreground" style={{ backgroundColor: 'hsl(39 42% 71%)' }}>
                PDF edition · web guide coming
              </span>
            )}
            {isComingSoon && (
              <span className="rounded px-2 py-0.5 text-xs font-semibold text-foreground" style={{ backgroundColor: 'hsl(20 55% 92%)' }}>
                Coming soon
              </span>
            )}
          </div>
          <h3 className="font-display text-[28px] font-semibold leading-tight">
            {entry.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[17px] text-muted-foreground">
            {description}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">{dateLabel}</span>
            <span className={textLinkClass}>
              {footerLink}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </>
    );

    if (isPdf) {
      return (
        <a key={entry.slug} href={entry.downloadUrl} download className={cardLinkClass}>
          {inner}
        </a>
      );
    }
    if (isComingSoon || !entry.ctaLink) {
      return (
        <a
          key={entry.slug}
          href="#signup"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={cardLinkClass}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link key={entry.slug} to={entry.ctaLink} className={cardLinkClass}>
        {inner}
      </Link>
    );
  };

  return (
    <div className="brand-ctd min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <SEO
        title="Veni. Vidi. Vici. | Your Guide to Conquering Retirement in Italy"
        description="Veni. Vidi. Vici. is your region-by-region guide to conquering retirement in Italy, with deep dives on cost of living, towns worth living in, regional secrets, and interactive tools like maps, quizzes, and recipes."
        canonical="https://italy.caesartheday.com/"
        ogTitle="Veni. Vidi. Vici. | Your Guide to Conquering Retirement in Italy"
        ogDescription="Region-by-region guides to retiring in Italy: towns worth living in, real monthly costs, healthcare access and honest tradeoffs."
        ogUrl="https://italy.caesartheday.com/"
        ogType="website"
        ogImage="https://italy.caesartheday.com/og-veni-vidi-vici-sep2026.jpg"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Veni. Vidi. Vici. – Your Guide to Conquering Retirement in Italy',
          description:
            'Region-by-region guides to retiring in Italy: towns worth living in, real monthly costs, healthcare access and honest tradeoffs.',
          url: 'https://italy.caesartheday.com/',
          publisher: {
            '@type': 'Organization',
            name: 'CaesarTheDay®',
            url: 'https://www.caesartheday.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://italy.caesartheday.com/images/shared/caesartheday-logo.png',
            },
          },
          inLanguage: 'en',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: liveEntries.map((n, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: n.title,
              url: `https://italy.caesartheday.com/${n.slug}`,
            })),
          },
        }}
      />

      <HomeHeader />

      {/* Hero — text + map, side by side */}
      <section id="map" className="scroll-mt-24">
        <div className="container mx-auto grid items-center gap-12 px-4 py-14 md:py-20 lg:grid-cols-2">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-deep">
              An independent guide to retiring in Italy
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <h1 className="font-display text-[clamp(4rem,9vw,6rem)] font-semibold leading-[0.95]">
                Veni.
                <br />
                Vidi.
                <br />
                <span className="italic text-terracotta-deep">Vici.</span>
              </h1>
              <img
                src="/images/shared/veni-vidi-vici-seal.png"
                alt="Veni. Vidi. Vici. Regional Guides seal"
                width={600}
                height={600}
                className="w-[clamp(150px,20vw,280px)] shrink-0"
              />
            </div>
            <p className="mt-8 text-[22px] leading-snug">
              Your field guide to conquering retirement in Italy — one region at a time.
            </p>
            <p className="mt-4 max-w-lg text-[17px] text-muted-foreground">
              Town-by-town guides with real costs, healthcare, tax rules and the honest
              downsides. Pick a region on the map, or browse them all below.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#regions" className={primaryBtnClass}>
                Explore the regions
                <ArrowDown className="h-4 w-4" />
              </a>
              <a href="#signup" className={secondaryBtnClass}>
                Get new regions by email
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6">
              <div>
                <div className="font-display text-2xl font-semibold">{coveredCount} of 20</div>
                <div className="text-sm text-muted-foreground">regions covered</div>
              </div>
              <div>
                <div className="font-display text-2xl font-semibold">{liveCount}</div>
                <div className="text-sm text-muted-foreground">full web guides</div>
              </div>
              <div>
                <div className="font-display text-2xl font-semibold">Monthly</div>
                <div className="text-sm text-muted-foreground">new region added</div>
              </div>
            </div>
          </div>
          <div>
            <ItalyMapInteractive entries={mapEntries} featuredSlug={featured.slug} titles={titles} />
          </div>
        </div>
      </section>

      {/* Latest region band */}
      <section id="latest" className="scroll-mt-24 border-y border-border bg-card">
        <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div className="overflow-hidden rounded-2xl shadow-medium">
            <img
              src={featured.heroImage}
              alt={featured.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                Latest region
              </span>
              {featured.date && (
                <span className="text-sm text-muted-foreground">Added {featured.date}</span>
              )}
            </div>
            <h2 className="font-display text-5xl font-semibold leading-tight md:text-7xl">
              {featured.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {featured.summary || featured.description}
            </p>
            {featured.facts && featured.facts.length > 0 && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {featured.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-lg p-4"
                    style={{ backgroundColor: 'hsl(36 30% 90%)' }}
                  >
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {fact.label}
                    </div>
                    <div className="font-medium">{fact.value}</div>
                  </div>
                ))}
              </div>
            )}
            <Link to={featured.ctaLink} className="mt-8 inline-flex">
              <span className={primaryBtnClass + ' bg-primary text-primary-foreground hover:bg-primary/85'}>
                {featured.ctaText}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* The Regions */}
      <section id="regions" className="scroll-mt-24 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-semibold md:text-5xl">The Regions</h2>
            <p className="mt-3 text-[17px] text-muted-foreground">
              Every Italian region, in one growing guide — full web guides, PDF editions
              and the ones still on the way.
            </p>
          </div>

          {GROUPS.map((group) => {
            const items = entries
              .filter((e) => areaOf(e) === group.id)
              .sort(
                (a, b) =>
                  group.order.indexOf(a.slug as never) - group.order.indexOf(b.slug as never)
              );
            if (items.length === 0) return null;
            return (
              <div key={group.id} className="mt-12">
                <div className="mb-5 flex items-baseline gap-3">
                  <h3 className="font-display text-2xl italic text-terracotta-deep md:text-3xl">
                    {group.heading}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {items.length} {items.length === 1 ? 'region' : 'regions'}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map(renderCard)}
                </div>
              </div>
            );
          })}

          {/* Not covered yet */}
          {uncovered.length > 0 && (
            <div className="mt-14 rounded-2xl border border-dashed border-foreground/30 p-6 md:p-8">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium">
                    Not covered yet: {uncovered.map((r) => r.title).join(', ')}
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    Tell Caesar which region you want next — the most-requested one goes
                    to the top of the list.
                  </p>
                </div>
                <a href="#signup" className={secondaryBtnClass + ' shrink-0'}>
                  Vote for the next region
                  <MoveRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <EmailCapture id="signup" campaign="home" />

      {/* About Caesar */}
      <section id="about" className="scroll-mt-24 py-16 md:py-24">
        <div className="container mx-auto grid max-w-4xl items-center gap-10 px-4 md:grid-cols-[220px_1fr]">
          <img
            src="/images/caesar-smiling.jpg"
            alt="Caesar, founder of CaesarTheDay"
            className="h-[220px] w-[220px] rounded-full object-cover shadow-medium"
          />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-deep">
              Who's behind the guides
            </p>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Hi, I'm Caesar.</h2>
            <p className="mt-4 max-w-2xl text-[17px] text-muted-foreground">
              I built CaesarTheDay® while planning my own family's move to Italy — because
              the process should feel structured, not scattered. Every region here is
              researched the way we're researching our own.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
              <a
                href={withUtm('https://www.caesartheday.com', 'home')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-terracotta-deep hover:underline"
              >
                Visit CaesarTheDay.com →
              </a>
              <a
                href={globals.brand.share.group}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-terracotta-deep hover:underline"
              >
                Join the Facebook community →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer globals={globals} variant="light" />
    </div>
  );
};

export default NewsletterIndex;
