export const services = [
  {
    slug: 'websites',
    accent: '#6C5CE7',
    image: '/services/websites.webp',
    title: 'AI-Assisted Website Development',
    icon: 'globe',
    short:
      'Ultra-responsive, high-performance web platforms and bespoke web apps engineered with modern frontend stacks and CI/CD pipelines for instant iteration.',
    body: 'Marketing sites, landing pages and full web apps — designed, built and deployed end to end. We generate the first working version in hours, then harden it by hand: real accessibility, real performance budgets, real SEO.',
    deliverables: [
      'Design system and responsive UI built to your brand',
      'Next.js or React front end with server rendering for SEO',
      'CMS or headless content wiring so you can edit without us',
      'Deployed on Vercel with analytics and a staging branch',
    ],
    stack: ['Next.js', 'React', 'Tailwind', 'Vercel'],
  },
  {
    slug: 'automation',
    accent: '#5B7CFA',
    image: '/services/automation.webp',
    title: 'AI Automation & Pipelines',
    icon: 'workflow',
    short:
      'Autonomous background workers, OCR ingestion, agent chains and real-time data-sync pipelines that remove manual operational drag forever.',
    body: 'If a person on your team is copying data between two tools, that is a pipeline waiting to be written. We build the connectors, the scheduled jobs and the agent chains that make the work happen without anyone watching.',
    deliverables: [
      'Workflow automation across your existing tools',
      'Document and receipt ingestion with OCR plus AI extraction',
      'Scheduled jobs, webhooks and two-way API sync',
      'Internal dashboards so you can see what ran and what failed',
    ],
    stack: ['n8n', 'Python', 'Webhooks', 'Postgres'],
  },
  {
    slug: 'chatbots',
    accent: '#8B5CF6',
    image: '/services/chatbots.webp',
    title: 'AI Chatbots & RAG Agents',
    icon: 'chat',
    short:
      'Multi-turn domain-specific LLM assistants, WhatsApp and Telegram bot infrastructure, and vector knowledge bases tuned with zero hallucination guardrails.',
    body: 'Assistants that answer from your documents instead of guessing. We build the retrieval layer, the evaluation set and the guardrails, so the bot says "I don\'t know" when it should.',
    deliverables: [
      'Retrieval-augmented assistant trained on your own content',
      'WhatsApp, Telegram, web widget or in-app deployment',
      'Handover to a human agent when confidence drops',
      'Conversation logs and an evaluation suite you can run',
    ],
    stack: ['Claude', 'OpenAI', 'RAG', 'Vector DB'],
  },
  {
    slug: 'mobile-apps',
    accent: '#6366F1',
    image: '/services/mobile-apps.webp',
    title: 'AI-Assisted Mobile Apps',
    icon: 'phone',
    short:
      'End-to-end native Android and iOS cross-platform mobile products built for mass deployment on Google Play Store and Apple App Store in weeks.',
    body: 'We continuously ship our own apps this way, so the Play Console pipeline is a solved problem here: store listing, data safety form, closed testing, staged rollout and post-launch monitoring included.',
    deliverables: [
      'Android app from concept to a published Play listing',
      'Store assets: icon, feature graphic, screenshots, copy',
      'Data safety declaration, privacy policy and content rating',
      'Crash reporting, analytics and a staged rollout plan',
    ],
    stack: ['Flutter', 'Kotlin', 'Firebase', 'Play Console'],
  },
]

export const engagements = [
  {
    name: 'Quick Build',
    price: 'From $450',
    blurb: 'One focused deliverable, shipped fast.',
    features: ['Landing page or single-flow tool', 'Up to 5 sections or screens', 'Delivered in 3–7 days', 'One revision round'],
    cta: 'Start a quick build',
    popular: false,
  },
  {
    name: 'Full Project',
    price: 'From $1,800',
    blurb: 'A complete product, designed and launched.',
    features: [
      'Full web app or Android app',
      'Design system, backend and integrations',
      'Store or production launch included',
      '30 days of post-launch support',
    ],
    cta: 'Scope a project',
    popular: true,
  },
  {
    name: 'Retainer',
    price: 'From $900/mo',
    blurb: 'An embedded AI team, month to month.',
    features: ['Ongoing features and fixes', 'Priority response within 24 hours', 'Monthly roadmap call', 'Pause or cancel any month'],
    cta: 'Talk about a retainer',
    popular: false,
  },
]

export const whyAi = [
  { stat: '10x', title: 'Speed', body: 'Prototypes in hours, production in weeks. AI writes the scaffolding; we own the architecture.' },
  { stat: '60%', title: 'Cost', body: 'Fewer billable hours on boilerplate means the budget goes into the parts that actually differentiate you.' },
  { stat: '100%', title: 'Quality', body: 'Every generated line is reviewed, typed and tested. Speed without the slop is the whole discipline.' },
]
