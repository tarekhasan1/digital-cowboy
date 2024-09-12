import AboutUs from "@/components/AboutUs";
import Banner from "@/components/Banner";
import ContactUs from "@/components/ContactUs";
import FeaturedProject from "@/components/FeaturedProject";
import OurTeam from "@/components/OurTeam";
import PricingPlan from "@/components/PricingPlan";
import Services from "@/components/Services";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import Timeline from "@/components/Timeline";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center overflow-hidden" style={{ backgroundImage: "url('/bg5.gif')" }}>
      <Banner/>
      {/* <AboutUs/> */}
      {/* <StatsSection/> */}
      <Services/>
      <Timeline/>
      <FeaturedProject/>
      <PricingPlan/>
      {/* <OurTeam/> */}
      <Testimonials/>
      <ContactUs/>
    </main>
  );
}
