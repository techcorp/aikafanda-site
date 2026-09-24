import Link from 'next/link'
import { Kicker } from '@/components/UI'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
      <div className="shell relative text-center">
        <Kicker>404</Kicker>
        <h1 className="mx-auto mt-5 max-w-xl font-display text-hero text-fg">
          This page never shipped.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-body-md text-muted">
          The link is broken or the page moved. Head back and try from the top.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">Back to home</Link>
          <Link href="/products" className="btn-ghost">See our apps</Link>
        </div>
      </div>
    </section>
  )
}
