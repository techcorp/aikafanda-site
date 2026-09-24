/**
 * Blogger API v3 client.
 *
 * You write posts in Blogger; this pulls them into the site.
 * Requires BLOGGER_API_KEY and BLOGGER_BLOG_ID (see .env.example).
 *
 * Everything is fetched with ISR (revalidate = 10 min) so Vercel serves
 * cached HTML and your API quota stays tiny. Publish a post and it appears
 * within 10 minutes — or instantly if you ping /api/revalidate.
 */

const API = 'https://www.googleapis.com/blogger/v3'
export const BLOG_REVALIDATE = 600

function config() {
  const key = process.env.BLOGGER_API_KEY
  const blogId = process.env.BLOGGER_BLOG_ID
  return { key, blogId, ready: Boolean(key && blogId) }
}

/** Blogger post URLs look like /2026/09/my-post-title.html → "my-post-title" */
export function slugFromUrl(url) {
  if (!url) return ''
  try {
    const path = new URL(url).pathname
    return path.split('/').pop().replace(/\.html$/, '')
  } catch {
    return ''
  }
}

function stripHtml(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function firstImage(html = '') {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return m ? m[1] : null
}

function readingTime(html = '') {
  const words = stripHtml(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

/** Pull the H2/H3 headings out of a post so we can build a table of contents. */
export function extractHeadings(html = '') {
  const out = []
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi
  let m
  while ((m = re.exec(html))) {
    const text = stripHtml(m[2])
    if (!text) continue
    out.push({
      level: Number(m[1]),
      text,
      id: text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 60),
    })
  }
  return out
}

/** Add matching ids to the headings in the HTML so the TOC can link to them. */
export function addHeadingIds(html = '') {
  let i = 0
  const headings = extractHeadings(html)
  return html.replace(/<h([23])([^>]*)>/gi, (match, level, attrs) => {
    const h = headings[i++]
    if (!h || attrs.includes('id=')) return match
    return `<h${level}${attrs} id="${h.id}">`
  })
}

function normalise(post) {
  const content = post.content || ''
  return {
    id: post.id,
    title: post.title || 'Untitled',
    slug: slugFromUrl(post.url),
    url: post.url,
    published: post.published,
    updated: post.updated,
    labels: post.labels || [],
    author: post.author?.displayName || 'AI ka Fanda Team',
    authorImage: post.author?.image?.url?.replace(/^\/\//, 'https://') || null,
    image: post.images?.[0]?.url || firstImage(content),
    excerpt: stripHtml(content).slice(0, 180).trim() + '…',
    readingTime: readingTime(content),
    content,
  }
}

async function call(path, params = {}) {
  const { key, blogId, ready } = config()
  if (!ready) return null

  const qs = new URLSearchParams({ key, fetchImages: 'true', ...params })
  const url = `${API}/blogs/${blogId}${path}?${qs}`

  try {
    const res = await fetch(url, { next: { revalidate: BLOG_REVALIDATE, tags: ['blog'] } })
    if (!res.ok) {
      console.error(`[blogger] ${res.status} on ${path}`, await res.text().catch(() => ''))
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('[blogger] request failed', err)
    return null
  }
}

/** Is Blogger wired up? Used to render a helpful empty state instead of a crash. */
export function isBloggerConfigured() {
  return config().ready
}

/**
 * @returns {Promise<{posts: any[], nextPageToken: string|null, configured: boolean}>}
 */
export async function getPosts({ maxResults = 12, pageToken, label, q } = {}) {
  const params = { maxResults: String(maxResults) }
  if (pageToken) params.pageToken = pageToken
  if (label) params.labels = label

  const data = q ? await call('/posts/search', { q, ...params }) : await call('/posts', params)

  if (!data) return { posts: [], nextPageToken: null, configured: isBloggerConfigured() }
  return {
    posts: (data.items || []).map(normalise),
    nextPageToken: data.nextPageToken || null,
    configured: true,
  }
}

/** Every post, paged through — used for the sitemap and static params. */
export async function getAllPosts(limit = 200) {
  let token
  const all = []
  for (let page = 0; page < 10 && all.length < limit; page++) {
    const { posts, nextPageToken } = await getPosts({ maxResults: 50, pageToken: token })
    all.push(...posts)
    if (!nextPageToken) break
    token = nextPageToken
  }
  return all
}

export async function getPostBySlug(slug) {
  const all = await getAllPosts()
  return all.find((p) => p.slug === slug) || null
}

/** Posts sharing a label, minus the one you're reading. */
export async function getRelatedPosts(post, count = 3) {
  const all = await getAllPosts()
  const others = all.filter((p) => p.slug !== post.slug)
  const scored = others
    .map((p) => ({ p, score: p.labels.filter((l) => post.labels.includes(l)).length }))
    .sort((a, b) => b.score - a.score || new Date(b.p.published) - new Date(a.p.published))
  return scored.slice(0, count).map((s) => s.p)
}

/**
 * Labels for the filter pills, most-used first.
 *
 * A Blogger blog can easily carry 100+ labels, which would bury the page in
 * pills, so we only surface the ones that actually group a useful number of
 * posts. Any label still works as a direct /blog?label=... link.
 */
export async function getLabels(limit = 12) {
  const all = await getAllPosts()
  const counts = new Map()
  all.forEach((p) => p.labels.forEach((l) => counts.set(l, (counts.get(l) || 0) + 1)))

  return Array.from(counts.entries())
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
