"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogs";

interface BlogListClientProps {
  initialPosts: BlogPost[];
  categories: string[];
  tags: string[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogListClient({
  initialPosts,
  categories,
  tags,
}: BlogListClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState("");

  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    if (activeCategory !== "All") {
      posts = posts.filter((p) => p.category === activeCategory);
    }

    if (activeTag) {
      posts = posts.filter((p) => p.tags.includes(activeTag));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return posts;
  }, [initialPosts, activeCategory, activeTag, search]);

  const featuredPost = initialPosts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter(
    (p) => featuredPost?.slug !== p.slug
  );

  return (
    <>
      <div className="blog-search">
        <span className="blog-search-icon">&#128269;</span>
        <input
          type="text"
          placeholder="Search articles by title, topic, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="blog-filters">
        <button
          className={`blog-filter-btn ${activeCategory === "All" ? "active" : ""}`}
          onClick={() => {
            setActiveCategory("All");
            setActiveTag("");
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`blog-filter-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => {
              setActiveCategory(cat);
              setActiveTag("");
            }}
          >
            {cat}
          </button>
        ))}
        {tags.slice(0, 6).map((tag) => (
          <button
            key={tag}
            className={`blog-filter-btn ${activeTag === tag ? "active" : ""}`}
            onClick={() => {
              setActiveTag(activeTag === tag ? "" : tag);
              setActiveCategory("All");
            }}
          >
            #{tag}
          </button>
        ))}
      </div>

      {featuredPost && activeCategory === "All" && !activeTag && !search.trim() && (
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="featured-card glass"
          aria-label={`Read ${featuredPost.title}`}
        >
          <div className="featured-card-image">
            {featuredPost.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.featuredImageAlt}
                loading="lazy"
              />
            ) : (
              <div className="blog-card-fallback-image">
                <span>AI KA FANDA</span>
              </div>
            )}
          </div>
          <div className="featured-card-body">
            <span className="featured-badge">&#9733; Featured</span>
            <span className="blog-card-category" style={{ position: "static", marginBottom: 12 }}>
              {featuredPost.category}
            </span>
            <h2 className="featured-card-title">{featuredPost.title}</h2>
            <p className="featured-card-excerpt">{featuredPost.excerpt}</p>
            <div className="featured-card-meta">
              <span>By {featuredPost.author}</span>
              <span className="dot" />
              <span>{formatDate(featuredPost.date)}</span>
              <span className="dot" />
              <span>{featuredPost.readingTime}</span>
            </div>
            <span className="featured-card-link">
              Read Article <span className="arrow">&#8594;</span>
            </span>
          </div>
        </Link>
      )}

      {regularPosts.length === 0 ? (
        <div className="blog-empty-container">
          <div className="empty-icon">&#128269;</div>
          <h2>No Articles Found</h2>
          <p>
            {initialPosts.length === 0
              ? "Our research agents are drafting the next set of insights. Check back soon."
              : "No articles match your current filters. Try adjusting your search or category."}
          </p>
          {initialPosts.length > 0 && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
                setActiveTag("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="blog-grid">
          {regularPosts.map((b) => (
            <article key={b.slug} className="blog-card glass">
              <Link
                href={`/blog/${b.slug}`}
                className="blog-card-link"
                aria-label={`Read ${b.title}`}
              >
                <div className="blog-card-image-wrapper">
                  {b.featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.featuredImage}
                      alt={b.featuredImageAlt}
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
                    <span>{formatDate(b.date)}</span>
                    <span className="dot" />
                    <span>{b.readingTime || "4 min read"}</span>
                  </div>

                  <h2 className="blog-card-title">{b.title}</h2>
                  <p className="blog-card-excerpt">{b.excerpt}</p>

                  {b.tags.length > 0 && (
                    <div className="blog-card-tags">
                      {b.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="blog-card-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="blog-card-footer">
                    <span className="blog-card-author">By {b.author}</span>
                    <span className="blog-read-more">
                      Read More <span className="arrow">&#8594;</span>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

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
          font-size: clamp(32px, 4vw, 76px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.02;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
        }
        .blog-subtitle {
          font-size: clamp(16px, 1.3vw, 20px);
          color: var(--fg-muted);
          max-width: 54ch;
          line-height: 1.6;
          margin-bottom: 34px;
        }
        .blog-search {
          width: 100%;
          max-width: 760px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 auto 18px;
          padding: 14px 18px;
          border-radius: 16px;
          background: rgba(10, 14, 30, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(14px);
        }
        .blog-search-icon {
          color: var(--fg-dim);
          font-size: 18px;
          flex-shrink: 0;
        }
        .blog-search input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 15px;
        }
        .blog-search input::placeholder {
          color: var(--fg-dim);
        }
        .blog-filters {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          width: 100%;
          margin: 0 auto 28px;
        }
        .blog-filter-btn {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
          color: var(--fg-muted);
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        .blog-filter-btn:hover,
        .blog-filter-btn.active {
          color: white;
          border-color: rgba(139, 92, 246, 0.55);
          background: rgba(139, 92, 246, 0.16);
        }
        .featured-card {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(260px, 420px) minmax(0, 1fr);
          overflow: hidden;
          border-radius: 28px;
          text-decoration: none;
          margin-bottom: 28px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(10, 14, 30, 0.95));
        }
        .featured-card-image {
          min-height: 100%;
          background: linear-gradient(135deg, rgba(35, 43, 92, 0.9), rgba(109, 40, 217, 0.65));
        }
        .featured-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .featured-card-body {
          padding: 28px 30px;
          text-align: left;
        }
        .featured-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          font-size: 12px;
          color: #facc15;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .featured-card-title {
          font-size: clamp(30px, 4vw, 56px);
          line-height: 1.05;
          color: white;
          margin-bottom: 16px;
        }
        .featured-card-excerpt {
          font-size: 16px;
          line-height: 1.7;
          color: var(--fg-muted);
          margin-bottom: 18px;
        }
        .featured-card-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          color: var(--fg-dim);
          font-size: 14px;
          margin-bottom: 18px;
        }
        .featured-card-link {
          color: white;
          font-weight: 700;
          font-size: 15px;
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
          width: 100%;
        }
        .blog-card {
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(13, 18, 33, 0.78);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .blog-card:hover {
          transform: translateY(-6px);
          border-color: rgba(139, 92, 246, 0.45);
        }
        .blog-card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          color: inherit;
          text-decoration: none;
        }
        .blog-card-image-wrapper {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(88, 28, 135, 0.65));
        }
        .blog-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .blog-card-fallback-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 800;
          letter-spacing: 0.12em;
          font-size: 14px;
        }
        .blog-card-category {
          position: absolute;
          top: 14px;
          left: 14px;
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: white;
          background: rgba(6, 10, 22, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .blog-card-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          height: 100%;
          text-align: left;
        }
        .blog-card-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          color: var(--fg-dim);
          font-size: 13px;
          margin-bottom: 14px;
        }
        .dot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: var(--fg-dim);
        }
        .blog-card-title {
          margin: 0 0 12px;
          color: white;
          font-size: 24px;
          line-height: 1.15;
        }
        .blog-card-excerpt {
          color: var(--fg-muted);
          line-height: 1.7;
          font-size: 15px;
          margin-bottom: 18px;
          flex-grow: 1;
        }
        .blog-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }
        .blog-card-tag {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          color: #d8b4fe;
          background: rgba(91, 33, 182, 0.18);
          border: 1px solid rgba(168, 85, 247, 0.22);
        }
        .blog-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .blog-card-author,
        .blog-read-more {
          font-size: 14px;
          font-weight: 600;
        }
        .blog-card-author {
          color: white;
        }
        .blog-read-more {
          color: #c4b5fd;
        }
        .blog-empty-container {
          width: 100%;
          max-width: 700px;
          margin: 40px auto 0;
          padding: 40px 32px;
          border-radius: 24px;
          text-align: center;
          background: rgba(10, 14, 30, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .empty-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .blog-empty-container h2 {
          color: white;
          margin-bottom: 10px;
        }
        .blog-empty-container p {
          color: var(--fg-muted);
          line-height: 1.7;
          margin-bottom: 18px;
        }
        @media (max-width: 1100px) {
          .featured-card {
            grid-template-columns: 1fr;
          }
          .blog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 720px) {
          .blog-page-container {
            padding-top: 100px;
            padding-bottom: 80px;
          }
          .blog-subtitle {
            margin-bottom: 24px;
          }
          .blog-grid {
            grid-template-columns: 1fr;
          }
          .featured-card-body {
            padding: 22px 20px;
          }
          .blog-card-body {
            padding: 18px;
          }
        }
      `}</style>
    </>
  );
}
