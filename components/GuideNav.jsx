"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SOSLink from "./SOSLink";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { getGuide, DEMO_GUIDE_ID } from "@/data/guides";
import { endGuideSession } from "@/lib/guideSession";
import { GridIcon, CalendarIcon, UserIcon, CheckIcon } from "./Icons";

const TOP_LINKS = [
  { href: "/guide", label: "Tổng quan", icon: GridIcon, exact: true },
  { href: "/guide/bookings", label: "Booking", icon: CalendarIcon },
  { href: "/guide/schedule", label: "Lịch hỗ trợ", icon: CalendarIcon },
  { href: "/guide/profile", label: "Hồ sơ", icon: UserIcon },
];

const QUICK_LINKS = [
  { href: "/guide", label: "Tổng quan", icon: GridIcon, exact: true },
  { href: "/guide/schedule", label: "Lịch hỗ trợ", icon: CalendarIcon },
  { href: "/guide/profile", label: "Hồ sơ & Lịch rảnh", icon: UserIcon },
];

function BellIcon({ size = 20 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function ChevronDown({ size = 18 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
  );
}

function GearIcon({ size = 18 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.83 2.83-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-4v-.17a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-2.83-2.83.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3v-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06 2.83-2.83.06.06A1.65 1.65 0 0 0 8.92 4a1.65 1.65 0 0 0 1-1.51V2h4v.49a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 2.83 2.83-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21v4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
  );
}

function LockIcon({ size = 18 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  );
}

function HelpIcon({ size = 18 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 1 1 5.83 1c0 2-3 2-3 4" /><path d="M12 18h.01" /></svg>
  );
}

function LogOutIcon({ size = 18 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
  );
}

export default function GuideNav() {
  const pathname = usePathname();
  const g = getGuide(DEMO_GUIDE_ID);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onPointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const isActive = (link) => link.exact ? pathname === link.href : pathname.startsWith(link.href);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur hc-surface hc-border">
        <div className="container-page flex min-h-[68px] items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/guide" aria-label="WayEcho Guide Portal - Tổng quan"><Logo height={36} /></Link>
            <span className="hidden h-7 w-px bg-line sm:block" aria-hidden="true" />
            <span className="hidden font-semibold sm:inline">Guide Portal</span>
          </div>

          <nav aria-label="Điều hướng Guide Portal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {TOP_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isActive(link);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex min-h-[44px] items-center gap-2 rounded-pill px-4 text-sm font-semibold transition-colors ${active ? "bg-[#fff2dc] text-[#d96812]" : "hover:bg-surface-alt"}`}
                    >
                      <Icon size={17} /> {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2" ref={menuRef}><SOSLink />
            <button type="button" className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-surface-alt" aria-label="Thông báo">
              <BellIcon />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex min-h-[48px] items-center gap-3 rounded-xl px-2 text-left hover:bg-surface-alt"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2f95dc] font-bold text-white">{g.avatar}</span>
              <span className="hidden xl:block">
                <span className="block text-sm font-bold leading-tight">{g.name}</span>
                <span className="block text-xs text-ink-soft hc-muted">{g.role}</span>
              </span>
              <ChevronDown />
            </button>

            {menuOpen && (
              <div role="menu" aria-label="Menu tài khoản hướng dẫn viên" className="absolute right-4 top-[62px] w-72 rounded-2xl border border-line bg-white p-2 shadow-xl hc-surface hc-border sm:right-6 lg:right-12">
                <Link role="menuitem" href="/guide/profile" onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 hover:bg-surface-alt"><UserIcon size={19} /> Hồ sơ của tôi</Link>
                <Link role="menuitem" href="/guide/profile#settings" onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 hover:bg-surface-alt"><GearIcon /> Cài đặt tài khoản</Link>
                <Link role="menuitem" href="/guide/profile#security" onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 hover:bg-surface-alt"><LockIcon /> Bảo mật & mật khẩu</Link>
                <Link role="menuitem" href="/guide/notifications" onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 hover:bg-surface-alt"><BellIcon size={19} /> Thông báo</Link>
                <Link role="menuitem" href="/help" onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 hover:bg-surface-alt"><HelpIcon /> Trung tâm trợ giúp</Link>
                <div className="my-1 border-t border-line" />
                <Link role="menuitem" href="/" onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 hover:bg-surface-alt"><span aria-hidden="true">ⓘ</span> Về WayEcho</Link>
                <Link role="menuitem" href="/guide/login" onClick={async (event) => { event.preventDefault(); try { await endGuideSession(); window.location.assign("/guide/login"); } catch { window.alert("Chưa đăng xuất được. Hãy thử lại."); } }} className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 font-semibold text-red-700 hover:bg-red-50"><LogOutIcon /> Đăng xuất</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="border-b border-[#f1dfbf] bg-[#fff6e8] hc-surface hc-border">
        <div className="container-page relative overflow-hidden py-5">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] opacity-15 lg:block" aria-hidden="true" style={{ background: "radial-gradient(circle at 50% 40%, #f8ae38 0, transparent 55%)" }} />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2f95dc] text-3xl font-bold text-white">{g.avatar}</span>
              <div>
                <p className="text-sm text-ink-soft hc-muted">Hồ sơ hướng dẫn viên minh họa — DEMO</p>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl">{g.name}</h1>
                  {g.verified && <span className="inline-flex items-center gap-1 rounded-pill bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800"><CheckIcon size={14} /> Đã xác minh</span>}
                  {g.active && <span className="inline-flex items-center gap-1 rounded-pill bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800"><span className="h-2 w-2 rounded-full bg-green-600" /> Đang hoạt động</span>}
                </div>
                <p className="text-lg text-ink-soft hc-muted">{g.role}</p>
              </div>
            </div>
            <Link href="/" className="text-sm font-semibold text-[#1267a5] hover:underline">← Về WayEcho</Link>
          </div>

          <nav aria-label="Lối tắt Guide Portal" className="relative mt-5 flex flex-wrap gap-2 lg:hidden">
            {TOP_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link);
              return <Link key={link.href} href={link.href} className={`inline-flex min-h-[44px] items-center gap-2 rounded-pill px-4 text-sm font-semibold ${active ? "bg-primary" : "border border-line bg-white hc-surface hc-border"}`}><Icon size={17} />{link.label}</Link>;
            })}
          </nav>

          <nav aria-label="Truy cập nhanh" className="relative mt-5 hidden flex-wrap gap-2 lg:flex">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link);
              return <Link key={link.href} href={link.href} className={`inline-flex min-h-[46px] items-center gap-2 rounded-pill px-5 text-sm font-semibold ${active ? "bg-primary" : "border border-line bg-white hc-surface hc-border"}`}><Icon size={18} />{link.label}</Link>;
            })}
          </nav>
        </div>
      </section>
    </>
  );
}
