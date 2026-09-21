import { NextResponse } from "next/server";
import { list, add } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const place = searchParams.get("place");
  const all = await list("reviews");
  return NextResponse.json(place ? all.filter((r) => r.itemId === place) : all);
}

export async function POST(req) {
  const body = await req.json();
  if (!body?.itemId) return NextResponse.json({ error: "Thiếu itemId" }, { status: 400 });
  const record = await add("reviews", {
    itemId: body.itemId,
    itemName: body.itemName || "",
    author: body.author || "Khách ẩn danh",
    comment: body.comment || "",
    // Đánh giá tiếp cận theo tiêu chí (1–5)
    ratings: {
      entrance: Number(body.ratings?.entrance) || 0,
      navigation: Number(body.ratings?.navigation) || 0,
      staff: Number(body.ratings?.staff) || 0,
      toilet: Number(body.ratings?.toilet) || 0,
      info: Number(body.ratings?.info) || 0,
      audio: Number(body.ratings?.audio) || 0,
    },
  });
  return NextResponse.json(record, { status: 201 });
}
