const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteConfig = {
  name: "AIKaFanda",
  url: envSiteUrl || "https://aikafanda.com",
  description:
    "AIKaFanda provides artificial intelligence, automation, web development, mobile application and technology solutions.",
  blogUrl: `${envSiteUrl || "https://aikafanda.com"}/blog`,
  adminUrl: `${envSiteUrl || "https://aikafanda.com"}/admin`,
  rssUrl: `${envSiteUrl || "https://aikafanda.com"}/rss.xml`,
};
