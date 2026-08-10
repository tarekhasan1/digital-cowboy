import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import { Code2, MonitorSmartphone, Database, Layers, CheckCircle2, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Software Development | DigitalCowboy",
  description: "Software built around your business. Custom SaaS, web apps, portals and business systems.",
};

const SERVICES = [
  {
    title: "SaaS Development",
    description: "Launch your own software-as-a-service product with scalable architecture and subscription management.",
    icon: Code2,
  },
  {
    title: "Web Applications",
    description: "Complex, browser-based applications that run fast, feel native, and solve specific business problems.",
    icon: MonitorSmartphone,
  },
  {
    title: "Customer Portals",
    description: "Secure areas for your clients to manage their data, bookings, payments, and interactions with your business.",
    icon: Lock,
  },
  {
    title: "Internal Business Systems",
    description: "Replace spreadsheets with custom tools designed exactly for your team's workflow.",
    icon: Database,
  },
  {
    title: "API Integrations",
    description: "Connect disparate tools and systems so data flows seamlessly across your business without manual entry.",
    icon: Layers,
  }
];

export default function SoftwareDevelopmentPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold tracking-widest uppercase mb-8">
            Software Development
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Software built around your business.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Stop forcing your business to fit off-the-shelf software. We build scalable web applications and SaaS platforms that work exactly the way you do.
          </p>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How we build software</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Scope", desc: "We map out the logic, database structure, and user flow before writing code." },
              { title: "Design", desc: "We create high-fidelity UI designs so you know exactly what the software will look like." },
              { title: "Develop", desc: "We build using modern, scalable tech stacks (React, Next.js, Node, Postgres)." },
              { title: "Deploy", desc: "Rigorous testing, secure deployment, and ongoing maintenance." }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-4xl font-bold text-purple-500/20 mb-4">0{i + 1}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
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
