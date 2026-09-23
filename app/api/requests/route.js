import { NextResponse } from "next/server";
import { list, add, update } from "@/lib/store";
import { readJson, badRequest, cleanText, REQUEST_STATUSES } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const business = searchParams.get("business");
  const all = await list("requests");
  return NextResponse.json(business ? all.filter((r) => r.businessId === business) : all);
}

// Doanh nghiệp accept/reject một accessibility request
export async function PATCH(req) {
  const body = await readJson(req);
  if (!body?.id || !REQUEST_STATUSES.includes(body?.status)) {
    return badRequest("Thiếu id hoặc status không hợp lệ (accepted / rejected)");
  }
  const updated = await update("requests", body.id, { status: body.status, note: cleanText(body.note) });
  if (updated) {
    await add("notifications", {
      role: "traveler",
      type: "request_result",
      message: `Yêu cầu hỗ trợ cho "${updated.itemName}" đã được ${body.status === "accepted" ? "chấp nhận" : "từ chối"}.`,
    });
  }
  return NextResponse.json(updated || { error: "Không tìm thấy" }, { status: updated ? 200 : 404 });
}
