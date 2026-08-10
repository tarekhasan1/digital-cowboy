"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function GlobalCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Have a digital problem to solve?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Let's figure out the smartest way forward. No technical jargon, just a practical plan for your business.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-lg"
            >
              Start a Project
            </Link>
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-medium rounded-md border border-white/10 hover:bg-white/10 transition-colors"
            >
              Book a Discovery Call
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
