"use client";
import {useBusiness} from "@/components/BusinessShell";

import { useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import { getBusiness } from "@/data/businesses";
import { UserIcon, MapPinIcon, CheckIcon } from "@/components/Icons";

export default function BusinessProfile() {
  const {businessId}=useBusiness();
  const biz = getBusiness(businessId);
  const { speak } = useA11y();
  const [form, setForm] = useState({
    name: biz.name, type: biz.type, area: biz.area, rep: biz.rep,
    phone: "", hours: "",
    desc: "Hồ sơ doanh nghiệp demo. Business thật phải cung cấp thông tin xác minh và chỉ khai báo accessibility feature có căn cứ.",
  });
  const [saved, setSaved] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); setSaved(false); }
  function submit(e) { e.preventDefault(); setSaved(true); speak("Đã cập nhật bản nháp trên màn hình. Chưa lưu hồ sơ lên server."); }

  const renderField = (label, k, type = "text") => (
    <div>
      <label htmlFor={k} className="mb-1 block font-semibold">{label}</label>
      <input id={k} type={type} value={form[k]} onChange={(e) => set(k, e.target.value)} className="w-full rounded-pill border border-line bg-white px-5 py-3 text-lg outline-none hc-surface hc-border" />
    </div>
  );

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Hồ sơ doanh nghiệp</h1>
      <p className="hc-muted mt-2 text-lg text-ink-soft">Bản demo cho BR01–BR03: hồ sơ, xác minh và khai báo accessibility. Tài khoản này chưa được xác minh.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={submit} className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {renderField("Tên doanh nghiệp", "name")}
            {renderField("Loại hình", "type")}
            {renderField("Khu vực", "area")}
            {renderField("Người đại diện", "rep")}
            {renderField("Điện thoại", "phone")}
            {renderField("Giờ hoạt động", "hours")}
          </div>
          <div>
            <label htmlFor="desc" className="mb-1 block font-semibold">Mô tả</label>
            <textarea id="desc" rows={4} value={form.desc} onChange={(e) => set("desc", e.target.value)} className="w-full rounded-2xl border border-line bg-white px-5 py-3 text-lg outline-none hc-surface hc-border" />
          </div>
          <button type="submit" className="btn-primary text-lg"><CheckIcon size={22} /> {saved ? "Bản nháp chưa lưu server" : "Xem bản nháp hồ sơ — DEMO"}</button>
        </form>

        <aside className="h-fit rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border" aria-label="Xem trước">
          <p className="text-sm font-semibold text-ink-soft hc-muted">Xem trước hồ sơ</p>
          <img src={biz.logo} alt={`Ảnh minh họa cho ${biz.name}`} className="mt-3 h-28 w-full rounded-xl object-cover" />
          <p className="mt-3 flex items-center gap-2 text-xl font-semibold"><UserIcon size={20} /> {form.name}</p>
          <p className="hc-muted flex items-center gap-1 text-ink-soft"><MapPinIcon size={15} /> {form.area} · {form.type}</p>
          {biz.verified && <span className="chip mt-2 bg-green-100 text-green-900">✓ Đã xác minh</span>}
          <p className="hc-muted mt-3 text-sm text-ink-soft">{form.desc}</p>
        </aside>
      </div>
    </div>
  );
}
