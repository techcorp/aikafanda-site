import { supabase, isSupabaseConfigured } from "./supabase";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string;
  author_name: string;
  status: "draft" | "published";
  read_time: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

const SAMPLE_BLOGS: Blog[] = [
  {
    id: "sample-1",
    title: "Building Collaborative Multi-Agent Systems in Production",
    slug: "building-multi-agent-systems",
    excerpt: "Learn how specialized AI agents collaborate, delegate, self-correct, and execute complex business systems without prompt decay.",
    content: `## The Era of Single-Prompt AI is Over

In early 2024, most companies were trying to solve automation problems with a single massive system prompt. We quickly realized the limitations: prompt decay, context overflow, and the inability to self-correct.

To build production-grade automations, we must move to **multi-agent architectures**.

### What is a Multi-Agent System?
Instead of one generalist AI trying to do everything, you orchestrate a team of **specialist agents**. Each agent has:
1. A narrow, well-defined role.
2. A specific set of tools (APIs, search engines, database queries).
3. A distinct persona and context boundary.

\`\`\`
[User Request] 
      │
      ▼
┌──────────────┐
│ Coordinator  │◄────────────┐
└──────┬───────┘             │
       │                     │
       ├──────────────┐      │
       ▼              ▼      │
┌──────────────┐┌───────────┐│
│ Researcher   ││  Writer   ├┘
└──────────────┘└───────────┘
\`\`\`

### Key Collaborative Roles
* **The Coordinator Agent:** Receives the inbound user request, delegates work to specialists, and evaluates the final assembly.
* **The Researcher Agent:** Queries internal databases, searches the web, and formats raw source materials.
* **The Writer Agent:** Drafts copy, emails, or reports based exclusively on the researcher's output.

### Human-in-the-Loop (HITL) Checkpoints
For sensitive tasks like publishing content or initiating financial transactions, always insert a manual gate:
> **Rule of Thumb:** Let the AI do 98% of the heavy lifting (research, drafting, formatting), but let a human click the "Send" or "Approve" button.

### Implementation Checklist
1. Define narrow roles and specific tools for each agent.
2. Build strict coordinators that direct message flows between nodes.
3. Track and budget tokens per run to keep costs completely predictable.
4. Integrate persistent state databases (like PostgreSQL or Redis) to recover from API network failures.

By adopting a modular agent design, business automations become highly resilient, predictable, and remarkably easy to debug.`,
    featured_image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
    category: "Agentic AI",
    tags: "multi-agent, temporal, langgraph, architecture",
    author_name: "Hassan A.",
    status: "published",
    read_time: "5 min read",
    meta_title: "Building Collaborative Multi-Agent Systems in Production",
    meta_description: "Discover how to orchestrate specialized AI agents that collaborate, self-correct, and execute complex workflows safely.",
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    published_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: "sample-2",
    title: "Vibe Coding: Shifting B2B SaaS MVPs Into Warp Speed",
    slug: "vibe-coding-b2b-saas-mvps",
    excerpt: "How AI-paired workflows allow small engineering teams to build, validate, and ship secure SaaS platforms in weeks instead of quarters.",
    content: `## The Architecture of Vibe Coding

The phrase *Vibe Coding* might sound casual, but the underlying methodology is a game-changer for B2B SaaS developers. It is a highly disciplined, AI-paired workflow that dramatically compresses the timeline from Figma mockup to active paid users.

### The Problem with Traditional Development
Building a SaaS MVP traditionally takes 4 to 6 months. By the time the software is launched:
- Market demands have shifted.
- User feedback renders early assumptions obsolete.
- Cash burn has already exhausted early budgets.

### Compression Without Compromise
We use our AI-paired workflow to compress the timeline to **under 6 weeks**. Here is how we do it without sacrificing architectural integrity:

1. **Leverage Pre-Baked Abstractions:**
   Instead of building custom billing or authentication from scratch, we use modern, bulletproof systems:
   * **Authentication:** Supabase Auth or Clerk.
   * **Database:** Supabase PostgreSQL.
   * **Payments:** Stripe Checkout.
   * **Hosting:** Vercel.

2. **Automated Code Gen with Expert Human Audits:**
   * AI handles the tedious typing: boilerplate code, repetitive form styling, and static UI pages.
   * High-level software engineers spend their energy where it matters: security reviews, database design, API schemas, and billing logic.

### Results in Production
> \"Their vibe coding workflow is the real deal — they shipped our B2B marketplace MVP in three weeks and it's already handling live transactions!\"
> *— Mehwish Raza, Founder of Threadly*

### Future-Proofing Your SaaS
Vibe coding doesn't mean writing sloppy throwaway scripts. Because the code is typed in type-safe languages (like TypeScript), standard React structures, and compiled with clean Next.js static structures, your team owns 100% of the repository and can scale it easily as your user base grows.`,
    featured_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    category: "Vibe Coding",
    tags: "nextjs, saas, supabase, stripe, mvp",
    author_name: "Rayyan M.",
    status: "published",
    read_time: "4 min read",
    meta_title: "Vibe Coding: Shifting B2B SaaS MVPs Into Warp Speed",
    meta_description: "Learn how modern AI-paired workflows let you construct and launch scalable SaaS products in record time.",
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    published_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    id: "sample-3",
    title: "Connecting n8n, HubSpot & Slack for Seamless Operations",
    slug: "connecting-n8n-hubspot-slack",
    excerpt: "An operational guide to building unsexy, event-driven webhooks that automate lead scoring, CRM syncing, and automated alert routing.",
    content: `## The Unsexy Plumbing that Saves Hundreds of Hours

Every business has repetitive admin tasks that drain productivity. The sales rep who manually copies lead details from a form into a CRM, the coordinator who alerts the team on Slack, and the analyst who logs it into a spreadsheet.

This is the **unsexy plumbing** of business operations. And it is exactly what we solve with **n8n automation**.

### Why n8n?
While Zapier is easy to start with, it gets incredibly expensive as task volume increases. **n8n** offers:
1. **Self-Hosted Flexibility:** Run it on your own server (Docker/PostgreSQL) with zero per-run fees.
2. **Branching & Loops:** Build complex logical workflows that handle data loops, merges, and error escalations.
3. **HTTP Nodes:** Connect seamlessly to any API, even proprietary in-house tools.

\`\`\`
[Lead Form Submission]
          │
          ▼
    ┌───────────┐
    │  n8n Flow │
    └─────┬─────┘
          │
     ┌────┴───────────────┐
     ▼                    ▼
┌─────────┐         ┌───────────┐
│ HubSpot │         │   Slack   │
│ (CRM)   │         │ (Alert Rep)
└─────────┘         └───────────┘
\`\`\`

### Example Workflow: Enterprise Lead Enrichment
Here is a blueprint for a fully automated enterprise routing system:

1. **Trigger:** A visitor submits a contact form.
2. **Enrichment:** n8n takes the domain (e.g. \`google.com\`), queries Clearbit/Apollo API to fetch company size, industry, and funding.
3. **Filtering:** If company size is > 100, tag as *Enterprise*, otherwise tag as *SMB*.
4. **CRM Sync:** Create/update lead record in HubSpot. Assign to the correct territory representative.
5. **Slack Notification:** Dispatch a beautifully formatted rich-text message in the '#sales-alerts' channel, containing the lead details and a direct link to HubSpot.

### Summary
Operational workflows are the nervous system of modern organizations. Automating these touchpoints with n8n guarantees leads are handled in under 3 minutes, team communication is instant, and CRM data remains perfectly in sync.`,
    featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    category: "Workflow Automation",
    tags: "n8n, hubspot, slack, automation, api",
    author_name: "Ayesha S.",
    status: "published",
    read_time: "3 min read",
    meta_title: "Connecting n8n, HubSpot & Slack for Seamless Operations",
    meta_description: "Step-by-step operational guide to building event-driven webhooks with n8n to sync HubSpot CRMs and alert Slack teams.",
    created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    published_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
  }
];

// Initialize localStorage DB if empty
function initLocalDB() {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem("af_blogs");
  if (!existing) {
    localStorage.setItem("af_blogs", JSON.stringify(SAMPLE_BLOGS));
  }
  const token = localStorage.getItem("af_admin_token");
  if (!token) {
    // default session check
  }
}

export const blogService = {
  // --- AUTHENTICATION ---
  async login(email: string, password: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Supabase Login Error:", error.message);
        return false;
      }
      return !!data.session;
    } else {
      // LocalStorage Auth Mock
      initLocalDB();
      if (email === "admin@aikafanda.com" && password === "admin123") {
        localStorage.setItem("af_admin_token", "af_mock_session_token_" + Date.now());
        return true;
      }
      return false;
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("af_admin_token");
      }
    }
  },

  async getCurrentUser(): Promise<any | null> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.auth.getSession();
      return data.session?.user || null;
    } else {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("af_admin_token");
        if (token) {
          return { email: "admin@aikafanda.com", role: "admin" };
        }
      }
      return null;
    }
  },

  // --- PUBLIC BLOG READS ---
  async getPublishedBlogs(): Promise<Blog[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Supabase getPublishedBlogs error:", error.message);
        return [];
      }
      return data || [];
    } else {
      initLocalDB();
      if (typeof window === "undefined") return SAMPLE_BLOGS;
      const dataStr = localStorage.getItem("af_blogs") || "[]";
      const blogs: Blog[] = JSON.parse(dataStr);
      return blogs
        .filter((b) => b.status === "published")
        .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
    }
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Supabase getBlogBySlug error:", error.message);
        return null;
      }
      return data || null;
    } else {
      initLocalDB();
      if (typeof window === "undefined") {
        return SAMPLE_BLOGS.find((b) => b.slug === slug) || null;
      }
      const dataStr = localStorage.getItem("af_blogs") || "[]";
      const blogs: Blog[] = JSON.parse(dataStr);
      return blogs.find((b) => b.slug === slug) || null;
    }
  },

  // --- ADMIN CMS METHODS ---
  async getAllBlogs(): Promise<Blog[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase getAllBlogs error:", error.message);
        return [];
      }
      return data || [];
    } else {
      initLocalDB();
      if (typeof window === "undefined") return SAMPLE_BLOGS;
      const dataStr = localStorage.getItem("af_blogs") || "[]";
      const blogs: Blog[] = JSON.parse(dataStr);
      return blogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  },

  async createBlog(blog: Omit<Blog, "id" | "created_at" | "updated_at">): Promise<Blog | null> {
    const timestamp = new Date().toISOString();
    const newBlog: Blog = {
      ...blog,
      id: isSupabaseConfigured() ? undefined as any : "blog_" + Math.random().toString(36).substr(2, 9),
      created_at: timestamp,
      updated_at: timestamp,
      published_at: blog.status === "published" ? timestamp : undefined,
    };

    if (isSupabaseConfigured()) {
      // Omit temporary client id if present
      const { id, ...supabaseData } = newBlog;
      const { data, error } = await supabase
        .from("blogs")
        .insert([supabaseData])
        .select()
        .single();

      if (error) {
        console.error("Supabase createBlog error:", error.message);
        return null;
      }
      return data;
    } else {
      initLocalDB();
      const dataStr = localStorage.getItem("af_blogs") || "[]";
      const blogs: Blog[] = JSON.parse(dataStr);
      blogs.push(newBlog);
      localStorage.setItem("af_blogs", JSON.stringify(blogs));
      return newBlog;
    }
  },

  async updateBlog(id: string, updates: Partial<Omit<Blog, "id" | "created_at" | "updated_at">>): Promise<Blog | null> {
    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured()) {
      const dbUpdates = {
        ...updates,
        updated_at: timestamp,
      } as any;
      if (updates.status === "published") {
        dbUpdates.published_at = timestamp;
      }

      const { data, error } = await supabase
        .from("blogs")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase updateBlog error:", error.message);
        return null;
      }
      return data;
    } else {
      initLocalDB();
      const dataStr = localStorage.getItem("af_blogs") || "[]";
      const blogs: Blog[] = JSON.parse(dataStr);
      const idx = blogs.findIndex((b) => b.id === id);
      if (idx === -1) return null;

      const oldBlog = blogs[idx];
      const updatedBlog: Blog = {
        ...oldBlog,
        ...updates,
        updated_at: timestamp,
        published_at: updates.status === "published" ? timestamp : oldBlog.published_at,
      };

      blogs[idx] = updatedBlog;
      localStorage.setItem("af_blogs", JSON.stringify(blogs));
      return updatedBlog;
    }
  },

  async deleteBlog(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) {
        console.error("Supabase deleteBlog error:", error.message);
        return false;
      }
      return true;
    } else {
      initLocalDB();
      const dataStr = localStorage.getItem("af_blogs") || "[]";
      const blogs: Blog[] = JSON.parse(dataStr);
      const filtered = blogs.filter((b) => b.id !== id);
      if (blogs.length === filtered.length) return false;
      localStorage.setItem("af_blogs", JSON.stringify(filtered));
      return true;
    }
  },

  // --- IMAGE UPLOAD SUPPORT ---
  async uploadFeaturedImage(file: File): Promise<string> {
    if (isSupabaseConfigured()) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `featured/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Supabase storage upload error:", uploadError.message);
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
      return data.publicUrl;
    } else {
      // Fallback: create a temporary blob URL for local testing without cluttering the markdown editor with Base64.
      // Note: Blob URLs expire on page reload, which is acceptable for local mock mode.
      return Promise.resolve(URL.createObjectURL(file));
    }
  }
};
