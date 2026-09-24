'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { apps as allApps, appCategories, playUrl } from '@/data/apps'
import { AppBanner, AppIcon, Arrow, PlayGlyph, Kicker, Check } from './UI'
import { useInView } from './Motion'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Mouse-only 3D tilt + cursor position, written as CSS variables on the element. */
function useTilt(max = 8) {
  const ref = useRef(null)
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * max * 1.2).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
  }
  const onPointerLeave = () => {
    const el = ref.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }
  return { ref, onPointerMove, onPointerLeave }
}

function StatusDot({ beta }) {
  return (
    <span className="relative flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${beta ? 'bg-amber' : 'bg-emerald-400'}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${beta ? 'bg-amber' : 'bg-emerald-400'}`} />
    </span>
  )
}

/* ------------------------------------------------------------ Icon cloud -- */

/** Header: every app icon floating in a loose, staggered cluster. */
export function IconCloud() {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.2 })

  return (
    <div ref={ref} className={`pc-cloud ${inView ? 'is-in' : ''} grid grid-cols-4 gap-3 sm:gap-4`}>
      {allApps.map((app, i) => (
        <a
          key={app.slug}
          href={`#${app.slug}`}
          aria-label={app.short}
          className={`pc-cloud-item group relative ${i % 2 ? 'translate-y-6' : ''}`}
          style={{ '--d': `${i * 70}ms`, '--accent': app.accent }}
        >
          <span className="animate-float block" style={{ animationDelay: `${-i * 1.3}s` }}>
            <span className="pc-cloud-icon block rounded-2xl">
              <AppIcon app={app} size={72} className="!h-auto !w-full aspect-square !rounded-2xl" />
            </span>
          </span>
          <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {app.short}
          </span>
        </a>
      ))}
    </div>
  )
}

/* ------------------------------------------------------ Featured showcase -- */

const AUTOPLAY_MS = 6500

/** Flagship apps: layered, tilting store-listing stage that auto-rotates. */
export function FeaturedShowcase({ apps }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef, { threshold: 0.3 })
  const tilt = useTilt(9)
  const app = apps[index]
  const url = playUrl(app)
  const beta = app.status === 'beta'

  useEffect(() => {
    if (!inView || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % apps.length), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [index, inView, paused, apps.length])

  return (
    <div
      ref={wrapRef}
      className={`pf ${inView ? 'is-in' : ''} relative`}
      style={{ '--accent': app.accent }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-[28rem] w-[28rem] rounded-full opacity-25 blur-[120px] transition-colors duration-1000"
        style={{ background: app.accent }}
      />

      <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* stage */}
        <div className="relative mx-auto w-full max-w-xl px-3 py-8 sm:px-8">
          <div ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave} className="group [perspective:1200px]">
            <div className="pf-tilt relative">
              <div aria-hidden className="pf-plate pf-plate-2" />
              <div aria-hidden className="pf-plate pf-plate-1" />

              <div className="pf-frame relative overflow-hidden rounded-2xl border border-white/10 bg-surface">
                <div className="relative z-10 flex items-center gap-1.5 border-b border-white/5 bg-void/80 px-3.5 py-2.5 backdrop-blur">
                  {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                    <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />
                  ))}
                  <span className="ml-2 truncate font-mono text-[11px] text-muted">play.store/{app.slug}</span>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden bg-void">
                  {apps.map((a, i) => (
                    <div
                      key={a.slug}
                      aria-hidden={i !== index}
                      className={`pf-slide absolute inset-0 ${i === index ? 'is-active' : ''}`}
                    >
                      <AppBanner app={a} />
                    </div>
                  ))}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                  <div aria-hidden className="pc-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="flex items-center gap-3 px-4 pb-4 pt-1">
                  <div key={app.slug} className="pf-pop">
                    <AppIcon app={app} size={44} className="!rounded-xl" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-body-md font-semibold text-fg">{app.short}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{app.category}</p>
                  </div>
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-fg/80">
                    <StatusDot beta={beta} />
                    {beta ? 'Beta' : 'Live'}
                  </span>
                </div>
              </div>

              {/* floating chips */}
              <div className="pf-chip absolute -left-2 -top-5 z-20 sm:-left-6">
                <div className="animate-float">
                  <div className="glass flex items-center gap-2 px-3.5 py-2.5">
                    <span className="font-display text-body-md font-bold text-fg">{app.features.length}</span>
                    <span className="font-mono text-kicker uppercase text-muted">AI features</span>
                  </div>
                </div>
              </div>
              <div className="pf-chip pf-chip-2 absolute -bottom-5 -right-2 z-20 sm:-right-6">
                <div className="animate-float [animation-delay:-4s]">
                  <div className="glass flex items-center gap-2 px-3.5 py-2.5 font-mono text-kicker uppercase text-fg/85">
                    <span style={{ color: app.accent }}>
                      <PlayGlyph className="h-3.5 w-3.5" />
                    </span>
                    {app.metrics.find((m) => m.k === 'Installs')?.v ?? 'Android'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* copy — remounts per app so the entrance replays */}
        <div key={app.slug} className="pf-copy" aria-live="polite">
          <span className="pf-in chip-indigo" style={{ '--d': '0ms' }}>
            {app.category} · {beta ? 'In beta' : 'Live'}
          </span>
          <h3 className="pf-in mt-4 font-display text-h1 text-fg" style={{ '--d': '70ms' }}>
            {app.name}
          </h3>
          <div
            aria-hidden
            className="pf-in mt-5 h-[3px] w-24 rounded-full"
            style={{ '--d': '120ms', background: `linear-gradient(90deg, ${app.accent}, transparent)` }}
          />
          <p className="pf-in mt-5 max-w-prose text-body-md text-muted" style={{ '--d': '160ms' }}>
            {app.description}
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {app.features.map((f, k) => (
              <li
                key={f.title}
                className="pf-in svc-deliv group flex gap-3 rounded-xl border border-line bg-surface/60 p-3.5 backdrop-blur"
                style={{ '--d': `${230 + k * 70}ms`, '--accent': app.accent }}
              >
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md transition-transform duration-500 group-hover:rotate-[360deg]"
                  style={{ background: `${app.accent}26`, color: '#C6BFFF' }}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block text-body-sm font-medium text-fg">{f.title}</span>
                  <span className="mt-0.5 block text-body-sm text-muted">{f.body}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="pf-in mt-8 flex flex-wrap items-center gap-4" style={{ '--d': '520ms' }}>
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <PlayGlyph className="h-4 w-4" />
                Get it on Google Play
              </a>
            ) : (
              <Link href="/contact" className="btn-signal">
                Request early access
              </Link>
            )}
            <Link href="/services" className="link-arrow py-3 sm:py-0">
              See how we build <Arrow />
            </Link>
          </div>
        </div>
      </div>

      {/* tabs with autoplay progress */}
      <div className="relative mt-10 grid grid-cols-3 gap-2 sm:mt-12 sm:gap-3" role="tablist" aria-label="Flagship apps">
        {apps.map((a, i) => {
          const active = i === index
          return (
            <button
              key={a.slug}
              role="tab"
              aria-selected={active}
              onClick={() => setIndex(i)}
              className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border p-2.5 text-center sm:flex-row sm:gap-3 sm:p-3 sm:text-left transition-colors duration-300 ${
                active ? 'border-white/15 bg-surface' : 'border-line bg-surface/40 hover:border-muted/60'
              }`}
            >
              <AppIcon app={a} size={36} className="!rounded-lg" />
              <span className="w-full min-w-0">
                <span className={`block truncate text-body-sm font-medium ${active ? 'text-fg' : 'text-muted group-hover:text-fg'}`}>
                  {a.short}
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted sm:block">{a.category}</span>
              </span>
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-line/60">
                {active && (
                  <span
                    key={`${a.slug}-${index}`}
                    className={`pf-progress block h-full ${paused || !inView ? 'is-paused' : ''}`}
                    style={{ background: a.accent, animationDuration: `${AUTOPLAY_MS}ms` }}
                  />
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ Grid cards -- */

export function ProductCard({ app, delay = 0 }) {
  const url = playUrl(app)
  const beta = app.status === 'beta'
  const inRef = useRef(null)
  const inView = useInView(inRef, { threshold: 0.15 })
  const tilt = useTilt(7)

  return (
    <div ref={inRef} className={`pc ${inView ? 'is-in' : ''} h-full [perspective:1100px]`} style={{ '--d': `${delay}ms`, '--accent': app.accent }}>
      <div
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        className="pc-tilt group relative h-full rounded-2xl p-px"
      >
        {/* cursor-following border glow */}
        <span aria-hidden className="pc-border pointer-events-none absolute inset-0 rounded-2xl" />

        <article className="relative flex h-full flex-col overflow-hidden rounded-[calc(1rem-1px)] bg-surface">
          <div className="pc-mask relative aspect-[16/9] overflow-hidden bg-void">
            <div className="pc-banner h-full w-full">
              <AppBanner app={app} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
            <span aria-hidden className="pc-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2" />
            <span className="absolute right-3 top-3">
              <span className="chip backdrop-blur">{app.category}</span>
            </span>
            <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-void/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-fg/85 backdrop-blur">
              <StatusDot beta={beta} />
              {beta ? 'Beta' : 'Live'}
            </span>
          </div>

          <div className="relative flex flex-1 flex-col p-5">
            <div aria-hidden className="pc-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="pc-icon relative -mt-[3.25rem] mb-4 w-fit">
              <AppIcon
                app={app}
                size={58}
                className="!rounded-xl !border-2 !border-void ring-1 ring-white/10"
              />
            </div>

            <h3 className="relative font-display text-h3 text-fg">{app.name}</h3>
            <p className="relative mt-2 text-body-sm text-muted">{app.tagline}</p>

            <ul className="relative mt-4 flex flex-1 flex-wrap content-start gap-1.5">
              {app.features.slice(0, 3).map((f, k) => (
                <li
                  key={f.title}
                  className="pc-feat rounded-full border border-line bg-void/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted"
                  style={{ '--fd': `${k * 60}ms` }}
                >
                  {f.title}
                </li>
              ))}
            </ul>

            <div className="relative mt-5 flex gap-2">
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 !py-2.5 !text-[13px]">
                  <PlayGlyph className="h-3.5 w-3.5" />
                  Google Play
                </a>
              ) : (
                <Link href="/contact" className="btn-signal flex-1 !py-2.5 !text-[13px]">
                  {beta ? 'Join beta' : 'Get notified'}
                </Link>
              )}
              <Link href="/contact" className="btn-ghost !py-2.5 !text-[13px]" aria-label={`Ask about ${app.short}`}>
                Ask <Arrow className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

/** Category tabs with a sliding active pill. */
function FilterBar({ filter, setFilter, counts }) {
  const barRef = useRef(null)
  const [pill, setPill] = useState(null)

  useIsoLayoutEffect(() => {
    const measure = () => {
      const btn = barRef.current?.querySelector('[aria-selected="true"]')
      if (!btn) return
      setPill({ x: btn.offsetLeft, w: btn.offsetWidth })
      btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [filter])

  return (
    <div className="-mx-4 mb-10 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div
        ref={barRef}
        role="tablist"
        aria-label="Filter apps by category"
        className="relative inline-flex gap-1 rounded-full border border-line bg-surface/70 p-1 backdrop-blur"
      >
        {pill && (
          <span
            aria-hidden
            className="absolute bottom-1 top-1 rounded-full bg-indigo shadow-glow transition-all duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)]"
            style={{ left: pill.x, width: pill.w }}
          />
        )}
        {appCategories.map((cat) => {
          if (!counts[cat]) return null
          const active = filter === cat
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(cat)}
              className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 font-mono text-kicker uppercase transition-colors duration-300 ${
                active ? 'text-white' : 'text-muted hover:text-fg'
              }`}
            >
              {cat} <span className={active ? 'text-white/70' : 'text-muted/60'}>{counts[cat]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ProductGrid() {
  const [filter, setFilter] = useState('All')

  const visible = useMemo(
    () => (filter === 'All' ? allApps : allApps.filter((a) => a.category === filter)),
    [filter]
  )

  const counts = useMemo(() => {
    const map = { All: allApps.length }
    appCategories.slice(1).forEach((c) => {
      map[c] = allApps.filter((a) => a.category === c).length
    })
    return map
  }, [])

  return (
    <>
      <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

      {/* keyed by filter so cards re-run their entrance when the set changes */}
      <div key={filter} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((app, i) => (
          <div key={app.slug} id={app.slug} className="scroll-mt-28">
            <ProductCard app={app} delay={(i % 3) * 90 + Math.floor(i / 3) * 40} />
          </div>
        ))}

        {filter === 'All' && (
          <div className="pc is-in h-full" style={{ '--d': '300ms' }}>
            <div className="pc-tilt relative flex h-full min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line/80 p-8 text-center">
              <div aria-hidden className="pc-orbit pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo/25">
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-indigo shadow-glow" />
              </div>
              <Kicker tone="indigo">Pipeline</Kicker>
              <p className="relative mt-4 font-display text-h3 text-fg">More coming soon</p>
              <p className="relative mt-2 max-w-[22ch] text-body-sm text-muted">
                Three new AI apps are in local model fine-tuning and testing.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
