import Link from 'next/link'
import { site } from '@/data/site'
import { apps, playUrl } from '@/data/apps'
import { services } from '@/data/services'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface/30">
      <div className="shell py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.webp" alt="" width={48} height={30} className="h-8 w-auto" />
              <span className="font-display text-h3 font-bold text-fg">{site.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-body-sm text-muted">
              High velocity, vibe-coded product engineering from Okara, Pakistan. Turning ambitious
              concepts into deployed software at unreal speeds.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-kicker uppercase text-amber">Services</h3>
            <ul className="mt-3 space-y-0.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="inline-block py-1.5 text-body-sm text-muted transition-colors hover:text-fg">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-kicker uppercase text-amber">Shipped products</h3>
            <ul className="mt-3 space-y-0.5">
              {apps.slice(0, 5).map((a) => {
                const url = playUrl(a)
                const label = `${a.short}${a.status === 'beta' ? ' (in beta)' : ''}`
                return (
                  <li key={a.slug}>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-1.5 text-body-sm text-muted transition-colors hover:text-fg"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link href="/products" className="inline-block py-1.5 text-body-sm text-muted transition-colors hover:text-fg">
                        {label}
                      </Link>
                    )}
                  </li>
                )
              })}
              <li>
                <Link href="/products" className="inline-block py-1.5 text-body-sm text-indigo-soft transition-colors hover:text-indigo">
                  All apps
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-kicker uppercase text-amber">Company</h3>
            <ul className="mt-3 space-y-0.5">
              <li>
                <Link href="/about" className="inline-block py-1.5 text-body-sm text-muted transition-colors hover:text-fg">
                  About the studio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="inline-block py-1.5 text-body-sm text-muted transition-colors hover:text-fg">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-block py-1.5 text-body-sm text-muted transition-colors hover:text-fg">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href={site.playDeveloperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1.5 text-body-sm text-muted transition-colors hover:text-fg"
                >
                  Google Play developer page
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-block break-all py-1.5 text-body-sm text-muted transition-colors hover:text-fg">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="inline-block py-1.5 text-body-sm text-muted">
            © {year} {site.name}. All rights reserved. Built by {site.legalName}.
          </p>
          <div className="flex gap-5 text-body-sm text-muted">
            <Link href="/privacy-policy" className="inline-block py-1.5 transition-colors hover:text-fg">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-block py-1.5 transition-colors hover:text-fg">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
