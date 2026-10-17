"use client";
import {useBusiness} from "@/components/BusinessShell";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getBusiness } from "@/data/businesses";
import { StarIcon } from "@/components/Icons";

function ReviewRow({ r }) {
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState("");
  const avg = Math.round(
    (Object.values(r.ratings || {}).reduce((a, b) => a + (b || 0), 0) / (Object.keys(r.ratings || {}).length || 1)) * 10
  ) / 10;

  return (
    <li className="card hc-surface hc-border p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{r.itemName || "Dịch vụ"}</p>
        <span className="inline-flex items-center gap-1 font-bold text-primary"><StarIcon size={16} /> {avg || "-"}/5</span>
      </div>
      <p className="hc-muted mt-1 text-sm text-ink-soft">Bởi {r.author}</p>
      {r.comment && <p className="mt-2">“{r.comment}”</p>}
      <p className="mt-2 text-sm text-ink-soft hc-muted">
        Lối vào {r.ratings?.entrance || "-"}/5 · Di chuyển {r.ratings?.navigation || "-"}/5 · Nhân viên {r.ratings?.staff || "-"}/5 · WC {r.ratings?.toilet || "-"}/5
      </p>

      {sent ? (
        <div className="mt-3 rounded-xl bg-surface-alt p-3 hc-surface hc-border">
          <p className="text-sm font-semibold text-accent-dark">Bản nháp phản hồi — chưa gửi hoặc lưu server</p>
          <p>{sent}</p>
        </div>
      ) : (
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (reply.trim()) setSent(reply.trim()); }}>
          <label htmlFor={`re-${r.id}`} className="sr-only">Phản hồi đánh giá</label>
          <input id={`re-${r.id}`} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Cảm ơn phản hồi và cam kết cải thiện…" className="flex-1 rounded-pill border border-line bg-white px-4 py-2 outline-none hc-surface hc-border" />
          <button type="submit" className="btn-primary !py-2 text-sm">Xem bản nháp — DEMO</button>
        </form>
      )}
    </li>
  );
}

export default function BusinessReviews() {
  const {businessId}=useBusiness();
  const biz = getBusiness(businessId);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState("");

  useEffect(() => {
    api.listReviews().then((all) => setReviews(all.filter((r) => biz.items.includes(r.itemId)))).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [businessId]);

  return (
    <div className="container-page py-10">
      {error && <p role="alert" className="mb-4 text-red-800">{error}</p>}
      <h1 className="text-4xl sm:text-5xl">Đánh giá & phản hồi</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">
        Xem đánh giá tiếp cận của khách và phản hồi. Bạn không thể sửa/xóa điểm khách chấm — chỉ phản hồi.
      </p>

      {loading ? <p className="mt-8 text-ink-soft">Đang tải…</p> : reviews.length === 0 ? (
        <div className="mt-8 rounded-[18px] border border-line bg-white p-8 text-center hc-surface hc-border">
          <p className="text-lg">Chưa có đánh giá nào cho dịch vụ của bạn.</p>
          <p className="hc-muted mt-1 text-ink-soft">Khách viết đánh giá tiếp cận sau chuyến đi sẽ hiện ở đây.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {reviews.map((r) => <ReviewRow key={r.id} r={r} />)}
        </ul>
      )}
    </div>
  );
}
