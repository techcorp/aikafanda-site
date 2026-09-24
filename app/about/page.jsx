import { Reveal, Counter, MaskedLines } from '@/components/Motion'
import { Kicker, CTABand } from '@/components/UI'
import { OrbitHero, SpotCard, AiMethod, FounderPortrait, FounderTerminal, Timeline, StackMarquee } from '@/components/About'
import { site } from '@/data/site'
import { apps, appCategories } from '@/data/apps'

export const metadata = {
  title: 'About',
  description:
    'AI ka Fanda is an AI-first product studio from Okara, Pakistan, run by Hafiz Muhammad Anas — shipping Android apps and client products with AI.',
}

const howWeUseAi = [
  {
    title: 'Design with AI',
    icon: 'design',
    accent: '#FFB020',
    prompt: 'ai.design("store assets")',
    body: 'Layouts, design systems and store assets are generated first, then edited by hand until they stop looking generated.',
  },
  {
    title: 'Code with AI',
    icon: 'code',
    accent: '#8B7CF6',
    prompt: 'ai.code("tests + scaffold")',
    body: 'AI writes the scaffolding, the tests and the boilerplate. We own the architecture, the data model and every merge.',
  },
  {
    title: 'Ship with AI',
    icon: 'ship',
    accent: '#34D399',
    prompt: 'ai.ship("release notes")',
    body: 'Release notes, store listings, data-safety forms and QA checklists are drafted automatically and reviewed before they go out.',
  },
]

const milestones = [
  { year: '2024', title: 'Technical Corp registered', body: 'Started as a one-person Android shop building utilities for the Pakistani market.' },
  { year: '2025', title: 'First AI-built app ships', body: 'TermuXpert lands on Google Play — the first product built end to end with an AI-assisted pipeline.' },
  { year: '2025', title: 'The studio model', body: 'Client work begins alongside our own products: websites, automations and chatbots on the same stack.' },
  { year: '2026', title: 'A growing app portfolio', body: 'Products spanning AI tools, finance, Islamic utilities, education and games.' },
]

const stackRows = [
  [
    { n: 'Next.js', c: '#F4F4F6' },
    { n: 'React', c: '#61DAFB' },
    { n: 'Node.js', c: '#5FA04E' },
    { n: 'Flutter', c: '#42A5F5' },
    { n: 'Kotlin', c: '#A97BFF' },
    { n: 'Firebase', c: '#FFCA28' },
  ],
  [
    { n: 'Python', c: '#FFD43B' },
    { n: 'Claude', c: '#D97757' },
    { n: 'OpenAI', c: '#10A37F' },
    { n: 'Vercel', c: '#F4F4F6' },
    { n: 'Tailwind', c: '#38BDF8' },
    { n: 'Postgres', c: '#4F8FD8' },
  ],
]

const terminal = [
  { cmd: true, text: 'whoami' },
  { text: 'hafiz-muhammad-anas', color: '#C6BFFF' },
  { cmd: true, text: 'cat role.txt' },
  { text: 'Android dev → AI-first studio operator' },
  { cmd: true, text: 'ls ~/shipped | wc -l' },
  { text: String(apps.length), color: '#FFB020' },
  { cmd: true, text: 'echo $MOTTO' },
  { text: '"shipping beats planning"', color: '#34D399' },
]

const stats = [
  { v: apps.length, l: 'Apps shipped' },
  { v: appCategories.length - 1, l: 'Categories' },
  { v: 4, l: 'Service lines' },
  { v: 2024, l: 'Studio founded' },
]

export default function AboutPage() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40">
        <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-20 left-[-10%] h-[30rem] w-[30rem] animate-breathe rounded-full bg-indigo/20 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 right-[-10%] h-72 w-72 rounded-full bg-amber/10 blur-[100px]"
          aria-hidden="true"
        />
        <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal>
              <Kicker>About</Kicker>
            </Reveal>
            <h1 className="mt-5 max-w-3xl font-display text-hero text-fg">
              <MaskedLines lines={['We’re a small team', 'that ships like a big one.']} />
            </h1>
            <Reveal delay={200}>
              <p className="mt-6 max-w-2xl text-body-lg text-muted">
                AI ka Fanda is the studio arm of {site.legalName}, run out of {site.location}. We build our
                own Android products and take on client work using the same AI-assisted pipeline — which
                means we are testing our own tooling against real users every single week.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-2">
                {['AI-first', 'Android + Web', 'Client + own products'].map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="py-4">
            <OrbitHero />
          </div>
        </div>
      </section>

      {/* mission / vision */}
      <section className="pb-8">
        <div className="shell grid gap-6 md:grid-cols-2">
          <SpotCard kicker="Mission" word="WHY" icon="target" accent="#FFB020">
            Make high-craft software affordable for people who were previously priced out of it — small
            businesses, solo founders and local teams across Pakistan and beyond.
          </SpotCard>
          <SpotCard kicker="Vision" word="NEXT" icon="eye" accent="#8B7CF6" delay={120}>
            A studio where the gap between an idea and a live product is measured in days, and where AI
            handles the repetition so people can spend their attention on judgement.
          </SpotCard>
        </div>
      </section>

      {/* how we use ai */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <Kicker>Method</Kicker>
          </Reveal>
          <h2 className="mt-4 max-w-2xl font-display text-h1 text-fg">
            <MaskedLines lines={['How we actually use AI']} />
          </h2>
          <AiMethod steps={howWeUseAi} />
        </div>
      </section>

      {/* stats */}
      <section className="pb-8">
        <div className="shell grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 80}>
              <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:border-indigo/40">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-10 mx-auto h-20 w-3/4 rounded-full bg-indigo/0 blur-2xl transition-colors duration-500 group-hover:bg-indigo/30"
                />
                <p className="relative font-display text-[2rem] font-bold text-fg">
                  <Counter to={s.v} />
                </p>
                <p className="relative mt-2 font-mono text-kicker uppercase text-muted">{s.l}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 mx-auto h-px w-0 bg-gradient-to-r from-transparent via-indigo to-transparent transition-all duration-700 group-hover:w-full"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* founder */}
      <section className="section">
        <div className="shell grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <FounderPortrait name={site.founder} />
          <div>
            <Reveal>
              <Kicker tone="indigo">Meet the founder</Kicker>
            </Reveal>
            <h2 className="mt-4 font-display text-h1 text-fg">
              <MaskedLines lines={[site.founder]} />
            </h2>
            <Reveal delay={150}>
              <p className="mt-4 max-w-prose text-body-md text-muted">
                Android developer turned AI-first studio operator. A growing portfolio of published apps, a
                habit of rebuilding his own tooling, and a strong opinion that shipping beats planning.
              </p>
            </Reveal>
            <Reveal delay={250}>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${site.email}`} className="btn-ghost !py-2.5 !text-[13px]">
                  {site.email}
                </a>
                <a
                  href={site.playDeveloperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost !py-2.5 !text-[13px]"
                >
                  Play Store profile
                </a>
              </div>
            </Reveal>
            <div className="mt-10">
              <FounderTerminal lines={terminal} />
            </div>
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="section !pt-0">
        <div className="shell">
          <Reveal>
            <Kicker>Timeline</Kicker>
          </Reveal>
          <h2 className="mt-4 font-display text-h1 text-fg">
            <MaskedLines lines={['How we got here']} />
          </h2>
          <Timeline items={milestones} />
        </div>
      </section>

      {/* stack */}
      <section className="section !pt-0">
        <div className="shell">
          <Reveal>
            <Kicker>Stack</Kicker>
          </Reveal>
          <h2 className="mt-4 font-display text-h1 text-fg">
            <MaskedLines lines={['What we build with']} />
          </h2>
        </div>
        <div className="mx-auto max-w-shell md:px-8">
          <StackMarquee rows={stackRows} />
        </div>
      </section>

      <CTABand
        kicker="Say hello"
        title="Want to build something with us?"
        body="We take on a small number of projects at a time so each one gets proper attention."
      />
    </>
  )
}
