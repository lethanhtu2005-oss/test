import { NextResponse } from "next/server";
import { list, add, update } from "@/lib/store";
import { businessIdForItem } from "@/data/businesses";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const business = searchParams.get("business");
  const all = await list("bookings");
  return NextResponse.json(business ? all.filter((b) => b.businessId === business) : all);
}

export async function POST(req) {
  const body = await req.json();
  if (!body?.itemId || !body?.itemName) {
    return NextResponse.json({ error: "Thiếu thông tin đặt chỗ" }, { status: 400 });
  }
  const businessId = businessIdForItem(body.itemId);
  const record = await add("bookings", {
    itemId: body.itemId,
    itemName: body.itemName,
    businessId,
    date: body.date || null,
    time: body.time || null,
    guests: body.guests || 1,
    assist: !!body.assist,
    price: body.price || null,
    status: businessId ? "pending" : "demo", // Business phải xác nhận; item không có provider thật chỉ là demo
  });

  // Nếu khách cần hỗ trợ → tạo accessibility request cho doanh nghiệp xử lý
  if (body.assist && businessId) {
    await add("requests", {
      bookingId: record.id,
      businessId,
      itemName: body.itemName,
      content: Array.isArray(body.accessibilityRequests) && body.accessibilityRequests.length
        ? body.accessibilityRequests.join(", ")
        : (body.requestNote || "Có Accessibility Request"),
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
  const body = await req.json();
  if (!body?.id || !["confirmed", "rejected", "cancelled"].includes(body?.status)) {
    return NextResponse.json({ error: "Thiếu id hoặc trạng thái không hợp lệ" }, { status: 400 });
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
