const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const envBloggerAdminUrl = process.env.BLOGGER_ADMIN_URL;

export const siteConfig = {
  name: "AIKaFanda",
  url: envSiteUrl || "https://aikafanda.com",
  description:
    "AIKaFanda provides artificial intelligence, automation, web development, mobile application and technology solutions.",
  blogUrl: `${envSiteUrl || "https://aikafanda.com"}/blog`,
  adminUrl: envBloggerAdminUrl || "https://www.blogger.com",
  rssUrl: `${envSiteUrl || "https://aikafanda.com"}/rss.xml`,
};
