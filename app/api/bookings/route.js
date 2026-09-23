import { NextResponse } from "next/server";
import { list, add, update } from "@/lib/store";
import { businessIdForItem } from "@/data/businesses";
import { readJson, badRequest, cleanText, intInRange, canTransitionBooking, MAX_GUESTS } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const business = searchParams.get("business");
  const all = await list("bookings");
  return NextResponse.json(business ? all.filter((b) => b.businessId === business) : all);
}

export async function POST(req) {
  const body = await readJson(req);
  if (!body) return badRequest("Dữ liệu gửi lên không phải JSON hợp lệ");
  if (!cleanText(body.itemId) || !cleanText(body.itemName)) {
    return badRequest("Thiếu thông tin đặt chỗ");
  }
  const guests = body.guests === undefined ? 1 : intInRange(body.guests, 1, MAX_GUESTS);
  if (guests === null) return badRequest(`Số khách phải từ 1 đến ${MAX_GUESTS}`);
  if (body.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(body.date))) return badRequest("Ngày không hợp lệ (định dạng YYYY-MM-DD)");
  const businessId = businessIdForItem(body.itemId);
  const record = await add("bookings", {
    itemId: cleanText(body.itemId, 100),
    itemName: cleanText(body.itemName, 200),
    businessId,
    date: body.date || null,
    time: cleanText(body.time, 20) || null,
    guests,
    assist: !!body.assist,
    price: cleanText(body.price, 50) || null,
    status: businessId ? "pending" : "demo", // Business phải xác nhận; item không có provider thật chỉ là demo
  });

  // Nếu khách cần hỗ trợ → tạo accessibility request cho doanh nghiệp xử lý
  if (body.assist && businessId) {
    await add("requests", {
      bookingId: record.id,
      businessId,
      itemName: body.itemName,
      content: Array.isArray(body.accessibilityRequests) && body.accessibilityRequests.length
        ? body.accessibilityRequests.map((x) => cleanText(x, 100)).filter(Boolean).join(", ")
        : (cleanText(body.requestNote) || "Có Accessibility Request"),
      status: "pending",
    });
    await add("notifications", {
      role: "business",
      businessId,
      type: "accessibility_request",
      message: `Yêu cầu hỗ trợ mới cho "${body.itemName}"`,
    });
  }
  if (businessId) {
    await add("notifications", {
      role: "business",
      businessId,
      type: "new_booking",
      message: `Đặt chỗ mới: ${body.itemName}${body.date ? ` (${body.date})` : ""}`,
    });
  }

  return NextResponse.json(record, { status: 201 });
}


export async function PATCH(req) {
  const body = await readJson(req);
  if (!body?.id || !["confirmed", "rejected", "cancelled"].includes(body?.status)) {
    return badRequest("Thiếu id hoặc trạng thái không hợp lệ");
  }
  const current = (await list("bookings")).find((b) => b.id === body.id);
  if (!current) return NextResponse.json({ error: "Không tìm thấy booking" }, { status: 404 });
  if (!canTransitionBooking(current.status, body.status)) {
    return NextResponse.json({ error: `Không thể chuyển booking từ "${current.status}" sang "${body.status}"` }, { status: 409 });
  }
  const updated = await update("bookings", body.id, { status: body.status });
  if (!updated) return NextResponse.json({ error: "Không tìm thấy booking" }, { status: 404 });
  await add("notifications", {
    role: "traveler",
    type: "booking_status",
    message: `Booking "${updated.itemName}" đã được ${body.status === "confirmed" ? "xác nhận" : body.status === "rejected" ? "từ chối" : "hủy"}.`,
  });
  return NextResponse.json(updated);
}
