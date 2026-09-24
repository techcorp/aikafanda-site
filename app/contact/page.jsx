import { Reveal, MaskedLines } from '@/components/Motion'
import { Kicker } from '@/components/UI'
import { ContactInfo, ContactFormFx, NextSteps, ContactFAQ, EmailBand } from '@/components/Contact'
import { site } from '@/data/site'

export const metadata = {
  title: 'Contact',
  description: 'Tell us what you are building. We reply within 24 hours.',
}

const steps = [
  { meta: 'Today', title: 'Send the brief', body: 'A few lines on what you are building and when it needs to be live.' },
  { meta: '< 24 hours', title: 'We reply', body: 'A real person reads it and answers — no autoresponder, no sales script.' },
  { meta: '20 minutes', title: 'Quick call', body: 'We scope the work together and flag anything risky early.' },
  { meta: 'Fixed quote', title: 'We start', body: 'You get a clear number and timeline, then we get building.' },
]

const contactFaqs = [
  {
    q: 'What happens after I send this?',
    a: 'One of us reads it, replies within 24 hours, and if it looks like a fit we book a 20-minute call to scope the work and give you a number.',
  },
  {
    q: 'Do you work with clients outside Pakistan?',
    a: 'Yes — most of our client work is remote. We invoice in USD via Wise or Payoneer and work across UK, Gulf and US time zones.',
  },
  {
    q: 'Can you sign an NDA?',
    a: 'Yes. Send yours over, or we can provide a standard mutual NDA before you share anything sensitive.',
  },
]

export default function ContactPage() {
  return (
    <>
      {/* hero + form */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40">
        <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-24 left-[-10%] h-[28rem] w-[28rem] animate-breathe rounded-full bg-indigo/20 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-10 right-[-8%] h-72 w-72 rounded-full bg-amber/10 blur-[100px]"
          aria-hidden="true"
        />
        <div className="shell relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal>
              <Kicker>Contact</Kicker>
            </Reveal>
            <h1 className="mt-5 font-display text-hero text-fg">
              <MaskedLines lines={['Let’s build', 'something.']} />
            </h1>
            <Reveal delay={200}>
              <p className="mt-5 max-w-md text-body-lg text-muted">
                Tell us what you need and roughly when you need it live. If we are not the right fit, we
                will say so and point you somewhere better.
              </p>
            </Reveal>
            <ContactInfo email={site.email} location={site.location} />
          </div>

          <ContactFormFx />
        </div>
      </section>

      {/* what happens next */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <Kicker tone="indigo">Process</Kicker>
          </Reveal>
          <h2 className="mt-4 max-w-2xl font-display text-h1 text-fg">
            <MaskedLines lines={['What happens next']} />
          </h2>
          <NextSteps steps={steps} />
        </div>
      </section>

      {/* faq */}
      <section className="section !pt-0">
        <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Reveal>
              <Kicker>Questions</Kicker>
            </Reveal>
            <h2 className="mt-4 font-display text-h1 text-fg">
              <MaskedLines lines={['Good to know']} />
            </h2>
            <Reveal delay={150}>
              <p className="mt-4 max-w-sm text-body-md text-muted">
                The things people usually ask before hitting send.
              </p>
            </Reveal>
          </div>
          <ContactFAQ items={contactFaqs} />
        </div>
      </section>

      {/* email band */}
      <section className="section !pt-0">
        <div className="shell">
          <EmailBand email={site.email} />
        </div>
      </section>
    </>
  )
}
