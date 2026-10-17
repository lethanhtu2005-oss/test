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
  const [error,setError] = useState("");
  const [reports, setReports] = useState([]);
  const [reportError, setReportError] = useState("");

  useEffect(() => { api.listReviews().then(setReviews).catch(err=>setError(err.message)).finally(() => setLoading(false)); }, []);
  useEffect(() => { api.listReports().then(setReports).catch(err=>setReportError(err.message)); }, []);

  function hide(id) { setHidden((h) => ({ ...h, [id]: true })); speak("DEMO: chỉ ẩn trên màn hình này, chưa kiểm duyệt hoặc lưu server."); }

  return (
    <div className="container-page py-10">
      {error && <p role="alert" className="mb-4 text-red-800">{error}</p>}
      <h1 className="text-4xl sm:text-5xl">Kiểm duyệt</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">DEMO: nút ẩn chỉ thay đổi màn hình hiện tại. Chưa có API lưu quyết định kiểm duyệt; không sửa điểm khách chấm.</p>

      {loading ? <p className="mt-8 text-ink-soft">Đang tải…</p> : error ? null : reviews.length === 0 ? (
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

      <section className="mt-12" aria-labelledby="reports-heading">
        <h2 id="reports-heading" className="text-3xl">Báo cáo thông tin tiếp cận chưa đúng</h2>
        <p className="hc-muted mt-2 max-w-2xl text-ink-soft">Người dùng gửi từ trang chi tiết điểm đến. Đây là gợi ý cần kiểm tra lại với nguồn, không tự sửa dữ liệu.</p>
        {reportError ? <p role="alert" className="mt-4 text-red-800">{reportError}</p> : reports.length === 0 ? (
          <p className="mt-4">Chưa có báo cáo nào.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="card hc-surface hc-border p-4">
                <p className="font-semibold">{r.itemName} · {r.topicLabel}</p>
                <p className="mt-1">{r.detail}</p>
                <p className="hc-muted mt-1 text-sm text-ink-soft">Đã tiếp nhận {new Date(r.createdAt).toLocaleString("vi-VN")}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
