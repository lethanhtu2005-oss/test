"use client";

import Link from "next/link";
import { useA11y } from "./A11yProvider";
import VerifiedImage from "./VerifiedImage";
import { MapPinIcon, SpeakerIcon, AccessibleIcon } from "./Icons";

const levelColor = {
  "Dữ liệu một phần": "bg-blue-100 text-blue-950",
  "Cần khảo sát": "bg-amber-100 text-amber-950",
  "Cần xác minh": "bg-violet-100 text-violet-950",
  "Cần hỗ trợ": "bg-orange-100 text-orange-950",
};

export default function DestinationCard({ d, priority = false }) {
  const { speak } = useA11y();

  return (
    <article className="card hc-surface hc-border group flex h-full flex-col overflow-hidden border border-line hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-alt">
        <VerifiedImage
          src={d.image}
          fallback={d.imageFallback}
          alt={d.alt}
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span
          className={`absolute left-3 top-3 rounded-pill px-3 py-1 text-xs font-bold ${levelColor[d.access.level] || "bg-white text-ink"}`}
        >
          <AccessibleIcon size={14} className="mr-1 inline align-[-2px]" />
          {d.access.level}
        </span>
        <span className="absolute bottom-3 right-3 rounded-pill bg-black/80 px-3 py-1 text-xs font-semibold text-white">
          Ảnh có nguồn
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1 text-sm text-ink-soft hc-muted">
          <MapPinIcon size={16} /> {d.area}
        </p>
        <h3 className="mt-1 text-2xl">{d.name}</h3>
        <p className="mt-2 flex-1 text-ink-soft hc-muted">{d.summary}</p>
        <p className="mt-3 text-sm font-semibold text-ink">
          Accessibility: {d.access.status}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/destination/${d.slug}`}
            className="btn-primary !min-h-[44px] !py-2 text-sm"
          >
            Xem dữ liệu
          </Link>
          <button
            type="button"
            onClick={() => speak(d.audio)}
            className="btn-ghost hc-border !min-h-[44px] !py-2 text-sm"
            aria-label={`Nghe mô tả bằng giọng nói về ${d.name}`}
          >
            <SpeakerIcon size={18} /> Nghe mô tả
          </button>
        </div>
      </div>
    </article>
  );
}
