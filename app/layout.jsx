import './globals.css'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import Cursor from '@/components/Cursor'
import GravityStarsBackground from '@/components/GravityStars'
import { site } from '@/data/site'

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' })
const body = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-body', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' })

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AI-first studio | Vibe coding & production intelligence`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    'AI agency Pakistan',
    'AI website development',
    'AI automation',
    'AI chatbots',
    'Android app development Pakistan',
    'vibe coding',
  ],
  authors: [{ name: site.founder }],
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — AI-first studio`,
    description: site.description,
    locale: 'en_US',
    images: [{ url: '/aikafanda-logo.webp', width: 1536, height: 1024, alt: site.name }],
  },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description, images: ['/aikafanda-logo.webp'] },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon-192.png',
  },
}

export const viewport = {
  themeColor: '#0B0B0F',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.email,
  founder: { '@type': 'Person', name: site.founder },
  address: { '@type': 'PostalAddress', addressLocality: 'Okara', addressRegion: 'Punjab', addressCountry: 'PK' },
  description: site.description,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        {/* mrmnd ads: push, interstitial, popunder */}
        <script async src="https://ds.mrmnd.com/b0f1a1c1-f0a4-4a41-8394-94b1d8151c24.js" />
        <script async src="https://ss.mrmnd.com/interstitial.js" data-mndintid="ff582398-b660-41df-b3d2-d3e2ed1a2db4" />
        <script async src="https://ss.mrmnd.com/static/6446df94-c447-4c2e-be18-42847a0b3b8e.js" />
      </head>
      <body>
        <GravityStarsBackground
          starsCount={110}
          starsSize={1.5}
          starsOpacity={0.6}
          glowIntensity={10}
          movementSpeed={0.18}
          mouseInfluence={140}
          mouseGravity="attract"
          gravityStrength={65}
          starsInteraction={false}
          cursorTrail
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-indigo focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
