import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "Our Work | DigitalCowboy",
  description: "Real digital products built for real businesses. See how we help companies build, automate, and grow.",
};

export default function WorkPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Work we're proud of.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Real digital products built for real businesses. We focus on outcomes, not just aesthetics.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {PROJECTS.map((project) => (
              <div
                key={project.slug}
                className="group flex flex-col bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:bg-white/10 transition-colors"
              >
                {/* Project Image */}
                <Link href={`/work/${project.slug}`} className="block relative h-[300px] sm:h-[400px] w-full overflow-hidden bg-white/5">
                  <Image
                    src={project.image}
                    alt={project.name}
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
                    <span className="text-sm font-medium text-white/60">{project.name}</span>
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
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-2 text-white font-medium group/btn mt-auto"
                  >
                    Read Case Study
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlobalCTA />
    </main>
  );
}
