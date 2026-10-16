"use client";

import { useState } from "react";
import { useA11y } from "@/components/A11yProvider";
import { businesses } from "@/data/businesses";
import { CheckIcon } from "@/components/Icons";

export default function AdminBusinesses() {
  const { speak } = useA11y();
  const [state, setState] = useState(
    Object.fromEntries(businesses.map((b) => [b.id, b.verified ? "verified" : "pending"]))
  );

  function setStatus(id, status, name) {
    setState((s) => ({ ...s, [id]: status }));
    speak(`${name}: ${status === "verified" ? "đã xác minh" : status === "suspended" ? "đã tạm ngưng" : "chờ duyệt"}.`);
  }

  const STATUS = {
    verified: { label: "Đã xác minh", cls: "bg-green-100 text-green-900" },
    pending: { label: "Chờ duyệt", cls: "bg-amber-100 text-amber-900" },
    suspended: { label: "Tạm ngưng", cls: "bg-red-100 text-red-900" },
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Quản lý doanh nghiệp</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">Xác minh, tạm ngưng đối tác. Chỉ doanh nghiệp đã xác minh mới được bán dịch vụ.</p>

      <ul className="mt-8 space-y-4">
        {businesses.map((b) => {
          const st = STATUS[state[b.id]] || STATUS.pending;
          return (
            <li key={b.id} className="card hc-surface hc-border flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <img src={b.logo} alt={`Ảnh minh họa cho ${b.name}`} className="h-20 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-lg font-semibold">{b.name}</p>
                <p className="hc-muted text-ink-soft">{b.type} · {b.area} · Đại diện: {b.rep}</p>
                <p className="hc-muted text-sm text-ink-soft">{b.items.length} dịch vụ</p>
              </div>
              <span className={`rounded-pill px-3 py-1 text-xs font-bold ${st.cls}`}>{st.label}</span>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setStatus(b.id, "verified", b.name)} className="btn-primary !py-2 text-sm"><CheckIcon size={16} /> Xác minh</button>
                <button onClick={() => setStatus(b.id, "suspended", b.name)} className="btn-ghost hc-border !py-2 text-sm">Tạm ngưng</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
