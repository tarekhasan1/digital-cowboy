import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const heading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "DigitalCowboy | Build. Automate. Grow.",
  description: "Digital products, AI automation and growth systems for ambitious businesses.",
  keywords: ["web design", "web development", "AI automation", "digital agency", "custom software", "growth marketing"],
  icons: "/icon.png",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: "DigitalCowboy",
    description: "Digital products, AI automation and growth systems for ambitious businesses.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DigitalCowboy",
    description: "Digital products, AI automation and growth systems for ambitious businesses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${heading.variable}`}>
      <meta name="google-site-verification" content="j1p4ekYU6LmzxOzBBmnjRZADcx8CHpwo-RYsznz2N14" />
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-primary/30">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
