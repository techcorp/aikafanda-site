'use client'

import { useEffect } from 'react'

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Lenis inertia scrolling, loaded lazily so it never blocks first paint
 * and never runs for people who asked for reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return
    let lenis
    let frame

    ;(async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      const raf = (time) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
    })()

    return () => {
      cancelAnimationFrame(frame)
      lenis?.destroy()
    }
  }, [])

  return null
}
