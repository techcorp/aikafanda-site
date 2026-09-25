'use client'

import { useRef, useState } from 'react'
import { useInView } from '@/components/Motion'
import { Arrow } from '@/components/UI'

// Fan pose per card on lg+: tilt, drop, and entrance delay (outer cards land last).
const POSE = [
  { r: -8, y: 18, delay: 700 },
  { r: -3, y: 0, delay: 350 },
  { r: 3, y: 0, delay: 500 },
  { r: 8, y: 18, delay: 850 },
]

const TINT = [
  'from-indigo/35 via-indigo/10',
  'from-amber/25 via-amber/5',
  'from-indigo-hi/30 via-indigo/5',
  'from-amber-soft/25 via-indigo/10',
]

function Card({ p, i, className = '' }) {
  return (
    <article
      className={`relative flex h-[22rem] w-64 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${TINT[i % TINT.length]} to-transparent`} />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-4 font-display text-[7.5rem] font-bold leading-none text-transparent opacity-60 [-webkit-text-stroke:1px_#FFB020]"
      >
        {p.step}
      </span>

      <div className="relative flex h-full flex-col p-4">
        <small className="w-fit rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 font-mono text-kicker uppercase text-amber">
          {p.meta}
        </small>
        <div className="flex-1" />
        <div className="rounded-xl border border-white/5 bg-void/50 p-4 backdrop-blur-md">
          <h3 className="font-display text-h3 text-fg">{p.title}</h3>
          <p className="mt-2 text-body-sm text-muted">{p.body}</p>
        </div>
      </div>
    </article>
  )
}

/** Desktop: fanned, overlapping cards that spring out of a stack. */
function Fan({ steps }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.25 })
  const mid = (steps.length - 1) / 2

  return (
    <div ref={ref} className={`process-fan ${inView ? 'is-in' : ''} mt-14 hidden justify-center py-8 lg:flex`}>
      {steps.map((p, i) => {
        const pose = POSE[i % POSE.length]
        return (
          <div
            key={p.step}
            className="process-card relative hover:z-30"
            style={{
              '--r': `${pose.r}deg`,
              '--y': `${pose.y}px`,
              // Collapsed start: stacked on the middle of the row.
              '--x0': `${(mid - i) * 100}%`,
              '--delay': `${pose.delay}ms`,
              zIndex: 10 + (i === 1 || i === 2 ? 1 : 0),
            }}
          >
            <Card p={p} i={i} className="process-card-inner" />
          </div>
        )
      })}
    </div>
  )
}

/** Mobile / tablet: looping 3D cover-flow, swipe or tap the arrows. */
function Carousel({ steps }) {
  const n = steps.length
  const [pos, setPos] = useState(0) // fractional while dragging
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)

  const active = ((Math.round(pos) % n) + n) % n
  const go = (d) => setPos((v) => Math.round(v) + d)
  const select = (i) => setPos((v) => Math.round(v) + (((i - active + n + n / 2) % n) - n / 2))

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    drag.current = { x: e.clientX, start: pos, width: e.currentTarget.offsetWidth * 0.5, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    setPos(d.start - dx / d.width)
  }
  const onPointerUp = () => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    setPos((v) => Math.round(v))
  }

  const sideButton =
    'absolute top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/80 text-muted backdrop-blur transition-colors hover:border-muted hover:text-fg'

  return (
    <div className="mt-12 lg:hidden">
      <div className="relative">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Process steps"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') go(-1)
            if (e.key === 'ArrowRight') go(1)
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDragStart={(e) => e.preventDefault()}
          data-cursor="Drag"
          className={`relative h-[24rem] select-none overflow-hidden outline-none [perspective:1100px] [touch-action:pan-y] ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {steps.map((p, i) => {
            // Signed distance from the front, wrapped into [-n/2, n/2).
            const off = ((((i - pos) % n) + n + n / 2) % n) - n / 2
            const abs = Math.abs(off)
            return (
              <div
                key={p.step}
                aria-hidden={i !== active}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translateX(${off * 58}%) translateZ(${-abs * 160}px) rotateY(${off * -38}deg)`,
                  zIndex: 20 - Math.round(abs * 2),
                  // Only the card wrapping round the back is hidden; visible ones stay fully opaque.
                  opacity: abs > 1.5 ? 0 : 1,
                  transition: dragging ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                  pointerEvents: abs > 0.5 ? 'none' : 'auto',
                }}
              >
                <Card p={p} i={i} />
              </div>
            )
          })}
        </div>

        <button onClick={() => go(-1)} aria-label="Previous step" className={`${sideButton} left-0`}>
          <Arrow className="h-4 w-4 rotate-180" />
        </button>
        <button onClick={() => go(1)} aria-label="Next step" className={`${sideButton} right-0`}>
          <Arrow className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex justify-center">
        {steps.map((p, i) => (
          <button
            key={p.step}
            onClick={() => select(i)}
            aria-label={`Show step ${p.step}`}
            aria-current={i === active ? 'step' : undefined}
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
    </div>
  )
}

export default function ProcessCards({ steps }) {
  return (
    <>
      <Fan steps={steps} />
      <Carousel steps={steps} />
    </>
  )
}
