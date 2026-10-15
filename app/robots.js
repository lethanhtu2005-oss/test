import { siteUrl, isPreview } from "@/lib/seo";
export default function robots() {
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/business",
        "/guide",
        "/api/",
        "/profile",
        "/my-trip",
        "/my-booking",
        "/booking",
        "/notifications",
        "/review",
        "/staff",
        "/assistant",
        "/navigation",
        "/sos",
        "/search",
        "/item",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
