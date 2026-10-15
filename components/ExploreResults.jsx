"use client";
import { useState } from "react";
import Link from "next/link";
import CatalogCard from "./CatalogCard";
import { CATEGORIES, byCategory, catLabel } from "@/data/catalog";
import { itemA11y, A11Y_FILTERS } from "@/data/businesses";
export default function ExploreResults({ category, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery),
    [filters, setFilters] = useState({});
  const active = Object.keys(filters).filter((k) => filters[k]);
  const normalize = (t) =>
    t
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/đ/g, "d");
  const q = normalize(query.trim());
  const items = byCategory(category).filter(
    (it) =>
      (!q || normalize([it.name, it.area, it.summary].join(" ")).includes(q)) &&
      (!active.length || active.every((k) => itemA11y(it)[k])),
  );
  return (
    <section id="catalog-results" aria-labelledby="catalog-title">
      <div className="section-top">
        <div>
          <p className="eyebrow">Tìm theo nhu cầu</p>
          <h2 id="catalog-title">{catLabel(category)} tại Hà Nội</h2>
        </div>
      </div>
      <nav
        aria-label="Danh mục điểm đến và dịch vụ"
        className="flex flex-wrap gap-2 mb-6"
      >
        {CATEGORIES.map((c) => (
          <Link
            className={`chip min-h-11 border ${c.id === category ? "border-primary !bg-primary" : "border-line"}`}
            href={c.href + "#catalog-results"}
            key={c.id}
            aria-current={c.id === category ? "page" : undefined}
          >
            {c.label}
          </Link>
        ))}
      </nav>
      <div className="grid gap-5 md:grid-cols-[1fr_2fr] rounded-2xl border border-line bg-white p-5">
        <div>
          <label htmlFor="catalog-query" className="block font-semibold mb-2">
            Tìm trong danh mục
          </label>
          <input
            id="catalog-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên điểm đến hoặc khu vực"
            className="w-full min-h-12 rounded-xl border border-line bg-surface px-3"
          />
        </div>
        <fieldset>
          <legend className="font-semibold mb-2">
            Tiêu chí tiếp cận đã có dữ liệu
          </legend>
          <div className="flex flex-wrap gap-2">
            {A11Y_FILTERS.map((f) => (
              <button
                key={f.key}
                aria-pressed={!!filters[f.key]}
                className={`chip min-h-11 border ${filters[f.key] ? "!bg-primary border-primary" : "border-line"}`}
                onClick={() =>
                  setFilters((v) => ({ ...v, [f.key]: !v[f.key] }))
                }
              >
                {f.label}
              </button>
            ))}
            {(active.length > 0 || query) && (
              <button
                className="text-link"
                onClick={() => {
                  setFilters({});
                  setQuery("");
                }}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </fieldset>
      </div>
      <p className="text-ink-soft text-sm mt-3">
        ‘Chưa xác minh’ không được coi là ‘Có’. Dịch vụ minh họa được gắn nhãn
        DEMO.
      </p>
      <p className="my-6 font-semibold" role="status">
        {items.length} kết quả{query ? ` cho “${query}”` : ""}
      </p>
      {items.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <CatalogCard item={it} key={it.id} />
          ))}
        </div>
      ) : (
        <div className="notice">
          <p>
            Chưa có mục phù hợp với tiêu chí đã chọn. Bạn có thể bỏ bớt bộ lọc
            hoặc tìm một địa điểm khác.
          </p>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setFilters({});
            }}
          >
            Xem lại danh mục
          </button>
        </div>
      )}
    </section>
  );
}
