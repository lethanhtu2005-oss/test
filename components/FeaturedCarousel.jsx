"use client";

import { useRef } from "react";
import { useA11y } from "./A11yProvider";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import VerifiedImage from "@/components/VerifiedImage";

export default function FeaturedCarousel() {
  const track = useRef(null);
  const { reduceMotion } = useA11y();
  function scrollBy(dir) {
    track.current?.scrollBy({
      left: dir * 320,
      behavior:
        reduceMotion ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
    });
  }

  return (
    <section
      className="bg-surface-alt py-14 hc-surface"
      aria-labelledby="fav-heading"
    >
      <div className="container-page">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="chip hc-surface hc-border bg-white">
              Địa điểm trong dữ liệu demo
            </p>
            <h2 id="fav-heading" className="mt-3 text-3xl sm:text-4xl">
              Khám phá Hà Nội với thông tin nguồn rõ ràng
            </h2>
          </div>
          <div
            className="hidden gap-2 sm:flex"
            role="group"
            aria-label="Cuộn danh sách địa điểm"
          >
            <button
              onClick={() => scrollBy(-1)}
              className="btn-ghost hc-border !p-3"
              aria-label="Cuộn danh sách sang trái"
            >
              ‹
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="btn-ghost hc-border !p-3"
              aria-label="Cuộn danh sách sang phải"
            >
              ›
            </button>
          </div>
        </div>

        <ul
          ref={track}
          className="mt-8 flex snap-x gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "thin" }}
        >
          {destinations.map((d) => (
            <li key={d.slug} className="w-[280px] shrink-0 snap-start">
              <Link
                href={`/destination/${d.slug}`}
                className="group relative block h-[360px] overflow-hidden rounded-[10px] shadow-card"
                aria-label={`${d.name}. Trạng thái accessibility: ${d.access.level}. Xem chi tiết.`}
              >
                <VerifiedImage
                  src={d.image}
                  fallback={d.imageFallback}
                  alt={d.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute left-3 top-3 rounded-pill bg-white/95 px-3 py-1 text-xs font-bold text-ink">
                  {d.access.level}
                </span>
                <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="block font-display text-2xl leading-tight">
                    {d.name}
                  </span>
                  <span className="mt-2 block text-sm text-neutral-100">
                    {d.area}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
