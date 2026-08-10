import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import { Search, MapPin, MousePointerClick, BarChart, PenTool, LayoutTemplate } from "lucide-react";

export const metadata: Metadata = {
  title: "Digital Marketing & SEO Services | DigitalCowboy",
  description: "Turn attention into growth with SEO, Local SEO, Google Ads, and conversion optimization.",
};

const SERVICES = [
  {
    title: "Search Engine Optimization (SEO)",
    description: "Improve your organic visibility on Google. We build sustainable search strategies that drive high-intent traffic over time.",
    icon: Search,
  },
  {
    title: "Local SEO",
    description: "Dominate your local market. We optimize your Google Business Profile and local citations to ensure customers find you first.",
    icon: MapPin,
  },
  {
    title: "Google Ads & Meta Ads",
    description: "Targeted paid advertising campaigns designed to generate leads and sales, with strict focus on return on ad spend (ROAS).",
    icon: MousePointerClick,
  },
  {
    title: "Conversion Optimization",
    description: "Traffic is useless if it doesn't convert. We analyze user behavior and optimize your digital properties to turn visitors into customers.",
    icon: LayoutTemplate,
  },
  {
    title: "Data & Analytics",
    description: "Stop guessing. We implement advanced tracking and provide clear reporting so you know exactly what's working.",
    icon: BarChart,
  },
  {
    title: "Content Strategy",
    description: "High-quality, relevant content that answers your customers' questions, builds trust, and supports your SEO efforts.",
    icon: PenTool,
  }
];

export default function DigitalMarketingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-widest uppercase mb-8">
            Digital Marketing
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Turn attention into growth.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            We don't promise vanity metrics or guaranteed rankings. We combine SEO, paid advertising, and conversion optimization to build measurable business growth.
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
                <div key={index} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6">
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
