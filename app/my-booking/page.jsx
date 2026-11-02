"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import { bookingStatus, requestStatus } from "@/lib/bookingStatus";
import { api } from "@/lib/api";
import { CalendarIcon, SpeakerIcon, MapPinIcon, MicIcon } from "@/components/Icons";

export default function MyBookingPage() {
  const { speak } = useA11y();
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    Promise.all([api.listBookings(), api.listRequests().catch(() => null)])
      .then(([list, reqs]) => {
        setBookings(list);
        setRequests(reqs);
      })
      .catch(() => setError("Không tải được đặt chỗ. Hãy kiểm tra kết nối rồi thử lại."))
      .finally(() => setLoading(false));
  }, [attempt]);

  function retry() {
    setLoading(true);
    setError("");
    setAttempt((n) => n + 1);
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl font-bold">Đặt chỗ của tôi tại Phố Cổ</h1>
      <p className="hc-muted mt-3 max-w-2xl text-lg text-ink-soft">
        Các bản ghi đặt dịch vụ và hướng dẫn viên đồng hành. Hệ thống kết nối HDV/TNV thực địa với mục tiêu tiếp cận điểm hẹn dưới 10 phút (trạng thái DEMO).
      </p>

      {loading ? (
        <p className="mt-8 text-ink-soft">Đang tải…</p>
      ) : error ? (
        <div className="mt-8" role="alert">
          <p className="text-red-800 font-bold">{error}</p>
          <button type="button" onClick={retry} className="btn-ghost hc-border mt-3">
            Thử lại
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-[18px] border border-line bg-white p-8 text-center hc-surface hc-border">
          <p className="text-lg">Bạn chưa có đặt chỗ nào tại Phố Cổ.</p>
          <Link href="/explore" className="btn-primary mt-4 inline-flex">
            Khám phá dịch vụ Phố Cổ
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {bookings.map((b) => {
            const req = requests?.find((r) => r.bookingId === b.id);
            const reqText = b.assist
              ? req
                ? requestStatus(req.status)
                : requests
                ? "Có yêu cầu hỗ trợ"
                : "Có yêu cầu hỗ trợ (chưa tải được trạng thái)"
              : "";
            return (
              <li key={b.id} className="card hc-surface hc-border flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-alt text-ink">
                  <CalendarIcon size={24} />
                </span>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xl font-bold">{b.itemName}</p>
                    <span className={`chip hc-surface hc-border ${bookingStatus(b.status)[1]}`}>
                      {bookingStatus(b.status)[0]}
                    </span>
                  </div>

                  <p className="hc-muted flex flex-wrap items-center gap-x-4 text-sm text-ink-soft">
                    <span className="flex items-center gap-1">
                      <CalendarIcon size={15} /> {b.date || "—"} · {b.time || "—"}
                    </span>
                    <span>{b.guests} khách</span>
                    {reqText && <span className="font-semibold text-accent-dark">{reqText}</span>}
                    {b.price && <span className="font-bold text-ink">{b.price}</span>}
                  </p>

                  {b.meetupPoint && (
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-[#b8461a]">
                      <MapPinIcon size={16} /> Điểm hẹn tập kết: {b.meetupPoint}
                    </p>
                  )}

                  {b.voiceNote && (
                    <p className="flex items-start gap-1.5 text-sm italic text-ink-soft bg-surface-alt p-2.5 rounded-lg">
                      <MicIcon size={16} className="shrink-0 mt-0.5" /> Ghi chú giọng nói: “{b.voiceNote}”
                    </p>
                  )}

                  <p className="text-xs text-ink-soft hc-muted">
                    ⏱ Mục tiêu tiếp cận kết nối: &lt; 10 phút (DEMO)
                  </p>
                  {req?.note && <p className="mt-1 text-sm font-medium">Ghi chú phản hồi: {req.note}</p>}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() =>
                      speak(
                        `${b.itemName}, điểm hẹn tại ${b.meetupPoint || "chưa chỉ định"}, lúc ${b.time || ""} ngày ${
                          b.date || ""
                        }, ${b.guests} khách. Trạng thái: ${bookingStatus(b.status)[0]}. ${
                          b.voiceNote ? `Ghi chú: ${b.voiceNote}.` : ""
                        } ${reqText}.`
                      )
                    }
                    className="btn-ghost hc-border !min-h-[44px] !p-2"
                    aria-label={`Nghe lại thông tin đơn ${b.itemName}`}
                  >
                    <SpeakerIcon size={20} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
