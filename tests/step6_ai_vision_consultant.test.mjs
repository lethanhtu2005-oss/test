import test from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
register(new URL("./helpers/alias-loader.mjs", import.meta.url), { data: { root } });

const { POST: describeScene } = await import("../app/api/ai/describe-scene/route.js");
const { POST: createConsultantCall } = await import("../app/api/support/consultant-call/route.js");

function mockRequest(body) {
  return new Request("http://localhost:3000/api/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
    },
    body: JSON.stringify(body),
  });
}

test("D-02: /api/ai/describe-scene từ chối 400 khi chưa có sự đồng ý của người dùng (X-11)", async () => {
  const req = mockRequest({ image: "test.jpg", consent: false });
  const res = await describeScene(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error.includes("đồng ý"), "Phải yêu cầu sự đồng ý rõ ràng trước khi gửi ảnh");
});

test("D-02: /api/ai/describe-scene trả về mô tả cảnh quan & OCR tĩnh, không chứa chỉ dẫn bước chân vật lý (Section 13)", async () => {
  const req = mockRequest({ image: "test.jpg", consent: true, prompt: "describe" });
  const res = await describeScene(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.ok(data.description, "Phải có mô tả cảnh quan");
  assert.ok(data.confidence, "Phải có nhãn độ tin cậy");
  assert.ok(data.safetyNotice, "Phải có cảnh báo an toàn");
  assert.ok(data.consultantCallUrl, "Phải có link gọi tư vấn viên");

  // Kiểm tra ranh giới an toàn: KHÔNG ĐƯỢC chứa chỉ dẫn di chuyển vật lý
  const fullText = (data.description + " " + data.safetyNotice).toLowerCase();
  assert.ok(!fullText.includes("bước sang"), "Không được chỉ dẫn bước sang");
  assert.ok(!fullText.includes("rẽ trái tại"), "Không được chỉ dẫn rẽ trái tại");
  assert.ok(!fullText.includes("lối đi hoàn toàn an toàn"), "Không được cam kết an toàn");
});

test("B-04: /api/support/consultant-call ghi nhận yêu cầu tư vấn viên từ xa", async () => {
  const req = mockRequest({ context: "assistant", userNote: "Cần trợ giúp mô tả bảng hiệu quán ăn" });
  const res = await createConsultantCall(req);
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.status, "queued");
  assert.ok(data.hotline, "Phải có hotline tư vấn");
});
