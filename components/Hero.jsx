'use client'

import Link from 'next/link'
import { MaskedLines } from './Motion'
import HeroVisual from './HeroVisual'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* layered background */}
      <div className="pointer-events-none absolute inset-0 grid-bg grid-bg-soft" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 left-1/4" aria-hidden="true">
        <div className="h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo/20 blur-[120px] animate-breathe" />
      </div>
      <div
        className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-amber/[0.07] blur-[100px]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* copy */}
          <div className="min-w-0">
            <h1 className="font-display text-hero text-fg">
              <MaskedLines
                lines={['We build with AI.', 'You ship in days,', 'not months.']}
                lineClassName=""
              />
            </h1>

            <p className="mt-6 max-w-xl text-body-lg text-muted">
              An AI-first studio building production apps, websites, automations and chatbots —
              designed and coded with deterministic AI precision.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary">
                See our work
              </Link>
              <Link href="/contact" className="btn-ghost">
                Book a free call
              </Link>
            </div>
          </div>

          {/* 3D studio scene */}
          <div className="relative min-w-0">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
