/* -------------------------------------------------------------- Marquee -- */

/**
 * Infinite marquee. The children are rendered `repeat` times back to back and
 * every copy slides by its own size (+ gap), so the loop is seamless no
 * matter how big the content is. Pure CSS, works in server components.
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
      className={`group flex overflow-hidden [gap:var(--gap)] ${vertical ? 'flex-col' : 'flex-row'} ${className}`}
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

export function TestimonialCard({ t }) {
  return (
    <figure className="w-44 rounded-md border border-line bg-surface/90 p-3 transition-colors duration-300 hover:border-white/20 sm:w-48">
      <figcaption className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-[0.625rem] font-semibold text-void"
          style={{ background: t.accent }}
          aria-hidden="true"
        >
          {initials(t.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.75rem] font-medium leading-tight text-fg">{t.name}</span>
          <span className="block truncate text-[0.6875rem] leading-tight text-muted">{t.role}</span>
        </span>
      </figcaption>
      <blockquote className="mt-2 text-[0.75rem] leading-snug text-fg/80">{t.quote}</blockquote>
      <p className="mt-2 font-mono text-[0.5625rem] uppercase tracking-wide" style={{ color: t.accent }}>
        {t.project}
      </p>
    </figure>
  )
}

/* ------------------------------------------------------------- Section -- */

/** Rotate the list so each column starts on a different card. */
function shift(items, n) {
  const k = n % items.length
  return [...items.slice(k), ...items.slice(0, k)]
}

/**
 * Vertical marquee columns on a tilted 3D plane, clipped inside a framed box
 * with soft fades on every edge.
 */
export default function Testimonials({ items, columns = 5 }) {
  const cols = Array.from({ length: columns }, (_, c) => shift(items, c * 2))

  return (
    <div className="relative flex h-[22rem] w-full items-center justify-center overflow-hidden rounded-xl border border-line bg-void [perspective:300px] sm:h-[26rem]">
      <div
        className="flex items-start gap-3"
        style={{ transform: 'translateX(-40px) translateZ(-90px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)' }}
      >
        {cols.map((col, c) => (
          <LoopMarquee
            key={c}
            vertical
            pauseOnHover
            reverse={c % 2 === 1}
            repeat={3}
            gap="0.75rem"
            duration={30 + (c % 3) * 6}
            ariaLabel={c === 0 ? 'Client testimonials' : undefined}
            className={`h-[40rem] ${c > 2 ? 'hidden sm:flex' : ''}`}
          >
            {col.map((t) => (
              <TestimonialCard key={t.project} t={t} />
            ))}
          </LoopMarquee>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-void" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-void" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-void" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-void" />
    </div>
  )
}
