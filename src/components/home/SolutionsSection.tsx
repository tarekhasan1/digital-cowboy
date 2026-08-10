"use client";

import { motion } from "framer-motion";
import { ArrowRight, Target, Zap, Rocket, Globe, ShoppingCart, BarChart3 } from "lucide-react";
import Link from "next/link";

const SOLUTIONS = [
  {
    title: "Get More Leads",
    description: "Websites, landing pages, SEO, advertising and conversion optimization.",
    icon: Target,
  },
  {
    title: "Automate Your Business",
    description: "AI, CRM, integrations and workflow automation.",
    icon: Zap,
  },
  {
    title: "Launch a New Product",
    description: "SaaS, web applications, mobile apps and custom software.",
    icon: Rocket,
  },
  {
    title: "Improve Your Online Presence",
    description: "Website redesign, branding, UX and digital strategy.",
    icon: Globe,
  },
  {
    title: "Sell Online",
    description: "eCommerce, payment systems, customer portals and automation.",
    icon: ShoppingCart,
  },
  {
    title: "Scale Your Operations",
    description: "Custom software, dashboards, integrations and business systems.",
    icon: BarChart3,
  }
];

export default function SolutionsSection() {
  return (
    <section className="py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            We don't just sell technology. We build solutions designed around your specific business goals.
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
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:text-primary transition-colors text-white/80">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{solution.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow">
                  {solution.description}
                </p>
                <Link href="/contact" className="inline-flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  Discuss this solution <ArrowRight size={16} className="ml-2" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
