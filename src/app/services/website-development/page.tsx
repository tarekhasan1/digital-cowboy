import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import { Layout, Code, Smartphone, Gauge, Search, MousePointerClick, BarChart2 } from "lucide-react";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

export const metadata: Metadata = {
  title: "Website Development | DigitalCowboy",
  description: "Websites that do more than look good. High-converting digital platforms for modern businesses.",
};

const SERVICES = [
  {
    title: "Strategy & UX",
    description: "We design user journeys that guide visitors toward taking action, eliminating friction along the way.",
    icon: Layout,
  },
  {
    title: "Custom Development",
    description: "No slow page builders. We code custom, high-performance websites using modern frameworks like Next.js.",
    icon: Code,
  },
  {
    title: "Responsive Design",
    description: "Flawless experiences across mobile, tablet, and desktop devices. Built mobile-first.",
    icon: Smartphone,
  },
  {
    title: "Performance Optimization",
    description: "Lightning-fast load times for better user experience and higher Google rankings.",
    icon: Gauge,
  },
  {
    title: "Technical SEO",
    description: "Built from the ground up with clean code, proper semantic HTML, and structured data.",
    icon: Search,
  },
  {
    title: "Conversion Optimization",
    description: "Clear CTAs, persuasive copy structuring, and strategic layouts designed to generate leads.",
    icon: MousePointerClick,
  }
];

export default function WebsiteDevelopmentPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <AnimatedBackground variant="hero" accent="blue" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-widest uppercase mb-8">
            Website Development
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Websites that do more than look good.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            We build high-converting digital platforms that attract attention and generate enquiries.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group p-8 rounded-3xl glass-card hover:-translate-y-2 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 relative z-10">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">{service.title}</h3>
                  <p className="text-white/60 leading-relaxed relative z-10">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <GlobalCTA />
    </main>
  );
}
