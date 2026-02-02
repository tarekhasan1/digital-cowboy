import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Cowboy | Web Design & Development Services",
  description: "We wrangle pixels. We tame tech. We build websites that make you say yeeha! Professional web design and development services.",
  keywords: ["web design", "web development", "digital agency", "custom websites", "responsive design", "web solutions"],
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
    title: "Digital Cowboy",
    description: "Professional web design and development services",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Cowboy",
    description: "We wrangle pixels. We tame tech. We build websites that make you say yeeha!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="j1p4ekYU6LmzxOzBBmnjRZADcx8CHpwo-RYsznz2N14" />
      <body className={inter.className}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
