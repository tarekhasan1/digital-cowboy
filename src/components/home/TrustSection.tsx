"use client";

import { motion } from "framer-motion";

const METRICS = [
  { label: "Australian-Based", value: "100%" },
  { label: "Full-Stack Development", value: "Expertise" },
  { label: "AI & Automation", value: "Ready" },
  { label: "Digital Growth", value: "Focused" },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-background border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
          >
            Built for businesses that want more from digital.
          </motion.h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full opacity-50" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {METRICS.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-sm font-medium text-white/60 uppercase tracking-wider">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
