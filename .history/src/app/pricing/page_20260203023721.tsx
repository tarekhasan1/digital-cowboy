import type { Metadata } from 'next';
import PricingList from '@/components/PricingList';
import React from 'react';

export const metadata: Metadata = {
  title: "Pricing | Digital Cowboy",
  description: "Transparent, flexible pricing plans for web design and development services. Find the perfect plan for your business.",
  keywords: ["pricing", "plans", "web design pricing", "development services", "affordable web solutions"],
  openGraph: {
    title: "Pricing | Digital Cowboy",
    description: "Transparent pricing plans for web design and development services",
    type: "website",
  },
  alternates: {
    canonical: "https://digitalcowboy.com.au/pricing",
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