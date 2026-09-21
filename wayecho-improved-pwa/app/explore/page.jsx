"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CatalogCard from "@/components/CatalogCard";
import { CATEGORIES, byCategory, catLabel } from "@/data/catalog";
import { itemA11y, A11Y_FILTERS } from "@/data/businesses";

function ExploreContent() {
  const params = useSearchParams();
  const cat = params.get("cat") || "destination";
  const [filters, setFilters] = useState({});

  const active = Object.keys(filters).filter((k) => filters[k]);
  const items = byCategory(cat).filter((it) => {
    if (active.length === 0) return true;
    const a = itemA11y(it);
    return active.every((k) => a[k]);
  });

  function toggle(k) {
    setFilters((f) => ({ ...f, [k]: !f[k] }));
  }

  return (
    <div className="container-page py-10">
      <p className="text-sm text-ink-soft hc-muted">
        <Link href="/" className="hover:underline">Trang chủ</Link> · Khám phá
      </p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Khám phá {catLabel(cat)}</h1>
      <p className="hc-muted mt-2 max-w-2xl text-lg text-ink-soft">
        Mỗi mục hiển thị trạng thái dữ liệu tiếp cận. Dịch vụ chưa có nhà cung cấp thật được gắn nhãn DEMO; tiêu chí chưa xác minh không được coi là “Có”. Chọn danh mục:
      </p>

      {/* Tabs danh mục */}
      <nav aria-label="Danh mục" className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/explore?cat=${c.id}`}
            aria-current={c.id === cat ? "page" : undefined}
            className={`inline-flex min-h-[44px] items-center rounded-pill px-4 text-sm font-semibold transition-colors ${
              c.id === cat ? "bg-primary text-ink" : "border border-line bg-white text-ink hover:bg-surface-alt hc-surface hc-border"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      {/* Bộ lọc accessibility */}
      <div className="mt-5 rounded-2xl border border-line bg-white p-4 hc-surface hc-border" role="group" aria-label="Lọc theo khả năng tiếp cận">
        <p className="mb-2 text-sm font-semibold text-ink-soft hc-muted">Lọc theo khả năng tiếp cận</p>
        <div className="flex flex-wrap gap-2">
          {A11Y_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => toggle(f.key)}
              aria-pressed={!!filters[f.key]}
              className={`inline-flex min-h-[40px] items-center rounded-pill px-3 text-sm font-semibold transition-colors ${
                filters[f.key] ? "bg-primary text-ink" : "border border-line bg-surface-alt text-ink hover:bg-white hc-surface hc-border"
              }`}
            >
              {f.label}
            </button>
          ))}
          {active.length > 0 && (
            <button type="button" onClick={() => setFilters({})} className="inline-flex min-h-[40px] items-center px-3 text-sm font-semibold text-accent-dark hover:underline">
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      <h2 className="mt-8 text-2xl" aria-live="polite">{items.length} kết quả</h2>
      {items.length === 0 ? (
        <p className="hc-muted mt-4 text-ink-soft">Không có mục nào khớp bộ lọc. Thử bỏ bớt tiêu chí.</p>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => <CatalogCard key={it.id} item={it} />)}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="container-page py-10">Đang tải…</div>}>
      <ExploreContent />
    </Suspense>
  );
}
