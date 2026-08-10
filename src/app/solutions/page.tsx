import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import Link from "next/link";
import { ArrowRight, Wrench, Zap, Building2, Briefcase, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions | DigitalCowboy",
  description: "Digital solutions built around your business. See how we help service businesses, tradies, startups, and growing operations.",
};

const SEGMENTS = [
  {
    title: "Service Businesses",
    description: "Websites, booking systems, lead generation and automation to help you serve more clients with less admin.",
    icon: Briefcase,
    tags: ["Booking Systems", "Lead Gen", "Automation"]
  },
  {
    title: "Tradies",
    description: "Lead-generating websites, local SEO, quote enquiries and automated follow-up to keep the pipeline full.",
    icon: Wrench,
    tags: ["Local SEO", "Quote Forms", "CRM"]
  },
  {
    title: "Startups",
    description: "MVPs, SaaS products, web applications and scalable technology to get your idea to market quickly.",
    icon: Zap,
    tags: ["SaaS", "MVP", "Web Apps"]
  },
  {
    title: "Professional Services",
    description: "Lead generation, customer portals, automation and digital marketing for B2B companies.",
    icon: Building2,
    tags: ["B2B", "Customer Portals", "Marketing"]
  },
  {
    title: "Growing Businesses",
    description: "Custom software, AI automation and growth systems to scale operations without scaling headcount.",
    icon: TrendingUp,
    tags: ["Custom Software", "AI", "Dashboards"]
  }
];

export default function SolutionsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Built around your business.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            We don't believe in one-size-fits-all. We build solutions tailored to the specific challenges of your industry.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {SEGMENTS.map((segment, index) => {
              const Icon = segment.icon;
              return (
                <div key={index} className="group p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 flex flex-col">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Icon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{segment.title}</h2>
                  </div>
                  
                  <p className="text-white/60 text-lg leading-relaxed mb-8 flex-grow">
                    {segment.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {segment.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-background border border-white/10 rounded-full text-sm font-medium text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link href="/contact" className="inline-flex items-center text-primary font-medium group-hover:gap-3 transition-all">
                    Discuss your project <ArrowRight size={18} className="ml-2" />
                  </Link>
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
