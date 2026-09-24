import { site } from '@/data/site'
import { getAllPosts } from '@/lib/blogger'

export default async function sitemap() {
  const routes = ['', '/services', '/products', '/blog', '/about', '/contact', '/privacy-policy', '/terms'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  let posts = []
  try {
    posts = (await getAllPosts(200)).map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.updated || p.published),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch {}

  return [...routes, ...posts]
}
