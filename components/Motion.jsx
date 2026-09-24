'use client'

import { useEffect, useRef, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fires once when the element crosses into view. */
function useInView(ref, { threshold = 0.2, rootMargin = '0px 0px -8% 0px' } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) return setInView(true)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, rootMargin])

  return inView
}

/* --------------------------------------------------------------- Reveal -- */

/** Fade + rise on entry. `delay` in ms staggers siblings. */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={`${inView ? 'is-in' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ---------------------------------------------------------- MaskedLines -- */

/** Headline lines that wipe up from a mask, one after another. */
export function MaskedLines({ lines, className = '', lineClassName = '', stagger = 90 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.4 })
  return (
    <span ref={ref} className={`${inView ? 'is-in' : ''} ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask" style={{ '--line-delay': `${i * stagger}ms` }}>
          <span className={lineClassName}>{line}</span>
        </span>
      ))}
    </span>
  )
}

/* -------------------------------------------------------------- Counter -- */

/** Counts up from 0 when it scrolls into view. */
export function Counter({ to, suffix = '', duration = 1300, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.5 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (prefersReduced()) return setValue(to)

    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(to * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}

/* -------------------------------------------------------- ScrollProgress -- */

/** The 2px indigo bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-indigo shadow-glow"
        style={{ width: `${pct}%`, transition: 'width 120ms linear' }}
      />
    </div>
  )
}

/* -------------------------------------------------------------- Marquee -- */

export function Marquee({ items }) {
  const doubled = [...items, ...items]
  return (
    <div className="group relative overflow-hidden border-y border-line bg-surface/40 py-3.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
      <div className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10 font-mono text-kicker uppercase text-muted">
            {item}
            <span className="h-1 w-1 rounded-full bg-amber" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ DrawLine -- */

/** A rule that draws itself across (or down) as the section enters view. */
export function DrawLine({ vertical = false, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.1 })
  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="h-full w-full bg-gradient-to-r from-indigo/60 to-line"
        style={{
          transform: inView ? 'none' : vertical ? 'scaleY(0)' : 'scaleX(0)',
          transformOrigin: vertical ? 'top' : 'left',
          transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </div>
  )
}

export { useInView }
