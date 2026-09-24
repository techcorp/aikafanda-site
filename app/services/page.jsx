import { Reveal, Counter, MaskedLines } from '@/components/Motion'
import ServiceFeature from '@/components/ServiceFeature'
import { Kicker, Check, ServiceIcon, CTABand } from '@/components/UI'
import { FAQ } from '@/components/Forms'
import { services, engagements, whyAi } from '@/data/services'
import { faqs } from '@/data/site'

const whatsappNumber = '923177416164'
const whatsappUrl = (message) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

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

      {/* engagements */}
      <section className="section !pt-0">
        <div className="shell">
          <Kicker>Engagements</Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-h1 text-fg">Three ways to work with us</h2>
          <p className="mt-4 max-w-prose text-body-md text-muted">
            Indicative starting points. Final quotes come after a 20-minute scoping call, and we tell
            you if the smaller option would do the job.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {engagements.map((e, i) => (
              <Reveal key={e.name} delay={i * 90}>
                <div
                  className={`card card-hover flex h-full flex-col p-7 ${
                    e.popular ? 'border-indigo/50 lg:-mt-4 lg:pb-11' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-h2 text-fg">{e.name}</h3>
                    {e.popular ? <span className="chip-signal">Most popular</span> : null}
                  </div>
                  <p className="mt-2 text-body-sm text-muted">{e.blurb}</p>
                  <p className="mt-6 font-display text-h1 text-indigo-soft">{e.price}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {e.features.map((f) => (
                      <li key={f} className="flex gap-3 text-body-sm text-fg/85">
                        <span className="mt-0.5 text-indigo-soft">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={whatsappUrl(
                      `Assalam-o-Alaikum, I am interested in the ${e.name} package. Please share more details.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${e.popular ? 'btn-signal' : 'btn-ghost'} mt-8`}
                  >
                    {e.cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
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
