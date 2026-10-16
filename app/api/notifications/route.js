import { NextResponse } from "next/server";
import { list, add } from "@/lib/store";
import { readJson, badRequest, cleanText, NOTIFICATION_ROLES } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const business = searchParams.get("business");
  let all = await list("notifications");
  if (role) all = all.filter((n) => n.role === role);
  if (business) all = all.filter((n) => !n.businessId || n.businessId === business);
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await readJson(req);
  if (!body) return badRequest("Dữ liệu gửi lên không phải JSON hợp lệ");
  const role = body.role || "traveler";
  if (!NOTIFICATION_ROLES.includes(role)) return badRequest("Vai trò không hợp lệ");
  const message = cleanText(body.message);
  if (!message) return badRequest("Thiếu nội dung thông báo");
  const record = await add("notifications", {
    role,
    businessId: cleanText(body.businessId, 50) || null,
    type: cleanText(body.type, 50) || "info",
    message,
  });
  return NextResponse.json(record, { status: 201 });
}
