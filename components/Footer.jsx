"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
const groups = [
  {
    title: "Khám phá",
    links: [
      ["/explore", "Điểm đến & dịch vụ"],
      ["/articles", "Cẩm nang du lịch"],
      ["/explore/guide-dogs", "Chó dẫn đường"],
      ["/about", "Về WayEcho"],
    ],
  },
  {
    title: "Hành trình của bạn",
    links: [
      ["/search", "Tìm kiếm bằng giọng nói"],
      ["/my-trip", "Chuyến đi đã lưu"],
      ["/booking", "Đặt dịch vụ demo"],
      ["/navigation", "Bản đồ demo"],
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      ["/help", "Trợ giúp & giới hạn demo"],
      ["/profile", "Cài đặt tiếp cận"],
      ["/privacy", "Chính sách bảo mật"],
      ["/terms", "Điều khoản sử dụng"],
      ["/staff", "Cổng đối tác & quản trị"],
    ],
  },
];
export default function Footer() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/guide") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/business")
  )
    return null;
  return (
    <footer className="journey-footer">
      <div className="container-page">
        <div className="footer-grid">
          <div>
            <Link href="/" aria-label="WayEcho — trang chủ">
              <Logo dark height={34} />
            </Link>
            <p className="mt-4">
              Thông tin rõ ràng. Lựa chọn chủ động. Những hành trình mở ra cho
              nhiều người hơn.
            </p>
            <Link className="mt-3" href="/about#image-credits">
              Nguồn hình ảnh ↗
            </Link>
          </div>
          {groups.map((g) => (
            <nav aria-label={g.title} key={g.title}>
              <h2>{g.title}</h2>
              <ul>
                {g.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-8 border-t border-neutral-600 pt-5 flex flex-wrap justify-between gap-4">
          <p>© 2026 WayEcho · Prototype</p>
          <Link href="/help#a11y">Tuyên bố tiếp cận</Link>
          <Link href="/sitemap">Sơ đồ website</Link>
        </div>
      </div>
    </footer>
  );
}
