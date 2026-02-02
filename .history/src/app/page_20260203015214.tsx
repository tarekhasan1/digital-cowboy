import type { Metadata } from "next";
import AboutUs from "@/components/AboutUs";
import ContactUs from "@/components/ContactUs";
import FeaturedProject from "@/components/FeaturedProject";
import OurTeam from "@/components/OurTeam";
import PricingPlan from "@/components/PricingPlan";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import Timeline from "@/components/Timeline";
import Banner from "@/components/updated/Banner";
import GlowUpSection from "@/components/updated/GlowUpSection";
import NoGeekSpeak from "@/components/updated/NoGeekSpeak";
import Services from "@/components/updated/Services";
import { StructuredData, serviceSchema } from "@/components/StructuredData";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Digital Cowboy - Web Design & Development Services",
  description: "Professional web design and development services. We build responsive, high-performance websites that drive results. Transform your digital presence with Digital Cowboy.",
  keywords: [
    "web design",
    "web development",
    "digital agency",
    "website design",
    "custom web solutions",
    "responsive design",
    "web development services",
  ],
  canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com",
  openGraph: {
    type: "website",
    title: "Digital Cowboy - Web Design & Development Services",
    description: "Professional web design and development services. We build responsive, high-performance websites that drive results.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalcowboy.com"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Digital Cowboy Home",
      },
    ],
  },
};

export default function Home() {
  return (
    <main className="flex flex-col font-serif justify-center items-center bg-black overflow-hidden">
      <StructuredData data={serviceSchema} />
      <Banner/>
      <NoGeekSpeak/>
      <Services/>
      <GlowUpSection/>
      <Timeline/>
      <FeaturedProject/>
      <Testimonials/>
    </main>
  );
}
