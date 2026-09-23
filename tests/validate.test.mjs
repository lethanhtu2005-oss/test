import test from "node:test";
import assert from "node:assert/strict";
import { readJson, cleanText, intInRange, rating, canTransitionBooking } from "../lib/validate.js";

const jsonReq = (body) => new Request("http://x", { method: "POST", body });

test("readJson trả null khi body hỏng hoặc không phải object", async () => {
  assert.equal(await readJson(jsonReq("not json")), null);
  assert.equal(await readJson(jsonReq("[1,2]")), null);
  assert.equal(await readJson(jsonReq("null")), null);
  assert.deepEqual(await readJson(jsonReq('{"a":1}')), { a: 1 });
});

test("cleanText cắt khoảng trắng và giới hạn độ dài", () => {
  assert.equal(cleanText("  Hồ Gươm  "), "Hồ Gươm");
  assert.equal(cleanText(undefined), "");
  assert.equal(cleanText("abcdef", 3), "abc");
});

test("intInRange chỉ nhận số nguyên trong khoảng", () => {
  assert.equal(intInRange(3, 1, 20), 3);
  assert.equal(intInRange("5", 1, 20), 5);
  assert.equal(intInRange(-50, 1, 20), null);
  assert.equal(intInRange(1.5, 1, 20), null);
  assert.equal(intInRange("abc", 1, 20), null);
});

test("rating: 0/trống là không đánh giá, 1–5 hợp lệ, còn lại bị từ chối", () => {
  assert.equal(rating(undefined), 0);
  assert.equal(rating(0), 0);
  assert.equal(rating(4), 4);
  assert.equal(rating(999), null);
  assert.equal(rating(-1), null);
});

test("booking đã hủy/từ chối không được mở lại", () => {
  assert.equal(canTransitionBooking("pending", "confirmed"), true);
  assert.equal(canTransitionBooking("confirmed", "cancelled"), true);
  assert.equal(canTransitionBooking("cancelled", "confirmed"), false);
  assert.equal(canTransitionBooking("rejected", "confirmed"), false);
  assert.equal(canTransitionBooking("demo", "confirmed"), false);
});
