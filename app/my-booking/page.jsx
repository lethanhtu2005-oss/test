"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import { bookingStatus } from "@/lib/bookingStatus";
import { api } from "@/lib/api";
import { CalendarIcon, SpeakerIcon } from "@/components/Icons";

export default function MyBookingPage() {
  const { speak } = useA11y();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listBookings().then(setBookings).catch(() => setError("Không tải được đặt chỗ. Hãy kiểm tra đăng nhập và kết nối, rồi thử lại.")).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Đặt chỗ của tôi</h1>
      <p className="hc-muted mt-3 max-w-2xl text-lg text-ink-soft">
        Các bản ghi đặt chỗ của bạn. Chưa có nhà cung cấp, tồn chỗ hoặc thanh toán thật; xác nhận trong demo không bảo đảm dịch vụ thực tế.
      </p>

      {loading ? (
        <p className="mt-8 text-ink-soft">Đang tải…</p>
      ) : error ? (<p className="mt-8 text-red-800" role="alert">{error} <Link href="/login" className="underline">Đăng nhập</Link></p>) : bookings.length === 0 ? (
        <div className="mt-8 rounded-[18px] border border-line bg-white p-8 text-center hc-surface hc-border">
          <p className="text-lg">Bạn chưa có đặt chỗ nào.</p>
          <Link href="/explore" className="btn-primary mt-4">Khám phá dịch vụ</Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {bookings.map((b) => (
            <li key={b.id} className="card hc-surface hc-border flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-alt text-ink"><CalendarIcon size={24} /></span>
              <div className="flex-1">
                <p className="text-xl font-semibold">{b.itemName}</p>
                <p className="hc-muted flex flex-wrap items-center gap-x-3 text-ink-soft">
                  <span className="flex items-center gap-1"><CalendarIcon size={15} /> {b.date || "—"} · {b.time || "—"}</span>
                  <span>{b.guests} khách</span>
                  {b.assist && <span className="font-semibold text-accent-dark">Có yêu cầu hỗ trợ</span>}
                  {b.price && <span className="font-bold text-ink">{b.price}</span>}
                </p>
              </div>
              <span className={`chip hc-surface hc-border ${bookingStatus(b.status)[1]}`}>{bookingStatus(b.status)[0]}</span>
              <button
                onClick={() => speak(`${b.itemName}, ${b.time || ""} ${b.date || ""}, ${b.guests} khách. ${bookingStatus(b.status)[0]}${b.assist ? ", có yêu cầu hỗ trợ" : ""}.`)}
                className="btn-ghost hc-border !min-h-[40px] !p-2" aria-label={`Nghe lại đơn ${b.itemName}`}
              ><SpeakerIcon size={18} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
