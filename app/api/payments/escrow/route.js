import { list, transaction } from "@/lib/store";
import { checkOrigin, errorResponse, fail, json, secured } from "@/lib/auth";
import { readJson, cleanText } from "@/lib/validate";
import { ESCROW_STATES, canTransitionEscrow, buildEscrowRecord } from "@/lib/paymentEscrow";

export const dynamic = "force-dynamic";

export const GET = secured(async (_req, user) => {
  const all = await list("escrow_transactions");
  if (user.role === "admin") return json(all);
  if (user.role === "guide") return json(all.filter((x) => x.guideId === user.id || x.guideId === user.businessId));
  return json(all.filter((x) => x.travelerId === user.id));
}, ["traveler", "guide", "admin"], { guest: true });

// Mô phỏng trạng thái; chưa kết nối cổng thanh toán và không luân chuyển tiền.
export const POST = secured(async (req, user) => {
  try {
    checkOrigin(req);
    const body = await readJson(req);
    if (!body) fail(400, "Dữ liệu yêu cầu không hợp lệ.");
    const action = cleanText(body.action || "hold");
    const idempotencyKey = cleanText(body.idempotencyKey, 128);
    if (!idempotencyKey) fail(400, "Bắt buộc phải có Idempotency Key.");

    const result = await transaction((db) => {
      const existing = db.escrow_transactions.find((x) => x.idempotencyKey === idempotencyKey &&
        (user.role === "admin" || x.travelerId === user.id || (user.role === "guide" && (x.guideId === user.id || x.guideId === user.businessId))));
      if (existing) return { ...existing, duplicateRequest: true };

      if (action === "hold") {
        if (user.role !== "traveler") fail(403, "Chỉ người đi du lịch có thể tạo giao dịch demo.");
        const bookingId = cleanText(body.bookingId, 100);
        const amountVnd = body.amountVnd === undefined ? 200000 : Number(body.amountVnd);
        if (!bookingId) fail(400, "Thiếu bookingId.");
        if (!Number.isSafeInteger(amountVnd) || amountVnd < 1000 || amountVnd > 50000000) fail(400, "Số tiền demo phải từ 1.000 đến 50.000.000 VND.");
        const record = buildEscrowRecord({ bookingId, travelerId: user.id, guideId: cleanText(body.guideId, 100) || null, amountVnd, idempotencyKey, status: ESCROW_STATES.HELD });
        db.escrow_transactions.push(record);
        return record;
      }

      const escrowId = cleanText(body.escrowId, 100);
      const target = db.escrow_transactions.find((x) => x.id === escrowId);
      if (!target) fail(404, "Không tìm thấy giao dịch demo.");
      if (user.role === "traveler" && target.travelerId !== user.id) fail(403, "Bạn không có quyền thay đổi giao dịch này.");
      if (user.role === "guide" && target.guideId !== user.id && target.guideId !== user.businessId) fail(403, "Bạn không được phân công giao dịch này.");
      let targetState;
      if (action === "release") targetState = ESCROW_STATES.RELEASED;
      else if (action === "refund") targetState = ESCROW_STATES.REFUNDED;
      else if (action === "dispute") targetState = ESCROW_STATES.DISPUTED;
      else fail(400, "Hành động không hợp lệ.");
      if ((user.role === "traveler" && targetState === ESCROW_STATES.RELEASED) || (user.role === "guide" && targetState !== ESCROW_STATES.RELEASED)) fail(403, "Vai trò này không thể thực hiện chuyển trạng thái đó.");
      if (!canTransitionEscrow(target.status, targetState)) fail(409, "Không thể chuyển trạng thái giao dịch demo.");
      target.status = targetState;
      target.updatedAt = new Date().toISOString();
      return target;
    });
    return json(result, result.duplicateRequest ? 200 : 201);
  } catch (e) {
    return errorResponse(e);
  }
}, ["traveler", "guide", "admin"], { guest: true });
