import { siteOrigin } from "@/lib/seo";
import { destinations } from "@/data/destinations";
import { articles } from "@/data/articles";

export default function sitemap() {
  const origin = siteOrigin();
  if (!origin) return [];

  const staticRoutes = [
    "/",
    "/explore",
    "/destination",
    "/help",
    "/articles",
    "/partners/business",
    "/partners/guide",
    "/partners/cooperate",
  ];

  const destinationRoutes = destinations.map((d) => `/diem-den/${encodeURIComponent(d.slug)}`);
  const articleRoutes = articles.map((a) => `/articles/${encodeURIComponent(a.slug)}`);

  return [...staticRoutes, ...destinationRoutes, ...articleRoutes].map((path) => ({
    url: new URL(path, origin).href,
    lastModified: new Date().toISOString(),
  }));
}
