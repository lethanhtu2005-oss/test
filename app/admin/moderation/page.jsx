"use client";

import { useEffect, useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import { api } from "@/lib/api";
import { getItem } from "@/data/catalog";
import { StarIcon } from "@/components/Icons";

export default function AdminModeration() {
  const { speak } = useA11y();
  const [reviews, setReviews] = useState([]);
  const [hidden, setHidden] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.listReviews().then(setReviews).catch(() => {}).finally(() => setLoading(false)); }, []);

  function hide(id) { setHidden((h) => ({ ...h, [id]: true })); speak("Đã ẩn nội dung vi phạm."); }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Kiểm duyệt</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">Duyệt đánh giá của khách; ẩn nội dung vi phạm. Không sửa điểm khách chấm.</p>

      {loading ? <p className="mt-8 text-ink-soft">Đang tải…</p> : reviews.length === 0 ? (
        <div className="mt-8 rounded-[18px] border border-line bg-white p-8 text-center hc-surface hc-border">
          <p className="text-lg">Chưa có đánh giá nào cần kiểm duyệt.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className={`card hc-surface hc-border p-5 ${hidden[r.id] ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{getItem(r.itemId)?.name || r.itemName || "Dịch vụ"}</p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary"><StarIcon size={14} /> {r.ratings?.entrance || "-"}/5 lối vào</span>
              </div>
              <p className="hc-muted text-sm text-ink-soft">Bởi {r.author}</p>
              {r.comment && <p className="mt-2">{hidden[r.id] ? "[Đã ẩn]" : `“${r.comment}”`}</p>}
              {!hidden[r.id] && (
                <button onClick={() => hide(r.id)} className="btn-ghost hc-border mt-3 !py-2 text-sm">Ẩn nội dung vi phạm</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
