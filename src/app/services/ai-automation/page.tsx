import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import { Bot, MessageSquare, Target, Zap, Server, Code } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Automation Services | DigitalCowboy",
  description: "Practical AI systems that save time, improve customer experiences and automate repetitive business processes.",
};

const SERVICES = [
  {
    title: "AI Customer Support",
    description: "Answer common customer questions automatically, 24/7, with intelligent chatbots trained on your business data.",
    icon: MessageSquare,
  },
  {
    title: "AI Lead Qualification",
    description: "Capture and qualify leads before they reach your team, ensuring you only spend time on high-value prospects.",
    icon: Target,
  },
  {
    title: "Automated Follow-Up",
    description: "Automatically follow up with enquiries and potential customers, increasing conversion rates without manual effort.",
    icon: Zap,
  },
  {
    title: "AI Knowledge Assistants",
    description: "Give your team instant access to business information, standard operating procedures, and technical docs.",
    icon: Bot,
  },
  {
    title: "Workflow Automation",
    description: "Connect forms, CRM, email, calendars and other business systems to eliminate manual data entry.",
    icon: Server,
  },
  {
    title: "Custom AI Solutions",
    description: "Build bespoke AI functionality tailored to your specific business requirements and operational bottlenecks.",
    icon: Code,
  }
];

export default function AIAutomationPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-widest uppercase mb-8">
            AI & Automation
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Put AI to work.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Practical AI systems that save time, improve customer experiences and automate repetitive business processes. No hype, just real operational leverage.
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
                <div key={index} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
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
