import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getInsightBySlug, getInsights } from "../../../../actions/insights";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { post } = await getInsightBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found | DigitalCowboy",
    };
  }

  return {
    title: `${post.title} | DigitalCowboy`,
    description: post.excerpt,
  };
}

export default async function InsightDetailPage({ params }: { params: { slug: string } }) {
  const { post } = await getInsightBySlug(params.slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <article className="pb-24">
        {/* Header */}
        <header className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link 
              href="/insights" 
              className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white font-medium">
                {post.category}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                {new Date(post.publishedAt || post.createdAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-white/60 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </header>

        {/* Featured Image */}
        {post.coverImage && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />
        </div>
      </article>

      <GlobalCTA />
    </main>
  );
}
