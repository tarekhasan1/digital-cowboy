"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden bg-background">
      {/* Premium Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Text Content */}
        <div className="max-w-2xl text-left pt-12 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white/80">Digital Products • AI • Growth</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 text-white leading-[1.1]">
              Build.<br />
              Automate.<br />
              <span className="gradient-text">Grow.</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-medium text-white/90 mb-4">
              Digital solutions that help ambitious businesses work smarter, attract more customers and scale faster.
            </p>
            
            <p className="text-base sm:text-lg text-white/60 mb-10 max-w-xl">
              From high-converting websites and custom software to AI automation and digital marketing, DigitalCowboy helps businesses build better digital systems and turn them into measurable growth.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Link
                href="/contact"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full text-base font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
              >
                Start a Project
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/work"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                Explore Our Work
              </Link>
            </div>
            
            <div className="text-sm font-medium text-white/40 tracking-wider">
              Web • Software • AI • Marketing
            </div>
          </motion.div>
        </div>
        
        {/* Visual Content - Floating UI Cards */}
        <div className="relative h-[500px] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0"
          >
            {/* Main App Window */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto w-1/2 h-6 bg-white/5 rounded-md" />
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2/3 h-32 bg-white/5 rounded-xl" />
                  <div className="w-1/3 h-32 bg-white/5 rounded-xl" />
                </div>
                <div className="w-full h-24 bg-white/5 rounded-xl" />
              </div>
            </div>

            {/* Floating Element 1 - Metric */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-1/4 -left-12 glass-card rounded-xl p-4 w-48 shadow-xl"
            >
              <div className="text-sm text-white/60 mb-1">Conversion Rate</div>
              <div className="text-2xl font-bold text-green-400">+24.5%</div>
            </motion.div>
            
            {/* Floating Element 2 - AI */}
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 -right-12 glass-card rounded-xl p-4 w-56 shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                AI
              </div>
              <div>
                <div className="text-xs text-white/60">AI Assistant</div>
                <div className="text-sm font-semibold">Lead Qualified</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
