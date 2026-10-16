import { NextResponse } from "next/server";
import { list, add, remove } from "@/lib/store";
import { readJson, badRequest, cleanText } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await list("trip"));
}

export async function POST(req) {
  const body = await readJson(req);
  if (!body || !cleanText(body.refId)) return badRequest("Thiếu refId");
  const existing = (await list("trip")).find((x) => x.refId === body.refId);
  if (existing) return NextResponse.json(existing);
  const record = await add("trip", {
    refId: cleanText(body.refId, 100),
    name: cleanText(body.name, 300),
    cat: cleanText(body.cat, 300),
    image: cleanText(body.image, 300),
    area: cleanText(body.area, 300),
  });
  return NextResponse.json(record, { status: 201 });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("refId") || searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
  return NextResponse.json(await remove("trip", id));
}
