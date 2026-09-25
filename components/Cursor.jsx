'use client'

import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], summary, label, select, [data-cursor]'
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, [contenteditable="true"]'

/**
 * Amber dot that sits exactly on the pointer + an indigo ring that trails it.
 * The ring swells over links/buttons and can show a word via data-cursor="Read".
 * Mouse-only: touch devices and reduced-motion users keep the native cursor.
 */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const root = document.documentElement
    root.classList.add('has-cursor')

    const pos = { x: -100, y: -100 }
    const lag = { x: -100, y: -100 }
    let raf = 0
    let visible = false

    const setState = (el) => {
      const r = ring.current
      if (!r) return
      const textEl = el?.closest?.(TEXT)
      const hit = !textEl && el?.closest?.(INTERACTIVE)
      const word = hit?.getAttribute?.('data-cursor') || ''
      r.dataset.state = textEl ? 'text' : word ? 'label' : hit ? 'hover' : ''
      if (label.current) label.current.textContent = word
    }

    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.18
      lag.y += (pos.y - lag.y) * 0.18
      ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`
      raf = Math.abs(pos.x - lag.x) + Math.abs(pos.y - lag.y) > 0.1 ? requestAnimationFrame(loop) : 0
    }

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (!visible) {
        visible = true
        lag.x = pos.x
        lag.y = pos.y
        root.classList.add('cursor-on')
      }
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onOver = (e) => setState(e.target)
    const onDown = () => ring.current?.classList.add('is-down')
    const onUp = () => ring.current?.classList.remove('is-down')
    const onLeave = () => {
      visible = false
      root.classList.remove('cursor-on')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor', 'cursor-on')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span className="cursor-ring-shape" />
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
