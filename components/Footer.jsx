"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { PhoneIcon } from "./FooterIcons";

const linkClass = "inline-flex min-h-[34px] items-center text-sm text-neutral-300 transition-colors hover:text-primary hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

function SocialBadge({ label, children }) {
  return <span className="flex h-10 min-w-10 items-center justify-center rounded-full border border-neutral-600 bg-neutral-800 px-2 text-sm font-black text-white" aria-label={`${label} - kênh minh họa trong prototype`} role="img" title={`${label} (demo)`}>{children}</span>;
}

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/guide") || pathname.startsWith("/admin") || pathname.startsWith("/business")) return null;

  return (
    <footer className="mt-0 bg-[#07121f] text-white" aria-label="Chân trang WayEcho">
      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-9 lg:grid-cols-[1.25fr_.8fr_1fr_1fr_1fr]">
          <section className="lg:pr-8" aria-labelledby="footer-brand-title">
            <h2 id="footer-brand-title" className="sr-only">WayEcho</h2>
            <Logo tagline dark height={42} />
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-300">WayEcho giúp người khiếm thị khám phá Hà Nội dễ dàng hơn bằng giọng nói. Cùng nhau, chúng ta kiến tạo một Hà Nội thân thiện, dễ tiếp cận và trọn vẹn hơn cho mọi người.</p>
            <p className="mt-5 flex items-center gap-3 font-quote italic text-neutral-300"><span aria-hidden="true" className="inline-block h-[4px] w-10 rounded-full bg-primary" /> Hà Nội gần hơn, cho mọi người!</p>
          </section>

          <nav aria-label="Khám phá">
            <p className="mb-4 text-lg font-bold text-primary">Khám phá</p>
            <ul className="space-y-1"><li><Link className={linkClass} href="/explore">Điểm đến & dịch vụ</Link></li><li><Link className={linkClass} href="/my-trip">Chuyến đi của tôi</Link></li><li><Link className={linkClass} href="/navigation">Bản đồ tiếp cận</Link></li><li><Link className={linkClass} href="/guide/login">Hướng dẫn viên & trợ lý</Link></li></ul>
          </nav>

          <nav aria-label="Hỗ trợ và Accessibility">
            <p className="mb-4 text-lg font-bold text-primary">Hỗ trợ & Accessibility</p>
            <ul className="space-y-1"><li><Link className={linkClass} href="/help">Trung tâm trợ giúp</Link></li><li><Link className={linkClass} href="/help#a11y">Tuyên bố tiếp cận</Link></li><li><Link className={linkClass} href="/profile">Cài đặt trợ năng</Link></li><li><Link className={linkClass} href="/help#contact">Liên hệ với chúng tôi</Link></li><li><Link className={linkClass} href="/privacy">Chính sách bảo mật</Link></li><li><Link className={linkClass} href="/terms">Điều khoản sử dụng</Link></li></ul>
          </nav>

          <nav aria-label="Đối tác">
            <p className="mb-4 text-lg font-bold text-primary">Đối tác</p>
            <ul className="space-y-1"><li><Link className={linkClass} href="/business">Dành cho doanh nghiệp</Link></li><li><Link className={linkClass} href="/guide/login">Dành cho Guide & Assistant</Link></li><li><Link className={linkClass} href="/guide/register">Hợp tác cùng WayEcho</Link></li></ul>
          </nav>

          <section aria-labelledby="footer-connect-title">
            <h2 id="footer-connect-title" className="mb-4 text-lg font-bold text-primary">Kết nối với chúng tôi</h2>
            <div className="flex flex-wrap gap-2" aria-label="Các kênh mạng xã hội minh họa"><SocialBadge label="Facebook">f</SocialBadge><SocialBadge label="YouTube">▶</SocialBadge><SocialBadge label="Instagram">◎</SocialBadge><SocialBadge label="TikTok">♪</SocialBadge><SocialBadge label="LinkedIn">in</SocialBadge></div>
            <Link href="/sos" className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#ff5b2f] px-5 py-3 font-bold text-white transition hover:bg-[#ff7048] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><PhoneIcon /> Gọi SOS <span aria-hidden="true">›</span></Link>
            <p className="mt-3 text-center text-xs text-neutral-400">Yêu cầu hỗ trợ khẩn cấp khi cần</p>
          </section>
        </div>

        <div className="mt-9 border-t border-neutral-700 pt-5">
          <div className="flex flex-col gap-3 text-xs text-neutral-400 lg:flex-row lg:items-center lg:justify-between">
            <p>© 2026 WayEcho. Mọi quyền được bảo lưu.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 lg:justify-end"><Link href="/privacy" className="hover:text-primary hover:underline">Chính sách bảo mật</Link><span aria-hidden="true">|</span><Link href="/terms" className="hover:text-primary hover:underline">Điều khoản sử dụng</Link><span aria-hidden="true">|</span><Link href="/help#credits" className="hover:text-primary hover:underline">Nguồn hình ảnh</Link><span aria-hidden="true">|</span><Link href="/staff" className="text-neutral-500 hover:text-neutral-300 hover:underline">Staff</Link></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
