import Link from 'next/link'
import Hero from '@/components/Hero'
import { Marquee, Reveal, Counter } from '@/components/Motion'
import { SectionHead, Kicker, Arrow, CTABand } from '@/components/UI'
import ScrollShowcase from '@/components/ScrollShowcase'
import AppCarousel from '@/components/AppCarousel'
import ProcessCards from '@/components/ProcessCards'
import { stats, marqueeItems, processSteps } from '@/data/site'
import { services } from '@/data/services'
import { apps } from '@/data/apps'
import { getPosts, formatDate } from '@/lib/blogger'

export const revalidate = 600

export default async function HomePage() {
  const { posts } = await getPosts({ maxResults: 3 })

  return (
    <>
      <Hero />

      <Marquee items={marqueeItems} />

      {/* stats */}
      <section className="section !py-14 md:!py-16">
        <div className="shell">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className="bg-surface p-5 sm:p-6">
                <p className="font-display text-[2rem] font-bold leading-none text-fg sm:text-[2.5rem]">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-body-md font-medium text-fg">{s.label}</p>
                <p className="mt-1 text-body-sm text-muted">{s.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* services */}
      <section className="section !pb-0">
        <div className="shell">
          <SectionHead
            kicker="Services"
            title="Engineered with speed. Built with AI."
            body="We replace bloated dev agencies with lean, AI-pair workflows that turn specifications into robust production software in record time."
          />

        </div>
      </section>

      <ScrollShowcase items={services} variant="services" />

      {/* products */}
      <section className="section">
        <div className="shell">
          <SectionHead
            kicker="Portfolio"
            title="Our products"
            body="Android apps designed and coded with AI — solving tangible real-world problems."
            action={
              <Link href="/products" className="btn-ghost">
                Explore all apps
              </Link>
            }
          />
          <div className="mt-14">
            <AppCarousel apps={apps} />
          </div>
        </div>
      </section>

      {/* process */}
      <section className="section">
        <div className="shell">
          <SectionHead
            kicker="Methodology"
            title="From prompt to production"
            body="How our deterministic vibe-coding stack cuts development timelines by 90% without sacrificing code craft or architecture sanity."
          />

          <ProcessCards steps={processSteps} />
        </div>
      </section>

      {/* blog */}
      {posts.length > 0 && (
        <section className="section">
          <div className="shell">
            <SectionHead
              kicker="Transmissions"
              title="From the blog"
              body="Deep dives into AI tooling, LLM engineering, and regional Pakistan tech experiments."
              action={
                <Link href="/blog" className="link-arrow">
                  Read all transmissions <Arrow />
                </Link>
              }
            />

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 90}>
                  <Link href={`/blog/${post.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden bg-surface-2">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                        />
                      ) : (
                        <span className="block h-full w-full bg-gradient-to-br from-indigo/25 to-void" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {post.labels[0] ? <span className="chip w-fit">{post.labels[0]}</span> : null}
                      <h3 className="mt-3 font-display text-h3 text-fg transition-colors group-hover:text-indigo-soft">
                        {post.title}
                      </h3>
                      <p className="mt-auto pt-5 font-mono text-kicker uppercase text-muted">
                        {formatDate(post.published)} · {post.readingTime} min read
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand />
    </>
  )
}
