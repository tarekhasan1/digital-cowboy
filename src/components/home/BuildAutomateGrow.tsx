"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Bot, TrendingUp } from "lucide-react";

const SERVICES = [
  {
    id: "build",
    title: "BUILD",
    subtitle: "Websites. Software. Digital Products.",
    description: "We design and build fast, modern digital experiences and custom software around the way your business actually works.",
    icon: Code2,
    features: ["Business websites", "Web applications", "SaaS platforms", "Mobile apps", "eCommerce", "Customer portals", "Booking systems", "Custom software"],
    cta: "Explore Build Services",
    href: "/services/website-development",
    color: "from-blue-500/20 to-purple-500/20",
    iconColor: "text-blue-400"
  },
  {
    id: "automate",
    title: "AUTOMATE",
    subtitle: "AI. Automation. Smarter Workflows.",
    description: "We remove repetitive work, connect your tools and introduce practical AI systems that save time and improve customer experience.",
    icon: Bot,
    features: ["AI assistants", "AI chatbots", "Lead qualification", "CRM automation", "Workflow automation", "API integrations", "Automated follow-ups", "Internal business tools"],
    cta: "Explore Automation",
    href: "/services/ai-automation",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400"
  },
  {
    id: "grow",
    title: "GROW",
    subtitle: "SEO. Marketing. Conversion.",
    description: "We help businesses attract the right people, convert more visitors and build sustainable digital growth.",
    icon: TrendingUp,
    features: ["SEO", "Local SEO", "Google Ads", "Meta Ads", "Conversion optimization", "Analytics", "Content strategy", "Digital marketing"],
    cta: "Explore Growth",
    href: "/services/digital-marketing",
    color: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-400"
  }
];

export default function BuildAutomateGrow() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Everything your business needs to move forward.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60"
          >
            A complete digital ecosystem built to scale your business.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative flex flex-col glass-card rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none`} />
                
                <div className="relative z-10 flex-grow">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 ${service.iconColor}`}>
                    <Icon size={28} />
                  </div>
                  
                  <h3 className="text-xl font-bold tracking-widest text-white/90 mb-2">{service.title}</h3>
                  <h4 className="text-2xl font-semibold text-white mb-4">{service.subtitle}</h4>
                  <p className="text-white/60 mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-10">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm text-white/70">
                        <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/10 mt-auto">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-white font-medium group/btn"
                  >
                    {service.cta}
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
