"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PROJECTS = [
  {
    id: "audiomate",
    client: "AudioMate",
    category: "Web Application",
    solved: "Needed a powerful all-in-one platform for professional-grade audio editing and transcription to streamline podcast workflows.",
    built: "A custom Next.js web application with advanced features like automated transcription and audio summarization.",
    result: "Streamlined creator workflows with integrated subscriptions.",
    image: "/projects/audiomate-min.png",
    href: "/work/audiomate"
  },
  {
    id: "nq-fishing-adventures",
    client: "NQ Fishing Adventures",
    category: "Booking System & Website",
    solved: "Needed a modern, mobile-friendly website designed for seamless trip planning and high-resolution visuals.",
    built: "A high-performance marketing website with integrated trip planning and detailed service information.",
    result: "Improved user experience for browsing boat options and booking.",
    image: "/projects/nqfishing-min.png",
    href: "/work/nq-fishing-adventures"
  }
];

export default function FeaturedWork() {
  return (
    <section className="py-24 bg-background border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
            >
              Work we're proud of.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/60"
            >
              Real digital products built for real businesses.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors font-medium"
            >
              View All Projects
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group flex flex-col bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:bg-white/10 transition-colors"
            >
              {/* Project Image */}
              <Link href={project.href} className="block relative h-[300px] sm:h-[400px] w-full overflow-hidden bg-white/5">
                <Image
                  src={project.image}
                  alt={project.client}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </Link>
              
              {/* Project Details */}
              <div className="p-8 sm:p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm font-semibold tracking-wider text-primary uppercase">{project.category}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-sm font-medium text-white/60">{project.client}</span>
                </div>
                
                <div className="space-y-6 mb-8 flex-grow">
                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">What we solved</h4>
                    <p className="text-white/80 leading-relaxed">{project.solved}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">What we built</h4>
                    <p className="text-white/80 leading-relaxed">{project.built}</p>
                  </div>
                  {project.result && (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Result</h4>
                      <p className="text-white font-medium">{project.result}</p>
                    </div>
                  )}
                </div>

                <Link
                  href={project.href}
                  className="inline-flex items-center gap-2 text-white font-medium group/btn mt-auto"
                >
                  Read Case Study
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
