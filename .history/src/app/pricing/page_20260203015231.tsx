import type { Metadata } from "next";
import PricingList from '@/components/PricingList';
import React from 'react';

export const metadata: Metadata = {
  title: "Pricing - Digital Cowboy",
  description: "Check out our transparent and competitive pricing plans for web design and development services. Find the perfect plan for your business.",
  keywords: [
    "pricing",
    "web design pricing",
    "web development cost",
    "pricing plans",
    "affordable web design",
    "package options",
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/pricing`,
  openGraph: {
    type: "website",
    title: "Pricing - Digital Cowboy",
    description: "Transparent and competitive pricing plans for web design and development services.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/pricing`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Digital Cowboy Pricing",
      },
    ],
  },
};

const page = () => {
    return (
        <div>
            <PricingList/>
        </div>
    );
};

export default page;