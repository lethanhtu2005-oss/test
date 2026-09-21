"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { DEMO_BUSINESS_ID, getBusiness } from "@/data/businesses";
import { CalendarIcon, AccessibleIcon, StarIcon, BedIcon } from "@/components/Icons";

function money(list) {
  const sum = list.reduce((acc, b) => acc + (parseInt(String(b.price || "").replace(/\D/g, ""), 10) || 0), 0);
  return sum.toLocaleString("vi-VN") + "đ";
}

export default function BusinessDashboard() {
  const biz = getBusiness(DEMO_BUSINESS_ID);
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.listBusinessBookings(DEMO_BUSINESS_ID),
      api.listRequests(DEMO_BUSINESS_ID),
      api.listNotifications({ role: "business", business: DEMO_BUSINESS_ID }),
    ]).then(([b, r, n]) => { setBookings(b); setRequests(r); setNotifs(n); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const pendingReq = requests.filter((r) => r.status === "pending").length;

  const STATS = [
    { icon: CalendarIcon, num: bookings.length, label: "Tổng đặt chỗ" },
    { icon: AccessibleIcon, num: pendingReq, label: "Yêu cầu hỗ trợ chờ xử lý" },
    { icon: StarIcon, num: money(bookings), label: "Giá trị booking demo" },
    { icon: BedIcon, num: biz?.items.length || 0, label: "Dịch vụ demo đã tạo" },
  ];

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Tổng quan</h1>
      <p className="hc-muted mt-2 text-lg text-ink-soft">Cổng Business Partner mẫu của {biz?.name}. Toàn bộ dữ liệu hiện là demo, chưa phải doanh nghiệp đã xác minh.</p>

      {loading ? <p className="mt-8 text-ink-soft">Đang tải…</p> : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="card hc-surface hc-border p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-ink"><s.icon size={22} /></span>
                <p className="mt-3 font-display text-3xl">{s.num}</p>
                <p className="hc-muted text-sm text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="card hc-surface hc-border p-6" aria-labelledby="act">
              <div className="flex items-center justify-between">
                <h2 id="act" className="text-2xl">Hoạt động gần đây</h2>
                <Link href="/business/bookings" className="text-sm font-semibold text-accent-dark hover:underline">Xem đặt chỗ →</Link>
              </div>
              {notifs.length === 0 ? (
                <p className="hc-muted mt-3 text-ink-soft">Chưa có hoạt động. Khi khách đặt dịch vụ, thông báo sẽ hiện ở đây.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {notifs.slice(0, 6).map((n) => (
                    <li key={n.id} className="flex items-start gap-2 rounded-xl bg-surface-alt p-3 hc-surface hc-border">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.type === "accessibility_request" ? "bg-orange-500" : "bg-primary"}`} />
                      <span>{n.message}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card hc-surface hc-border p-6" aria-labelledby="req">
              <div className="flex items-center justify-between">
                <h2 id="req" className="text-2xl">Yêu cầu hỗ trợ</h2>
                <Link href="/business/requests" className="text-sm font-semibold text-accent-dark hover:underline">Xử lý →</Link>
              </div>
              {pendingReq === 0 ? (
                <p className="hc-muted mt-3 text-ink-soft">Không có yêu cầu nào đang chờ.</p>
              ) : (
                <p className="mt-3 text-lg"><strong className="text-orange-600">{pendingReq}</strong> yêu cầu hỗ trợ tiếp cận đang chờ bạn xác nhận.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
