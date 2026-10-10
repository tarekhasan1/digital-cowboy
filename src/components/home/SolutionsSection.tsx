"use client";

import { motion } from "framer-motion";
import { ArrowRight, Target, Zap, Rocket, Globe, ShoppingCart, BarChart3 } from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

const SOLUTIONS = [
  {
    title: "Get More Leads",
    description: "Websites, SEO, ads, and conversion optimization.",
    icon: Target,
  },
  {
    title: "Automate Your Business",
    description: "AI, CRM, and seamless workflow automations.",
    icon: Zap,
  },
  {
    title: "Launch a New Product",
    description: "SaaS, web apps, and custom software.",
    icon: Rocket,
  },
  {
    title: "Improve Your Online Presence",
    description: "Redesigns, branding, UX, and digital strategy.",
    icon: Globe,
  },
  {
    title: "Sell Online",
    description: "eCommerce, portals, and automated payments.",
    icon: ShoppingCart,
  },
  {
    title: "Scale Your Operations",
    description: "Custom software, dashboards, and integrations.",
    icon: BarChart3,
  }
];

export default function SolutionsSection() {
  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      <AnimatedBackground variant="corner" accent="emerald" corner="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            What are you trying to achieve?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            We build solutions designed around your specific business goals.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl glass-card hover:-translate-y-2 hover:bg-white/10 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white transition-all duration-300 text-white/70">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">{solution.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow">
                    {solution.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <Link href="/contact" className="inline-flex items-center text-sm font-medium text-white group-hover:text-primary transition-colors">
                      Discuss this solution <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
