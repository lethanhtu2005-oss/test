import Link from "next/link";
import { destinations } from "@/data/destinations";
import { articles } from "@/data/articles";
import { topics } from "@/data/topics";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Sơ đồ website",
  "Tìm điểm đến, cẩm nang, thông tin tiếp cận và các trang giới thiệu WayEcho.",
  "/sitemap",
);
export default function SiteMapPage() {
  const groups = [
    {
      title: "Khám phá WayEcho",
      items: [
        ["/", "Trang chủ"],
        ["/about", "Về WayEcho"],
        ["/explore", "Khám phá"],
        ["/articles", "Cẩm nang"],
        ["/help", "Trợ giúp"],
        ["/privacy", "Bảo mật"],
        ["/terms", "Điều khoản"],
      ],
    },
    {
      title: "Điểm đến",
      items: destinations.map((d) => [`/destination/${d.slug}`, d.name]),
    },
    {
      title: "Cẩm nang",
      items: articles.map((a) => [`/articles/${a.slug}`, a.title]),
    },
    {
      title: "Hỗ trợ & kiến thức",
      items: topics.map((t) => [`/explore/${t.slug}`, t.title]),
    },
  ];
  return (
    <div className="container-page py-10">
      <h1 className="text-4xl">Sơ đồ website WayEcho</h1>
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="text-2xl">{g.title}</h2>
            <ul className="mt-4">
              {g.items.map(([href, title]) => (
                <li key={href}>
                  <Link href={href} className="text-link">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
