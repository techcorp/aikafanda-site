import Link from 'next/link'
import Hero from '@/components/Hero'
import { Marquee, Reveal, Counter } from '@/components/Motion'
import { SectionHead, Kicker, Arrow, CTABand } from '@/components/UI'
import ScrollShowcase from '@/components/ScrollShowcase'
import AppCarousel from '@/components/AppCarousel'
import { ProjectShowcase } from '@/components/Products'
import ProcessCards from '@/components/ProcessCards'
import BlogCoverflow from '@/components/BlogCoverflow'
import Testimonials from '@/components/Testimonials'
import { stats, marqueeItems, processSteps } from '@/data/site'
import { services } from '@/data/services'
import { apps } from '@/data/apps'
import { projects } from '@/data/projects'
import { testimonials } from '@/data/testimonials'
import { getPosts, formatDate } from '@/lib/blogger'

export const revalidate = 600

export default async function HomePage() {
  const { posts } = await getPosts({ maxResults: 7 })

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
      <section className="section !pb-0 !pt-12 md:!pt-16">
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
          <div className="mt-8 md:mt-10">
            <AppCarousel apps={apps} />
          </div>
        </div>
      </section>


      {/* AI projects */}
      <section className="section !pt-6 md:!pt-10">
        <div className="shell">
          <SectionHead
            kicker="AI Projects"
            title="Beyond apps. Built for real operations."
            body="AI automations and custom business systems designed around real workflows."
            action={
              <Link href="/products#ai-projects" className="btn-ghost">
                Explore AI projects
              </Link>
            }
          />
          <div className="mt-8 md:mt-10">
            <ProjectShowcase projects={projects} />
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

      {/* testimonials */}
      <section className="section">
        <div className="shell">
          <SectionHead
            kicker="Testimonials"
            title="What clients say"
            body="Founders and teams we have built apps, automations and business software for."
          />
          <div className="mt-8 md:mt-10">
            <Testimonials items={testimonials} />
          </div>
        </div>
      </section>

      {/* blog */}
      {posts.length > 0 && (
        <section className="section overflow-hidden">
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

            <div className="mt-10">
              <BlogCoverflow
                posts={posts.map((post) => ({
                  id: post.id,
                  slug: post.slug,
                  title: post.title,
                  image: post.image,
                  label: post.labels[0] || null,
                  date: formatDate(post.published),
                  readingTime: post.readingTime,
                }))}
              />
            </div>
          </div>
        </section>
      )}

      <CTABand />
    </>
  )
}
