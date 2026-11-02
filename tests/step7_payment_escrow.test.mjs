import test from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
register(new URL("./helpers/alias-loader.mjs", import.meta.url), { data: { root } });

const {
  ESCROW_STATES,
  canTransitionEscrow,
  calculateEscrowSplit,
  buildEscrowRecord,
} = await import("../lib/paymentEscrow.js");

const { POST: escrowRoute } = await import("../app/api/payments/escrow/route.js");

function mockRequest(body) {
  return new Request("http://localhost:3000/api/payments/escrow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
    },
    body: JSON.stringify(body),
  });
}

test("G-01: Máy trạng thái Escrow kiểm soát chuyển đổi hợp lệ và chặn double payout", () => {
  assert.equal(canTransitionEscrow(ESCROW_STATES.PENDING, ESCROW_STATES.HELD), true);
  assert.equal(canTransitionEscrow(ESCROW_STATES.HELD, ESCROW_STATES.RELEASED), true);
  assert.equal(canTransitionEscrow(ESCROW_STATES.HELD, ESCROW_STATES.REFUNDED), true);
  assert.equal(canTransitionEscrow(ESCROW_STATES.HELD, ESCROW_STATES.DISPUTED), true);
  assert.equal(canTransitionEscrow(ESCROW_STATES.DISPUTED, ESCROW_STATES.RELEASED), true);

  // Không cho phép giải ngân lần 2 từ trạng thái đã giải ngân
  assert.equal(canTransitionEscrow(ESCROW_STATES.RELEASED, ESCROW_STATES.RELEASED), false);
  assert.equal(canTransitionEscrow(ESCROW_STATES.RELEASED, ESCROW_STATES.REFUNDED), false);
  assert.equal(canTransitionEscrow(ESCROW_STATES.REFUNDED, ESCROW_STATES.RELEASED), false);
});

test("G-02: calculateEscrowSplit tính chính xác hoa hồng sàn 10% và 90% ví HDV", () => {
  const split = calculateEscrowSplit(200000, 10);
  assert.equal(split.totalAmount, 200000);
  assert.equal(split.platformFee, 20000);
  assert.equal(split.guidePayout, 180000);
  assert.equal(split.isDemo, true);
});

test("G-03: buildEscrowRecord bắt buộc có Idempotency Key và nhãn DEMO", () => {
  assert.throws(() => buildEscrowRecord({ bookingId: "bk_123" }), /Idempotency Key/);

  const record = buildEscrowRecord({
    bookingId: "bk_123",
    amountVnd: 300000,
    idempotencyKey: "idem_key_abc_123",
  });
  assert.equal(record.isDemo, true);
  assert.equal(record.split.guidePayout, 270000);
  assert.ok(record.notice.includes("DEMO"));
});

test("G-04: API Escrow bảo vệ chống double charge/release bằng Idempotency Key", async () => {
  const key = `idem_${Date.now()}_test`;
  const body = {
    action: "hold",
    bookingId: "bk_demo_456",
    amountVnd: 200000,
    idempotencyKey: key,
  };

  const res1 = await escrowRoute(mockRequest(body));
  assert.equal(res1.status, 201);
  const data1 = await res1.json();
  assert.equal(data1.status, "held_in_escrow");

  // Gửi lại cùng idempotency key -> không tạo giao dịch mới
  const res2 = await escrowRoute(mockRequest(body));
  assert.equal(res2.status, 200);
  const data2 = await res2.json();
  assert.equal(data2.id, data1.id);
  assert.equal(data2.duplicateRequest, true);
});
