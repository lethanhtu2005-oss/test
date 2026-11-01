import test from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const root = fileURLToPath(new URL("../", import.meta.url));
register(new URL("./helpers/alias-loader.mjs", import.meta.url), { data: { root } });

const { articles, getArticle } = await import("../data/articles.js");
const { destinations, getDestination } = await import("../data/destinations.js");
const { default: sitemap } = await import("../app/sitemap.js");

test("H-01: Bài Pillar 'cam-nang-du-lich-pho-co' tồn tại và nội dung tập trung Phố Cổ", () => {
  const pillar = getArticle("cam-nang-du-lich-pho-co");
  assert.ok(pillar, "Phải có bài Pillar cam-nang-du-lich-pho-co");
  assert.ok(pillar.title.includes("Phố Cổ Hà Nội"));
  assert.ok(pillar.sections.length >= 3);
  assert.ok(pillar.destinationSlugs.includes("ho-guom"));
});

test("H-01: Đủ 10 bài Cluster chuyên sâu về các tuyến phố và dịch vụ Phố Cổ", () => {
  const clusters = [
    "tuyen-bo-hang-bac-ma-may",
    "nghe-thuyet-minh-den-ngoc-son",
    "trai-nghiem-o-quan-chuong",
    "kham-pha-nha-co-ma-may",
    "am-thuc-ngo-nho-pho-co",
    "tram-ho-tro-28-hang-buom",
    "xich-lo-tro-nang-pho-co",
    "tham-quan-mua-roi-thang-long",
    "den-bach-ma-dinh-kim-ngan",
    "kinh-nghiem-cho-dong-xuan",
  ];

  for (const slug of clusters) {
    const art = getArticle(slug);
    assert.ok(art, `Phải có bài cluster: ${slug}`);
    assert.ok(art.sections.length >= 3, `Bài ${slug} phải có ít nhất 3 phần`);
    assert.ok(art.related.length >= 1, `Bài ${slug} phải có bài liên quan`);
    for (const dSlug of art.destinationSlugs) {
      assert.ok(getDestination(dSlug), `Điểm đến ${dSlug} trong bài ${slug} phải tồn tại trong Phố Cổ`);
    }
  }

  assert.ok(articles.length >= 14, "Tổng số bài viết cẩm nang phải đạt ít nhất 14 bài");
});

test("H-02: Đường dẫn động /diem-den/[slug] sinh static params cho đủ 7 điểm đến Phố Cổ", async () => {
  const code = await readFile(new URL("../app/diem-den/[slug]/page.jsx", import.meta.url), "utf8");
  assert.ok(code.includes("export function generateStaticParams"), "Phải export hàm generateStaticParams");
  assert.ok(code.includes("destinations.map"), "generateStaticParams phải duyệt qua toàn bộ điểm đến");
  assert.ok(code.includes("generateMetadata"), "Phải có hàm generateMetadata");
  assert.ok(code.includes("`/diem-den/${d.slug}`"), "Metadata phải trỏ về canonical /diem-den/[slug]");
});

test("H-03: Sitemap chứa đầy đủ URL chuẩn SEO /diem-den/[slug] và các bài cẩm nang", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://wayecho.vn";
  try {
    const map = sitemap();
    const urls = map.map((m) => m.url);
    for (const d of destinations) {
      assert.ok(
        urls.includes(`https://wayecho.vn/diem-den/${d.slug}`),
        `Sitemap phải chứa https://wayecho.vn/diem-den/${d.slug}`
      );
    }
    for (const a of articles) {
      assert.ok(
        urls.includes(`https://wayecho.vn/articles/${a.slug}`),
        `Sitemap phải chứa https://wayecho.vn/articles/${a.slug}`
      );
    }
  } finally {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  }
});
