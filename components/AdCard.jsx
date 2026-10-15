"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import VerifiedImage from "./VerifiedImage";
// Opt-in integration hook only. No requests, identifiers or sensitive user data.
function track(type, id) {
  try {
    if (localStorage.getItem("we-analytics-consent") !== "yes") return;
    window.dispatchEvent(
      new CustomEvent("wayecho:ad", { detail: { type, adId: id } }),
    );
  } catch (_) {}
}
export default function AdCard({ ad, preview = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (preview || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          track("impression", ad.id);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ad.id, preview]);
  return (
    <aside
      ref={ref}
      className="ad-card"
      aria-label={preview ? "Xem trước quảng cáo demo" : ad.label}
    >
      <VerifiedImage src={ad.image} alt={ad.alt} />
      <div>
        <p className="ad-label">
          {preview ? "Xem trước · Không phát hành · " : ""}
          {ad.label}
        </p>
        {ad.type === "partner" && (
          <p className="text-sm font-bold">{ad.partner}</p>
        )}
        <h2>{ad.title}</h2>
        <p>{ad.description}</p>
        <Link
          href="/about#image-credits"
          className="underline text-xs text-ink-soft"
        >
          Nguồn ảnh
        </Link>
      </div>
      <Link
        href={ad.href}
        className="btn-ghost"
        onClick={() => {
          if (!preview) track("click", ad.id);
        }}
      >
        {ad.cta} <span aria-hidden="true">↗</span>
      </Link>
    </aside>
  );
}
