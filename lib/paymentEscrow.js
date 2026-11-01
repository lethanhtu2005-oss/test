// Mô hình máy trạng thái ký quỹ thanh toán (Payment Escrow State Machine) cho WayEcho
// Phục vụ đặt lịch HDV/TNV Phố Cổ có bảo chứng, bảo vệ Traveler và chi trả cho Guide.
// TUÂN THỦ SECTION 13: Mọi giao dịch đều là DEMO mô phỏng, KHÔNG THỰC HIỆN GIAO DỊCH TÀI CHÍNH THỰC TẾ.

export const ESCROW_STATES = {
  PENDING: "pending",
  HELD: "held_in_escrow",
  RELEASED: "released_to_guide",
  REFUNDED: "refunded_to_traveler",
  DISPUTED: "disputed",
};

const VALID_TRANSITIONS = {
  [ESCROW_STATES.PENDING]: [ESCROW_STATES.HELD, ESCROW_STATES.REFUNDED],
  [ESCROW_STATES.HELD]: [ESCROW_STATES.RELEASED, ESCROW_STATES.REFUNDED, ESCROW_STATES.DISPUTED],
  [ESCROW_STATES.DISPUTED]: [ESCROW_STATES.RELEASED, ESCROW_STATES.REFUNDED],
  [ESCROW_STATES.RELEASED]: [], // Trạng thái cuối, không giải ngân lần 2
  [ESCROW_STATES.REFUNDED]: [], // Trạng thái cuối, không hoàn lần 2
};

export function canTransitionEscrow(current, next) {
  if (!current || !next) return false;
  const allowed = VALID_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

/**
 * Tính toán phân bổ tiền ký quỹ giữa Ví HDV và phí nền tảng WayEcho
 * Mặc định: Phí vận hành nền tảng tiếp cận 10%, Hướng dẫn viên nhận 90%
 */
export function calculateEscrowSplit(amountVnd, platformFeePercent = 10) {
  const safeAmount = Math.max(0, Math.round(Number(amountVnd) || 0));
  const safePercent = Math.max(0, Math.min(100, Number(platformFeePercent) || 10));

  const platformFee = Math.round((safeAmount * safePercent) / 100);
  const guidePayout = safeAmount - platformFee;

  return {
    totalAmount: safeAmount,
    platformFeePercent: safePercent,
    platformFee,
    guidePayout,
    currency: "VND",
    isDemo: true,
  };
}

/**
 * Tạo bản ghi ký quỹ thanh toán mới có bảo vệ Idempotency
 */
export function buildEscrowRecord({
  bookingId,
  travelerId,
  guideId,
  amountVnd,
  idempotencyKey,
  status = ESCROW_STATES.PENDING,
}) {
  if (!bookingId) throw new Error("Thiếu bookingId cho giao dịch ký quỹ.");
  if (!idempotencyKey) throw new Error("Bắt buộc phải có Idempotency Key để chống trừ tiền/giải ngân trùng lặp.");

  const split = calculateEscrowSplit(amountVnd);

  return {
    id: `escrow_${crypto.randomUUID()}`,
    idempotencyKey,
    bookingId,
    travelerId: travelerId || "guest",
    guideId: guideId || null,
    status,
    split,
    isDemo: true,
    notice: "Giao dịch mô phỏng trong môi trường DEMO. Không có tiền thật được luân chuyển.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
