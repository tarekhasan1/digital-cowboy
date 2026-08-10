import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Work | DigitalCowboy",
  description: "Real digital products built for real businesses. See how we help companies build, automate, and grow.",
};

const PROJECTS = [
  {
    id: "hatbusiness",
    client: "Hat Business",
    category: "Web Platform",
    solved: "Needed a playful children's podcast platform filled with imaginative stories to inspire curiosity.",
    built: "A Next.js and Firebase platform offering episodes packed with fun narratives and custom audio streaming.",
    result: "Created a robust, responsive environment for young listeners and families.",
    image: "/projects/hatbusiness-min.png",
    href: "/work/hatbusiness"
  },
  {
    id: "audiomate",
    client: "AudioMate",
    category: "Web Application",
    solved: "Needed a powerful all-in-one platform for professional-grade audio editing and transcription.",
    built: "A custom Next.js web application featuring noise reduction, automated transcription, and summarization.",
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
  },
  {
    id: "tap-a-deal",
    client: "Tap A Deal",
    category: "Web Platform",
    solved: "Required a high-performance, locally tailored platform connecting users in Townsville with the best local offers.",
    built: "A Next.js application delivering lightning-fast performance for users and merchants.",
    result: "Successfully launched local deals platform with a modern tech stack.",
    image: "/projects/tapdeal-min.png",
    href: "/work/tap-a-deal"
  },
  {
    id: "bwg-colman-radio",
    client: "BWG Colman Radio",
    category: "Community Radio Web",
    solved: "Needed a digital presence for a community-focused radio station broadcasting from Palm Island.",
    built: "A site offering live streaming of local news, music, and Indigenous content at 97.3 FM.",
    result: "Successfully connected the remote audience through live stream.",
    image: "/projects/bwgcolmanradio-min.png",
    href: "/work/bwg-colman-radio"
  },
  {
    id: "spotto",
    client: "SPOTTO!",
    category: "Interactive Web App",
    solved: "Needed an online interactive platform where users can keep score and compete in fun challenges.",
    built: "A real-time scoring system with responsive UI to crown the ultimate SPOTTO champion.",
    result: "Created an engaging competitive experience for users.",
    image: "/projects/spotto-min.png",
    href: "/work/spotto"
  },
  {
    id: "tsv-alterations",
    client: "TSV Alterations & Formal Wear",
    category: "Business Website",
    solved: "Needed a professional online presence for a trusted Townsville-based tailoring service.",
    built: "A modern Next.js and Firebase website highlighting alteration offerings and formal wear rentals.",
    result: "Streamlined the booking process for local customers.",
    image: "/projects/tsvalteration-min.png",
    href: "/work/tsv-alterations"
  },
  {
    id: "nq-interiors",
    client: "NQ Interiors",
    category: "Portfolio Website",
    solved: "Needed to showcase elegant interior design through a sophisticated and user-friendly platform.",
    built: "A Next.js website with high-quality visual galleries and immersive project showcases.",
    result: "Delivered a premium digital experience reflecting their design quality.",
    image: "/projects/nqinterior-min.png",
    href: "/work/nq-interiors"
  }
];

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
            {PROJECTS.map((project, index) => (
              <div
                key={project.id}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlobalCTA />
    </main>
  );
}
