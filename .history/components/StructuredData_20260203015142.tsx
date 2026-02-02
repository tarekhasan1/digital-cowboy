'use client';

interface StructuredDataProps {
  data: Record<string, any>;
}

/**
 * Structured Data Component for JSON-LD schema markup
 * Helps search engines understand your content better
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * Organization Schema
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Digital Cowboy',
  description: 'We wrangle pixels. We tame tech. We build websites that make you say yeeha!',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalcowboy.com',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalcowboy.com'}/logo.png`,
  sameAs: [
    'https://twitter.com/digitalcowboy',
    'https://linkedin.com/company/digitalcowboy',
  ],
  contact: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
  },
};

/**
 * Website Schema
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Digital Cowboy',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalcowboy.com',
  description: 'We wrangle pixels. We tame tech. We build websites that make you say yeeha!',
};

/**
 * Service Schema
 */
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Digital Cowboy',
  description: 'Web Design and Development Services',
  image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalcowboy.com'}/og-image.jpg`,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalcowboy.com',
  telephone: '+1-555-123-4567',
  priceRange: '$$',
  areaServed: 'US',
  serviceType: ['Web Design', 'Web Development', 'Digital Marketing'],
};
