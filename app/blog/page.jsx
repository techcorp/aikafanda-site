import Link from 'next/link'
import { Reveal } from '@/components/Motion'
import { Kicker, Arrow } from '@/components/UI'
import { getPosts, getLabels, formatDate, isBloggerConfigured, BLOG_REVALIDATE } from '@/lib/blogger'

export const revalidate = 600

export const metadata = {
  title: 'Blog',
  description: 'Notes on building with AI — tooling, LLM engineering and Play Store lessons from an AI-first studio.',
}

function PostCard({ post, delay = 0 }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link href={`/blog/${post.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
        <div className="aspect-[16/9] overflow-hidden bg-surface-2">
          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
            />
          ) : (
            <span className="block h-full w-full bg-gradient-to-br from-indigo/25 to-void" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          {post.labels[0] ? <span className="chip w-fit">{post.labels[0]}</span> : null}
          <h3 className="mt-3 font-display text-h3 text-fg transition-colors group-hover:text-indigo-soft">
            {post.title}
          </h3>
          <p className="mt-2.5 line-clamp-2 text-body-sm text-muted">{post.excerpt}</p>
          <p className="mt-auto flex items-center gap-2 pt-5 font-mono text-kicker uppercase text-muted">
            {formatDate(post.published)} · {post.readingTime} min read
            <span className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 text-amber">
              <Arrow className="h-3 w-3" />
            </span>
          </p>
        </div>
      </Link>
    </Reveal>
  )
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

  const [{ posts }, labels] = await Promise.all([
    getPosts({ maxResults: 13, label }),
    getLabels(),
  ])

  const [featured, ...rest] = posts

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40">
        <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
        <div className="shell relative">
          <Kicker>Blog</Kicker>
          <h1 className="mt-5 font-display text-hero text-fg">Notes on building with AI</h1>
          <p className="mt-5 max-w-2xl text-body-lg text-muted">
            Written in Blogger, published here. Tooling experiments, LLM engineering, and what the
            Play Store actually rejects.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="shell">
          {!configured ? (
            <NotConfigured />
          ) : posts.length === 0 ? (
            <div className="card mx-auto max-w-xl p-10 text-center">
              <h2 className="font-display text-h2 text-fg">Nothing here yet</h2>
              <p className="mt-3 text-body-md text-muted">
                {label
                  ? `No posts tagged “${label}”.`
                  : 'The first post is on its way. Check back shortly.'}
              </p>
              {label ? (
                <Link href="/blog" className="btn-ghost mt-6">
                  Show all posts
                </Link>
              ) : null}
            </div>
          ) : (
            <>
              {/* featured */}
              {featured && (
                <Reveal>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="card card-hover group grid overflow-hidden md:grid-cols-2"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-surface-2 md:aspect-auto md:h-full">
                      {featured.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={featured.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <span className="block h-full w-full bg-gradient-to-br from-indigo/30 to-void" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-7 md:p-10">
                      <div className="flex flex-wrap gap-2">
                        <span className="chip-signal">Latest</span>
                        {featured.labels[0] ? <span className="chip">{featured.labels[0]}</span> : null}
                      </div>
                      <h2 className="mt-5 font-display text-h1 text-fg transition-colors group-hover:text-indigo-soft">
                        {featured.title}
                      </h2>
                      <p className="mt-4 line-clamp-3 text-body-md text-muted">{featured.excerpt}</p>
                      <p className="mt-6 font-mono text-kicker uppercase text-muted">
                        {featured.author} · {formatDate(featured.published)} · {featured.readingTime} min read
                      </p>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* labels */}
              {labels.length > 0 && (
                <div className="mt-12 flex flex-wrap gap-2">
                  <Link
                    href="/blog"
                    className={`rounded-full border px-4 py-2 font-mono text-kicker uppercase transition-all ${
                      !label ? 'border-indigo bg-indigo text-white shadow-glow' : 'border-line bg-surface text-muted hover:text-fg'
                    }`}
                  >
                    All
                  </Link>
                  {(labels.some((x) => x.label === label) || !label
                    ? labels
                    : [{ label, count: posts.length }, ...labels]
                  ).map(({ label: l, count }) => (
                    <Link
                      key={l}
                      href={`/blog?label=${encodeURIComponent(l)}`}
                      className={`rounded-full border px-4 py-2 font-mono text-kicker uppercase transition-all ${
                        label === l
                          ? 'border-indigo bg-indigo text-white shadow-glow'
                          : 'border-line bg-surface text-muted hover:border-muted hover:text-fg'
                      }`}
                    >
                      {l} ({count})
                    </Link>
                  ))}
                </div>
              )}

              {/* grid */}
              {rest.length > 0 && (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <PostCard key={post.id} post={post} delay={(i % 3) * 70} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
