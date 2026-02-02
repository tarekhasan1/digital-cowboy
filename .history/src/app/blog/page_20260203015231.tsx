import type { Metadata } from "next";
import Blog from '@/components/updated/Blog';
import React from 'react';

export const metadata: Metadata = {
  title: "Blog - Digital Cowboy",
  description: "Read our latest articles about web design, web development, digital marketing, and tech trends. Stay updated with insights from Digital Cowboy.",
  keywords: [
    "blog",
    "web design blog",
    "web development tips",
    "digital marketing",
    "tech articles",
    "industry insights",
    "web trends",
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/blog`,
  openGraph: {
    type: "website",
    title: "Blog - Digital Cowboy",
    description: "Read our latest articles about web design, web development, and digital marketing.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/blog`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Digital Cowboy Blog",
      },
    ],
  },
};

const page = () => {
    return (
        <div>
            <Blog/>
        </div>
    );
};

export default page;