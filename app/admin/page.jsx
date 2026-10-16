"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { businesses } from "@/data/businesses";
import { guides } from "@/data/guides";
import { UserIcon, CalendarIcon, StarIcon, AccessibleIcon } from "@/components/Icons";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    Promise.all([api.listBookings(), api.listReviews(), api.listRequests()])
      .then(([b, r, q]) => { setBookings(b); setReviews(r); setRequests(q); }).catch(() => {});
  }, []);

  const STATS = [
    { icon: UserIcon, num: businesses.length, label: "Doanh nghiệp" },
    { icon: AccessibleIcon, num: guides.length, label: "Hướng dẫn viên" },
    { icon: CalendarIcon, num: bookings.length, label: "Tổng đặt chỗ" },
    { icon: StarIcon, num: reviews.length, label: "Đánh giá" },
    { icon: AccessibleIcon, num: requests.length, label: "Yêu cầu hỗ trợ" },
  ];

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Tổng quan hệ thống</h1>
      <p className="hc-muted mt-2 text-lg text-ink-soft">Toàn cảnh hoạt động của nền tảng WayEcho.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {STATS.map((s) => (
          <div key={s.label} className="card hc-surface hc-border p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-ink"><s.icon size={22} /></span>
            <p className="mt-3 font-display text-3xl">{s.num}</p>
            <p className="hc-muted text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/businesses" className="card hc-surface hc-border p-6 hover:shadow-card-hover">
          <h2 className="text-xl">Xác minh doanh nghiệp →</h2>
          <p className="hc-muted mt-1 text-ink-soft">Duyệt hồ sơ, xác minh, tạm ngưng đối tác.</p>
        </Link>
        <Link href="/admin/moderation" className="card hc-surface hc-border p-6 hover:shadow-card-hover">
          <h2 className="text-xl">Kiểm duyệt →</h2>
          <p className="hc-muted mt-1 text-ink-soft">Duyệt đánh giá và dữ liệu accessibility.</p>
        </Link>
        <div className="card hc-surface hc-border p-6">
          <h2 className="text-xl">Giám sát SOS</h2>
          <p className="hc-muted mt-1 text-ink-soft">Chưa có sự cố SOS nào (demo).</p>
        </div>
      </div>
    </div>
  );
}
