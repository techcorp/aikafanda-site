"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { blogService, Blog } from "@/lib/blogService";
import { parseMarkdownToHtml } from "@/components/admin/MarkdownEditor";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const current = await blogService.getBlogBySlug(slug);
        setBlog(current);

        if (current) {
          const allPublished = await blogService.getPublishedBlogs();
          const filtered = allPublished
            .filter((b) => b.id !== current.id)
            .slice(0, 3);
          setRelated(filtered);
        }
      } catch (err) {
        console.error("Failed to load blog data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogData();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return encodeURIComponent(window.location.href);
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${getShareUrl()}&text=${encodeURIComponent(blog?.title || "")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${getShareUrl()}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent((blog?.title || "") + " ")}${getShareUrl()}`,
  };

  if (loading) {
    return (
      <div className="blog-detail-loading-sec">
        <div className="blog-spinner" />
        <p>Loading insights...</p>
        <style jsx>{`
          .blog-detail-loading-sec {
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #060813;
            color: var(--fg-dim);
            gap: 16px;
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
        `}</style>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-error-sec">
        <h2>Insight Not Found</h2>
        <p>This insight could not be retrieved by our research agents. It may have been archived or unpublished.</p>
        <Link href="/blog" className="btn btn-secondary mt-4">
          Back to Blog
        </Link>
        <style jsx>{`
          .blog-detail-error-sec {
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #060813;
            color: var(--fg-muted);
            text-align: center;
            padding: 24px;
            gap: 12px;
          }
          .blog-detail-error-sec h2 {
            font-size: 28px;
            font-weight: 700;
            color: white;
          }
        `}</style>
      </div>
    );
  }

  return (
    <article className="blog-detail-container">
      {/* Glow Effects */}
      <div className="detail-glow bg-1" />
      <div className="detail-glow bg-2" />

      <div className="container detail-content-inner">
        {/* Back Link */}
        <Link href="/blog" className="back-link">
          <span className="arrow">←</span> Back to insights
        </Link>

        {/* Blog Header */}
        <header className="detail-header">
          <span className="detail-cat-pill">{blog.category || "Insight"}</span>
          <h1 className="detail-title">{blog.title}</h1>

          <div className="detail-meta-row">
            <span className="author">By {blog.author_name || "Hassan A."}</span>
            <span className="divider" />
            <span className="date">{formatDate(blog.published_at || blog.created_at)}</span>
            <span className="divider" />
            <span className="read-time">{blog.read_time || "4 min read"}</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="detail-image-box glass">
          {blog.featured_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={blog.featured_image} alt={blog.title} className="detail-img" />
          ) : (
            <div className="detail-fallback-img">
              <span>AI KA FANDA</span>
            </div>
          )}
        </div>

        {/* Grid layout for share and body */}
        <div className="detail-body-layout">
          {/* Left Share Sidebar */}
          <aside className="detail-share-sidebar">
            <p className="share-label">SHARE</p>
            <div className="share-buttons-stack">
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn linkedin"
                title="Share on LinkedIn"
              >
                in
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn twitter"
                title="Share on X"
              >
                𝕏
              </a>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn whatsapp"
                title="Share on WhatsApp"
              >
                wa
              </a>
            </div>
          </aside>

          {/* Main Content Body */}
          <section className="detail-main-text">
            <div
              className="blog-details-content"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHtml(blog.content),
              }}
            />
          </section>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="related-section">
            <h3 className="related-title">Related Insights</h3>
            <div className="related-grid">
              {related.map((r) => (
                <article key={r.id} className="related-card glass">
                  <Link href={`/blog/${r.slug}`} className="related-card-link">
                    <div className="related-card-img-wrapper">
                      {r.featured_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.featured_image} alt={r.title} className="related-card-img" />
                      ) : (
                        <div className="related-card-fallback-img">
                          <span>AI KA FANDA</span>
                        </div>
                      )}
                    </div>
                    <div className="related-card-body">
                      <span className="related-card-cat">{r.category}</span>
                      <h4 className="related-card-title">{r.title}</h4>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx global>{`
        .blog-detail-container {
          position: relative;
          padding-top: 140px;
          padding-bottom: 120px;
          background: #060813;
          min-height: 100vh;
          overflow: hidden;
        }
        .detail-glow {
          position: absolute;
          width: 40vw;
          height: 40vw;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          opacity: 0.1;
          z-index: 0;
        }
        .detail-glow.bg-1 {
          background: var(--primary);
          top: 10%;
          left: -10%;
        }
        .detail-glow.bg-2 {
          background: var(--accent);
          bottom: 20%;
          right: -10%;
        }
        .detail-content-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          text-align: left;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--fg-dim);
          text-decoration: none;
          margin-bottom: 32px;
          transition: color 0.2s ease;
        }
        .back-link:hover {
          color: var(--primary);
        }
        .back-link .arrow {
          transition: transform 0.2s ease;
        }
        .back-link:hover .arrow {
          transform: translateX(-4px);
        }
        .detail-header {
          margin-bottom: 36px;
        }
        .detail-cat-pill {
          display: inline-block;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
          padding: 4px 12px;
          border-radius: 99px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          margin-bottom: 16px;
        }
        .detail-title {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: white;
          margin-bottom: 20px;
        }
        .detail-meta-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          color: var(--fg-dim);
        }
        .detail-meta-row .divider {
          width: 1px;
          height: 12px;
          background: var(--border);
        }
        .detail-meta-row .author {
          color: var(--fg-muted);
          font-weight: 500;
        }
        .detail-image-box {
          border-radius: 20px;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 21 / 9;
          margin-bottom: 48px;
          background: rgba(0,0,0,0.4);
        }
        .detail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-fallback-img {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0b0e1c, #1e1b4b);
          color: var(--primary);
          font-family: var(--font-mono), monospace;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        /* Detail Grid Layout */
        .detail-body-layout {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 40px;
          position: relative;
        }
        .detail-share-sidebar {
          position: sticky;
          top: 120px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .share-label {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--fg-dim);
        }
        .share-buttons-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .share-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          color: var(--fg-muted);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: var(--font-mono), monospace;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .share-btn:hover {
          color: white;
          transform: scale(1.08);
        }
        .share-btn.linkedin:hover {
          background: #0077b5;
          border-color: #0077b5;
        }
        .share-btn.twitter:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
        }
        .share-btn.whatsapp:hover {
          background: #25d366;
          border-color: #25d366;
        }

        /* Semantic HTML content styling */
        .blog-details-content {
          color: var(--fg-muted);
          font-size: 17px;
          line-height: 1.8;
        }
        .blog-details-content p {
          margin-bottom: 16px;
          text-wrap: pretty;
        }
        .blog-details-content h1,
        .blog-details-content h2,
        .blog-details-content h3 {
          color: white;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 32px;
          margin-bottom: 12px;
        }
        .blog-details-content h1 { font-size: 30px; }
        .blog-details-content h2 { font-size: 24px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
        .blog-details-content h3 { font-size: 20px; }
        
        .blog-details-content strong {
          color: white;
          font-weight: 600;
        }
        .blog-details-content em {
          font-style: italic;
        }
        .blog-details-content blockquote {
          border-left: 3px solid var(--primary);
          background: rgba(99, 102, 241, 0.05);
          padding: 16px 20px;
          border-radius: 0 8px 8px 0;
          margin: 16px 0;
          font-style: italic;
          color: var(--fg-muted);
        }
        .blog-details-content ul,
        .blog-details-content ol {
          margin-bottom: 16px;
          padding-left: 20px;
        }
        .blog-details-content li {
          margin-bottom: 6px;
        }
        .blog-details-content pre {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--border);
          padding: 16px;
          border-radius: 10px;
          overflow-x: auto;
          font-family: var(--font-mono), monospace;
          font-size: 14px;
          margin: 24px 0;
        }
        .blog-details-content code {
          background: rgba(255, 255, 255, 0.06);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: var(--font-mono), monospace;
          font-size: 14px;
          color: var(--accent);
        }
        .blog-details-content pre code {
          background: transparent;
          padding: 0;
          color: var(--fg-muted);
        }
        .blog-details-content a {
          color: var(--primary);
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        .blog-details-content a:hover {
          color: var(--accent);
        }

        /* Related Section */
        .related-section {
          border-top: 1px solid var(--border);
          margin-top: 64px;
          padding-top: 48px;
        }
        .related-title {
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .related-card {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .related-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.3);
        }
        .related-card-link {
          text-decoration: none;
        }
        .related-card-img-wrapper {
          aspect-ratio: 16 / 9;
          background: rgba(0,0,0,0.4);
          overflow: hidden;
        }
        .related-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .related-card:hover .related-card-img {
          transform: scale(1.04);
        }
        .related-card-fallback-img {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0b0e1c, #1e1b4b);
          color: var(--primary);
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          font-weight: 700;
        }
        .related-card-body {
          padding: 16px;
        }
        .related-card-cat {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 6px;
        }
        .related-card-title {
          font-size: 15px;
          font-weight: 600;
          color: white;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .detail-body-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .detail-share-sidebar {
            flex-direction: row;
            justify-content: flex-start;
            position: relative;
            top: 0;
            gap: 16px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 16px;
            width: 100%;
          }
          .share-buttons-stack {
            flex-direction: row;
          }
          .related-grid {
            grid-template-columns: 1fr;
            max-width: 320px;
          }
          .detail-image-box {
            aspect-ratio: 16 / 9;
            margin-bottom: 32px;
          }
        }
      `}</style>
    </article>
  );
}
