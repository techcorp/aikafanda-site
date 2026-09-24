'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nav } from '@/data/site'

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{ transition: 'all 400ms cubic-bezier(0.22,1,0.36,1)' }}
    >
      <div
        className={`border-b ${
          scrolled ? 'border-line bg-void/75 backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
        style={{ transition: 'all 400ms cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div className="shell">
          <div
            className={`flex items-center justify-between ${scrolled ? 'h-14' : 'h-[72px]'}`}
            style={{ transition: 'height 400ms cubic-bezier(0.22,1,0.36,1)' }}
          >
            <Link href="/" className="flex items-center gap-2.5" aria-label="AI ka Fanda — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.webp" alt="" width={48} height={30} className="h-7 w-auto" />
              <span className="font-display text-[1.0625rem] font-bold tracking-tight text-fg">AI ka Fanda</span>
              <span className="hidden rounded-[4px] border border-line bg-surface px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted sm:inline">
                PK
              </span>
            </Link>

            <nav
              className="hidden items-center gap-1.5 lg:flex"
              aria-label="Main"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`group rounded-lg border-b-2 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-indigo-soft focus-visible:ring-offset-2 focus-visible:ring-offset-void ${
                    isActive(item.href)
                      ? 'border-b-indigo bg-indigo/15'
                      : 'border-b-transparent bg-transparent hover:bg-surface-2'
                  }`}
                >
                  <span
                    className={`flex h-9 origin-top-right items-center justify-center rounded-md border-2 px-3 font-mono text-[12px] font-medium uppercase tracking-[.08em] transition-[transform,color,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none ${
                      isActive(item.href)
                        ? 'rotate-0 border-indigo bg-void text-indigo-soft'
                        : 'border-line bg-surface text-muted group-hover:rotate-6 group-hover:border-muted group-hover:text-fg'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/contact" className="btn-signal hidden !py-2 !text-[13px] sm:inline-flex">
                Let’s talk
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="grid h-10 w-10 place-items-center rounded border border-line text-fg lg:hidden"
              >
                <span className="relative block h-3 w-4">
                  <span
                    className="absolute left-0 block h-px w-4 bg-current"
                    style={{
                      top: open ? '6px' : '1px',
                      transform: open ? 'rotate(45deg)' : 'none',
                      transition: 'all 300ms cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                  <span
                    className="absolute left-0 block h-px w-4 bg-current"
                    style={{ top: '6px', opacity: open ? 0 : 1, transition: 'opacity 200ms' }}
                  />
                  <span
                    className="absolute left-0 block h-px w-4 bg-current"
                    style={{
                      top: open ? '6px' : '11px',
                      transform: open ? 'rotate(-45deg)' : 'none',
                      transition: 'all 300ms cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className="fixed inset-x-0 top-[57px] z-40 origin-top border-b border-line bg-void/95 backdrop-blur-xl lg:hidden"
        style={{
          transform: open ? 'scaleY(1)' : 'scaleY(0)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1), opacity 250ms',
        }}
      >
        <nav className="shell flex flex-col py-4" aria-label="Mobile">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`border-b border-line/60 py-3.5 font-display text-h3 ${
                isActive(item.href) ? 'text-indigo-soft' : 'text-fg'
              }`}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'none' : 'translateY(8px)',
                transition: `all 400ms cubic-bezier(0.22,1,0.36,1) ${i * 40}ms`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-signal mt-5">
            Let’s talk
          </Link>
        </nav>
      </div>
    </header>
  )
}
