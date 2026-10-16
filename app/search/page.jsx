"use client";

import { useState } from "react";
import Link from "next/link";
import { useA11y } from "@/components/A11yProvider";
import VerifiedImage from "@/components/VerifiedImage";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { destinations } from "@/data/destinations";
import { MicIcon, SearchIcon, SpeakerIcon, AccessibleIcon, MapPinIcon } from "@/components/Icons";

const QUERIES = ["địa điểm có audio guide", "địa điểm cần khảo sát accessibility", "Văn Miếu", "gần Hồ Hoàn Kiếm"];

export default function SearchPage() {
  const { speak } = useA11y();
  const [query, setQuery] = useState("");
  const [simListening, setSimListening] = useState(false);
  const [results, setResults] = useState(destinations);
  const { supported, listening: realListening, start } = useSpeechRecognition({ onResult: (t) => runSearch(t) });
  const listening = realListening || simListening;

  function runSearch(text) {
    const clean = (text || "").trim();
    setQuery(clean);
    const q = clean.toLowerCase();
    const matched = !q ? destinations : destinations.filter((d) => [d.name, d.area, d.summary, d.access.level, d.access.status, ...d.tags].join(" ").toLowerCase().includes(q));
    setResults(matched);
    speak(matched.length ? `Tìm thấy ${matched.length} điểm đến. Hãy kiểm tra trạng thái xác minh accessibility trên từng kết quả.` : "Chưa có điểm đến khớp từ khóa trong dữ liệu demo.");
  }

  function handleMic() {
    if (listening) return;
    speak("Đang nghe.");
    if (supported) { start(); return; }
    setSimListening(true);
    setTimeout(() => { setSimListening(false); runSearch("Văn Miếu"); }, 1200);
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Tìm kiếm điểm đến & accessibility</h1>
      <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">Nói hoặc gõ địa điểm/tiêu chí. Kết quả phân biệt rõ thông tin đã đối chiếu và dữ liệu cần khảo sát, thay vì mặc định một nơi “dễ tiếp cận”.</p>
      <form role="search" className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); runSearch(query); }}>
        <label htmlFor="q" className="sr-only">Nhập nội dung tìm kiếm</label>
        <div className="flex flex-1 items-center gap-2 rounded-pill border border-line bg-white px-5 hc-surface hc-border"><SearchIcon size={22} className="text-ink-soft" /><input id="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ví dụ: địa điểm có audio guide" className="w-full bg-transparent py-4 text-lg outline-none" /></div>
        <button type="submit" className="btn-primary text-lg">Tìm</button>
        <button type="button" onClick={handleMic} aria-pressed={listening} aria-label={listening ? "Đang nghe" : "Tìm kiếm bằng giọng nói"} className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-white ${listening ? "listening-ring" : "hover:bg-neutral-800"}`}><MicIcon size={26} /></button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">{QUERIES.map((qs) => <button key={qs} type="button" onClick={() => runSearch(qs)} className="chip hc-surface hc-border hover:bg-primary">“{qs}”</button>)}</div>

      <h2 className="mt-10 text-2xl" aria-live="polite">{results.length} kết quả{query ? ` cho “${query}”` : ""}</h2>
      {results.length === 0 ? <p className="hc-muted mt-4 text-ink-soft">Không có kết quả trong bộ dữ liệu demo hiện tại.</p> : <ul className="mt-4 space-y-4">{results.map((d) => <li key={d.slug} className="card hc-surface hc-border flex flex-col gap-4 border border-line p-4 sm:flex-row sm:items-center"><VerifiedImage src={d.image} fallback={d.imageFallback} alt={d.alt} className="h-32 w-full rounded-xl object-cover sm:w-44" /><div className="flex-1"><p className="flex flex-wrap items-center gap-2 text-sm text-ink-soft hc-muted"><span className="flex items-center gap-1"><MapPinIcon size={15} /> {d.area}</span><span className="inline-flex items-center gap-1 rounded-pill bg-surface-alt px-2 py-0.5 text-xs font-bold text-ink hc-surface"><AccessibleIcon size={13} /> {d.access.level}</span></p><h3 className="mt-1 text-xl">{d.name}</h3><p className="hc-muted text-ink-soft">{d.summary}</p><p className="mt-2 text-sm font-semibold">{d.access.status}</p></div><div className="flex gap-2 sm:flex-col"><button type="button" onClick={() => speak(d.audio)} className="btn-ghost hc-border !py-2 text-sm" aria-label={`Nghe mô tả ${d.name}`}><SpeakerIcon size={18} /> Nghe</button><Link href={`/destination?d=${d.slug}`} className="btn-primary !py-2 text-sm">Chi tiết</Link></div></li>)}</ul>}
    </div>
  );
}
