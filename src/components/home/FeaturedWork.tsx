"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROJECTS as ALL_PROJECTS } from "@/data/projects";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

const FEATURED_SLUGS = ["hatbusiness", "townsville-tight-ass"];
const PROJECTS = FEATURED_SLUGS.map((slug) =>
  ALL_PROJECTS.find((p) => p.slug === slug)!
);

export default function FeaturedWork() {
  return (
    <section className="py-24 bg-background border-t border-white/5 relative overflow-hidden">
      <AnimatedBackground variant="corner" accent="violet" corner="top-left" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
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
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group flex flex-col glass-card rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-500"
            >
              {/* Project Image */}
              <Link href={`/work/${project.slug}`} className="block relative h-[300px] sm:h-[400px] w-full overflow-hidden bg-white/5">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              </Link>

              {/* Project Details */}
              <div className="p-8 sm:p-10 flex flex-col flex-grow relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-3 mb-6">
                  <span className="text-sm font-semibold tracking-wider text-primary uppercase">{project.category}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-primary/50 transition-colors" />
                  <span className="text-sm font-medium text-white/60 group-hover:text-white/90 transition-colors">{project.name}</span>
                </div>
                
                <div className="relative z-10 space-y-6 mb-8 flex-grow">
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
                  href={`/work/${project.slug}`}
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
