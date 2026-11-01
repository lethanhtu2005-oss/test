"use client";

import { useEffect, useRef, useState } from "react";
import ThemeControl from "./ThemeControl";
import { useRouter } from "next/navigation";
import { useA11y } from "./A11yProvider";
import {
  AccessibleIcon, SpeakerIcon, MicIcon, ContrastIcon, TextSizeIcon,
} from "./Icons";

// Thanh hỗ trợ tiếp cận cố định, xuất hiện xuyên suốt mọi trang:
// ♿ mở bảng tùy chọn · 🔊 đọc nội dung trang · 🎙️ tìm bằng giọng nói.
export default function AccessibilityToolbar() {
  const router = useRouter();
  const { contrast, largeText, reduceMotion, toggleContrast, toggleLargeText, toggleReduceMotion, speak, stop } = useA11y();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null); const toggleRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("button")?.focus();
    function key(event) { if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); } }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);

  function listenPage() {
    const main = document.getElementById("main");
    const text = (main?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 900);
    speak(text || "Chưa có nội dung để đọc.");
  }

  const renderToggle = (label, on, onClick, Icon) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left ${
        on ? "border-primary bg-surface-alt" : "border-line bg-white"
      } hc-surface hc-border`}
    >
      <span className="flex items-center gap-2 font-semibold"><Icon size={20} /> {label}</span>
      <span className={`text-sm font-bold ${on ? "text-accent-dark" : "text-ink-soft"}`}>{on ? "BẬT" : "TẮT"}</span>
    </button>
  );

  return (
    <div className="fixed bottom-24 right-4 md:bottom-4 z-50 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div
          ref={panelRef} id="accessibility-panel" role="dialog"
          aria-label="Tùy chọn hỗ trợ tiếp cận"
          className="w-[min(300px,calc(100vw-2rem))] max-h-[calc(100dvh-12rem)] overflow-y-auto rounded-2xl border border-line bg-white p-4 shadow-card-hover hc-surface hc-border"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold"><AccessibleIcon size={20} /> Hỗ trợ tiếp cận</h2>
            <button onClick={() => { setOpen(false); toggleRef.current?.focus(); }} aria-label="Đóng bảng" className="min-h-[44px] min-w-[44px] rounded-full p-1 text-ink-soft hover:bg-surface-alt">✕</button>
          </div>
          <div className="space-y-2">
            <ThemeControl/>
            {renderToggle("Tương phản cao", contrast, toggleContrast, ContrastIcon)}
            {renderToggle("Chữ lớn", largeText, toggleLargeText, TextSizeIcon)}
            {renderToggle("Giảm chuyển động", reduceMotion, toggleReduceMotion, AccessibleIcon)}
            <button onClick={listenPage} className="btn-primary w-full !min-h-[44px]"><SpeakerIcon size={18} /> Nghe nội dung trang</button>
            <button onClick={stop} className="btn-ghost hc-border w-full !min-h-[40px] !py-2 text-sm">Dừng đọc</button>
          </div>
          <p className="mt-3 text-xs text-ink-soft hc-muted">
            Tùy chọn đọc và hiển thị. Khả năng đọc giọng Việt phụ thuộc thiết bị; chưa kiểm thử đầy đủ với mọi screen reader.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/search")}
          aria-label="Tìm kiếm bằng giọng nói"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-card hover:bg-neutral-800"
        >
          <MicIcon size={22} />
        </button>
        <button
          type="button"
          onClick={listenPage}
          aria-label="Nghe nội dung trang này"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-card hc-surface hc-border hover:bg-surface-alt"
        >
          <SpeakerIcon size={22} />
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          ref={toggleRef} aria-controls="accessibility-panel" aria-expanded={open}
          aria-label="Mở tùy chọn hỗ trợ tiếp cận"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-ink shadow-card-hover hover:bg-primary-hover"
        >
          <AccessibleIcon size={26} />
        </button>
      </div>
    </div>
  );
}
