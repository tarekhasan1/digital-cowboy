import type { Metadata } from "next";
import About from '@/components/updated/About';
import React from 'react';

export const metadata: Metadata = {
  title: "About Us - Digital Cowboy",
  description: "Learn about Digital Cowboy. Meet our team of experienced web designers and developers passionate about creating outstanding digital solutions.",
  keywords: [
    "about digital cowboy",
    "our team",
    "web design team",
    "web development company",
    "our story",
    "company values",
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/about`,
  openGraph: {
    type: "website",
    title: "About Us - Digital Cowboy",
    description: "Learn about Digital Cowboy. Meet our team of experienced web designers and developers.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/about`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "About Digital Cowboy",
      },
    ],
  },
};

const page = () => {
    return (
        <div>
            <About/>
        </div>
    );
};

export default page;