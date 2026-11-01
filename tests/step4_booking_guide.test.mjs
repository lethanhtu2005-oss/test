import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("E-01: Điểm hẹn tập kết cố định tại Phố Cổ (28 Hàng Buồm, Cảm Tử, Mã Mây...)", async () => {
  const bookingCode = await readFile(new URL("../app/booking/page.jsx", import.meta.url), "utf8");
  assert.ok(bookingCode.includes("28 Hàng Buồm"), "Phải có điểm hẹn 28 Hàng Buồm");
  assert.ok(bookingCode.includes("Tượng đài Cảm Tử"), "Phải có điểm hẹn Tượng đài Cảm Tử");
  assert.ok(bookingCode.includes("Nhà cổ 87 Mã Mây"), "Phải có điểm hẹn Nhà cổ Mã Mây");
  assert.ok(bookingCode.includes("Chợ Đồng Xuân"), "Phải có điểm hẹn Chợ Đồng Xuân");
});

test("E-02: Ghi chú giọng nói (Voice Note) được hỗ trợ", async () => {
  const bookingCode = await readFile(new URL("../app/booking/page.jsx", import.meta.url), "utf8");
  assert.ok(bookingCode.includes("useSpeechRecognition"), "Booking page phải dùng useSpeechRecognition");
  assert.ok(bookingCode.includes("voiceNote"), "Booking page phải có state voiceNote");

  const apiCode = await readFile(new URL("../app/api/bookings/route.js", import.meta.url), "utf8");
  assert.ok(apiCode.includes("voiceNote"), "API phải lưu voiceNote");
  assert.ok(apiCode.includes("meetupPoint"), "API phải lưu meetupPoint");
});

test("E-03: Trạng thái kết nối HDV/TNV dưới 10 phút rõ ràng", async () => {
  const bookingCode = await readFile(new URL("../app/booking/page.jsx", import.meta.url), "utf8");
  assert.ok(bookingCode.includes("dưới 10 phút"), "Thông báo hoàn thành phải có mục tiêu dưới 10 phút");

  const myBookingCode = await readFile(new URL("../app/my-booking/page.jsx", import.meta.url), "utf8");
  assert.ok(myBookingCode.includes("b.meetupPoint"), "Trang my-booking phải hiển thị điểm hẹn");
  assert.ok(myBookingCode.includes("b.voiceNote"), "Trang my-booking phải hiển thị ghi chú giọng nói");
});
