"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { REPORT_TOPICS } from "@/lib/reportValidation";

// RV02: người dùng báo thông tin tiếp cận chưa đúng để quản trị viên kiểm tra lại.
export default function ReportIssue({ itemId, itemName }) {
  const [topic, setTopic] = useState("entrance");
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setResult(null);
    try {
      await api.createReport({ itemId, topic, detail });
      setResult({ ok: true, text: "Đã ghi nhận báo cáo. Quản trị viên sẽ kiểm tra lại thông tin; bản demo chưa có phản hồi tự động." });
      setDetail("");
    } catch (e) { setResult({ ok: false, text: e.message || "Chưa gửi được báo cáo. Hãy thử lại." }); }
    finally { setBusy(false); }
  }
  return (
    <details className="mt-6 rounded-2xl border border-line p-4 hc-border">
      <summary className="cursor-pointer font-semibold">Báo thông tin tiếp cận chưa đúng</summary>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <p className="text-sm hc-muted text-ink-soft">Giúp WayEcho sửa thông tin về {itemName}. Không cần và không nên ghi tên, số điện thoại hay thông tin cá nhân.</p>
        <div>
          <label htmlFor="report-topic" className="block font-semibold">Thông tin nào chưa đúng?</label>
          <select id="report-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-3 hc-surface hc-border">
            {Object.entries(REPORT_TOPICS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="report-detail" className="block font-semibold">Mô tả điều bạn thấy khác (10–1000 ký tự)</label>
          <textarea id="report-detail" required minLength={10} maxLength={1000} rows={4} value={detail} onChange={(e) => setDetail(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-3 hc-surface hc-border" />
        </div>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? "Đang gửi…" : "Gửi báo cáo"}</button>
        {result && <p role={result.ok ? "status" : "alert"} className={result.ok ? "font-semibold" : "text-red-800"}>{result.text}</p>}
      </form>
    </details>
  );
}
