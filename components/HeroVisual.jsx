'use client'

import { useEffect, useRef } from 'react'

/*
 * Hero visual: a tilted 3D "studio" scene built from CSS layers.
 * An AI chip sits at the centre and powers four floating panels, one per
 * service (app, website, chatbot, automation). Layers sit at different
 * depths so the scene parallaxes as the pointer moves.
 * Everything is sized in `em`, and the stage font-size tracks the container
 * width, so the whole composition scales as one piece.
 */

function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0

    const tick = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el.style.setProperty('--ry', `${cx.toFixed(3)}deg`)
      el.style.setProperty('--rx', `${cy.toFixed(3)}deg`)
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.01 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      tx = nx * 14
      ty = -ny * 10
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [ref])
}

function Tag({ children, color = 'text-indigo-soft' }) {
  return <span className={`hv-tag font-mono uppercase ${color}`}>{children}</span>
}

export default function HeroVisual() {
  const ref = useRef(null)
  useTilt(ref)

  return (
    <div ref={ref} className="hv-wrap relative mx-auto w-[92%] max-w-[30rem] sm:w-full lg:mr-0" aria-hidden="true">
      <div className="hv-stage">
        {/* glowing platform */}
        <div className="hv-floor">
          <div className="hv-floor-grid" />
          <div className="hv-floor-ring hv-floor-ring--1" />
          <div className="hv-floor-ring hv-floor-ring--2" />
          <div className="hv-floor-ring hv-floor-ring--3" />
        </div>

        <div className="hv-scene">
          {/* data links from the core to each panel */}
          <svg className="hv-links" viewBox="0 0 560 450" fill="none">
            <defs>
              <linearGradient id="hv-link" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8B7CF6" />
                <stop offset="1" stopColor="#FFB020" />
              </linearGradient>
            </defs>
            <path d="M240 185 C 222 172, 212 166, 196 158" />
            <path d="M300 165 C 318 135, 352 115, 378 102" />
            <path d="M340 230 C 356 230, 372 232, 388 236" />
            <path d="M245 285 C 232 296, 214 304, 196 308" />
          </svg>

          {/* AI core chip */}
          <div className="hv-layer" style={{ left: '22em', top: '16.5em', '--z': '5em' }}>
            <div className="hv-core-halo" />
            <div className="hv-core-halo hv-core-halo--late" />
            <div className="hv-core">
              <span className="hv-pins hv-pins--t" />
              <span className="hv-pins hv-pins--b" />
              <span className="hv-pins hv-pins--l" />
              <span className="hv-pins hv-pins--r" />
              <div className="hv-core-inner">
                <img src="/logo-mark.webp" alt="" className="hv-core-logo" />
              </div>
            </div>
          </div>

          {/* website */}
          <div className="hv-layer" style={{ left: '0.5em', top: '2em', '--z': '-3em' }}>
            <div className="hv-float" style={{ '--fd': '0s' }}>
              <div className="hv-card hv-enter" style={{ '--d': '150ms', width: '21em' }}>
                <div className="hv-browser-bar">
                  <i style={{ background: '#FF5F57' }} />
                  <i style={{ background: '#FEBC2E' }} />
                  <i style={{ background: '#28C840' }} />
                  <span className="hv-url font-mono">aikafanda.com</span>
                </div>
                <div className="hv-site">
                  <div className="hv-site-hero">
                    <span className="hv-bar" style={{ width: '62%' }} />
                    <span className="hv-bar hv-bar--dim" style={{ width: '44%' }} />
                    <span className="hv-pill" />
                  </div>
                </div>
                <Tag>Website</Tag>
              </div>
            </div>
          </div>

          {/* chatbot */}
          <div className="hv-layer" style={{ left: '33.5em', top: '-1em', '--z': '6em' }}>
            <div className="hv-float" style={{ '--fd': '-3s' }}>
              <div className="hv-card hv-enter hv-chat" style={{ '--d': '300ms', width: '19em' }}>
                <div className="hv-msg hv-msg--me">Where&apos;s my order?</div>
                <div className="hv-msg hv-msg--bot">
                  <span className="hv-bot-dot" />
                  Shipped. Arriving Friday.
                </div>
                <Tag color="text-emerald-300">Chatbot</Tag>
              </div>
            </div>
          </div>

          {/* phone app */}
          <div className="hv-layer" style={{ left: '39em', top: '14em', '--z': '11em' }}>
            <div className="hv-float" style={{ '--fd': '-1.5s' }}>
              <div className="hv-phone hv-enter" style={{ '--d': '450ms' }}>
                <div className="hv-notch" />
                <div className="hv-app-head">
                  <img src="/apps/stylesnap-icon.png" alt="" className="hv-app-icon" />
                  <div className="hv-app-title">
                    <span className="hv-bar" style={{ width: '80%' }} />
                    <span className="hv-bar hv-bar--dim" style={{ width: '55%' }} />
                  </div>
                </div>
                <div className="hv-app-card" />
                <div className="hv-app-list">
                  <span className="hv-bar hv-bar--dim" style={{ width: '90%' }} />
                  <span className="hv-bar hv-bar--dim" style={{ width: '70%' }} />
                </div>
                <div className="hv-app-nav">
                  <i className="is-on" />
                  <i />
                  <i />
                </div>
                <Tag color="text-amber">App</Tag>
              </div>
            </div>
          </div>

          {/* automation flow */}
          <div className="hv-layer" style={{ left: '1em', top: '31em', '--z': '14em' }}>
            <div className="hv-float" style={{ '--fd': '-4.5s' }}>
              <div className="hv-card hv-enter" style={{ '--d': '600ms', width: '25em' }}>
                <div className="hv-flow">
                  <div className="hv-node">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="3" width="16" height="18" rx="2" />
                      <path d="M8 8h8M8 12h8M8 16h5" />
                    </svg>
                  </div>
                  <div className="hv-wire"><i /></div>
                  <div className="hv-node hv-node--ai">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
                      <path d="M18 16l.8 1.7 1.7.8-1.7.8L18 21l-.8-1.7-1.7-.8 1.7-.8z" />
                    </svg>
                  </div>
                  <div className="hv-wire"><i style={{ animationDelay: '-0.9s' }} /></div>
                  <div className="hv-node">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <path d="M3 10h18M9 10v10" />
                    </svg>
                  </div>
                </div>
                <div className="hv-flow-meta font-mono">
                  <span>lead → ai → sheet</span>
                  <span className="text-emerald-400">● running</span>
                </div>
                <Tag color="text-sky-300 hv-tag--left">Automation</Tag>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
