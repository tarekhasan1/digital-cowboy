"use client";

import React from "react";
import { useParams } from "next/navigation"; // Import useParams from 'next/navigation'
import Image from "next/image";

const blogDetails = [
  {
    title: "Why Every Business Needs a Website in 2025",
    content: [
      { type: "paragraph", text: "In 2025, having a website for your business is no longer just an option, it's an absolute necessity. As more and more Aussies go online to search for services and products, having a professional website is essential to ensure you remain competitive in a crowded market." },
      { type: "paragraph", text: "A well designed website not only builds credibility but also gives potential customers the information they need to make informed decisions." },
      { type: "heading", text: "Key Benefits of Having a Website" },
      { type: "list", items: ["Increases visibility", "Enhances credibility", "Improves customer engagement"] },
      { type: "paragraph", text: "Don't get left behind, having a website is no longer a luxury, it's a necessity." }
    ],
    image: "/blogs/website-importance.png",
    slug: "why-every-business-needs-a-website",
  },
  {
    title: "5 Signs It's Time to Redesign Your Website",
    content: [
      { type: "paragraph", text: "Is your website feeling a bit stale? Does it load slowly or look outdated? If so, it might be time for a redesign." },
      { type: "list", items: [
          "Your website is slow to load", 
          "Your site isn't mobile-friendly", 
          "Your design feels outdated", 
          "You're not getting the results you want", 
          "Your site isn't aligned with your brand"
        ]
      },
      { type: "paragraph", text: "A website redesign isn't just about aesthetics, it's about improving user experience and achieving business goals." }
    ],
    image: "/blogs/website-redesign.jpg",
    slug: "signs-you-need-a-website-redesign",
  },
  {
    title: "How to Choose the Right Web Development Agency",
    content: [
      { type: "paragraph", text: "Choosing the right web development agency is one of the most important decisions you'll make when building or redesigning your website." },
      { type: "heading", text: "Key Factors to Consider" },
      { type: "list", items: [
          "Evaluate their portfolio",
          "Check client reviews and testimonials",
          "Assess their technical expertise",
          "Consider their communication and support",
          "Understand their pricing"
        ]
      },
      { type: "paragraph", text: "The right web development agency will be a partner in your business's success." }
    ],
    image:"/blogs/choosing-agency.jpg",
    slug: "choose-right-web-development-agency",
  },
  {
    title: "Top Web Design Trends to Watch in 2025",
    content: [
      { type: "paragraph", text: "As we move into 2025, web design continues to evolve, bringing fresh ideas and exciting innovations. Staying up to date with the latest web design trends is crucial to ensuring your website stays modern, engaging, and user friendly." },
      { type: "heading", text: "Top Web Design Trends" },
      { type: "list", items: [
          "Dark mode",
          "Minimalistic designs",
          "Interactive elements",
          "AI and chatbots",
          "Custom illustrations"
        ]
      },
      { type: "paragraph", text: "Staying ahead of the curve with web design trends can help your business stand out from the competition." }
    ],
    image: "/blogs/web-design-trends.jpg",
    slug: "web-design-trends-2025",
  }
];

const BlogDetails = () => {
  const { slug } = useParams(); // Use useParams to get the slug from the URL

  // Find the blog post based on the slug
  const post = blogDetails.find((p) => p.slug === slug);

  if (!post) {
    return <p>Post not found</p>;
  }

  // Function to render the content dynamically
  const renderContent = (content: any) => {
    return content.map((item: any, index: any) => {
      switch (item.type) {
        case "paragraph":
          return <p key={index} className="mb-4">{item.text}</p>;
        case "heading":
          return <h2 key={index} className="text-2xl font-semibold mb-4">{item.text}</h2>;
        case "list":
          return (
            <ul key={index} className="list-disc pl-6 mb-4">
              {item.items.map((listItem: any, idx: any) => (
                <li key={idx}>{listItem}</li>
              ))}
            </ul>
          );
        default:
          return null;
      }
    });
  };

  return (
    <section className="bg-black text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto mt-[50px]">
        <h1 className="text-4xl font-bold text-center mb-8">{post.title}</h1>
        <div className="flex justify-center mb-8 w-full">
          <Image width={600} height={400} src={post.image} alt={post.title} className="rounded-xl w-full object-cover" />
        </div>
        <div className="prose text-lg">
          {renderContent(post.content)}
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
