import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: object | object[];
  noindex?: boolean;
  robots?: string;
}

export function SEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogUrl,
  ogType = 'website',
  ogImage,
  structuredData,
  noindex = false,
  robots,
}: SEOProps) {
  const blocks = structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content={robots || (noindex ? 'noindex, nofollow' : 'index, follow')} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {(ogUrl || canonical) && <meta property="og:url" content={ogUrl || canonical} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Veni. Vidi. Vici." />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@caesartheday" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Structured Data */}
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
