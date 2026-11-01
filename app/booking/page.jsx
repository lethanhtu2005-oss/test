"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useA11y } from "@/components/A11yProvider";
import { api } from "@/lib/api";
import { getItem } from "@/data/catalog";
import { todayInVietnam } from "@/lib/validate";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { CalendarIcon, CheckIcon, SpeakerIcon, AccessibleIcon, MicIcon, MapPinIcon } from "@/components/Icons";

const FALLBACK = { id: "demo-guide-tour", name: "Guide & Trợ lý đồng hành Phố Cổ — DEMO", price: "200.000đ / buổi", isDemo: true };

const MEETUP_POINTS = [
  "Trung tâm Văn hóa 28 Hàng Buồm (Điểm hẹn số 1 Phố Cổ)",
  "Tượng đài Cảm Tử — Đền Ngọc Sơn (Bờ Hồ Hoàn Kiếm)",
  "Nhà cổ 87 Mã Mây (Khu di sản Phố Cổ)",
  "Nhà hát Múa rối Nước Thăng Long (57B Đinh Tiên Hoàng)",
  "Chợ Đồng Xuân (Cổng chính phố Đồng Xuân)",
];

const REQUESTS = [
  ["staff", "Staff assistance — Nhân viên hỗ trợ trực tiếp"],
  ["stepFree", "Step-free access — Lối đi không bậc tam cấp"],
  ["navigation", "Navigation assistance — Hỗ trợ dẫn đường & tránh vật cản"],
  ["audioDescription", "Audio description — Thuyết minh & mô tả âm thanh chi tiết"],
  ["transport", "Transport assistance — Hỗ trợ lên xuống xích lô / xe điện"],
  ["checkin", "Check-in assistance — Hỗ trợ làm thủ tục vào điểm di tích"],
];

const TIMES = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00", "18:30"];

function BookingContent() {
  const params = useSearchParams();
  const { speak } = useA11y();
  const itemParam = params.get("item");
  const selected = itemParam ? getItem(itemParam) : getItem("demo-guide-tour") || FALLBACK;

  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [guests, setGuests] = useState(1);
  const [meetupPoint, setMeetupPoint] = useState(MEETUP_POINTS[0]);
  const [voiceNote, setVoiceNote] = useState("");
  const [requests, setRequests] = useState({});
  const [share, setShare] = useState(false);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedStatus, setSavedStatus] = useState("");
  const requestRef = useRef(null);

  const { supported: speechSupported, listening, start: startVoice, stop: stopVoice } = useSpeechRecognition({
    onResult: (text) => {
      setVoiceNote((prev) => (prev ? `${prev} ${text}` : text));
      speak(`Đã ghi nhận: ${text}`);
    },
  });

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("we-access-prefs") || "{}");
      setRequests(Object.fromEntries(REQUESTS.map(([id]) => [id, !!p[id]])));
    } catch (_) {}
  }, []);

  const selectedRequests = useMemo(
    () => REQUESTS.filter(([id]) => requests[id]).map(([, label]) => label),
    [requests]
  );

  function toggle(id) {
    setRequests((r) => ({ ...r, [id]: !r[id] }));
  }

  async function confirm() {
    setSaving(true);
    setError("");
    try {
      if (!requestRef.current) requestRef.current = crypto.randomUUID();
      const record = await api.createBooking({
        requestId: requestRef.current,
        itemId: selected.id,
        itemName: selected.name,
        date,
        time,
        guests,
        meetupPoint,
        voiceNote,
        assist: share && (selectedRequests.length > 0 || !!voiceNote),
        shareAccessibility: share,
        accessibilityRequests: share ? selectedRequests : [],
        requestNote: share ? voiceNote : "",
        price: selected.price,
        demo: true,
      });

      setSavedStatus(record.status);
      setDone(true);
      speak(
        `Đã tạo đặt chỗ cho ${selected.name} tại điểm hẹn ${meetupPoint}. Thời gian kết nối dự kiến dưới 10 phút trong hệ thống demo.`
      );
    } catch (err) {
      setError(err.message || "Không lưu được booking. Hãy thử lại.");
      speak("Không lưu được đặt chỗ demo, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  if (!selected)
    return (
      <div className="container-page py-12">
        <h1 className="text-3xl font-bold">Không tìm thấy dịch vụ</h1>
        <Link href="/explore" className="btn-primary mt-4">
          Quay lại khám phá Phố Cổ
        </Link>
      </div>
    );

  if (done)
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl rounded-[18px] border border-line bg-white p-8 text-center shadow-card hc-surface hc-border">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-800">
            <CheckIcon size={34} />
          </span>
          <h1 className="mt-4 text-3xl font-bold">
            {savedStatus === "pending"
              ? "Đang kết nối HDV/TNV thực địa Phố Cổ (DEMO)"
              : "Đã lưu đặt chỗ DEMO thành công"}
          </h1>
          <p className="hc-muted mt-3 text-lg text-ink-soft">
            Điểm hẹn đón: <strong>{meetupPoint}</strong>
          </p>
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950 border border-amber-300">
            <p className="font-bold">Mục tiêu nghiệp vụ: Kết nối HDV/TNV dưới 10 phút</p>
            <p className="mt-1">
              Trạng thái hệ thống: DEMO mô phỏng luồng ghép nối hướng dẫn viên tình nguyện thực địa. Không có giao dịch tài chính thật.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/my-booking" className="btn-primary min-h-[48px] px-6 font-bold">
              Xem chi tiết đặt chỗ
            </Link>
            <Link href="/" className="btn-ghost hc-border min-h-[48px] px-6 font-bold">
              Về trang chủ Phố Cổ
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container-page py-10">
      <p className="font-semibold text-accent-dark">Booking · Guide & Trợ lý Phố Cổ Hà Nội</p>
      <h1 className="mt-1 text-4xl sm:text-5xl font-bold">Đặt dịch vụ & Hướng dẫn viên</h1>
      <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">
        Đặt hướng dẫn viên hoặc dịch vụ tiếp cận tại Phố Cổ Hà Nội. Bạn có thể chọn điểm hẹn cố định, ghi chú giọng nói và chia sẻ yêu cầu trợ năng cụ thể.
      </p>

      <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
        <strong>Lưu ý:</strong> Dịch vụ đang trong giai đoạn thử nghiệm (DEMO). Chưa thực hiện thanh toán tiền thật hay điều phối thực tế.
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            confirm();
          }}
        >
          {/* Mục 1: Dịch vụ */}
          <fieldset>
            <legend className="text-xl font-bold">1. Dịch vụ đã chọn</legend>
            <div className="mt-3 rounded-2xl border border-primary bg-surface-alt p-4 hc-surface hc-border">
              <p className="text-lg font-bold">{selected.name}</p>
              <p className="hc-muted text-sm text-ink-soft">{selected.price || "Giá liên hệ đối tác Phố Cổ"}</p>
            </div>
          </fieldset>

          {/* Mục 2: Điểm hẹn tập kết tại Phố Cổ (E-01) */}
          <fieldset>
            <legend className="flex items-center gap-2 text-xl font-bold">
              <MapPinIcon size={20} /> 2. Điểm tập kết cố định tại Phố Cổ
            </legend>
            <p className="hc-muted mt-1 text-sm text-ink-soft">
              Các trạm hỗ trợ cố định được bố trí để kết nối HDV/TNV dưới 10 phút.
            </p>
            <div className="mt-3 space-y-2">
              {MEETUP_POINTS.map((point) => (
                <label
                  key={point}
                  className={`flex min-h-[52px] cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 hc-border ${
                    meetupPoint === point ? "border-primary bg-surface-alt font-bold hc-surface" : "border-line bg-white"
                  }`}
                >
                  <span className="text-base">{point}</span>
                  <input
                    type="radio"
                    name="meetupPoint"
                    checked={meetupPoint === point}
                    onChange={() => setMeetupPoint(point)}
                    className="h-5 w-5 accent-[#f8ae38]"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          {/* Mục 3: Thời gian & Số khách */}
          <fieldset>
            <legend className="text-xl font-bold">3. Thời gian & Số khách</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="date" className="mb-1 block font-semibold">
                  Ngày
                </label>
                <input
                  id="date"
                  required
                  type="date"
                  min={todayInVietnam()}
                  suppressHydrationWarning
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-lg hc-surface hc-border"
                />
              </div>
              <div>
                <label htmlFor="time" className="mb-1 block font-semibold">
                  Giờ hẹn
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
                  max="20"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-lg hc-surface hc-border"
                />
              </div>
            </div>
          </fieldset>

          {/* Mục 4: Ghi chú giọng nói / Text cho HDV (E-02) */}
          <fieldset>
            <legend className="flex items-center gap-2 text-xl font-bold">
              <MicIcon size={20} /> 4. Ghi chú giọng nói cho HDV / TNV
            </legend>
            <p className="hc-muted mt-1 text-sm text-ink-soft">
              Nói hoặc nhập nhu cầu tiếp cận cụ thể để HDV chuẩn bị tốt nhất trước khi gặp mặt.
            </p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={listening ? stopVoice : startVoice}
                  disabled={!speechSupported}
                  className={`flex min-h-[52px] items-center gap-2 rounded-xl px-4 font-bold shadow-sm ${
                    listening ? "bg-red-600 text-white animate-pulse" : "btn-primary"
                  }`}
                >
                  <MicIcon size={20} /> {listening ? "Đang lắng nghe… (Bấm để dừng)" : "Bấm để nói ghi chú"}
                </button>
                {!speechSupported && (
                  <span className="text-xs text-ink-soft hc-muted">Micro chưa hỗ trợ trên trình duyệt này, bạn có thể gõ chữ bên dưới.</span>
                )}
              </div>
              <textarea
                value={voiceNote}
                onChange={(e) => setVoiceNote(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Tôi mang theo gậy trắng, cần người đón tại cửa số 28 Hàng Buồm và hỗ trợ qua đường ngã tư Hàng Buồm - Tạ Hiện…"
                className="mt-3 w-full rounded-xl border border-line bg-white p-4 text-base outline-none hc-surface hc-border"
              />
            </div>
          </fieldset>

          {/* Mục 5: Accessibility Request */}
          <fieldset>
            <legend className="flex items-center gap-2 text-xl font-bold">
              <AccessibleIcon size={20} /> 5. Chia sẻ yêu cầu trợ năng (Accessibility Request)
            </legend>
            <p className="hc-muted mt-1 text-sm text-ink-soft">
              Được gợi ý từ hồ sơ cá nhân. Tích chọn những gì bạn muốn chia sẻ với HDV/đối tác.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {REQUESTS.map(([id, label]) => (
                <label key={id} className="flex min-h-[50px] items-center justify-between gap-3 rounded-xl border border-line p-3 hc-border">
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
                <span className="block font-bold">Cho phép gửi các yêu cầu đã chọn và ghi chú cho HDV</span>
                <span className="hc-muted block text-sm text-ink-soft">
                  Nếu tắt, đơn đặt chỗ DEMO sẽ không chia sẻ bất kỳ thông tin trợ năng nào.
                </span>
              </span>
            </label>
          </fieldset>

          {error && <p role="alert" className="text-red-800 font-bold">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary min-h-[56px] w-full text-lg font-bold disabled:opacity-60 shadow-md"
          >
            <CheckIcon size={22} /> {saving ? "Đang xử lý…" : "Xác nhận đặt Guide / Dịch vụ DEMO"}
          </button>
        </form>

        {/* Tóm tắt bên cạnh */}
        <aside className="h-fit rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
          <p className="flex items-center gap-2 text-lg font-bold">
            <CalendarIcon size={20} /> Tóm tắt lịch hẹn
          </p>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm text-ink-soft hc-muted">Dịch vụ</dt>
              <dd className="font-bold">{selected.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft hc-muted">Điểm hẹn</dt>
              <dd className="font-semibold text-primary-dark">{meetupPoint}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft hc-muted">Thời gian</dt>
              <dd className="font-semibold">{date || "Chưa chọn ngày"} · {time}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft hc-muted">Ghi chú giọng nói</dt>
              <dd className="text-sm italic">{voiceNote || "Chưa có ghi chú"}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft hc-muted">Trợ năng chia sẻ</dt>
              <dd className="font-semibold">
                {share ? (selectedRequests.length > 0 ? selectedRequests.join(", ") : "Chỉ ghi chú") : "Không chia sẻ"}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() =>
              speak(
                `Dịch vụ ${selected.name}. Điểm hẹn tại ${meetupPoint}. Ngày ${date || "chưa chọn"}, lúc ${time}. ${
                  voiceNote ? `Ghi chú: ${voiceNote}.` : ""
                } ${share ? `Yêu cầu trợ năng: ${selectedRequests.join(", ") || "ghi chú"}.` : "Không chia sẻ trợ năng."}`
              )
            }
            className="btn-ghost hc-border mt-5 w-full min-h-[48px] font-bold"
          >
            <SpeakerIcon size={20} /> Nghe lại tóm tắt
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
