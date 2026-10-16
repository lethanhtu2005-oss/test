"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEMO_BUSINESS_ID } from "@/data/businesses";
import { AccessibleIcon, CheckIcon } from "@/components/Icons";

const STATUS = {
  pending: { label: "Đang chờ", cls: "bg-amber-100 text-amber-900" },
  accepted: { label: "Đã chấp nhận", cls: "bg-green-100 text-green-900" },
  rejected: { label: "Đã từ chối", cls: "bg-red-100 text-red-900" },
};

export default function BusinessRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    api.listRequests(DEMO_BUSINESS_ID).then(setRequests).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function decide(id, status) {
    setBusy(id);
    try {
      const updated = await api.updateRequest(id, status);
      setRequests((rs) => rs.map((r) => (r.id === id ? updated : r)));
    } catch (_) {} finally { setBusy(null); }
  }

  return (
    <div className="container-page py-10">
      <h1 className="flex items-center gap-3 text-4xl sm:text-5xl"><AccessibleIcon size={36} /> Yêu cầu hỗ trợ tiếp cận</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">
        Khách khiếm thị gửi yêu cầu hỗ trợ kèm theo đơn đặt. Xác nhận để khách yên tâm chuẩn bị cho chuyến đi.
      </p>

      {loading ? <p className="mt-8 text-ink-soft">Đang tải…</p> : requests.length === 0 ? (
        <div className="mt-8 rounded-[18px] border border-line bg-white p-8 text-center hc-surface hc-border">
          <p className="text-lg">Chưa có yêu cầu hỗ trợ nào.</p>
          <p className="hc-muted mt-1 text-ink-soft">Đặt một dịch vụ kèm chọn “Cần người hỗ trợ” ở phía Traveler để thử luồng này.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {requests.map((r) => {
            const st = STATUS[r.status] || STATUS.pending;
            return (
              <li key={r.id} className="card hc-surface hc-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{r.itemName}</p>
                    <p className="hc-muted mt-1 text-ink-soft">“{r.content}”</p>
                  </div>
                  <span className={`rounded-pill px-3 py-1 text-xs font-bold ${st.cls}`}>{st.label}</span>
                </div>
                {r.status === "pending" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => decide(r.id, "accepted")} disabled={busy === r.id} className="btn-primary !py-2 text-sm disabled:opacity-60">
                      <CheckIcon size={18} /> Chấp nhận
                    </button>
                    <button onClick={() => decide(r.id, "rejected")} disabled={busy === r.id} className="btn-ghost hc-border !py-2 text-sm disabled:opacity-60">
                      Từ chối
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
