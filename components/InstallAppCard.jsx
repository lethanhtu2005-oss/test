"use client";

import { useEffect, useMemo, useState } from "react";
import { PhoneIcon, CheckIcon } from "./Icons";

export default function InstallAppCard({ compact = false }) {
  const [promptEvent, setPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const isIOS = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone;
    if (standalone) setInstalled(true);

    const onBefore = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onBefore);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (installed) return;
    if (!promptEvent) {
      setShowHelp(true);
      return;
    }
    promptEvent.prompt();
    await promptEvent.userChoice.catch(() => null);
    setPromptEvent(null);
  }

  return (
    <div className={`rounded-[22px] border border-line bg-white shadow-card hc-surface hc-border ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <span className="chip hc-surface hc-border"><PhoneIcon size={16} /> WayEcho Mobile</span>
          <h2 className={`${compact ? "mt-3 text-2xl" : "mt-3 text-3xl sm:text-4xl"}`}>Tải app của chúng tôi</h2>
          <p className="hc-muted mt-2 text-ink-soft">
            Cài WayEcho lên màn hình chính để mở như một ứng dụng điện thoại. Bản PWA hỗ trợ Android,
            iPhone/iPad và giữ các tùy chọn tiếp cận đã lưu trên thiết bị.
          </p>
        </div>
        <button type="button" onClick={install} className="btn-primary shrink-0 text-base sm:text-lg" aria-describedby="install-note">
          {installed ? <><CheckIcon size={20} /> Đã cài ứng dụng</> : <><PhoneIcon size={20} /> Cài WayEcho</>}
        </button>
      </div>

      <p id="install-note" className="hc-muted mt-3 text-sm text-ink-soft">
        Khi website được triển khai qua HTTPS, trình duyệt tương thích sẽ cho phép cài trực tiếp mà không cần App Store.
      </p>

      {(showHelp || isIOS) && !installed && (
        <div className="mt-4 rounded-2xl bg-surface-alt p-4 hc-surface hc-border" role="status">
          <p className="font-semibold">Cách cài thủ công</p>
          <p className="hc-muted mt-1 text-sm text-ink-soft">
            {isIOS
              ? "Trên Safari: nhấn Chia sẻ → Thêm vào Màn hình chính → Thêm."
              : "Mở menu trình duyệt → chọn Cài đặt ứng dụng / Thêm vào màn hình chính."}
          </p>
        </div>
      )}
    </div>
  );
}
