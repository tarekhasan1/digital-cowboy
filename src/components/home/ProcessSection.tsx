"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Discover",
    desc: "We understand your business, audience, goals and biggest opportunities."
  },
  {
    num: "02",
    title: "Plan",
    desc: "We define the strategy, scope, technology and roadmap."
  },
  {
    num: "03",
    title: "Build",
    desc: "Our designers and developers turn the plan into a working digital product."
  },
  {
    num: "04",
    title: "Launch",
    desc: "We test, optimize and launch your project properly."
  },
  {
    num: "05",
    title: "Grow",
    desc: "We provide ongoing support, automation, SEO and digital growth."
  }
];

export default function ProcessSection() {
  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            From idea to impact.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60"
          >
            A clear, structured process designed to eliminate surprises and deliver results.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-[5%] right-[5%] h-px bg-white/10 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative group"
              >
                {/* Node */}
                <div className="w-16 h-16 rounded-2xl bg-black border border-white/20 flex items-center justify-center text-xl font-bold text-white mb-6 relative z-10 group-hover:border-primary group-hover:text-primary transition-colors shadow-lg mx-auto lg:mx-0">
                  {step.num}
                </div>
                
                <div className="text-center lg:text-left">
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {step.desc}
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
