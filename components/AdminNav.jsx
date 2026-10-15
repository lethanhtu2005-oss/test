"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, UserIcon, StarIcon, AccessibleIcon } from "./Icons";

const LINKS = [
  { href: "/admin/ads", label: "Quảng cáo", icon: GridIcon },
  { href: "/admin", label: "Tổng quan", icon: GridIcon, exact: true },
  { href: "/admin/businesses", label: "Doanh nghiệp", icon: UserIcon },
  { href: "/admin/moderation", label: "Kiểm duyệt", icon: StarIcon },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="border-b border-line bg-black text-white">
      <div className="container-page py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-ink">
              <AccessibleIcon size={22} />
            </span>
            <div>
              <p className="text-sm text-neutral-400">
                Bảng quản trị · đăng nhập demo
              </p>
              <p className="font-display text-xl leading-none">WayEcho Admin</p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-pill border border-neutral-600 px-4 py-2 text-sm font-semibold hover:bg-neutral-800"
          >
            ← Về trang Traveler
          </Link>
        </div>
        <nav
          aria-label="Điều hướng quản trị"
          className="mt-4 flex flex-wrap gap-2"
        >
          {LINKS.map((l) => {
            const active = l.exact
              ? pathname === l.href
              : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-pill px-4 text-sm font-semibold transition-colors ${active ? "bg-primary text-ink" : "border border-neutral-600 text-white hover:bg-neutral-800"}`}
              >
                <l.icon size={18} /> {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
