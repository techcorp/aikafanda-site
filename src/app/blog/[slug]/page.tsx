import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import {
  getPostBySlug,
  getAllPostSlugs,
  getRelatedPosts,
} from "@/lib/blogs";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    return { title: "Post Not Found" };
  }

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      url,
      images: post.ogImage ? [{ url: post.ogImage, alt: post.featuredImageAlt }] : [],
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.ogImage ? [post.ogImage] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post, 3);
  const url = `${siteConfig.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: new URL(post.ogImage || post.featuredImage || "/og.png", siteConfig.url).toString(),
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: new URL("/aikafanda.png", siteConfig.url).toString(),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <article className="blog-detail-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="detail-glow bg-1" />
      <div className="detail-glow bg-2" />

      <div className="container detail-content-inner">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Blog</Link>
          <span>/</span>
          <span style={{ color: "var(--fg-dim)" }}>{post.title}</span>
        </div>

        <Link href="/blog" className="back-link">
          <span className="arrow">&larr;</span> Back to insights
        </Link>

        <header className="detail-header">
          <span className="detail-cat-pill">{post.category || "Insight"}</span>
          <h1 className="detail-title">{post.title}</h1>

          <div className="detail-author-row">
            {post.authorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.authorImage}
                alt={post.author}
                className="detail-author-img"
              />
            ) : (
              <div className="detail-author-avatar">
                {post.author.charAt(0)}
              </div>
            )}
            <div className="detail-author-info">
              <span className="detail-author-name">{post.author}</span>
              <div className="detail-meta-row">
                <span className="date">{formatDate(post.date)}</span>
                {post.updatedDate && (
                  <>
                    <span className="divider" />
                    <span className="date">Updated {formatDate(post.updatedDate)}</span>
                  </>
                )}
                <span className="divider" />
                <span className="read-time">{post.readingTime}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="detail-image-box glass">
          {post.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt}
              className="detail-img"
            />
          ) : (
            <div className="detail-fallback-img">
              <span>AI KA FANDA</span>
            </div>
          )}
        </div>

        <div className="detail-body-layout">
          <aside className="detail-share-sidebar">
            <p className="share-label">SHARE</p>
            <div className="share-buttons-stack">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn linkedin"
                title="Share on LinkedIn"
              >
                in
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn twitter"
                title="Share on X"
              >
                &#x1D54F;
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn whatsapp"
                title="Share on WhatsApp"
              >
                wa
              </a>
            </div>
          </aside>

          <section className="detail-main-text">
            <div className="blog-details-content">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </section>
        </div>

        {post.tags.length > 0 && (
          <div className="detail-tags-row">
            <span className="detail-tags-label">Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="detail-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {relatedPosts.length > 0 && (
          <section className="related-section">
            <h3 className="related-title">Related Insights</h3>
            <div className="related-grid">
              {relatedPosts.map((r) => (
                <article key={r.slug} className="related-card glass">
                  <Link href={`/blog/${r.slug}`} className="related-card-link">
                    <div className="related-card-img-wrapper">
                      {r.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.featuredImage}
                          alt={r.featuredImageAlt}
                          className="related-card-img"
                        />
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
    </article>
  );
}
