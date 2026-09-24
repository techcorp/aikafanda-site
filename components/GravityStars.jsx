'use client'

import { useEffect, useRef } from 'react'

/*
 * Adapted from animate-ui's GravityStarsBackground (backgrounds/gravity-stars).
 * Same particle model (drift, mouse attract/repel, eased glow, optional bounce),
 * reworked for a single fixed viewport layer:
 *  - pointer is tracked at window level, the layer never receives events
 *  - all state lives in refs; nothing re-renders after mount
 *  - glow is a pre-rendered sprite instead of per-star shadowBlur
 *  - DPR capped, loop paused while the tab is hidden
 *  - reduced motion draws one static frame; coarse pointers get no gravity
 */

const PALETTE = [
  { rgb: '198, 191, 255', weight: 0.55 }, // indigo-soft
  { rgb: '125, 111, 240', weight: 0.3 }, // indigo-hi
  { rgb: '255, 189, 88', weight: 0.15 }, // amber-soft
]
const MAX_DPR = 1.5
const OFFSCREEN = -9999
const TRAIL_MAX = 140
const TRAIL_SPACING = 9 // px of pointer travel per spawned sparkle

function pickColor() {
  let r = Math.random()
  for (let i = 0; i < PALETTE.length; i++) {
    r -= PALETTE[i].weight
    if (r <= 0) return i
  }
  return 0
}

function makeSprite(rgb, radius, dpr) {
  const size = Math.ceil(radius * 2 * dpr)
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')
  const c = size / 2
  const g = ctx.createRadialGradient(c, c, 0, c, c, c)
  g.addColorStop(0, `rgba(${rgb}, 0.9)`)
  g.addColorStop(0.12, `rgba(${rgb}, 0.45)`)
  g.addColorStop(0.4, `rgba(${rgb}, 0.1)`)
  g.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return sprite
}

export default function GravityStarsBackground({
  starsCount = 75,
  starsSize = 2,
  starsOpacity = 0.75,
  glowIntensity = 15,
  movementSpeed = 0.3,
  mouseInfluence = 100,
  mouseGravity = 'attract',
  gravityStrength = 75,
  starsInteraction = false,
  cursorTrail = false,
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseQuery = window.matchMedia('(pointer: coarse)')

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let last = 0
    let sprites = []
    let stars = []
    const trail = []
    let trailCarry = 0
    const mouse = { x: OFFSCREEN, y: OFFSCREEN }
    const glowRadius = glowIntensity * 2

    const isReduced = () => reducedQuery.matches
    const isCoarse = () => coarseQuery.matches

    const initStars = () => {
      const speedScale = isCoarse() ? 0.5 : 1
      stars = Array.from({ length: starsCount }, () => {
        const angle = Math.random() * Math.PI * 2
        const speed = movementSpeed * speedScale * (0.5 + Math.random() * 0.5)
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * starsSize + 0.6,
          opacity: starsOpacity,
          baseOpacity: starsOpacity * (0.6 + Math.random() * 0.4),
          mass: Math.random() * 0.5 + 0.5,
          glow: 1,
          color: pickColor(),
        }
      })
    }

    const resize = () => {
      const nextW = document.documentElement.clientWidth || window.innerWidth
      const nextH = document.documentElement.clientHeight || window.innerHeight
      const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      if (stars.length && width && height) {
        const sx = nextW / width
        const sy = nextH / height
        for (const p of stars) {
          p.x *= sx
          p.y *= sy
        }
      }
      width = nextW
      height = nextH
      canvas.width = Math.max(1, Math.floor(width * nextDpr))
      canvas.height = Math.max(1, Math.floor(height * nextDpr))
      if (nextDpr !== dpr || !sprites.length) {
        dpr = nextDpr
        sprites = PALETTE.map((c) => makeSprite(c.rgb, glowRadius, dpr))
      }
      if (!stars.length) initStars()
    }

    const update = (step) => {
      const gravityOn = !isCoarse()
      const g0 = gravityStrength * 0.001

      for (let i = 0; i < stars.length; i++) {
        const p = stars[i]
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = gravityOn ? Math.hypot(dx, dy) : Infinity

        if (dist < mouseInfluence && dist > 0) {
          const force = (mouseInfluence - dist) / mouseInfluence
          const g = force * g0 * step
          const dir = mouseGravity === 'repel' ? -1 : 1
          p.vx += (dx / dist) * g * dir
          p.vy += (dy / dist) * g * dir
          p.opacity = Math.min(1, p.baseOpacity + force * 0.4)
          p.glow += (1 + force * 2 - p.glow) * Math.min(1, 0.15 * step)
        } else {
          p.opacity = Math.max(p.baseOpacity * 0.3, p.opacity - 0.02 * step)
          p.glow = Math.max(1, p.glow + (1 - p.glow) * Math.min(1, 0.08 * step))
        }

        if (starsInteraction) {
          for (let j = i + 1; j < stars.length; j++) {
            const o = stars[j]
            const dx2 = o.x - p.x
            const dy2 = o.y - p.y
            const d = Math.hypot(dx2, dy2)
            const minD = p.size + o.size + 5
            if (d < minD && d > 0) {
              const nx = dx2 / d
              const ny = dy2 / d
              const speed = (p.vx - o.vx) * nx + (p.vy - o.vy) * ny
              if (speed < 0) continue
              const impulse = (2 * speed) / (p.mass + o.mass)
              p.vx -= impulse * o.mass * nx
              p.vy -= impulse * o.mass * ny
              o.vx += impulse * p.mass * nx
              o.vy += impulse * p.mass * ny
            }
          }
        }

        p.x += p.vx * step
        p.y += p.vy * step
        p.vx += (Math.random() - 0.5) * 0.001 * step
        p.vy += (Math.random() - 0.5) * 0.001 * step
        const damp = Math.pow(0.999, step)
        p.vx *= damp
        p.vy *= damp

        // Pull back toward base drift speed so stars don't stay slingshot fast.
        const spd = Math.hypot(p.vx, p.vy)
        const cap = movementSpeed * 6
        if (spd > cap) {
          p.vx *= cap / spd
          p.vy *= cap / spd
        }

        if (p.x < 0) p.x = width
        else if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        else if (p.y > height) p.y = 0
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i]
        t.life -= step / t.ttl
        if (t.life <= 0) {
          trail[i] = trail[trail.length - 1]
          trail.pop()
          continue
        }
        t.x += t.vx * step
        t.y += t.vy * step
        const damp = Math.pow(0.96, step)
        t.vx *= damp
        t.vy *= damp
      }
    }

    const spawnSparkle = (x, y) => {
      if (trail.length >= TRAIL_MAX) trail.shift()
      const angle = Math.random() * Math.PI * 2
      const speed = 0.2 + Math.random() * 0.6
      const r = Math.random() * 10
      trail.push({
        x: x + Math.cos(angle) * r,
        y: y + Math.sin(angle) * r,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * starsSize + 0.8,
        ttl: 40 + Math.random() * 40, // frames at 60fps
        life: 1,
        color: pickColor(),
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of stars) {
        const x = p.x * dpr
        const y = p.y * dpr
        const sprite = sprites[p.color]
        const r = glowRadius * dpr * (0.55 + p.glow * 0.45) * (p.size / (starsSize + 0.6))
        ctx.globalAlpha = p.opacity * 0.6
        ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = `rgb(${PALETTE[p.color].rgb})`
        ctx.beginPath()
        ctx.arc(x, y, p.size * dpr * 0.6, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const t of trail) {
        const x = t.x * dpr
        const y = t.y * dpr
        const fade = t.life * t.life
        const r = glowRadius * dpr * 0.5 * (0.4 + t.life * 0.6)
        ctx.globalAlpha = fade * 0.7
        ctx.drawImage(sprites[t.color], x - r, y - r, r * 2, r * 2)
        ctx.globalAlpha = fade
        ctx.fillStyle = `rgb(${PALETTE[t.color].rgb})`
        ctx.beginPath()
        ctx.arc(x, y, t.size * dpr * 0.6 * (0.5 + t.life * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const tick = (now) => {
      const step = last ? Math.min(3, (now - last) / 16.667) : 1
      last = now
      update(step)
      draw()
      frame = requestAnimationFrame(tick)
    }

    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      last = 0
    }

    const start = () => {
      if (frame || isReduced() || document.hidden) return
      frame = requestAnimationFrame(tick)
    }

    const onResize = () => {
      resize()
      if (isReduced()) draw()
    }

    const onPointerMove = (e) => {
      if (e.pointerType !== 'mouse') return
      const x = e.clientX
      const y = e.clientY
      if (cursorTrail && frame && mouse.x !== OFFSCREEN) {
        const dx = x - mouse.x
        const dy = y - mouse.y
        trailCarry += Math.hypot(dx, dy)
        const n = Math.min(6, Math.floor(trailCarry / TRAIL_SPACING))
        trailCarry -= n * TRAIL_SPACING
        if (n === 6) trailCarry = 0 // big jump: don't bank the remainder
        for (let i = 1; i <= n; i++) {
          const f = i / n
          spawnSparkle(mouse.x + dx * f, mouse.y + dy * f)
        }
      }
      mouse.x = x
      mouse.y = y
    }

    const onPointerOut = (e) => {
      if (!e.relatedTarget) {
        mouse.x = OFFSCREEN
        mouse.y = OFFSCREEN
        trailCarry = 0
      }
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    const onReducedChange = () => {
      if (isReduced()) {
        stop()
        draw()
      } else start()
    }

    resize()
    draw()
    start()

    // Layer size changes (scrollbar toggles, emulated viewports) don't always fire `resize`.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    ro?.observe(canvas)
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('visibilitychange', onVisibility)
    reducedQuery.addEventListener?.('change', onReducedChange)

    return () => {
      stop()
      ro?.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('visibilitychange', onVisibility)
      reducedQuery.removeEventListener?.('change', onReducedChange)
    }
  }, [starsCount, starsSize, starsOpacity, glowIntensity, movementSpeed, mouseInfluence, mouseGravity, gravityStrength, starsInteraction, cursorTrail])

  return (
    <div
      aria-hidden="true"
      data-slot="gravity-stars-background"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
