import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");
const LEGACY_BLOGS_DIR = path.join(process.cwd(), "content");

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

interface RawFrontmatter {
  title?: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  updatedDate?: string;
  author?: string;
  authorImage?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  category?: string;
  tags?: string[];
  status?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  readingTime?: string;
}

function normalizeImagePath(imagePath?: string): string {
  if (!imagePath) return "";

  const trimmed = imagePath.trim();
  if (!trimmed) return "";

  const normalized = trimmed.replace(
    /(\.(?:png|jpe?g|webp|gif|svg))(?:\1)+$/i,
    "$1"
  );

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function normalizeMarkdownContent(markdown: string): string {
  return markdown.replace(
    /(\.(?:png|jpe?g|webp|gif|svg))(?:\1)+/gi,
    "$1"
  );
}

function getBlogsDirectory(): string {
  if (!fs.existsSync(BLOGS_DIR)) {
    fs.mkdirSync(BLOGS_DIR, { recursive: true });
  }
  return BLOGS_DIR;
}

function getCandidateDirectories(): string[] {
  const directories = [getBlogsDirectory()];

  if (fs.existsSync(LEGACY_BLOGS_DIR)) {
    directories.push(LEGACY_BLOGS_DIR);
  }

  return Array.from(new Set(directories));
}

function readMarkdownFile(filePath: string): { frontmatter: RawFrontmatter; content: string } | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { frontmatter: data as RawFrontmatter, content };
  } catch {
    return null;
  }
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parsePost(filePath: string): BlogPost | null {
  const result = readMarkdownFile(filePath);
  if (!result) return null;

  const { frontmatter, content } = result;
  const slug = frontmatter.slug || sanitizeSlug(path.basename(filePath, ".md"));

  if (!isValidSlug(slug)) {
    console.warn(`[blogs] Skipping ${filePath}: invalid slug "${slug}"`);
    return null;
  }

  if (!frontmatter.title) {
    console.warn(`[blogs] Skipping ${filePath}: missing required "title" field`);
    return null;
  }

  const computedReadingTime = readingTime(content).text;
  const normalizedContent = normalizeMarkdownContent(content);

  return {
    title: frontmatter.title,
    slug,
    excerpt: frontmatter.excerpt || "",
    date: frontmatter.date || new Date().toISOString(),
    updatedDate: frontmatter.updatedDate,
    author: frontmatter.author || "AIKaFanda Team",
    authorImage: normalizeImagePath(frontmatter.authorImage),
    featuredImage: normalizeImagePath(frontmatter.featuredImage),
    featuredImageAlt: frontmatter.featuredImageAlt || frontmatter.title,
    category: frontmatter.category || "Technology",
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    status: (frontmatter.status === "published" ? "published" : "draft") as "draft" | "published",
    featured: !!frontmatter.featured,
    seoTitle: frontmatter.seoTitle || frontmatter.title,
    seoDescription: frontmatter.seoDescription || frontmatter.excerpt || "",
    canonicalUrl: frontmatter.canonicalUrl,
    ogImage: normalizeImagePath(frontmatter.ogImage || frontmatter.featuredImage),
    readingTime: frontmatter.readingTime || computedReadingTime,
    content: normalizedContent,
  };
}

export function getAllPosts(): BlogPost[] {
  const files = getCandidateDirectories()
    .flatMap((dir) =>
      fs.readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((file) => path.join(dir, file))
    );
  const posts: BlogPost[] = [];
  const seenSlugs = new Set<string>();

  for (const filePath of files) {
    const post = parsePost(filePath);
    if (post && !seenSlugs.has(post.slug)) {
      posts.push(post);
      seenSlugs.add(post.slug);
    }
  }

  return posts;
}

export function getPublishedPosts(): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPosts(): BlogPost[] {
  return getPublishedPosts().filter((p) => p.featured);
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((post) => post.slug === slug) || null;
}

export function getAllPostSlugs(): string[] {
  return getPublishedPosts().map((p) => p.slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getPublishedPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByTag(tag: string): BlogPost[] {
  const lower = tag.toLowerCase();
  return getPublishedPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === lower)
  );
}

export function getAllCategories(): string[] {
  const posts = getPublishedPosts();
  const cats = new Set(posts.map((p) => p.category).filter(Boolean));
  return Array.from(cats).sort();
}

export function getAllTags(): string[] {
  const posts = getPublishedPosts();
  const tags = new Set(posts.flatMap((p) => p.tags).filter(Boolean));
  return Array.from(tags).sort();
}

export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  const published = getPublishedPosts().filter((p) => p.slug !== currentPost.slug);

  const scored = published.map((post) => {
    let score = 0;
    if (post.category === currentPost.category) score += 3;
    const sharedTags = post.tags.filter((t) => currentPost.tags.includes(t));
    score += sharedTags.length;
    return { post, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map((s) => s.post);
}
