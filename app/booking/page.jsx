"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useA11y } from "@/components/A11yProvider";
import { api } from "@/lib/api";
import { getItem } from "@/data/catalog";
import {
  CalendarIcon,
  CheckIcon,
  SpeakerIcon,
  AccessibleIcon,
} from "@/components/Icons";

const FALLBACK = {
  id: "demo-hotel",
  name: "Phòng lưu trú tiếp cận — DEMO",
  price: "Giá demo",
  isDemo: true,
};
const REQUESTS = [
  ["staff", "Staff assistance"],
  ["stepFree", "Step-free access"],
  ["checkin", "Check-in assistance"],
  ["navigation", "Navigation assistance"],
  ["transport", "Transport assistance"],
  ["audioDescription", "Audio description"],
];
const TIMES = ["08:00", "11:00", "14:00", "18:00"];

function BookingContent() {
  const params = useSearchParams();
  const { speak } = useA11y();
  const selected =
    getItem(params.get("item")) || getItem("demo-hotel") || FALLBACK;
  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [guests, setGuests] = useState(1);
  const [requests, setRequests] = useState({});
  const [share, setShare] = useState(true);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("we-access-prefs") || "{}");
      setRequests(Object.fromEntries(REQUESTS.map(([id]) => [id, !!p[id]])));
      setShare(localStorage.getItem("we-share-business") !== "0");
    } catch (_) {}
  }, []);

  const selectedRequests = useMemo(
    () => REQUESTS.filter(([id]) => requests[id]).map(([, label]) => label),
    [requests],
  );
  function toggle(id) {
    setRequests((r) => ({ ...r, [id]: !r[id] }));
  }
  async function confirm() {
    setSaving(true);
    try {
      await api.createBooking({
        itemId: selected.id,
        itemName: selected.name,
        date,
        time,
        guests,
        assist: share && selectedRequests.length > 0,
        accessibilityRequests: share ? selectedRequests : [],
        price: selected.price,
        demo: true,
      });
      setDone(true);
      speak(
        `Đã tạo booking demo cho ${selected.name}. ${share && selectedRequests.length ? `Yêu cầu hỗ trợ gồm ${selectedRequests.join(", ")}.` : "Không chia sẻ accessibility request."}`,
      );
    } catch (_) {
      speak("Không lưu được booking demo, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  if (done)
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl rounded-[18px] border border-line bg-white p-8 text-center shadow-card hc-surface hc-border">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-800">
            <CheckIcon size={34} />
          </span>
          <h1 className="mt-4 text-3xl">Booking demo đã được tạo</h1>
          <p className="hc-muted mt-3 text-ink-soft">
            Đây là mô phỏng luồng FR06/FR08 + Accessibility Request, không phải
            giao dịch thực tế và chưa có thanh toán thật.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/my-booking" className="btn-primary">
              Xem booking
            </Link>
            <Link href="/" className="btn-ghost hc-border">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container-page py-10">
      <p className="font-semibold text-accent-dark">
        Booking + Accessibility Request
      </p>
      <h1 className="mt-1 text-4xl sm:text-5xl">Đặt dịch vụ</h1>
      <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">
        Luồng này tách Accessibility Profile khỏi Accessibility Request: hồ sơ
        chỉ gợi ý các nhu cầu thường dùng; bạn quyết định yêu cầu nào sẽ chia sẻ
        trong booking cụ thể.
      </p>
      <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
        <strong>Demo:</strong> chưa có inventory/payment/provider thật. Không có
        giao dịch tài chính được thực hiện.
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            confirm();
          }}
        >
          <fieldset>
            <legend className="text-xl font-semibold">1. Dịch vụ</legend>
            <div className="mt-3 rounded-2xl border border-primary bg-surface-alt p-4 hc-surface hc-border">
              <p className="text-lg font-semibold">{selected.name}</p>
              <p className="hc-muted text-sm text-ink-soft">{selected.price}</p>
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-xl font-semibold">2. Thời gian</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="date" className="mb-1 block font-semibold">
                  Ngày
                </label>
                <input
                  id="date"
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-lg hc-surface hc-border"
                />
              </div>
              <div>
                <label htmlFor="time" className="mb-1 block font-semibold">
                  Giờ
                </label>
                <select
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-lg hc-surface hc-border"
                >
                  {TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="guests" className="mb-1 block font-semibold">
                  Số khách
                </label>
                <input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-lg hc-surface hc-border"
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend className="flex items-center gap-2 text-xl font-semibold">
              <AccessibleIcon size={20} /> 3. Accessibility Request
            </legend>
            <p className="hc-muted mt-1 text-sm text-ink-soft">
              Được gợi ý từ profile nếu bạn đã lưu. Bỏ chọn những gì không cần
              cho booking này.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {REQUESTS.map(([id, label]) => (
                <label
                  key={id}
                  className="flex min-h-[50px] items-center justify-between gap-3 rounded-xl border border-line p-3 hc-border"
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={!!requests[id]}
                    onChange={() => toggle(id)}
                    className="h-5 w-5 accent-[#f8ae38]"
                  />
                </label>
              ))}
            </div>
            <label className="mt-4 flex items-start gap-3 rounded-xl bg-surface-alt p-4 hc-surface hc-border">
              <input
                type="checkbox"
                checked={share}
                onChange={(e) => setShare(e.target.checked)}
                className="mt-1 h-5 w-5 accent-[#f8ae38]"
              />
              <span>
                <span className="block font-semibold">
                  Cho phép gửi các yêu cầu đã chọn cho Business
                </span>
                <span className="hc-muted block text-sm text-ink-soft">
                  Nếu tắt, booking demo không đính kèm Accessibility Request.
                </span>
              </span>
            </label>
          </fieldset>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-lg disabled:opacity-60"
          >
            <CheckIcon size={22} />{" "}
            {saving ? "Đang lưu…" : "Xác nhận booking demo"}
          </button>
        </form>

        <aside className="h-fit rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
          <p className="flex items-center gap-2 text-lg font-semibold">
            <CalendarIcon size={20} /> Tóm tắt
          </p>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm text-ink-soft hc-muted">Dịch vụ</dt>
              <dd className="font-semibold">{selected.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft hc-muted">Thời gian</dt>
              <dd className="font-semibold">
                {date || "Chưa chọn"} · {time}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft hc-muted">
                Accessibility Request
              </dt>
              <dd className="font-semibold">
                {share
                  ? selectedRequests.join(", ") || "Không có"
                  : "Không chia sẻ"}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() =>
              speak(
                `Dịch vụ ${selected.name}. Ngày ${date || "chưa chọn"}, lúc ${time}. ${share ? `Yêu cầu hỗ trợ: ${selectedRequests.join(", ") || "không có"}.` : "Bạn chọn không chia sẻ accessibility request."}`,
              )
            }
            className="btn-ghost hc-border mt-5 w-full"
          >
            <SpeakerIcon size={20} /> Nghe lại
          </button>
        </aside>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="container-page py-10">Đang tải…</div>}>
      <BookingContent />
    </Suspense>
  );
}
