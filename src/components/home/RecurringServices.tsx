"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const PLANS = [
  {
    name: "DigitalCowboy Care",
    price: "A$180–199",
    period: "/month",
    desc: "Professional ongoing care plan.",
    features: [
      "Website monitoring",
      "Security & Backups",
      "Updates & Bug fixes",
      "Minor content updates",
      "Performance monitoring",
      "Priority support"
    ],
    popular: false
  },
  {
    name: "DigitalCowboy Growth",
    price: "A$699",
    period: "/month",
    desc: "For businesses that want consistent growth.",
    features: [
      "Everything in Care",
      "SEO & Local SEO",
      "Analytics reporting",
      "Content strategy",
      "Conversion optimization",
      "Monthly strategy review"
    ],
    popular: true
  },
  {
    name: "DigitalCowboy AI+",
    price: "A$1,999+",
    period: "/month",
    desc: "Advanced growth and automation systems.",
    features: [
      "Everything in Growth",
      "AI assistant integration",
      "Lead qualification bot",
      "CRM automation",
      "AI workflows",
      "Paid advertising management"
    ],
    popular: false
  }
];

export default function RecurringServices() {
  return (
    <section className="py-24 bg-background border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Don't just launch. Keep growing.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60"
          >
            Your digital presence shouldn't be something you build once and forget. We offer flexible plans to maintain, optimize, and scale your technology.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-8 rounded-3xl border ${
                plan.popular 
                  ? "bg-white/10 border-primary shadow-2xl shadow-primary/10" 
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-white/60 text-sm mb-6 h-10">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">Around {plan.price}</span>
                <span className="text-white/50">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href="/contact"
                className={`w-full py-4 rounded-xl text-center font-semibold transition-colors ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Discuss a Plan
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
