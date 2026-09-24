import Link from 'next/link'

/** The monospace `// LABEL` eyebrow used across the design system. */
export function Kicker({ children, tone = 'amber', className = '' }) {
  const tones = {
    amber: 'text-amber border-amber/30 bg-amber/10',
    indigo: 'text-indigo-soft border-indigo/30 bg-indigo/10',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-1 font-mono text-kicker uppercase ${tones[tone]} ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}

export function SectionHead({ kicker, title, body, action, className = '' }) {
  return (
    <div className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-2xl">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <h2 className="mt-4 font-display text-h1 text-fg">{title}</h2>
        {body ? <p className="mt-4 max-w-prose text-body-md text-muted">{body}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function Arrow({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Check({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PlayGlyph({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.6 1.8a1.6 1.6 0 00-.6 1.3v17.8c0 .5.2 1 .6 1.3l11-10.2-11-10.2zM16.1 13.6l2.9 2.7 3.3-1.9c.9-.5.9-1.9 0-2.4l-3.3-1.9-2.9 2.7v.8zM4.6 22.6l9.9-9.2 2.2 2-12.1 7.2zM16.7 9.6l-2.2 2-9.9-9.2 12.1 7.2z" />
    </svg>
  )
}

export function ServiceIcon({ name, className = 'h-5 w-5' }) {
  const paths = {
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
      </>
    ),
    workflow: (
      <>
        <rect x="3" y="3" width="7" height="6" rx="1.5" />
        <rect x="14" y="15" width="7" height="6" rx="1.5" />
        <path d="M6.5 9v5a4 4 0 004 4h3.5" />
      </>
    ),
    chat: (
      <>
        <path d="M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z" />
        <path d="M9 11h6M9 15h3" />
      </>
    ),
    phone: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="2.5" />
        <path d="M10.5 18.5h3" />
      </>
    ),
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.globe}
    </svg>
  )
}

/**
 * App icon with a graceful fallback: if the Play CDN URL hasn't been filled
 * in yet, we draw a monogram tile in the app's accent colour instead of a
 * broken image.
 */
export function AppIcon({ app, size = 56, className = '' }) {
  if (app.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={app.icon}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className={`rounded-md border border-line bg-surface object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }
  const initials = app.short.replace(/[^A-Za-z ]/g, '').slice(0, 2).toUpperCase()
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-md border border-line font-display font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(145deg, ${app.accent}, ${app.accent}55)`,
      }}
    >
      {initials}
    </span>
  )
}

/** Feature graphic with the same fallback treatment. */
export function AppBanner({ app, className = '' }) {
  if (app.banner) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={app.banner}
        alt=""
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 20% 10%, ${app.accent}40 0%, transparent 60%), linear-gradient(160deg, #1B1B21, #0B0B0F)`,
      }}
    />
  )
}

export function CTABand({
  kicker = 'Work with us',
  title = 'Have an idea? Let’s ship it.',
  body = 'Go from concept to production-ready software in days. No bloated agencies, no endless sprints, just pure engineering craft.',
}) {
  return (
    <section className="section">
      <div className="shell">
        <div className="noise relative overflow-hidden rounded-xl border border-indigo/25 bg-gradient-to-b from-indigo/[0.14] to-surface px-6 py-14 text-center md:px-16 md:py-20">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-indigo/25 blur-[100px] animate-breathe" />
          <div className="relative">
            <Kicker>{kicker}</Kicker>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-h1 text-fg">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-body-md text-muted">{body}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="btn-signal w-full sm:w-auto">
                Start a project
              </Link>
              <a href={`mailto:${'support@aikafanda.com'}`} className="btn-ghost w-full sm:w-auto">
                Email us directly
              </a>
            </div>
            <p className="mt-6 break-words font-mono text-kicker uppercase text-muted">
              Or reach founders directly at support@aikafanda.com
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
