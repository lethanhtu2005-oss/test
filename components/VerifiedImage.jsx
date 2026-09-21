"use client";

import { useState } from "react";

export default function VerifiedImage({ src, fallback, alt, fallbackAlt, className = "", loading = "lazy", priority = false }) {
  const [current, setCurrent] = useState(src || fallback);
  const showingFallback = Boolean(fallback && current === fallback && src && src !== fallback);
  const effectiveAlt = showingFallback
    ? (fallbackAlt || `Ảnh nguồn của địa điểm hiện không tải được. Mô tả ảnh dự kiến: ${alt}`)
    : alt;

  return (
    <img
      src={current}
      alt={effectiveAlt}
      loading={priority ? "eager" : loading}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => { if (fallback && current !== fallback) setCurrent(fallback); }}
      className={className}
    />
  );
}
