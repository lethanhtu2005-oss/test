"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import { api } from "@/lib/api";
import { MapPinIcon, TrashIcon, SpeakerIcon, HeartIcon, CompassIcon } from "@/components/Icons";
import { getItem } from "@/data/catalog";

function List({ title, empty, items, onRemove, speak }) {
  return (
    <section className="mt-8" aria-label={title}>
      <h2 className="text-2xl">{title} ({items.length})</h2>
      {items.length === 0 ? (
        <p className="hc-muted mt-3 text-ink-soft">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((it) => (
            <li key={it.id} className="card hc-surface hc-border flex items-center gap-4 p-3">
              <img src={it.image || "/assets/images/hoguom-lake.jpg"} alt="" aria-hidden="true" className="h-20 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <Link href={`/item?id=${it.refId}`} className="text-lg font-semibold hover:text-accent-dark hover:underline">{it.name}</Link>
                {it.area && <p className="hc-muted flex items-center gap-1 text-sm text-ink-soft"><MapPinIcon size={14} /> {it.area}</p>}
              </div>
              <button onClick={() => { const g = getItem(it.refId); speak(g?.audio || it.name); }} className="btn-ghost hc-border !min-h-[40px] !p-2" aria-label={`Nghe mô tả ${it.name}`}><SpeakerIcon size={18} /></button>
              <button onClick={() => onRemove(it.refId)} className="btn-ghost hc-border !min-h-[40px] !p-2" aria-label={`Xóa ${it.name}`}><TrashIcon size={18} /></button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function MyTripPage() {
  const { speak } = useA11y();
  const [trip, setTrip] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState("");

  async function refresh() {
    try {
      const [t, s] = await Promise.all([api.listTrip(), api.listSaved()]);
      setTrip(t); setSaved(s);
    } catch(err) { setError(err.message); } finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function removeTrip(refId) { try { await api.removeFromTrip(refId); setTrip((x) => x.filter((i) => i.refId !== refId)); speak("Đã xóa khỏi chuyến đi."); } catch(err) { setError(err.message); speak(err.message); } }
  async function removeSaved(refId) { try { await api.unsavePlace(refId); setSaved((x) => x.filter((i) => i.refId !== refId)); speak("Đã bỏ lưu."); } catch(err) { setError(err.message); speak(err.message); } }

  return (
    <div className="container-page py-10">
      {error && <p role="alert" className="mb-4 text-red-800">{error}</p>}
      <h1 className="text-4xl sm:text-5xl">Chuyến đi của tôi</h1>
      <p className="hc-muted mt-3 max-w-2xl text-lg text-ink-soft">
        Kế hoạch chuyến đi và những nơi bạn đã lưu — đọc được bằng giọng nói và mở bản đồ demo.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/explore" className="btn-primary"><CompassIcon size={20} /> Thêm điểm đến</Link>
        <Link href="/navigation" className="btn-ghost hc-border"><MapPinIcon size={20} /> Xem trên bản đồ</Link>
      </div>

      {loading ? (
        <p className="mt-8 text-ink-soft">Đang tải…</p>
      ) : error ? null : (
        <>
          <List title="Lịch trình chuyến đi" empty="Chưa có điểm nào. Hãy thêm từ trang Khám phá." items={trip} onRemove={removeTrip} speak={speak} />
          <List title="Địa điểm đã lưu" empty="Bạn chưa lưu địa điểm nào." items={saved} onRemove={removeSaved} speak={speak} />
        </>
      )}
    </div>
  );
}
