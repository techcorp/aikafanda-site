import Link from 'next/link'
import { ProductGrid, FeaturedShowcase, IconCloud } from '@/components/Products'
import { Reveal, Counter, MaskedLines } from '@/components/Motion'
import { Kicker, Arrow, CTABand } from '@/components/UI'
import { apps, appCategories, featuredApps } from '@/data/apps'
import { site } from '@/data/site'

export const metadata = {
  title: 'Products',
  description:
    'Android apps designed, coded and shipped with AI — from an AI stylist and a receipt scanner to a Zakat calculator and a coin-merge puzzle.',
}

const headerStats = [
  { value: apps.length, suffix: '', label: 'Apps shipped' },
  { value: appCategories.length - 1, suffix: '', label: 'Categories' },
  { value: 100, suffix: '%', label: 'AI-built end to end' },
]

export default function ProductsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: apps.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: a.name,
        applicationCategory: 'MobileApplication',
        operatingSystem: 'Android',
        description: a.tagline,
        author: { '@type': 'Organization', name: site.name },
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40">
        <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-[-10%] h-[30rem] w-[30rem] animate-breathe rounded-full bg-indigo/25 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[-10%] h-72 w-72 rounded-full bg-amber/10 blur-[100px]"
        />

        <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <Reveal>
              <Kicker>Products</Kicker>
            </Reveal>
            <h1 className="mt-5 font-display text-hero text-fg">
              <MaskedLines lines={['Every app.', 'Built with AI.']} />
            </h1>
            <Reveal delay={200}>
              <p className="mt-5 max-w-xl text-body-lg text-muted">
                Every app below was designed, coded and shipped using AI-assisted development — from
                first prompt to Play Store listing.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
                {headerStats.map((s) => (
                  <div key={s.label} className="bg-surface/90 p-4 text-center backdrop-blur">
                    <p className="font-display text-h2 font-bold text-fg">
                      <Counter to={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1.5 font-mono text-kicker uppercase text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="mx-auto w-full max-w-sm pb-8 lg:max-w-md">
            <IconCloud />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="shell">
          <div className="mb-10">
            <Reveal>
              <Kicker tone="indigo">Flagship</Kicker>
            </Reveal>
            <h2 className="mt-4 font-display text-h1 text-fg">
              <MaskedLines lines={['Our most-loved builds']} />
            </h2>
          </div>
          <FeaturedShowcase apps={featuredApps} />
        </div>
      </section>

      <section className="pb-12 pt-10">
        <div className="shell">
          <div className="mb-8">
            <Reveal>
              <Kicker>The full catalogue</Kicker>
            </Reveal>
            <h2 className="mt-4 font-display text-h1 text-fg">
              <MaskedLines lines={['Browse every app']} />
            </h2>
          </div>
          <ProductGrid />
        </div>
      </section>

      <section className="pb-8">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-line bg-surface px-6 py-5 sm:flex-row sm:items-center">
              <p className="flex items-center gap-3 text-body-md text-fg">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] bg-amber/12 text-amber">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M9 1L2 9h4l-1 6 7-8H8l1-6z" />
                  </svg>
                </span>
                Built the same way we build for clients — AI-first, shipped fast.
              </p>
              <Link href="/services" className="link-arrow shrink-0">
                See our services <Arrow />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand
        kicker="Work with us"
        title="Want an app like these for your business?"
        body="From concept to Play Store in under 3 weeks. Talk directly to the people who write the code."
      />
    </>
  )
}
