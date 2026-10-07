import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import Link from "next/link";
import { ArrowRight, Layout, Code2, Bot, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | DigitalCowboy",
  description: "Websites, custom software, AI automation and digital marketing — everything you need to build, automate and grow.",
};

const SERVICES = [
  {
    title: "Website Development",
    description: "High-converting websites built with modern frameworks like Next.js — fast, responsive, and designed to generate leads.",
    icon: Layout,
    color: "blue",
    href: "/services/website-development",
  },
  {
    title: "Software Development",
    description: "Custom SaaS products, web applications, and internal business systems built around the way your business actually works.",
    icon: Code2,
    color: "purple",
    href: "/services/software-development",
  },
  {
    title: "AI & Automation",
    description: "Practical AI systems and workflow automation that save time, qualify leads, and eliminate manual data entry.",
    icon: Bot,
    color: "primary",
    href: "/services/ai-automation",
  },
  {
    title: "Digital Marketing",
    description: "SEO, local SEO, paid ads and conversion optimization to turn traffic into measurable business growth.",
    icon: Search,
    color: "orange",
    href: "/services/digital-marketing",
  },
];

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "hover:border-blue-500/50" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "hover:border-purple-500/50" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "hover:border-orange-500/50" },
  primary: { bg: "bg-primary/10", text: "text-primary", border: "hover:border-primary/50" },
};

export default function ServicesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Build. Automate. Grow.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Four disciplines, one team. We combine software engineering, AI automation and growth marketing to move your business forward.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const colors = COLOR_CLASSES[service.color];
              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`group p-10 rounded-3xl bg-white/5 border border-white/10 ${colors.border} transition-all duration-300 flex flex-col`}
                >
                  <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.text} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">{service.title}</h2>
                  <p className="text-white/60 text-lg leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>
                  <span className={`inline-flex items-center font-medium ${colors.text} group-hover:gap-3 transition-all`}>
                    Explore {service.title} <ArrowRight size={18} className="ml-2" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <GlobalCTA />
    </main>
  );
}
