import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

export const metadata: Metadata = {
  title: "About Us | DigitalCowboy",
  description: "A lean team building digital products, automation and growth systems.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <AnimatedBackground variant="hero" accent="violet" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8">
            We're DigitalCowboy.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium">
            A lean team building digital products, automation and growth systems for businesses that want to move forward.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">We believe technology should solve problems, not create them.</h2>
              <div className="space-y-6 text-lg text-white/60 leading-relaxed">
                <p>
                  Most agencies focus on making things look pretty. We focus on making things work. A beautiful website is useless if it doesn't generate leads. A custom app is a waste of money if your team refuses to use it.
                </p>
                <p>
                  We are a premium digital partner working remotely with businesses everywhere. We combine deep technical capability in software development with practical AI automation and growth marketing.
                </p>
                <p>
                  Whether you're a local tradie needing a reliable lead engine or a growing enterprise requiring a custom SaaS platform, we bring the same level of engineering rigor and commercial focus to every project.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-3xl p-8 border border-white/10">
                <div className="text-4xl font-bold text-white mb-2">Technical</div>
                <p className="text-white/60">React, Next.js, Node, Databases, API integrations.</p>
              </div>
              <div className="bg-background rounded-3xl p-8 border border-white/10 mt-12">
                <div className="text-4xl font-bold text-white mb-2">Design</div>
                <p className="text-white/60">UX/UI, Conversion optimization, Brand identity.</p>
              </div>
              <div className="bg-background rounded-3xl p-8 border border-white/10 -mt-12">
                <div className="text-4xl font-bold text-white mb-2">Growth</div>
                <p className="text-white/60">SEO, Paid Ads, Analytics, Automation.</p>
              </div>
              <div className="bg-background rounded-3xl p-8 border border-white/10">
                <div className="text-4xl font-bold text-white mb-2">Global</div>
                <p className="text-white/60">Remote-first, international capability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GlobalCTA />
    </main>
  );
}