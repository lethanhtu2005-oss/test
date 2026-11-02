"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SOSLink from "./SOSLink";
import Logo from "./Logo";
import ThemeControl from "./ThemeControl";
import { useA11y } from "./A11yProvider";
import { AccessibleIcon, ContrastIcon, TextSizeIcon, MenuIcon, UserIcon, SpeakerIcon, MicIcon } from "./Icons";

const NAV = [
  { href: "/destination", label: "Điểm đến" },
  { href: "/explore", label: "Dịch vụ", links: [["Lưu trú", "/explore?cat=accommodation"], ["Di chuyển", "/explore?cat=transport"], ["Ẩm thực", "/explore?cat=restaurant"], ["Đặt chỗ", "/booking"], ["Chuyến đi của tôi", "/my-trip"]] },
  { href: "/articles", label: "Blog & Trải nghiệm" },
  { href: "/help", label: "Hỗ trợ", links: [["Hướng dẫn sử dụng", "/help"], ["Hồ sơ trợ năng", "/profile"], ["Liên hệ", "/help#contact"]] },
  { href: "/partners/business", label: "Đối tác" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { contrast, largeText, reduceMotion, toggleContrast, toggleLargeText, toggleReduceMotion, speak, stop } = useA11y();
  const [open, setOpen] = useState(false);
  const accessRef = useRef(null);
  if (pathname.startsWith("/guide") || pathname.startsWith("/admin") || pathname.startsWith("/business")) return null;

  function listenPage() {
    const text = (document.getElementById("main")?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 900);
    speak(text || "Chưa có nội dung để đọc.");
  }
  function closeMenu() { setOpen(false); document.querySelectorAll("header details[open]").forEach((el) => { el.open = false; }); }
  const navLinks = (mobile = false) => <ul className={mobile ? "grid gap-1" : "flex items-center gap-1"}>{NAV.map((item) => <li key={item.label}>
    {item.links ? <details className="group relative"><summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full px-4 font-semibold text-ink-soft transition hover:bg-[#fff3df] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-dark">{item.label}<span aria-hidden="true" className="ml-2 text-xs">⌄</span></summary><ul className={`${mobile ? "ml-3 mt-1" : "absolute left-0 top-full z-50 mt-2 w-60"} grid gap-1 rounded-2xl border border-line bg-white p-2 shadow-card-hover hc-surface hc-border`}><li><Link href={item.href} onClick={closeMenu} className="flex min-h-11 items-center rounded-xl px-3 font-bold hover:bg-surface-alt">Xem tất cả {item.label.toLowerCase()}</Link></li>{item.links.map(([label, href]) => <li key={label}><Link href={href} onClick={closeMenu} className="flex min-h-11 items-center rounded-xl px-3 hover:bg-surface-alt">{label}</Link></li>)}</ul></details> : <Link href={item.href} onClick={closeMenu} aria-current={pathname === item.href ? "page" : undefined} className="inline-flex min-h-11 items-center rounded-full px-4 font-semibold text-ink-soft transition hover:bg-[#fff3df] hover:text-ink">{item.label}</Link>}
  </li>)}</ul>;

  return <header className="sticky top-0 z-40 border-b border-[#eadfcd] bg-[#fffdf9]/95 backdrop-blur-xl hc-surface hc-border">
    <div className="container-page flex min-h-[76px] items-center justify-between gap-3 py-2">
      <Link href="/" aria-label="WayEcho — về trang chủ" className="shrink-0"><Logo height={34} /></Link>
      <nav aria-label="Điều hướng chính" className="hidden xl:block">{navLinks()}</nav>
      <div className="flex shrink-0 items-center gap-2">
        <details className="relative" ref={accessRef} onKeyDown={(e) => { if (e.key === "Escape") { e.currentTarget.open = false; e.currentTarget.querySelector("summary")?.focus(); } }}>
          <summary aria-label="Tùy chỉnh trợ năng" className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-[#e8d8bf] bg-white px-3 font-semibold shadow-sm hover:bg-[#fff6e8] hc-surface hc-border"><AccessibleIcon size={20} /><span className="hidden sm:inline">Trợ năng</span><span aria-hidden="true">⌄</span></summary>
          <div className="absolute right-0 top-full z-50 mt-2 max-h-[min(75dvh,560px)] w-[min(340px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-white p-4 shadow-card-hover hc-surface hc-border">
            <h2 className="mb-3 text-lg font-bold">Tùy chỉnh trải nghiệm</h2><div className="space-y-2"><ThemeControl />
              <button onClick={toggleContrast} aria-pressed={contrast} className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-line p-3 text-left font-semibold hover:bg-surface-alt hc-border"><ContrastIcon size={19} /> Tương phản cao <span className="ml-auto text-sm">{contrast ? "Bật" : "Tắt"}</span></button>
              <button onClick={toggleLargeText} aria-pressed={largeText} className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-line p-3 text-left font-semibold hover:bg-surface-alt hc-border"><TextSizeIcon size={19} /> Chữ lớn <span className="ml-auto text-sm">{largeText ? "Bật" : "Tắt"}</span></button>
              <button onClick={toggleReduceMotion} aria-pressed={reduceMotion} className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-line p-3 text-left font-semibold hover:bg-surface-alt hc-border"><AccessibleIcon size={19} /> Giảm chuyển động <span className="ml-auto text-sm">{reduceMotion ? "Bật" : "Tắt"}</span></button>
              <button onClick={listenPage} className="btn-primary w-full !min-h-11"><SpeakerIcon size={18} /> Nghe nội dung trang</button><button onClick={stop} className="btn-ghost w-full !min-h-11 hc-border">Dừng đọc</button>
              <button onClick={() => { accessRef.current.open = false; router.push("/search"); }} className="btn-ghost w-full !min-h-11 hc-border"><MicIcon size={18} /> Tìm kiếm bằng giọng nói</button>
            </div>
          </div>
        </details>
        <div className="hidden lg:block"><SOSLink /></div>
        <Link href="/login" className="hidden min-h-11 items-center gap-2 rounded-full bg-[#e85f28] px-4 font-bold text-white shadow-sm transition hover:bg-[#c84a1c] lg:inline-flex"><UserIcon size={18} /> Đăng nhập</Link>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white hc-surface hc-border xl:hidden" aria-label={open ? "Đóng menu" : "Mở menu"}><MenuIcon size={22} /></button>
      </div>
    </div>
    {open && <div id="mobile-menu" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-line bg-white px-4 pb-6 pt-3 hc-surface hc-border xl:hidden"><div className="container-page !px-0"><nav aria-label="Điều hướng chính trên điện thoại">{navLinks(true)}</nav><div className="mt-3 grid grid-cols-2 gap-2"><SOSLink /><Link href="/login" onClick={closeMenu} className="btn-primary !min-h-11"><UserIcon size={18} /> Đăng nhập</Link></div></div></div>}
  </header>;
}

