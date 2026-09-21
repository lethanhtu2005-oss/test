import { NextResponse } from "next/server";
import { list, add, update } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const business = searchParams.get("business");
  const all = await list("requests");
  return NextResponse.json(business ? all.filter((r) => r.businessId === business) : all);
}

// Doanh nghiệp accept/reject một accessibility request
export async function PATCH(req) {
  const body = await req.json();
  if (!body?.id || !body?.status) {
    return NextResponse.json({ error: "Thiếu id hoặc status" }, { status: 400 });
  }
  const updated = await update("requests", body.id, { status: body.status, note: body.note || "" });
  if (updated) {
    await add("notifications", {
      role: "traveler",
      type: "request_result",
      message: `Yêu cầu hỗ trợ cho "${updated.itemName}" đã được ${body.status === "accepted" ? "chấp nhận" : "từ chối"}.`,
    });
  }
  return NextResponse.json(updated || { error: "Không tìm thấy" }, { status: updated ? 200 : 404 });
}
