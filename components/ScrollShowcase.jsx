'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { playUrl } from '@/data/apps'
import { AppIcon, Arrow, Check, PlayGlyph, Kicker, ServiceIcon } from './UI'

/** Touch / narrow screens: swipeable snap carousel for services. */
function ServiceCarousel({ items }) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const count = items.length

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    const read = () => {
      const cards = [...track.querySelectorAll('[data-slide]')]
      const start = track.scrollLeft + parseFloat(getComputedStyle(track).paddingLeft)
      let best = 0
      cards.forEach((card, i) => {
        if (Math.abs(card.offsetLeft - start) < Math.abs(cards[best].offsetLeft - start)) best = i
      })
      // At the far end the last card may never reach the snap line.
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) best = cards.length - 1
      setActive(best)
    }
    // Four cards: measuring on every scroll event is cheap, and React skips same-value updates.
    track.addEventListener('scroll', read, { passive: true })
    return () => track.removeEventListener('scroll', read)
  }, [])

  const goTo = (i) => {
    const track = trackRef.current
    const card = track?.querySelectorAll('[data-slide]')[(i + count) % count]
    if (!card) return
    track.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: 'smooth' })
  }

  const sideButton =
    'grid h-11 w-11 place-items-center rounded-full border border-line bg-surface/80 text-muted backdrop-blur transition-colors hover:border-muted hover:text-fg'

  return (
    <div className="mx-auto max-w-shell py-12" data-showcase="services" data-showcase-mode="carousel">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Services"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:scroll-px-8 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <article
            key={item.slug}
            data-slide
            aria-label={`${index + 1} of ${count}: ${item.title}`}
            className={`card flex w-[86%] shrink-0 snap-start flex-col overflow-hidden transition-[opacity,transform] duration-500 sm:w-[60%] md:w-[46%] ${
              index === active ? 'opacity-100' : 'scale-[0.96] opacity-60'
            }`}
          >
            <div className="relative aspect-[16/9] bg-void" style={{ backgroundImage: `radial-gradient(60% 70% at 50% 55%, ${item.accent}33, transparent 70%)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" loading="lazy" draggable={false} className="h-full w-full object-contain p-3 transition-transform duration-700 hover:scale-105" />
              <span className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 -50px 60px -30px ${item.accent}40` }} aria-hidden="true" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-indigo/12 text-indigo-soft">
                  <ServiceIcon name={item.icon} />
                </span>
                <span className="font-mono text-kicker uppercase text-muted">0{index + 1} / 0{count}</span>
              </div>
              <h3 className="mt-4 font-display text-h3 text-fg">{item.title}</h3>
              <p className="mt-2 text-body-sm text-muted">{item.short}</p>
              <ul className="mt-4 space-y-2">
                {item.deliverables.slice(0, 3).map((deliverable) => (
                  <li key={deliverable} className="flex gap-2.5 text-body-sm text-fg/85">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-soft" />
                    {deliverable}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.stack.map((tool) => <span key={tool} className="chip">{tool}</span>)}
              </div>
              <Link href={`/services#${item.slug}`} className="link-arrow mt-auto inline-flex w-fit pt-4 pb-1">Learn more <Arrow /></Link>
            </div>
          </article>
        ))}
        <span className="w-px shrink-0" aria-hidden="true" />
      </div>

      <div className="mt-5 flex items-center justify-between px-5 md:px-8">
        <button onClick={() => goTo(active - 1)} aria-label="Previous service" className={sideButton}>
          <Arrow className="h-4 w-4 rotate-180" />
        </button>
        <div className="flex">
          {items.map((item, i) => (
            <button
              key={item.slug}
              onClick={() => goTo(i)}
              aria-label={`Show ${item.title}`}
              aria-current={i === active ? 'true' : undefined}
              className="group grid h-11 min-w-[2.25rem] place-items-center px-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? 'w-7 bg-indigo' : 'w-1.5 bg-line group-hover:bg-muted'
                }`}
              />
            </button>
          ))}
        </div>
        <button onClick={() => goTo(active + 1)} aria-label="Next service" className={sideButton}>
          <Arrow className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

/** Shared pinned depth showcase: renderers vary, scroll maths stays here. */
export default function ScrollShowcase({ items, variant = 'apps' }) {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [enabled, setEnabled] = useState(null)
  const isServices = variant === 'services'
  const count = items.length
  const position = progress * (count - 1)
  // Bias the label toward the incoming card so it matches the visual hand-off.
  const active = Math.max(0, Math.min(count - 1, Math.round(position + 0.2)))
  const current = items[active]

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarse = window.matchMedia('(pointer: coarse)')
    const update = () => setEnabled(!reduced.matches && !coarse.matches && window.innerWidth >= 900)
    update()
    reduced.addEventListener('change', update)
    coarse.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      reduced.removeEventListener('change', update)
      coarse.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (enabled !== true) return undefined
    let frame = null
    const read = () => {
      frame = null
      const element = sectionRef.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable > 0) setProgress(Math.min(1, Math.max(0, -rect.top / scrollable)))
    }
    const requestRead = () => {
      if (frame === null) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', requestRead, { passive: true })
    window.addEventListener('resize', requestRead)
    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestRead)
      window.removeEventListener('resize', requestRead)
    }
  }, [enabled])

  if (enabled !== true && isServices) return <ServiceCarousel items={items} />

  if (enabled !== true) {
    return (
      <div className="shell space-y-6 py-12" data-showcase={variant} data-showcase-mode="stacked">
        {items.map((item, index) => (
          <article key={item.slug} className="card overflow-hidden">
            <div className="aspect-[16/9] bg-void">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={isServices ? item.image : item.banner} alt="" loading="lazy" className={`h-full w-full ${isServices ? "object-contain p-3" : "object-cover"}`} />
            </div>
            <div className="p-5 md:p-6">
              {isServices ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-indigo/12 text-indigo-soft">
                      <ServiceIcon name={item.icon} />
                    </span>
                    <span className="font-mono text-kicker uppercase text-muted">0{index + 1} / 0{count}</span>
                  </div>
                  <h3 className="mt-4 font-display text-h3 text-fg">{item.title}</h3>
                  <p className="mt-3 text-body-sm text-muted">{item.short}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {item.deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex gap-2.5 text-body-sm text-fg/85">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-soft" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {item.stack.map((tool) => <span key={tool} className="chip">{tool}</span>)}
                  </div>
                  <Link href={`/services#${item.slug}`} className="link-arrow mt-4 inline-flex py-2">Learn more <Arrow /></Link>
                </>
              ) : (
                <>
                  <h3 className="font-display text-h3 text-fg">{item.name}</h3>
                  <p className="mt-2 text-body-sm text-muted">{item.tagline}</p>
                  <Link href={`/products#${item.slug}`} className="link-arrow mt-3 inline-flex py-2">Details <Arrow /></Link>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    )
  }

  const url = isServices ? null : playUrl(current)
  const pinnedHeight = isServices ? count * 70 + 70 : count * 62 + 60

  return (
    <div ref={sectionRef} style={{ height: `${pinnedHeight}vh` }} data-showcase={variant} data-showcase-mode="pinned">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="shell grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative mx-auto aspect-[16/10] w-full max-w-[720px]" style={{ perspective: '1400px', perspectiveOrigin: '50% 45%', transformStyle: 'preserve-3d' }}>
            {items.map((item, index) => {
              const offset = index - progress * (count - 1)
              const passed = offset < 0
              const z = passed ? -offset * 520 : -offset * 300
              const y = passed ? offset * 90 : offset * 26
              const scale = passed ? 1 + -offset * 0.12 : 1 - offset * 0.02
              const rotateX = Math.max(-10, Math.min(8, offset * 3.2))
              const opacity = passed ? Math.max(0, 1 + offset / 0.5) : Math.max(0, 1 - offset * 0.45)
              const blur = passed ? Math.min(8, -offset * 14) : offset > 0.5 ? Math.min(5, (offset - 0.5) * 3.4) : 0
              return (
                <div
                  key={item.slug}
                  className="absolute inset-0"
                  data-showcase-card={item.slug}
                  data-active={index === active ? 'true' : 'false'}
                  style={{
                    transform: `translate3d(0, ${y}px, ${z}px) rotateX(${rotateX}deg) scale(${scale})`,
                    opacity,
                    filter: blur ? `blur(${blur}px)` : 'none',
                    zIndex: Math.round(500 - offset * 40),
                    pointerEvents: index === active ? 'auto' : 'none',
                    willChange: 'transform, opacity',
                  }}
                >
                  <div className="h-full overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
                    <div className="flex items-center gap-1.5 border-b border-line/70 px-4 py-2.5">
                      {['#FF5F57', '#FEBC2E', '#28C840'].map((color) => <span key={color} className="h-1.5 w-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />)}
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted">{item.slug}</span>
                      <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-amber">
                        {isServices ? 'Service' : item.status === 'beta' ? 'Closed testing' : 'Live'}
                      </span>
                    </div>
                    <div className="relative h-[calc(100%-2.6rem)] bg-void">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={isServices ? item.image : item.banner} alt="" className={`h-full w-full ${isServices ? "svc-home-float object-contain p-6" : "object-cover"}`} />
                      <span className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 -60px 80px -40px ${item.accent}30` }} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="pointer-events-none absolute -bottom-16 left-1/2 h-40 w-3/4 rounded-full blur-[70px] -translate-x-1/2" style={{ background: `${current.accent}35`, transition: 'background 700ms ease' }} aria-hidden="true" />
          </div>

          <div className="relative" data-showcase-label={current.slug}>
            <Kicker>{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</Kicker>
            <div key={current.slug} className="mt-5 animate-[fadeUp_500ms_cubic-bezier(0.22,1,0.36,1)_both]">
              {isServices ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-indigo/12 text-indigo-soft"><ServiceIcon name={current.icon} /></span>
                    <span className="chip">Service</span>
                  </div>
                  <h3 className="mt-5 font-display text-h1 text-fg">{current.title}</h3>
                  <p className="mt-4 max-w-md text-body-md text-muted">{current.short}</p>
                  <ul className="mt-6 space-y-2.5">
                    {current.deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex gap-3 text-body-sm text-fg/85"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-soft" />{deliverable}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">{current.stack.map((tool) => <span key={tool} className="chip">{tool}</span>)}</div>
                  <Link href={`/services#${current.slug}`} className="link-arrow mt-7 inline-flex">Learn more <Arrow /></Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3"><AppIcon app={current} size={44} /><span className="chip">{current.category}</span></div>
                  <h3 className="mt-5 font-display text-h1 text-fg">{current.name}</h3>
                  <p className="mt-4 max-w-md text-body-md text-muted">{current.tagline}</p>
                  <ul className="mt-6 space-y-2.5">
                    {current.features.slice(0, 3).map((feature) => <li key={feature.title} className="flex gap-3 text-body-sm text-fg/85"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-soft" />{feature.title}</li>)}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !text-[13px]"><PlayGlyph className="h-3.5 w-3.5" />Google Play</a> : <Link href="/contact" className="btn-signal !py-2.5 !text-[13px]">{current.status === 'beta' ? 'Join beta' : 'Get notified'}</Link>}
                    <Link href={`/products#${current.slug}`} className="btn-ghost !py-2.5 !text-[13px]">Details</Link>
                  </div>
                </>
              )}
            </div>
            <div className="mt-10 flex items-center gap-2" aria-hidden="true">
              {items.map((item, index) => <span key={item.slug} className="h-0.5 flex-1 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-indigo" style={{ width: index <= active ? '100%' : '0%', transition: 'width 500ms cubic-bezier(0.22,1,0.36,1)' }} /></span>)}
            </div>
            <p className="mt-3 font-mono text-kicker uppercase text-muted">Keep scrolling to advance</p>
          </div>
        </div>
      </div>
    </div>
  )
}
