import test from "node:test";import assert from "node:assert/strict";import {articles,getArticle} from "../data/articles.js";import {destinations,getDestination} from "../data/destinations.js";
test("E: mỗi bài có nội dung riêng, related và điểm đến tồn tại",()=>{assert.equal(new Set(articles.map(a=>a.slug)).size,articles.length);for(const a of articles){assert.ok(a.sections.length>=3);assert.ok(a.related.length);for(const slug of a.related)assert.ok(slug!==a.slug && getArticle(slug));for(const slug of a.destinationSlugs)assert.ok(getDestination(slug));assert.ok(a.sections.every(s=>s.heading&&s.paragraphs.length));}});
test("E: toàn bộ điểm đến phải thuộc Phố Cổ, có nguồn và ảnh hợp lệ",()=>{
  for (const d of destinations) {
    assert.equal(d.is_old_quarter, true, `Điểm đến ${d.slug} phải có is_old_quarter = true`);
    assert.ok(d.coordinates, `Điểm đến ${d.slug} phải có tọa độ`);
    assert.ok(d.coordinates.lat >= 21.0250 && d.coordinates.lat <= 21.0400, `Vĩ độ của ${d.slug} (${d.coordinates.lat}) phải trong Phố Cổ`);
    assert.ok(d.coordinates.lng >= 105.8450 && d.coordinates.lng <= 105.8600, `Kinh độ của ${d.slug} (${d.coordinates.lng}) phải trong Phố Cổ`);
    assert.ok(d.image, `Điểm đến ${d.slug} phải có ảnh`);
    assert.ok(d.alt && d.alt.length > 10, `Điểm đến ${d.slug} phải có alt`);
    assert.ok(Array.isArray(d.images) && d.images.length >= 3, `Điểm đến ${d.slug} phải có ít nhất 3 ảnh`);
    assert.ok(d.sources && d.sources.length >= 1, `Điểm đến ${d.slug} phải có ít nhất 1 nguồn`);
  }
  assert.equal(new Set(destinations.map(d=>d.slug)).size, destinations.length);
});
