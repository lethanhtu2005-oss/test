import { list, transaction, insert } from "@/lib/store";
import { checkOrigin, errorResponse, json, secured } from "@/lib/auth";
import { readJson } from "@/lib/validate";

export const dynamic = "force-dynamic";

// GET dành cho Admin hoặc Guide/TNV kiểm tra tín hiệu SOS thực địa trong Phố Cổ
export const GET = secured(
  async () => {
    const alerts = await list("sos_alerts");
    return json(alerts.slice(-50).reverse());
  },
  ["admin", "guide"]
);

// POST công khai: kích hoạt SOS khẩn cấp, KHÔNG ĐƯỢC RATE LIMIT HOẶC BLOCK (Section 13)
export async function POST(req) {
  try {
    checkOrigin(req);
    const body = await readJson(req).catch(() => ({}));
    const lat = typeof body.lat === "number" ? body.lat : null;
    const lng = typeof body.lng === "number" ? body.lng : null;
    const accuracy = typeof body.accuracy === "number" ? Math.round(body.accuracy) : null;
    const contact = typeof body.contact === "string" ? body.contact.slice(0, 100) : "";
    const message = typeof body.message === "string" ? body.message.slice(0, 300) : "Tín hiệu SOS từ người dùng WayEcho";

    const record = await transaction((db) => {
      return insert(db, "sos_alerts", {
        lat,
        lng,
        accuracy,
        contact,
        message,
        status: "active",
        area: "Phố Cổ Hoàn Kiếm, Hà Nội",
        createdAt: new Date().toISOString(),
      });
    });

    return json(
      {
        ok: true,
        id: record.id,
        status: "active",
        message: "Hệ thống hỗ trợ khẩn cấp WayEcho đã ghi nhận vị trí của bạn.",
        callUrl: "tel:115",
      },
      201
    );
  } catch (e) {
    return errorResponse(e);
  }
}
