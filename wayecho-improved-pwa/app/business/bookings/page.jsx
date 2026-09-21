"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEMO_BUSINESS_ID } from "@/data/businesses";
import { CalendarIcon, AccessibleIcon, CheckIcon } from "@/components/Icons";

const STATUS = {
  confirmed: ["Đã xác nhận", "bg-green-100 text-green-900"],
  pending: ["Chờ xác nhận", "bg-amber-100 text-amber-900"],
  rejected: ["Đã từ chối", "bg-red-100 text-red-900"],
  cancelled: ["Đã hủy", "bg-neutral-200 text-neutral-800"],
  demo: ["Demo", "bg-neutral-100 text-neutral-800"],
};

export default function BusinessBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  useEffect(() => { api.listBusinessBookings(DEMO_BUSINESS_ID).then(setBookings).catch(() => {}).finally(() => setLoading(false)); }, []);
  async function decide(id, status) { setBusy(id); try { const updated = await api.updateBooking(id, status); setBookings((xs) => xs.map((x) => x.id === id ? updated : x)); } finally { setBusy(null); } }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Booking Management</h1>
      <p className="hc-muted mt-2 text-lg text-ink-soft">Booking demo gửi tới Business để mô phỏng BR06. Business có thể confirm/reject và Traveler nhận notification về thay đổi trạng thái.</p>
      {loading ? <p className="mt-8 text-ink-soft">Đang tải…</p> : bookings.length === 0 ? (
        <div className="mt-8 rounded-[18px] border border-line bg-white p-8 text-center hc-surface hc-border"><p className="text-lg">Chưa có booking nào.</p><p className="hc-muted mt-1 text-ink-soft">Hãy tạo booking demo cho “Phòng lưu trú tiếp cận — DEMO” từ phía Traveler.</p></div>
      ) : (
        <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="border-b-2 border-line text-sm text-ink-soft hc-muted"><th className="py-3 pr-4">Dịch vụ</th><th className="py-3 pr-4">Ngày / giờ</th><th className="py-3 pr-4">Khách</th><th className="py-3 pr-4">Accessibility</th><th className="py-3 pr-4">Trạng thái</th><th className="py-3">Xử lý</th></tr></thead><tbody>{bookings.map((b) => { const [label, cls] = STATUS[b.status] || STATUS.pending; return <tr key={b.id} className="border-b border-line hc-border"><td className="py-4 pr-4 font-semibold">{b.itemName}</td><td className="py-4 pr-4 text-ink-soft hc-muted"><CalendarIcon size={14} className="mr-1 inline align-[-2px]" />{b.date || "—"} · {b.time || "—"}</td><td className="py-4 pr-4">{b.guests}</td><td className="py-4 pr-4">{b.assist ? <span className="inline-flex items-center gap-1 font-semibold text-accent-dark"><AccessibleIcon size={15} /> Có request</span> : "—"}</td><td className="py-4 pr-4"><span className={`rounded-pill px-3 py-1 text-xs font-bold ${cls}`}>{label}</span></td><td className="py-4">{b.status === "pending" ? <div className="flex gap-2"><button disabled={busy === b.id} onClick={() => decide(b.id, "confirmed")} className="btn-primary !min-h-[38px] !px-3 !py-1 text-xs"><CheckIcon size={15}/>Confirm</button><button disabled={busy === b.id} onClick={() => decide(b.id, "rejected")} className="btn-ghost hc-border !min-h-[38px] !px-3 !py-1 text-xs">Reject</button></div> : "—"}</td></tr>; })}</tbody></table></div>
      )}
    </div>
  );
}
