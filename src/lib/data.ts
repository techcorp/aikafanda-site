// Shared content database for Ai Ka Fanda

export const WA_NUMBER = "+92 317 7416164";

export function createWhatsAppLink(message: string): string {
  // strip non-numeric except plus
  const cleanNumber = WA_NUMBER.replace(/[^\d+]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export interface Service {
  id: string;
  num: string;
  title: string;
  icon: string;
  desc: string[];
  features: string[];
  stack: string[];
  cases: { t: string; d: string }[];
  pricing: string;
  pricingNote: string;
}

export const SERVICES: Service[] = [
  {
    id: "service-1",
    num: "01",
    title: "Custom AI Agents Development",
    icon: "bot",
    desc: [
      "We design intelligent agents that reason about their tools, act with intent, and integrate into the systems you already use. Not chatbots — workers.",
      "Each agent is built around a tight job-to-be-done: triage inbound leads, summarise sales calls, draft policy updates, monitor your competitors. You give us the workflow; we give you back the hours."
    ],
    features: [
      "Tool-using agents (function calling, MCP, API access)",
      "Vector-DB-backed memory & retrieval",
      "Human-in-the-loop checkpoints for sensitive actions",
      "Full audit trail of every decision",
      "Slack / Teams / Google Chat surfaces",
    ],
    stack: ["OpenAI", "Claude", "LangChain", "LangGraph", "Pinecone", "Supabase"],
    cases: [
      { t: "Sales triage", d: "Auto-route inbound to the right rep with enrichment." },
      { t: "Research analyst", d: "Daily competitor brief delivered to Slack." },
      { t: "Inbox assistant", d: "Drafts replies in your voice for approval." },
      { t: "Knowledge base bot", d: "Answers internal questions, cites the source." },
    ],
    pricing: "From $4k",
    pricingNote: "Per agent · custom quote on scope",
  },
  {
    id: "service-2",
    num: "02",
    title: "Agentic AI Implementation",
    icon: "network",
    desc: [
      "Multi-agent systems where specialised agents collaborate, delegate and self-correct to complete multi-step workflows that no single prompt can handle.",
      "Think: a research team where one agent gathers sources, another verifies, a third writes, a fourth fact-checks — and a coordinator keeps them aligned. With humans approving the consequential steps."
    ],
    features: [
      "Coordinator + specialist agent architectures",
      "Inter-agent messaging via MCP or custom protocols",
      "Persistent state across long-running tasks",
      "Cost & token budgeting per workflow",
      "Failure recovery + escalation paths",
    ],
    stack: ["CrewAI", "AutoGen", "LangGraph", "MCP", "Temporal", "Redis"],
    cases: [
      { t: "Deal-room copilot", d: "Multi-agent due-diligence on M&A targets." },
      { t: "Content factory", d: "Research → write → fact-check → publish." },
      { t: "Customer ops", d: "Tier-1 resolution with specialist escalation." },
      { t: "Internal audits", d: "Cross-system compliance checks on schedule." },
    ],
    pricing: "From $12k",
    pricingNote: "Multi-agent build · includes 30 days of monitoring",
  },
  {
    id: "service-3",
    num: "03",
    title: "Vibe Coding Website Creation",
    icon: "code",
    desc: [
      "Production websites shipped on an AI-paired workflow. We move fast — but the code that lands in your repo is hand-reviewed, accessible, performant, and yours to own.",
      "Best for marketing sites, product landing pages, documentation, and content sites where speed-to-market matters but quality can't slip."
    ],
    features: [
      "Next.js or Astro, deployed on Cloudflare/Vercel",
      "Tailwind + a small, custom design system",
      "CMS integration (Sanity, Contentful, or markdown)",
      "Core Web Vitals tuned, Lighthouse 95+",
      "WCAG-AA accessibility pass",
    ],
    stack: ["Next.js", "Astro", "Tailwind", "Sanity", "Cloudflare", "Vercel"],
    cases: [
      { t: "Marketing site", d: "From figma to production in under 3 weeks." },
      { t: "Docs portal", d: "Versioned, searchable, fast." },
      { t: "Portfolio", d: "For studios, agencies and solo founders." },
      { t: "Microsite", d: "Campaign-specific, ship & sunset cleanly." },
    ],
    pricing: "From $6k",
    pricingNote: "Marketing site · 3-4 week timeline",
  },
  {
    id: "service-4",
    num: "04",
    title: "Vibe Coding SaaS Development",
    icon: "layers",
    desc: [
      "End-to-end SaaS builds on a modern stack — auth, billing, dashboards, and the boring bits done well. We use an AI-augmented workflow to compress the timeline without compromising the architecture.",
      "Ideal for founders who want to validate quickly, and for teams who need an internal tool built like a product."
    ],
    features: [
      "Auth, payments, multi-tenancy from day one",
      "Type-safe end-to-end (tRPC or GraphQL)",
      "Real-time features (websockets / SSE)",
      "Background jobs and queues",
      "CI/CD, observability, error tracking included",
    ],
    stack: ["Next.js", "Supabase", "Stripe", "tRPC", "PostgreSQL", "Vercel"],
    cases: [
      { t: "B2B MVP", d: "Validate with paying users in 6 weeks." },
      { t: "Internal tool", d: "Replace the spreadsheet. Reuse the data." },
      { t: "AI-native product", d: "Agent + UI + billing in one build." },
      { t: "Marketplace", d: "Two-sided with payments and ops." },
    ],
    pricing: "From $18k",
    pricingNote: "MVP build · 6-8 week timeline",
  },
  {
    id: "service-5",
    num: "05",
    title: "n8n Automation Workflows",
    icon: "spark",
    desc: [
      "Self-hosted or cloud n8n workflows that connect the apps and APIs you already use. We build the unsexy plumbing that quietly saves your team hours every week.",
      "Best when the problem is 'we keep copy-pasting between five tools' — automation alone is enough, no LLM required."
    ],
    features: [
      "Self-hosted n8n setup on your infra",
      "Webhook + cron + event-driven triggers",
      "Custom nodes for proprietary APIs",
      "Error handling, retries, alerting",
      "Documentation & handover for your team",
    ],
    stack: ["n8n", "Postgres", "Docker", "Webhooks", "REST/GraphQL APIs"],
    cases: [
      { t: "CRM sync", d: "Keep HubSpot / Pipedrive / Sheets in lockstep." },
      { t: "Lead routing", d: "Enrich, score, and assign in real time." },
      { t: "Reporting", d: "Daily digests pulled from a dozen sources." },
      { t: "Onboarding", d: "Trigger 30 actions from one form submit." },
    ],
    pricing: "From $2k",
    pricingNote: "Per workflow · maintenance plans available",
  },
  {
    id: "service-6",
    num: "06",
    title: "AI Integration Services",
    icon: "cube",
    desc: [
      "Already have an AI vendor or model? We help you integrate it cleanly — into your product, your back-office, your internal tools — without the chaos of half-finished prototypes leaking into production.",
      "Strong fit when you have the AI capability and need the production wiring: rate limiting, caching, monitoring, fallbacks, evals."
    ],
    features: [
      "Model routing & fallback strategies",
      "Streaming UI integration",
      "Prompt versioning and evals",
      "Cost monitoring & rate limits",
      "PII redaction & guardrails",
    ],
    stack: ["OpenAI", "Anthropic", "OpenRouter", "Vercel AI SDK", "Helicone", "LangSmith"],
    cases: [
      { t: "Product feature", d: "Ship the AI feature your roadmap is blocked on." },
      { t: "Internal tool", d: "Wrap your team's workflow in an AI surface." },
      { t: "Migration", d: "Move from one model/vendor to another safely." },
      { t: "Audit", d: "Tighten an existing AI feature's cost & quality." },
    ],
    pricing: "From $5k",
    pricingNote: "Per integration · scoped per surface",
  }
];

export interface Project {
  id: string;
  name: string;
  tag: string;
  desc: string;
  stack: string[];
  accent: string;
  icon: string;
  size: "lg" | "md" | "sm";
  placeholder?: boolean;
  image?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "li",
    name: "LinkedIn Content Creator & Publisher",
    tag: "Agent · Marketing",
    desc: "Autonomous agent that researches trending tech topics, drafts on-brand posts, generates visuals and publishes to LinkedIn on schedule.",
    stack: ["n8n", "OpenAI", "DALL·E", "LinkedIn API"],
    accent: "var(--primary)",
    icon: "linkedin",
    size: "lg",
    image: "/linkedin-agent.jpg",
  },
  {
    id: "fb",
    name: "Facebook Auto Posting Agent",
    tag: "Agent · Social",
    desc: "Multi-page Facebook publisher with Airtable scheduler, automated AI caption tuning, custom image generation, and Graph API posting.",
    stack: ["n8n", "Graph API", "OpenAI", "Airtable"],
    accent: "#3b82f6",
    icon: "facebook",
    size: "sm",
    image: "/facebook-agent.jpg",
  },
  {
    id: "phishing",
    name: "AI Phishing Detection & Security Agent",
    tag: "Agent · SecOps",
    desc: "Enterprise email security agent integrating URL scanning, VirusTotal file analysis, Groq analysis, Discord alarms, and Supabase audits.",
    stack: ["n8n", "VirusTotal", "URLScan", "Groq", "Supabase", "Discord"],
    accent: "var(--accent-2)",
    icon: "shield",
    size: "lg",
    image: "/phishing-agent.jpg",
  },
  {
    id: "hr",
    name: "AI HR Policy Assistant",
    tag: "Agent · Internal",
    desc: "Google Chat conversational assistant linked to company knowledge bases, answering employee questions with document citations and admin escalations.",
    stack: ["Google Chat", "LangChain", "Vector DB", "PDF Reader"],
    accent: "var(--accent)",
    icon: "chat",
    size: "md",
    image: "/hr-agent.jpg",
  },
  {
    id: "monitor",
    name: "Website Monitoring Agent",
    tag: "Agent · Ops",
    desc: "Self-healing watcher that monitors uptime, DOM regressions and Core Web Vitals — then opens a fix ticket with context.",
    stack: ["n8n", "Playwright", "Linear"],
    accent: "var(--accent)",
    icon: "monitor",
    size: "md",
  }
];

export interface AppData {
  id: string;
  name: string;
  tag: string;
  desc: string;
  accent: string;
  screen: "terminal" | "stylist" | "soon";
  placeholder?: boolean;
}

export const APPS: AppData[] = [
  {
    id: "termuxpert",
    name: "TermuXpert",
    tag: "Developer tooling",
    desc: "Mobile-first Termux companion with AI-assisted shell, snippet vault and one-tap setup recipes.",
    accent: "#22D3EE",
    screen: "terminal",
  },
  {
    id: "stylesnap",
    name: "StyleSnap AI Stylist",
    tag: "Fashion · AI",
    desc: "Snap your closet, get outfit suggestions for any occasion — fully personalised to your wardrobe and weather.",
    accent: "#E879F9",
    screen: "stylist",
  },
  {
    id: "soon-app",
    name: "Coming soon",
    tag: "In development",
    desc: "Our next consumer app is in private beta. Want early access or want to white-label something similar?",
    accent: "var(--fg-muted)",
    screen: "soon",
    placeholder: true,
  },
];

export const REASONS = [
  { icon: "rocket", title: "Ship in weeks, not quarters", desc: "We use our own AI-paired workflow to compress timelines without cutting corners." },
  { icon: "shield", title: "Production-grade by default", desc: "Observability, retries, and human-in-the-loop checkpoints baked into every agent." },
  { icon: "spark", title: "Integrated with your stack", desc: "We meet you where you are — n8n, Slack, Notion, Google Workspace, custom APIs." },
  { icon: "clock", title: "Runs while you sleep", desc: "Agents work 24/7 with full audit trails. You see exactly what happened, when and why." },
];

export const STATS = [
  { value: 30, suffix: "+", label: "Automations in production" },
  { value: 1284, suffix: "", label: "Tasks/mo handled by agents" },
  { value: 97, suffix: "%", label: "Client retention" },
  { value: 14, suffix: " days", label: "Avg. time to first deploy" },
];

export const QUOTES = [
  {
    q: "They replaced 18 hours of our weekly social ops with an agent that produces better-performing content. Took two weeks.",
    name: "Sara Iqbal",
    role: "Head of Marketing, Lumen Tech",
  },
  {
    q: "The HR policy bot now handles 80% of repetitive questions. Our People team can finally focus on people.",
    name: "Daniyal Khan",
    role: "COO, Karavan Logistics",
  },
  {
    q: "Their vibe coding workflow is the real deal — they shipped our MVP in three weeks and it actually scales.",
    name: "Mehwish Raza",
    role: "Founder, Threadly",
  },
];

export const TECH_STACK = [
  { name: "OpenAI", primary: true },
  { name: "Claude", primary: true },
  { name: "n8n", primary: true },
  { name: "LangChain", primary: true },
  { name: "Next.js", primary: true },
  { name: "LangGraph", primary: false },
  { name: "CrewAI", primary: false },
  { name: "AutoGen", primary: false },
  { name: "MCP", primary: false },
  { name: "Supabase", primary: false },
  { name: "Vercel", primary: false },
  { name: "Cloudflare", primary: false },
  { name: "Stripe", primary: false },
  { name: "Pinecone", primary: false },
  { name: "Postgres", primary: false },
  { name: "Redis", primary: false },
  { name: "Tailwind", primary: false },
  { name: "Astro", primary: false },
  { name: "tRPC", primary: false },
  { name: "Playwright", primary: false },
  { name: "Temporal", primary: false },
  { name: "Helicone", primary: false },
  { name: "LangSmith", primary: false },
  { name: "OpenRouter", primary: false },
];

export const TEAM_MEMBERS = [
  {
    initials: "HA",
    name: "Hassan A.",
    role: "Founder · Lead engineer",
    desc: "10 yrs in platform engineering. Spent the last two years deep in agentic AI tooling.",
    accent: "var(--grad-primary)"
  },
  {
    initials: "ZK",
    name: "Zara K.",
    role: "Product · AI design",
    desc: "From research labs to shipped product. Designs the human surface for our agents.",
    accent: "linear-gradient(135deg, #22D3EE, #6366F1)"
  },
  {
    initials: "RM",
    name: "Rayyan M.",
    role: "Full-stack · Vibe coding",
    desc: "Ships product features at silly speed. Quality reviews included.",
    accent: "linear-gradient(135deg, #E879F9, #F59E0B)"
  },
  {
    initials: "AS",
    name: "Ayesha S.",
    role: "Automation · n8n specialist",
    desc: "Has built more n8n flows than she can count. Loves a clean webhook.",
    accent: "linear-gradient(135deg, #10B981, #22D3EE)"
  }
];

export const TIMELINE = [
  {
    date: "Q2 · 2024",
    title: "Studio founded.",
    desc: "Started with one engineer, one workflow automation, and a hunch that AI was about to change how small teams ship software."
  },
  {
    date: "Q4 · 2024",
    title: "First agentic build in production.",
    desc: "LinkedIn content agent for a Karachi-based fintech. Replaced ~12 hours/week of manual marketing ops."
  },
  {
    date: "Q1 · 2025",
    title: "Vibe coding practice launched.",
    desc: "Formalised our AI-paired engineering workflow. First SaaS MVP shipped end-to-end in 6 weeks."
  },
  {
    date: "Q3 · 2025",
    title: "Team grew to four.",
    desc: "Added product, full-stack, and n8n specialists. Capacity for four parallel engagements per quarter."
  },
  {
    date: "Q1 · 2026",
    title: "30+ automations in production.",
    desc: "Crossed 30 production deployments across clients in Pakistan, the UAE and the UK."
  }
];
