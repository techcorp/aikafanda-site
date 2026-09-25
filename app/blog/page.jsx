import { Suspense } from 'react'
import Link from 'next/link'
import { Reveal, MaskedLines } from '@/components/Motion'
import { Kicker } from '@/components/UI'
import BlogExplorer from '@/components/BlogExplorer'
import { getAllPosts, formatDate, isBloggerConfigured } from '@/lib/blogger'
import { categorize } from '@/lib/blogCategories'

export const revalidate = 600

export const metadata = {
  title: 'Blog',
  description: 'Notes on building with AI — tooling, LLM engineering and Play Store lessons from an AI-first studio.',
}

function NotConfigured() {
  return (
    <div className="card mx-auto max-w-2xl p-8 text-center md:p-12">
      <Kicker>Setup needed</Kicker>
      <h2 className="mt-5 font-display text-h1 text-fg">Connect your Blogger blog</h2>
      <p className="mx-auto mt-4 max-w-prose text-body-md text-muted">
        Posts are pulled live from Blogger. Add <code className="font-mono text-indigo-soft">BLOGGER_API_KEY</code> and{' '}
        <code className="font-mono text-indigo-soft">BLOGGER_BLOG_ID</code> to your environment variables in Vercel,
        then redeploy. Full steps are in the project README.
      </p>
    </div>
  )
}

export default async function BlogPage({ searchParams }) {
  const label = searchParams?.label || null
  const configured = isBloggerConfigured()

  const all = configured ? await getAllPosts() : []
  // Old /blog?label= links still work: narrow to that Blogger label.
  const source = label ? all.filter((p) => p.labels.includes(label)) : all
  // Only what the cards need — full HTML bodies stay on the server.
  const posts = source.map(({ id, slug, title, excerpt, image, author, published, readingTime }) => ({
    id,
    slug,
    title,
    excerpt,
    image,
    author,
    readingTime,
    date: formatDate(published),
    category: categorize({ title }),
  }))

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40">
        <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-24 right-[-10%] h-[30rem] w-[30rem] animate-breathe rounded-full bg-indigo/20 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-[-8%] h-72 w-72 rounded-full bg-amber/10 blur-[100px]"
          aria-hidden="true"
        />
        <div className="shell relative">
          <Reveal>
            <Kicker>Blog</Kicker>
          </Reveal>
          <h1 className="mt-5 max-w-4xl font-display text-hero text-fg">
            <MaskedLines lines={['Notes on', 'building with AI']} />
          </h1>
          <Reveal delay={200}>
            <p className="mt-5 max-w-2xl text-body-lg text-muted">
              Guides, tool round-ups and plain-English explainers — from machine learning basics to
              AI side hustles.
            </p>
          </Reveal>
          {label ? (
            <Reveal delay={300}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="chip">Tag: {label}</span>
                <Link href="/blog" className="font-mono text-kicker uppercase text-indigo-soft hover:text-fg">
                  Clear ×
                </Link>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="pb-24">
        <div className="shell">
          {!configured ? (
            <NotConfigured />
          ) : posts.length === 0 ? (
            <div className="card mx-auto max-w-xl p-10 text-center">
              <h2 className="font-display text-h2 text-fg">Nothing here yet</h2>
              <p className="mt-3 text-body-md text-muted">
                {label ? `No posts tagged “${label}”.` : 'The first post is on its way. Check back shortly.'}
              </p>
              {label ? (
                <Link href="/blog" className="btn-ghost mt-6">
                  Show all posts
                </Link>
              ) : null}
            </div>
          ) : (
            <Suspense fallback={null}>
              <BlogExplorer posts={posts} />
            </Suspense>
          )}
        </div>
      </section>
    </>
  )
}
