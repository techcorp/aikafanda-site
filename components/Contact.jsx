'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/components/Motion'
import { Check } from '@/components/UI'

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

function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }
  return { copied, copy }
}

const icons = {
  mail: <path d="M3 6.5A1.5 1.5 0 014.5 5h15A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11zM3.5 6l8.5 6.5L20.5 6" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  bolt: <path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 012-2h9" />
    </>
  ),
  send: <path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" />,
}

function Icon({ name, className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

/* ------------------------------------------------------------ LiveClock -- */

/** Current time in Okara (PKT), rendered after mount to avoid hydration drift. */
function useOkaraTime() {
  const [now, setNow] = useState(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 1000 * 15)
    return () => clearInterval(id)
  }, [])
  if (!now) return null
  const time = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour: 'numeric', minute: '2-digit' })
  const hour = Number(now.toLocaleString('en-US', { timeZone: 'Asia/Karachi', hour: 'numeric', hour12: false })) % 24
  return { time, awake: hour >= 9 && hour < 23 }
}

/* ---------------------------------------------------------- ContactInfo -- */

export function ContactInfo({ email, location }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.15 })
  const { copied, copy } = useCopy()
  const clock = useOkaraTime()

  const tiles = [
    {
      icon: 'mail',
      label: 'Email',
      accent: '#8B7CF6',
      body: (
        <div className="flex items-center justify-between gap-3">
          <a href={`mailto:${email}`} className="min-w-0 break-all text-body-md text-fg transition-colors hover:text-indigo-soft">
            {email}
          </a>
          <button
            type="button"
            onClick={() => copy(email)}
            className="relative grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line text-muted transition-colors hover:border-indigo/50 hover:text-fg"
            aria-label="Copy email address"
          >
            {copied ? <Check className="ct-pop h-3.5 w-3.5 text-emerald-400" /> : <Icon name="copy" className="h-3.5 w-3.5" />}
            <span className={`ct-toast pointer-events-none absolute -top-8 right-0 whitespace-nowrap rounded bg-fg px-2 py-1 font-mono text-[10px] text-void ${copied ? 'is-on' : ''}`}>
              Copied
            </span>
          </button>
        </div>
      ),
    },
    {
      icon: 'pin',
      label: 'Based in',
      accent: '#FFB020',
      body: (
        <div>
          <p className="text-body-md text-fg">{location}</p>
          <p className="mt-1 font-mono text-[11px] text-muted" suppressHydrationWarning>
            {clock ? (
              <>
                {clock.time} PKT ·{' '}
                <span className={clock.awake ? 'text-emerald-400' : 'text-muted'}>
                  {clock.awake ? 'we’re probably at the desk' : 'we’re asleep — reply by morning'}
                </span>
              </>
            ) : (
              'GMT+5'
            )}
          </p>
        </div>
      ),
    },
    {
      icon: 'clock',
      label: 'Response time',
      accent: '#34D399',
      body: (
        <div>
          <p className="text-body-md text-fg">Usually within 24 hours</p>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-line">
            <span className="ct-meter block h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber" />
          </div>
        </div>
      ),
    },
    {
      icon: 'bolt',
      label: 'Availability',
      accent: '#34D399',
      body: (
        <p className="flex items-center gap-2.5 text-body-md text-fg">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Taking projects for next month
        </p>
      ),
    },
  ]

  return (
    <div ref={ref} className={`ct-info mt-10 grid gap-3 sm:grid-cols-2 ${inView ? 'is-in' : ''}`}>
      {tiles.map((t, i) => (
        <InfoTile key={t.label} {...t} delay={i * 90} />
      ))}
    </div>
  )
}

function InfoTile({ icon, label, accent, body, delay }) {
  const spot = useSpot()
  return (
    <div
      ref={spot.ref}
      onPointerMove={spot.onPointerMove}
      className="ct-tile group relative overflow-hidden rounded-xl border border-line bg-surface p-4"
      style={{ '--d': `${delay}ms`, '--accent': accent }}
    >
      <div aria-hidden className="ct-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative">
        <p className="flex items-center gap-2 font-mono text-kicker uppercase text-muted">
          <span className="grid h-6 w-6 place-items-center rounded-md" style={{ color: accent, background: `${accent}1a` }}>
            <Icon name={icon} className="h-3.5 w-3.5" />
          </span>
          {label}
        </p>
        <div className="mt-3">{body}</div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- ContactForm -- */

const serviceOptions = ['Website', 'Automation', 'Chatbot', 'Mobile app', 'Something else']
const budgetOptions = ['Under $500', '$500 – $2,000', '$2,000 – $5,000', '$5,000+', 'Not sure yet']

function Label({ children, required }) {
  return (
    <span className="mb-2 block font-mono text-kicker uppercase text-muted">
      {children}
      {required ? <span className="text-amber"> *</span> : null}
    </span>
  )
}

function Pills({ name, options, value, onChange, tone }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((o) => {
        const on = value === o
        return (
          <label key={o} className={`ct-pill ct-pill-${tone} ${on ? 'is-on' : ''}`}>
            <input type="radio" name={name} value={o} checked={on} onChange={() => onChange(o)} className="sr-only" />
            <span className="ct-pill-check" aria-hidden="true">
              <Check className="h-3 w-3" />
            </span>
            {o}
          </label>
        )
      })}
    </div>
  )
}

export function ContactFormFx() {
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [message, setMessage] = useState('')
  const [service, setService] = useState(serviceOptions[0])
  const [budget, setBudget] = useState(budgetOptions[1])
  const [vals, setVals] = useState({ name: '', email: '', message: '' })
  const formRef = useRef(null)
  const wrap = useRef(null)
  const inView = useInView(wrap, { threshold: 0.1 })

  const set = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }))
  const done = [vals.name.trim(), /\S+@\S+\.\S+/.test(vals.email), vals.message.trim().length > 9].filter(Boolean).length
  const progress = Math.round((done / 3) * 100)

  async function onSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(formRef.current))

    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      setState('error')
      setMessage('Name, email and a message are needed before we can reply.')
      return
    }

    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Send failed')
      setState('sent')
    } catch (err) {
      setState('error')
      setMessage(err.message || 'That did not go through. Email us directly instead.')
    }
  }

  function reset() {
    setVals({ name: '', email: '', message: '' })
    setState('idle')
  }

  return (
    <div ref={wrap} className={`ct-form relative rounded-2xl p-px ${inView ? 'is-in' : ''}`}>
      <span className="ct-border pointer-events-none absolute inset-0 rounded-2xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-surface">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo/15 blur-3xl" />

        {/* title bar */}
        <div className="relative flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </span>
            <span className="font-mono text-[11px] text-muted">new-project.brief</span>
          </div>
          {state !== 'sent' && (
            <div className="flex items-center gap-2.5">
              <span className="hidden h-1 w-20 overflow-hidden rounded-full bg-line sm:block">
                <span className="block h-full rounded-full bg-gradient-to-r from-indigo to-amber transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </span>
              <span className="w-9 text-right font-mono text-[11px] tabular-nums text-muted">{progress}%</span>
            </div>
          )}
        </div>

        {state === 'sent' ? (
          <div className="relative flex min-h-[460px] flex-col items-center justify-center p-10 text-center">
            <span className="relative grid h-20 w-20 place-items-center">
              <span className="ct-ring absolute inset-0 rounded-full border border-emerald-400/50" />
              <span className="ct-ring absolute inset-0 rounded-full border border-emerald-400/50" style={{ animationDelay: '0.6s' }} />
              <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15">
                <svg className="h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path className="ct-draw" d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
            </span>
            <h3 className="mt-6 font-display text-h2 text-fg">Message sent</h3>
            <p className="mt-3 max-w-sm text-body-md text-muted">
              We read every message ourselves and reply within 24 hours. Check your inbox — and your spam
              folder, just in case.
            </p>
            <button onClick={reset} className="btn-ghost mt-7">
              Send another
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} className="relative p-5 md:p-8" noValidate>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="ct-f grid gap-5 sm:grid-cols-2" style={{ '--d': '100ms' }}>
              <label className="block">
                <Label required>Name</Label>
                <input className="field" name="name" required value={vals.name} onChange={set('name')} autoComplete="name" />
              </label>
              <label className="block">
                <Label required>Email</Label>
                <input className="field" type="email" name="email" required value={vals.email} onChange={set('email')} autoComplete="email" />
              </label>
            </div>

            <label className="ct-f mt-5 block" style={{ '--d': '180ms' }}>
              <Label>Company</Label>
              <input className="field" name="company" autoComplete="organization" />
            </label>

            <div className="ct-f mt-6" style={{ '--d': '260ms' }}>
              <Label>What do you need?</Label>
              <Pills name="service" options={serviceOptions} value={service} onChange={setService} tone="indigo" />
            </div>

            <div className="ct-f mt-6" style={{ '--d': '340ms' }}>
              <Label>Budget</Label>
              <Pills name="budget" options={budgetOptions} value={budget} onChange={setBudget} tone="amber" />
            </div>

            <label className="ct-f mt-6 block" style={{ '--d': '420ms' }}>
              <span className="flex items-baseline justify-between">
                <Label required>Message</Label>
                <span className="mb-2 font-mono text-[10px] tabular-nums text-muted/70">{vals.message.length} chars</span>
              </span>
              <textarea
                name="message"
                rows={5}
                required
                value={vals.message}
                onChange={set('message')}
                className="field resize-y"
                placeholder="What are you building, and when do you need it live?"
              />
            </label>

            {state === 'error' && (
              <p className="ct-shake mt-5 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-sm text-red-300">
                {message}
              </p>
            )}

            <div className="ct-f" style={{ '--d': '500ms' }}>
              <button type="submit" disabled={state === 'sending'} className="ct-send btn-signal group mt-6 w-full disabled:opacity-60">
                {state === 'sending' ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-void/30 border-t-void" />
                    Sending
                  </>
                ) : (
                  <>
                    Send message
                    <Icon name="send" className="ct-plane h-4 w-4" />
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-body-sm text-muted">We only use your details to reply. No lists, no sharing.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ NextSteps -- */

export function NextSteps({ steps }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.3 })
  return (
    <div ref={ref} className={`ct-steps relative mt-12 ${inView ? 'is-in' : ''}`}>
      {/* rail: vertical on mobile, horizontal on md+ */}
      <span aria-hidden className="absolute bottom-6 left-[1.1875rem] top-6 w-px bg-line md:bottom-auto md:left-[12.5%] md:right-[12.5%] md:top-[1.1875rem] md:h-px md:w-auto" />
      <span aria-hidden className="ct-rail absolute bottom-6 left-[1.1875rem] top-6 w-px md:bottom-auto md:left-[12.5%] md:right-[12.5%] md:top-[1.1875rem] md:h-px md:w-auto" />
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((s, i) => (
          <li key={s.title} className="ct-step flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center" style={{ '--d': `${200 + i * 260}ms` }}>
            <span className="ct-node relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface font-mono text-[12px] text-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="md:mt-5">
              <p className="font-mono text-kicker uppercase text-amber">{s.meta}</p>
              <h3 className="mt-1.5 font-display text-h3 text-fg">{s.title}</h3>
              <p className="mt-1.5 text-body-sm text-muted md:mx-auto md:max-w-[14rem]">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ----------------------------------------------------------- ContactFAQ -- */

export function ContactFAQ({ items }) {
  const [open, setOpen] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.15 })
  return (
    <div ref={ref} className={`ct-faq space-y-3 ${inView ? 'is-in' : ''}`}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className={`ct-qa rounded-xl border bg-surface ${isOpen ? 'is-open' : ''}`} style={{ '--d': `${i * 100}ms` }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6"
            >
              <span className="ct-qn font-mono text-[12px] text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 font-display text-h3 text-fg">{item.q}</span>
              <span className="ct-plus relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted" aria-hidden="true">
                <span className="absolute h-px w-3 bg-current" />
                <span className="ct-plus-v absolute h-3 w-px bg-current" />
              </span>
            </button>
            <div className="grid" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 420ms cubic-bezier(0.22,1,0.36,1)' }}>
              <div className="overflow-hidden">
                <p
                  className="max-w-prose px-5 pb-6 pl-[3.25rem] text-body-md text-muted md:px-6 md:pl-[3.5rem]"
                  style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 300ms ease 100ms' }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------ EmailBand -- */

export function EmailBand({ email }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.3 })
  const { copied, copy } = useCopy()
  const spot = useSpot()
  return (
    <div ref={ref} className={`ct-band ${inView ? 'is-in' : ''}`}>
      <div
        ref={spot.ref}
        onPointerMove={spot.onPointerMove}
        className="group relative overflow-hidden rounded-2xl border border-line bg-surface px-6 py-12 text-center md:px-12 md:py-16"
        style={{ '--accent': '#6C5CE7' }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div aria-hidden className="ct-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <p className="relative font-mono text-kicker uppercase text-muted">Prefer plain email?</p>
        <a
          href={`mailto:${email}`}
          className="ct-mail relative mt-4 inline-block break-all font-display text-[clamp(1.35rem,5vw,3.25rem)] font-bold leading-tight tracking-tight"
        >
          {email}
        </a>
        <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${email}`} className="btn-signal">
            Open mail app
          </a>
          <button type="button" onClick={() => copy(email)} className="btn-ghost min-w-[9.5rem]">
            {copied ? (
              <>
                <Check className="ct-pop h-3.5 w-3.5 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Icon name="copy" className="h-3.5 w-3.5" /> Copy address
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
