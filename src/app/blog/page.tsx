"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { blogService, Blog } from "@/lib/blogService";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const published = await blogService.getPublishedBlogs();
        setBlogs(published);
      } catch (err) {
        console.error("Failed to load published blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="blog-page-container">
      {/* Background Neon Glows */}
      <div className="blog-glow bg-1" />
      <div className="blog-glow bg-2" />

      <section className="container blog-hero-sec">
        <span className="section-label">insights</span>
        <h1 className="blog-main-title">Latest AI Automation Insights</h1>
        <p className="blog-subtitle">
          Practical guides, updates, and ideas about AI agents, automation, workflows, and business systems.
        </p>

        {loading ? (
          /* Loading State */
          <div className="blog-loader-container">
            <span className="blog-spinner" />
            <p>Gathering fresh insights...</p>
          </div>
        ) : blogs.length === 0 ? (
          /* Empty State */
          <div className="blog-empty-container">
            <div className="empty-icon">📁</div>
            <h2>No Published Insights Yet</h2>
            <p>Our research agents are drafting the next set of B2B SaaS and multi-agent workflow playbooks.</p>
            <Link href="/" className="btn btn-secondary mt-4">
              Return Home
            </Link>
          </div>
        ) : (
          /* Blogs Grid */
          <div className="blog-grid">
            {blogs.map((b) => (
              <article key={b.id} className="blog-card glass">
                <Link href={`/blog/${b.slug}`} className="blog-card-link" aria-label={`Read ${b.title}`}>
                  <div className="blog-card-image-wrapper">
                    {b.featured_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.featured_image}
                        alt={b.title}
                        className="blog-card-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="blog-card-fallback-image">
                        <span>AI KA FANDA</span>
                      </div>
                    )}
                    <span className="blog-card-category">{b.category || "Insight"}</span>
                  </div>

                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span>{formatDate(b.published_at || b.created_at)}</span>
                      <span className="dot" />
                      <span>{b.read_time || "4 min read"}</span>
                    </div>

                    <h2 className="blog-card-title">{b.title}</h2>
                    <p className="blog-card-excerpt">{b.excerpt}</p>

                    <div className="blog-card-footer">
                      <span className="blog-card-author">By {b.author_name || "Hassan A."}</span>
                      <span className="blog-read-more">
                        Read More <span className="arrow">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx global>{`
        .blog-page-container {
          position: relative;
          padding-top: 140px;
          padding-bottom: 120px;
          min-height: 100vh;
          overflow: hidden;
          background: #060813;
        }
        .blog-glow {
          position: absolute;
          width: 50vw;
          height: 50vw;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          opacity: 0.12;
          z-index: 0;
        }
        .blog-glow.bg-1 {
          background: var(--primary);
          top: -10%;
          left: -10%;
        }
        .blog-glow.bg-2 {
          background: var(--accent);
          bottom: -10%;
          right: -10%;
        }
        .blog-hero-sec {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .section-label {
          display: inline-block;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
          padding: 4px 12px;
          border-radius: 99px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          margin-bottom: 16px;
        }
        .blog-main-title {
          font-size: clamp(32px, 4vw, 56px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
        }
        .blog-subtitle {
          font-size: clamp(16px, 1.3vw, 19px);
          color: var(--fg-muted);
          max-width: 54ch;
          line-height: 1.6;
          margin-bottom: 60px;
        }

        /* Grid & Cards responsive layout */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          width: 100%;
          margin-top: 20px;
        }
        .blog-card {
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .blog-card:hover {
          transform: translateY(-8px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.1);
        }
        .blog-card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
        }
        .blog-card-image-wrapper {
          position: relative;
          aspect-ratio: 16 / 9;
          width: 100%;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.4);
        }
        .blog-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .blog-card:hover .blog-card-image {
          transform: scale(1.06);
        }
        .blog-card-fallback-image {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0b0e1c, #1e1b4b);
          color: var(--primary);
          font-family: var(--font-mono), monospace;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .blog-card-category {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(11, 14, 28, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border);
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .blog-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          text-align: left;
        }
        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: var(--fg-dim);
          margin-bottom: 12px;
        }
        .blog-card-meta .dot {
          width: 3px;
          height: 3px;
          background: var(--fg-dim);
          border-radius: 50%;
        }
        .blog-card-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          line-height: 1.3;
          margin-bottom: 12px;
          transition: color 0.2s ease;
        }
        .blog-card:hover .blog-card-title {
          color: var(--primary);
        }
        .blog-card-excerpt {
          font-size: 14px;
          color: var(--fg-muted);
          line-height: 1.5;
          margin-bottom: 24px;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card-footer {
          border-top: 1px solid var(--border);
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .blog-card-author {
          font-size: 13px;
          color: var(--fg-muted);
          font-weight: 500;
        }
        .blog-read-more {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }
        .blog-read-more .arrow {
          transition: transform 0.2s ease;
        }
        .blog-card:hover .blog-read-more .arrow {
          transform: translateX(4px);
        }

        /* Loader & Spinner */
        .blog-loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-top: 80px;
        }
        .blog-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s ease-in-out infinite;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Empty State */
        .blog-empty-container {
          padding: 60px 40px;
          border-radius: 20px;
          border: 1px dashed var(--border);
          background: rgba(11, 14, 28, 0.4);
          backdrop-filter: blur(12px);
          max-width: 500px;
          margin: 60px auto 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.7;
        }
        .blog-empty-container h2 {
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }
        .blog-empty-container p {
          font-size: 14px;
          color: var(--fg-muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        /* Media Queries */
        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
        @media (max-width: 768px) {
          .blog-page-container {
            padding-top: 100px;
            padding-bottom: 80px;
          }
          .blog-subtitle {
            margin-bottom: 40px;
          }
          .blog-grid {
            grid-template-columns: 1fr;
            max-width: 420px;
            margin: 0 auto;
          }
        }
      `}</style>
    </main>
  );
}
