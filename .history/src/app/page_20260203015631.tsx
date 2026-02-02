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
