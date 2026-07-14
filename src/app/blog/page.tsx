import React from "react";
import { siteConfig } from "@/lib/siteConfig";
import { getPublishedPosts, getAllCategories, getAllTags } from "@/lib/blogs";
import BlogListClient from "./BlogListClient";

export const metadata = {
  title: "Blog",
  description:
    "Practical guides, updates, and ideas about AI agents, automation workflows, and business technology from the AIKaFanda team.",
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: "AI, automation, and technology insights from AIKaFanda.",
    type: "website" as const,
  },
};

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([
    getPublishedPosts(),
    getAllCategories(),
    getAllTags(),
  ]);

  return (
    <main className="blog-page-container">
      <div className="blog-glow bg-1" />
      <div className="blog-glow bg-2" />

      <section className="container blog-hero-sec">
        <span className="section-label">insights</span>
        <h1 className="blog-main-title">Latest AI Automation Insights</h1>
        <p className="blog-subtitle">
          Practical guides, updates, and ideas about AI agents, automation, workflows, and business systems.
        </p>

        <BlogListClient
          initialPosts={posts}
          categories={categories}
          tags={tags}
        />
      </section>
    </main>
  );
}
