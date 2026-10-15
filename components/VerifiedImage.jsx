"use client";
import { useState } from "react";
import { imageSizes } from "@/data/image-sizes";
export default function VerifiedImage({
  src,
  fallback = "/assets/images/location-image-unavailable.svg",
  alt,
  fallbackAlt,
  className = "",
  loading = "lazy",
  priority = false,
  width,
  height,
  sizes = "(max-width: 760px) 100vw, 50vw",
}) {
  const [failedSource, setFailedSource] = useState(null);
  const asset = imageSizes[src];
  const isFallback = !src || failedSource === src;
  return (
    <img
      src={isFallback ? fallback : src}
      alt={
        isFallback
          ? fallbackAlt ||
            "Ảnh hiện không tải được; thông tin vẫn có ở phần văn bản."
          : alt
      }
      width={width || asset?.width}
      height={height || asset?.height}
      srcSet={isFallback ? undefined : asset?.srcSet}
      sizes={asset ? sizes : undefined}
      loading={priority ? "eager" : loading}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (!isFallback) setFailedSource(src);
      }}
      className={className}
    />
  );
}
