import { apps, appCategories } from './apps'

export const site = {
  name: 'AI ka Fanda',
  legalName: 'Technical Corp',
  tagline: 'Built for high-craft deterministic intelligence.',
  description:
    'An AI-first studio building production apps, websites, automations and chatbots — designed and coded with AI, shipped in days.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aikafanda.com',
  email: 'technicalcorp700@gmail.com',
  founder: 'Hafiz Muhammad Anas',
  location: 'Okara, Punjab, Pakistan',
  playDeveloperUrl: 'https://play.google.com/store/apps/developer?id=AI+Ka+Fanda',
}

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const stats = [
  { value: apps.length, suffix: '', label: 'Apps shipped', note: 'Live in store & customer hands.' },
  { value: appCategories.length - 1, suffix: '', label: 'Categories', note: 'Across a growing product portfolio.' },
  { value: 10, suffix: 'x', label: 'Faster delivery', note: 'Days, not legacy quarter sprints.' },
  { value: 100, suffix: '%', label: 'AI-assisted build', note: 'Vibe-coded, deterministic code.' },
]

export const marqueeItems = [
  'AI-assisted development',
  'Vibe coding',
  'Apps shipped',
  'Automation',
  'Chatbots',
  'Play Store ready',
  'Fast turnaround',
]

export const processSteps = [
  {
    step: '01',
    title: 'Discover & scope',
    body: 'We map your technical goals, design data schemas, and draft deterministic prompts alongside system architecture.',
    meta: 'Week 01',
  },
  {
    step: '02',
    title: 'Prototype with AI',
    body: 'Generating working UI in code: flows, wireframes and vertical slices in under 48 hours.',
    meta: 'Week 1–2',
  },
  {
    step: '03',
    title: 'Build & iterate',
    body: 'Vibe-coding in production: automated tests, edge pipelines, rapid refactors, and human QA passes.',
    meta: 'Week 2–4',
  },
  {
    step: '04',
    title: 'Launch & support',
    body: 'Store publishing (Google Play / App Store), continuous monitoring, telemetry logging, and warranty support.',
    meta: 'Day 30+',
  },
]

export const faqs = [
  {
    q: 'How fast can you actually ship?',
    a: 'A landing page or marketing site lands in 3–7 days. A full web app or an Android app with a Play Store listing takes 2–4 weeks. Automations and chatbots usually land inside a week.',
  },
  {
    q: 'What does "AI-assisted" mean in practice?',
    a: 'We use AI for the parts it is genuinely good at — scaffolding, UI generation, refactors, test writing, copy drafts — and review every line by hand before it ships. You get the speed without the slop.',
  },
  {
    q: 'Do I own the code?',
    a: 'Yes. Source is delivered in your own GitHub repository, with deployment configured on your own Vercel, Firebase or Play Console account.',
  },
  {
    q: 'Can you work with our existing codebase?',
    a: 'Yes. We take on migrations, rebuilds and feature work on existing React, Next.js, Node and Flutter projects.',
  },
  {
    q: 'How do payments work?',
    a: '50% to start, 50% on delivery for fixed-scope projects. Retainers are billed monthly. We take bank transfer, Wise and Payoneer.',
  },
]
