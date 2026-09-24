# AI ka Fanda — studio website

Next.js 14 (App Router) site for **AI ka Fanda** / Technical Corp. Deploys to Vercel,
pulls blog posts live from Blogger.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in your keys
npm run dev                    # http://localhost:3000
```

---

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to **vercel.com → Add New → Project** and import the repo.
3. Framework preset is detected automatically (Next.js). Leave build settings alone.
4. Under **Environment Variables**, add everything from `.env.example`.
5. Deploy.
6. **Settings → Domains** → add `aikafanda.com` and `www.aikafanda.com`, then point
   your DNS at Vercel (they show the exact records).

Every push to `main` redeploys automatically.

---

## Connecting Blogger

You write posts in Blogger; this site renders them. Two values are needed.

**1. Get the API key**

- Open <https://console.cloud.google.com/> and create a project.
- **APIs & Services → Library** → search *Blogger API v3* → **Enable**.
- **APIs & Services → Credentials → Create credentials → API key**.
- Click **Restrict key** → under *API restrictions* select **Blogger API v3**. Save.
- That key goes in `BLOGGER_API_KEY`.

**2. Get the blog ID**

- Open your blog in the Blogger dashboard.
- The URL contains `blogID=1234567890123456789` — copy that number into
  `BLOGGER_BLOG_ID`.

**3. Make sure the blog is public**

Blogger → Settings → Privacy → *Visible to search engines* on. The API cannot read
a private blog.

### How it behaves

| Thing | Behaviour |
|---|---|
| New post | Appears on the site within 10 minutes (ISR cache) |
| Instant refresh | Open `https://your-site.com/api/revalidate?secret=YOUR_SECRET` |
| Blogger labels | Become the filter pills on `/blog` automatically |
| Post headings (H2/H3) | Become the sticky table of contents on the post page |
| Featured image | First image in the post, or Blogger's own thumbnail |
| Reading time | Calculated from word count |
| Not configured yet | `/blog` shows a setup message instead of crashing |

Write posts normally in Blogger's editor. Use **H2** for main sections so the table
of contents fills in. Code blocks, images, quotes and tables are all styled.

---

## Contact form

`POST /api/contact` handles the form. Validation, a honeypot field and length caps
are built in.

- **With `RESEND_API_KEY`** → emails you at `CONTACT_TO_EMAIL`.
  Sign up free at [resend.com](https://resend.com), create an API key, and verify
  your domain to send from `hello@aikafanda.com` instead of the test address.
- **Without it** → the form still returns success and the enquiry is written to the
  Vercel function log (Deployments → Functions → Logs). Nothing gets lost, but you
  have to go look for it. Add the key before launch.

---

## Editing content

Almost everything lives in `data/`, so you rarely touch components.

| File | Holds |
|---|---|
| `data/apps.js` | The 8 apps — names, descriptions, categories, icons, banners, beta status |
| `data/services.js` | The 4 services, the 3 engagement tiers, the "why AI" stats |
| `data/site.js` | Nav links, contact details, stats, the 4-step process, FAQs |

### Adding a new app

Copy any block in `data/apps.js` and edit it. Then:

- Drop a 192×192 icon at `public/apps/<slug>-icon.png`
- Drop a 960×540 feature graphic at `public/apps/<slug>-banner.jpg`
- Set `status: 'beta'` for closed-testing apps — they get an amber **In beta** badge
  and a *Join beta* button instead of a Play Store link
- Set `packageId` once the app is public, and the Play button wires itself up

`npm run fetch:assets` scrapes icons and screenshots from Play for any app that has
a `packageId`, and prints paste-ready values. It never overwrites anything by itself.

---

## Project structure

```
app/
  layout.jsx           fonts, nav, footer, smooth scroll, SEO defaults
  page.jsx             home
  services/            services page
  products/            product grid + spotlight
  blog/                listing (Blogger)
  blog/[slug]/         single post (Blogger)
  about/  contact/     about, contact
  api/contact/         form handler
  api/revalidate/      cache-bust webhook
  sitemap.js robots.js SEO
components/
  Nav Footer Hero      layout + hero
  Motion.jsx           reveal, counters, marquee, tilt, progress bar
  Products.jsx         app cards, filter grid, spotlight carousel
  Forms.jsx            FAQ accordion, contact form
  UI.jsx               kickers, icons, buttons, CTA band
lib/blogger.js         Blogger API v3 client
data/                  all editable content
public/apps/           app icons and feature graphics
```

---

## Animation

GSAP-free and lightweight — everything runs on IntersectionObserver plus CSS
transitions, with [Lenis](https://lenis.darkroom.engineering/) for inertia scrolling.

Hero headline mask-wipe, stat counters, per-section scroll reveals with stagger,
infinite marquee, card hover lift with banner zoom, cursor tilt on the hero and
spotlight, timeline draw-in, accordion height animation, form success state, and a
reading-progress bar on posts.

Every one of these is disabled under `prefers-reduced-motion: reduce`.

---

## Notes

- All app assets are local files in `public/apps/`, so the site has no third-party
  image dependencies.
- Fonts (Space Grotesk, Inter, JetBrains Mono) are self-hosted by `next/font` at
  build time — no runtime request to Google.
- JSON-LD schema ships for Organization, the app list and each blog post.
- `sitemap.xml` includes every blog post automatically.
