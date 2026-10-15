// NEXT_PUBLIC_SITE_URL must be the final public domain, never a preview URL.
const configured =
  process.env.NEXT_PUBLIC_SITE_URL || "https://test-qhoodmhu3-ltt17.vercel.app";
export const isPreview = process.env.VERCEL_ENV === "preview";
export const siteUrl = new URL(configured).origin;
export function pageMetadata(title, description, path, image) {
  return {
    ...(isPreview ? { robots: { index: false, follow: false } } : {}),
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | WayEcho`,
      description,
      url: path,
      siteName: "WayEcho",
      locale: "vi_VN",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
export const privateRobots = { index: false, follow: false };
