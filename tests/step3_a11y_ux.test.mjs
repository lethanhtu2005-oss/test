import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("B-01: A11yProvider và Profile hỗ trợ auto-apply visual profile và minimalDom", async () => {
  const providerCode = await readFile(new URL("../components/A11yProvider.jsx", import.meta.url), "utf8");
  assert.ok(providerCode.includes("minimalDom"), "Provider phải có state minimalDom");
  assert.ok(providerCode.includes("data-minimal"), "Provider phải gán data-minimal lên documentElement");
  assert.ok(providerCode.includes("applyVisualProfile"), "Provider phải export hàm applyVisualProfile");

  const profileCode = await readFile(new URL("../app/profile/page.jsx", import.meta.url), "utf8");
  assert.ok(profileCode.includes("applyVisualProfile"), "Profile phải gọi applyVisualProfile");
  assert.ok(profileCode.includes("handleUserTypeChange"), "Profile phải có hàm xử lý đổi loại người dùng");

  const cssCode = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.ok(cssCode.includes('html[data-minimal="true"]'), "globals.css phải có style cho minimal DOM");
});

test("B-02: Trang chủ có Skip Links ở đầu DOM và 4 vùng chức năng", async () => {
  const homeCode = await readFile(new URL("../app/page.jsx", import.meta.url), "utf8");
  assert.ok(homeCode.includes("Lối tắt truy cập nhanh 4 vùng chức năng"), "Trang chủ phải có Skip Links nav");
  assert.ok(homeCode.includes("#home-search"), "Phải có lối tắt #home-search");
  assert.ok(homeCode.includes("#home-destinations"), "Phải có lối tắt #home-destinations");
  assert.ok(homeCode.includes("#home-camera"), "Phải có lối tắt #home-camera");
  assert.ok(homeCode.includes("#home-guide"), "Phải có lối tắt #home-guide");

  assert.ok(homeCode.includes('id="home-search"'), "Phải có section id=home-search");
  assert.ok(homeCode.includes('id="home-destinations"'), "Phải có section id=home-destinations");
  assert.ok(homeCode.includes('id="home-camera"'), "Phải có section id=home-camera");
  assert.ok(homeCode.includes('id="home-guide"'), "Phải có section id=home-guide");
});

test("B-03: Trang chủ tích hợp InstallAppCard (PWA) một chạm, không dùng nút App Store/Google Play giả", async () => {
  const homeCode = await readFile(new URL("../app/page.jsx", import.meta.url), "utf8");
  assert.ok(homeCode.includes("<InstallAppCard"), "Trang chủ phải nhúng InstallAppCard");
  assert.ok(!homeCode.includes(" App Store"), "Không còn nút App Store giả trên trang chủ");
  assert.ok(!homeCode.includes("▶ Google Play"), "Không còn nút Google Play giả trên trang chủ");
});

test("B-04: Assistant và Navigation có nút Kết nối cuộc gọi Tư vấn viên WayEcho từ xa", async () => {
  const assistCode = await readFile(new URL("../app/assistant/page.jsx", import.meta.url), "utf8");
  assert.ok(assistCode.includes("Kết nối cuộc gọi Tư vấn viên WayEcho từ xa"), "Assistant phải có nút Tư vấn viên từ xa");
  assert.ok(!assistCode.includes("Temple_of_Literature"), "Assistant không được chứa ảnh Văn Miếu");

  const navCode = await readFile(new URL("../app/navigation/page.jsx", import.meta.url), "utf8");
  assert.ok(navCode.includes("Kết nối cuộc gọi Tư vấn viên WayEcho từ xa"), "Navigation phải có nút Tư vấn viên từ xa");
});

test("B-05: SOS kích hoạt GPS chính xác ±m và có API /api/support/sos", async () => {
  const sosCode = await readFile(new URL("../app/sos/page.jsx", import.meta.url), "utf8");
  assert.ok(sosCode.includes("sendSOSAlert"), "SOS page phải gọi sendSOSAlert");
  assert.ok(sosCode.includes("tel:115"), "SOS page phải có nút gọi trực tiếp 115");

  const sosLib = await readFile(new URL("../lib/sos.js", import.meta.url), "utf8");
  assert.ok(sosLib.includes("accuracy"), "lib/sos phải đọc accuracy của GPS");
  assert.ok(sosLib.includes("/api/support/sos"), "lib/sos phải gửi tới /api/support/sos");

  const sosApi = await readFile(new URL("../app/api/support/sos/route.js", import.meta.url), "utf8");
  assert.ok(sosApi.includes("sos_alerts"), "API SOS phải lưu vào bảng sos_alerts");
});

test("B-06: MobileNav hiển thị trên mọi màn hình < 1024px (lg:hidden)", async () => {
  const mobileNav = await readFile(new URL("../components/MobileNav.jsx", import.meta.url), "utf8");
  assert.ok(mobileNav.includes("lg:hidden"), "MobileNav phải dùng lg:hidden để tablet < 1024px vẫn thấy");
  assert.ok(!mobileNav.includes("md:hidden"), "MobileNav không còn dùng md:hidden");

  const header = await readFile(new URL("../components/Header.jsx", import.meta.url), "utf8");
  assert.ok(header.includes("lg:block"), "Header desktop nav chuyển ở breakpoint lg");

  const layout = await readFile(new URL("../app/layout.jsx", import.meta.url), "utf8");
  assert.ok(layout.includes("pb-20 lg:pb-0"), "Body layout phải có pb-20 lg:pb-0");
});
