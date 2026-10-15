"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getGuide, DEMO_GUIDE_ID, guideAssignments } from "@/data/guides";
import { CalendarIcon, StarIcon, AccessibleIcon, CheckIcon, MapPinIcon } from "@/components/Icons";
import { useA11y } from "@/components/A11yProvider";

export default function GuideDashboard() {
  const g = getGuide(DEMO_GUIDE_ID);
  const { speak } = useA11y();
  const [items, setItems] = useState(guideAssignments);
  const pending = items.filter((a) => a.status === "pending").length;

  const stats = [
    { icon: CalendarIcon, num: items.length, label: "Lịch hỗ trợ" },
    { icon: AccessibleIcon, num: pending, label: "Chờ xác nhận" },
    { icon: StarIcon, num: g.rating ?? "—", label: "Đánh giá trung bình" },
  ];

  function accept(id) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: "accepted" } : item));
    speak("Đã xác nhận lịch hỗ trợ.");
  }

  return (
    <div className="container-page py-8 sm:py-10">
      <h2 className="text-4xl sm:text-5xl">Tổng quan</h2>
      <p className="hc-muted mt-2 text-lg text-ink-soft">Xin chào, Lê Thanh Tú. Đây là hoạt động hỗ trợ của bạn hôm nay.</p>

      <section aria-label="Thống kê Guide" className="mt-7 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card hc-surface hc-border p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-ink"><stat.icon size={23} /></span>
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff7e8] text-lg">›</span>
            </div>
            <p className="mt-3 font-display text-4xl">{stat.num}</p>
            <p className="hc-muted text-sm text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-8" aria-labelledby="upcoming-title">
        <div className="flex items-center justify-between gap-3">
          <h3 id="upcoming-title" className="text-2xl">Lịch sắp tới</h3>
          <Link href="/guide/schedule" className="text-sm font-semibold text-[#1267a5] hover:underline">Xem tất cả →</Link>
        </div>

        <ul className="mt-4 space-y-3">
          {items.map((a) => (
            <li key={a.id} className="card hc-surface hc-border overflow-hidden p-3 sm:p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="relative hidden h-24 w-36 shrink-0 overflow-hidden rounded-xl sm:block">
                    <Image src={a.image} alt={a.imageAlt} fill sizes="144px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold">{a.service}</p>
                    <p className="hc-muted mt-1 text-sm text-ink-soft">{a.traveler}</p>
                    <div className="hc-muted mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
                      <span className="inline-flex items-center gap-1"><CalendarIcon size={15} /> {a.date}</span>
                      <span>{a.period} {a.time}</span>
                      <span className="inline-flex items-center gap-1"><MapPinIcon size={15} /> {a.location}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {a.accessibility.map((tag) => <span key={tag} className="rounded-pill bg-[#fff1dd] px-3 py-1 text-xs font-semibold text-[#b75a12]">{tag}</span>)}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                  <span className={`rounded-pill px-3 py-1 text-xs font-bold ${a.status === "accepted" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{a.status === "accepted" ? "Đã nhận" : "Chờ"}</span>
                  <Link href={`/guide/bookings#${a.id}`} className="btn-ghost hc-border !min-h-[42px] !py-2 text-sm">Xem chi tiết</Link>
                  {a.status === "pending" && <button type="button" onClick={() => accept(a.id)} className="btn-primary !min-h-[42px] !py-2 text-sm"><CheckIcon size={17} /> Xác nhận</button>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
