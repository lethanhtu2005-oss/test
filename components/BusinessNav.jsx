"use client";
import {useBusiness} from "@/components/BusinessShell";

import Link from "next/link";
import SOSLink from "./SOSLink";
import { usePathname } from "next/navigation";
import { getBusiness } from "@/data/businesses";
import { GridIcon, CalendarIcon, AccessibleIcon, BedIcon, UserIcon, StarIcon } from "./Icons";

const LINKS = [
  { href: "/business", label: "Tổng quan", icon: GridIcon, exact: true },
  { href: "/business/bookings", label: "Đặt chỗ", icon: CalendarIcon },
  { href: "/business/requests", label: "Yêu cầu hỗ trợ", icon: AccessibleIcon },
  { href: "/business/services", label: "Dịch vụ", icon: BedIcon },
  { href: "/business/reviews", label: "Đánh giá", icon: StarIcon },
  { href: "/business/profile", label: "Hồ sơ", icon: UserIcon },
];

export default function BusinessNav() {
  const {businessId}=useBusiness();
  const pathname = usePathname();
  const biz = getBusiness(businessId);

  return (
    <div className="border-b border-line bg-surface-alt hc-surface hc-border">
      <div className="container-page py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white"><UserIcon size={22} /></span>
            <div>
              <p className="text-sm text-ink-soft hc-muted">Cổng doanh nghiệp · phiên được kiểm tra tại server</p>
              <p className="font-display text-xl leading-none">{biz?.name}</p>
            </div>
          </div>
          <SOSLink />
          <Link href="/" className="btn-ghost hc-border !py-2 text-sm">← Về trang Traveler</Link>
        </div>
        <nav aria-label="Điều hướng doanh nghiệp" className="mt-4 flex flex-wrap gap-2">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-pill px-4 text-sm font-semibold transition-colors ${
                  active ? "bg-primary text-ink" : "border border-line bg-white text-ink hover:bg-white/60 hc-surface hc-border"
                }`}
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
