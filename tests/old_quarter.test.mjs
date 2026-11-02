import test from "node:test";
import assert from "node:assert/strict";
import { destinations, isWithinOldQuarter, OLD_QUARTER_BOUNDS } from "../data/destinations.js";
import { catalog, CATEGORIES, byCategory, getItem } from "../data/catalog.js";

const REMOVED_SLUGS = ["van-mieu", "ho-tay", "tran-quoc", "hoang-thanh-thang-long"];

test("A-01: Tọa độ Bounding Box Phố Cổ Hà Nội hợp lệ", () => {
  assert.equal(OLD_QUARTER_BOUNDS.minLat, 21.0250);
  assert.equal(OLD_QUARTER_BOUNDS.maxLat, 21.0400);
  assert.equal(OLD_QUARTER_BOUNDS.minLng, 105.8450);
  assert.equal(OLD_QUARTER_BOUNDS.maxLng, 105.8600);

  // Tọa độ mẫu thử nghiệm
  assert.equal(isWithinOldQuarter(21.0303, 105.8531), true); // Hồ Gươm
  assert.equal(isWithinOldQuarter(21.0284, 105.8359), false); // Văn Miếu (ngoài khung)
  assert.equal(isWithinOldQuarter(21.0549, 105.8197), false); // Hồ Tây (ngoài khung)
});

test("A-01: 100% điểm đến trong destinations phải thuộc Phố Cổ và có cờ is_old_quarter", () => {
  assert.ok(destinations.length >= 5, "Phải có ít nhất 5 điểm đến");
  for (const d of destinations) {
    assert.equal(d.is_old_quarter, true, `Điểm đến ${d.slug} phải có cờ is_old_quarter = true`);
    assert.ok(d.coordinates, `Điểm đến ${d.slug} thiếu coordinates`);
    const { lat, lng } = d.coordinates;
    assert.ok(
      isWithinOldQuarter(lat, lng),
      `Điểm đến ${d.slug} có tọa độ (${lat}, ${lng}) nằm NGOÀI Bounding Box Phố Cổ!`
    );
    assert.equal(d.area, "Phố Cổ, Hoàn Kiếm", `Khu vực của ${d.slug} phải là 'Phố Cổ, Hoàn Kiếm'`);
    assert.ok(d.street_name, `Điểm đến ${d.slug} thiếu street_name`);
    assert.ok(d.address, `Điểm đến ${d.slug} thiếu address`);
  }
});

test("A-01: Đã gỡ bỏ toàn bộ điểm đến ngoài Phố Cổ (Văn Miếu, Hồ Tây, Trấn Quốc, Hoàng Thành)", () => {
  for (const slug of REMOVED_SLUGS) {
    assert.equal(destinations.some((d) => d.slug === slug), false, `Địa điểm ${slug} vẫn còn trong destinations!`);
    assert.equal(catalog.some((item) => item.id === slug), false, `Địa điểm ${slug} vẫn còn trong catalog!`);
  }
});

test("A-09: Đủ 6 danh mục dịch vụ, mỗi danh mục có ít nhất 5 mục con (tổng >= 30)", () => {
  assert.equal(CATEGORIES.length, 6, "Phải có đúng 6 danh mục");
  const expectedCats = ["destination", "accommodation", "restaurant", "activity", "ticket", "transport"];
  assert.deepEqual(CATEGORIES.map((c) => c.id), expectedCats);

  for (const catId of expectedCats) {
    const items = byCategory(catId);
    assert.ok(
      items.length >= 5,
      `Danh mục ${catId} chỉ có ${items.length} mục, yêu cầu tối thiểu là 5 mục!`
    );
  }

  assert.ok(catalog.length >= 30, `Tổng số mục trong catalog là ${catalog.length}, yêu cầu >= 30!`);
});

test("A-09: 100% mục trong catalog phải thuộc Phố Cổ và không có area 'Hà Nội' chung chung", () => {
  for (const item of catalog) {
    assert.equal(item.is_old_quarter, true, `Mục ${item.id} thiếu is_old_quarter = true`);
    assert.notEqual(item.area, "Hà Nội", `Mục ${item.id} không được để area 'Hà Nội' chung chung`);
    assert.equal(item.area, "Phố Cổ, Hoàn Kiếm", `Mục ${item.id} phải có area là 'Phố Cổ, Hoàn Kiếm'`);
    assert.ok(item.street_name, `Mục ${item.id} thiếu street_name`);
    assert.ok(item.address, `Mục ${item.id} thiếu address`);
    assert.ok(item.coordinates, `Mục ${item.id} thiếu coordinates`);
    const { lat, lng } = item.coordinates;
    assert.ok(
      isWithinOldQuarter(lat, lng),
      `Mục ${item.id} có tọa độ (${lat}, ${lng}) nằm NGOÀI Bounding Box Phố Cổ!`
    );
  }
});

test("A-09: Mỗi mục con phải có >= 3 ảnh thật kèm alt text, credit và license/source", () => {
  for (const item of catalog) {
    assert.ok(Array.isArray(item.images), `Mục ${item.id} phải có mảng images`);
    assert.ok(
      item.images.length >= 3,
      `Mục ${item.id} chỉ có ${item.images.length} ảnh, yêu cầu tối thiểu là 3 ảnh!`
    );
    for (const [idx, img] of item.images.entries()) {
      assert.ok(img.src, `Ảnh #${idx} của mục ${item.id} thiếu src`);
      assert.ok(img.alt && img.alt.length >= 10, `Ảnh #${idx} của mục ${item.id} thiếu alt text có nghĩa`);
      assert.ok(img.credit, `Ảnh #${idx} của mục ${item.id} thiếu credit`);
    }
  }
});

test("A-09: Nguồn công khai có thể truy vết và đối chiếu cho từng mục", () => {
  for (const item of catalog) {
    assert.ok(Array.isArray(item.sources), `Mục ${item.id} phải có mảng sources`);
    assert.ok(item.sources.length >= 1, `Mục ${item.id} phải có ít nhất 1 nguồn công khai`);
    for (const src of item.sources) {
      assert.ok(src.label, `Nguồn của ${item.id} thiếu nhãn label`);
      assert.ok(src.url, `Nguồn của ${item.id} thiếu đường dẫn url`);
    }
    assert.ok(item.checkedAt, `Mục ${item.id} thiếu ngày đối chiếu checkedAt`);
  }
});

test("A-09: getItem tìm kiếm chuẩn xác kể cả id chính hay alias", () => {
  assert.ok(getItem("ho-guom"));
  assert.ok(getItem("la-siesta-classic-ma-may"));
  assert.ok(getItem("ca-phe-giang-nguyen-huu-huan"));
  assert.ok(getItem("tuyen-bo-hang-bac-ma-may"));
  assert.ok(getItem("ve-mua-roi-thang-long"));
  assert.ok(getItem("xich-lo-tro-nang-pho-co"));

  // Tương thích ngược alias cũ
  assert.ok(getItem("demo-hotel"));
  assert.ok(getItem("demo-restaurant"));
  assert.ok(getItem("demo-transport"));
  assert.ok(getItem("demo-guide-tour"));
});
