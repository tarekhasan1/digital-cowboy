import type { Metadata } from 'next';
import About from '@/components/updated/About';
import React from 'react';

export const metadata: Metadata = {
  title: "About Us | Digital Cowboy",
  description: "Learn about Digital Cowboy's team, experience, and commitment to delivering outstanding web solutions for your business.",
  keywords: ["about us", "digital agency", "web development team", "company story"],
  openGraph: {
    title: "About Us | Digital Cowboy",
    description: "Learn about our team and expertise in web design and development",
    type: "website",
  },
  alternates: {
    canonical: "https://digitalcowboy.com.au/about",
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