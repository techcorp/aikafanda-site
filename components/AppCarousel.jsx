'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { playUrl } from '@/data/apps'
import { AppIcon, Arrow, PlayGlyph } from './UI'

/**
 * Apps arranged around a cylinder. Drag, arrow keys, the side buttons or the
 * dots rotate it; clicking a card that isn't at the front brings it forward.
 *
 * On narrow screens the 3D ring collapses into a horizontal snap-scroll strip,
 * which is what a thumb actually wants.
 */
export default function AppCarousel({ apps }) {
  const [index, setIndex] = useState(0)
  const [compact, setCompact] = useState(false)
  const [reduced, setReduced] = useState(false)
  const ring = useRef(null)
  const indexRef = useRef(0)
  const motion = useRef({
    dragging: false,
    moved: false,
    suppressClick: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    offset: 0,
    velocity: 0,
    inertia: false,
    snapping: false,
    target: 0,
  })
  const frame = useRef(0)

  const count = apps.length
  const step = 360 / count

  const paintRotation = useCallback((transition = 'none') => {
    const el = ring.current
    if (!el) return
    el.style.transition = transition
    el.style.transform = `translateZ(-430px) rotateY(${-indexRef.current * step + motion.current.offset}deg)`
  }, [step])

  useEffect(() => {
    const check = () => setCompact(window.innerWidth < 768)
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const checkReduced = () => setReduced(reducedQuery.matches)
    check()
    checkReduced()
    window.addEventListener('resize', check)
    reducedQuery.addEventListener('change', checkReduced)
    return () => {
      window.removeEventListener('resize', check)
      reducedQuery.removeEventListener('change', checkReduced)
    }
  }, [])

  const stopLoop = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = 0
  }, [])

  const select = useCallback((next) => {
    stopLoop()
    motion.current.inertia = false
    motion.current.snapping = false
    motion.current.offset = 0
    indexRef.current = (next + count) % count
    setIndex(indexRef.current)
    paintRotation(reduced ? 'none' : 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)')
  }, [count, paintRotation, reduced, stopLoop])

  const go = useCallback((dir) => select(indexRef.current + dir), [select])

  // Bound as a React prop so it follows the stage across compact <-> ring swaps.
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  /* ---- coast + snap: a local rAF that only lives while the ring is moving --- */
  const startLoop = useCallback(() => {
    if (frame.current) return
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min(50, now - last)
      last = now
      const m = motion.current
      if (m.inertia) {
        m.offset += m.velocity * dt
        m.velocity *= Math.pow(0.94, dt / 16.67)
        paintRotation('none')
        if (Math.abs(m.velocity) < 0.008) {
          m.inertia = false
          m.snapping = true
          m.target = Math.round(m.offset / step) * step
        }
      } else if (m.snapping) {
        m.offset += (m.target - m.offset) * Math.min(1, dt * 0.012)
        paintRotation('none')
        if (Math.abs(m.target - m.offset) < 0.08) {
          const spun = Math.round(m.target / step)
          indexRef.current = (indexRef.current - spun + count * 10) % count
          m.offset = 0
          m.snapping = false
          setIndex(indexRef.current)
          paintRotation('none')
        }
      }
      frame.current = m.inertia || m.snapping ? requestAnimationFrame(tick) : 0
    }
    frame.current = requestAnimationFrame(tick)
  }, [count, paintRotation, step])

  useEffect(() => stopLoop, [stopLoop])

  /* ---- drag to spin ------------------------------------------------------ */
  const onPointerDown = (e) => {
    if (reduced) return
    const m = motion.current
    m.dragging = true
    m.moved = false
    m.suppressClick = false
    m.startX = e.clientX
    m.lastX = e.clientX
    m.lastTime = performance.now()
    m.offset = 0
    m.velocity = 0
    m.inertia = false
    m.snapping = false
    stopLoop()
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const m = motion.current
    if (!m.dragging) return
    const now = performance.now()
    const angle = (e.clientX - m.startX) * 0.22
    if (Math.abs(e.clientX - m.startX) > 4) m.moved = true
    m.velocity = ((e.clientX - m.lastX) * 0.22) / Math.max(8, now - m.lastTime)
    m.lastX = e.clientX
    m.lastTime = now
    m.offset = angle
    paintRotation('none')
  }
  const onPointerUp = () => {
    const m = motion.current
    if (!m.dragging) return
    m.dragging = false
    m.suppressClick = m.moved
    if (performance.now() - m.lastTime > 80) m.velocity = 0
    if (reduced) {
      const spun = Math.round(m.offset / step)
      select(indexRef.current - spun)
      return
    }
    if (Math.abs(m.velocity) > 0.008) m.inertia = true
    else {
      m.snapping = true
      m.target = Math.round(m.offset / step) * step
    }
    startLoop()
  }

  /* ---- compact: a plain snap strip --------------------------------------- */
  if (compact) {
    return (
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {apps.map((app) => (
          <article key={app.slug} className="card w-[78vw] shrink-0 snap-center overflow-hidden">
            <div className="aspect-[16/9] bg-void">
              {app.banner ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={app.banner} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2.5">
                <AppIcon app={app} size={32} />
                <h3 className="font-display text-body-md font-semibold text-fg">{app.short}</h3>
              </div>
              <p className="mt-2.5 text-body-sm text-muted">{app.tagline}</p>
            </div>
          </article>
        ))}
      </div>
    )
  }

  const current = apps[index]
  const url = playUrl(current)
  const radius = 430

  const sideButton =
    'absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/80 text-muted backdrop-blur transition-colors hover:border-muted hover:text-fg'

  return (
    <div>
      <div className="relative">
      <div
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Our apps"
        data-cursor="Drag"
        className="relative h-[300px] cursor-grab select-none outline-none active:cursor-grabbing sm:h-[340px]"
        style={{ perspective: '1500px' }}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          <div
            ref={ring}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d', transform: `translateZ(-${radius}px) rotateY(${-index * step}deg)` }}
          >
          {apps.map((app, i) => {
            // shortest angular distance from the front position
            let delta = ((i - index) % count + count) % count
            if (delta > count / 2) delta -= count
            const away = Math.abs(delta)
            const front = away < 0.5

            return (
              <button
                key={app.slug}
                type="button"
                onClick={() => {
                  if (motion.current.suppressClick) {
                    motion.current.suppressClick = false
                    return
                  }
                  if (!front) select(i)
                }}
                aria-label={front ? `${app.name}, current` : `Show ${app.name}`}
                aria-current={front}
                className="absolute left-1/2 top-1/2 w-[300px] text-left sm:w-[340px]"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`,
                  // Fully opaque at every angle; cards turned away are culled by
                  // backface-visibility, which stays correct mid-drag (index-based
                  // fades only update once the ring settles).
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  pointerEvents: away > 1.6 ? 'none' : 'auto',
                }}
              >
                <div
                  className={`relative overflow-hidden rounded-xl border bg-surface shadow-panel ${
                    front ? 'border-indigo/45' : 'border-line'
                  }`}
                  style={{ transition: 'border-color 500ms ease' }}
                >
                  <div className="relative aspect-[16/9] bg-void">
                    {app.banner ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={app.banner}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full object-cover [-webkit-user-drag:none]"
                      />
                    ) : (
                      <span
                        className="block h-full w-full"
                        style={{
                          background: `radial-gradient(100% 80% at 50% 0%, ${app.accent}45, transparent 70%), #12121A`,
                        }}
                      />
                    )}
                    {app.status === 'beta' && (
                      <span className="absolute left-3 top-3">
                        <span className="chip-signal">In beta</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <AppIcon app={app} size={34} />
                    <span className="min-w-0">
                      <span className="block truncate font-display text-body-md font-semibold text-fg">
                        {app.short}
                      </span>
                      <span className="block font-mono text-kicker uppercase text-muted">{app.category}</span>
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
          </div>
        </div>

        {/* floor glow, tinted by whatever is at the front */}
        <div
          className="pointer-events-none absolute bottom-2 left-1/2 h-24 w-[420px] -translate-x-1/2 rounded-full blur-[70px]"
          style={{ background: `${current.accent}30`, transition: 'background 700ms ease' }}
          aria-hidden="true"
        />
      </div>

        {/* Outside the drag surface so pressing them never starts a spin. */}
        <button onClick={() => go(-1)} aria-label="Previous app" className={`${sideButton} left-0`}>
          <Arrow className="h-4 w-4 rotate-180" />
        </button>
        <button onClick={() => go(1)} aria-label="Next app" className={`${sideButton} right-0`}>
          <Arrow className="h-4 w-4" />
        </button>
      </div>

      {/* details + controls */}
      <div className="mt-8 flex flex-col items-center gap-6">
        <div key={current.slug} className="max-w-xl text-center animate-[fadeUp_450ms_cubic-bezier(0.22,1,0.36,1)_both]">
          <h3 className="font-display text-h2 text-fg">{current.name}</h3>
          <p className="mx-auto mt-3 max-w-md text-body-md text-muted">{current.tagline}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !text-[13px]">
                <PlayGlyph className="h-3.5 w-3.5" />
                Google Play
              </a>
            ) : (
              <Link href="/contact" className="btn-signal !py-2.5 !text-[13px]">
                {current.status === 'beta' ? 'Join beta' : 'Get notified'}
              </Link>
            )}
            <Link href={`/products#${current.slug}`} className="btn-ghost !py-2.5 !text-[13px]">
              Details <Arrow />
            </Link>
          </div>
        </div>

        <div className="flex gap-2">
          {apps.map((a, i) => (
            <button
              key={a.slug}
              onClick={() => select(i)}
              aria-label={`Show ${a.short}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? 'w-7 bg-indigo' : 'w-1.5 bg-line hover:bg-muted'
              }`}
            />
          ))}
        </div>

        <p className="font-mono text-kicker uppercase text-muted">Drag to spin · arrow keys work too</p>
      </div>
    </div>
  )
}
