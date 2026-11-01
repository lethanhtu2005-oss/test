"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompassIcon, GridIcon, CalendarIcon, PhoneIcon, UserIcon } from "./Icons";

const ITEMS = [
  { href: "/explore", label: "Khám phá", icon: GridIcon },
  { href: "/navigation", label: "Đi đường", icon: CompassIcon },
  { href: "/my-trip", label: "Chuyến đi", icon: CalendarIcon },
  { href: "/sos", label: "SOS", icon: PhoneIcon, danger: true },
  { href: "/profile", label: "Hồ sơ", icon: UserIcon },
];

export default function MobileNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/guide")) return null;
  return (
    <nav aria-label="Điều hướng ứng dụng trên điện thoại" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden hc-surface hc-border">
      <ul className="grid grid-cols-5 gap-1">
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold ${
                  item.danger ? "text-red-700" : active ? "bg-surface-alt text-ink" : "text-ink-soft hc-muted"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
