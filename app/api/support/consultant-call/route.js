import { list, transaction, insert } from "@/lib/store";
import { checkOrigin, errorResponse, json, secured } from "@/lib/auth";
import { readJson, cleanText } from "@/lib/validate";

export const dynamic = "force-dynamic";

// GET dành cho Admin / Guide trực ban tiếp nhận cuộc gọi tư vấn
export const GET = secured(
  async () => {
    const calls = await list("support_calls");
    return json(calls.slice(-50).reverse());
  },
  ["admin", "guide"]
);

// POST công khai: Traveler yêu cầu kết nối cuộc gọi tư vấn viên từ xa (B-04)
export async function POST(req) {
  try {
    checkOrigin(req);
    const body = await readJson(req);
    if (body?.consent !== true) return json({ ok: false, message: "Cần đồng ý trước khi lưu yêu cầu hỗ trợ demo." }, 400);
    const context = typeof body.context === "string" ? cleanText(body.context, 100) : "general";
    const userNote = typeof body.userNote === "string" ? cleanText(body.userNote, 300) : "";
    const contact = typeof body.contact === "string" ? cleanText(body.contact, 100) : "";

    const record = await transaction((db) => {
      return insert(db, "support_calls", {
        context,
        userNote,
        contact,
        area: "Phố Cổ Hoàn Kiếm, Hà Nội",
        status: "demo_saved",
        createdAt: new Date().toISOString(),
      });
    });

    return json(
      {
        ok: true,
        id: record.id,
        status: "queued",
        estimatedWaitSeconds: null,
        isDemo: true,
        message: "Yêu cầu đã được lưu trong bản demo; hiện chưa có tư vấn viên trực hoặc tổng đài WayEcho.",
      },
      201
    );
  } catch (e) {
    return errorResponse(e);
  }
}
