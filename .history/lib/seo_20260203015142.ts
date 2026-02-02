import type { Metadata } from 'next';

export interface PageSEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export function generateMetadata(config: PageSEOConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    canonical: config.canonical,
    openGraph: {
      title: config.title,
      description: config.description,
      type: (config.ogType as any) || 'website',
      images: config.ogImage ? [{ url: config.ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : [],
    },
  };
}

export const siteConfig = {
  name: 'Digital Cowboy',
  description: 'We wrangle pixels. We tame tech. We build websites that make you say yeeha!',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalcowboy.com',
  ogImage: '/og-image.jpg',
  twitterHandle: '@digitalcowboy',
};

export const routes = {
  home: '/',
  about: '/about',
  blog: '/blog',
  pricing: '/pricing',
  login: '/login',
  contact: '/#contact',
};
