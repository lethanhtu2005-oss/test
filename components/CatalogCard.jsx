"use client";

import { useState } from "react";
import Link from "next/link";
import { useA11y } from "./A11yProvider";
import VerifiedImage from "./VerifiedImage";
import { api } from "@/lib/api";
import {
  MapPinIcon,
  SpeakerIcon,
  HeartIcon,
  PlusIcon,
  AccessibleIcon,
} from "./Icons";

const levelColor = {
  "Dữ liệu một phần": "bg-blue-100 text-blue-950",
  "Cần khảo sát": "bg-amber-100 text-amber-950",
  "Cần xác minh": "bg-violet-100 text-violet-950",
  "Cần hỗ trợ": "bg-orange-100 text-orange-950",
  "Chưa xác minh": "bg-neutral-200 text-neutral-900",
};

export default function CatalogCard({ item }) {
  const { speak } = useA11y();
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  async function save() {
    try {
      await api.savePlace({
        refId: item.id,
        name: item.name,
        cat: item.cat,
        image: item.image,
      });
      setSaved(true);
      speak(`Đã lưu ${item.name}.`);
    } catch (_) {
      speak("Không lưu được, thử lại sau.");
    }
  }
  async function addTrip() {
    try {
      await api.addToTrip({
        refId: item.id,
        name: item.name,
        cat: item.cat,
        image: item.image,
        area: item.area,
      });
      setAdded(true);
      speak(`Đã thêm ${item.name} vào chuyến đi.`);
    } catch (_) {
      speak("Không thêm được, thử lại sau.");
    }
  }

  return (
    <article className="card hc-surface hc-border group flex h-full flex-col overflow-hidden border border-line hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
        <VerifiedImage
          src={item.image}
          fallback={item.imageFallback}
          alt={item.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span
          className={`absolute left-3 top-3 rounded-pill px-3 py-1 text-xs font-bold ${levelColor[item.level] || "bg-white text-ink"}`}
        >
          <AccessibleIcon size={13} className="mr-1 inline align-[-2px]" />
          {item.level}
        </span>
        {item.isDemo && (
          <span className="absolute bottom-3 left-3 rounded-pill bg-black/80 px-3 py-1 text-xs font-bold text-white">
            DỮ LIỆU DEMO
          </span>
        )}
        <button
          type="button"
          onClick={save}
          aria-pressed={saved}
          aria-label={saved ? `Đã lưu ${item.name}` : `Lưu ${item.name}`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow"
        >
          <HeartIcon
            size={18}
            filled={saved}
            className={saved ? "text-red-500" : ""}
          />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1 text-sm text-ink-soft hc-muted">
          <MapPinIcon size={15} /> {item.area}
        </p>
        <h3 className="mt-1 text-xl">
          <Link
            href={
              item.destinationSlug && item.cat === "destination"
                ? `/destination/${item.destinationSlug}`
                : `/item?id=${item.id}`
            }
            className="hover:text-accent-dark hover:underline"
          >
            {item.name}
          </Link>
        </h3>
        <p className="mt-1 flex-1 text-ink-soft hc-muted">{item.summary}</p>
        <p className="mt-2 text-sm font-bold text-ink">{item.price}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={
              item.destinationSlug && item.cat === "destination"
                ? `/destination/${item.destinationSlug}`
                : `/item?id=${item.id}`
            }
            className="btn-primary !min-h-[42px] !py-2 text-sm"
          >
            Chi tiết
          </Link>
          <button
            onClick={addTrip}
            aria-pressed={added}
            className="btn-ghost hc-border !min-h-[42px] !py-2 text-sm"
            aria-label={`Thêm ${item.name} vào chuyến đi`}
          >
            <PlusIcon size={16} /> {added ? "Đã thêm" : "Chuyến đi"}
          </button>
          <button
            onClick={() => speak(item.audio)}
            className="btn-ghost hc-border !min-h-[42px] !py-2 text-sm"
            aria-label={`Nghe mô tả ${item.name}`}
          >
            <SpeakerIcon size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
