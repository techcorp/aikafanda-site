'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * Coverflow carousel for the homepage blog section.
 * The active post faces forward; neighbours rotate away in 3D on either side.
 * Arrow keys, swipe, the prev/next buttons and the dots all move it, and it
 * autoplays until the visitor hovers, focuses or interacts with it.
 * Plain CSS transforms + transitions, so no animation library is needed.
 */

const ROTATION = 42
const DEPTH = 170
const SCALE_STEP = 0.12
const MAX_VISIBLE = 2
const AUTOPLAY_DELAY = 4500
const SWIPE_DISTANCE = 60

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduced
}

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
      <path d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BlogCoverflow({ posts }) {
  const total = posts.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [spacing, setSpacing] = useState(260)
  const reduced = usePrefersReducedMotion()
  const stageRef = useRef(null)
  const dragRef = useRef(null)

  const goTo = useCallback((next) => setActive(((next % total) + total) % total), [total])

  // keep side cards peeking in at any width
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setSpacing(Math.round(Math.min(280, Math.max(120, entry.contentRect.width * 0.26))))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || paused || total <= 1) return
    const t = setInterval(() => setActive((i) => (i + 1) % total), AUTOPLAY_DELAY)
    return () => clearInterval(t)
  }, [reduced, paused, total])

  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(active + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(active - 1)
    }
  }

  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, moved: false }
  }
  const onPointerUp = (e) => {
    const start = dragRef.current
    if (!start) return
    const dx = e.clientX - start.x
    if (Math.abs(dx) > SWIPE_DISTANCE) {
      start.moved = true
      goTo(active + (dx < 0 ? 1 : -1))
    }
  }
  // a swipe should not also count as a click on the card under the pointer
  const onClickCapture = (e) => {
    if (dragRef.current?.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
    dragRef.current = null
  }

  if (!total) return null

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Latest blog posts"
      tabIndex={0}
      className="relative w-full select-none outline-none"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={stageRef}
        className="bc-stage relative mx-auto flex h-[400px] items-center justify-center sm:h-[440px]"
        style={{ perspective: reduced ? undefined : 1400, touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragRef.current = null)}
        onClickCapture={onClickCapture}
      >
        {/* glow under the active card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 h-24 w-[70%] max-w-xl -translate-x-1/2 rounded-full bg-indigo/25 blur-[70px]"
        />

        {posts.map((post, i) => {
          // shortest signed distance, so the carousel wraps around
          let offset = i - active
          if (offset > total / 2) offset -= total
          if (offset < -total / 2) offset += total
          const dist = Math.abs(offset)
          const isActive = offset === 0
          const hidden = dist > MAX_VISIBLE

          const transform = reduced
            ? `translateX(${offset * spacing}px)`
            : `translateX(${offset * spacing}px) translateZ(${-dist * DEPTH}px) rotateY(${-Math.sign(offset) * Math.min(dist, 1) * ROTATION}deg) scale(${1 - dist * SCALE_STEP})`

          return (
            <div
              key={post.id}
              aria-hidden={!isActive}
              className="bc-card absolute h-[350px] w-[260px] sm:h-[400px] sm:w-[340px]"
              style={{
                transform,
                zIndex: total - dist,
                opacity: hidden ? 0 : reduced && !isActive ? 0 : 1,
                pointerEvents: hidden ? 'none' : 'auto',
              }}
            >
              <Link
                href={`/blog/${post.slug}`}
                tabIndex={isActive ? 0 : -1}
                draggable={false}
                onClick={(e) => {
                  if (!isActive) {
                    e.preventDefault()
                    goTo(i)
                  }
                }}
                className={`card group flex h-full flex-col overflow-hidden ${isActive ? 'bc-active' : ''}`}
              >
                <div className="aspect-[16/9] overflow-hidden bg-surface-2">
                  {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                  ) : (
                    <span className="block h-full w-full bg-gradient-to-br from-indigo/25 to-void" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {post.label ? <span className="chip w-fit">{post.label}</span> : null}
                  <h3 className="mt-3 line-clamp-3 font-display text-h3 text-fg transition-colors group-hover:text-indigo-soft">
                    {post.title}
                  </h3>
                  <p className="mt-auto pt-5 font-mono text-kicker uppercase text-muted">
                    {post.date} · {post.readingTime} min read
                  </p>
                </div>
              </Link>
              {/* dim the cards that are not in focus */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-lg bg-void transition-opacity duration-500"
                style={{ opacity: isActive ? 0 : Math.min(0.55, dist * 0.3) }}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button type="button" aria-label="Previous post" onClick={() => goTo(active - 1)} className="bc-nav">
          <Chevron dir="left" />
        </button>
        <div className="flex items-center gap-2">
          {posts.map((post, i) => (
            <button
              key={post.id}
              type="button"
              aria-label={`Go to post ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-indigo' : 'w-1.5 bg-line hover:bg-muted'
              }`}
            />
          ))}
        </div>
        <button type="button" aria-label="Next post" onClick={() => goTo(active + 1)} className="bc-nav">
          <Chevron dir="right" />
        </button>
      </div>

      <div aria-live="polite" className="sr-only">{`Post ${active + 1} of ${total}`}</div>
    </div>
  )
}
