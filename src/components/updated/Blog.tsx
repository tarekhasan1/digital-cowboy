import React from "react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    title: "Why Every Business Needs a Website in 2025",
    excerpt:
      "From credibility to visibility, discover why having a website is no longer optional for modern businesses.",
    image: "/blogs/website-importance.png",
    slug: "why-every-business-needs-a-website",
  },
  {
    title: "5 Signs It's Time to Redesign Your Website",
    excerpt:
      "Is your website looking outdated or loading slowly? Here are the key signs it might be time for a refresh.",
    image: "/blogs/website-redesign.jpg",
    slug: "signs-you-need-a-website-redesign",
  },
  {
    title: "How to Choose the Right Web Development Agency",
    excerpt:
      "Here's what to look for when hiring a team to build your online presence.",
    image: "/blogs/choosing-agency.jpg",
    slug: "choose-right-web-development-agency",
  },
  {
    title: "Top Web Design Trends to Watch in 2025",
    excerpt:
      "Stay ahead of the curve with these emerging design trends that will dominate the web this year.",
    image: "/blogs/web-design-trends.jpg",
    slug: "web-design-trends-2025",
  },
];

const Blog = () => {
  return (
    <section className="bg-black text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto mt-[50px]">
        {/* <h2 className="text-4xl font-bold text-center mb-12">Blog</h2> */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, idx) => (
            <Link href={`/blog/${post.slug}`} key={idx}>
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-400">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
