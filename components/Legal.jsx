import Link from 'next/link'
import { Reveal, MaskedLines } from '@/components/Motion'
import { Kicker } from '@/components/UI'
import { site } from '@/data/site'

/** Shared layout for the privacy policy and terms pages. */
export default function LegalPage({ title, updated, sections }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-24 left-[-10%] h-[28rem] w-[28rem] animate-breathe rounded-full bg-indigo/20 blur-[120px]"
        aria-hidden="true"
      />
      <div className="shell relative max-w-3xl">
        <Reveal>
          <p className="font-mono text-kicker uppercase text-muted">
            <Link href="/" className="transition-colors hover:text-fg">Home</Link> / {title}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-6">
            <Kicker>Legal</Kicker>
          </div>
        </Reveal>
        <h1 className="mt-5 font-display text-hero text-fg">
          <MaskedLines lines={[title]} />
        </h1>
        <Reveal delay={200}>
          <p className="mt-4 font-mono text-kicker uppercase text-muted">Last updated: {updated}</p>
        </Reveal>

        <div className="mt-12 space-y-4">
          {sections.map((s, i) => (
            <Reveal key={s.h} delay={i * 60}>
              <article className="rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur md:p-8">
                <h2 className="flex items-baseline gap-3 font-display text-h3 font-bold text-fg">
                  <span className="font-mono text-kicker text-amber">0{i + 1}</span>
                  {s.h}
                </h2>
                <p className="mt-3 text-body-md text-muted">{s.p}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-body-md text-muted">
            Questions? Email us at{' '}
            <a href={`mailto:${site.email}`} className="text-indigo-soft underline-offset-4 hover:underline">
              {site.email}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  )
}
