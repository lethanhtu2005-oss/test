import { list, transaction, insert } from "@/lib/store";
import { checkOrigin, errorResponse, fail, json, secured } from "@/lib/auth";
import { readJson } from "@/lib/validate";

export const dynamic = "force-dynamic";

export const GET = secured(async () => json((await list("sos_alerts")).slice(-50).reverse()), ["admin", "guide"]);

// Lưu tín hiệu SOS demo; không chuyển cho lực lượng cứu hộ hay tổng đài.
export async function POST(req) {
  try {
    checkOrigin(req);
    const body = await readJson(req);
    if (!body || typeof body.lat !== "number" || typeof body.lng !== "number" ||
        !Number.isFinite(body.lat) || !Number.isFinite(body.lng) ||
        body.lat < -90 || body.lat > 90 || body.lng < -180 || body.lng > 180) fail(400, "Tọa độ vị trí không hợp lệ.");
    const accuracy = Number.isFinite(body.accuracy) ? Math.max(0, Math.round(body.accuracy)) : null;
    const contact = body.shareContact === true && typeof body.contact === "string" ? body.contact.slice(0, 100) : "";
    const record = await transaction((db) => insert(db, "sos_alerts", {
      lat: body.lat, lng: body.lng, accuracy, contact,
      message: "Tín hiệu SOS DEMO do người dùng chủ động gửi",
      status: "demo_recorded", isDemo: true, createdAt: new Date().toISOString(),
    }));
    return json({ ok: true, id: record.id, status: "demo_recorded", isDemo: true,
      message: "Đã lưu tín hiệu trong hệ thống demo. Không có nhân viên cứu hộ nhận tín hiệu này." }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
