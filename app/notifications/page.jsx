"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useA11y } from "@/components/A11yProvider";
import { CheckIcon, CalendarIcon, AccessibleIcon, SpeakerIcon } from "@/components/Icons";

const ICON = { request_result: AccessibleIcon, new_booking: CalendarIcon, info: CheckIcon };

export default function NotificationsPage() {
  const { speak } = useA11y();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listNotifications({ role: "traveler" }).then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Thông báo</h1>
      <p className="hc-muted mt-2 text-lg text-ink-soft">Cập nhật về đặt chỗ và yêu cầu hỗ trợ của bạn.</p>

      {loading ? <p className="mt-8 text-ink-soft">Đang tải…</p> : items.length === 0 ? (
        <div className="mt-8 rounded-[18px] border border-line bg-white p-8 text-center hc-surface hc-border">
          <p className="text-lg">Chưa có thông báo nào.</p>
          <Link href="/explore" className="btn-primary mt-4">Khám phá & đặt dịch vụ</Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((n) => {
            const Icon = ICON[n.type] || CheckIcon;
            return (
              <li key={n.id} className="card hc-surface hc-border flex items-center gap-4 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-ink"><Icon size={22} /></span>
                <p className="flex-1 text-lg">{n.message}</p>
                <button onClick={() => speak(n.message)} className="btn-ghost hc-border !min-h-[40px] !p-2" aria-label="Nghe thông báo"><SpeakerIcon size={18} /></button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
