import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { StructuredData, organizationSchema, websiteSchema } from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Digital Cowboy - Web Design & Development",
    template: "%s | Digital Cowboy",
  },
  description: "We wrangle pixels. We tame tech. We build websites that make you say yeeha! Professional web design and development services.",
  keywords: [
    "web design",
    "web development",
    "digital marketing",
    "custom websites",
    "web solutions",
    "freelance developer",
    "responsive design",
    "e-commerce",
  ],
  icons: "/icon.png",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com",
    siteName: "Digital Cowboy",
    title: "Digital Cowboy - Web Design & Development",
    description: "We wrangle pixels. We tame tech. We build websites that make you say yeeha!",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Digital Cowboy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@digitalcowboy",
    creator: "@digitalcowboy",
    title: "Digital Cowboy - Web Design & Development",
    description: "We wrangle pixels. We tame tech. We build websites that make you say yeeha!",
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/og-image.jpg`,
    ],
  },
  verification: {
    google: "j1p4ekYU6LmzxOzBBmnjRZADcx8CHpwo-RYsznz2N14",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="j1p4ekYU6LmzxOzBBmnjRZADcx8CHpwo-RYsznz2N14" />
        <link rel="alternate" hrefLang="en-US" href={process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
      </head>
      <body className={inter.className}>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
