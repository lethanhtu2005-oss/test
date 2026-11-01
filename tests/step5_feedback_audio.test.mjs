import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { playChirp, playDingDong, playWarningBeep, vibrate, feedback } from "../lib/feedback.js";

test("F-01: lib/feedback.js định nghĩa các âm thanh Web Audio và không throw lỗi ở môi trường không có AudioContext", () => {
  assert.equal(typeof playChirp, "function");
  assert.equal(typeof playDingDong, "function");
  assert.equal(typeof playWarningBeep, "function");
  assert.equal(typeof vibrate, "function");
  assert.equal(typeof feedback.action, "function");
  assert.equal(typeof feedback.success, "function");

  // An toàn khi chạy server-side/Node
  assert.doesNotThrow(() => playChirp());
  assert.doesNotThrow(() => playDingDong());
  assert.doesNotThrow(() => playWarningBeep());
  assert.doesNotThrow(() => vibrate([50]));
  assert.doesNotThrow(() => feedback.action());
  assert.doesNotThrow(() => feedback.success());
});

test("F-02: Vibrate kiểm tra có điều kiện an toàn cho iOS Safari", async () => {
  const code = await readFile(new URL("../lib/feedback.js", import.meta.url), "utf8");
  assert.ok(code.includes("navigator.vibrate === \"function\""), "Phải kiểm tra typeof navigator.vibrate === 'function'");
});

test("F-03: A11yProvider và Profile có tùy chọn bật/tắt âm thanh và rung", async () => {
  const providerCode = await readFile(new URL("../components/A11yProvider.jsx", import.meta.url), "utf8");
  assert.ok(providerCode.includes("audioFeedback"), "Provider phải có state audioFeedback");
  assert.ok(providerCode.includes("hapticFeedback"), "Provider phải có state hapticFeedback");
  assert.ok(providerCode.includes("feedback"), "Provider phải export feedback");

  const profileCode = await readFile(new URL("../app/profile/page.jsx", import.meta.url), "utf8");
  assert.ok(profileCode.includes("Âm thanh phản hồi"), "Profile phải có switch Âm thanh phản hồi");
  assert.ok(profileCode.includes("Rung phản hồi"), "Profile phải có switch Rung phản hồi");
});

test("F-04: VoiceBar và SearchPage tích hợp âm báo chirp/success và ngữ cảnh Phố Cổ", async () => {
  const vbCode = await readFile(new URL("../components/VoiceBar.jsx", import.meta.url), "utf8");
  assert.ok(vbCode.includes("Phố Cổ Hà Nội"), "VoiceBar phải có tiêu đề Phố Cổ Hà Nội");
  assert.ok(vbCode.includes("feedback?.chirp()"), "VoiceBar phải phát chirp khi bấm mic");
  assert.ok(vbCode.includes("feedback?.success()"), "VoiceBar phải phát success khi có kết quả");

  const searchCode = await readFile(new URL("../app/search/page.jsx", import.meta.url), "utf8");
  assert.ok(searchCode.includes("feedback?.chirp()"), "SearchPage phải phát chirp khi mở mic");
  assert.ok(searchCode.includes("feedback?.success()"), "SearchPage phải phát success khi ra kết quả");
  assert.ok(!searchCode.includes("Văn Miếu"), "SearchPage không còn chữ Văn Miếu trong placeholder");
});
