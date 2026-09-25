import { Reveal, Counter, MaskedLines } from '@/components/Motion'
import ServiceFeature from '@/components/ServiceFeature'
import { Kicker, Check, ServiceIcon, CTABand } from '@/components/UI'
import { FAQ } from '@/components/Forms'
import Link from 'next/link'
import { services, pricingFactors, quoteSteps, pricingPromises, whyAi } from '@/data/services'
import { faqs } from '@/data/site'

const whatsappNumber = '923177416164'
const whatsappUrl = (message) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

const factorPaths = {
  scope: <path d="M4 6h16M4 12h10M4 18h6" />,
  plug: <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v4" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  shield: <path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6L12 3zM9 12l2 2 4-4" />,
}

function FactorIcon({ name }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {factorPaths[name]}
    </svg>
  )
}

export const metadata = {
  title: 'Services',
  description:
    'AI-assisted website development, automation pipelines, chatbots and Android apps — designed, coded and shipped by an AI-first studio.',
}

export default function ServicesPage() {
  return (
    <>
      {/* header */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-40 left-1/3" aria-hidden="true">
          <div className="h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-indigo/20 blur-[120px] animate-breathe" />
        </div>
        <div
          className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-amber/[0.07] blur-[100px]"
          aria-hidden="true"
        />
        <div className="shell relative">
          <Reveal>
            <Kicker>Services</Kicker>
          </Reveal>
          <h1 className="mt-5 max-w-3xl font-display text-hero text-fg">
            <MaskedLines lines={['What we build,', 'and how fast.']} />
          </h1>
          <Reveal delay={200}>
            <p className="mt-5 max-w-2xl text-body-lg text-muted">
              Four things, done properly. Every engagement runs on the same AI-assisted pipeline we use
              for our own products — which is why we can quote in days instead of quarters.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={300 + i * 80}>
                <a
                  href={`#${s.slug}`}
                  className="svc-pill inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 py-2 pl-2 pr-4 text-body-sm text-fg/85 backdrop-blur"
                  style={{ '--accent': s.accent }}
                >
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full"
                    style={{ background: `${s.accent}26`, color: '#C6BFFF' }}
                  >
                    <ServiceIcon name={s.icon} className="h-4 w-4" />
                  </span>
                  {s.title.replace(/^AI(-Assisted)?\s/, '')}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* service blocks */}
      <section className="overflow-hidden pb-8">
        <div className="shell space-y-24 md:space-y-36">
          {services.map((s, i) => (
            <ServiceFeature key={s.slug} s={s} i={i} total={services.length} />
          ))}
        </div>
      </section>

      {/* why */}
      <section className="section">
        <div className="shell">
          <Kicker>Why AI-assisted</Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-h1 text-fg">
            The same work, minus the waiting
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
            {whyAi.map((w, i) => (
              <Reveal key={w.title} delay={i * 90} className="bg-surface p-7 transition-colors duration-500 hover:bg-surface-2">
                <p className="font-display text-[2.5rem] font-bold leading-none text-indigo-soft">
                  {w.stat.endsWith('x') ? (
                    <>
                      <Counter to={parseInt(w.stat)} />x
                    </>
                  ) : w.stat.endsWith('%') ? (
                    <>
                      <Counter to={parseInt(w.stat)} />%
                    </>
                  ) : (
                    w.stat
                  )}
                </p>
                <h3 className="mt-4 font-display text-h3 text-fg">{w.title}</h3>
                <p className="mt-2 text-body-sm text-muted">{w.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* pricing, explained — no public price list */}
      <section className="section !pt-0">
        <div className="shell">
          <Reveal>
            <Kicker>Pricing</Kicker>
          </Reveal>
          <h2 className="mt-4 max-w-2xl font-display text-h1 text-fg">
            <MaskedLines lines={['No price tags.', 'Just a fair, fixed quote.']} />
          </h2>
          <Reveal delay={150}>
            <p className="mt-4 max-w-prose text-body-md text-muted">
              Every project is different, so we don’t publish a rate card. We scope yours on a short call
              and send one clear number, in PKR or USD, before any work starts.
            </p>
          </Reveal>

          {/* what shapes a quote */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pricingFactors.map((f, i) => (
              <Reveal key={f.title} delay={i * 90} className="h-full">
                <div className="card card-hover group relative h-full overflow-hidden p-6">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-3 -top-5 font-display text-[5.5rem] font-bold leading-none text-fg/[0.04] transition-colors duration-500 group-hover:text-indigo/10"
                  >
                    0{i + 1}
                  </span>
                  <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-indigo/30 bg-indigo/10 text-indigo-soft transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg]">
                    <FactorIcon name={f.icon} />
                  </span>
                  <h3 className="relative mt-5 font-display text-h3 text-fg">{f.title}</h3>
                  <p className="relative mt-2 text-body-sm text-muted">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* how you get a number */}
          <Reveal delay={100}>
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-indigo/30 bg-surface p-7 md:p-10">
              <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-breathe rounded-full bg-indigo/20 blur-[100px]" />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-60 w-60 rounded-full bg-amber/10 blur-[90px]" />

              <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
                <div>
                  <p className="font-mono text-kicker uppercase text-amber">How you get a quote</p>
                  <ol className="mt-6 space-y-6">
                    {quoteSteps.map((s, i) => (
                      <li key={s.title} className="flex gap-4">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-indigo/40 bg-indigo/15 font-mono text-[13px] text-indigo-soft">
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="font-display text-h3 text-fg">{s.title}</h3>
                          <p className="mt-1 text-body-sm text-muted">{s.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-col justify-between gap-8 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
                  <ul className="space-y-3.5">
                    {pricingPromises.map((p) => (
                      <li key={p} className="flex gap-3 text-body-sm text-fg/90">
                        <span className="mt-0.5 text-amber">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/contact" className="btn-signal">
                      Get a free quote
                    </Link>
                    <a
                      href={whatsappUrl('Assalam-o-Alaikum, I would like a quote for a project.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      WhatsApp us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* faq */}
      <section className="section !pt-0">
        <div className="shell max-w-3xl">
          <Kicker>Questions</Kicker>
          <h2 className="mb-10 mt-4 font-display text-h1 text-fg">Before you ask</h2>
          <FAQ items={faqs} />
        </div>
      </section>

      <CTABand
        kicker="Next step"
        title="Tell us what you’re building."
        body="A 20-minute call is usually enough to scope the work and give you a number."
      />
    </>
  )
}
