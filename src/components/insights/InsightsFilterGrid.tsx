"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { InsightPost } from "../../../actions/insights";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

const CATEGORIES = ["All", "Build", "Automate", "Grow"];

export default function InsightsFilterGrid({ posts }: { posts: InsightPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return posts;
    return posts.filter(
      (post) => post.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [posts, selectedCategory]);

  return (
    <>
      <section className="py-20 relative overflow-hidden">
        <AnimatedBackground variant="hero" accent="blue" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Insights
            </h1>
            <p className="text-xl text-white/60 leading-relaxed mb-8">
              Practical advice on building digital products, AI automation and growth systems. No generic marketing fluff, just what actually works.
            </p>

            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === selectedCategory
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((insight, index) => (
                <Link
                  href={`/insights/${insight.slug}`}
                  key={index}
                  className="group flex flex-col glass-card rounded-3xl overflow-hidden hover:-translate-y-2 hover:border-primary/50 transition-all duration-500 relative"
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
              <p className="text-xl">
                {posts.length === 0
                  ? "No insights published yet. Check back soon!"
                  : `No insights in "${selectedCategory}" yet.`}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
