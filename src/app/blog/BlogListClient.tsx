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
    </>
  );
}
