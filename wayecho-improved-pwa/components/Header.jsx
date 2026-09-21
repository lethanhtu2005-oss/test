"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useA11y } from "./A11yProvider";
import Logo from "./Logo";
import { ContrastIcon, TextSizeIcon, MenuIcon, UserIcon } from "./Icons";

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/explore", label: "Khám phá" },
  { href: "/search", label: "Tìm kiếm" },
  { href: "/my-trip", label: "Chuyến đi" },
  { href: "/booking", label: "Đặt chỗ" },
  { href: "/help", label: "Hỗ trợ" },
];

export default function Header() {
  const pathname = usePathname();
  const { contrast, largeText, toggleContrast, toggleLargeText } = useA11y();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith("/guide") || pathname.startsWith("/admin") || pathname.startsWith("/business")) return null;

  const NavLinks = ({ mobile = false }) => (
    <ul className={mobile ? "grid gap-1" : "flex items-center gap-1"}>
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-[44px] ${mobile ? "w-full" : ""} items-center rounded-xl px-3.5 text-[15px] font-semibold transition-colors ${active ? "bg-primary text-ink shadow-sm" : "text-ink hover:bg-surface-alt hover:underline"}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur hc-surface hc-border">
      <div className="container-page flex min-h-[72px] items-center justify-between gap-3 py-2">
        <Link href="/" aria-label="WayEcho — về trang chủ" className="flex items-center"><Logo height={31} /></Link>
        <nav aria-label="Điều hướng chính" className="hidden xl:block"><NavLinks /></nav>
        <div className="flex items-center gap-2" role="group" aria-label="Tùy chọn truy cập và tài khoản">
          <button type="button" onClick={toggleContrast} aria-pressed={contrast} className="hidden min-h-[44px] items-center gap-2 rounded-full border border-line bg-white px-4 font-semibold hc-surface hc-border lg:flex"><ContrastIcon size={18} /> Tương phản</button>
          <button type="button" onClick={toggleLargeText} aria-pressed={largeText} className="hidden min-h-[44px] items-center gap-2 rounded-full border border-line bg-white px-4 font-semibold hc-surface hc-border lg:flex"><TextSizeIcon size={18} /> Chữ lớn</button>
          <Link href="/profile" className="hidden min-h-[44px] items-center gap-2 rounded-full border-2 border-[#ef6d28] px-4 font-semibold text-[#c94d1b] hover:bg-[#fff2e9] lg:inline-flex"><UserIcon size={18} /> Đăng nhập</Link>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white hc-surface hc-border xl:hidden" aria-label={open ? "Đóng menu" : "Mở menu"}><MenuIcon size={22} /></button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white px-4 py-4 hc-surface hc-border xl:hidden">
          <div className="container-page !px-0">
            <nav aria-label="Điều hướng chính trên điện thoại"><NavLinks mobile /></nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={toggleContrast} aria-pressed={contrast} className="btn-ghost hc-border !px-3"><ContrastIcon size={19} /> Tương phản</button>
              <button type="button" onClick={toggleLargeText} aria-pressed={largeText} className="btn-ghost hc-border !px-3"><TextSizeIcon size={19} /> Chữ lớn</button>
            </div>
            <Link href="/profile" onClick={() => setOpen(false)} className="btn-primary mt-3 w-full"><UserIcon size={19} /> Đăng nhập</Link>
          </div>
        </div>
      )}
    </header>
  );
}
