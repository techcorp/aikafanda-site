'use client'

import { useEffect, useRef } from 'react'
import { useInView } from '@/components/Motion'
import { Kicker, Arrow, Check, ServiceIcon } from '@/components/UI'

const whatsappUrl = (message) =>
  `https://wa.me/923177416164?text=${encodeURIComponent(message)}`

/** Image composed as a layered, tilting stage instead of a flat box. */
function ServiceVisual({ s, i, flip }) {
  const stageRef = useRef(null)
  const imgRef = useRef(null)

  // Scroll parallax on the render.
  useEffect(() => {
    const stage = stageRef.current
    const img = imgRef.current
    if (!stage || !img) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onScroll = () => {
      const r = stage.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      // -1 (entering from below) → 1 (leaving at top)
      const p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)
      img.style.setProperty('--py', `${(p * 7).toFixed(2)}%`)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Pointer tilt (fine pointers only).
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const el = stageRef.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
  }
  const onLeave = () => {
    const el = stageRef.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div className="svc-visual relative mx-auto w-full max-w-xl px-4 py-8 sm:px-8" style={{ '--accent': s.accent }}>
      {/* glow */}
      <div
        aria-hidden
        className="svc-glow pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: s.accent }}
      />
      {/* giant outlined index */}
      <span
        aria-hidden
        className={`svc-num pointer-events-none absolute -top-4 font-display text-[7rem] font-bold leading-none text-transparent sm:text-[10rem] ${
          flip ? '-left-2' : '-right-2'
        }`}
        style={{ WebkitTextStroke: `1px ${s.accent}` }}
      >
        0{i + 1}
      </span>

      <div
        ref={stageRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="svc-stage group relative [perspective:1200px]"
      >
        <div className="svc-tilt relative">
          {/* orbit rings behind the render */}
          <div aria-hidden className="svc-orbit pointer-events-none absolute inset-[6%]">
            <span className="svc-ring svc-ring-1" />
            <span className="svc-ring svc-ring-2" />
            <span className="svc-dot" />
          </div>

          {/* transparent render: rises in, floats, parallaxes */}
          <div ref={imgRef} className="svc-art relative aspect-[4/3]">
            <div className={`svc-float absolute inset-0 ${flip ? 'is-flip' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={`${s.title} illustration`}
                loading="lazy"
                draggable={false}
                className="svc-img absolute inset-0 h-full w-full object-contain"
              />
              {/* light sweep clipped to the image's own alpha */}
              <div
                aria-hidden
                className="svc-shine pointer-events-none absolute inset-0"
                style={{ WebkitMaskImage: `url(${s.image})`, maskImage: `url(${s.image})` }}
              />
            </div>
          </div>

          {/* floor shadow */}
          <div aria-hidden className="svc-floor pointer-events-none mx-auto -mt-2 h-6 w-2/3 rounded-[50%]" />

          {/* floating chips */}
          <div className={`svc-chip absolute -top-5 z-20 ${flip ? '-right-2 sm:-right-5' : '-left-2 sm:-left-5'}`}>
            <div className="animate-float">
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-void/80 backdrop-blur-md"
                style={{ color: s.accent, boxShadow: `0 12px 40px -10px ${s.accent}` }}
              >
                <ServiceIcon name={s.icon} className="h-6 w-6" />
              </span>
            </div>
          </div>
          <div
            className={`svc-chip svc-chip-2 absolute -bottom-5 z-20 ${flip ? '-left-2 sm:-left-6' : '-right-2 sm:-right-6'}`}
          >
            <div className="animate-float [animation-delay:-4s]">
              <div className="glass flex items-center gap-2.5 px-3.5 py-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-kicker uppercase text-fg/85">
                  {s.stack[0]} · {s.stack[1]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ServiceFeature({ s, i, total }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.2 })
  const flip = i % 2 === 1

  return (
    <div
      ref={ref}
      id={s.slug}
      className={`svc-row scroll-mt-28 ${inView ? 'is-in' : ''}`}
      style={{ '--accent': s.accent }}
    >
      <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div className="svc-visual-wrap">
          <ServiceVisual s={s} i={i} flip={flip} />
        </div>

        <div className="svc-copy">
          <div className="svc-in" style={{ '--d': '100ms' }}>
            <Kicker tone="indigo">
              0{i + 1} / 0{total}
            </Kicker>
          </div>
          <h2 className="svc-in mt-4 font-display text-h1 text-fg" style={{ '--d': '180ms' }}>
            {s.title}
          </h2>
          <div
            aria-hidden
            className="svc-bar mt-5 h-[3px] w-24 rounded-full"
            style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }}
          />
          <p className="svc-in mt-5 max-w-prose text-body-md text-muted" style={{ '--d': '260ms' }}>
            {s.body}
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {s.deliverables.map((d, k) => (
              <li
                key={d}
                className="svc-in svc-deliv group flex gap-3 rounded-xl border border-line bg-surface/60 p-3.5 text-body-sm text-fg/85 backdrop-blur"
                style={{ '--d': `${340 + k * 90}ms` }}
              >
                <span
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md transition-transform duration-500 group-hover:rotate-[360deg]"
                  style={{ background: `${s.accent}26`, color: '#C6BFFF' }}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-2">
            {s.stack.map((t, k) => (
              <span key={t} className="svc-in chip svc-chip-tag" style={{ '--d': `${700 + k * 50}ms` }}>
                {t}
              </span>
            ))}
          </div>

          <a
            href={whatsappUrl(`Assalam-o-Alaikum, I am interested in your ${s.title} service. Please share more details.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="svc-in btn-ghost mt-8"
            style={{ '--d': '850ms' }}
          >
            Discuss on WhatsApp <Arrow />
          </a>
        </div>
      </div>
    </div>
  )
}
