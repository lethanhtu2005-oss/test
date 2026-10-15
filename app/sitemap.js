import { destinations } from "@/data/destinations";
import { articles } from "@/data/articles";
import { topics } from "@/data/topics";
import { siteUrl } from "@/lib/seo";
export default function sitemap() {
  const paths = [
    "/",
    "/about",
    "/explore",
    "/destination",
    "/articles",
    "/help",
    "/privacy",
    "/terms",
    "/sitemap",
    ...destinations.map((d) => `/destination/${d.slug}`),
    ...articles.map((a) => `/articles/${a.slug}`),
    ...topics.map((t) => `/explore/${t.slug}`),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
