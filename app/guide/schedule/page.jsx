import { guideAssignments } from "@/data/guides";
import { CalendarIcon, MapPinIcon } from "@/components/Icons";

export default function GuideSchedulePage() {
  return (
    <div className="container-page py-10">
      <h2 className="text-4xl sm:text-5xl">Lịch hỗ trợ</h2>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">Xem những lịch đã nhận và khung thời gian cần chuẩn bị.</p>
      <div className="mt-7 grid gap-4">
        {guideAssignments.map((a) => (
          <article key={a.id} className="card hc-surface hc-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl">{a.service}</h3>
                <p className="hc-muted mt-1 text-sm text-ink-soft">{a.traveler}</p>
                <div className="hc-muted mt-3 flex flex-wrap gap-4 text-sm text-ink-soft">
                  <span className="inline-flex items-center gap-1"><CalendarIcon size={16}/>{a.date} · {a.period} {a.time}</span>
                  <span className="inline-flex items-center gap-1"><MapPinIcon size={16}/>{a.location}</span>
                </div>
                <p className="mt-3 text-sm">{a.note}</p>
              </div>
              <span className={`rounded-pill px-3 py-1 text-xs font-bold ${a.status === "accepted" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{a.status === "accepted" ? "Đã nhận" : "Chờ xác nhận"}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
