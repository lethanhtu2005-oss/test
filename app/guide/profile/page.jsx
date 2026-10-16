"use client";

import { useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import { getGuide, DEMO_GUIDE_ID } from "@/data/guides";
import { StarIcon, CheckIcon } from "@/components/Icons";

const SLOTS = ["Sáng (8:00–12:00)", "Chiều (13:00–17:00)", "Tối (18:00–21:00)"];

export default function GuideProfile() {
  const g = getGuide(DEMO_GUIDE_ID);
  const { speak } = useA11y();
  const [avail, setAvail] = useState({ 0: true, 1: true, 2: false });

  function toggle(i) {
    setAvail((a) => ({ ...a, [i]: !a[i] }));
    speak(`${SLOTS[i]}: ${!avail[i] ? "rảnh" : "bận"}.`);
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Hồ sơ & Lịch rảnh</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section id="settings" className="card hc-surface hc-border p-6" aria-labelledby="pf">
          <h2 id="pf" className="text-2xl">Hồ sơ</h2>
          <dl className="mt-4 space-y-3">
            <div><dt className="text-sm text-ink-soft hc-muted">Họ tên</dt><dd className="text-lg font-semibold">{g.name}</dd></div>
            <div><dt className="text-sm text-ink-soft hc-muted">Vai trò</dt><dd className="font-semibold">{g.role}</dd></div>
            <div><dt className="text-sm text-ink-soft hc-muted">Kinh nghiệm</dt><dd>{g.exp}</dd></div>
            <div><dt className="text-sm text-ink-soft hc-muted">Ngôn ngữ</dt><dd>{g.languages.join(", ")}</dd></div>
            <div><dt className="text-sm text-ink-soft hc-muted">Khu vực</dt><dd>{g.area}</dd></div>
            <div><dt className="text-sm text-ink-soft hc-muted">Giá</dt><dd className="font-semibold">{g.price}</dd></div>
            <div><dt className="text-sm text-ink-soft hc-muted">Đánh giá</dt><dd className="flex items-center gap-1 font-semibold"><StarIcon size={16} /> {g.rating ?? "Chưa có — hồ sơ demo"}</dd></div>
          </dl>
        </section>

        <section className="card hc-surface hc-border p-6" aria-labelledby="av">
          <h2 id="av" className="text-2xl">Lịch rảnh</h2>
          <p className="hc-muted mt-1 text-sm text-ink-soft">Bật khung giờ bạn có thể nhận khách. Hệ thống sẽ chỉ cho đặt khi bạn rảnh.</p>
          <div className="mt-4 space-y-3">
            {SLOTS.map((s, i) => (
              <label key={i} className="flex items-center justify-between rounded-2xl border border-line p-4 hc-border">
                <span className="font-semibold">{s}</span>
                <input type="checkbox" checked={!!avail[i]} onChange={() => toggle(i)} className="h-5 w-5 accent-[#f8ae38]" />
              </label>
            ))}
          </div>
          <button type="button" onClick={()=>speak("Đây là lịch rảnh minh họa trên màn hình, chưa được lưu lên server.")} className="btn-primary mt-4"><CheckIcon size={20} /> Lịch rảnh — DEMO chưa lưu</button>
        </section>
      </div>

      <section id="security" className="card hc-surface hc-border mt-8 p-6" aria-labelledby="security-title">
        <h2 id="security-title" className="text-2xl">Bảo mật & mật khẩu</h2>
        <p className="hc-muted mt-2 text-sm text-ink-soft">Khu vực quản lý mật khẩu và phương thức xác minh. Prototype chưa kết nối backend xác thực thật.</p>
        <button type="button" className="btn-ghost hc-border mt-4">Đổi mật khẩu</button>
      </section>
    </div>
  );
}
