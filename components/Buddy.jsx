'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Fandu — a little robot that lives in the corner, watches the cursor and
 * hands out XP, levels and badges for exploring the site. Progress lives in
 * localStorage, so it is per-browser and needs no backend.
 */

const KEY = 'fandu-v1'

const LEVELS = [
  [0, 'New face'],
  [60, 'Curious'],
  [150, 'Explorer'],
  [280, 'Insider'],
  [450, 'Fanda fan'],
  [700, 'AI wizard'],
  [1000, 'Legend'],
]

const BADGES = [
  { id: 'hello', icon: '👋', name: 'Hello there', hint: 'Meet Fandu', test: () => true },
  { id: 'explorer', icon: '🧭', name: 'Explorer', hint: 'Visit 5 pages', test: (s) => s.pages.length >= 5 },
  { id: 'reader', icon: '📖', name: 'Reader', hint: 'Finish a blog post', test: (s) => s.read.length >= 1 },
  { id: 'bookworm', icon: '🐛', name: 'Bookworm', hint: 'Finish 5 blog posts', test: (s) => s.read.length >= 5 },
  { id: 'friend', icon: '💜', name: 'Best friends', hint: 'Pet Fandu 20 times', test: (s) => s.pets >= 20 },
  { id: 'regular', icon: '🔥', name: 'Regular', hint: 'Visit 3 days in a row', test: (s) => s.streak >= 3 },
  { id: 'hi', icon: '✉️', name: 'Say hi', hint: 'Open the contact page', test: (s) => s.pages.includes('/contact') },
  { id: 'owl', icon: '🦉', name: 'Night owl', hint: 'Drop by after midnight', test: (s) => s.owl },
]

const PET_LINES = ['Hehe 💜', 'Beep boop, that tickles!', 'Again! Again!', 'You’re my favourite human.', '*happy robot noises*']
const BADGE_XP = 25
const PET_CAP = 10 // pets per day that still earn XP
const HOTSPOT_SELECTOR = '.btn-signal, .btn-primary, .btn-ghost, .link-arrow, [data-fandu-tip]'

function hotspotTip(target) {
  if (target.dataset.fanduTip) return target.dataset.fanduTip
  const href = target.getAttribute('href') || ''
  const label = (target.getAttribute('aria-label') || target.textContent || '').replace(/\s+/g, ' ').trim()
  if (href.includes('wa.me')) return 'This opens WhatsApp with a ready-to-send project message.'
  if (href.startsWith('mailto:')) return 'Prefer email? This opens a direct message to our team.'
  if (href.includes('play.google.com')) return 'Want to see it live? This opens the app on Google Play.'
  if (href.startsWith('/contact')) return 'Have an idea? Tell us about it and we’ll help shape the next step.'
  if (href.startsWith('/services')) return 'See what we can design, automate and ship for your business.'
  if (href.includes('ai-projects')) return 'These are real AI systems built for real operations.'
  if (href.startsWith('/products')) return 'Explore the apps and AI projects we have already shipped.'
  if (href.startsWith('/blog')) return 'Fresh AI ideas, practical guides and build notes live here.'
  return label ? `${label} — I can show you what’s behind this.` : 'This looks important — take a closer look.'
}

const fresh = () => ({
  xp: 0,
  pages: [],
  read: [],
  pets: 0,
  petDay: '',
  petToday: 0,
  day: '',
  streak: 0,
  badges: [],
  owl: false,
  hidden: false,
})

const dayKey = (d = new Date()) => d.toLocaleDateString('en-CA')
const yesterday = () => dayKey(new Date(Date.now() - 864e5))

function levelOf(xp) {
  let i = 0
  while (i < LEVELS.length - 1 && xp >= LEVELS[i + 1][0]) i++
  const [from, title] = LEVELS[i]
  const to = LEVELS[i + 1]?.[0]
  return { index: i, n: i + 1, title, from, to, pct: to ? (xp - from) / (to - from) : 1 }
}

let uid = 0
const nextId = () => ++uid

function Bot({ mood, lookRef }) {
  const eye = '#C6BFFF'
  return (
    <svg viewBox="0 0 80 84" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="fandu-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B7CF6" />
          <stop offset="1" stopColor="#FFB020" />
        </linearGradient>
        <radialGradient id="fandu-face" cx=".5" cy=".3" r=".85">
          <stop offset="0" stopColor="#221d3d" />
          <stop offset="1" stopColor="#0B0B0F" />
        </radialGradient>
      </defs>

      <ellipse className="fandu-shadow" cx="40" cy="80" rx="16" ry="3" fill="#6C5CE7" opacity=".45" />

      <g className="fandu-bob">
        <line x1="40" y1="8" x2="40" y2="16" stroke="#9A9AA6" strokeWidth="2" strokeLinecap="round" />
        <circle className="fandu-pulse" cx="40" cy="6" r="3.5" fill="#FFB020" />

        <rect x="9" y="30" width="6" height="14" rx="3" fill="#6C5CE7" />
        <rect x="65" y="30" width="6" height="14" rx="3" fill="#6C5CE7" />

        <rect x="27" y="57" width="26" height="16" rx="8" fill="#1B1B21" stroke="url(#fandu-rim)" strokeWidth="1.5" />
        <circle className="fandu-pulse" cx="40" cy="65" r="2.4" fill="#FFB020" />

        <rect x="13" y="16" width="54" height="42" rx="15" fill="#1B1B21" stroke="url(#fandu-rim)" strokeWidth="2" />
        <rect x="19" y="22" width="42" height="29" rx="10" fill="url(#fandu-face)" />

        <g ref={lookRef}>
          {mood === 'happy' ? (
            <g stroke={eye} strokeWidth="2.6" strokeLinecap="round" fill="none">
              <path d="M27 38q4-6 8 0" />
              <path d="M45 38q4-6 8 0" />
            </g>
          ) : mood === 'wow' ? (
            <g fill={eye}>
              <circle cx="31" cy="35" r="5" />
              <circle cx="49" cy="35" r="5" />
              <circle cx="32.6" cy="33.4" r="1.5" fill="#fff" />
              <circle cx="50.6" cy="33.4" r="1.5" fill="#fff" />
            </g>
          ) : mood === 'sleep' ? (
            <g stroke={eye} strokeWidth="2.4" strokeLinecap="round" opacity=".7">
              <path d="M27 37h8" />
              <path d="M45 37h8" />
            </g>
          ) : (
            <g className="fandu-blink">
              <rect x="27.5" y="30" width="7" height="10" rx="3.5" fill={eye} />
              <rect x="45.5" y="30" width="7" height="10" rx="3.5" fill={eye} />
              <circle cx="32.4" cy="32.2" r="1.2" fill="#fff" />
              <circle cx="50.4" cy="32.2" r="1.2" fill="#fff" />
            </g>
          )}

          {mood === 'wow' ? (
            <ellipse cx="40" cy="46" rx="2.6" ry="3" fill="#FFB020" />
          ) : mood === 'sleep' ? (
            <path d="M37 46h6" stroke="#9A9AA6" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path
              d={mood === 'happy' ? 'M35 44q5 5 10 0' : 'M36.5 45q3.5 2.6 7 0'}
              stroke="#FFB020"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        {mood === 'happy' || mood === 'wow' ? (
          <g fill="#FFB020" opacity=".35">
            <ellipse cx="24.5" cy="44" rx="3" ry="1.8" />
            <ellipse cx="55.5" cy="44" rx="3" ry="1.8" />
          </g>
        ) : null}
      </g>
    </svg>
  )
}

const CONFETTI = ['#6C5CE7', '#FFB020', '#C6BFFF', '#F4F4F6']

function Confetti() {
  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/3">
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2
        const r = 46 + (i % 3) * 14
        return (
          <span
            key={i}
            className="fandu-confetti absolute block h-1.5 w-1.5 rounded-[2px]"
            style={{
              background: CONFETTI[i % CONFETTI.length],
              '--x': `${Math.cos(a) * r}px`,
              '--y': `${Math.sin(a) * r - 20}px`,
              '--r': `${i * 47}deg`,
            }}
          />
        )
      })}
    </span>
  )
}

export default function Buddy() {
  const pathname = usePathname() || '/'
  const [save, setSave] = useState(null)
  const saveRef = useRef(null)
  const [mood, setMood] = useState('idle')
  const [open, setOpen] = useState(false)
  const [queue, setQueue] = useState([])
  const [bubble, setBubble] = useState(null)
  const [talking, setTalking] = useState(false)
  const [hearts, setHearts] = useState([])
  const [guideOffset, setGuideOffset] = useState({ x: 0, y: 0, side: 'left' })
  const wrap = useRef(null)
  const bot = useRef(null)
  const look = useRef(null)
  const guideReturn = useRef(null)

  // Runs a change against the save, then awards any badges / level-ups it unlocked.
  const apply = useCallback((fn) => {
    const prev = saveRef.current
    if (!prev) return
    const s = JSON.parse(JSON.stringify(prev))
    const notes = []
    const gain = (xp, text, silent) => {
      s.xp += xp
      if (!silent) notes.push({ id: nextId(), text: `+${xp} XP · ${text}` })
    }
    fn(s, gain, notes)
    for (const b of BADGES) {
      if (!s.badges.includes(b.id) && b.test(s)) {
        s.badges.push(b.id)
        s.xp += BADGE_XP
        notes.push({ id: nextId(), text: `Badge unlocked: ${b.name}`, icon: b.icon, big: true })
      }
    }
    const before = levelOf(prev.xp).index
    const after = levelOf(s.xp).index
    if (after > before) notes.push({ id: nextId(), text: `Level up! You’re now “${LEVELS[after][1]}”`, icon: '⭐', big: true })
    s.pages = s.pages.slice(-300)
    s.read = s.read.slice(-300)
    saveRef.current = s
    setSave(s)
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch {}
    if (notes.length) setQueue((q) => [...q, ...notes])
  }, [])

  // Load progress and count today's visit.
  useEffect(() => {
    let s = fresh()
    let first = true
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        s = { ...s, ...JSON.parse(raw) }
        first = false
      }
    } catch {}
    saveRef.current = s
    setSave(s)
    apply((s, gain, notes) => {
      if (first) notes.push({ id: nextId(), text: 'Hi, I’m Fandu! 👋 Explore the site to earn XP.' })
      const t = dayKey()
      if (s.day !== t) {
        s.streak = s.day === yesterday() ? s.streak + 1 : 1
        s.day = t
        gain(15, s.streak > 1 ? `${s.streak}-day streak 🔥` : first ? 'First visit' : 'Welcome back')
      }
      if (new Date().getHours() < 5) s.owl = true
    })
    // Hold the first bubbles until the page has settled.
    const t = setTimeout(() => setTalking(true), 2200)
    return () => clearTimeout(t)
  }, [apply])

  const ready = !!save

  // New page visited.
  useEffect(() => {
    if (!ready) return
    apply((s, gain) => {
      if (s.pages.includes(pathname)) return
      s.pages.push(pathname)
      if (s.pages.length > 1) gain(10, 'New page')
    })
  }, [pathname, ready, apply])

  // Offer one useful, contextual hint as each main homepage section comes into view.
  useEffect(() => {
    if (!ready || pathname !== '/') return
    const sections = Array.from(document.querySelectorAll('[data-fandu-message]'))
    if (!sections.length) return
    let seen = new Set()
    try {
      seen = new Set(JSON.parse(sessionStorage.getItem('fandu-sections') || '[]'))
    } catch {}
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const text = entry.target.dataset.fanduMessage
          if (!text || seen.has(text)) continue
          seen.add(text)
          try {
            sessionStorage.setItem('fandu-sections', JSON.stringify([...seen]))
          } catch {}
          setQueue((q) => [...q, { id: nextId(), text }])
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -12% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname, ready])

  // Finishing a blog post: near the bottom, and on the page long enough to have read something.
  useEffect(() => {
    if (!ready || !/^\/blog\/./.test(pathname) || saveRef.current.read.includes(pathname)) return
    const start = Date.now()
    let done = false
    const hint =
      saveRef.current.read.length < 3
        ? setTimeout(() => setQueue((q) => [...q, { id: nextId(), text: 'Read this one to the end for +30 XP 📖' }]), 5000)
        : null
    const onScroll = () => {
      if (done || Date.now() - start < 20000) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 400 && window.scrollY / max > 0.8) {
        done = true
        apply((s, gain) => {
          if (s.read.includes(pathname)) return
          s.read.push(pathname)
          gain(30, 'Post finished')
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(hint)
      window.removeEventListener('scroll', onScroll)
    }
  }, [pathname, ready, apply])

  // Speech bubbles, one at a time.
  useEffect(() => {
    if (!talking || open || bubble || !queue.length) return
    if (saveRef.current?.hidden) {
      setQueue([])
      return
    }
    const t = setTimeout(() => {
      const [next, ...rest] = queue
      setQueue(rest)
      setBubble(next)
      setMood(next.big ? 'wow' : 'happy')
    }, 350)
    return () => clearTimeout(t)
  }, [talking, open, bubble, queue])

  useEffect(() => {
    if (!bubble) return
    const t = setTimeout(() => {
      setBubble(null)
      setMood('idle')
    }, bubble.big ? 3600 : 2600)
    return () => clearTimeout(t)
  }, [bubble])

  // Dozes off when nobody is around; any activity wakes it.
  useEffect(() => {
    let t
    const wake = () => {
      clearTimeout(t)
      setMood((m) => (m === 'sleep' ? 'idle' : m))
      t = setTimeout(() => setMood((m) => (m === 'idle' ? 'sleep' : m)), 30000)
    }
    const evs = ['mousemove', 'scroll', 'keydown', 'touchstart']
    evs.forEach((e) => window.addEventListener(e, wake, { passive: true }))
    wake()
    return () => {
      clearTimeout(t)
      evs.forEach((e) => window.removeEventListener(e, wake))
    }
  }, [])

  // Eyes follow the pointer; the body leans with the scroll direction.
  useEffect(() => {
    if (!ready) return
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseQuery = window.matchMedia('(pointer: coarse)')
    let raf = 0
    let mx = 0
    let my = 0
    let lastY = window.scrollY
    let st
    let listening = false
    const follow = () => {
      raf = 0
      const el = bot.current
      const g = look.current
      if (!el || !g) return
      const r = el.getBoundingClientRect()
      const dx = mx - (r.left + r.width / 2)
      const dy = my - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 260)
      g.setAttribute('transform', `translate(${((dx / d) * 3.4 * k).toFixed(2)} ${((dy / d) * 2.6 * k).toFixed(2)})`)
    }
    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (!raf) raf = requestAnimationFrame(follow)
    }
    const onScroll = () => {
      const y = window.scrollY
      const el = bot.current
      if (el && Math.abs(y - lastY) > 2) el.dataset.scroll = y > lastY ? 'down' : 'up'
      lastY = y
      clearTimeout(st)
      st = setTimeout(() => el && delete el.dataset.scroll, 220)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      clearTimeout(st)
      if (!listening) return
      listening = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      if (look.current) look.current.removeAttribute('transform')
      if (bot.current) delete bot.current.dataset.scroll
    }
    const syncMotion = () => {
      if (reducedQuery.matches || coarseQuery.matches) {
        stop()
        return
      }
      if (listening) return
      listening = true
      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    reducedQuery.addEventListener('change', syncMotion)
    coarseQuery.addEventListener('change', syncMotion)
    syncMotion()
    return () => {
      stop()
      reducedQuery.removeEventListener('change', syncMotion)
      coarseQuery.removeEventListener('change', syncMotion)
    }
  }, [ready])

  // Jump beside important calls-to-action, explain them, then return home.
  // This reacts to pointer entry/focus only; it does not update on pointermove.
  useEffect(() => {
    if (!ready || open || saveRef.current?.hidden) return
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseQuery = window.matchMedia('(pointer: coarse)')
    let current = null

    const goHome = () => {
      current = null
      clearTimeout(guideReturn.current)
      setGuideOffset({ x: 0, y: 0, side: 'left' })
    }

    const visit = (target) => {
      if (!target || target === current || wrap.current?.contains(target)) return
      if (reducedQuery.matches || coarseQuery.matches) return
      current = target
      const targetRect = target.getBoundingClientRect()
      const petRect = bot.current?.getBoundingClientRect()
      if (!petRect || targetRect.width === 0 || targetRect.height === 0) return

      const margin = window.innerWidth >= 640 ? 24 : 16
      const gap = 18
      const petWidth = petRect.width
      const petHeight = petRect.height
      const homeLeft = window.innerWidth - margin - petWidth
      const homeTop = window.innerHeight - margin - petHeight
      const fitsRight = targetRect.right + gap + petWidth <= window.innerWidth - margin
      const wantedLeft = fitsRight ? targetRect.right + gap : targetRect.left - gap - petWidth
      const wantedTop = targetRect.top + targetRect.height / 2 - petHeight / 2
      const left = Math.max(margin, Math.min(window.innerWidth - margin - petWidth, wantedLeft))
      const top = Math.max(82, Math.min(window.innerHeight - margin - petHeight, wantedTop))

      setGuideOffset({ x: left - homeLeft, y: top - homeTop, side: left < 260 ? 'right' : 'left' })
      setQueue([])
      setBubble({ id: nextId(), text: hotspotTip(target), guide: true })
      setMood('happy')
      clearTimeout(guideReturn.current)
      guideReturn.current = setTimeout(goHome, 3000)
    }

    const onPointerOver = (event) => visit(event.target.closest?.(HOTSPOT_SELECTOR))
    const onFocusIn = (event) => visit(event.target.closest?.(HOTSPOT_SELECTOR))
    const onMotionChange = () => {
      if (reducedQuery.matches || coarseQuery.matches) goHome()
    }
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('focusin', onFocusIn)
    window.addEventListener('resize', goHome, { passive: true })
    reducedQuery.addEventListener('change', onMotionChange)
    coarseQuery.addEventListener('change', onMotionChange)
    return () => {
      clearTimeout(guideReturn.current)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('focusin', onFocusIn)
      window.removeEventListener('resize', goHome)
      reducedQuery.removeEventListener('change', onMotionChange)
      coarseQuery.removeEventListener('change', onMotionChange)
    }
  }, [ready, open])

  // Close the panel on Escape or a click elsewhere.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => wrap.current && !wrap.current.contains(e.target) && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const pet = () => {
    const burst = [0, 1, 2].map((i) => ({ id: nextId(), x: (i - 1) * 16 + Math.random() * 8, d: i * 90 }))
    setHearts((h) => [...h, ...burst])
    setTimeout(() => setHearts((h) => h.filter((x) => !burst.includes(x))), 1300)
    setMood('happy')
    setBubble(null)
    if (!open) setQueue((q) => [...q, { id: nextId(), text: PET_LINES[Math.floor(Math.random() * PET_LINES.length)] }])
    apply((s, gain) => {
      const t = dayKey()
      if (s.petDay !== t) {
        s.petDay = t
        s.petToday = 0
      }
      s.pets += 1
      s.petToday += 1
      if (s.petToday <= PET_CAP) gain(2, 'Pet', true)
    })
  }

  const setHidden = (hidden) => {
    setOpen(false)
    apply((s) => {
      s.hidden = hidden
    })
  }

  if (!save) return null

  const lvl = levelOf(save.xp)

  if (save.hidden) {
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        aria-label="Bring Fandu back"
        data-cursor="Hi"
        className="fandu fandu-tab fixed bottom-24 right-0 z-[45] h-12 w-11 rounded-l-2xl border border-r-0 border-line bg-surface/90 p-1.5 pl-2 shadow-lg backdrop-blur transition-all duration-300 hover:w-14"
      >
        <Bot mood="sleep" />
      </button>
    )
  }

  const locked = BADGES.filter((b) => !save.badges.includes(b.id))

  return (
    <div
      ref={wrap}
      className="fandu fandu-guide fixed bottom-4 right-4 z-[45] sm:bottom-6 sm:right-6"
      data-mood={mood}
      data-bubble-side={guideOffset.side}
      style={{ '--fandu-x': `${guideOffset.x}px`, '--fandu-y': `${guideOffset.y}px` }}
    >
      {open ? (
        <div
          role="dialog"
          aria-label="Fandu — your progress"
          data-lenis-prevent
          className="fandu-panel absolute bottom-full right-0 mb-3 max-h-[min(560px,calc(100vh-120px))] w-[min(330px,calc(100vw-32px))] overflow-y-auto rounded-3xl border border-line bg-surface/95 p-5 shadow-[0_24px_80px_-20px_rgba(108,92,231,0.6)] backdrop-blur-xl"
        >
          <div aria-hidden className="pointer-events-none absolute -top-16 right-0 h-32 w-48 rounded-full bg-indigo/25 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-kicker uppercase tracking-[0.18em] text-amber">Level {lvl.n}</p>
                <p className="mt-1 font-display text-h3 text-fg">{lvl.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-muted hover:text-fg"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-4">
              <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo to-amber transition-[width] duration-700 ease-out"
                  style={{ width: `${Math.max(4, lvl.pct * 100)}%` }}
                />
              </div>
              <p className="mt-1.5 flex justify-between font-mono text-[11px] text-muted">
                <span>{save.xp} XP</span>
                <span>{lvl.to ? `${lvl.to - save.xp} XP to level ${lvl.n + 1}` : 'Max level 🏆'}</span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ['Pages', save.pages.length],
                ['Posts read', save.read.length],
                ['Day streak', save.streak],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-line bg-surface-2/70 px-2 py-2.5">
                  <p className="font-display text-h3 text-fg">{v}</p>
                  <p className="font-mono text-[10px] uppercase text-muted">{k}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-muted">
              Badges · {save.badges.length}/{BADGES.length}
            </p>
            <ul className="mt-2 grid grid-cols-4 gap-2">
              {BADGES.map((b) => {
                const got = save.badges.includes(b.id)
                return (
                  <li
                    key={b.id}
                    title={got ? b.name : `Locked — ${b.hint}`}
                    className={`grid aspect-square place-items-center rounded-xl border text-xl transition-transform duration-300 hover:-translate-y-0.5 ${
                      got ? 'border-indigo/50 bg-indigo/15' : 'border-line bg-surface-2/50 opacity-40 grayscale'
                    }`}
                  >
                    <span aria-hidden>{b.icon}</span>
                    <span className="sr-only">{got ? b.name : `Locked: ${b.hint}`}</span>
                  </li>
                )
              })}
            </ul>

            {locked.length ? (
              <div className="mt-4 space-y-1.5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Next up</p>
                {locked.slice(0, 2).map((b) => (
                  <p key={b.id} className="flex items-center justify-between rounded-lg bg-surface-2/60 px-3 py-2 text-body-sm text-fg">
                    <span>
                      <span aria-hidden className="mr-2 opacity-60">{b.icon}</span>
                      {b.hint}
                    </span>
                    <span className="font-mono text-[11px] text-amber">+{BADGE_XP}</span>
                  </p>
                ))}
              </div>
            ) : null}

            <p className="mt-4 text-[12px] leading-relaxed text-muted">
              New page +10 · finished post +30 · daily visit +15 · pets +2
            </p>

            <div className="mt-4 grid gap-2">
              <Link href="/services" onClick={() => setOpen(false)} className="btn-ghost justify-between">
                Explore services <span aria-hidden>→</span>
              </Link>
              <Link href="/products#ai-projects" onClick={() => setOpen(false)} className="btn-ghost justify-between">
                View AI projects <span aria-hidden>→</span>
              </Link>
              <a
                href="https://wa.me/923177416164?text=Assalam-o-Alaikum%2C%20I%20would%20like%20to%20discuss%20an%20AI%20project%20with%20AI%20ka%20Fanda."
                target="_blank"
                rel="noreferrer"
                className="btn-signal justify-between"
              >
                Start a WhatsApp chat <span aria-hidden>↗</span>
              </a>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="button" onClick={pet} className="btn-signal flex-1 justify-center">
                Pet Fandu 💜
              </button>
              <button type="button" onClick={() => setHidden(true)} className="btn-ghost justify-center px-4">
                Hide
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative">
        {bubble && !open ? (
          <div
            key={`b${bubble.id}`}
            role="status"
            className={`fandu-bubble absolute bottom-full right-1 mb-2 w-max max-w-[230px] rounded-2xl rounded-br-md border px-3.5 py-2.5 text-body-sm shadow-xl ${
              bubble.big ? 'border-amber/50 bg-surface text-fg' : 'border-line bg-surface/95 text-fg'
            }`}
          >
            {bubble.icon ? <span className="mr-1.5">{bubble.icon}</span> : null}
            {bubble.text}
          </div>
        ) : null}

        {bubble?.big && !open ? <Confetti key={`c${bubble.id}`} /> : null}

        {hearts.map((h) => (
          <span
            key={`h${h.id}`}
            aria-hidden
            className="fandu-heart pointer-events-none absolute left-1/2 top-2 text-base"
            style={{ '--x': `${h.x}px`, animationDelay: `${h.d}ms` }}
          >
            💜
          </span>
        ))}

        {mood === 'sleep' ? (
          <span aria-hidden className="pointer-events-none absolute -top-3 right-0 font-mono text-[11px] text-indigo-soft">
            <span className="fandu-z">z</span>
            <span className="fandu-z" style={{ animationDelay: '0.8s' }}>z</span>
            <span className="fandu-z" style={{ animationDelay: '1.6s' }}>Z</span>
          </span>
        ) : null}

        <button
          ref={bot}
          type="button"
          onClick={() => {
            clearTimeout(guideReturn.current)
            setGuideOffset({ x: 0, y: 0, side: 'left' })
            setOpen((o) => !o)
          }}
          onDoubleClick={pet}
          aria-label={`Fandu, your site buddy — level ${lvl.n}. Open progress`}
          aria-expanded={open}
          data-cursor="Hi"
          className="fandu-bot relative block h-16 w-16 sm:h-[72px] sm:w-[72px]"
        >
          <span className="fandu-jump block h-full w-full">
            <Bot mood={mood} lookRef={look} />
          </span>
          <span className="absolute -left-1 top-1 rounded-full border border-indigo/60 bg-void px-1.5 py-px font-mono text-[10px] font-semibold text-indigo-soft shadow">
            01 · {lvl.n}
          </span>
        </button>
      </div>
    </div>
  )
}
