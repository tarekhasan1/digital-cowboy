import type { Metadata } from "next";
import GlobalCTA from "@/components/GlobalCTA";
import InsightsFilterGrid from "@/components/insights/InsightsFilterGrid";

export const metadata: Metadata = {
  title: "Insights | DigitalCowboy",
  description: "Practical advice on building digital products, AI automation and growth systems.",
};

import { getInsights } from "../../../actions/insights";

export const dynamic = 'force-dynamic'; // Ensures this pulls fresh from db

export default async function InsightsPage() {
  const { posts } = await getInsights(true);
  return (
    <main className="flex flex-col min-h-screen bg-background pt-24">
      <InsightsFilterGrid posts={posts || []} />
      <GlobalCTA />
    </main>
  );
}
