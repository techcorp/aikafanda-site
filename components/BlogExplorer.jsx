'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Reveal } from '@/components/Motion'
import { Arrow } from '@/components/UI'
import { BLOG_CATEGORIES, categoryName } from '@/lib/blogCategories'

const PAGE = 9

function PostCard({ post, delay = 0 }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link href={`/blog/${post.slug}`} data-cursor="Read" className="card card-hover group flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
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
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="chip w-fit">{categoryName(post.category)}</span>
          <h3 className="mt-3 font-display text-h3 text-fg transition-colors group-hover:text-indigo-soft">
            {post.title}
          </h3>
          <p className="mt-2.5 line-clamp-2 text-body-sm text-muted">{post.excerpt}</p>
          <p className="mt-auto flex items-center gap-2 pt-5 font-mono text-kicker uppercase text-muted">
            {post.date} · {post.readingTime} min read
            <span className="text-amber opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
              <Arrow className="h-3 w-3" />
            </span>
          </p>
        </div>
      </Link>
    </Reveal>
  )
}

function Featured({ post }) {
  return (
    <Reveal>
      <Link href={`/blog/${post.slug}`} data-cursor="Read" className="card card-hover group grid overflow-hidden md:grid-cols-2">
        <div className="aspect-[16/10] overflow-hidden bg-surface-2 md:aspect-auto md:h-full">
          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
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
            <span className="chip">{categoryName(post.category)}</span>
          </div>
          <h2 className="mt-5 font-display text-h1 text-fg transition-colors group-hover:text-indigo-soft">
            {post.title}
          </h2>
          <p className="mt-4 line-clamp-3 text-body-md text-muted">{post.excerpt}</p>
          <p className="mt-6 font-mono text-kicker uppercase text-muted">
            {post.author} · {post.date} · {post.readingTime} min read
          </p>
        </div>
      </Link>
    </Reveal>
  )
}

export default function BlogExplorer({ posts }) {
  const router = useRouter()
  const params = useSearchParams()
  const initial = params.get('category')
  const [active, setActive] = useState(BLOG_CATEGORIES.some((c) => c.slug === initial) ? initial : 'all')
  const [shown, setShown] = useState(PAGE)

  // Keep state in sync with back/forward navigation.
  useEffect(() => {
    const c = params.get('category')
    setActive(BLOG_CATEGORIES.some((x) => x.slug === c) ? c : 'all')
  }, [params])

  const counts = useMemo(() => {
    const m = {}
    posts.forEach((p) => (m[p.category] = (m[p.category] || 0) + 1))
    return m
  }, [posts])

  const cats = BLOG_CATEGORIES.filter((c) => counts[c.slug])

  const [featured, ...rest] = posts
  const list = active === 'all' ? rest : posts.filter((p) => p.category === active)
  const visible = list.slice(0, shown)

  const pick = (slug) => {
    if (slug === active) return
    setActive(slug)
    setShown(PAGE)
    router.replace(slug === 'all' ? '/blog' : `/blog?category=${slug}`, { scroll: false })
  }

  const pill = (on) =>
    `relative rounded-full border px-4 py-2 font-mono text-kicker uppercase transition-all duration-300 ${
      on
        ? 'border-indigo bg-indigo text-white shadow-glow'
        : 'border-line bg-surface text-muted hover:-translate-y-0.5 hover:border-muted hover:text-fg'
    }`

  return (
    <>
      {active === 'all' && featured ? <Featured post={featured} /> : null}

      <Reveal delay={100}>
        <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Blog categories">
          <button type="button" role="tab" aria-selected={active === 'all'} onClick={() => pick('all')} className={pill(active === 'all')}>
            All ({posts.length})
          </button>
          {cats.map((c) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={active === c.slug}
              onClick={() => pick(c.slug)}
              className={pill(active === c.slug)}
            >
              {c.name} ({counts[c.slug]})
            </button>
          ))}
        </div>
      </Reveal>

      {/* keyed by category so every filter change replays the entrance */}
      <div key={active} className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post, i) => (
          <PostCard key={post.id} post={post} delay={((i % PAGE) % 3) * 80 + Math.floor((i % PAGE) / 3) * 60} />
        ))}
      </div>

      {list.length > shown ? (
        <div className="mt-12 flex flex-col items-center gap-3">
          <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn-ghost group">
            Show more
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">
              <Arrow className="h-3.5 w-3.5 rotate-90" />
            </span>
          </button>
          <p className="font-mono text-kicker uppercase text-muted">
            Showing {visible.length} of {list.length}
          </p>
        </div>
      ) : list.length > PAGE ? (
        <p className="mt-12 text-center font-mono text-kicker uppercase text-muted">
          That’s all {list.length} posts
        </p>
      ) : null}
    </>
  )
}
