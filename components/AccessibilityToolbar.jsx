"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useA11y } from "./A11yProvider";
import {
  AccessibleIcon,
  SpeakerIcon,
  MicIcon,
  ContrastIcon,
  TextSizeIcon,
} from "./Icons";

// Thanh hỗ trợ tiếp cận cố định, xuất hiện xuyên suốt mọi trang:
// ♿ mở bảng tùy chọn · 🔊 đọc nội dung trang · 🎙️ tìm bằng giọng nói.
export default function AccessibilityToolbar() {
  const router = useRouter();
  const {
    contrast,
    largeText,
    reduceMotion,
    toggleContrast,
    toggleLargeText,
    toggleReduceMotion,
    speak,
    stop,
  } = useA11y();
  const [open, setOpen] = useState(false);

  const panel = useRef(null),
    trigger = useRef(null);
  useEffect(() => {
    if (open) panel.current?.querySelector("button")?.focus();
  }, [open]);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  function listenPage() {
    const main = document.getElementById("main");
    const text = (main?.innerText || "").replace(/\s+/g, " ").trim();
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
      <span className="flex items-center gap-2 font-semibold">
        <Icon size={20} /> {label}
      </span>
      <span
        className={`text-sm font-bold ${on ? "text-accent-dark" : "text-ink-soft"}`}
      >
        {on ? "BẬT" : "TẮT"}
      </span>
    </button>
  );

  return (
    <div className="fixed bottom-24 right-4 md:bottom-4 z-50 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div
          ref={panel}
          id="accessibility-panel"
          role="region"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          aria-label="Tùy chọn hỗ trợ tiếp cận"
          className="w-[min(300px,calc(100vw-2rem))] max-h-[calc(100dvh-11rem)] overflow-auto rounded-2xl border border-line bg-white p-4 shadow-card-hover hc-surface hc-border"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <AccessibleIcon size={20} /> Hỗ trợ tiếp cận
            </h2>
            <button
              onClick={close}
              aria-label="Đóng bảng"
              className="min-h-11 min-w-11 rounded-full p-1 text-ink-soft hover:bg-surface-alt"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <ThemeToggle />
            {renderToggle(
              "Tương phản cao",
              contrast,
              toggleContrast,
              ContrastIcon,
            )}
            {renderToggle("Chữ lớn", largeText, toggleLargeText, TextSizeIcon)}
            {renderToggle(
              "Giảm chuyển động",
              reduceMotion,
              toggleReduceMotion,
              AccessibleIcon,
            )}
            <button
              onClick={listenPage}
              className="btn-primary w-full !min-h-[44px]"
            >
              <SpeakerIcon size={18} /> Nghe nội dung trang
            </button>
            <button
              onClick={stop}
              className="btn-ghost hc-border w-full !min-h-[40px] !py-2 text-sm"
            >
              Dừng đọc
            </button>
          </div>
          <p className="mt-3 text-xs text-ink-soft hc-muted">
            Có thể dùng bằng bàn phím. Tính năng đọc phụ thuộc trình duyệt và
            giọng nói trên thiết bị.
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
          ref={trigger}
          aria-controls="accessibility-panel"
          aria-expanded={open}
          aria-label="Mở tùy chọn hỗ trợ tiếp cận"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-ink shadow-card-hover hover:bg-primary-hover"
        >
          <AccessibleIcon size={26} />
        </button>
      </div>
    </div>
  );
}
