"use client";

import { useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import { guideAssignments } from "@/data/guides";
import { AccessibleIcon, CheckIcon, CalendarIcon } from "@/components/Icons";

export default function GuideBookings() {
  const { speak } = useA11y();
  const [items, setItems] = useState(guideAssignments);

  function decide(id, status) {
    setItems((xs) => xs.map((a) => (a.id === id ? { ...a, status } : a)));
    speak(status === "accepted" ? "Đã nhận lịch hỗ trợ." : "Đã từ chối lịch.");
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Lịch hỗ trợ</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">Xác nhận các yêu cầu đồng hành từ khách khiếm thị.</p>
      <ul className="mt-8 space-y-4">
        {items.map((a) => (
          <li key={a.id} className="card hc-surface hc-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{a.service}</p>
                <p className="hc-muted mt-1 flex items-center gap-2 text-ink-soft"><CalendarIcon size={15} /> {a.date} · {a.time}</p>
                <p className="mt-1 flex items-center gap-1 text-accent-dark"><AccessibleIcon size={15} /> {a.traveler} — “{a.note}”</p>
              </div>
              <span className={`rounded-pill px-3 py-1 text-xs font-bold ${a.status === "accepted" ? "bg-green-100 text-green-900" : a.status === "rejected" ? "bg-red-100 text-red-900" : "bg-amber-100 text-amber-900"}`}>
                {a.status === "accepted" ? "Đã nhận" : a.status === "rejected" ? "Đã từ chối" : "Đang chờ"}
              </span>
            </div>
            {a.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button onClick={() => decide(a.id, "accepted")} className="btn-primary !py-2 text-sm"><CheckIcon size={18} /> Nhận lịch</button>
                <button onClick={() => decide(a.id, "rejected")} className="btn-ghost hc-border !py-2 text-sm">Từ chối</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
