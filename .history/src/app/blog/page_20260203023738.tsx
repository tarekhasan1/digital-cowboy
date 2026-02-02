import type { Metadata } from 'next';
import Blog from '@/components/updated/Blog';
import React from 'react';

export const metadata: Metadata = {
  title: "Blog | Digital Cowboy",
  description: "Latest articles and insights about web design, development, and digital solutions.",
  keywords: ["blog", "articles", "web design", "development tips", "digital insights"],
  openGraph: {
    title: "Blog | Digital Cowboy",
    description: "Latest articles and insights about web design and development",
    type: "website",
  },
  alternates: {
    canonical: "https://digitalcowboy.com.au/blog",
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