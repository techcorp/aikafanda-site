# AIKaFanda Website

## Local development

Run:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SITE_URL=https://www.aikafanda.com
BLOGGER_SITE_URL=https://your-blog-name.blogspot.com
BLOGGER_ADMIN_URL=https://www.blogger.com
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_RECEIVER_EMAIL=
```

## Blogger integration

The website blog now reads posts directly from Blogger.

- `BLOGGER_SITE_URL` is required.
- The site fetches the public Blogger feed and renders posts on `/blog`.
- Individual posts are shown on `/blog/[slug]` using your website design.
- Visiting `/admin` redirects to `BLOGGER_ADMIN_URL` if set, otherwise to Blogger.

## Contact form

Set these for email delivery through Resend:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_RECEIVER_EMAIL`
