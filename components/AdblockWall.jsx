'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Pages that stay locked while an ad blocker is on.
const LOCKED = [/^\/blog(\/|$)/]

// Our ad network script plus Google's, which every filter list blocks.
const PROBES = [
  'https://ss.mrmnd.com/interstitial.js',
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
]

const STEPS = {
  AdBlock: ['Click the AdBlock icon in your toolbar', 'Choose “Don’t run on pages on this site”', 'Hit the button below'],
  uBlock: ['Click the uBlock Origin icon', 'Press the big blue power button so it turns grey', 'Hit the button below'],
  Brave: ['Click the lion icon in the address bar', 'Switch Shields to “Down” for this site', 'Hit the button below'],
  Other: ['Open your blocker’s menu', 'Pause it or allowlist aikafanda.com', 'Hit the button below'],
}

function baitBlocked() {
  return new Promise((resolve) => {
    const bait = document.createElement('div')
    bait.className = 'adsbox ad-banner ad-placement pub_300x250 textads banner_ad'
    bait.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:2px;height:2px'
    bait.innerHTML = '&nbsp;'
    document.body.appendChild(bait)
    setTimeout(() => {
      const cs = getComputedStyle(bait)
      const hidden = !bait.isConnected || bait.offsetHeight === 0 || cs.display === 'none' || cs.visibility === 'hidden'
      bait.remove()
      resolve(hidden)
    }, 120)
  })
}

async function probeBlocked(url) {
  // An ad blocker cancels the request, which rejects even in no-cors mode.
  // One retry so a flaky connection isn't mistaken for a blocker.
  for (let i = 0; i < 2; i++) {
    try {
      await fetch(`${url}?_=${Date.now()}`, { mode: 'no-cors', cache: 'no-store' })
      return false
    } catch {}
  }
  return true
}

async function detect() {
  const results = await Promise.all([baitBlocked(), ...PROBES.map(probeBlocked)])
  return results.some(Boolean)
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="abw-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B7CF6" />
          <stop offset="1" stopColor="#FFB020" />
        </linearGradient>
      </defs>
      <path d="M32 5 9 14v16c0 14.5 9.8 25.4 23 29 13.2-3.6 23-14.5 23-29V14L32 5Z" fill="url(#abw-g)" opacity=".16" />
      <path d="M32 5 9 14v16c0 14.5 9.8 25.4 23 29 13.2-3.6 23-14.5 23-29V14L32 5Z" stroke="url(#abw-g)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 26l16 12M40 26 24 38" stroke="#FFB020" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export default function AdblockWall() {
  const pathname = usePathname() || ''
  const locked = LOCKED.some((re) => re.test(pathname))
  const [blocked, setBlocked] = useState(false)
  const [checking, setChecking] = useState(false)
  const [still, setStill] = useState(false)
  const [tab, setTab] = useState('AdBlock')
  const box = useRef(null)

  useEffect(() => {
    if (!locked) {
      setBlocked(false)
      return
    }
    let alive = true
    detect().then((b) => alive && setBlocked(b))
    return () => {
      alive = false
    }
  }, [locked, pathname])

  // Freeze the page underneath while the wall is up.
  useEffect(() => {
    if (!blocked) return
    const root = document.documentElement
    root.classList.add('adwall-on')
    const hold = setInterval(() => window.__lenis?.stop(), 500)
    window.__lenis?.stop()
    return () => {
      clearInterval(hold)
      root.classList.remove('adwall-on')
      window.__lenis?.start()
    }
  }, [blocked])

  // If someone deletes the wall in devtools, bring the page back to square one.
  useEffect(() => {
    if (!blocked) return
    const obs = new MutationObserver(() => {
      if (box.current && !box.current.isConnected) window.location.reload()
    })
    obs.observe(document.body, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [blocked])

  const recheck = useCallback(async () => {
    setChecking(true)
    setStill(false)
    const b = await detect()
    if (!b) {
      // ad scripts were blocked on first load, so reload to let them run
      window.location.reload()
      return
    }
    setChecking(false)
    setStill(true)
  }, [])

  if (!locked || !blocked) return null

  return (
    <div
      ref={box}
      role="dialog"
      aria-modal="true"
      aria-labelledby="abw-title"
      data-lenis-prevent
      className="adwall fixed inset-0 z-[9000] flex items-center justify-center overflow-y-auto bg-void/75 p-4 backdrop-blur-xl"
    >
      <div className="adwall-card relative w-full max-w-[460px] overflow-hidden rounded-3xl border border-line bg-surface/95 p-7 shadow-[0_30px_120px_-20px_rgba(108,92,231,0.55)] sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-indigo/35 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-44 w-44 rounded-full bg-amber/15 blur-3xl" />

        <div className="relative">
          <div className="adwall-icon mx-auto h-20 w-20">
            <ShieldIcon />
          </div>

          <p className="mt-5 text-center font-mono text-kicker uppercase tracking-[0.2em] text-amber">Ad blocker detected</p>
          <h2 id="abw-title" className="mt-2 text-center font-display text-h2 text-fg">
            Mind switching it off?
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-center text-body-sm text-muted">
            Every guide on this blog is free — a few ads are what keep it that way. Pause your blocker for{' '}
            <span className="text-fg">aikafanda.com</span> to keep reading.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-1.5" role="tablist" aria-label="Your ad blocker">
            {Object.keys(STEPS).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase transition-all duration-300 ${
                  tab === k ? 'border-indigo bg-indigo text-white' : 'border-line text-muted hover:border-muted hover:text-fg'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <ol key={tab} className="adwall-steps mt-5 space-y-2.5">
            {STEPS[tab].map((s, i) => (
              <li
                key={s}
                style={{ animationDelay: `${i * 70}ms` }}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/70 px-4 py-3 text-body-sm text-fg"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo/20 font-mono text-[11px] text-indigo-soft">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>

          <button type="button" onClick={recheck} disabled={checking} className="btn-signal mt-6 w-full justify-center disabled:opacity-70">
            {checking ? 'Checking…' : 'I’ve turned it off — reload'}
          </button>

          <p aria-live="polite" className={`mt-3 text-center text-[13px] ${still ? 'text-amber' : 'text-muted'}`}>
            {still ? 'Still blocked. Make sure it’s off for this site, then try again.' : 'Takes about five seconds.'}
          </p>

          <p className="mt-5 border-t border-line pt-4 text-center text-[13px] text-muted">
            Not here for the blog?{' '}
            <Link href="/" className="text-indigo-soft underline-offset-4 hover:underline">
              Back to the homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
