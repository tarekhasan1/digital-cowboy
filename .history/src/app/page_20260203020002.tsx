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
import Image from "next/image";

export const metadata: Metadata = {
  title: "Digital Cowboy | Web Design & Development Services",
  description: "Professional web design and development services. We create responsive, modern websites that drive results for your business.",
  keywords: ["web design", "web development", "custom websites", "responsive design", "digital services"],
  openGraph: {
    title: "Digital Cowboy | Web Design & Development",
    description: "Professional web design and development services",
    type: "website",
  },
  alternates: {
    canonical: "https://digitalcowboy.com",
  },
};

export default function Home() {
  return (
    <main className="flex flex-col font-serif justify-center items-center bg-black overflow-hidden">
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
