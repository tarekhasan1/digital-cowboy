import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights | DigitalCowboy",
  description: "Practical advice on building digital products, AI automation and growth systems.",
};

import { getInsights, InsightPost } from "../../../actions/insights";

export const dynamic = 'force-dynamic'; // Ensures this pulls fresh from db

export default async function InsightsPage() {
  const { posts } = await getInsights(true);
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Insights
            </h1>
            <p className="text-xl text-white/60 leading-relaxed mb-8">
              Practical advice on building digital products, AI automation and growth systems. No generic marketing fluff, just what actually works.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {['All', 'Build', 'Automate', 'Grow'].map(category => (
                <button key={category} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${category === 'All' ? 'bg-primary text-primary-foreground' : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'}`}>
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((insight: InsightPost, index: number) => (
                <Link 
                  href={`/insights/${insight.slug}`} 
                  key={index}
                  className="group flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-black/20">
                    {insight.coverImage && (
                      <Image
                        src={insight.coverImage}
                        alt={insight.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white tracking-widest uppercase">
                        {insight.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="text-sm text-white/40 mb-4">
                      {new Date(insight.publishedAt || insight.createdAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors line-clamp-2">
                      {insight.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                      {insight.excerpt}
                    </p>
                    
                    <div className="inline-flex items-center text-primary font-medium text-sm mt-auto">
                      Read Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/40 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-xl">No insights published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <GlobalCTA />
    </main>
  );
}
