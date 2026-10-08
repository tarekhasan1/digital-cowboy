import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import GlobalCTA from "@/components/GlobalCTA";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getProjectBySlug as getProject, Project } from "@/data/projects";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

const DEFAULT_PROJECT: Project = {
  slug: "default",
  name: "Project Name",
  category: "Digital Product",
  description: "A custom digital solution built for business growth.",
  solved: "A custom digital solution built for business growth.",
  built: "A custom digital solution built for business growth.",
  result: "Increased enquiries by 45%",
  challenge: "The client needed a scalable digital solution to replace their outdated manual processes and improve their overall customer experience. They were losing leads and struggling to manage their daily operations efficiently.",
  solution: "We architected and built a custom digital platform that streamlined their workflows, automated their lead capture process, and provided a seamless experience for their end users.",
  delivered: [
    { title: "UX/UI Design", desc: "Modern, conversion-focused design." },
    { title: "Development", desc: "High-performance web application." },
    { title: "CMS", desc: "Custom content management." },
    { title: "SEO", desc: "Technical SEO implementation." },
  ],
  tech: ["Next.js", "React", "Tailwind CSS"],
  results: [
    "Increased enquiries by 45%",
    "Reduced manual admin work by 15 hours per week",
  ],
  image: "/projects/hatbusiness-min.png",
  gallery: ["/projects/hatbusiness-min.png"],
};

// Mock data fetching function based on slug
const getProjectBySlug = (slug: string): Project => {
  return getProject(slug) ?? DEFAULT_PROJECT;
};


export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug);
  return {
    title: `${project.name} Case Study | DigitalCowboy`,
    description: project.description,
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);

  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="py-20 border-b border-white/5 relative overflow-hidden">
        <AnimatedBackground variant="section" accent="violet" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Link href="/work" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft size={16} className="mr-2" /> Back to Work
          </Link>
          
          <div className="mb-6">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary">
              {project.category}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            {project.name}
          </h1>
          
          <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-8">
            {project.description}
          </p>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              Visit Live Site
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">The Challenge</h2>
              <p className="text-white/60 leading-relaxed">
                {project.challenge}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">The Solution</h2>
              <p className="text-white/60 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Delivered */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">What We Delivered</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {project.delivered.map((item: any, i: number) => (
              <div key={i} className="bg-background border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            {project.gallery.map((img: string, i: number) => (
              <div key={i} className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden bg-white/5 border border-white/10">
                <Image
                  src={img}
                  alt={`${project.name} screenshot ${i + 1}`}
                  fill
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results & Tech */}
      <section className="py-24 bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            
            {project.results && project.results.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-8 text-white">The Results</h2>
                <ul className="space-y-4">
                  {project.results.map((result: string, i: number) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 size={24} className="text-primary flex-shrink-0" />
                      <span className="text-lg text-white/90">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-8 text-white">Technology Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t: string, i: number) => (
                  <span key={i} className="px-4 py-2 rounded-lg bg-background border border-white/10 text-white/80 text-sm font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Custom CTA */}
      <section className="py-24 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Have a project like this?</h2>
          <p className="text-xl text-white/60 mb-10">
            Let's discuss how we can build a similar solution for your business.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          >
            Start a Project
          </Link>
        </div>
      </section>
    </main>
  );
}
