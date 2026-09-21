"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useA11y } from "@/components/A11yProvider";
import { api } from "@/lib/api";
import { getItem } from "@/data/catalog";
import { StarIcon, CheckIcon } from "@/components/Icons";

const CRITERIA = [
  { key: "entrance", label: "Lối vào" },
  { key: "navigation", label: "Khả năng di chuyển" },
  { key: "staff", label: "Nhân viên hỗ trợ" },
  { key: "toilet", label: "Nhà vệ sinh" },
  { key: "info", label: "Thông tin / chỉ dẫn" },
  { key: "audio", label: "Âm thanh / biển báo" },
];

function Stars({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-3 hc-border">
      <span className="font-semibold">{label}</span>
      <span className="flex gap-1" role="radiogroup" aria-label={`Chấm điểm ${label}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n} type="button" role="radio" aria-checked={value === n}
            aria-label={`${n} sao`} onClick={() => onChange(n)}
            className={`flex h-11 w-11 items-center justify-center rounded-full ${n <= value ? "text-primary" : "text-line"} hover:scale-110`}
          >
            <StarIcon size={26} filled={n <= value} />
          </button>
        ))}
      </span>
    </div>
  );
}

function ReviewContent() {
  const params = useSearchParams();
  const item = getItem(params.get("item"));
  const { speak } = useA11y();
  const [ratings, setRatings] = useState({ entrance: 0, navigation: 0, staff: 0, toilet: 0, info: 0, audio: 0 });
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.createReview({ itemId: item?.id || "unknown", itemName: item?.name || "", author: author || "Khách ẩn danh", comment, ratings });
      setDone(true);
      speak("Cảm ơn bạn đã chia sẻ đánh giá tiếp cận. Đánh giá của bạn giúp những người khiếm thị khác tự tin hơn khi đi.");
    } catch (_) { speak("Gửi đánh giá chưa thành công."); }
  }

  if (done) {
    return (
      <div className="container-page py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-800"><CheckIcon size={34} /></span>
        <h1 className="mt-4 text-3xl">Cảm ơn bạn!</h1>
        <p className="hc-muted mt-3 text-ink-soft">Đánh giá tiếp cận của bạn đã được ghi nhận và sẽ giúp cộng đồng người khiếm thị.</p>
        <div className="mt-6 flex justify-center gap-3">
          {item && <Link href={`/item?id=${item.id}`} className="btn-primary">Xem lại địa điểm</Link>}
          <Link href="/" className="btn-ghost hc-border">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Đánh giá tiếp cận</h1>
      <p className="hc-muted mt-3 max-w-2xl text-lg text-ink-soft">
        {item ? <>Chia sẻ trải nghiệm tiếp cận của bạn tại <strong>{item.name}</strong>.</> : "Chia sẻ trải nghiệm tiếp cận của bạn."} Mỗi tiêu chí chấm 1–5 sao.
      </p>

      <form onSubmit={submit} className="mt-8 max-w-2xl">
        <div className="rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border">
          {CRITERIA.map((c) => (
            <Stars key={c.key} label={c.label} value={ratings[c.key]} onChange={(n) => setRatings((r) => ({ ...r, [c.key]: n }))} />
          ))}
        </div>

        <div className="mt-5">
          <label htmlFor="author" className="mb-1 block font-semibold">Tên hiển thị (không bắt buộc)</label>
          <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ví dụ: Minh" className="w-full rounded-pill border border-line bg-white px-5 py-3 text-lg outline-none hc-surface hc-border" />
        </div>
        <div className="mt-4">
          <label htmlFor="comment" className="mb-1 block font-semibold">Nhận xét</label>
          <textarea id="comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Điều gì giúp bạn tiếp cận dễ dàng? Điều gì cần cải thiện?" className="w-full rounded-2xl border border-line bg-white px-5 py-3 text-lg outline-none hc-surface hc-border" />
        </div>

        <button type="submit" className="btn-primary mt-6 text-lg"><CheckIcon size={22} /> Gửi đánh giá</button>
      </form>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="container-page py-10">Đang tải…</div>}>
      <ReviewContent />
    </Suspense>
  );
}
