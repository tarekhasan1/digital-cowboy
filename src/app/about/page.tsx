import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | DigitalCowboy",
  description: "A lean Australian team building digital products, automation and growth systems.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8">
            We're DigitalCowboy.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium">
            A lean Australian team building digital products, automation and growth systems for businesses that want to move forward.
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
                  We are a premium digital partner based in Townsville, Queensland. We combine deep technical capability in software development with practical AI automation and growth marketing. 
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
                <p className="text-white/60">Australian roots, international capability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team - Real team members placeholder */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-white">The Team</h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-16">
            We are a tight-knit group of developers, designers, and marketers. (Team profiles to be updated with real members).
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Placeholder Team Member */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="w-32 h-32 mx-auto bg-white/10 rounded-full mb-6"></div>
              <h3 className="text-xl font-bold text-white">Tarek</h3>
              <p className="text-primary font-medium mb-4">Founder / Lead Developer</p>
              <p className="text-white/60 text-sm">Full-stack engineer focusing on React, Next.js and scalable architecture.</p>
            </div>
          </div>
        </div>
      </section>

      <GlobalCTA />
    </main>
  );
}