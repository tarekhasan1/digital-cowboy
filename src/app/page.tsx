import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import TrustSection from "@/components/home/TrustSection";
import BuildAutomateGrow from "@/components/home/BuildAutomateGrow";
import FeaturedWork from "@/components/home/FeaturedWork";
import SolutionsSection from "@/components/home/SolutionsSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import ProcessSection from "@/components/home/ProcessSection";
import RecurringServices from "@/components/home/RecurringServices";
import FAQSection from "@/components/home/FAQSection";
import GlobalCTA from "@/components/GlobalCTA";

export const metadata: Metadata = {
  title: "DigitalCowboy | Build. Automate. Grow.",
  description: "Digital products, AI automation and growth systems for ambitious businesses.",
  alternates: {
    canonical: "https://digitalcowboy.com.au",
  },
};

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Hero />
      <TrustSection />
      <BuildAutomateGrow />
      <FeaturedWork />
      <SolutionsSection />
      <WhyUsSection />
      <ProcessSection />
      {/* Testimonials would go here - for now using a placeholder or existing if compatible, but skipping as per plan to build later or leave for real data */}
      <RecurringServices />
      <FAQSection />
      <GlobalCTA />
    </main>
  );
}
