"use client";

import { useState } from "react";
import Link from "next/link";
import SOSLink from "./SOSLink";
import { usePathname } from "next/navigation";
import { useA11y } from "./A11yProvider";
import Logo from "./Logo";
import { ContrastIcon, TextSizeIcon, MenuIcon, UserIcon } from "./Icons";

const NAV = [
 {href:"/explore",label:"Khám phá",links:[["Danh sách điểm đến","/destination"],["Tìm kiếm","/search"],["Bản đồ demo","/navigation"]]},
 {href:"/explore?cat=accommodation",label:"Dịch vụ",links:[["Lưu trú — DEMO","/explore?cat=accommodation"],["Di chuyển — DEMO","/explore?cat=transport"],["Guide & Assistant — DEMO","/item?id=demo-guide-tour"],["Thông tin chó dẫn đường","/services/guide-dogs"],["Thử đặt chỗ DEMO","/booking"],["Đặt chỗ của tôi","/my-booking"],["Chuyến đi của tôi","/my-trip"]]},
 {href:"/articles",label:"Cẩm nang"},
 {href:"/help",label:"Hỗ trợ",links:[["Hồ sơ và trợ năng","/profile"],["SOS — DEMO","/sos"]]},
 {href:"/partners/business",label:"Đối tác",links:[["Doanh nghiệp","/partners/business"],["Guide & Assistant","/partners/guide"],["Hợp tác cùng WayEcho","/partners/cooperate"]]},
];

export default function Header() {
  const pathname = usePathname();
  const { contrast, largeText, toggleContrast, toggleLargeText } = useA11y();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith("/guide") || pathname.startsWith("/admin") || pathname.startsWith("/business")) return null;

  function closeLink(event){event.currentTarget.closest("details")?.removeAttribute("open");setOpen(false);}
  const renderNavLinks=(mobile=false)=><ul className={mobile?"grid gap-1":"flex items-center gap-1"}>{NAV.map(item=><li key={item.label}>{item.links?<details className="relative" onKeyDown={event=>{if(event.key==="Escape"){event.currentTarget.open=false;event.currentTarget.querySelector("summary")?.focus();}}}><summary className="flex min-h-[44px] cursor-pointer items-center rounded-xl px-3 font-semibold hover:bg-surface-alt" aria-label={`Mở nhóm ${item.label}`}>{item.label} <span aria-hidden="true" className="ml-1">⌄</span></summary><ul className={`${mobile?"ml-3":"absolute left-0 top-full z-50 w-64"} grid gap-1 rounded-xl border border-line bg-white p-2 shadow-card hc-surface hc-border`}><li><Link href={item.href} onClick={closeLink} className="flex min-h-[44px] items-center rounded-lg px-3 font-semibold hover:bg-surface-alt">{item.label}</Link></li>{item.links.map(([label,href])=><li key={label}><Link href={href} onClick={closeLink} className="flex min-h-[44px] items-center rounded-lg px-3 hover:bg-surface-alt">{label}</Link></li>)}</ul></details>:<Link href={item.href} onClick={closeLink} aria-current={pathname===item.href?"page":undefined} className="inline-flex min-h-[44px] items-center rounded-xl px-3 font-semibold hover:bg-surface-alt">{item.label}</Link>}</li>)}</ul>;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur hc-surface hc-border">
      <div className="container-page flex min-h-[72px] items-center justify-between gap-3 py-2">
        <Link href="/" aria-label="WayEcho — về trang chủ" className="flex items-center"><Logo height={31} /></Link>
        <nav aria-label="Điều hướng chính" className="hidden xl:block">{renderNavLinks()}</nav>
        <div className="flex items-center gap-2" role="group" aria-label="Tùy chọn truy cập và tài khoản">
          <SOSLink />
          <button type="button" onClick={toggleContrast} aria-pressed={contrast} className="hidden min-h-[44px] items-center gap-2 rounded-full border border-line bg-white px-4 font-semibold hc-surface hc-border lg:flex"><ContrastIcon size={18} /> Tương phản</button>
          <button type="button" onClick={toggleLargeText} aria-pressed={largeText} className="hidden min-h-[44px] items-center gap-2 rounded-full border border-line bg-white px-4 font-semibold hc-surface hc-border lg:flex"><TextSizeIcon size={18} /> Chữ lớn</button>
          <Link href="/login" className="hidden min-h-[44px] items-center gap-2 rounded-full border-2 border-[#ef6d28] px-4 font-semibold text-[#b8461a] hover:bg-[#fff2e9] lg:inline-flex"><UserIcon size={18} /> Đăng nhập</Link>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white hc-surface hc-border xl:hidden" aria-label={open ? "Đóng menu" : "Mở menu"}><MenuIcon size={22} /></button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white px-4 py-4 hc-surface hc-border xl:hidden">
          <div className="container-page !px-0">
            <nav aria-label="Điều hướng chính trên điện thoại">{renderNavLinks(true)}</nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <SOSLink />
          <button type="button" onClick={toggleContrast} aria-pressed={contrast} className="btn-ghost hc-border !px-3"><ContrastIcon size={19} /> Tương phản</button>
              <button type="button" onClick={toggleLargeText} aria-pressed={largeText} className="btn-ghost hc-border !px-3"><TextSizeIcon size={19} /> Chữ lớn</button>
            </div>
            <Link href="/login" onClick={() => setOpen(false)} className="btn-primary mt-3 w-full"><UserIcon size={19} /> Đăng nhập</Link>
          </div>
        </div>
      )}
    </header>
  );
}
