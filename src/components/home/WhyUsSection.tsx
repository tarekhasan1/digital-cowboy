"use client";

import { motion } from "framer-motion";

const REASONS = [
  {
    num: "01",
    title: "We speak human.",
    desc: "No unnecessary jargon. No confusing technical explanations. We explain things clearly so you understand exactly what you're getting."
  },
  {
    num: "02",
    title: "We build for business.",
    desc: "Beautiful technology is useful only when it solves a real business problem. We focus on outcomes, ROI and growth."
  },
  {
    num: "03",
    title: "Technology that grows with you.",
    desc: "Start simple and scale when your business is ready. Our systems are built to expand without needing complete rebuilds."
  },
  {
    num: "04",
    title: "One digital partner.",
    desc: "Build, automate and grow without managing multiple disconnected agencies. We handle the entire digital ecosystem."
  },
  {
    num: "05",
    title: "Australian roots. Global capability.",
    desc: "Based in Townsville, Queensland, with the capability to work with ambitious businesses across Australia and internationally."
  }
];

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-background border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
            >
              Why DigitalCowboy?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/60"
            >
              We don't just build websites and walk away. We become your technical partner for growth.
            </motion.p>
          </div>

          <div className="lg:w-2/3 space-y-12">
            {REASONS.map((reason, index) => (
              <motion.div
                key={reason.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 md:gap-8 group"
              >
                <div className="text-2xl md:text-3xl font-bold text-white/20 group-hover:text-primary transition-colors font-mono">
                  {reason.num}
                  <span className="text-white/20">—</span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{reason.title}</h3>
                  <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
                    {reason.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
