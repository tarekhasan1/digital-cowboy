import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | DigitalCowboy",
  description: "Transparent, outcome-focused pricing for digital products and growth systems.",
};

const PACKAGES = [
  {
    name: "Launch",
    price: "A$1,490",
    desc: "For small businesses that need a professional digital presence.",
    features: [
      "Professional website",
      "Responsive design",
      "Essential SEO",
      "Contact/lead forms",
      "Analytics setup",
      "CMS integration",
      "Launch support"
    ]
  },
  {
    name: "Growth",
    price: "A$3,500",
    desc: "For businesses that want a website designed to generate leads and grow.",
    popular: true,
    features: [
      "Custom website",
      "Conversion-focused UX",
      "Advanced SEO setup",
      "Analytics & Tracking",
      "CRM Integrations",
      "Lead generation flows",
      "Performance optimization"
    ]
  },
  {
    name: "Scale",
    price: "A$6,000+",
    desc: "For businesses that need more advanced digital systems.",
    features: [
      "Web applications",
      "Customer portals",
      "Booking systems",
      "Advanced API integrations",
      "Workflow automation",
      "Custom functionality"
    ]
  },
  {
    name: "Custom Software",
    price: "A$10,000+",
    desc: "For complex software, SaaS and business platforms.",
    features: [
      "Full-stack development",
      "Database architecture",
      "Scalable infrastructure",
      "Complex logic & state",
      "Security & compliance",
      "Dedicated product management"
    ]
  }
];

export default function PricingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Clear pricing. No surprises.
          </h1>
          <p className="text-xl text-white/60 leading-relaxed mb-8">
            These are starting points. Every project is scoped around your specific requirements, but we believe in being upfront about costs.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map((pkg, index) => (
              <div 
                key={index} 
                className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                  pkg.popular 
                    ? "bg-white/10 border-primary shadow-2xl shadow-primary/10 -translate-y-2" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                    Recommended
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-white/60 text-sm mb-6 h-10">{pkg.desc}</p>
                
                <div className="mb-8 border-b border-white/10 pb-8">
                  <span className="text-sm text-white/50 block mb-1">Starting from</span>
                  <span className="text-4xl font-bold text-white">{pkg.price}</span>
                </div>
                
                <ul className="space-y-4 mb-10 flex-grow">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80">
                      <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/contact"
                  className={`w-full py-4 rounded-xl text-center font-semibold transition-colors mt-auto ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Start a Project
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 max-w-3xl mx-auto text-center p-10 rounded-3xl bg-primary/5 border border-primary/20">
            <h2 className="text-2xl font-bold text-white mb-4">Not sure what you need?</h2>
            <p className="text-white/70 mb-8">Book a free 15-minute discovery call to discuss your business and figure out the best approach.</p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full text-base font-semibold transition-all"
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </section>

      <GlobalCTA />
    </main>
  );
}