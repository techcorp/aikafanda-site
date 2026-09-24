'use client'

import { useEffect, useRef } from 'react'
import { useInView } from '@/components/Motion'
import { AppIcon } from '@/components/UI'
import { apps } from '@/data/apps'

/* ------------------------------------------------------------ OrbitHero -- */

/** Founder badge at the centre, every shipped app circling on two rings. */
export function OrbitHero({ initials = 'HA' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.25 })
  const inner = apps.slice(0, 3)
  const outer = apps.slice(3)

  const ring = (list, cls, speed, reverse, offset) => (
    <div
      className={`ab-ring absolute rounded-full border border-dashed border-white/10 ${cls}`}
      style={{ '--spin': `${speed}s`, '--dir': reverse ? 'reverse' : 'normal', '--cdir': reverse ? 'normal' : 'reverse' }}
    >
      {list.map((a, k) => {
        const angle = (360 / list.length) * k + offset
        return (
          <div key={a.slug} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <div style={{ transform: `rotate(${-angle}deg)` }}>
                <div className="ab-counter">
                  <a
                    href={`/products#${a.slug}`}
                    aria-label={a.name}
                    className="ab-orb-item block"
                    style={{ '--d': `${300 + (offset + k) * 60}ms`, '--accent': a.accent }}
                  >
                    <AppIcon app={a} size={48} className="ab-orb-icon !h-11 !w-11 !rounded-xl sm:!h-12 sm:!w-12" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div ref={ref} className={`ab-orbit relative mx-auto aspect-square w-full max-w-[20rem] sm:max-w-[26rem] ${inView ? 'is-in' : ''}`}>
      <div aria-hidden className="absolute inset-[18%] animate-breathe rounded-full bg-indigo/30 blur-[60px]" />
      {ring(outer, 'inset-[6%]', 60, false, 1)}
      {ring(inner, 'inset-[27%]', 38, true, 0)}

      {/* centre badge */}
      <div className="ab-core absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2">
        <span aria-hidden className="ab-halo absolute inset-0 rounded-full" />
        <span aria-hidden className="ab-halo absolute inset-0 rounded-full [animation-delay:-1.5s]" />
        <span aria-hidden className="ab-conic absolute -inset-[3px] rounded-full" />
        <span className="relative grid h-full w-full place-items-center rounded-full border border-line bg-surface-2 font-display text-[1.6rem] font-bold text-fg sm:text-[2rem]">
          {initials}
        </span>
      </div>

      {/* floating chips */}
      <div className="ab-chip absolute -right-1 bottom-[8%] z-10 sm:-right-4" style={{ '--d': '1050ms' }}>
        <div className="glass flex animate-float items-center gap-2 px-3 py-2 font-mono text-kicker uppercase text-fg/85 [animation-delay:-4s]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Since 2024
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- SpotCard -- */

const icons = {
  target: (
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  design: <path d="M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4" />,
  code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" />,
  ship: <path d="M5 19c3-1 5-3 6-7l5-5c2-2 4-2 5-2 0 1 0 3-2 5l-5 5c-4 1-6 3-7 6l-2-2Zm4-4-3-1 3-4h4m1 4v4l-4 3-1-3" />,
}

function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function useSpot() {
  const ref = useRef(null)
  const onPointerMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return { ref, onPointerMove }
}

/** Mission / vision card: cursor spotlight, giant outlined word, flip-up entry. */
export function SpotCard({ kicker, word, icon, accent = '#6C5CE7', delay = 0, children }) {
  const wrap = useRef(null)
  const inView = useInView(wrap, { threshold: 0.2 })
  const spot = useSpot()
  return (
    <div ref={wrap} className={`ab-card h-full [perspective:1000px] ${inView ? 'is-in' : ''}`} style={{ '--d': `${delay}ms`, '--accent': accent }}>
      <div
        ref={spot.ref}
        onPointerMove={spot.onPointerMove}
        className="ab-card-in group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7 md:p-9"
      >
        <div aria-hidden className="ab-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span
          aria-hidden
          className="ab-word pointer-events-none absolute -bottom-6 -right-3 select-none font-display text-[5.5rem] font-bold leading-none text-transparent sm:text-[7.5rem]"
          style={{ WebkitTextStroke: `1px ${accent}55` }}
        >
          {word}
        </span>
        <div className="relative">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
              style={{ background: `${accent}1f`, color: accent, boxShadow: `0 10px 30px -12px ${accent}` }}
            >
              <Icon name={icon} />
            </span>
            <span className="font-mono text-kicker uppercase" style={{ color: accent }}>
              {kicker}
            </span>
          </div>
          <p className="mt-6 max-w-md text-body-lg text-fg/90">{children}</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- AiMethod -- */

/** Three steps joined by a travelling beam; each types out its "prompt". */
export function AiMethod({ steps }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.2 })
  return (
    <div ref={ref} className={`ab-method relative mt-12 ${inView ? 'is-in' : ''}`}>
      <div aria-hidden className="ab-beam-track absolute left-[16%] right-[16%] top-[2.875rem] hidden h-px bg-line md:block">
        <span className="ab-beam absolute inset-y-0 w-24" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <MethodCard key={s.title} s={s} i={i} />
        ))}
      </div>
    </div>
  )
}

function MethodCard({ s, i }) {
  const spot = useSpot()
  return (
    <div className="ab-step" style={{ '--d': `${i * 160}ms`, '--accent': s.accent }}>
      <div
        ref={spot.ref}
        onPointerMove={spot.onPointerMove}
        className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/15"
      >
        <div aria-hidden className="ab-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span
              className="ab-step-icon relative z-10 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-void"
              style={{ color: s.accent, boxShadow: `0 0 0 6px #141419, 0 10px 30px -10px ${s.accent}` }}
            >
              <Icon name={s.icon} />
            </span>
            <span className="font-mono text-[2.25rem] font-bold leading-none text-transparent" style={{ WebkitTextStroke: '1px #2e2e3a' }}>
              0{i + 1}
            </span>
          </div>
          <h3 className="mt-6 font-display text-h3 text-fg">{s.title}</h3>
          <p className="mt-3 text-body-sm text-muted">{s.body}</p>

          <div className="mt-6 overflow-hidden rounded-lg border border-white/5 bg-void/80 px-3 py-2.5 font-mono text-[12px] text-muted">
            <span className="text-emerald-400">❯</span>{' '}
            <span className="ab-type inline-block overflow-hidden whitespace-nowrap align-bottom" style={{ '--n': s.prompt.length, color: s.accent }}>
              {s.prompt}
            </span>
            <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-caret bg-fg/70 align-middle" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------- FounderPortrait -- */

/** Cut-out portrait rising out of an arch, with tilt, rings and floating chips. */
export function FounderPortrait({ name, src = '/founder.webp' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.25 })

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
    el.style.setProperty('--px', `${(x * 14).toFixed(1)}px`)
    el.style.setProperty('--py2', `${(y * 10).toFixed(1)}px`)
  }
  const onLeave = () => {
    const el = ref.current
    ;['--rx', '--ry'].forEach((p) => el.style.setProperty(p, '0deg'))
    ;['--px', '--py2'].forEach((p) => el.style.setProperty(p, '0px'))
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`fp relative mx-auto w-full max-w-[24rem] [perspective:1200px] sm:max-w-[26rem] ${inView ? 'is-in' : ''}`}
    >
      <div aria-hidden className="absolute inset-x-[10%] top-[18%] bottom-[10%] animate-breathe rounded-full bg-indigo/35 blur-[80px]" />

      <div className="fp-tilt relative">
        {/* arch backdrop */}
        <div className="fp-arch absolute inset-x-0 bottom-0 top-[24%] overflow-hidden rounded-t-full border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo/35 via-surface-2 to-void" />
          <div className="grid-bg absolute inset-0 opacity-60" />
          <span className="fp-sweep absolute inset-0" />
        </div>

        {/* rings behind the head */}
        <div aria-hidden className="fp-rings pointer-events-none absolute left-1/2 top-[2%] aspect-square w-[74%] -translate-x-1/2">
          <span className="fp-ring absolute inset-0 rounded-full border border-dashed border-indigo/40" />
          <span className="fp-ring fp-ring-2 absolute inset-[12%] rounded-full border border-amber/25" />
          <span className="fp-dot absolute inset-0" />
        </div>

        {/* portrait pops out of the arch; bottom fades into the page */}
        <div className="fp-img-wrap relative [mask-image:linear-gradient(to_bottom,#000_78%,transparent)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Portrait of ${name}`}
            width={760}
            height={1013}
            loading="lazy"
            draggable={false}
            className="fp-img relative block h-auto w-full"
          />
        </div>

        {/* floating chips */}
        <div className="fp-chip absolute -left-2 top-[34%] z-10 sm:-left-8" style={{ '--d': '700ms' }}>
          <div className="glass flex animate-float items-center gap-2 px-3 py-2 font-mono text-kicker uppercase text-fg/85">
            <span className="text-amber">★</span> Founder
          </div>
        </div>
        <div className="fp-chip absolute -right-2 top-[52%] z-10 sm:-right-8" style={{ '--d': '850ms' }}>
          <div className="glass flex animate-float items-center gap-2 px-3 py-2 font-mono text-kicker uppercase text-fg/85 [animation-delay:-3s]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {apps.length} apps live
          </div>
        </div>

        {/* name plate */}
        <div className="fp-chip absolute inset-x-[8%] bottom-[6%] z-10" style={{ '--d': '1000ms' }}>
          <div className="glass flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-display text-[15px] font-semibold text-fg">{name}</p>
              <p className="font-mono text-[10.5px] uppercase tracking-wider text-muted">Android · AI · Web</p>
            </div>
            <span className="shrink-0 rounded-full border border-indigo/40 bg-indigo/15 px-2.5 py-1 font-mono text-[10.5px] uppercase text-[#C6BFFF]">
              AI ka Fanda
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------- FounderTerminal -- */

/** A terminal whose lines print one by one as it scrolls in. */
export function FounderTerminal({ lines }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.3 })
  return (
    <div ref={ref} className={`ab-term relative ${inView ? 'is-in' : ''}`}>
      <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-indigo/15 blur-[60px]" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-1.5 border-b border-white/5 bg-void/80 px-4 py-3">
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-2 truncate font-mono text-[11px] text-muted">~/aikafanda — zsh</span>
        </div>
        <div className="space-y-1.5 p-5 font-mono text-[12.5px] leading-relaxed sm:p-6 sm:text-[13px]">
          {lines.map((l, i) => (
            <p
              key={i}
              className={`ab-line break-words ${l.cmd ? 'text-fg' : 'pl-4 text-muted'}`}
              style={{ '--d': `${200 + i * 260}ms` }}
            >
              {l.cmd ? (
                <>
                  <span className="text-emerald-400">❯</span> {l.text}
                </>
              ) : (
                <span style={l.color ? { color: l.color } : undefined}>{l.text}</span>
              )}
            </p>
          ))}
          <p className="ab-line text-fg" style={{ '--d': `${200 + lines.length * 260}ms` }}>
            <span className="text-emerald-400">❯</span> <span className="inline-block h-3.5 w-2 animate-caret bg-fg/70 align-middle" />
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- Timeline -- */

/** Scroll-linked timeline: the rail fills and each milestone lights as you pass. */
export function Timeline({ items }) {
  const wrapRef = useRef(null)
  const fillRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const update = () => {
      const r = wrap.getBoundingClientRect()
      const line = window.innerHeight * 0.62
      const p = reduced ? 1 : Math.min(1, Math.max(0, (line - r.top) / r.height))
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`
      itemRefs.current.forEach((el) => {
        if (!el) return
        const lit = reduced || el.getBoundingClientRect().top + 12 < line
        el.classList.toggle('is-lit', lit)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative mt-14">
      {/* rail */}
      <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-line md:left-1/2">
        <div ref={fillRef} className="ab-rail-fill absolute inset-0 origin-top" style={{ transform: 'scaleY(0)' }} />
      </div>

      <div className="space-y-10 md:space-y-4">
        {items.map((m, i) => {
          const right = i % 2 === 1
          return (
            <div
              key={m.title}
              ref={(el) => (itemRefs.current[i] = el)}
              className={`ab-tl relative pl-12 md:w-1/2 md:pl-0 ${right ? 'md:ml-auto md:pl-12 is-right' : 'md:pr-12'}`}
            >
              <span
                aria-hidden
                className={`ab-dot absolute left-4 top-6 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-line bg-void ${
                  right ? 'md:left-0' : 'md:left-auto md:right-0 md:translate-x-1/2'
                }`}
              />
              <div className="ab-tl-card group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-white/15">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-[4.5rem] font-bold leading-none text-transparent transition-all duration-700 group-hover:-translate-y-1"
                  style={{ WebkitTextStroke: '1px #2a2a35' }}
                >
                  {m.year}
                </span>
                <p className="ab-year relative font-mono text-kicker uppercase text-muted transition-colors duration-500">{m.year}</p>
                <h3 className="relative mt-2 font-display text-h3 text-fg">{m.title}</h3>
                <p className="relative mt-2 max-w-prose text-body-sm text-muted">{m.body}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- StackMarquee -- */

/** Two rows of tech chips drifting in opposite directions. */
export function StackMarquee({ rows }) {
  return (
    <div className="ab-stack relative mt-10 space-y-4 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      {rows.map((row, r) => {
        const doubled = [...row, ...row]
        return (
          <div key={r} className="group flex overflow-hidden">
            <div
              className={`flex w-max animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused] ${r % 2 ? '[animation-direction:reverse]' : ''}`}
              style={{ animationDuration: `${38 + r * 8}s` }}
            >
              {doubled.map((t, i) => (
                <span
                  key={i}
                  aria-hidden={i >= row.length}
                  className="flex shrink-0 items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 font-mono text-code text-muted transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:text-fg"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: t.c, boxShadow: `0 0 10px ${t.c}` }} />
                  {t.n}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
