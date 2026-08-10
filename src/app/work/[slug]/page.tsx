import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import GlobalCTA from "@/components/GlobalCTA";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

// Mock data fetching function based on slug
const getProjectBySlug = (slug: string) => {
  const projects: Record<string, any> = {
    "hatbusiness": {
      name: "Hat Business",
      description: "A playful children's podcast platform filled with imaginative stories and adventures.",
      category: "Web Platform",
      challenge: "The client wanted to create an engaging platform that inspires curiosity, courage, and creativity in young listeners through fun narratives and calming routines.",
      solution: "We designed and developed a custom podcast web application tailored for families and children, complete with a soothing and fun interface and reliable audio streaming capabilities.",
      delivered: [
        { title: "Design & UX", desc: "Playful, kid-friendly interface." },
        { title: "Frontend", desc: "Next.js for blazing fast performance." },
        { title: "Backend", desc: "Firebase & Firestore NoSQL Database." },
        { title: "Streaming", desc: "Custom Audio Streaming integration." }
      ],
      tech: ["Next.js", "TypeScript", "Framer Motion", "Firebase", "Firestore"],
      results: [
        "Delivered a seamless and secure streaming environment",
        "Increased engagement time for young listeners"
      ],
      gallery: [
        "/projects/hatbusiness-min.png"
      ]
    },
    "audiomate": {
      name: "AudioMate",
      description: "A scalable platform to manage audio assets and distribution for creators.",
      category: "Web Application",
      challenge: "Creators needed a powerful all-in-one platform for professional-grade audio editing and transcription to streamline their podcast and voiceover workflows.",
      solution: "We built a custom Next.js web application offering advanced features such as noise and mouth sound reduction, automated transcription, audio summarization, and shownote generation.",
      delivered: [
        { title: "UX/UI Design", desc: "Intuitive creator dashboard." },
        { title: "Development", desc: "Next.js frontend, backend logic." },
        { title: "Integrations", desc: "Paddle billing, audio processing APIs." },
        { title: "Automation", desc: "Automated shownote generation." }
      ],
      tech: ["Next.js", "React", "Tailwind CSS", "MongoDB", "Paddle"],
      results: [
        "Significantly reduced manual editing time",
        "Streamlined creator workflows with integrated subscriptions"
      ],
      gallery: [
        "/projects/audiomate-min.png"
      ]
    },
    "nq-fishing-adventures": {
      name: "NQ Fishing Adventures",
      description: "A modern booking system and website designed for seamless trip planning.",
      category: "Booking System & Website",
      challenge: "The client needed a modern, mobile-friendly website to showcase detailed boat options, location highlights, and service information with high-resolution visuals.",
      solution: "We delivered a high-performance marketing website with an integrated trip planning system, utilizing Next.js for speed and Stripe for secure payments.",
      delivered: [
        { title: "Design", desc: "High-resolution visual showcase." },
        { title: "Frontend", desc: "Next.js & TailwindCSS." },
        { title: "Payments", desc: "Stripe integration for easy checkout." },
        { title: "Database", desc: "MongoDB for trip management." }
      ],
      tech: ["Next.js", "Tailwind CSS", "TypeScript", "Stripe", "MongoDB"],
      results: [
        "Improved user experience for browsing boat options",
        "Increased direct bookings and lead generation"
      ],
      gallery: [
        "/projects/nqfishing-min.png"
      ]
    },
    "tap-a-deal": {
      name: "Tap A Deal",
      description: "A high-performance, locally tailored platform connecting users with local offers.",
      category: "Web Platform",
      challenge: "Required a scalable platform connecting users in Townsville with the best local offers, events, and services.",
      solution: "Built a modern platform using a fast tech stack to deliver lightning-fast performance for users and merchants.",
      delivered: [
        { title: "Architecture", desc: "High-performance Next.js setup." },
        { title: "Design", desc: "Mobile-first approach." },
        { title: "Development", desc: "Robust TypeScript codebase." },
        { title: "Local SEO", desc: "Optimized for Townsville region." }
      ],
      tech: ["Next.js", "Tailwind CSS", "TypeScript"],
      results: [
        "Successfully launched in local market",
        "High adoption rate from local businesses"
      ],
      gallery: [
        "/projects/tapdeal-min.png"
      ]
    },
    "bwg-colman-radio": {
      name: "BWG Colman Radio",
      description: "A community-focused radio station broadcasting from Palm Island.",
      category: "Community Radio Web",
      challenge: "The community needed a reliable digital platform to live stream local news, music, and Indigenous content to its audience.",
      solution: "We designed a modern, accessible website with an integrated live streaming player and responsive design.",
      delivered: [
        { title: "Streaming", desc: "Live radio stream integration." },
        { title: "UX/UI Design", desc: "Accessible, community-focused." },
        { title: "Responsive Web", desc: "Works on all modern devices." }
      ],
      tech: ["Live Stream", "Responsive Design", "Next.js"],
      results: [
        "Expanded community reach beyond local FM range",
        "Simplified content consumption for the audience"
      ],
      gallery: [
        "/projects/bwgcolmanradio-min.png"
      ]
    },
    "spotto": {
      name: "SPOTTO!",
      description: "An online interactive platform for score keeping and challenges.",
      category: "Interactive Web App",
      challenge: "Users needed a platform to keep score, settle arguments, and compete in fun challenges with friends.",
      solution: "We developed an interactive web application with a real-time scoring system to crown the ultimate SPOTTO champion.",
      delivered: [
        { title: "Interactive UI", desc: "Playful, engaging interface." },
        { title: "Real-Time Logic", desc: "Scoring and challenge system." },
        { title: "Responsive", desc: "Optimized for mobile use on the go." }
      ],
      tech: ["Interactive Web App", "Real-Time Scoring", "Responsive UI"],
      results: [
        "Created a highly engaging competitive experience",
        "Achieved rapid user adoption for fun challenges"
      ],
      gallery: [
        "/projects/spotto-min.png"
      ]
    },
    "tsv-alterations": {
      name: "TSV Alterations & Formal Wear",
      description: "A professional online presence for a trusted Townsville tailoring service.",
      category: "Business Website",
      challenge: "The business needed to modernize its online presence to better highlight alteration offerings, formal wear rentals, and appointment booking.",
      solution: "We built a clean, professional website utilizing Next.js and Firebase to handle their service listings and customer inquiries.",
      delivered: [
        { title: "Design", desc: "Elegant, professional aesthetic." },
        { title: "Frontend", desc: "Next.js for speed and SEO." },
        { title: "Backend", desc: "Firebase for form handling." },
        { title: "Booking", desc: "Integrated appointment system." }
      ],
      tech: ["Next.js", "Tailwind CSS", "TypeScript", "Firebase"],
      results: [
        "Elevated the brand's digital presence",
        "Streamlined customer inquiries and appointments"
      ],
      gallery: [
        "/projects/tsvalteration-min.png"
      ]
    },
    "nq-interiors": {
      name: "NQ Interiors",
      description: "A sophisticated platform showcasing elegant interior design.",
      category: "Portfolio Website",
      challenge: "The client needed a platform with an emphasis on high-quality visuals to offer an immersive experience for browsing design projects.",
      solution: "We developed a sophisticated, user-friendly website using Next.js and Cloudinary for optimized image delivery.",
      delivered: [
        { title: "Visual Design", desc: "High-end, immersive aesthetic." },
        { title: "Media Hosting", desc: "Cloudinary image optimization." },
        { title: "Frontend", desc: "Smooth navigation and galleries." }
      ],
      tech: ["Next.js", "Tailwind CSS", "TypeScript", "Cloudinary"],
      results: [
        "Showcased projects with stunning clarity and speed",
        "Enhanced the agency's premium brand positioning"
      ],
      gallery: [
        "/projects/nqinterior-min.png"
      ]
    },
    // Adding a generic fallback for other slugs
    "default": {
      name: "Project Name",
      description: "A custom digital solution built for business growth.",
      category: "Digital Product",
      challenge: "The client needed a scalable digital solution to replace their outdated manual processes and improve their overall customer experience. They were losing leads and struggling to manage their daily operations efficiently.",
      solution: "We architected and built a custom digital platform that streamlined their workflows, automated their lead capture process, and provided a seamless experience for their end users.",
      delivered: [
        { title: "UX/UI Design", desc: "Modern, conversion-focused design." },
        { title: "Development", desc: "High-performance web application." },
        { title: "CMS", desc: "Custom content management." },
        { title: "SEO", desc: "Technical SEO implementation." }
      ],
      tech: ["Next.js", "React", "Tailwind CSS"],
      results: [
        "Increased enquiries by 45%",
        "Reduced manual admin work by 15 hours per week"
      ],
      gallery: [
        "/projects/audiomate-min.png"
      ]
    }
  };

  return projects[slug] || projects["default"];
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
      <section className="py-20 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          
          <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
            {project.description}
          </p>
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
                  className="object-cover"
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
