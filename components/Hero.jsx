'use client'

import Link from 'next/link'
import { MaskedLines } from './Motion'

const terminalLines = [
  { t: 'import { Studio } from "@aikafanda/core";', c: 'text-indigo-soft' },
  { t: '// initialise the runtime pipeline', c: 'text-muted' },
  { t: 'const spec = Studio.scope("android app");', c: 'text-fg/80' },
  { t: 'await deterministic.generate(spec);', c: 'text-fg/80' },
  { t: 'studio.publish({ target: "play" });', c: 'text-amber' },
]

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

          {/* terminal + app card composition */}
          <div className="relative min-w-0">
            <div className="glass relative overflow-hidden p-4">
              <div className="flex items-center gap-1.5 pb-3">
                {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                  <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} aria-hidden="true" />
                ))}
                <span className="ml-3 font-mono text-kicker text-muted">studio.orchestrator.ts</span>
              </div>
              <pre className="overflow-x-auto rounded-md border border-line bg-void p-4 font-mono text-[12.5px] leading-relaxed">
                {terminalLines.map((l, i) => (
                  <code key={i} className={`block ${l.c}`}>
                    {l.t}
                  </code>
                ))}
                <code className="mt-2 block text-emerald-400">
                  ✓ status: deployed
                  <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 bg-emerald-400 animate-caret" />
                </code>
              </pre>

              <div className="mt-3 flex items-center justify-between rounded-md border border-line bg-surface-2 px-3 py-2.5">
                <span className="font-mono text-kicker uppercase text-muted">Build time</span>
                <span className="font-mono text-kicker text-amber">4.2s · 0 errors</span>
              </div>
            </div>

            {/* floating status chip */}
            <div className="absolute -bottom-6 -left-4 hidden w-56 sm:block md:-left-10">
              <div className="animate-float">
                <div className="glass p-3">
                  <p className="font-mono text-kicker uppercase text-amber">Store review passed</p>
                  <p className="mt-1.5 text-body-sm text-muted">
                    StyleSnap v2.4 is live on Google Play.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
