/* -------------------------------------------------------------- Marquee -- */

/**
 * Infinite marquee. The children are rendered `repeat` times side by side and
 * every copy slides by its own width (+ gap), so the loop is seamless no
 * matter how wide the content is. Pure CSS, works in server components.
 */
export function LoopMarquee({
  children,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  duration = 40,
  gap = '1rem',
  className = '',
  ariaLabel,
}) {
  return (
    <div
      role="marquee"
      aria-label={ariaLabel}
      className={`group flex overflow-hidden p-2 [gap:var(--gap)] ${vertical ? 'flex-col' : 'flex-row'} ${className}`}
      style={{ '--duration': `${duration}s`, '--gap': gap }}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={[
            'flex shrink-0 justify-around [gap:var(--gap)]',
            vertical ? 'animate-marquee-y flex-col' : 'animate-marquee-x flex-row',
            pauseOnHover ? 'group-hover:[animation-play-state:paused]' : '',
            reverse ? '[animation-direction:reverse]' : '',
          ].join(' ')}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- Card -- */

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber" aria-label="5 out of 5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialCard({ t }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col justify-between rounded-lg border border-line bg-surface p-5 transition-colors duration-300 hover:border-white/20 sm:w-[22rem] sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <Stars />
          <span
            className="rounded-[6px] border px-2 py-0.5 font-mono text-kicker uppercase"
            style={{ color: t.accent, borderColor: `${t.accent}55`, background: `${t.accent}14` }}
          >
            {t.project}
          </span>
        </div>
        <blockquote className="mt-4 text-body-md text-fg/90">&ldquo;{t.quote}&rdquo;</blockquote>
      </div>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-body-sm font-semibold text-void"
          style={{ background: t.accent }}
          aria-hidden="true"
        >
          {initials(t.name)}
        </span>
        <span>
          <span className="block text-body-sm font-medium text-fg">{t.name}</span>
          <span className="block text-body-sm text-muted">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  )
}

/* ------------------------------------------------------------- Section -- */

/** Two rows of testimonial cards drifting in opposite directions. */
export default function Testimonials({ items }) {
  const half = Math.ceil(items.length / 2)
  const rows = [items.slice(0, half), items.slice(half)]

  return (
    <div className="relative mt-10 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      {rows.map((row, r) => (
        <LoopMarquee
          key={r}
          reverse={r % 2 === 1}
          pauseOnHover
          repeat={3}
          duration={48 + r * 8}
          ariaLabel={r === 0 ? 'Client testimonials' : undefined}
        >
          {row.map((t) => (
            <TestimonialCard key={t.project} t={t} />
          ))}
        </LoopMarquee>
      ))}
    </div>
  )
}
