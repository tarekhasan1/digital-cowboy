import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import { Layout, Smartphone, Gauge, Search, MousePointerClick, BarChart2 } from "lucide-react";

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
    icon: Code, // Will use Layout/Code placeholder
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

// Reusing icon for custom dev since Code wasn't imported properly above. Let's fix that.
import { Code } from "lucide-react";

export default function WebsiteDevelopmentPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-widest uppercase mb-8">
            Website Development
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Websites that do more than look good.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Your website should attract attention, explain your value, generate enquiries and make it easier for customers to take action. We build high-converting digital platforms.
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
                <div key={index} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-white/60 leading-relaxed">
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
