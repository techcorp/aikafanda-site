import readingTime from "reading-time";
import { cache } from "react";

const BLOGGER_SITE_URL = process.env.BLOGGER_SITE_URL?.trim() || "";
const BLOGGER_MAX_RESULTS = 50;
const FEATURED_LABEL = "featured";

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  updatedDate?: string;
  author: string;
  authorImage?: string;
  featuredImage: string;
  featuredImageAlt: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  ogImage?: string;
  readingTime: string;
  content: string;
}

interface BloggerTextField {
  $t?: string;
}

interface BloggerLink {
  rel?: string;
  href?: string;
}

interface BloggerAuthor {
  name?: BloggerTextField;
  gd$image?: {
    src?: string;
  };
}

interface BloggerCategory {
  term?: string;
}

interface BloggerEntry {
  title?: BloggerTextField;
  published?: BloggerTextField;
  updated?: BloggerTextField;
  summary?: BloggerTextField;
  content?: BloggerTextField;
  author?: BloggerAuthor[];
  category?: BloggerCategory[];
  link?: BloggerLink[];
  media$thumbnail?: {
    url?: string;
  };
}

interface BloggerFeedResponse {
  feed?: {
    entry?: BloggerEntry[];
  };
}

function getBloggerFeedUrl(): string | null {
  if (!BLOGGER_SITE_URL) return null;

  return new URL(
    `/feeds/posts/default?alt=json&max-results=${BLOGGER_MAX_RESULTS}`,
    BLOGGER_SITE_URL
  ).toString();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+=(["']).*?\1/gi, "")
    .replace(/\sjavascript:/gi, " ");
}

function slugFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "");
    const slug = pathname.split("/").filter(Boolean).pop() || "";
    return slug.toLowerCase();
  } catch {
    return "";
  }
}

function normalizeImageUrl(url?: string): string {
  if (!url) return "";

  return url
    .replace(/\/s\d+(-[a-z0-9]+)?\//i, "/s1600/")
    .replace(/=s\d+(-[a-z0-9]+)?$/i, "=s1600");
}

function extractFirstImage(html: string): string {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return normalizeImageUrl(match?.[1]);
}

function buildExcerpt(summary: string, content: string): string {
  const source = stripHtml(summary || content);
  if (source.length <= 170) return source;
  return `${source.slice(0, 167).trimEnd()}...`;
}

function parseLabels(entry: BloggerEntry): { category: string; tags: string[]; featured: boolean } {
  const rawLabels = (entry.category || [])
    .map((item) => item.term?.trim() || "")
    .filter((term) => term && !term.startsWith("http://schemas.google.com"));

  const featured = rawLabels.some(
    (label) => label.toLowerCase() === FEATURED_LABEL
  );
  const tags = rawLabels.filter(
    (label) => label.toLowerCase() !== FEATURED_LABEL
  );

  return {
    category: tags[0] || "Insights",
    tags,
    featured,
  };
}

function parseEntry(entry: BloggerEntry, index: number): BlogPost | null {
  const title = entry.title?.$t?.trim() || "";
  const alternateUrl =
    entry.link?.find((link) => link.rel === "alternate")?.href?.trim() || "";
  const slug = slugFromUrl(alternateUrl);

  if (!title || !alternateUrl || !slug) {
    return null;
  }

  const contentHtml = entry.content?.$t?.trim() || "";
  const summary = entry.summary?.$t?.trim() || "";
  const { category, tags, featured } = parseLabels(entry);
  const featuredImage = normalizeImageUrl(
    entry.media$thumbnail?.url || extractFirstImage(contentHtml)
  );
  const plainText = stripHtml(contentHtml || summary);
  const author = entry.author?.[0]?.name?.$t?.trim() || "AIKaFanda Team";
  const authorImage = normalizeImageUrl(entry.author?.[0]?.gd$image?.src);

  return {
    title,
    slug,
    excerpt: buildExcerpt(summary, contentHtml),
    date: entry.published?.$t || new Date().toISOString(),
    updatedDate: entry.updated?.$t || entry.published?.$t,
    author,
    authorImage,
    featuredImage,
    featuredImageAlt: title,
    category,
    tags,
    status: "published",
    featured: featured || index === 0,
    seoTitle: title,
    seoDescription: buildExcerpt(summary, contentHtml),
    canonicalUrl: alternateUrl,
    ogImage: featuredImage,
    readingTime: readingTime(plainText).text,
    content: sanitizeHtml(contentHtml),
  };
}

const loadBloggerPosts = cache(async (): Promise<BlogPost[]> => {
  const feedUrl = getBloggerFeedUrl();

  if (!feedUrl) {
    console.warn("[blogs] BLOGGER_SITE_URL is not configured.");
    return [];
  }

  const response = await fetch(feedUrl, {
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    console.error(`[blogs] Failed to load Blogger feed: ${response.status}`);
    return [];
  }

  const data = (await response.json()) as BloggerFeedResponse;
  const entries = data.feed?.entry || [];
  const posts = entries
    .map((entry, index) => parseEntry(entry, index))
    .filter((post): post is BlogPost => !!post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!posts.some((post) => post.featured) && posts[0]) {
    posts[0].featured = true;
  }

  return posts;
});

export async function getAllPosts(): Promise<BlogPost[]> {
  return loadBloggerPosts();
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  return loadBloggerPosts();
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.featured);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((post) => post.slug);
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  const lowerTag = tag.toLowerCase();
  return posts.filter((post) =>
    post.tags.some((item) => item.toLowerCase() === lowerTag)
  );
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean))
  ).sort();
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
}

export async function getRelatedPosts(
  currentPost: BlogPost,
  limit: number = 3
): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  const candidates = posts.filter((post) => post.slug !== currentPost.slug);

  return candidates
    .map((post) => {
      let score = 0;
      if (post.category === currentPost.category) score += 3;
      score += post.tags.filter((tag) => currentPost.tags.includes(tag)).length;
      return { post, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    )
    .slice(0, limit)
    .map((item) => item.post);
}
