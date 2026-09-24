import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ScrollProgress, Reveal } from '@/components/Motion'
import { Kicker, Arrow, CTABand } from '@/components/UI'
import {
  getPostBySlug,
  getAllPosts,
  getRelatedPosts,
  extractHeadings,
  addHeadingIds,
  formatDate,
} from '@/lib/blogger'
import { site } from '@/data/site'

export const revalidate = 600
export const dynamicParams = true

export async function generateStaticParams() {
  const posts = await getAllPosts(50)
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.published,
      modifiedTime: post.updated,
      images: post.image ? [post.image] : undefined,
    },
    alternates: { canonical: `${site.url}/blog/${post.slug}` },
  }
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const headings = extractHeadings(post.content)
  const html = addHeadingIds(post.content)
  const related = await getRelatedPosts(post, 3)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image || undefined,
    datePublished: post.published,
    dateModified: post.updated,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ScrollProgress />

      <article>
        {/* header */}
        <header className="relative overflow-hidden pt-32 pb-10 md:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
          <div className="shell relative max-w-4xl">
            <nav className="font-mono text-kicker uppercase text-muted" aria-label="Breadcrumb">
              <Link href="/" className="transition-colors hover:text-fg">
                Home
              </Link>
              <span className="px-2">/</span>
              <Link href="/blog" className="transition-colors hover:text-fg">
                Blog
              </Link>
            </nav>

            <div className="mt-6 flex flex-wrap gap-2">
              {post.labels.map((l) => (
                <Link key={l} href={`/blog?label=${encodeURIComponent(l)}`} className="chip">
                  {l}
                </Link>
              ))}
            </div>

            <h1 className="mt-5 max-w-3xl font-display text-hero text-fg">{post.title}</h1>

            <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-line pt-6">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface font-display text-body-sm font-bold text-fg">
                {post.author.slice(0, 1)}
              </span>
              <span className="font-mono text-kicker uppercase text-muted">
                {post.author} · {formatDate(post.published)} · {post.readingTime} min read
              </span>
            </div>
          </div>
        </header>

        {/* hero image */}
        {post.image && (
          <div className="shell max-w-5xl">
            <div className="aspect-[16/9] overflow-hidden rounded-xl border border-line bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        )}

        {/* body */}
        <div className="shell mt-14 max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
            {headings.length > 2 ? (
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <p className="font-mono text-kicker uppercase text-amber">On this page</p>
                  <ul className="mt-4 space-y-2.5 border-l border-line">
                    {headings.map((h) => (
                      <li key={h.id} style={{ paddingLeft: h.level === 3 ? '1.75rem' : '1rem' }}>
                        <a
                          href={`#${h.id}`}
                          className="block text-body-sm text-muted transition-colors hover:text-indigo-soft"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            ) : (
              <div className="hidden lg:block" />
            )}

            <div>
              <div className="post-body max-w-prose" dangerouslySetInnerHTML={{ __html: html }} />

              <div className="mt-14 border-t border-line pt-8">
                <p className="font-mono text-kicker uppercase text-muted">Written by</p>
                <p className="mt-2 font-display text-h3 text-fg">{post.author}</p>
                <p className="mt-2 max-w-prose text-body-sm text-muted">
                  {site.name} is an AI-first product studio from {site.location}. We build our own
                  Android apps and take on client work on the same stack.
                </p>
                <Link href="/contact" className="link-arrow mt-5">
                  Work with us <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* related */}
      {related.length > 0 && (
        <section className="section">
          <div className="shell">
            <Kicker>Keep reading</Kicker>
            <h2 className="mt-4 font-display text-h1 text-fg">Related posts</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <Link href={`/blog/${p.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden bg-surface-2">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <span className="block h-full w-full bg-gradient-to-br from-indigo/25 to-void" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-h3 text-fg transition-colors group-hover:text-indigo-soft">
                        {p.title}
                      </h3>
                      <p className="mt-auto pt-4 font-mono text-kicker uppercase text-muted">
                        {formatDate(p.published)} · {p.readingTime} min read
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand
        kicker="Work with us"
        title="Need this built, not just explained?"
        body="We turn posts like this into shipped products for clients every week."
      />
    </>
  )
}
