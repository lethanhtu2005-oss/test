import { list, transaction, insert } from "@/lib/store";
import { checkOrigin, errorResponse, fail, json, secured } from "@/lib/auth";
import { readJson, cleanText } from "@/lib/validate";
import {
  ESCROW_STATES,
  canTransitionEscrow,
  buildEscrowRecord,
} from "@/lib/paymentEscrow";

export const dynamic = "force-dynamic";

// GET: xem lịch sử ký quỹ & số dư ví DEMO
export const GET = secured(
  async (req, user) => {
    const all = await list("escrow_transactions");
    if (user.role === "admin") return json(all);
    if (user.role === "guide") return json(all.filter((x) => x.guideId === user.id || x.guideId === user.businessId));
    return json(all.filter((x) => x.travelerId === user.id));
  },
  ["traveler", "guide", "admin"],
  { guest: true }
);

// POST: tạo mới hoặc chuyển đổi trạng thái ký quỹ thanh toán DEMO
export async function POST(req) {
  try {
    checkOrigin(req);
    const body = await readJson(req);
    if (!body) fail(400, "Dữ liệu yêu cầu không hợp lệ.");

    const action = cleanText(body.action || "hold");
    const idempotencyKey = cleanText(body.idempotencyKey, 128);
    if (!idempotencyKey) fail(400, "Bắt buộc phải có Idempotency Key chống giao dịch trùng lặp.");

    const result = await transaction((db) => {
      // 1. Kiểm tra Idempotency Key đã tồn tại chưa
      const existing = db.escrow_transactions.find((x) => x.idempotencyKey === idempotencyKey);
      if (existing) {
        return { ...existing, duplicateRequest: true };
      }

      if (action === "hold") {
        const bookingId = cleanText(body.bookingId, 100);
        const amountVnd = Number(body.amountVnd) || 200000;
        const travelerId = cleanText(body.travelerId, 100) || "guest";
        const guideId = cleanText(body.guideId, 100) || null;

        const record = buildEscrowRecord({
          bookingId,
          travelerId,
          guideId,
          amountVnd,
          idempotencyKey,
          status: ESCROW_STATES.HELD,
        });

        db.escrow_transactions.push(record);
        return record;
      }

      // Xử lý chuyển trạng thái cho giao dịch hiện có (release / refund / dispute)
      const escrowId = cleanText(body.escrowId, 100);
      const targetRecord = db.escrow_transactions.find((x) => x.id === escrowId);
      if (!targetRecord) fail(404, "Không tìm thấy giao dịch ký quỹ.");

      let targetState = null;
      if (action === "release") targetState = ESCROW_STATES.RELEASED;
      else if (action === "refund") targetState = ESCROW_STATES.REFUNDED;
      else if (action === "dispute") targetState = ESCROW_STATES.DISPUTED;
      else fail(400, `Hành động ${action} không hợp lệ.`);

      if (!canTransitionEscrow(targetRecord.status, targetState)) {
        fail(409, `Không thể chuyển trạng thái từ ${targetRecord.status} sang ${targetState}.`);
      }

      targetRecord.status = targetState;
      targetRecord.updatedAt = new Date().toISOString();
      return targetRecord;
    });

    return json(result, result.duplicateRequest ? 200 : 201);
  } catch (e) {
    return errorResponse(e);
  }
}
