import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { articles, relatedArticles } from "../data/articles.js";
import { destinations } from "../data/destinations.js";
import { topics } from "../data/topics.js";
import { ads, adsForContext, validAd } from "../data/ads.js";
const publicPath = (src) => new URL(`../public${src}`, import.meta.url);
test("Mỗi bài có bài đọc tiếp thực sự khác và mọi điểm đến/chủ đề liên kết đều tồn tại", () => {
  for (const a of articles) {
    assert.ok(relatedArticles(a).length >= 1, a.slug);
    assert.equal(relatedArticles(a).length, a.related.length);
    assert.ok(topics.some((t) => t.slug === a.topic));
    for (const d of a.destinations)
      assert.ok(destinations.some((x) => x.slug === d));
  }
  for (const t of topics)
    for (const a of t.related) assert.ok(articles.some((x) => x.slug === a));
});
test("Ảnh cho điểm đến, bài viết, hướng dẫn và quảng cáo tồn tại cục bộ, có alt", () => {
  const items = [
    ...destinations,
    ...articles,
    ...topics.filter((t) => t.image),
    ...ads,
  ];
  for (const item of items) {
    assert.ok(item.alt?.length > 15, item.slug || item.id);
    assert.ok(existsSync(publicPath(item.image)), item.image);
  }
});
test("Không phát hành quảng cáo demo hoặc đối tác chưa xác minh", () => {
  const demo = ads.find((a) => a.demo);
  assert.ok(demo);
  assert.ok(!adsForContext("hanoi").some((x) => x.type === "partner"));
  assert.deepEqual(adsForContext("hanoi", [{ ...demo, active: true }]), []);
  assert.deepEqual(
    adsForContext("hanoi", [{ ...demo, active: true, demo: false }]),
    [],
  );
  assert.equal(validAd({ ...ads[0], href: "javascript:alert(1)" }), false);
  assert.equal(validAd({ ...ads[0], href: "/missing-page" }), false);
  assert.equal(validAd({ ...ads[0], href: "#" }), false);
});
test("Cặp màu chữ/nền chính của cả hai theme đạt 4.5:1, đường focus đạt 3:1", () => {
  const css = readFileSync(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const lum = (s) => {
    const rgb = s
      .match(/\w\w/g)
      .map((x) => parseInt(x, 16) / 255)
      .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  const ratio = (a, b) => {
    const x = lum(a.slice(1)),
      y = lum(b.slice(1));
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  for (const block of [
    css.match(/:root \{([\s\S]*?)\}/)[1],
    css.match(/html\[data-theme="dark"\] \{([\s\S]*?)\}/)[1],
  ]) {
    const v = Object.fromEntries(
      [...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/g)].map((x) => [
        x[1],
        x[2],
      ]),
    );
    for (const bg of ["surface", "surface-alt", "panel"])
      for (const text of ["ink", "muted", "link"])
        assert.ok(ratio(v[bg], v[text]) >= 4.5, `${bg}/${text}`);
    assert.ok(ratio(v.surface, v.focus) >= 3);
  }
  assert.ok(ratio("#f8ae38", "#222a28") >= 4.5);
});
